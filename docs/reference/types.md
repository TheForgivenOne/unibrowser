# Types

All TypeScript interfaces exported by unibrowser.

## Browser Types

### `BrowserName`

```typescript
type BrowserName = "chromium" | "chrome" | "edge" | "firefox" | "safari" | "webkit";
```

User-facing browser names. Maps to engine types:

| BrowserName | BrowserType |
|---|---|
| `chromium`, `chrome`, `edge` | `chromium` |
| `firefox` | `firefox` |
| `safari`, `webkit` | `webkit` |

### `BrowserType`

```typescript
type BrowserType = "chromium" | "firefox" | "webkit";
```

Playwright engine types. Three engines, six aliases.

## Launch & Context

### `BrowserLaunchOptions`

```typescript
interface BrowserLaunchOptions {
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
```

### `ViewportConfig`

```typescript
interface ViewportConfig {
  width: number;
  height: number;
}
```

### `ContextOptions`

```typescript
interface ContextOptions {
  viewport?: ViewportConfig | null;
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
  colorScheme?: "light" | "dark" | "no-preference";
  ignoreHTTPSErrors?: boolean;
  permissions?: string[];
  storageState?: string | StorageState;
}
```

### `StorageState`

```typescript
interface StorageState {
  cookies?: Cookie[];
  origins?: Origin[];
}
```

### `Cookie`

```typescript
interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
}
```

### `Origin`

```typescript
interface Origin {
  origin: string;
  localStorage?: { name: string; value: string }[];
}
```

## Navigation & Interaction

### `GotoOptions`

```typescript
interface GotoOptions {
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  timeout?: number;
  referer?: string;
}
```

### `ClickOptions`

```typescript
interface ClickOptions {
  button?: "left" | "right" | "middle";
  clickCount?: number;
  delay?: number;
  modifiers?: ("Alt" | "Control" | "Meta" | "Shift")[];
  position?: { x: number; y: number };
  timeout?: number;
  force?: boolean;
  noWaitAfter?: boolean;
}
```

### `TypeOptions`

```typescript
interface TypeOptions {
  delay?: number;
  timeout?: number;
  noWaitAfter?: boolean;
}
```

### `WaitOptions`

```typescript
interface WaitOptions {
  state?: "attached" | "detached" | "visible" | "hidden";
  timeout?: number;
  strict?: boolean;
}
```

### `LocatorOptions`

```typescript
interface LocatorOptions {
  hasText?: string | RegExp;
  hasNotText?: string | RegExp;
  has?: UniElement;
}
```

## Screenshots

### `ScreenshotOptions`

```typescript
interface ScreenshotOptions {
  path?: string;
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  quality?: number;
  type?: "png" | "jpeg";
}
```

### `CompareResult`

```typescript
interface CompareResult {
  match: boolean;
  diffPercent: number;
  diffPixels: number;
  totalPixels: number;
}
```

## Manager

### `BrowserStatus`

```typescript
interface BrowserStatus {
  name: BrowserName;
  type: BrowserType;
  installed: boolean;
  path: string | null;
}
```

### `EnsureOptions`

```typescript
interface EnsureOptions {
  browsers?: BrowserName[];
  force?: boolean;
}
```

### `PlatformInfo`

```typescript
interface PlatformInfo {
  os: "linux" | "macos" | "windows";
  arch: string;
  supported: BrowserType[];
}
```

## Testing

### `CrossBrowserContext`

```typescript
interface CrossBrowserContext {
  page: UniPage;
  browser: UniBrowser;
}
```

### `CrossBrowserSuiteOptions`

```typescript
interface CrossBrowserSuiteOptions {
  browsers?: BrowserName[];
  sharedBrowser?: boolean;
  parallel?: boolean;
}
```

| Option | Type | Default | Description |
|---|---|---|---|
| `browsers` | `BrowserName[]` | all 3 | Browsers to test on |
| `sharedBrowser` | `boolean` | `true` | Reuse browsers via pool across files |
| `parallel` | `boolean` | `false` | Run tests concurrently per browser |

### `WaitUntil`

```typescript
type WaitUntil = "load" | "domcontentloaded" | "networkidle" | "commit";
```

## Utils

### `RetryWaitOptions`

```typescript
interface RetryWaitOptions {
  timeout?: number;
  interval?: number;
  message?: string;
}
```

### `Logger`

```typescript
interface Logger {
  info(message: string): void;
  debug(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
```

### `LogLevel`

```typescript
type LogLevel = "silent" | "info" | "debug";
```

## Errors

### `AssertionError`

```typescript
class AssertionError extends Error {
  readonly actual: unknown;
  readonly expected: unknown;
}
```

Thrown by all assertion functions. Check `actual` and `expected` for details.
