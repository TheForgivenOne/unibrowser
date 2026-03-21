import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Browser lifecycle", (test) => {
  test("launches successfully", async ({ browser }) => {
    expect(browser).toBeDefined();
    expect(["chromium", "firefox", "webkit"]).toContain(browser.name);
  });

  test("reports connected", async ({ browser }) => {
    expect(browser.isConnected()).toBe(true);
  });

  test("returns version string", async ({ browser }) => {
    const version = browser.version();
    expect(typeof version).toBe("string");
    expect(version.length).toBeGreaterThan(0);
  });

  test("creates a new context", async ({ browser }) => {
    const context = await browser.newContext();
    expect(context).toBeDefined();
    expect(context.raw).toBeDefined();
    await context.close();
  });

  test("creates page with viewport", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });
    const viewport = page.raw.viewportSize();
    expect(viewport?.width).toBe(1920);
    expect(viewport?.height).toBe(1080);
    await page.close();
  });

  test("lists contexts", async ({ browser }) => {
    const ctx = await browser.newContext();
    const contexts = await browser.contexts();
    expect(contexts.length).toBeGreaterThanOrEqual(1);
    await ctx.close();
  });
});
