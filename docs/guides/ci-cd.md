# CI/CD

Run unibrowser tests in continuous integration.

## GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Install browsers
        run: npx playwright install --with-deps chromium firefox webkit

      - name: Run tests
        run: npx vitest run
```

### Cache Browsers

```yaml
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('node_modules/playwright/package.json') }}

      - name: Install browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps chromium firefox webkit
```

## GitLab CI

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.48.0-noble
  script:
    - npm ci
    - npx vitest run
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
```

## Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-noble

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx vitest run
```

## Programmatic Install

Skip manual `npx playwright install` by calling `ensureAll()` in your test setup:

```typescript
// vitest.setup.ts
import { ensureAll } from "unibrowser";
ensureAll(); // installs browsers + system deps
```

Or in your test file:

```typescript
import { ensureBrowsers } from "unibrowser";

beforeAll(() => {
  ensureBrowsers({ browsers: ["chromium", "firefox", "webkit"] });
});
```

## Environment Variables

| Variable | Description |
|---|---|
| `PLAYWRIGHT_BROWSERS_PATH` | Custom browser install location |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | Skip browser download during `npm install` |

## Parallel Execution

Vitest runs tests in parallel by default. For CI, limit workers:

```bash
npx vitest run --pool=forks --poolOptions.forks.maxForks=2
```

## Headless Mode

unibrowser runs headless by default. No extra config needed for CI.

```typescript
const browser = await UniBrowser.launch("chromium"); // headless: true is default
```
