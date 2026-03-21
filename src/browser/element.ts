import type {
  Locator as PlaywrightLocator,
  Page as PlaywrightPage,
} from "playwright";
import type { ClickOptions, ScreenshotOptions, WaitOptions } from "./types.js";
import { assert, assertEqual, assertContains } from "../utils/assertions.js";

export class UniElement {
  constructor(
    private readonly _locator: PlaywrightLocator,
    private readonly _page: PlaywrightPage,
  ) {}

  get raw(): PlaywrightLocator {
    return this._locator;
  }

  async click(options?: ClickOptions): Promise<void> {
    await this._locator.click(options);
  }

  async dblclick(options?: ClickOptions): Promise<void> {
    await this._locator.dblclick(options);
  }

  async type(text: string): Promise<void> {
    await this._locator.fill(text);
  }

  async clear(): Promise<void> {
    await this._locator.clear();
  }

  async hover(): Promise<void> {
    await this._locator.hover();
  }

  async focus(): Promise<void> {
    await this._locator.focus();
  }

  async blur(): Promise<void> {
    await this._locator.blur();
  }

  async press(key: string): Promise<void> {
    await this._locator.press(key);
  }

  async check(): Promise<void> {
    await this._locator.check();
  }

  async uncheck(): Promise<void> {
    await this._locator.uncheck();
  }

  async selectOption(
    values: string | string[] | { value?: string; label?: string; index?: number },
  ): Promise<string[]> {
    return this._locator.selectOption(values as never);
  }

  async textContent(): Promise<string | null> {
    return this._locator.textContent();
  }

  async innerText(): Promise<string> {
    return this._locator.innerText();
  }

  async innerHTML(): Promise<string> {
    return this._locator.innerHTML();
  }

  async getAttribute(name: string): Promise<string | null> {
    return this._locator.getAttribute(name);
  }

  async inputValue(): Promise<string> {
    return this._locator.inputValue();
  }

  async isChecked(): Promise<boolean> {
    return this._locator.isChecked();
  }

  async isVisible(): Promise<boolean> {
    return this._locator.isVisible();
  }

  async isHidden(): Promise<boolean> {
    return this._locator.isHidden();
  }

  async isEnabled(): Promise<boolean> {
    return this._locator.isEnabled();
  }

  async isDisabled(): Promise<boolean> {
    return this._locator.isDisabled();
  }

  async count(): Promise<number> {
    return this._locator.count();
  }

  async boundingBox(): Promise<{ x: number; y: number; width: number; height: number } | null> {
    return this._locator.boundingBox();
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    return this._locator.screenshot(options);
  }

  async waitFor(options?: WaitOptions): Promise<void> {
    const waitOpts: { state?: "attached" | "detached" | "visible" | "hidden"; timeout?: number } = {};
    if (options?.state !== undefined) waitOpts.state = options.state;
    if (options?.timeout !== undefined) waitOpts.timeout = options.timeout;
    await this._locator.waitFor(waitOpts);
  }

  locator(selector: string): UniElement {
    return new UniElement(this._locator.locator(selector), this._page);
  }

  async expectVisible(message?: string): Promise<void> {
    await this.waitFor({ state: "visible" });
    const visible = await this.isVisible();
    assert(visible, message ?? "Expected element to be visible");
  }

  async expectHidden(message?: string): Promise<void> {
    await this.waitFor({ state: "hidden" });
    const hidden = await this.isHidden();
    assert(hidden, message ?? "Expected element to be hidden");
  }

  async expectText(expected: string, message?: string): Promise<void> {
    await this.waitFor({ state: "visible" });
    const text = await this.innerText();
    assertEqual(text.trim(), expected.trim(), message);
  }

  async expectTextContains(partial: string, message?: string): Promise<void> {
    await this.waitFor({ state: "visible" });
    const text = await this.innerText();
    assertContains(text, partial, message);
  }

  async expectEnabled(message?: string): Promise<void> {
    const enabled = await this.isEnabled();
    assert(enabled, message ?? "Expected element to be enabled");
  }

  async expectDisabled(message?: string): Promise<void> {
    const disabled = await this.isDisabled();
    assert(disabled, message ?? "Expected element to be disabled");
  }

  async expectChecked(message?: string): Promise<void> {
    const checked = await this.isChecked();
    assert(checked, message ?? "Expected element to be checked");
  }

  async expectAttribute(name: string, value: string, message?: string): Promise<void> {
    const attr = await this.getAttribute(name);
    assertEqual(attr, value, message ?? `Expected attribute "${name}" to be "${value}"`);
  }

  first(): UniElement {
    return new UniElement(this._locator.first(), this._page);
  }

  last(): UniElement {
    return new UniElement(this._locator.last(), this._page);
  }

  nth(index: number): UniElement {
    return new UniElement(this._locator.nth(index), this._page);
  }

  async all(): Promise<UniElement[]> {
    const count = await this._locator.count();
    const elements: UniElement[] = [];
    for (let i = 0; i < count; i++) {
      elements.push(new UniElement(this._locator.nth(i), this._page));
    }
    return elements;
  }
}
