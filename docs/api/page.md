# UniPage

A browser page. Handles navigation, element finding, interactions, and assertions.

## Navigation

### `page.goto(url, options?)`

Navigate to a URL.

```typescript
const response = await page.goto("https://example.com");
```

| Option | Type | Default | Description |
|---|---|---|---|
| `waitUntil` | `"load" \| "domcontentloaded" \| "networkidle" \| "commit"` | `"load"` | When to consider navigation done |
| `timeout` | `number` | `10000` | Max wait time in ms |
| `referer` | `string` | - | Referer header |

### `page.reload(options?)`

Reload the current page.

### `page.goBack(options?)` / `page.goForward(options?)`

Navigate history.

### `page.url()`

Returns `string`. Current URL.

### `page.title()`

Returns `Promise<string>`. Page title.

### `page.content()`

Returns `Promise<string>`. Full HTML content.

### `page.close()`

Close the page.

## Finding Elements

### `page.locator(selector, options?)`

Find an element by CSS selector. Returns `UniElement`.

```typescript
const h1 = page.locator("h1");
const btn = page.locator("button.submit");
const el = page.locator("div", { hasText: "Hello" });
```

### `page.getByText(text)`

Find by visible text.

```typescript
const el = page.getByText("Click me");
```

### `page.getByRole(role, options?)`

Find by ARIA role.

```typescript
const heading = page.getByRole("heading", { name: "Welcome" });
const btn = page.getByRole("button", { name: /submit/i });
```

### `page.getByLabel(text)`

Find by label text.

```typescript
const input = page.getByLabel("Email");
```

### `page.getByPlaceholder(text)`

Find by placeholder text.

```typescript
const input = page.getByPlaceholder("Enter email");
```

### `page.getByTestId(testId)`

Find by `data-testid` attribute.

```typescript
const el = page.getByTestId("login-button");
```

## Page Interactions

### `page.click(selector, options?)`

Click an element by selector.

```typescript
await page.click("button.submit");
```

### `page.fill(selector, value)`

Fill an input by selector.

```typescript
await page.fill('input[name="email"]', "user@test.com");
```

### `page.type(selector, text, options?)`

Type into an element (supports key delay).

```typescript
await page.type("input", "hello", { delay: 50 });
```

### `page.press(selector, key)`

Press a keyboard key on an element.

```typescript
await page.press("input", "Enter");
```

### `page.check(selector)` / `page.uncheck(selector)`

Check or uncheck a checkbox.

### `page.selectOption(selector, values)`

Select a `<select>` option.

```typescript
await page.selectOption("select.color", "red");
```

## Waiting

### `page.waitForSelector(selector, options?)`

Wait for an element, returns `UniElement`.

```typescript
const el = await page.waitForSelector(".loading-done", { state: "visible" });
```

### `page.waitForURL(url, options?)`

Wait for navigation to a URL.

```typescript
await page.waitForURL("**/dashboard");
```

### `page.waitForLoadState(state?)`

Wait for a load state. Default: `"load"`.

```typescript
await page.waitForLoadState("networkidle");
```

### `page.waitForFunction(fn, options?)`

Wait for a JavaScript function to return truthy.

```typescript
await page.waitForFunction(() => document.title === "Done");
```

## Page Assertions

### `page.expectTitle(expected, message?)`

Assert page title matches string or RegExp.

```typescript
await page.expectTitle("My App");
await page.expectTitle(/My App/);
```

### `page.expectTitleContains(partial, message?)`

Assert title contains substring.

```typescript
await page.expectTitleContains("Dashboard");
```

### `page.expectURL(expected, message?)`

Assert current URL matches string or RegExp.

```typescript
await page.expectURL("**/dashboard");
await page.expectURL(/\/dashboard/);
```

### `page.expectURLContains(partial, message?)`

Assert URL contains substring.

```typescript
await page.expectURLContains("dashboard");
```

## Screenshots

### `page.screenshot(options?)`

Take a screenshot. Returns `Buffer`.

```typescript
const png = await page.screenshot();
const full = await page.screenshot({ fullPage: true });
const jpeg = await page.screenshot({ type: "jpeg", quality: 80 });
```

| Option | Type | Description |
|---|---|---|
| `path` | `string` | Save to file |
| `fullPage` | `boolean` | Capture full scrollable page |
| `clip` | `{ x, y, width, height }` | Crop region |
| `quality` | `number` | JPEG quality (0-100) |
| `type` | `"png" \| "jpeg"` | Image format |

### `page.expectScreenshot(baselinePath, threshold?)`

Visual regression. Compares against baseline. Creates baseline on first run.

```typescript
await page.expectScreenshot("./screenshots/home.png");
```

## JavaScript Evaluation

### `page.evaluate(fn)`

Run JavaScript in the page context.

```typescript
const title = await page.evaluate(() => document.title);
const result = await page.evaluate(() => {
  return document.querySelectorAll("a").length;
});
```
