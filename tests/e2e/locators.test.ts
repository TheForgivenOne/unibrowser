import { expect } from "vitest";
import { crossBrowserSuite } from "../../src/index.js";

crossBrowserSuite("Locators", (test) => {
  test("finds element by CSS selector", async ({ page }) => {
    await page.goto("http://example.com");
    const h1 = page.locator("h1");
    await h1.waitFor({ state: "visible" });
    expect(await h1.isVisible()).toBe(true);
  });

  test("gets element inner text", async ({ page }) => {
    const h1 = page.locator("h1");
    const text = await h1.innerText();
    expect(text).toBe("Example Domain");
  });

  test("finds element by text", async ({ page }) => {
    const el = page.getByText("Example Domain");
    expect(await el.isVisible()).toBe(true);
  });

  test("finds element by ARIA role", async ({ page }) => {
    const heading = page.getByRole("heading");
    expect(await heading.isVisible()).toBe(true);
  });

  test("gets element attribute", async ({ page }) => {
    const link = page.locator("a");
    const href = await link.getAttribute("href");
    expect(href).toContain("iana.org");
  });

  test("counts matching elements", async ({ page }) => {
    const links = page.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("gets all matching elements", async ({ page }) => {
    const all = await page.locator("a").all();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });

  test("gets innerHTML", async ({ page }) => {
    const body = page.locator("body");
    const html = await body.innerHTML();
    expect(html).toContain("Example Domain");
  });

  test("checks element is enabled", async ({ page }) => {
    const link = page.locator("a");
    expect(await link.isEnabled()).toBe(true);
  });

  test("scopes locators", async ({ page }) => {
    const div = page.locator("div");
    const h1 = div.locator("h1");
    const text = await h1.innerText();
    expect(text).toBe("Example Domain");
  });

  test("filters elements by text", async ({ page }) => {
    await page.goto("http://example.com");
    const link = page.locator("a").filter({ hasText: "Learn more" });
    const text = await link.innerText();
    expect(text).toContain("Learn more");
  });

  test("filters elements by has option", async ({ page }) => {
    await page.goto("http://example.com");
    const divWithHeading = page.locator("div").filter({ has: page.getByRole("heading") });
    expect(await divWithHeading.isVisible()).toBe(true);
  });

  test("getByRole on scoped element", async ({ page }) => {
    await page.goto("http://example.com");
    const body = page.locator("body");
    const heading = body.getByRole("heading");
    const text = await heading.innerText();
    expect(text).toBe("Example Domain");
  });

  test("getByText on scoped element", async ({ page }) => {
    await page.goto("http://example.com");
    const body = page.locator("body");
    const el = body.getByText("Example Domain");
    expect(await el.isVisible()).toBe(true);
  });

  test("locator with has option", async ({ page }) => {
    await page.goto("http://example.com");
    const div = page.locator("div", { has: page.getByRole("heading") });
    expect(await div.isVisible()).toBe(true);
  });
});
