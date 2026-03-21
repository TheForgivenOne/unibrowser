# Assertions

unibrowser provides built-in `expect*` methods on pages and elements, plus standalone assertion functions.

## Page Assertions

```typescript
// Title
await page.expectTitle("My App");
await page.expectTitle(/My App/);
await page.expectTitleContains("Dashboard");

// URL
await page.expectURL("https://example.com/dashboard");
await page.expectURL(/\/dashboard/);
await page.expectURLContains("dashboard");
```

## Element Assertions

```typescript
const el = page.locator("h1");

// Visibility
await el.expectVisible();
await el.expectHidden();

// Text
await el.expectText("Welcome");
await el.expectTextContains("Welcome");

// State
await el.expectEnabled();
await el.expectDisabled();
await el.expectChecked();

// Attributes
await el.expectAttribute("href", "/dashboard");
```

All element assertions wait for the element to reach the expected state first.

## Standalone Assertions

Import from `unibrowser` for custom logic:

```typescript
import {
  assert, assertEqual, assertNotEqual,
  assertContains, assertMatch,
  assertTrue, assertFalse,
  assertGreaterThan, assertLessThan,
  assertLength, assertThrows,
} from "unibrowser";
```

### `assert(condition, message)`

Base assertion. Throws `AssertionError` if condition is falsy.

```typescript
assert(items.length > 0, "Expected at least one item");
```

### `assertEqual(actual, expected, message?)`

Strict `===` equality.

```typescript
assertEqual(response.status, 200);
assertEqual(user.name, "Alice", "Username mismatch");
```

### `assertNotEqual(actual, expected, message?)`

Strict `!==` inequality.

### `assertContains(haystack, needle, message?)`

String contains.

```typescript
assertContains(page.url(), "/dashboard");
assertContains(html, "Welcome back");
```

### `assertMatch(value, pattern, message?)`

RegExp match.

```typescript
assertMatch(title, /^Dashboard/);
```

### `assertTrue(value, message?)` / `assertFalse(value, message?)`

Boolean assertions.

```typescript
assertTrue(isVisible);
assertFalse(isLoading);
```

### `assertGreaterThan(actual, expected, message?)` / `assertLessThan(actual, expected, message?)`

Numeric comparisons.

```typescript
assertGreaterThan(count, 0);
assertLessThan(responseTime, 5000);
```

### `assertLength(value, expected, message?)`

Array/string length.

```typescript
assertLength(items, 5);
assertLength("hello", 5);
```

### `assertThrows(fn, expectedError?, message?)`

Assert function throws.

```typescript
assertThrows(() => JSON.parse("invalid"));

assertThrows(
  () => parseConfig("bad"),
  "Invalid config"
);

assertThrows(
  () => riskyOperation(),
  /error code \d+/
);
```

## AssertionError

All assertions throw `AssertionError` on failure.

```typescript
import { AssertionError } from "unibrowser";

try {
  await page.expectTitle("Wrong Title");
} catch (e) {
  if (e instanceof AssertionError) {
    console.log(e.actual);   // "Example Domain"
    console.log(e.expected); // "Wrong Title"
  }
}
```

## Custom Messages

Every assertion accepts an optional `message` parameter:

```typescript
await page.expectTitle("Home", "Homepage should have title 'Home'");
await el.expectVisible("Submit button should be visible");
assertEqual(status, 200, "API should return 200 OK");
```
