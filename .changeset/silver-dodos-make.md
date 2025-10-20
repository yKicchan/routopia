---
"routopia": patch
---

Fix type inference for catch-all parameters without 'as const'

Previously, catch-all parameters ([...params]) were incorrectly ignored during type inference when not using 'as const', causing the parameter segments to be omitted from the return type. Now:

- `myRoutes["/params/[...params]"].get({ params: ["1"] })` correctly returns `/params/${string}` instead of `/params`
- `myRoutes["/params/[...params]"].get({ params: ["1"] as const })` continues to return `/params/1`
