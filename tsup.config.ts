import { defineConfig } from "tsup";

export default defineConfig(() => ({
  target: "esnext",
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
  splitting: false,
}));
