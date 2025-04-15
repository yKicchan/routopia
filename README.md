Language: [🇺🇸](./README.md) [🇯🇵](./README.ja.md)

# routype

> Type-safe and friendly route path definitions

![routype logo](./logo.png)

## ✨ Features

- 🔒 Type-safe route definitions and path generation
- 📦 Lightweight and framework-agnostic
- 🥰 Smooth DX with full type inference and IDE autocomplete
- 🔧 Ideal for SPA routing, API endpoints, and more

## 🚀 Getting Started

### Install

```bash
npm install routype
```

### Define Routes

```ts
import * as routype from 'routype';

const myRoutes = routype.routes({
  "/users": {
    // No parameters
    get: routype.empty,
  },
  "/path/[id]": {
    get: {
      params: {
        id: routype.type as number,
      },
      queries: {
        // Queries can be optional
        q: routype.type as string | undefined,
      },
    },
  },
});
```

### Use Routes

```ts
myRoutes["/users"].get();
// => "/users"

myRoutes["/path/[id]"].get({ params: { id: 123 }, queries: { q: "query" } });
// => "/path/123?q=query"
```

> [!TIP]  
> The return value of a route is inferred precisely using template literal types.  
> For example, `const path = myRoutes["/users"].get()` will have the type `"/users"`.  
> If you want to treat it as a `string`, add a type annotation:  
> `const path: string = myRoutes["/users"].get()`

## 🌐 Include Base URL

```ts
import * as routype from 'routype';

const myApiRoutes = routype.routes("https://api.example.com", {
  "/users": {
    get: routype.empty,
  }
});

myApiRoutes["/users"].get();
// => "https://api.example.com/users"
```

### Best Practices

```ts
import { routes, ExpectedSchema } from 'routype';

export function createMyApiRoutes<T extends ExpectedSchema<T>>(schema: T) {
  return routes("https://api.example.com", schema);
}
```

```ts
import * as routype from 'routype';
import { createMyApiRoutes } from './path/to/createMyApiRoutes';

const usersApiRoutes = createMyApiRoutes({
  "/users": {
    get: routype.empty,
  }
});

usersApiRoutes["/users"].get();
// => "https://api.example.com/users"
```

## 📘 Why routype?

`routype` brings type-safe route definitions with full inference — including path and query parameters — with minimal code.  
Here’s what makes it special:

- Autocompletion at the time of definition
- Fuzzy access with path narrowing on usage
- Advanced inference through template literal types

`routype` focuses on declarative and minimal URL construction with strong type safety.  
Unlike tools that generate routes from file systems or OpenAPI specs, `routype` emphasizes simplicity and control.  
It shines when:

- You need a clean, typed way to define URLs (e.g., in Next.js API paths or SPA routing)
- You aren’t using an OpenAPI-based workflow
- You want a fully typed and developer-friendly alternative with minimal setup

For more complex use cases like route generation or regex support, another tool might suit you better.  
But for handcrafted, reliable routes, `routype` has your back.
