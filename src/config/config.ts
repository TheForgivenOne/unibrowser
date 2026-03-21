import type {
  BrowserName,
  BrowserType,
  BrowserLaunchOptions,
  ViewportConfig,
} from "../browser/types.js";

export interface UniBrowserConfig {
  defaultBrowser: BrowserName;
  headless: boolean;
  slowMo: number;
  devtools: boolean;
  viewport: ViewportConfig;
  timeout: {
    navigation: number;
    action: number;
    expect: number;
  };
  retries: number;
  browsers: Record<BrowserName, BrowserLaunchOptions>;
}

const DEFAULT_VIEWPORT: ViewportConfig = {
  width: 1280,
  height: 720,
};

export const DEFAULTS: UniBrowserConfig = {
  defaultBrowser: "chromium",
  headless: true,
  slowMo: 0,
  devtools: false,
  viewport: DEFAULT_VIEWPORT,
  timeout: {
    navigation: 30_000,
    action: 10_000,
    expect: 5_000,
  },
  retries: 0,
  browsers: {
    chromium: {},
    chrome: {},
    edge: {},
    firefox: {},
    safari: {},
    webkit: {},
  },
};

export function resolveBrowserType(browser: BrowserName): BrowserType {
  const mapping: Record<BrowserName, BrowserType> = {
    chromium: "chromium",
    chrome: "chromium",
    edge: "chromium",
    firefox: "firefox",
    safari: "webkit",
    webkit: "webkit",
  };
  return mapping[browser];
}

export function loadConfig(overrides?: Partial<UniBrowserConfig>): UniBrowserConfig {
  const merged: UniBrowserConfig = {
    ...DEFAULTS,
    ...overrides,
    timeout: {
      ...DEFAULTS.timeout,
      ...(overrides?.timeout ?? {}),
    },
    viewport: {
      ...DEFAULTS.viewport,
      ...(overrides?.viewport ?? {}),
    },
    browsers: {
      ...DEFAULTS.browsers,
      ...(overrides?.browsers ?? {}),
    },
  };
  return merged;
}
