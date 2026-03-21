# UniContext

A browser context. Provides isolated sessions with separate cookies, storage, and permissions.

## Creating

```typescript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});
```

Or let `newPage()` create one implicitly:

```typescript
const page = await browser.newPage(); // creates context internally
```

## Pages

### `context.newPage()`

Create a new page in this context.

```typescript
const page = await context.newPage();
```

### `context.pages()`

Get all open pages.

```typescript
const pages = context.pages();
```

## Cookies

### `context.cookies(urls?)`

Get cookies.

```typescript
const cookies = await context.cookies();
```

### `context.addCookies(cookies)`

Set cookies.

```typescript
await context.addCookies([{
  name: "session",
  value: "abc123",
  domain: "example.com",
  path: "/",
}]);
```

### `context.clearCookies()`

Remove all cookies.

## Storage

### `context.storageState()`

Get serialized storage state (cookies + localStorage). Use this to save and restore sessions.

```typescript
const state = await context.storageState();
// Save to file, then restore later:
const context2 = await browser.newContext({ storageState: state });
```

## Permissions

### `context.grantPermissions(permissions, options?)`

Grant browser permissions.

```typescript
await context.grantPermissions(["geolocation", "notifications"]);
await context.grantPermissions(["geolocation"], { origin: "https://example.com" });
```

### `context.clearPermissions()`

Revoke all granted permissions.

## Network

### `context.route(url, handler)`

Intercept requests matching a URL pattern.

```typescript
// Block images
await context.route("**/*.{png,jpg,gif}", (route) => route.abort());

// Mock API response
await context.route("**/api/user", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ name: "Test User" }),
  });
});

// Modify request
await context.route("**/api/**", (route) => {
  route.continue({
    headers: { ...route.request().headers(), "X-Auth": "token" },
  });
});
```

### `context.unroute(url)`

Remove a route.

```typescript
await context.unroute("**/api/**");
```

### `context.setOffline(offline)`

Simulate offline mode.

```typescript
await context.setOffline(true);
// ... test offline behavior ...
await context.setOffline(false);
```

## Close

### `context.close()`

Close the context and all its pages.

```typescript
await context.close();
```

## Accessing Playwright

### `context.raw`

The underlying Playwright `BrowserContext`.

```typescript
const pwContext = context.raw;
```
