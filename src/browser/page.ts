import type {
  Page as PlaywrightPage,
  Response as PlaywrightResponse,
} from "playwright";
import type {
  GotoOptions,
  ScreenshotOptions,
  ClickOptions,
  TypeOptions,
  WaitOptions,
  LocatorOptions,
} from "./types.js";
import type { WaitUntil } from "../config/config.js";
import { UniElement } from "./element.js";
import { captureScreenshot, assertScreenshotMatches } from "../utils/screenshots.js";
import { assertEqual, assertContains, assertMatch } from "../utils/assertions.js";

export class UniPage {
  constructor(
    public readonly raw: PlaywrightPage,
    private readonly _defaultTimeout: number,
    private readonly _defaultWaitUntil: WaitUntil,
  ) {}

  async goto(url: string, options?: GotoOptions): Promise<PlaywrightResponse | null> {
    const gotoOpts: { waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit"; timeout?: number; referer?: string } = {
      waitUntil: options?.waitUntil ?? this._defaultWaitUntil,
      timeout: options?.timeout ?? this._defaultTimeout,
    };
    if (options?.referer !== undefined) gotoOpts.referer = options.referer;
    return this.raw.goto(url, gotoOpts);
  }

  locator(selector: string, options?: LocatorOptions): UniElement {
    const pwOpts: { hasText?: string | RegExp; hasNotText?: string | RegExp; has?: import("playwright").Locator } = {};
    if (options?.hasText !== undefined) pwOpts.hasText = options.hasText;
    if (options?.hasNotText !== undefined) pwOpts.hasNotText = options.hasNotText;
    if (options?.has !== undefined) pwOpts.has = options.has.raw;
    const pwLocator = this.raw.locator(selector, pwOpts);
    return new UniElement(pwLocator, this.raw);
  }

  getByRole(
    role: string,
    options?: { name?: string | RegExp; exact?: boolean },
  ): UniElement {
    return new UniElement(this.raw.getByRole(role as never, options as never), this.raw);
  }

  getByText(text: string | RegExp): UniElement {
    return new UniElement(this.raw.getByText(text), this.raw);
  }

  getByLabel(text: string | RegExp, options?: { exact?: boolean }): UniElement {
    return new UniElement(this.raw.getByLabel(text, options), this.raw);
  }

  getByPlaceholder(text: string | RegExp): UniElement {
    return new UniElement(this.raw.getByPlaceholder(text), this.raw);
  }

  getByTestId(testId: string): UniElement {
    return new UniElement(this.raw.getByTestId(testId), this.raw);
  }

  async click(selector: string, options?: ClickOptions): Promise<void> {
    await this.raw.click(selector, options);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.raw.fill(selector, value);
  }

  async type(selector: string, text: string, options?: TypeOptions): Promise<void> {
    const typeOpts: { delay?: number } = {};
    if (options?.delay !== undefined) typeOpts.delay = options.delay;
    await this.raw.type(selector, text, typeOpts);
  }

  async press(selector: string, key: string): Promise<void> {
    await this.raw.press(selector, key);
  }

  async check(selector: string): Promise<void> {
    await this.raw.check(selector);
  }

  async uncheck(selector: string): Promise<void> {
    await this.raw.uncheck(selector);
  }

  async selectOption(
    selector: string,
    values: string | string[],
  ): Promise<string[]> {
    return this.raw.selectOption(selector, values);
  }

  async title(): Promise<string> {
    return this.raw.title();
  }

  url(): string {
    return this.raw.url();
  }

  async content(): Promise<string> {
    return this.raw.content();
  }

  async reload(options?: { waitUntil?: GotoOptions["waitUntil"] }): Promise<PlaywrightResponse | null> {
    return this.raw.reload({
      waitUntil: options?.waitUntil ?? this._defaultWaitUntil,
    });
  }

  async goBack(options?: { waitUntil?: GotoOptions["waitUntil"] }): Promise<PlaywrightResponse | null> {
    return this.raw.goBack({
      waitUntil: options?.waitUntil ?? this._defaultWaitUntil,
    });
  }

  async goForward(options?: { waitUntil?: GotoOptions["waitUntil"] }): Promise<PlaywrightResponse | null> {
    return this.raw.goForward({
      waitUntil: options?.waitUntil ?? this._defaultWaitUntil,
    });
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    return captureScreenshot(this.raw, options);
  }

  async evaluate<R>(fn: string | ((...args: unknown[]) => R)): Promise<R> {
    return this.raw.evaluate(fn);
  }

  async evaluateHandle<R>(
    fn: string | ((...args: unknown[]) => R),
  ): Promise<unknown> {
    return this.raw.evaluateHandle(fn as never);
  }

  async waitForURL(
    url: string | RegExp,
    options?: { waitUntil?: GotoOptions["waitUntil"]; timeout?: number },
  ): Promise<void> {
    const waitOpts: { waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit"; timeout: number } = {
      timeout: options?.timeout ?? this._defaultTimeout,
    };
    if (options?.waitUntil !== undefined) waitOpts.waitUntil = options.waitUntil;
    await this.raw.waitForURL(url, waitOpts);
  }

  async waitForSelector(
    selector: string,
    options?: WaitOptions,
  ): Promise<UniElement> {
    const pwLocator = this.raw.locator(selector);
    const waitOpts: { state: "attached" | "detached" | "visible" | "hidden"; timeout: number } = {
      state: options?.state ?? "visible",
      timeout: options?.timeout ?? this._defaultTimeout,
    };
    await pwLocator.waitFor(waitOpts);
    return new UniElement(pwLocator, this.raw);
  }

  async waitForLoadState(
    state: "load" | "domcontentloaded" | "networkidle" = "load",
  ): Promise<void> {
    await this.raw.waitForLoadState(state);
  }

  async waitForFunction(
    fn: string | ((...args: unknown[]) => boolean),
    options?: { timeout?: number; polling?: number | "raf" },
  ): Promise<void> {
    const waitOpts: { timeout: number; polling?: number | "raf" } = {
      timeout: options?.timeout ?? this._defaultTimeout,
    };
    if (options?.polling !== undefined) waitOpts.polling = options.polling;
    await this.raw.waitForFunction(fn, undefined, waitOpts);
  }

  async close(): Promise<void> {
    await this.raw.close();
  }

  async expectTitle(expected: string | RegExp, message?: string): Promise<void> {
    const title = await this.title();
    if (typeof expected === "string") {
      assertEqual(title, expected, message ?? `Expected title "${expected}", got "${title}"`);
    } else {
      assertMatch(title, expected, message ?? `Expected title to match ${expected}, got "${title}"`);
    }
  }

  async expectTitleContains(partial: string, message?: string): Promise<void> {
    const title = await this.title();
    assertContains(title, partial, message ?? `Expected title to contain "${partial}"`);
  }

  async expectURL(expected: string | RegExp, message?: string): Promise<void> {
    const url = this.url();
    if (typeof expected === "string") {
      assertEqual(url, expected, message ?? `Expected URL "${expected}", got "${url}"`);
    } else {
      assertMatch(url, expected, message ?? `Expected URL to match ${expected}, got "${url}"`);
    }
  }

  async expectURLContains(partial: string, message?: string): Promise<void> {
    const url = this.url();
    assertContains(url, partial, message ?? `Expected URL to contain "${partial}"`);
  }

  async expectScreenshot(
    baselinePath: string,
    threshold = 0.1,
  ): Promise<void> {
    await assertScreenshotMatches(this.raw, baselinePath, threshold);
  }
}
