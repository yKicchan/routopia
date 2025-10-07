import { defineConfig } from "tsdown";

export default defineConfig({
  target: "esnext",
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
});
