import queryString from "query-string";
import type { ActualSchema, Empty, ExpectedSchema, Options } from "./types";
import { replacePathParams } from "./utilities";

/**
 * Utility used to define parameter types in parameter schemas
 * @example
 * { id: type as string }
 */
export const type: unknown = undefined;

/**
 * Utility used when no parameters are required for an endpoint method
 * @example
 * { get: empty }
 */
export const empty: Empty = undefined;

/**
 * Higher-order function that returns a URL generator for an endpoint, given its parameters
 * @param endpoint - The endpoint path, which can include path parameters (e.g., "/users/[id]")
 * @param baseUrl - The base URL to prepend to the generated URL (optional)
 * @example
 * const getUrl = method("/users/[id]", "https://example.com/api");
 * getUrl({ params: { id: "1" }, queries: { flag: true } });
 * // => "https://example.com/api/users/1?flag=true"
 */
function method(endpoint: string, baseUrl = "") {
  return (options?: Options) => {
    const path = replacePathParams(endpoint, options?.params);
    const queries = options?.queries ? `?${queryString.stringify(options.queries)}` : "";
    const hash = options?.hash ? `#${options.hash}` : "";
    return `${baseUrl}${path}${queries}${hash}`;
  };
}

/**
 * Takes a routes schema and returns an object with type-safe URL generators
 * Provides autocomplete for URL path parameters during definition, and type checking at usage
 *
 * @param schema - Routes schema, which can include path parameters (e.g., "/users/[id]") and method definitions (e.g., { get: { params: { id: type as string } } })
 * @returns An object with type-safe URL generators for each route and method
 * @example
 * import { routes, type, empty } from "routype";
 *
 * const routes = routes({
 *   // Example for the /users route
 *   "/users": {
 *     get: {
 *       // Define query parameters
 *       queries: {
 *         required: type as string,
 *         optional: type as string | undefined,
 *       },
 *     },
 *     // No parameters needed
 *     post: empty
 *   },
 *   "/users/[id]": {
 *     get: {
 *       // Define path parameters
 *       params: {
 *         id: type as string,
 *       },
 *     },
 *   },
 * });
 */
export function routes<Schema extends ExpectedSchema<Schema>>(schema: Schema): ActualSchema<Schema, "">;
/**
 * Takes a base URL and a routes schema, and returns an object with type-safe URL generators
 * Provides autocomplete for URL path parameters during definition, and type checking at usage
 *
 * @param baseUrl - The base URL to prepend to the generated URLs
 * @param schema - Routes schema, which can include path parameters (e.g., "/users/[id]") and method definitions (e.g., { get: { params: { id: type as string } } })
 * @returns An object with type-safe URL generators for each route and method
 * @example
 * import { routes, type, empty } from "routype";
 *
 * const routes = routes("https://example.com/api", {
 *   // Example for the /users route
 *   "/users": {
 *     get: {
 *       // Define query parameters
 *       queries: {
 *         required: type as string,
 *         optional: type as string | undefined,
 *       },
 *     },
 *     // No parameters needed
 *     post: empty,
 *   },
 *   "/users/[id]": {
 *     get: {
 *       // Define path parameters
 *       params: {
 *         id: type as string,
 *       },
 *     },
 *   },
 * });
 */
export function routes<BaseUrl extends string, Schema extends ExpectedSchema<Schema>>(
  baseUrl: BaseUrl,
  schema: Schema,
): ActualSchema<Schema, BaseUrl>;
export function routes<Schema extends ExpectedSchema<Schema>, BaseUrl extends string>(
  ...args: [Schema] | [BaseUrl, Schema]
) {
  const hasBaseUrl = args.length === 2;
  const baseUrl = hasBaseUrl ? args[0] : "";
  const schema = hasBaseUrl ? args[1] : args[0];

  return Object.entries<object>(schema).reduce(
    (acc, [endpoint, methods]) =>
      Object.assign(acc, {
        [endpoint]: Object.keys(methods).reduce(
          (acc, methodKey) =>
            Object.assign(acc, {
              [methodKey]: method(endpoint, baseUrl),
            }),
          {},
        ),
      }),
    {},
  ) as ActualSchema<Schema, BaseUrl>;
}
