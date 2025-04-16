import type { Options } from "./types";

export function replacePathParams(path: string, params: Options["params"]) {
  const realPath = path
    .split("/")
    .map((segment) =>
      segment
        .replace(/^\[\[\.\.\.(.+)]]$/, (_, key) => {
          if (!params?.[key]) return "";
          const values = params[key];
          if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
          return values.join("/");
        })
        .replace(/^\[\.\.\.(.+)]$/, (_, key) => {
          if (!params?.[key]) throw new Error(`"${key}" is required`);
          const values = params[key];
          if (!Array.isArray(values)) throw new Error(`"${key}" must be an array`);
          return values.join("/");
        })
        .replace(/^\[(.+)]$/, (_, key) => {
          if (!params?.[key]) throw new Error(`"${key}" is required`);
          const value = params[key];
          if (Array.isArray(value)) throw new Error(`"${key}" must be not an array`);
          return String(value);
        }),
    )
    .filter((segment) => segment !== "")
    .join("/");

  return `/${realPath}`;
}
