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

export function crossBrowserSuite(
  name: string,
  fn: (test: CrossBrowserTest) => void,
  browsers: BrowserName[] = ALL_BROWSERS,
): void {
  describe.each(browsers)(`${name} [%s]`, (browserName) => {
    let browser: UniBrowser;
    let page: UniPage;

    beforeAll(async () => {
      browser = await UniBrowser.launch(browserName as BrowserName, { headless: true });
      page = await browser.newPage();
    });

    afterAll(async () => {
      await page?.close().catch(() => {});
      await browser?.close().catch(() => {});
    });

    const test: CrossBrowserTest = (testName, testFn) => {
      vitestTest(testName, async () => {
        await testFn({ page, browser });
      });
    };

    fn(test);
  });
}
