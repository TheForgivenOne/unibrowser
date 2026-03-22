export { UniBrowser } from "./browser/index.js";
export { UniContext } from "./browser/index.js";
export { UniPage } from "./browser/index.js";
export { UniElement } from "./browser/index.js";

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
} from "./browser/index.js";

export { AssertionError } from "./browser/index.js";

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
} from "./browser/index.js";

export { loadConfig, DEFAULTS, resolveBrowserType } from "./config/index.js";
export type { UniBrowserConfig, WaitUntil } from "./config/index.js";

export {
  waitFor,
  waitForTrue,
  retry,
  sleep,
  assert,
  assertEqual,
  assertNotEqual,
  assertContains,
  assertMatch,
  assertTrue,
  assertFalse,
  assertGreaterThan,
  assertLessThan,
  assertLength,
  assertThrows,
  captureScreenshot,
  compareScreenshots,
  assertScreenshotMatches,
} from "./utils/index.js";

export type { RetryWaitOptions, CompareResult } from "./utils/index.js";

export { createLogger, getLogger, setLogLevel } from "./utils/index.js";
export type { Logger, LogLevel } from "./utils/index.js";

export { crossBrowserSuite, ALL_BROWSERS, closeSharedBrowsers } from "./testing/index.js";
export type { CrossBrowserContext, CrossBrowserSuiteOptions } from "./testing/index.js";
