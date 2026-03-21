# UniBrowser

The browser launcher. Creates and manages browser instances.

## Launch a Browser

```typescript
import { UniBrowser } from "unibrowser";

const browser = await UniBrowser.launch("chromium", { headless: true });
```

### `UniBrowser.launch(browser, options?)`

Launches a browser. Validates the browser is installed first.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `browser` | `BrowserName` | required | `"chromium"`, `"chrome"`, `"edge"`, `"firefox"`, `"safari"`, or `"webkit"` |
| `options.headless` | `boolean` | `true` | Run without UI |
| `options.slowMo` | `number` | `0` | Slow down actions by ms |
| `options.proxy` | `{ server, username?, password? }` | - | Proxy server |

Returns `Promise<UniBrowser>`.

```typescript
const chromium = await UniBrowser.launch("chromium");
const firefox = await UniBrowser.launch("firefox");
const safari = await UniBrowser.launch("webkit");
```

### `UniBrowser.ensureAndLaunch(browser, options?)`

Installs the browser if missing, then launches it.

```typescript
const browser = await UniBrowser.ensureAndLaunch("chromium");
```

## Create Pages

### `browser.newPage(options?)`

Creates a new context and returns a page. Fastest way to get a page.

```typescript
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("https://example.com");
```

### `browser.newContext(options?)`

Creates a new browser context. Use this for isolated sessions (cookies, storage).

```typescript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  userAgent: "custom-agent",
  locale: "en-US",
  timezoneId: "America/New_York",
  colorScheme: "dark",
  ignoreHTTPSErrors: true,
  permissions: ["geolocation"],
});

const page = await context.newPage();
```

| Option | Type | Description |
|---|---|---|
| `viewport` | `{ width, height } \| null` | Page size |
| `userAgent` | `string` | Custom user agent |
| `locale` | `string` | Browser locale |
| `timezoneId` | `string` | Timezone |
| `colorScheme` | `"light" \| "dark" \| "no-preference"` | Color scheme |
| `ignoreHTTPSErrors` | `boolean` | Skip HTTPS errors |
| `permissions` | `string[]` | Browser permissions |

## Browser Info

### `browser.isConnected()`

Returns `boolean`. Whether the browser process is still running.

### `browser.version()`

Returns `string`. Browser version.

### `browser.contexts()`

Returns `Promise<UniContext[]>`. All open contexts.

### `browser.name`

`BrowserName`. The name used to launch.

### `browser.raw`

The underlying Playwright `Browser` instance. Use this to access Playwright features not wrapped by unibrowser.

## Close

### `browser.close()`

Closes the browser and all pages.

```typescript
await browser.close();
```

Always close browsers to free resources:

```typescript
const browser = await UniBrowser.launch("chromium");
try {
  const page = await browser.newPage();
  // ... tests ...
} finally {
  await browser.close();
}
```

Or use `crossBrowserSuite` which handles lifecycle automatically.
