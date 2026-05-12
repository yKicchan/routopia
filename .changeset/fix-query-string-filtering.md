---
"routopia": patch
---

Fixed an issue where `null`, `undefined`, or empty arrays in query parameters were incorrectly included in the generated query string. They are now properly excluded.
