# Configuration

unibrowser uses a config object with sensible defaults. Override what you need.

## Defaults

```typescript
import { DEFAULTS } from "unibrowser";

// {
//   defaultBrowser: "chromium",
//   headless: true,
//   slowMo: 0,
//   devtools: false,
//   viewport: { width: 1280, height: 720 },
//   timeout: { navigation: 30000, action: 10000, expect: 5000 },
//   waitUntil: "load",
//   retries: 0,
//   browsers: { chromium: {}, chrome: {}, edge: {}, firefox: {}, safari: {}, webkit: {} },
// }
```

## `loadConfig(overrides?)`

Deep-merge overrides onto defaults.

```typescript
import { loadConfig } from "unibrowser";

const config = loadConfig({
  headless: false,
  viewport: { width: 1920, height: 1080 },
  timeout: { navigation: 60000, action: 15000, expect: 10000 },
});

// config.headless === false
// config.viewport.width === 1920
// config.timeout.navigation === 60000
// config.defaultBrowser === "chromium" (from defaults)
```

### `waitUntil` for SPAs

For single-page apps (Next.js, React, etc.), `"domcontentloaded"` is faster than the default `"load"`:

```typescript
const config = loadConfig({
  waitUntil: "domcontentloaded",
});
```

| Value | Description |
|---|---|
| `"load"` | Wait for all resources (images, fonts, etc.) — default |
| `"domcontentloaded"` | Wait for HTML to parse — faster for SPAs |
| `"networkidle"` | Wait for no network activity for 500ms |
| `"commit"` | Wait for the first byte of the response |

### `UniBrowserConfig`

| Field | Type | Default | Description |
|---|---|---|---|
| `defaultBrowser` | `BrowserName` | `"chromium"` | Default browser |
| `headless` | `boolean` | `true` | Run headless |
| `slowMo` | `number` | `0` | Slow down by ms |
| `devtools` | `boolean` | `false` | Open DevTools |
| `viewport` | `ViewportConfig` | `{ width: 1280, height: 720 }` | Default viewport |
| `timeout.navigation` | `number` | `30000` | Navigation timeout (ms) |
| `timeout.action` | `number` | `10000` | Action timeout (ms) |
| `timeout.expect` | `number` | `5000` | Assertion timeout (ms) |
| `waitUntil` | `WaitUntil` | `"load"` | Default load strategy for navigation |
| `retries` | `number` | `0` | Retry count |
| `browsers` | `Record<BrowserName, BrowserLaunchOptions>` | `{}` | Per-browser options |

## `resolveBrowserType(browser)`

Maps `BrowserName` to `BrowserType`.

```typescript
resolveBrowserType("chrome");   // "chromium"
resolveBrowserType("edge");     // "chromium"
resolveBrowserType("firefox");  // "firefox"
resolveBrowserType("safari");   // "webkit"
```

## Constants

### `DEFAULTS`

The full default config object. Read-only reference.

```typescript
import { DEFAULTS } from "unibrowser";
console.log(DEFAULTS.viewport); // { width: 1280, height: 720 }
```

### `ALL_BROWSERS`

```typescript
import { ALL_BROWSERS } from "unibrowser";
// ["chromium", "firefox", "webkit"]
```

The browser list used by `crossBrowserSuite` by default.
