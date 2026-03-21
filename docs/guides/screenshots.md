# Screenshots

Capture screenshots and run visual regression tests.

## Capture

### Page Screenshot

```typescript
const buffer = await page.screenshot();
const buffer = await page.screenshot({ fullPage: true });
const buffer = await page.screenshot({ path: "output.png" });
```

### Element Screenshot

```typescript
const h1 = page.locator("h1");
const buffer = await h1.screenshot();
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | - | Save to file |
| `fullPage` | `boolean` | `false` | Capture entire scrollable page |
| `clip` | `{ x, y, width, height }` | - | Crop to region |
| `quality` | `number` | - | JPEG quality (0-100) |
| `type` | `"png" \| "jpeg"` | `"png"` | Image format |

### Save to File

```typescript
await page.screenshot({ path: "./screenshots/homepage.png" });
await page.screenshot({ path: "./screenshots/homepage.jpg", type: "jpeg", quality: 90 });
```

### Full Page

Capture the entire page, not just the viewport:

```typescript
const buffer = await page.screenshot({ fullPage: true });
```

### Crop Region

```typescript
const buffer = await page.screenshot({
  clip: { x: 0, y: 0, width: 800, height: 600 },
});
```

## Visual Regression

### `page.expectScreenshot(baselinePath, threshold?)`

Compare the current page against a baseline image.

```typescript
await page.expectScreenshot("./screenshots/homepage.png");
```

**First run:** Creates the baseline file automatically.

**Subsequent runs:** Compares pixel-by-pixel. Throws if diff exceeds threshold.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `baselinePath` | `string` | required | Path to baseline image |
| `threshold` | `number` | `0.1` | Max allowed diff percentage (0-100) |

```typescript
// Allow up to 5% difference
await page.expectScreenshot("./baseline.png", 5);
```

### `compareScreenshots(actual, expected)`

Manual comparison. Returns detailed diff info.

```typescript
import { compareScreenshots } from "unibrowser";

const result = await compareScreenshots(actualBuffer, expectedBuffer);
// {
//   match: false,
//   diffPercent: 2.34,
//   diffPixels: 23400,
//   totalPixels: 1000000
// }
```

| Field | Type | Description |
|---|---|---|
| `match` | `boolean` | Exact pixel match |
| `diffPercent` | `number` | Percentage of different pixels |
| `diffPixels` | `number` | Count of different pixels |
| `totalPixels` | `number` | Total pixel count |

## Cross-Browser Screenshots

Screenshots may differ slightly between browsers. Use a threshold:

```typescript
crossBrowserSuite("Visual", (test) => {
  test("homepage looks correct", async ({ page }) => {
    await page.goto("https://example.com");
    // Allow 2% difference between browsers
    await page.expectScreenshot(`./screenshots/home.png`, 2);
  });
});
```
