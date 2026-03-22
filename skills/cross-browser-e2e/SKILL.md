---
name: cross-browser-e2e
description: Write cross-browser E2E tests using unibrowser. When asked to write E2E tests, browser tests, or UI tests, use this skill to generate tests that run across Chromium, Firefox, and Safari (WebKit) automatically. Supports page navigation, element locators, form interactions, assertions, and screenshots.
license: Apache-2.0
allowed-tools: Bash(npx:*) Bash(npm:*) Read Write Glob Grep
---

# Cross-Browser E2E Testing with unibrowser

unibrowser is a headless cross-browser E2E testing package for TypeScript. Write one test suite, run it across Chromium, Firefox, and WebKit (Safari) automatically.

## Setup

```bash
npm install unibrowser
npx playwright install chromium firefox webkit
```

On Linux, also install system deps:
```bash
npx playwright install-deps
```

## Writing Tests

Use `crossBrowserSuite()` to write tests. Each test runs across all 3 browsers automatically.

```typescript
import { expect } from "vitest";
import { crossBrowserSuite } from "unibrowser";

crossBrowserSuite("My Feature", (test) => {
  test("should load the page", async ({ page }) => {
    await page.goto("https://example.com");
    await page.expectTitle("Example Domain");
  });
});
```

The `test` callback receives `{ page, browser }` where:
- `page` is a `UniPage` with helpers for navigation, locators, and assertions
- `browser` is a `UniBrowser` instance

## Navigation

```typescript
await page.goto("https://example.com");
await page.reload();
await page.goBack();
await page.goForward();
const title = await page.title();
const url = page.url();
```

## Finding Elements

```typescript
// CSS selector
const h1 = page.locator("h1");

// By text
const el = page.getByText("Click me");

// By ARIA role
const heading = page.getByRole("heading", { name: "Welcome" });

// By label
const input = page.getByLabel("Email");

// By placeholder
const input = page.getByPlaceholder("Enter email");

// By test ID
const el = page.getByTestId("login-button");
```

## Scoping & Filtering

```typescript
// Scope to child element
const form = page.locator("#login");
const email = form.locator('input[name="email"]');

// Filter by text
const item = page.locator("li").filter({ hasText: "Buy milk" });

// Filter by nested element
const row = page.locator("tr").filter({ has: page.getByRole("cell", { name: "Done" }) });

// Semantic locators work on scoped elements
const heading = form.getByRole("heading", { name: "Sign in" });
const button = form.getByRole("button", { name: "Submit" });

// Find element containing another element
const div = page.locator("div", { has: page.getByRole("heading") });

// Access underlying Playwright locator
const pwLocator = page.locator("h1").raw;
```

## Element Interactions

```typescript
await el.click();
await el.dblclick();
await el.type("hello");
await el.clear();
await el.hover();
await el.focus();
await el.press("Enter");
await el.check();
await el.uncheck();
await el.selectOption("red");
```

## Element State

```typescript
const visible = await el.isVisible();
const hidden = await el.isHidden();
const enabled = await el.isEnabled();
const checked = await el.isChecked();
const text = await el.innerText();
const value = await el.inputValue();
const href = await el.getAttribute("href");
const count = await el.count();
```

## Page Assertions

```typescript
await page.expectTitle("My App");
await page.expectTitle(/My App/);
await page.expectTitleContains("Dashboard");
await page.expectURL("**/dashboard");
await page.expectURLContains("dashboard");
```

## Element Assertions

```typescript
await el.expectVisible();
await el.expectHidden();
await el.expectText("Welcome");
await el.expectTextContains("Welcome");
await el.expectEnabled();
await el.expectDisabled();
await el.expectChecked();
await el.expectAttribute("href", "/dashboard");
```

## Screenshot

```typescript
const buffer = await page.screenshot();
const buffer = await page.screenshot({ fullPage: true });
const buffer = await page.screenshot({ type: "jpeg", quality: 80 });
const buffer = await el.screenshot();

// Visual regression - auto-creates baseline on first run
await page.expectScreenshot("./screenshots/home.png");
```

## JavaScript Evaluation

```typescript
const title = await page.evaluate(() => document.title);
const count = await page.evaluate(() => document.querySelectorAll("a").length);
```

## Browser Management

```typescript
import { ensureAll, printBrowserStatus, getPlatformInfo } from "unibrowser";

// Install all browsers + system deps
ensureAll();

// Check browser status
printBrowserStatus();

// Get platform info
const info = getPlatformInfo(); // { os, arch, supported }
```

## Custom Browser List

Run tests on a subset of browsers:

```typescript
crossBrowserSuite("Quick Test", (test) => {
  test("works", async ({ page }) => {
    await page.goto("https://example.com");
  });
}, { browsers: ["chromium", "firefox"] });
```

Or via environment variable:
```bash
UNIBROWSER_BROWSERS=chromium npm run test:e2e
```

## Network Interception

```typescript
// Mock API
await page.raw.context().route("**/api/user", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ name: "Test User" }),
  });
});

// Block images
await page.raw.context().route("**/*.{png,jpg}", (route) => route.abort());

// Offline
await page.raw.context().setOffline(true);
```

## File Structure

Place tests in `tests/e2e/`:

```
tests/
├── unit/           # Unit tests (vitest, no browser)
│   └── *.test.ts
└── e2e/            # E2E tests (cross-browser)
    └── *.test.ts
```

## Running Tests

```bash
npx vitest run              # All tests
npx vitest run tests/e2e    # E2E only
npx vitest                  # Watch mode

# Browser-specific
npm run test:chromium        # Chromium only
npm run test:firefox         # Firefox only
npm run test:webkit          # WebKit only
```

## Speed Optimization

Use a single-thread Vitest config for browser pool reuse (~3x faster):

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "threads",
    poolOptions: {
      threads: { singleThread: true },
    },
  },
});
```

For SPAs, set `waitUntil: "domcontentloaded"` for faster navigation:

```typescript
const browser = await UniBrowser.launch("chromium", { waitUntil: "domcontentloaded" });
```

## TypeScript Config

unibrowser requires ESM:

```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16",
    "target": "ES2022",
    "strict": true
  }
}
```
