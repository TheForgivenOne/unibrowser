# Getting Started

## Install

```bash
npm install unibrowser
```

## Install Browsers

You need Chromium, Firefox, and WebKit (Safari). Install them via Playwright:

```bash
npx playwright install chromium firefox webkit
```

On Linux, also install system dependencies:

```bash
npx playwright install-deps
```

Or do it programmatically:

```typescript
import { ensureAll } from "unibrowser";
ensureAll(); // installs system deps (Linux) + all browsers
```

## Write Your First Test

Create `tests/e2e/example.test.ts`:

```typescript
import { expect } from "vitest";
import { crossBrowserSuite } from "unibrowser";

crossBrowserSuite("Example", (test) => {
  test("loads page", async ({ page }) => {
    await page.goto("https://example.com");
    await page.expectTitle("Example Domain");
  });

  test("has correct heading", async ({ page }) => {
    const h1 = page.locator("h1");
    await h1.expectText("Example Domain");
  });

  test("has link to IANA", async ({ page }) => {
    const link = page.locator("a");
    const href = await link.getAttribute("href");
    expect(href).toContain("iana.org");
  });
});
```

## Run

```bash
npx vitest run
```

Each test runs across all 3 browsers:

```
✓ Example [chromium] > loads page
✓ Example [chromium] > has correct heading
✓ Example [chromium] > has link to IANA
✓ Example [firefox]  > loads page
✓ Example [firefox]  > has correct heading
✓ Example [firefox]  > has link to IANA
✓ Example [webkit]   > loads page
✓ Example [webkit]   > has correct heading
✓ Example [webkit]   > has link to IANA

Tests  9 passed
```

## Run in Watch Mode

```bash
npx vitest
```

## Run Only E2E Tests

```bash
npx vitest run tests/e2e
```

## TypeScript Setup

unibrowser requires ESM. Your `tsconfig.json` should have:

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

## Type Checking

```bash
npm run typecheck    # tsc --noEmit
npm run pyright      # pyright (Python interop)
```
