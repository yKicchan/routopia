Language: [🇺🇸](./README.md) [🇯🇵](./README.ja.md)

[![GitHub Release](https://img.shields.io/github/v/release/yKicchan/routopia)](https://github.com/yKicchan/routopia/releases)
[![license](https://img.shields.io/github/license/yKicchan/routopia)](https://github.com/yKicchan/routopia/blob/main/LICENSE)
[![minzip](https://badgen.net/bundlephobia/minzip/routopia)](https://bundlephobia.com/package/routopia)
[![dependencies](https://badgen.net/bundlephobia/dependency-count/routopia)](https://bundlephobia.com/package/routopia)
[![CI](https://github.com/yKicchan/routopia/actions/workflows/ci.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/ci.yml)
[![Deploy](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml)
[![Coverage](https://ykicchan.github.io/routopia/coverage/badge.svg)](https://ykicchan.github.io/routopia/coverage)

# routopia

> A type-safe URL builder library based on your route definitions

![routopia logo](./logo.png)

## ✨ Features

- 🔒 Type-safe route definition and path construction
- 📦 Lightweight and no dependencies
- 🥰 Smooth development experience with type inference and autocompletion
- 👍 Supports use cases like Base URL and Catch-all Parameters
- 🧩 Strict URL type inference using template literal types

## 🚀 Getting Started

### 1. Install

```bash
npm install routopia
```

### 2. Define Routes

```ts
import { routes, empty, type } from 'routopia';

export const myRoutes = routes({
  "/users": {
    get: empty,
    post: empty,
  },
  "/path/[id]": {
    get: {
      params: {
        id: type as number,
      },
      queries: {
        q: type as string | undefined,
      },
    },
  },
});
```

### 3. Use Routes

```ts
import { myRoutes } from './path/to/myRoutes';

myRoutes["/users"].get();
myRoutes["/users"].post();
// => "/users"

myRoutes["/path/[id]"].get({ params: { id: 123 } });
// => "/path/123"

myRoutes["/path/[id]"].get({ params: { id: 123 }, queries: { q: "query" }  });
// => "/path/123?q=query"
```

> [!TIP]  
> The return value is inferred in detail by template literal types.  
> For example, if `const path = myRoutes["/users"].get()`, the type of path will be `"/users"`.  
> If you want to receive it as a string type, please add a type annotation:  
> `const path: string = myRoutes["/users"].get()`

## 📘 Why routopia?

Provides type-safe route definitions including path parameters and query parameters, powered by strong type inference and IDE autocompletion features.

The main differences from other libraries are as follows:

- Autocomplete works during definition.
- Autocomplete guides you to the correct path during usage.
- Detailed inference is obtained through template literal types.

routopia focuses on declaratively and simply getting type-safe URLs.

If you need more advanced features like automatic generation or regular expressions, other libraries might be better.

Conversely, routopia might be a good match for the following cases:

- When you need to handle links to external sites or third-party API endpoints without an available SDK
- Managing URLs with custom schemas (e.g., `myapp://path/to/resource`)
- When you're not using ecosystems like OpenAPI generators for some reason
- When you want to simply use features like Next.js Route Handlers
- When managing simple internal links or using typedRoutes in Next.js
- When you need a simple URL builder

## 📖 API Reference

- [No Parameters](#no-parameters)
- [Path Parameters](#path-parameters)
- [Catch-all Parameters](#catch-all-parameters)
- [Query Parameters](#query-parameters)
- [Hash](#hash)
- [Base URL](#base-url)
- [Shorthand](#shorthand)
- [Best Practices](#best-practices)

### No Parameters

- Specify `empty` if no parameters are needed.

```ts
import { routes, empty } from 'routopia';

const myRoutes = routes({
  "/path": {
    get: empty,
    post: empty,
    put: empty,
    delete: empty,
  },
});

myRoutes["/path"].get();
myRoutes["/path"].post();
myRoutes["/path"].put();
myRoutes["/path"].delete();
// => All resolve to "/path"
```

### Path Parameters

- Enclose with `[]` like `[param]`.
- Multiple path parameters can also be specified.
- Path parameters are defined within the `params` object.
- Specify the `type` of path parameters using type assertion (`type as {Type}` or `<{Type}>type`) with the dedicated type object.
- The type of path parameters can be specified satisfying `string | number`.

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[id]": {
    get: {
      params: {
        id: type as number,
        // <number>type is also OK
      },
    },
  },
  "/path/[param1]/[param2]": {
    get: {
      params: {
        param1: type as string,
        param2: type as string | number,
      },
    },
  },
});

myRoutes["/path/[id]"].get({ params: { id: 123 } });
// => "/path/123"

myRoutes["/path/[id]"].get({ params: { id: "abc" } });
//                                         ^^^^^
// Error: Type 'string' is not assignable to type 'number'

myRoutes["/path/[param1]/[param2]"].get({
  params: { param1: "abc", param2: 123 },
});
// => "/path/abc/123"

myRoutes["/path/[id]"].get();
//                     ^^^^
// Error: Path parameters cannot be omitted when called.
```

### Catch-all Parameters

- Define catch-all parameters like `[...param]`.
- The type of catch-all parameters can be specified satisfying `(string | number)[]`.
- Using double brackets like `[[...param]]` allows `undefined` in addition to the above.
- This feature is equivalent to [Next.js's Catch-all Segments](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments).

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[...slug]": {
    get: {
      params: {
        slug: type as string[],
      },
    },
  },
  "/path/[[...slug]]": {
    get: {
      params: {
        slug: type as number[],
      },
    },
  },
});

myRoutes["/path/[...slug]"].get({
  params: { slug: ["abc", "def"] },
});
// => "/path/abc/def"


myRoutes["/path/[...slug]"].get();
//                          ^^^^
// Error: Catch-all parameters cannot be omitted when called.

myRoutes["/path/[[...slug]]"].get({
  params: { slug: [123, 456] },
});
// => "/path/123/456"

myRoutes["/path/[[...slug]]"].get();
// => "/path"
// Optional Catch-all parameters can be omitted when called.
```

### Query Parameters

- Query parameters are defined within the `queries` object.
- Types other than `object` can be specified for query parameters.
- Including `undefined` makes them optional (omittable).

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/required": {
    get: {
      queries: {
        str: type as string,
        num: type as number,
        bool: type as boolean,
        arr: type as string[],
        opt: type as string | undefined,
      },
    },
  },
  "/optional": {
    get: {
      queries: {
        str: type as string | undefined,
        num: type as number | undefined,
        bool: type as boolean | undefined,
        arr: type as string[] | undefined,
      },
    },
  },
});

myRoutes["/required"].get({
  queries: {
    str: "abc",
    num: 123,
    bool: true,
    arr: ["a", "b", "c"]
  },
});
// => "/required?arr=a&arr=b&arr=c&bool=true&num=123&str=abc"

myRoutes["/required"].get();
//                    ^^^
// Error: Cannot be omitted if there are required query parameters.

myRoutes["/optional"].get();
// => "/optional"
```

> [!TIP]
> The order of query parameters is sorted, making it compatible with caching mechanisms like SWR that use URLs as keys.

### Hash

- Define the `hash` key if needed. 
- The `hash` key can be specified satisfying the `string` type. 
- Using a Union type is safer for actual use, but specifying `string` to accept anything is also possible. 
- The `hash` key is always omittable, even without including `undefined`.

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path": {
    get: {
      hash: type as "anchor1" | "anchor2",
    },
  },
  "/any": {
    get: {
      hash: type as string,
    },
  },
});

myRoutes["/path"].get({ hash: "anchor1" });
// => "/path#anchor1"

myRoutes["/path"].get({ hash: "unknown" });
//                     ^^^^^
// Error: Type '"unknown"' is not assignable to type '"anchor1" | "anchor2"'.

myRoutes["/any"].get({ hash: "unknown" });
// => "/any#unknown"

myRoutes["/path"].get();
// => "/path"
```

### Base URL

- The routes function can accept a string as the first argument to specify a Base URL.
- In that case, specify the schema definition as the second argument.
- Note that the Base URL is simply prefixed.

```ts
import { routes, empty } from 'routopia';

const myUsersRoutes = routes("/users", {
  "/path": {
    get: empty,
  },
});

myUsersRoutes["/path"].get();
// => "/users/path"

const myApiRoutes = routes("https://api.example.com", {
  "/path": {
    get: empty,
  },
});

myApiRoutes["/path"].get();
// => "https://api.example.com/path"
```

### Shorthand

- You can directly define parameters by omitting the HTTP method definition.
- In this case, it is equivalent to defining the GET method.

```ts
import { routes, empty, type } from 'routopia';

const myRoutes = routes({
  "/short": empty,
  // = "/short": { get: empty }
  
  "/short/[param]": {
    params: {
      param: type as string,
    },
    queries: {
      q: type as string | undefined,
    },
    hash: type as string,
  },
  // = "/short/[param]": { get: { params: {...}, queries: {...}, hash: ... } }
});

// Use it by calling the `get` method
myRoutes["/short"].get();
// => "/short"

myRoutes["/short/[param]"].get({ 
  params: { param: "abc" }, 
  queries: { q: "query" }, 
  hash: "anchor",
});
// => "/short/abc?q=query#anchor"
```

> [!WARNING]
> When using Shorthand, you cannot combine it with other HTTP method definitions within the same endpoint.  
> While it's possible to use them together across different endpoints, you should split definition files to prevent notation inconsistencies within the same domain.
> 
> <details>
> <summary>Examples of Mixing HTTP method definitions and Shorthand</summary>
> 
> ```ts
> import { routes, empty, type } from 'routopia';
> 
> // ❌: Cannot combine Shorthand notation with other method definitions within the same endpoint
> const error = routes({
>   "/short/mixed": {
>     queries: { q: type as string },
>     post: empty,
> //  ^^^^^^^^^^^
>   },
> });
> 
> // ⚠️: Can be used together across different endpoints, but causes notation inconsistencies
> const notGood = routes({
>   "/hoge": empty,
> //   :
>   "/foo": { get: empty },
> });
> 
> // ✅: Unify notation between endpoints within the same file
> const good = routes({
>   "/hoge": { get: empty },
> //  :
>   "/foo": { get: empty },
> });
> 
> // ✅: Or split definition files and unify notation by domain
> // hoge.ts
> const hogeRoutes = routes({
>   "/hoge": empty,
> });
> // foo.ts
> const fooRoutes = routes({
>   "/foo": { get: empty },
> });
> ```
> </details>

### Best Practices

- Create an abstraction layer by wrapping `routopia`.
- It's also possible to specify the Base URL collectively.
- Use `ExpectedSchema` with generics for the argument type when wrapping.
- Split definition files by domain as needed to prevent them from becoming too large

```ts
// createMyApiRoutes.ts
import { routes, empty, type, ExpectedSchema } from 'routopia';

const API_BASE_URL = "https://api.example.com";

export function createMyApiRoutes<T extends ExpectedSchema<T>>(schema: T) {
  return routes(API_BASE_URL, schema);
}

export const schema = { empty, type };
```

```ts
// userRoutes.ts
import { createMyApiRoutes, schema } from './path/to/createMyApiRoutes';

export const userRoutes = createMyApiRoutes({
  "/users": schema.empty,
  "/users/[id]": {
    params: {
      id: schema.type as number,
    },
  },
});
```

```ts
// postRoutes.ts
import { createMyApiRoutes, schema } from './path/to/createMyApiRoutes';

export const postRoutes = createMyApiRoutes({
  "/posts": {
    get: { queries: { q: schema.type as string | undefined } },
  },
  "/posts/[id]": {
    get: { params: { id: schema.type as number } },
    post: { params: { id: schema.type as number } },
    put: { params: { id: schema.type as number } },
    delete: { params: { id: schema.type as number } },
  },
});
```

```ts
// Example Usage
import { userRoutes } from './path/to/userRoutes';
import { postRoutes } from './path/to/postRoutes';

userRoutes["/users"].get();
// => "https://api.example.com/users"

postRoutes["/posts/[id]"].get({ params: { id: 123 } });
// => "https://api.example.com/posts/123"
```

> [!WARNING]
> For convenience, it's possible to combine multiple route definitions as shown below, but be careful as TreeShaking will not work effectively
> 
> <details>
> <summary>Example of TreeShaking not working effectively</summary>
>
> ```ts
> // index.ts
> import { userRoutes } from './path/to/userRoutes';
> import { postRoutes } from './path/to/postRoutes';
> 
> export const apiRoutes = {
>   ...userRoutes,
>   ...postRoutes,
> };
> 
> // Example Usage
> import { apiRoutes } from './path/to/index';
> apiRoutes["/users"].get();
> apiRoutes["/posts/[id]"].get({ params: { id: 123 } });
> // You can search all routes uniformly, but the bundle size will increase
> ```
> </details>
