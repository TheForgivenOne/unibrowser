import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Interactions", (test) => {
  test("fills a form input", async ({ page }) => {
    await page.goto("http://httpbin.org/forms/post");
    const input = page.locator('input[name="custname"]');
    await input.waitFor({ state: "visible" });
    await input.type("Test User");
    const value = await input.inputValue();
    expect(value).toBe("Test User");
  });

  test("clears a form input", async ({ page }) => {
    const input = page.locator('input[name="custname"]');
    await input.clear();
    const value = await input.inputValue();
    expect(value).toBe("");
  });

  test("checks a checkbox", async ({ page }) => {
    const checkbox = page.locator('input[value="bacon"]');
    await checkbox.waitFor({ state: "visible" });
    await checkbox.check();
    expect(await checkbox.isChecked()).toBe(true);
  });

  test("unchecks a checkbox", async ({ page }) => {
    const checkbox = page.locator('input[value="bacon"]');
    await checkbox.uncheck();
    expect(await checkbox.isChecked()).toBe(false);
  });

  test("hovers over element", async ({ page }) => {
    await page.goto("http://example.com");
    const h1 = page.locator("h1");
    await h1.hover();
  });

  test("focuses and blurs element", async ({ page }) => {
    const link = page.locator("a");
    await link.focus();
    await link.blur();
  });

  test("gets bounding box", async ({ page }) => {
    const h1 = page.locator("h1");
    const box = await h1.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });
});
