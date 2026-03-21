import { describe, it, expect } from "vitest";
import { loadConfig, resolveBrowserType, DEFAULTS } from "../../src/config/config.js";

describe("config", () => {
  it("returns defaults when no overrides", () => {
    const config = loadConfig();
    expect(config.headless).toBe(true);
    expect(config.defaultBrowser).toBe("chromium");
    expect(config.viewport.width).toBe(1280);
    expect(config.viewport.height).toBe(720);
    expect(config.timeout.navigation).toBe(30_000);
  });

  it("merges overrides with defaults", () => {
    const config = loadConfig({
      headless: false,
      defaultBrowser: "firefox",
      viewport: { width: 1920, height: 1080 },
    });
    expect(config.headless).toBe(false);
    expect(config.defaultBrowser).toBe("firefox");
    expect(config.viewport.width).toBe(1920);
    expect(config.viewport.height).toBe(1080);
    expect(config.timeout.navigation).toBe(30_000);
  });

  it("merges timeout overrides", () => {
    const config = loadConfig({
      timeout: { navigation: 60_000, action: 15_000, expect: 10_000 },
    });
    expect(config.timeout.navigation).toBe(60_000);
    expect(config.timeout.action).toBe(15_000);
    expect(config.timeout.expect).toBe(10_000);
  });

  it("defaults are not mutated", () => {
    const original = { ...DEFAULTS };
    loadConfig({ headless: false });
    expect(DEFAULTS.headless).toBe(original.headless);
  });
});

describe("resolveBrowserType", () => {
  it("maps chromium to chromium", () => {
    expect(resolveBrowserType("chromium")).toBe("chromium");
  });

  it("maps chrome to chromium", () => {
    expect(resolveBrowserType("chrome")).toBe("chromium");
  });

  it("maps edge to chromium", () => {
    expect(resolveBrowserType("edge")).toBe("chromium");
  });

  it("maps firefox to firefox", () => {
    expect(resolveBrowserType("firefox")).toBe("firefox");
  });

  it("maps safari to webkit", () => {
    expect(resolveBrowserType("safari")).toBe("webkit");
  });

  it("maps webkit to webkit", () => {
    expect(resolveBrowserType("webkit")).toBe("webkit");
  });
});
