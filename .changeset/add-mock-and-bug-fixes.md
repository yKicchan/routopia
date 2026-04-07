---
"routopia": minor
---

Add mocking support and improve URL processing reliability

**New Features:**
- Mocking Support: Added a new `.mock()` method for each route and HTTP method. It automatically replaces missing path parameters with `*` and relaxes type constraints, making it easier to define URLs for mock servers like MSW.

```ts
const myRoutes = routes({ "/users/[id]": { params: { id: type as string } } });
myRoutes["/users/[id]"].mock(); // => "/users/*"
myRoutes["/users/[id]"].mock({ params: { id: "123" } }); // => "/users/123"
```

**Bug Fixes:**
- Empty Query Parameters: Fixed an issue where an empty queries object would still append a trailing `?` to the generated URL.

**Improvements:**
- URL Scheme Handling: Refined URL scheme handling using regular expressions. This ensures that complex URLs, such as those with multiple schemes (e.g., `myapp://https://example.com`), are processed safely without breaking their structure.
- Internal Optimization: Removed redundant utilities and type definitions to simplify the codebase.
- Enhanced Test Coverage: Significantly expanded the test suite, including new unit tests and type-level tests (dts), to ensure reliability and prevent regressions across various URL patterns and edge cases.
