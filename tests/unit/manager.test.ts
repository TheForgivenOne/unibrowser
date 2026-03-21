import { describe, it, expect } from "vitest";
import {
  getBrowserStatus,
  getAllBrowserStatus,
  getMissingBrowsers,
  isBrowserInstalled,
  validateBrowser,
} from "../../src/browser/manager.js";

describe("BrowserManager", () => {
  describe("getBrowserStatus", () => {
    it("returns status for chromium", () => {
      const status = getBrowserStatus("chromium");
      expect(status.name).toBe("chromium");
      expect(status.type).toBe("chromium");
      expect(typeof status.installed).toBe("boolean");
    });

    it("returns status for firefox", () => {
      const status = getBrowserStatus("firefox");
      expect(status.name).toBe("firefox");
      expect(status.type).toBe("firefox");
    });

    it("returns status for webkit", () => {
      const status = getBrowserStatus("webkit");
      expect(status.name).toBe("webkit");
      expect(status.type).toBe("webkit");
    });

    it("maps chrome to chromium type", () => {
      const status = getBrowserStatus("chrome");
      expect(status.name).toBe("chrome");
      expect(status.type).toBe("chromium");
    });

    it("maps safari to webkit type", () => {
      const status = getBrowserStatus("safari");
      expect(status.name).toBe("safari");
      expect(status.type).toBe("webkit");
    });

    it("maps edge to chromium type", () => {
      const status = getBrowserStatus("edge");
      expect(status.name).toBe("edge");
      expect(status.type).toBe("chromium");
    });

    it("includes path when installed", () => {
      const status = getBrowserStatus("chromium");
      if (status.installed) {
        expect(status.path).toBeTruthy();
        expect(typeof status.path).toBe("string");
      }
    });
  });

  describe("getAllBrowserStatus", () => {
    it("returns status for all 6 browsers", () => {
      const statuses = getAllBrowserStatus();
      expect(statuses).toHaveLength(6);
      const names = statuses.map((s) => s.name);
      expect(names).toContain("chromium");
      expect(names).toContain("chrome");
      expect(names).toContain("edge");
      expect(names).toContain("firefox");
      expect(names).toContain("safari");
      expect(names).toContain("webkit");
    });
  });

  describe("isBrowserInstalled", () => {
    it("returns boolean for chromium", () => {
      const installed = isBrowserInstalled("chromium");
      expect(typeof installed).toBe("boolean");
    });

    it("chromium, firefox, webkit share install status by type", () => {
      const chromium = isBrowserInstalled("chromium");
      const chrome = isBrowserInstalled("chrome");
      const edge = isBrowserInstalled("edge");
      expect(chromium).toBe(chrome);
      expect(chromium).toBe(edge);
    });
  });

  describe("getMissingBrowsers", () => {
    it("returns array of missing browsers", () => {
      const missing = getMissingBrowsers();
      expect(Array.isArray(missing)).toBe(true);
      for (const name of missing) {
        expect(["chromium", "chrome", "edge", "firefox", "safari", "webkit"]).toContain(name);
      }
    });

    it("same type browsers are all missing or all installed together", () => {
      const missing = getMissingBrowsers();
      const chromiumMissing = missing.includes("chromium");
      expect(missing.includes("chrome")).toBe(chromiumMissing);
      expect(missing.includes("edge")).toBe(chromiumMissing);
    });
  });

  describe("validateBrowser", () => {
    it("does not throw for installed browsers", () => {
      const statuses = getAllBrowserStatus();
      const installed = statuses.filter((s) => s.installed);
      for (const s of installed) {
        expect(() => validateBrowser(s.name)).not.toThrow();
      }
    });

    it("throws for missing browsers", () => {
      const missing = getMissingBrowsers();
      if (missing.length > 0) {
        expect(() => validateBrowser(missing[0]!)).toThrow(/not installed/);
      }
    });
  });
});
