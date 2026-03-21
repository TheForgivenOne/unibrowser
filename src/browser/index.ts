export { UniBrowser } from "./browser.js";
export { UniContext } from "./context.js";
export { UniPage } from "./page.js";
export { UniElement } from "./element.js";

export type {
  BrowserType,
  BrowserName,
  BrowserLaunchOptions,
  ViewportConfig,
  ContextOptions,
  StorageState,
  Cookie,
  Origin,
  ScreenshotOptions,
  GotoOptions,
  WaitOptions,
  ClickOptions,
  TypeOptions,
  LocatorOptions,
  AssertionResult,
} from "./types.js";

export type { BrowserStatus, EnsureOptions, PlatformInfo } from "./manager.js";

export { AssertionError } from "./types.js";

export {
  getBrowserStatus,
  getAllBrowserStatus,
  getMissingBrowsers,
  isBrowserInstalled,
  ensureBrowsers,
  ensureDependencies,
  ensureAll,
  validateBrowser,
  printBrowserStatus,
  getPlatformInfo,
} from "./manager.js";
