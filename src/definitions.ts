import type { ActualSchema, Empty, ExpectedSchema, Options } from "./types";
import { isOptions, replacePathParams, stringifyHash, stringifyQueries } from "./utilities";

/**
 * Utility used to define parameter types in parameter schemas
 * @example
 * { id: type as string }
 */
export const type: unknown = undefined;

/**
 * Utility used when no parameters are required for endpoints or methods
 * @example
 * routes({ "/path": { get: empty, post: empty } })
 *
 * routes({ "/path": empty })
 */
export const empty: Empty = undefined;

/**
 * Higher-order function that returns a URL generator for an endpoint, given its parameters
 *
 * @param endpoint - The endpoint path, which can include path parameters (e.g., "/users/[id]")
 * @param baseUrl - The base URL to prepend to the generated URL (optional)
 * @param mocking - A flag indicating whether to generate a URL for mocking purposes, which allows missing parameters to be replaced with "*" (optional)
 * @returns A function that takes an options object and returns a generated URL with path parameters replaced, query parameters appended, and hash fragment included as specified in the options.
 *
 * @example
 * const getUrl = method("/users/[id]", "https://example.com/api");
 * getUrl({ params: { id: "1" }, queries: { flag: true } });
 * // => "https://example.com/api/users/1?flag=true"
 */
function method(endpoint: string, baseUrl = "", mocking = false) {
  return (options?: Options) => {
    const path = replacePathParams(endpoint, options?.params, mocking);
    const queries = stringifyQueries(options?.queries, mocking);
    const hash = stringifyHash(options?.hash, mocking);
    return `${baseUrl}${path}${queries}${hash}`;
  };
}

/**
 * Takes a route schema and returns an object of type-safe URL builders.
 * It provides autocomplete for path parameters during definition and ensures type safety at usage.
 *
 * @param schema - The routes schema, defining endpoints, their associated HTTP methods (which can be omitted for the shorthand feature), and various options (e.g., path, query, and hash parameters).
 * @returns An object containing type-safe URL builders for each route and method.
 *
 * @example
 * import { routes, type, empty } from "routopia";
 *
 * const myRoutes = routes({
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
 *
 *   // The GET shorthand is available by omitting the method definition.
 *   "/short": empty, // Equivalent to: "/short": { get: empty },
 *   "/short/[param]": {
 *     // The same applies to defining parameters.
 *     params: {
 *       param: type as string,
 *     },
 *     queries: {
 *       q: type as string | undefined,
 *     },
 *     hash: type as string,
 *   },
 * });
 */
export function routes<Schema extends ExpectedSchema<Schema>>(schema: Schema): ActualSchema<Schema, "">;
/**
 * Takes a base URL and a routes schema, and returns an object of type-safe URL builders.
 * It provides autocomplete for path parameters during definition and ensures type safety at usage.
 *
 * @param baseUrl - The base URL to prepend to the generated URLs.
 * @param schema - The routes schema, defining endpoints, their associated HTTP methods (which can be omitted for the shorthand feature), and various options (e.g., path, query, and hash parameters).
 * @returns An object containing type-safe URL builders for each route and method.
 *
 * @example
 * import { routes, type, empty } from "routopia";
 *
 * const myRoutes = routes("https://example.com/api", {
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
 *
 *   // The GET shorthand is available by omitting the method definition.
 *   "/short": empty, // Equivalent to: "/short": { get: empty },
 *   "/short/[param]": {
 *     // The same applies to defining parameters.
 *     params: {
 *       param: type as string,
 *     },
 *     queries: {
 *       q: type as string | undefined,
 *     },
 *     hash: type as string,
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

  return Object.entries<object | Empty>(schema).reduce((acc, [endpoint, methodsOrOptions]) => {
    const generate = (mocking = false) => method(endpoint, baseUrl, mocking);
    const generatorWithMock = Object.assign(generate(), { mock: generate(true) });

    const keys = methodsOrOptions && Object.keys(methodsOrOptions);
    if (!keys || keys.every(isOptions)) {
      return Object.assign(acc, {
        [endpoint]: {
          mock: generate(true),
          get: generatorWithMock,
        },
      });
    }

    // The `keys` are `HttpMethod`, as enforced by `ExpectedSchema`.
    return Object.assign(acc, {
      [endpoint]: keys.reduce(
        (acc, httpMethod) =>
          Object.assign(acc, {
            [httpMethod]: generatorWithMock,
          }),
        {
          mock: generate(true),
        },
      ),
    });
  }, {}) as ActualSchema<Schema, BaseUrl>;
}
