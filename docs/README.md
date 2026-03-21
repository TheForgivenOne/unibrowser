# unibrowser

**Write one test. Run it across Chrome, Firefox, and Safari.**

unibrowser is a headless cross-browser E2E testing package for TypeScript. It wraps Playwright with a simpler, fully-typed API and runs your tests across Chromium, Firefox, and WebKit (Safari) automatically.

## Features

- **Cross-browser** — Chromium, Firefox, WebKit (Safari) from a single test
- **Type-safe** — strict TypeScript, full IntelliSense
- **Auto-download** — installs browsers on demand
- **Built-in assertions** — `expectTitle()`, `expectVisible()`, `expectText()`
- **Visual regression** — screenshot capture and pixel comparison
- **CI-ready** — headless by default, works in Docker

## Supported Browsers

| Browser | Engine | Status |
|---|---|---|
| Chrome | Chromium | ✔ Supported |
| Edge | Chromium | ✔ Supported |
| Firefox | Firefox | ✔ Supported |
| Safari | WebKit | ✔ Supported |

## Quick Example

```typescript
import { expect } from "vitest";
import { crossBrowserSuite } from "unibrowser";

crossBrowserSuite("My App", (test) => {
  test("loads homepage", async ({ page }) => {
    await page.goto("https://example.com");
    await page.expectTitle("Example Domain");
    const h1 = page.locator("h1");
    await h1.expectText("Example Domain");
  });
});
```

Run it:

```bash
npx vitest run
```

Output:

```
✓ My App [chromium] > loads homepage
✓ My App [firefox]  > loads homepage
✓ My App [webkit]   > loads homepage
```

## Installation

```bash
npm install unibrowser
npx playwright install chromium firefox webkit
```

Or install programmatically:

```typescript
import { ensureAll } from "unibrowser";
ensureAll(); // downloads browsers + system deps
```

## Documentation

### Getting Started
- [Installation & Setup](./getting-started.md)

### API Reference
- [UniBrowser](./api/unibrowser.md) — launch, close, browser management
- [UniPage](./api/page.md) — navigation, locators, interactions
- [UniElement](./api/element.md) — element queries, assertions
- [UniContext](./api/context.md) — cookies, routes, permissions
- [Browser Manager](./api/manager.md) — install, status, platform info

### Guides
- [Cross-Browser Testing](./guides/cross-browser.md) — one test, all browsers
- [Assertions](./guides/assertions.md) — built-in expect helpers
- [Screenshots](./guides/screenshots.md) — capture and visual regression
- [Network](./guides/network.md) — request interception, offline mode
- [CI/CD](./guides/ci-cd.md) — GitHub Actions, GitLab, Docker

### Reference
- [Types](./reference/types.md) — all TypeScript interfaces
- [Configuration](./reference/config.md) — defaults, overrides
- [Utilities](./reference/utils.md) — wait, retry, logger
- [Pyright](./pyright.md) — Python type interop
