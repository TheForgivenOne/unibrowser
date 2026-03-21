import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Expect assertions", (test) => {
  test("expectTitle passes", async ({ page }) => {
    await page.goto("http://example.com");
    await page.expectTitle("Example Domain");
  });

  test("expectTitle throws for wrong title", async ({ page }) => {
    await expect(page.expectTitle("Wrong Title")).rejects.toThrow();
  });

  test("expectTitle with regex", async ({ page }) => {
    await page.expectTitle(/Example/);
  });

  test("expectTitleContains passes", async ({ page }) => {
    await page.expectTitleContains("Example");
  });

  test("expectURL passes", async ({ page }) => {
    await page.expectURL("http://example.com/");
  });

  test("expectURL throws for wrong URL", async ({ page }) => {
    await expect(page.expectURL("http://wrong.com/")).rejects.toThrow();
  });

  test("expectURLContains passes", async ({ page }) => {
    await page.expectURLContains("example.com");
  });

  test("element.expectVisible passes", async ({ page }) => {
    const h1 = page.locator("h1");
    await h1.expectVisible();
  });

  test("element.expectText passes", async ({ page }) => {
    const h1 = page.locator("h1");
    await h1.expectText("Example Domain");
  });

  test("element.expectTextContains passes", async ({ page }) => {
    const h1 = page.locator("h1");
    await h1.expectTextContains("Example");
  });

  test("element.expectEnabled passes", async ({ page }) => {
    const link = page.locator("a");
    await link.expectEnabled();
  });
});
