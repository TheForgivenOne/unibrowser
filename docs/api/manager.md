# Browser Manager

Functions for installing, detecting, and managing browsers.

## One-Step Setup

### `ensureAll()`

Installs system dependencies (Linux) and all browsers.

```typescript
import { ensureAll } from "unibrowser";
ensureAll();
```

## Install Browsers

### `ensureBrowsers(options?)`

Download missing browsers.

```typescript
import { ensureBrowsers } from "unibrowser";

// Install all missing browsers
ensureBrowsers();

// Install only specific browsers
ensureBrowsers({ browsers: ["chromium", "firefox"] });

// Force reinstall
ensureBrowsers({ force: true });
```

| Option | Type | Default | Description |
|---|---|---|---|
| `browsers` | `BrowserName[]` | all 6 names | Which browsers to install |
| `force` | `boolean` | `false` | Reinstall even if present |

Internally runs `npx playwright install <types>`. Timeout: 5 minutes.

### `ensureDependencies()`

Install system-level dependencies (Linux only). On other platforms, logs a skip message.

```typescript
import { ensureDependencies } from "unibrowser";
ensureDependencies();
```

Internally runs `npx playwright install-deps`.

## Check Status

### `getBrowserStatus(browser)`

Check if a single browser is installed.

```typescript
const status = getBrowserStatus("chromium");
// { name: "chromium", type: "chromium", installed: true, path: "/home/..." }
```

Returns `BrowserStatus`:

| Field | Type | Description |
|---|---|---|
| `name` | `BrowserName` | The browser name |
| `type` | `BrowserType` | Engine type: chromium/firefox/webkit |
| `installed` | `boolean` | Whether the executable exists |
| `path` | `string \| null` | Path to executable, or null |

### `getAllBrowserStatus()`

Check all 6 browser names.

```typescript
const statuses = getAllBrowserStatus();
// [
//   { name: "chromium", type: "chromium", installed: true, ... },
//   { name: "chrome", type: "chromium", installed: true, ... },
//   { name: "edge", type: "chromium", installed: true, ... },
//   { name: "firefox", type: "firefox", installed: true, ... },
//   { name: "safari", type: "webkit", installed: true, ... },
//   { name: "webkit", type: "webkit", installed: true, ... },
// ]
```

### `getMissingBrowsers()`

Returns `BrowserName[]` of browsers not installed.

```typescript
const missing = getMissingBrowsers();
// ["firefox"] or [] if all installed
```

### `isBrowserInstalled(browser)`

Returns `boolean`.

```typescript
if (isBrowserInstalled("chromium")) {
  // ready to launch
}
```

### `printBrowserStatus()`

Print status to console via the logger.

```typescript
printBrowserStatus();
```

Output:

```
[unibrowser] Platform: linux (x64)
[unibrowser] Browser status:
[unibrowser]   ✔ chromium (chrome, edge) - /home/.../chrome-linux64/chrome
[unibrowser]   ✔ firefox - /home/.../firefox/firefox
[unibrowser]   ✔ webkit (safari) - /home/.../webkit/pw_run.sh
```

## Platform Info

### `getPlatformInfo()`

Returns `PlatformInfo`.

```typescript
const info = getPlatformInfo();
// { os: "linux", arch: "x64", supported: ["chromium", "firefox", "webkit"] }
```

| Field | Type | Description |
|---|---|---|
| `os` | `"linux" \| "macos" \| "windows"` | Operating system |
| `arch` | `string` | CPU architecture |
| `supported` | `BrowserType[]` | Browsers available on this platform |

## Validate

### `validateBrowser(browser)`

Throws an error with install instructions if the browser is not installed.

```typescript
try {
  validateBrowser("chromium");
} catch (e) {
  // "Browser 'chromium' (chromium) is not installed. Run: npx playwright install chromium"
}
```

This is called automatically by `UniBrowser.launch()`.
