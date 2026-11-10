---
"routopia": patch
---

Fixed an issue where trailing slashes and repeated slashes in a path were kept in the generated URL, although the return type already removed them. They are now removed at runtime as well, and endpoints without parameters return the same type.

```ts
const myRoutes = routes("/users", {
  "/": empty,
  "/path/": empty,
  "/path/[id]/posts": { params: { id: type as string } },
});

myRoutes["/"].get(); // => "/users" (previously "/users/")
myRoutes["/path/"].get(); // => "/users/path" (previously "/users/path/")
myRoutes["/path/[id]/posts"].get({ params: { id: "" } }); // => "/users/path/posts" (previously "/users/path//posts")

routes({ "/": empty })["/"].get(); // => "/" (unchanged)
```
