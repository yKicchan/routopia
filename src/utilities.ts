import type { Options } from "./types";

/**
 * Replaces path parameters in the given path with actual values from params.
 *
 * @param path - The endpoint path, which can include path parameters. (e.g., "/users/[id]")
 * @param params - An object containing the values for the path parameters. (e.g., { id: "1" })
 * @param mocking - If true, missing parameters are replaced with colon syntax (e.g., ":id") instead of throwing an error, and the output will not be URL-encoded.
 *
 * @throws Error - Will throw an error if a required parameter is missing or if the parameter type is incorrect.
 * @returns The path with encoded path parameters replaced with actual values. (e.g., "/users/1")
 *
 * @example
 * replacePathParams("/users/[id]", { id: "1" });
 * // => "/users/1"
 *
 * replacePathParams("/posts/[[...slug]]", { slug: ["hoge", "fuga"] });
 * // => "/posts/hoge/fuga"
 */
export function replacePathParams(path: string, params: Options["params"], mocking = false): string {
  return path
    .replace(/\/\[\[\.\.\.(.+?)]]/g, (_, key) => {
      // 1. /[[...slug]] - Optional Catch-all Parameters
      const values = params?.[key];
      if (mocking && values === undefined) return `/:${key}*`;
      if (values === undefined) return "";
      if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
      if (mocking) return `/${values.join("/")}`;
      return `/${values.map(encodeURIComponent).join("/")}`;
    })
    .replace(/\[\.\.\.(.+?)]/g, (_, key) => {
      // 2. [...slug] - Catch-all Parameters
      const values = params?.[key];
      if (mocking && values === undefined) return `:${key}+`;
      if (values === undefined) throw new Error(`"${key}" is required`);
      if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
      if (mocking) return values.join("/");
      return values.map(encodeURIComponent).join("/");
    })
    .replace(/\[(.+?)]/g, (_, key) => {
      // 3. [slug] - Path Parameter
      const value = params?.[key];
      if (mocking && value === undefined) return `:${key}`;
      if (value === undefined) throw new Error(`"${key}" is required`);
      if (Array.isArray(value)) throw new Error(`"${key}" must not be an array`);
      if (mocking) return String(value);
      return encodeURIComponent(String(value));
    });
}

/**
 * Converts an object of query parameters into a URL-encoded query string.
 * Handles array values by repeating the key for each value.
 *
 * @param queries - An object of query parameters.
 * @param mocking - If true, the query string will not be URL-encoded and will use a simple key=value format.
 * @returns A URL-encoded and sorted query string.
 *
 * @example
 * stringifyQueries({ z: "last", a: "first", n: "middle" });
 * // => "?a=first&n=middle&z=last"
 *
 * stringifyQueries({ search: ["apple", "banana"], page: 2 });
 * // => "?page=2&search=apple&search=banana"
 */
export function stringifyQueries(queries: Options["queries"], mocking = false): string {
  if (!queries || Object.keys(queries).length === 0) return "";

  const entries = Object.entries(queries)
    .flatMap(([key, value]) => {
      if (value === null || value === undefined) return [];

      if (Array.isArray(value)) return value.filter((v) => v !== null && v !== undefined).map((v) => [key, String(v)]);

      return [[key, String(value)]];
    })
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) return "";

  if (mocking) {
    const queryString = entries.map(([key, value]) => `${key}=${value}`).join("&");
    return `?${queryString}`;
  }

  const searchParams = new URLSearchParams(entries).toString().replace(/\+/g, "%20");
  return `?${searchParams}`;
}

/**
 * Converts a hash value into a string representation.
 *
 * @param hash - The hash value to be stringified.
 * @param mocking - A flag indicating whether to mock the hash value.
 * @return The stringified hash value.
 */
export function stringifyHash(hash: Options["hash"], mocking = false): string {
  if (!hash) return "";
  if (mocking) return `#${hash}`;
  return `#${encodeURIComponent(String(hash))}`;
}

/**
 * Type guard to check if a key is one of the keys in the Options type.
 * @param key - The key to check.
 */
export function isOptions(key: string): key is keyof Options {
  const optionsKeys: (keyof Options)[] = ["params", "queries", "hash"];
  return optionsKeys.includes(key as (typeof optionsKeys)[number]);
}
