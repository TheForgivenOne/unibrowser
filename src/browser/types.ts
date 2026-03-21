export type BrowserType = "chromium" | "firefox" | "webkit";

export type BrowserName =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "chromium"
  | "webkit";

export interface ViewportConfig {
  width: number;
  height: number;
}

export interface BrowserLaunchOptions {
  headless?: boolean;
  slowMo?: number;
  devtools?: boolean;
  viewport?: ViewportConfig | null;
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
  colorScheme?: "light" | "dark" | "no-preference";
  ignoreHTTPSErrors?: boolean;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
}

export interface ContextOptions {
  viewport?: ViewportConfig | null;
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
  colorScheme?: "light" | "dark" | "no-preference";
  ignoreHTTPSErrors?: boolean;
  permissions?: string[];
  storageState?: string | StorageState;
}

export interface StorageState {
  cookies?: Cookie[];
  origins?: Origin[];
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
}

export interface Origin {
  origin: string;
  localStorage?: { name: string; value: string }[];
}

export interface ScreenshotOptions {
  path?: string;
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  quality?: number;
  type?: "png" | "jpeg";
}

export interface GotoOptions {
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  timeout?: number;
  referer?: string;
}

export interface WaitOptions {
  state?: "attached" | "detached" | "visible" | "hidden";
  timeout?: number;
  strict?: boolean;
}

export interface ClickOptions {
  button?: "left" | "right" | "middle";
  clickCount?: number;
  delay?: number;
  modifiers?: ("Alt" | "Control" | "Meta" | "Shift")[];
  position?: { x: number; y: number };
  timeout?: number;
  force?: boolean;
  noWaitAfter?: boolean;
}

export interface TypeOptions {
  delay?: number;
  timeout?: number;
  noWaitAfter?: boolean;
}

export interface LocatorOptions {
  hasText?: string | RegExp;
  hasNotText?: string | RegExp;
  has?: import("./element.js").UniElement;
}

export interface AssertionResult {
  passed: boolean;
  message: string;
  actual?: unknown;
  expected?: unknown;
}

export class AssertionError extends Error {
  public readonly actual: unknown;
  public readonly expected: unknown;

  constructor(message: string, actual?: unknown, expected?: unknown) {
    super(message);
    this.name = "AssertionError";
    this.actual = actual;
    this.expected = expected;
  }
}
