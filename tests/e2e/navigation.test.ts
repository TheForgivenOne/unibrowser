import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Navigation", (test) => {
  test("navigates to example.com", async ({ page }) => {
    const response = await page.goto("http://example.com");
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test("gets page title", async ({ page }) => {
    const title = await page.title();
    expect(title).toBe("Example Domain");
  });

  test("gets current URL", async ({ page }) => {
    const url = page.url();
    expect(url).toContain("example.com");
  });

  test("gets page content", async ({ page }) => {
    const content = await page.content();
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("Example Domain");
  });

  test("reloads page", async ({ page }) => {
    const response = await page.reload();
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test("navigates forward and back", async ({ page }) => {
    await page.goto("http://example.com");
    await page.goto("http://httpbin.org/get");
    await page.waitForLoadState("load");

    await page.goBack();
    expect(page.url()).toContain("example.com");

    await page.goForward();
    expect(page.url()).toContain("httpbin.org");
  });

  test("evaluates JavaScript", async ({ page }) => {
    await page.goto("http://example.com");
    const result = await page.evaluate(() => document.title);
    expect(result).toBe("Example Domain");
  });
});
