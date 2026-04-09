---
"routopia": patch
---

Improve mock syntax and URL processing for mocking

**Changes (mock behavior):**

- Mock path parameters now use colon syntax instead of `*`. (e.g., `/users/:id` instead of `/users/*`)
- Optional catch-all parameters use `:param*` syntax and required catch-all parameters use `:param+` syntax when mocking.

```ts
const myRoutes = routes({
  "/users/[id]": { params: { id: type as string } },
  "/posts/[...slugs]": { params: { slugs: type as string[] } },
  "/tags/[[...tags]]": { params: { tags: type as string[] } },
});

myRoutes["/users/[id]"].mock();              // => "/users/:id"
myRoutes["/posts/[...slugs]"].mock();        // => "/posts/:slugs+"
myRoutes["/tags/[[...tags]]"].mock();        // => "/tags/:tags*"
```

**Improvements:**

- Mock mode skips URL encoding for path parameters, query strings, and hash values to improve readability.

