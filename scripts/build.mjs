import { build } from "esbuild";

/**
 * @type {import('esbuild').BuildOptions}
 */
const options = {
  target: "esnext",
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  external: ["query-string"],
};

build({
  ...options,
  format: "esm",
  outfile: "./dist/index.mjs",
}).catch((e) => {
  process.stderr.write(e.stderr);
  process.exit(1);
});

build({
  ...options,
  format: "cjs",
  outfile: "./dist/index.cjs",
}).catch((e) => {
  process.stderr.write(e.stderr);
  process.exit(1);
});
