import { describe, it, expect } from "vitest";
import { sleep, retry, waitFor, waitForTrue } from "../../src/utils/wait.js";

describe("wait utilities", () => {
  it("sleep resolves after delay", async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });

  it("retry succeeds on first try", async () => {
    let calls = 0;
    const result = await retry(async () => {
      calls++;
      return "ok";
    });
    expect(result).toBe("ok");
    expect(calls).toBe(1);
  });

  it("retry retries on failure then succeeds", async () => {
    let calls = 0;
    const result = await retry(
      async () => {
        calls++;
        if (calls < 3) throw new Error("fail");
        return "ok";
      },
      3,
      10,
    );
    expect(result).toBe("ok");
    expect(calls).toBe(3);
  });

  it("retry throws after all attempts fail", async () => {
    await expect(
      retry(
        async () => {
          throw new Error("always fail");
        },
        2,
        10,
      ),
    ).rejects.toThrow("always fail");
  });

  it("waitFor returns value when predicate is met", async () => {
    let count = 0;
    const result = await waitFor(
      () => {
        count++;
        return count;
      },
      (v) => v >= 3,
      { timeout: 1000, interval: 10 },
    );
    expect(result).toBe(3);
  });

  it("waitFor throws on timeout", async () => {
    await expect(
      waitFor(() => false, (v) => v === true, { timeout: 50, interval: 10 }),
    ).rejects.toThrow("timed out");
  });

  it("waitForTrue resolves when condition is true", async () => {
    let ready = false;
    setTimeout(() => (ready = true), 50);
    await waitForTrue(() => ready, { timeout: 500, interval: 10 });
    expect(ready).toBe(true);
  });

  it("waitForTrue throws on timeout", async () => {
    await expect(
      waitForTrue(() => false, { timeout: 50, interval: 10 }),
    ).rejects.toThrow("Condition not met");
  });
});
