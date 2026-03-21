import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { platform, arch } from "node:os";
import { chromium, firefox, webkit } from "playwright-core";
import type { BrowserName, BrowserType } from "./types.js";
import { resolveBrowserType } from "../config/config.js";
import { getLogger } from "../utils/logger.js";

export interface BrowserStatus {
  name: BrowserName;
  type: BrowserType;
  installed: boolean;
  path: string | null;
}

export interface EnsureOptions {
  browsers?: BrowserName[];
  force?: boolean;
}

export interface PlatformInfo {
  os: "linux" | "macos" | "windows";
  arch: string;
  supported: BrowserType[];
}

const BROWSER_NAMES: BrowserName[] = [
  "chromium",
  "chrome",
  "edge",
  "firefox",
  "safari",
  "webkit",
];

const ENGINES = { chromium, firefox, webkit } as const;

function getExecutablePath(type: BrowserType): string | null {
  try {
    const path = ENGINES[type].executablePath() as string | undefined;
    if (!path) return null;
    return existsSync(path) ? path : null;
  } catch {
    return null;
  }
}

export function getPlatformInfo(): PlatformInfo {
  const p = platform();
  const osMap: Record<string, "linux" | "macos" | "windows"> = {
    linux: "linux",
    darwin: "macos",
    win32: "windows",
  };
  const os = osMap[p] ?? "linux";

  const supported: BrowserType[] = ["chromium", "firefox"];
  // WebKit on macOS runs natively, on Windows via a port
  if (os === "macos" || os === "linux") {
    supported.push("webkit");
  }

  return {
    os,
    arch: arch(),
    supported,
  };
}

export function getBrowserStatus(browser: BrowserName): BrowserStatus {
  const type = resolveBrowserType(browser);
  const path = getExecutablePath(type);
  return {
    name: browser,
    type,
    installed: path !== null,
    path,
  };
}

export function getAllBrowserStatus(): BrowserStatus[] {
  return BROWSER_NAMES.map((name) => getBrowserStatus(name));
}

export function getMissingBrowsers(): BrowserName[] {
  return BROWSER_NAMES.filter((name) => !getBrowserStatus(name).installed);
}

export function isBrowserInstalled(browser: BrowserName): boolean {
  return getBrowserStatus(browser).installed;
}

export function printBrowserStatus(): void {
  const log = getLogger();
  const statuses = getAllBrowserStatus();
  const info = getPlatformInfo();

  log.info(`Platform: ${info.os} (${info.arch})`);

  // Deduplicate by type
  const seen = new Set<BrowserType>();
  const unique = statuses.filter((s) => {
    if (seen.has(s.type)) return false;
    seen.add(s.type);
    return true;
  });

  log.info("Browser status:");
  for (const s of unique) {
    const icon = s.installed ? "✔" : "✘";
    const aliases = statuses
      .filter((a) => a.type === s.type && a.name !== s.type)
      .map((a) => a.name)
      .join(", ");
    const label = aliases ? `${s.type} (${aliases})` : s.type;
    const location = s.installed ? s.path : "not installed";
    log.info(`  ${icon} ${label} - ${location}`);
  }
}

export function ensureBrowsers(options?: EnsureOptions): void {
  const log = getLogger();
  const targetBrowsers = options?.browsers ?? BROWSER_NAMES;
  const typesToInstall = new Set<BrowserType>();

  // Check which browsers need installing
  for (const browser of targetBrowsers) {
    const status = getBrowserStatus(browser);
    if (options?.force) {
      log.debug(`${browser} (${status.type}) - force reinstall`);
      typesToInstall.add(status.type);
    } else if (!status.installed) {
      log.info(`${browser} (${status.type}) - not found, will install`);
      typesToInstall.add(status.type);
    } else {
      log.debug(`${browser} (${status.type}) - installed at ${status.path}`);
    }
  }

  if (typesToInstall.size === 0) {
    log.info("All browsers already installed.");
    return;
  }

  const typesArr = [...typesToInstall];
  const installArgs = typesArr.join(" ");
  const command = `npx playwright install ${installArgs}`;

  log.info(`Downloading browsers: ${typesArr.join(", ")}`);
  log.debug(`Running: ${command}`);

  try {
    execSync(command, {
      stdio: "inherit",
      timeout: 300_000,
    });
  } catch (error) {
    log.error(`Failed to install browsers: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(
      `Failed to install browsers: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Verify installation
  const stillMissing = targetBrowsers.filter(
    (b) => !getBrowserStatus(b).installed,
  );

  if (stillMissing.length > 0) {
    log.error(`Still missing after install: ${stillMissing.join(", ")}`);
    throw new Error(
      `Browsers still not installed after install: ${stillMissing.join(", ")}`,
    );
  }

  log.info("All browsers installed successfully.");
}

export function ensureDependencies(): void {
  const log = getLogger();
  const info = getPlatformInfo();

  if (info.os !== "linux") {
    log.info("System deps only needed on Linux, skipping.");
    return;
  }

  log.info("Installing system dependencies for browsers...");
  try {
    execSync("npx playwright install-deps", {
      stdio: "inherit",
      timeout: 300_000,
    });
    log.info("System dependencies installed.");
  } catch (error) {
    log.warn(`System deps install may need root: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function ensureAll(): void {
  ensureDependencies();
  ensureBrowsers();
}

export function validateBrowser(browser: BrowserName): void {
  const log = getLogger();
  const status = getBrowserStatus(browser);
  if (!status.installed) {
    log.error(`Browser "${browser}" (${status.type}) is not installed.`);
    throw new Error(
      `Browser "${browser}" (${status.type}) is not installed. ` +
        `Run: npx playwright install ${status.type}`,
    );
  }
}
