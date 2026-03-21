---
layout: home

hero:
  name: unibrowser
  text: Cross-Browser E2E Testing
  tagline: Write one test. Run it across Chrome, Firefox, and Safari. Full type safety, zero boilerplate.
  image:
    src: /logo.svg
    alt: unibrowser
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/TheForgivenOne/unibrowser

features:
  - icon: 🌐
    title: Cross-Browser
    details: One test suite runs across Chromium, Firefox, and WebKit (Safari) automatically. Write once, test everywhere.
  - icon: 🔒
    title: Type-Safe
    details: Full TypeScript with strict mode. Every method, every option, every return type is fully typed with IntelliSense.
  - icon: ⚡
    title: Zero Boilerplate
    details: crossBrowserSuite() handles browser lifecycle for you. No manual launch, close, or setup code needed.
  - icon: 📸
    title: Visual Regression
    details: Built-in screenshot capture and pixel-level comparison. Auto-creates baselines on first run.
  - icon: 📦
    title: Auto-Download
    details: ensureAll() installs browsers and system dependencies programmatically. Works on Linux, macOS, and Windows.
  - icon: 🤖
    title: CI-Ready
    details: Headless by default. Works in Docker, GitHub Actions, GitLab CI. Includes ready-made workflow templates.
---

## Quick Example

```typescript
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

```bash
npx vitest run
```

```
✓ My App [chromium] > loads homepage
✓ My App [firefox]  > loads homepage
✓ My App [webkit]   > loads homepage
```

## Install

```bash
npm install unibrowser
npx playwright install chromium firefox webkit
```

## Browsers

| Browser | Engine | Supported |
|---|---|---|
| Chrome | Chromium | ✔ |
| Edge | Chromium | ✔ |
| Firefox | Firefox | ✔ |
| Safari | WebKit | ✔ |
