export interface RetryWaitOptions {
  timeout?: number;
  interval?: number;
  message?: string;
}

export async function waitFor<T>(
  fn: () => T | Promise<T>,
  predicate: (result: T) => boolean,
  options: RetryWaitOptions = {},
): Promise<T> {
  const timeout = options.timeout ?? 5_000;
  const interval = options.interval ?? 100;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const result = await fn();
    if (predicate(result)) {
      return result;
    }
    await sleep(interval);
  }

  throw new Error(
    options.message ?? `waitFor timed out after ${timeout}ms`,
  );
}

export async function waitForTrue(
  fn: () => boolean | Promise<boolean>,
  options: RetryWaitOptions = {},
): Promise<void> {
  await waitFor(fn, (v) => v, { ...options, message: options.message ?? "Condition not met" });
}

export async function retry<T>(
  fn: () => T | Promise<T>,
  attempts = 3,
  delay = 1_000,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
