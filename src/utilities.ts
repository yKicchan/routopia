import type { Options } from "./types";

export function replacePathParams(path: string, params: Options["params"]) {
  return path
    .split("/")
    .map((segment) => {
      const matches = segment.match(/^\[(.+)\]$/);
      if (!matches) return segment;
      return params?.[matches[1]] ?? segment;
    })
    .join("/");
}
