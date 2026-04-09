# routopia

## 1.2.1

### Patch Changes

- [#12](https://github.com/yKicchan/routopia/pull/12) [`84384af`](https://github.com/yKicchan/routopia/commit/84384af212d627879317ee6b97c02712b900f98b) Thanks [@yKicchan](https://github.com/yKicchan)! - Improve mock syntax and URL processing for mocking

  **Changes (mock behavior):**

  - Mock path parameters now use colon syntax instead of `*`. (e.g., `/users/:id` instead of `/users/*`)
  - Optional catch-all parameters use `:param*` syntax and required catch-all parameters use `:param+` syntax when mocking.

  ```ts
  const myRoutes = routes({
    "/users/[id]": { params: { id: type as string } },
    "/posts/[...slugs]": { params: { slugs: type as string[] } },
    "/tags/[[...tags]]": { params: { tags: type as string[] } },
  });

  myRoutes["/users/[id]"].mock(); // => "/users/:id"
  myRoutes["/posts/[...slugs]"].mock(); // => "/posts/:slugs+"
  myRoutes["/tags/[[...tags]]"].mock(); // => "/tags/:tags*"
  ```

  **Improvements:**

  - Mock mode skips URL encoding for path parameters, query strings, and hash values to improve readability.

## 1.2.0

### Minor Changes

- [#10](https://github.com/yKicchan/routopia/pull/10) [`28e9518`](https://github.com/yKicchan/routopia/commit/28e95189ff9e0c33fe3b9dd4c2300929f326fe69) Thanks [@yKicchan](https://github.com/yKicchan)! - Add mocking support and improve URL processing reliability

  **New Features:**

  - Mocking Support: Added a new `.mock()` method for each route and HTTP method. It automatically replaces missing path parameters with `*` and relaxes type constraints, making it easier to define URLs for mock servers like MSW.

  ```ts
  const myRoutes = routes({
    "/users/[id]": { params: { id: type as string } },
  });
  myRoutes["/users/[id]"].mock(); // => "/users/*"
  myRoutes["/users/[id]"].mock({ params: { id: "123" } }); // => "/users/123"
  ```

  **Bug Fixes:**

  - Empty Query Parameters: Fixed an issue where an empty queries object would still append a trailing `?` to the generated URL.

  **Improvements:**

  - URL Scheme Handling: Refined URL scheme handling using regular expressions. This ensures that complex URLs, such as those with multiple schemes (e.g., `myapp://https://example.com`), are processed safely without breaking their structure.
  - Internal Optimization: Removed redundant utilities and type definitions to simplify the codebase.
  - Enhanced Test Coverage: Significantly expanded the test suite, including new unit tests and type-level tests (dts), to ensure reliability and prevent regressions across various URL patterns and edge cases.

## 1.1.1

### Patch Changes

- [#7](https://github.com/yKicchan/routopia/pull/7) [`71945c3`](https://github.com/yKicchan/routopia/commit/71945c3287fc193f34c8fb26885b3e248afe84f9) Thanks [@yKicchan](https://github.com/yKicchan)! - Fix critical type safety bugs and improve developer experience

  **Bug Fixes:**

  - **Critical:** Fixed function calls allowing missing required parameters that should have caused compilation errors
  - **Shorthand-specific:** Fixed shorthand endpoint definitions allowing missing path parameter schemas when endpoints contain path parameters

  **Improvements:**

  - Improved type display in editors for better readability
  - Enhanced parameter specification logic to be more intuitive and consistent

## 1.1.0

### Minor Changes

- [#4](https://github.com/yKicchan/routopia/pull/4) [`c6905e5`](https://github.com/yKicchan/routopia/commit/c6905e54f59460004fd58818a404bc8d2a64a493) Thanks [@yKicchan](https://github.com/yKicchan)! - Add custom schema support for endpoints

  Endpoints can now include custom schemas (e.g., `custom://path/to/resource`) which are properly preserved during URL generation.

### Patch Changes

- [#3](https://github.com/yKicchan/routopia/pull/3) [`3fe96a1`](https://github.com/yKicchan/routopia/commit/3fe96a1b7ea4db96506bda31c24abff100973f5d) Thanks [@yKicchan](https://github.com/yKicchan)! - Fix type inference for catch-all parameters without 'as const'

  Previously, catch-all parameters ([...params]) were incorrectly ignored during type inference when not using 'as const', causing the parameter segments to be omitted from the return type. Now:

  - `myRoutes["/params/[...params]"].get({ params: ["1"] })` correctly returns `/params/${string}` instead of `/params`
  - `myRoutes["/params/[...params]"].get({ params: ["1"] as const })` continues to return `/params/1`

## 1.0.0

### Major Changes

- [`d855796`](https://github.com/yKicchan/routopia/commit/d855796703fc99dda552e844e6b114f0c970ab3c) Thanks [@yKicchan](https://github.com/yKicchan)! - No dependencies

### Minor Changes

- [`fe0c4c5`](https://github.com/yKicchan/routopia/commit/fe0c4c5a51a9f82b4f6c61ab02ce5e6ddb6fa55f) Thanks [@yKicchan](https://github.com/yKicchan)! - Optional catch all routes now allow undefined to be omitted in path parameter type definitions

- [`4a106a8`](https://github.com/yKicchan/routopia/commit/4a106a82cb72a814783181802b8e6b406218a268) Thanks [@yKicchan](https://github.com/yKicchan)! - Implemented shorthand syntax for defining GET methods.

### Patch Changes

- [`dfa4418`](https://github.com/yKicchan/routopia/commit/dfa4418150e830bcd6c2f7f9bd406c5955f77080) Thanks [@yKicchan](https://github.com/yKicchan)! - Security update
