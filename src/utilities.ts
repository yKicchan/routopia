import type { Options } from "./types";

/**
 * Replaces path parameters in the given path with actual values from params.
 *
 * @param path - The endpoint path, which can include path parameters. (e.g., "/users/[id]")
 * @param params - An object containing the values for the path parameters. (e.g., { id: "1" })
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
export function replacePathParams(path: string, params: Options["params"]): string {
  const realPath = path
    .split("/")
    .map((segment) =>
      segment
        .replace(/^\[\[\.\.\.(.+)]]$/, (_, key) => {
          if (!params?.[key]) return "";
          const values = params[key];
          if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
          return values.map(encodeURIComponent).join("/");
        })
        .replace(/^\[\.\.\.(.+)]$/, (_, key) => {
          if (!params?.[key]) throw new Error(`"${key}" is required`);
          const values = params[key];
          if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
          return values.map(encodeURIComponent).join("/");
        })
        .replace(/^\[(.+)]$/, (_, key) => {
          if (!params?.[key]) throw new Error(`"${key}" is required`);
          const value = params[key];
          if (Array.isArray(value)) throw new Error(`"${key}" must be not an array`);
          return encodeURIComponent(String(value));
        }),
    )
    .filter((segment) => segment !== "")
    .join("/");

  return `/${realPath}`;
}

/**
 * Converts an object of query parameters into a URL-encoded query string.
 * Handles array values by repeating the key for each value.
 *
 * @param queries - An object of query parameters.
 * @returns A URL-encoded and sorted query string.
 *
 * @example
 * stringifyQueries({ z: "last", a: "first", n: "middle" });
 * // => "a=first&n=middle&z=last"
 *
 * stringifyQueries({ search: ["apple", "banana"], page: 2 });
 * // => "page=2&search=apple&search=banana"
 */
export function stringifyQueries(queries: Options["queries"]): string {
  if (!queries) return "";
  const searchParams = new URLSearchParams(
    Object.entries(queries).flatMap(([key, values]) =>
      Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]],
    ),
  );
  searchParams.sort();
  return searchParams.toString();
}

/**
 * Type guard to check if a key is one of the keys in the Options type.
 * @param key - The key to check.
 */
export function isOptions(key: string): key is keyof Options {
  const optionsKeys: (keyof Options)[] = ["params", "queries", "hash"];
  return optionsKeys.includes(key as (typeof optionsKeys)[number]);
}
