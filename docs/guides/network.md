# Network

Intercept requests, mock responses, and simulate offline mode.

## Request Interception

### `context.route(url, handler)`

Intercept requests matching a URL pattern.

```typescript
const context = await browser.newContext();
const page = await context.newPage();
```

#### Block Requests

```typescript
// Block all images
await context.route("**/*.{png,jpg,gif,svg}", (route) => route.abort());

// Block analytics
await context.route("**/analytics/**", (route) => route.abort());
```

#### Mock API Responses

```typescript
await context.route("**/api/user", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ name: "Test User", email: "test@example.com" }),
  });
});
```

#### Modify Requests

```typescript
await context.route("**/api/**", (route) => {
  route.continue({
    headers: {
      ...route.request().headers(),
      "Authorization": "Bearer test-token",
    },
  });
});
```

#### Conditional Mocking

```typescript
await context.route("**/api/users", (route) => {
  if (route.request().method() === "GET") {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, name: "Alice" }]),
    });
  } else {
    route.continue(); // pass through POST/PUT/DELETE
  }
});
```

### `context.unroute(url)`

Remove a previously set route.

```typescript
await context.unroute("**/api/**");
```

## Offline Mode

### `context.setOffline(offline)`

Simulate offline network conditions.

```typescript
const context = await browser.newContext();
const page = await context.newPage();

// Go offline
await context.setOffline(true);

// Test offline behavior
await page.goto("https://example.com"); // will fail
const offlineMessage = await page.locator(".offline-notice").isVisible();
assertTrue(offlineMessage);

// Go back online
await context.setOffline(false);
```

## Full Example

```typescript
import { crossBrowserSuite } from "unibrowser";
import { expect } from "vitest";

crossBrowserSuite("API Mocking", (test) => {
  test("displays mocked user data", async ({ page }) => {
    // Mock the API
    await page.raw.context().route("**/api/user", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ name: "Mocked User" }),
      });
    });

    await page.goto("https://myapp.com/profile");
    const name = await page.locator(".user-name").innerText();
    expect(name).toBe("Mocked User");
  });

  test("handles offline gracefully", async ({ page }) => {
    await page.goto("https://myapp.com");
    await page.raw.context().setOffline(true);

    // Trigger an action that needs network
    await page.locator("button.refresh").click();

    // App should show offline message
    await page.locator(".offline-banner").expectVisible();
  });
});
```
