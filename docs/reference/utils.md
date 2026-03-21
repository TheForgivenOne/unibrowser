# Utilities

Standalone utility functions for waiting, retrying, logging, and screenshots.

## Wait & Retry

### `sleep(ms)`

Pause execution.

```typescript
import { sleep } from "unibrowser";
await sleep(1000); // wait 1 second
```

### `waitFor(fn, predicate, options?)`

Poll a function until a predicate is true.

```typescript
import { waitFor } from "unibrowser";

const result = await waitFor(
  () => fetchStatus(),
  (status) => status === "ready",
  { timeout: 10000, interval: 500 }
);
```

| Option | Type | Default | Description |
|---|---|---|---|
| `timeout` | `number` | `5000` | Max wait time (ms) |
| `interval` | `number` | `100` | Poll interval (ms) |
| `message` | `string` | `"waitFor timed out"` | Error message on timeout |

### `waitForTrue(fn, options?)`

Convenience for `waitFor` with a truthy predicate.

```typescript
import { waitForTrue } from "unibrowser";

await waitForTrue(() => isReady(), { timeout: 5000 });
```

### `retry(fn, attempts?, delay?)`

Retry a function multiple times.

```typescript
import { retry } from "unibrowser";

const result = await retry(
  () => flakyApiCall(),
  3,    // attempts
  1000  // delay between attempts (ms)
);
```

## Logging

### `getLogger()`

Get the default logger.

```typescript
import { getLogger } from "unibrowser";

const log = getLogger();
log.info("Browser launched");
log.warn("Slow response");
log.error("Failed to connect");
log.debug("Internal state");
```

Output:

```
[unibrowser] Browser launched
[unibrowser:warn] Slow response
[unibrowser:error] Failed to connect
[unibrowser:debug] Internal state  (only with debug level)
```

### `setLogLevel(level)`

Change log level.

```typescript
import { setLogLevel } from "unibrowser";

setLogLevel("silent"); // no output
setLogLevel("info");   // info, warn, error (default)
setLogLevel("debug");  // everything
```

### `createLogger(level?)`

Create a custom logger instance.

```typescript
import { createLogger } from "unibrowser";

const log = createLogger("debug");
log.debug("Custom logger debug message");
```

## Screenshot Utilities

### `captureScreenshot(page, options?)`

Take a screenshot using a raw Playwright Page.

```typescript
import { captureScreenshot } from "unibrowser";

const buffer = await captureScreenshot(page.raw, { fullPage: true });
```

### `compareScreenshots(actual, expected)`

Pixel-by-pixel PNG comparison.

```typescript
import { compareScreenshots } from "unibrowser";

const result = await compareScreenshots(actualBuffer, expectedBuffer);
console.log(result.diffPercent); // 2.34
```

Returns `CompareResult`:

| Field | Type | Description |
|---|---|---|
| `match` | `boolean` | Exact match |
| `diffPercent` | `number` | % of pixels different |
| `diffPixels` | `number` | Count of different pixels |
| `totalPixels` | `number` | Total pixels |

### `assertScreenshotMatches(page, baselinePath, threshold?)`

Compare page against baseline. Creates baseline on first run.

```typescript
import { assertScreenshotMatches } from "unibrowser";

await assertScreenshotMatches(page.raw, "./baseline.png", 0.1);
```
