import { describe, beforeAll, afterAll, test as vitestTest } from "vitest";
import { UniBrowser } from "../browser/browser.js";
import type { BrowserName } from "../browser/types.js";
import type { UniPage } from "../browser/page.js";

export const ALL_BROWSERS: BrowserName[] = ["chromium", "firefox", "webkit"];

export interface CrossBrowserContext {
  page: UniPage;
  browser: UniBrowser;
}

type TestFn = (ctx: CrossBrowserContext) => Promise<void> | void;

interface CrossBrowserTest {
  (name: string, fn: TestFn): void;
}

export interface CrossBrowserSuiteOptions {
  browsers?: BrowserName[];
  sharedBrowser?: boolean;
  parallel?: boolean;
}

// --- Browser Pool ---
// Stores browsers on globalThis to persist across Vitest test files.
// Eliminates redundant browser launches (~2-5s each).
//
// Memory safety:
// - releaseBrowser() closes all orphaned contexts between test files
// - acquireBrowser() evicts disconnected browsers from the pool
// - Max contexts per browser capped at 50; excess are force-closed
// - Process exit handlers ensure cleanup

const POOL_KEY = Symbol.for("unibrowser.pool");
const MAX_CONTEXTS_PER_BROWSER = 50;

function getPool(): Map<BrowserName, UniBrowser> {
  const g = globalThis as Record<symbol, Map<BrowserName, UniBrowser>>;
  if (!g[POOL_KEY]) {
    g[POOL_KEY] = new Map<BrowserName, UniBrowser>();
    registerCleanup();
  }
  return g[POOL_KEY];
}

let cleanupRegistered = false;

function registerCleanup(): void {
  if (cleanupRegistered) return;
  cleanupRegistered = true;
  const cleanup = () => { drainPoolSync(); };
  process.on("beforeExit", cleanup);
  process.on("SIGINT", () => { drainPoolSync(); process.exit(130); });
  process.on("SIGTERM", () => { drainPoolSync(); process.exit(143); });
}

async function acquireBrowser(name: BrowserName): Promise<UniBrowser> {
  const pool = getPool();
  const cached = pool.get(name);
  if (cached?.isConnected()) {
    await evictExcessContexts(cached);
    return cached;
  }
  // Browser was disconnected or doesn't exist — evict and relaunch
  pool.delete(name);
  const browser = await UniBrowser.launch(name, { headless: true });
  pool.set(name, browser);
  return browser;
}

async function evictExcessContexts(browser: UniBrowser): Promise<void> {
  const contexts = browser.raw?.contexts() ?? [];
  if (contexts.length < MAX_CONTEXTS_PER_BROWSER) return;
  const excess = contexts.length - MAX_CONTEXTS_PER_BROWSER + 1;
  for (let i = 0; i < excess && i < contexts.length; i++) {
    const ctx = contexts[i];
    if (ctx) await ctx.close().catch(() => {});
  }
}

async function releaseBrowser(name: BrowserName): Promise<void> {
  const pool = getPool();
  const browser = pool.get(name);
  if (!browser?.isConnected()) {
    pool.delete(name);
    return;
  }
  const contexts = browser.raw?.contexts() ?? [];
  for (const ctx of contexts) {
    await ctx.close().catch(() => {});
  }
}

function drainPoolSync(): void {
  const pool = getPool();
  for (const [, browser] of pool) {
    browser.raw?.close().catch(() => {});
  }
  pool.clear();
}

async function drainPool(): Promise<void> {
  const pool = getPool();
  for (const [name, browser] of pool) {
    await browser.close().catch(() => {});
    pool.delete(name);
  }
}

// --- Suite ---

function resolveBrowsers(browsers?: BrowserName[]): BrowserName[] {
  if (browsers) return browsers;
  const envBrowsers = process.env.UNIBROWSER_BROWSERS;
  if (envBrowsers) {
    return envBrowsers.split(",").map((b) => b.trim() as BrowserName);
  }
  return ALL_BROWSERS;
}

export function crossBrowserSuite(
  name: string,
  fn: (test: CrossBrowserTest) => void,
  optionsOrBrowsers?: CrossBrowserSuiteOptions | BrowserName[],
): void {
  const options: CrossBrowserSuiteOptions = Array.isArray(optionsOrBrowsers)
    ? { browsers: optionsOrBrowsers }
    : (optionsOrBrowsers ?? {});

  const browsers = resolveBrowsers(options.browsers);
  const sharedBrowser = options.sharedBrowser ?? true;
  const parallel = options.parallel ?? false;

  describe.each(browsers)(`${name} [%s]`, (browserName) => {
    let browser: UniBrowser;
    let page: UniPage;

    beforeAll(async () => {
      if (sharedBrowser) {
        browser = await acquireBrowser(browserName as BrowserName);
      } else {
        browser = await UniBrowser.launch(browserName as BrowserName, { headless: true });
      }
      page = await browser.newPage();
    });

    afterAll(async () => {
      await page?.close().catch(() => {});
      if (sharedBrowser) {
        // Free all contexts so the browser is clean for the next test file
        await releaseBrowser(browserName as BrowserName);
      } else {
        await browser?.close().catch(() => {});
      }
    });

    const test: CrossBrowserTest = parallel
      ? (testName, testFn) => {
          vitestTest.concurrent(testName, async () => {
            let pb: UniBrowser;
            let pp: UniPage;
            if (sharedBrowser) {
              pb = await acquireBrowser(browserName as BrowserName);
            } else {
              pb = await UniBrowser.launch(browserName as BrowserName, { headless: true });
            }
            pp = await pb.newPage();
            try {
              await testFn({ page: pp, browser: pb });
            } finally {
              await pp.close().catch(() => {});
              if (!sharedBrowser) {
                await pb.close().catch(() => {});
              }
            }
          });
        }
      : (testName, testFn) => {
          vitestTest(testName, async () => {
            await testFn({ page, browser });
          });
        };

    fn(test);
  });
}

export async function closeSharedBrowsers(): Promise<void> {
  await drainPool();
}
