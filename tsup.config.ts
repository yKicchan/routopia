import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
  splitting: false,
}));
