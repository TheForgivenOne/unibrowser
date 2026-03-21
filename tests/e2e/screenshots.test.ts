import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Screenshots", (test) => {
  test("takes a page screenshot", async ({ page }) => {
    await page.goto("http://example.com");
    const buffer = await page.screenshot();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  test("screenshot is valid PNG", async ({ page }) => {
    const buffer = await page.screenshot({ type: "png" });
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
    expect(buffer[2]).toBe(0x4E);
    expect(buffer[3]).toBe(0x47);
  });

  test("takes a full page screenshot", async ({ page }) => {
    const buffer = await page.screenshot({ fullPage: true });
    expect(buffer.length).toBeGreaterThan(0);
  });

  test("takes a JPEG screenshot", async ({ page }) => {
    const buffer = await page.screenshot({ type: "jpeg", quality: 80 });
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0xFF);
    expect(buffer[1]).toBe(0xD8);
    expect(buffer[2]).toBe(0xFF);
  });

  test("takes element screenshot", async ({ page }) => {
    const h1 = page.locator("h1");
    await h1.waitFor({ state: "visible" });
    const buffer = await h1.screenshot();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x89);
  });
});
