import type { BrowserName, BrowserLaunchOptions } from "./types.js";
import type { Browser as PlaywrightBrowser } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { resolveBrowserType } from "../config/config.js";
import type { WaitUntil } from "../config/config.js";
import { validateBrowser } from "./manager.js";
import { getLogger } from "../utils/logger.js";
import { UniContext } from "./context.js";
import { UniPage } from "./page.js";

interface LaunchOpts {
  headless?: boolean;
  slowMo?: number;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
}

const ENGINES = {
  chromium,
  firefox,
  webkit,
} as const;

export class UniBrowser {
  private constructor(
    public readonly raw: PlaywrightBrowser,
    public readonly name: BrowserName,
    private readonly _defaultTimeout: number,
    private readonly _defaultWaitUntil: WaitUntil,
  ) {}

  static async launch(
    browser: BrowserName,
    options?: BrowserLaunchOptions & { waitUntil?: WaitUntil },
  ): Promise<UniBrowser> {
    const log = getLogger();

    log.info(`Launching ${browser}...`);
    validateBrowser(browser);

    const engine = ENGINES[resolveBrowserType(browser)];
    const defaultTimeout = 10_000;
    const defaultWaitUntil: WaitUntil = options?.waitUntil ?? "load";
    const headless = options?.headless ?? true;

    const launchOpts: LaunchOpts = { headless };
    if (options?.slowMo !== undefined) launchOpts.slowMo = options.slowMo;
    if (options?.proxy !== undefined) launchOpts.proxy = options.proxy;

    log.debug(`Engine: ${resolveBrowserType(browser)}, headless: ${headless}`);

    const pwBrowser = await engine.launch(launchOpts);

    log.info(`${browser} launched (pid: ${pwBrowser.contexts().length} contexts)`);

    return new UniBrowser(pwBrowser, browser, defaultTimeout, defaultWaitUntil);
  }

  static async ensureAndLaunch(
    browser: BrowserName,
    options?: BrowserLaunchOptions & { waitUntil?: WaitUntil },
  ): Promise<UniBrowser> {
    const log = getLogger();
    log.info(`Ensuring ${browser} is installed...`);

    const { ensureBrowsers } = await import("./manager.js");
    ensureBrowsers({ browsers: [browser] });

    return UniBrowser.launch(browser, options);
  }

  async newContext(options?: {
    viewport?: { width: number; height: number } | null;
    userAgent?: string;
    locale?: string;
    timezoneId?: string;
    colorScheme?: "light" | "dark" | "no-preference";
    ignoreHTTPSErrors?: boolean;
    permissions?: string[];
    storageState?: unknown;
  }): Promise<UniContext> {
    const log = getLogger();
    log.debug("Creating new browser context");

    const ctxOpts: Record<string, unknown> = {};
    if (options?.viewport !== undefined) ctxOpts["viewport"] = options.viewport;
    if (options?.userAgent !== undefined) ctxOpts["userAgent"] = options.userAgent;
    if (options?.locale !== undefined) ctxOpts["locale"] = options.locale;
    if (options?.timezoneId !== undefined) ctxOpts["timezoneId"] = options.timezoneId;
    if (options?.colorScheme !== undefined) ctxOpts["colorScheme"] = options.colorScheme;
    if (options?.ignoreHTTPSErrors !== undefined) ctxOpts["ignoreHTTPSErrors"] = options.ignoreHTTPSErrors;
    if (options?.permissions !== undefined) ctxOpts["permissions"] = options.permissions;
    if (options?.storageState !== undefined) ctxOpts["storageState"] = options.storageState;

    const pwContext = await this.raw.newContext(ctxOpts);

    return new UniContext(pwContext, this._defaultTimeout, this._defaultWaitUntil);
  }

  async newPage(options?: {
    viewport?: { width: number; height: number } | null;
    userAgent?: string;
    locale?: string;
    timezoneId?: string;
    colorScheme?: "light" | "dark" | "no-preference";
    ignoreHTTPSErrors?: boolean;
    permissions?: string[];
    storageState?: unknown;
  }): Promise<UniPage> {
    const context = await this.newContext(options);
    return context.newPage();
  }

  async close(): Promise<void> {
    const log = getLogger();
    log.info(`Closing ${this.name}...`);
    await this.raw.close();
  }

  isConnected(): boolean {
    return this.raw.isConnected();
  }

  async contexts(): Promise<UniContext[]> {
    return this.raw.contexts().map(
      (ctx) => new UniContext(ctx, this._defaultTimeout, this._defaultWaitUntil),
    );
  }

  version(): string {
    return this.raw.version();
  }
}
