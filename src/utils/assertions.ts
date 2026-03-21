import { AssertionError } from "../browser/types.js";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new AssertionError(message);
  }
}

function assertEqual(actual: unknown, expected: unknown, message?: string): void {
  assert(
    actual === expected,
    message ?? `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`,
  );
}

function assertNotEqual(actual: unknown, expected: unknown, message?: string): void {
  assert(
    actual !== expected,
    message ?? `Expected ${JSON.stringify(actual)} to not equal ${JSON.stringify(expected)}`,
  );
}

function assertContains(haystack: string, needle: string, message?: string): void {
  assert(
    haystack.includes(needle),
    message ?? `Expected "${haystack}" to contain "${needle}"`,
  );
}

function assertMatch(value: string, pattern: RegExp, message?: string): void {
  assert(
    pattern.test(value),
    message ?? `Expected "${value}" to match ${pattern}`,
  );
}

function assertTrue(value: boolean, message?: string): void {
  assert(value === true, message ?? `Expected true, got ${value}`);
}

function assertFalse(value: boolean, message?: string): void {
  assert(value === false, message ?? `Expected false, got ${value}`);
}

function assertGreaterThan(actual: number, expected: number, message?: string): void {
  assert(
    actual > expected,
    message ?? `Expected ${actual} > ${expected}`,
  );
}

function assertLessThan(actual: number, expected: number, message?: string): void {
  assert(
    actual < expected,
    message ?? `Expected ${actual} < ${expected}`,
  );
}

function assertLength(
  value: { length: number },
  expected: number,
  message?: string,
): void {
  assertEqual(value.length, expected, message);
}

function assertThrows(
  fn: () => void,
  expectedError?: string | RegExp | { new (...args: unknown[]): Error },
): void {
  try {
    fn();
  } catch (error) {
    if (expectedError === undefined) return;
    if (typeof expectedError === "string" || expectedError instanceof RegExp) {
      const msg = error instanceof Error ? error.message : String(error);
      if (typeof expectedError === "string") {
        assertContains(msg, expectedError);
      } else {
        assertMatch(msg, expectedError);
      }
    } else {
      assert(
        error instanceof expectedError,
        `Expected error of type ${expectedError.name}, got ${error instanceof Error ? error.constructor.name : typeof error}`,
      );
    }
    return;
  }
  throw new AssertionError("Expected function to throw, but it did not");
}

export {
  assert,
  assertEqual,
  assertNotEqual,
  assertContains,
  assertMatch,
  assertTrue,
  assertFalse,
  assertGreaterThan,
  assertLessThan,
  assertLength,
  assertThrows,
};
