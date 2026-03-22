# UniElement

An element found via `page.locator()` or other finders. Supports interaction, state queries, and assertions.

## Finding Elements

### `locator.locator(selector)`

Scope a locator to a child element.

```typescript
const form = page.locator("form");
const email = form.locator('input[name="email"]');
```

### `locator.filter(options)`

Filter matching elements by text or nested element.

```typescript
// Filter by text content
const item = page.locator("li").filter({ hasText: "Buy milk" });

// Filter by nested element
const row = page.locator("tr").filter({ has: page.getByRole("cell", { name: "Status" }) });

// Exclude by text
const items = page.locator("li").filter({ hasNotText: "Completed" });
```

| Option | Type | Description |
|---|---|---|
| `hasText` | `string \| RegExp` | Keep elements with matching text |
| `hasNotText` | `string \| RegExp` | Exclude elements with matching text |
| `has` | `UniElement` | Keep elements containing this child |

### `locator.getByRole(role, options?)`

Find by ARIA role within scoped element.

```typescript
const form = page.locator("#login");
const heading = form.getByRole("heading", { name: "Sign in" });
const button = form.getByRole("button", { name: "Submit" });
```

### `locator.getByText(text)`

Find by visible text within scoped element.

```typescript
const sidebar = page.locator("aside");
const link = sidebar.getByText("Settings");
```

### `locator.getByLabel(text, options?)`

Find by label text within scoped element.

### `locator.getByPlaceholder(text)`

Find by placeholder within scoped element.

### `locator.getByTestId(testId)`

Find by `data-testid` within scoped element.

```typescript
const card = page.locator('[data-testid="product-card"]');
const title = card.getByTestId("product-title");
```

### `locator.first()` / `locator.last()` / `locator.nth(index)`

Get specific elements from a group.

```typescript
const firstLink = page.locator("a").first();
const secondItem = page.locator("li").nth(1);
```

### `locator.all()`

Expand to all matching elements.

```typescript
const items = await page.locator("li").all();
for (const item of items) {
  const text = await item.innerText();
  console.log(text);
}
```

### `locator.count()`

Number of matching elements.

```typescript
const count = await page.locator("li").count();
```

## Interactions

### `locator.click(options?)`

Click the element.

```typescript
await page.locator("button").click();
await page.locator("button").click({ button: "right" });
```

### `locator.dblclick(options?)`

Double-click.

### `locator.type(text)`

Fill the element with text.

```typescript
await page.locator("input").type("hello");
```

### `locator.clear()`

Clear the input value.

### `locator.hover()`

Hover over the element.

### `locator.focus()` / `locator.blur()`

Focus or blur the element.

### `locator.press(key)`

Press a keyboard key while focused.

```typescript
await page.locator("input").press("Enter");
```

### `locator.check()` / `locator.uncheck()`

Check or uncheck a checkbox/radio.

```typescript
await page.locator('input[type="checkbox"]').check();
```

### `locator.selectOption(values)`

Select an option in a `<select>`.

```typescript
await page.locator("select").selectOption("red");
await page.locator("select").selectOption(["red", "blue"]); // multi-select
```

## State Queries

### `locator.isVisible()`

Returns `boolean`.

### `locator.isHidden()`

Returns `boolean`.

### `locator.isEnabled()` / `locator.isDisabled()`

Returns `boolean`.

### `locator.isChecked()`

Returns `boolean`. Whether checkbox/radio is checked.

### `locator.inputValue()`

Returns `string`. Current input value.

### `locator.boundingBox()`

Returns `{ x, y, width, height } | null`. Element position and size.

```typescript
const box = await page.locator("h1").boundingBox();
// { x: 100, y: 50, width: 200, height: 30 }
```

## Content Queries

### `locator.innerText()`

Returns `string`. Visible text.

### `locator.textContent()`

Returns `string | null`. Raw text including hidden.

### `locator.innerHTML()`

Returns `string`. Inner HTML.

### `locator.getAttribute(name)`

Returns `string | null`. Attribute value.

```typescript
const href = await page.locator("a").getAttribute("href");
const id = await page.locator("div").getAttribute("id");
```

## Waiting

### `locator.waitFor(options?)`

Wait for element to reach a state.

```typescript
await page.locator(".loader").waitFor({ state: "hidden" });
await page.locator(".content").waitFor({ state: "visible", timeout: 5000 });
```

| Option | Type | Default | Description |
|---|---|---|---|
| `state` | `"attached" \| "detached" \| "visible" \| "hidden"` | `"visible"` | Target state |
| `timeout` | `number` | `10000` | Max wait time |

## Element Assertions

### `locator.expectVisible(message?)`

Assert element is visible.

### `locator.expectHidden(message?)`

Assert element is hidden.

### `locator.expectText(expected, message?)`

Assert innerText equals expected (trimmed).

```typescript
await page.locator("h1").expectText("Welcome");
```

### `locator.expectTextContains(partial, message?)`

Assert innerText contains substring.

```typescript
await page.locator("h1").expectTextContains("Welcome");
```

### `locator.expectEnabled(message?)` / `locator.expectDisabled(message?)`

Assert element is enabled/disabled.

### `locator.expectChecked(message?)`

Assert checkbox is checked.

### `locator.expectAttribute(name, value, message?)`

Assert attribute has specific value.

```typescript
await page.locator("a").expectAttribute("href", "/dashboard");
```

## Screenshots

### `locator.screenshot(options?)`

Take a screenshot of just this element. Returns `Buffer`.

```typescript
const buffer = await page.locator(".hero").screenshot();
```

## Accessing Playwright

### `locator.raw`

The underlying Playwright `Locator`. Use this for features not wrapped by unibrowser.

```typescript
const pwLocator = page.locator("h1").raw;
```
