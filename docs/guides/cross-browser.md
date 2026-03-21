# Cross-Browser Testing

Write one test suite. Run it across Chromium, Firefox, and WebKit (Safari) automatically.

## `crossBrowserSuite()`

```typescript
import { crossBrowserSuite } from "unibrowser";

crossBrowserSuite("My Feature", (test) => {
  test("should work", async ({ page }) => {
    await page.goto("https://example.com");
    await page.expectTitle("Example Domain");
  });
});
```

This runs the test 3 times:

```
✓ My Feature [chromium] > should work
✓ My Feature [firefox]  > should work
✓ My Feature [webkit]   > should work
```

## How It Works

`crossBrowserSuite` wraps Vitest's `describe.each`. For each browser:

1. **beforeAll** — launches the browser headlessly, creates a page
2. **Your tests** — each `test()` receives `{ page, browser }`
3. **afterAll** — closes page and browser

You never manage browser lifecycle manually.

## The Test Callback

Each test receives a `CrossBrowserContext`:

```typescript
test("example", async ({ page, browser }) => {
  // page: UniPage — the page for this browser
  // browser: UniBrowser — the browser instance
});
```

## Writing Multiple Tests

Register as many tests as you need:

```typescript
crossBrowserSuite("Navigation", (test) => {
  test("loads homepage", async ({ page }) => {
    await page.goto("https://example.com");
    await page.expectTitle("Example Domain");
  });

  test("navigates to subpage", async ({ page }) => {
    await page.goto("https://example.com/about");
    await page.expectURLContains("/about");
  });

  test("back button works", async ({ page }) => {
    await page.goto("https://example.com");
    await page.goto("https://example.com/about");
    await page.goBack();
    await page.expectURL("https://example.com/");
  });
});
```

## Custom Browser List

By default, tests run on all 3 browsers. Specify a subset:

```typescript
import { crossBrowserSuite } from "unibrowser";

// Only test Chromium and Firefox
crossBrowserSuite("Quick Test", (test) => {
  test("works", async ({ page }) => {
    await page.goto("https://example.com");
  });
}, ["chromium", "firefox"]);
```

## Full Example: Login Flow

```typescript
import { expect } from "vitest";
import { crossBrowserSuite } from "unibrowser";

crossBrowserSuite("Authentication", (test) => {
  test("displays login form", async ({ page }) => {
    await page.goto("https://myapp.com/login");
    await page.getByLabel("Email").expectVisible();
    await page.getByLabel("Password").expectVisible();
    await page.getByRole("button", { name: "Sign in" }).expectVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("https://myapp.com/login");
    await page.getByLabel("Email").type("wrong@test.com");
    await page.getByLabel("Password").type("badpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.locator(".error").expectTextContains("Invalid credentials");
  });

  test("logs in successfully", async ({ page }) => {
    await page.goto("https://myapp.com/login");
    await page.getByLabel("Email").type("user@test.com");
    await page.getByLabel("Password").type("correctpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard");
    await page.expectURLContains("/dashboard");
  });
});
```

This runs 9 tests total (3 tests x 3 browsers).

## Combining with Vitest

`crossBrowserSuite` is standard Vitest. Use all Vitest features:

- `expect()` for assertions
- `beforeAll` / `afterAll` if needed (but lifecycle is handled)
- Vitest config (parallel, timeout, etc.)

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 30000,
    include: ["tests/**/*.test.ts"],
  },
});
```
