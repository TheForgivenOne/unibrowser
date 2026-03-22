import type {
  BrowserContext as PlaywrightContext,
  Route as PlaywrightRoute,
} from "playwright";
import type { WaitUntil } from "../config/config.js";
import { UniPage } from "./page.js";

export class UniContext {
  constructor(
    public readonly raw: PlaywrightContext,
    private readonly _defaultTimeout: number,
    private readonly _defaultWaitUntil: WaitUntil,
  ) {}

  async newPage(): Promise<UniPage> {
    const page = await this.raw.newPage();
    page.setDefaultTimeout(this._defaultTimeout);
    return new UniPage(page, this._defaultTimeout, this._defaultWaitUntil);
  }

  async close(): Promise<void> {
    await this.raw.close();
  }

  pages(): UniPage[] {
    return this.raw.pages().map((p) => new UniPage(p, this._defaultTimeout, this._defaultWaitUntil));
  }

  async cookies(urls?: string[]): Promise<never[]> {
    return this.raw.cookies(urls) as Promise<never[]>;
  }

  async addCookies(cookies: never[]): Promise<void> {
    await this.raw.addCookies(cookies);
  }

  async clearCookies(): Promise<void> {
    await this.raw.clearCookies();
  }

  async storageState(): Promise<unknown> {
    return this.raw.storageState();
  }

  async grantPermissions(permissions: string[], options?: { origin?: string }): Promise<void> {
    await this.raw.grantPermissions(permissions, options);
  }

  async clearPermissions(): Promise<void> {
    await this.raw.clearPermissions();
  }

  async route(
    url: string | RegExp,
    handler: (route: PlaywrightRoute) => Promise<void>,
  ): Promise<void> {
    await this.raw.route(url, handler);
  }

  async unroute(url: string | RegExp): Promise<void> {
    await this.raw.unroute(url);
  }

  async setOffline(offline: boolean): Promise<void> {
    await this.raw.setOffline(offline);
  }
}
