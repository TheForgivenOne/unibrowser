import type { Page as PlaywrightPage } from "playwright";
import { readFile } from "node:fs/promises";
import type { ScreenshotOptions } from "../browser/types.js";

export async function captureScreenshot(
  page: PlaywrightPage,
  options?: ScreenshotOptions,
): Promise<Buffer> {
  const screenshotOpts: {
    path?: string;
    fullPage: boolean;
    clip?: { x: number; y: number; width: number; height: number };
    quality?: number;
    type?: "png" | "jpeg";
  } = {
    fullPage: options?.fullPage ?? false,
  };
  if (options?.path !== undefined) screenshotOpts.path = options.path;
  if (options?.clip !== undefined) screenshotOpts.clip = options.clip;
  if (options?.quality !== undefined) screenshotOpts.quality = options.quality;
  if (options?.type !== undefined) screenshotOpts.type = options.type;

  return page.screenshot(screenshotOpts);
}

export interface CompareResult {
  match: boolean;
  diffPercent: number;
  diffPixels: number;
  totalPixels: number;
}

interface DecodedPng {
  width: number;
  height: number;
  data: Buffer;
}

async function decodePng(buffer: Buffer): Promise<DecodedPng> {
  const { PNG } = await import("pngjs");
  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(buffer, (error: Error | null, data: DecodedPng) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

export async function compareScreenshots(
  actual: Buffer,
  expected: Buffer,
): Promise<CompareResult> {
  const img1 = await decodePng(actual);
  const img2 = await decodePng(expected);

  if (img1.width !== img2.width || img1.height !== img2.height) {
    return {
      match: false,
      diffPercent: 100,
      diffPixels: img1.width * img1.height,
      totalPixels: img1.width * img1.height,
    };
  }

  const totalPixels = img1.width * img1.height;
  let diffPixels = 0;

  for (let i = 0; i < img1.data.length; i += 4) {
    const dr = Math.abs(img1.data[i]! - img2.data[i]!);
    const dg = Math.abs(img1.data[i + 1]! - img2.data[i + 1]!);
    const db = Math.abs(img1.data[i + 2]! - img2.data[i + 2]!);

    if (dr + dg + db > 0) {
      diffPixels++;
    }
  }

  const diffPercent = (diffPixels / totalPixels) * 100;

  return {
    match: diffPixels === 0,
    diffPercent,
    diffPixels,
    totalPixels,
  };
}

export async function assertScreenshotMatches(
  page: PlaywrightPage,
  baselinePath: string,
  threshold = 0.1,
): Promise<void> {
  const actual = await captureScreenshot(page);
  let expected: Buffer;

  try {
    expected = await readFile(baselinePath);
  } catch {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    await mkdir(dirname(baselinePath), { recursive: true });
    await writeFile(baselinePath, actual);
    return;
  }

  const result = await compareScreenshots(actual, expected);

  if (result.diffPercent > threshold) {
    throw new Error(
      `Screenshot mismatch: ${result.diffPercent.toFixed(2)}% different (${result.diffPixels}/${result.totalPixels} pixels)`,
    );
  }
}
