import { describe, it, expect } from "vitest";
import {
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
} from "../../src/utils/assertions.js";
import { AssertionError } from "../../src/browser/types.js";

describe("assertions", () => {
  it("assert passes on true", () => {
    assert(true, "should not throw");
  });

  it("assert throws on false", () => {
    expect(() => assert(false, "fail")).toThrow(AssertionError);
  });

  it("assertEqual passes for equal values", () => {
    assertEqual(1, 1);
    assertEqual("hello", "hello");
  });

  it("assertEqual throws for different values", () => {
    expect(() => assertEqual(1, 2)).toThrow(AssertionError);
    expect(() => assertEqual("a", "b", "custom msg")).toThrow("custom msg");
  });

  it("assertNotEqual throws for equal values", () => {
    expect(() => assertNotEqual(1, 1)).toThrow(AssertionError);
  });

  it("assertNotEqual passes for different values", () => {
    assertNotEqual(1, 2);
  });

  it("assertContains passes when string contains substring", () => {
    assertContains("hello world", "world");
  });

  it("assertContains throws when string does not contain substring", () => {
    expect(() => assertContains("hello", "bye")).toThrow(AssertionError);
  });

  it("assertMatch passes when pattern matches", () => {
    assertMatch("hello123", /\d+/);
  });

  it("assertMatch throws when pattern does not match", () => {
    expect(() => assertMatch("hello", /\d+/)).toThrow(AssertionError);
  });

  it("assertTrue passes for true", () => {
    assertTrue(true);
  });

  it("assertTrue throws for false", () => {
    expect(() => assertTrue(false)).toThrow(AssertionError);
  });

  it("assertFalse passes for false", () => {
    assertFalse(false);
  });

  it("assertFalse throws for true", () => {
    expect(() => assertFalse(true)).toThrow(AssertionError);
  });

  it("assertGreaterThan passes when greater", () => {
    assertGreaterThan(5, 3);
  });

  it("assertGreaterThan throws when not greater", () => {
    expect(() => assertGreaterThan(3, 5)).toThrow(AssertionError);
  });

  it("assertLessThan passes when less", () => {
    assertLessThan(3, 5);
  });

  it("assertLessThan throws when not less", () => {
    expect(() => assertLessThan(5, 3)).toThrow(AssertionError);
  });

  it("assertLength passes for matching length", () => {
    assertLength([1, 2, 3], 3);
    assertLength("hello", 5);
  });

  it("assertLength throws for mismatched length", () => {
    expect(() => assertLength([1, 2], 3)).toThrow(AssertionError);
  });

  it("assertThrows passes when function throws", () => {
    assertThrows(() => {
      throw new Error("boom");
    });
  });

  it("assertThrows throws when function does not throw", () => {
    expect(() => assertThrows(() => {})).toThrow(AssertionError);
  });

  it("assertThrows matches error message", () => {
    assertThrows(() => {
      throw new Error("boom");
    }, "boom");
  });

  it("assertThrows matches error regex", () => {
    assertThrows(() => {
      throw new Error("error code 42");
    }, /code \d+/);
  });
});
