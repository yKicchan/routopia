import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    env: {
      TZ: "Asia/Tokyo",
    },
    typecheck: true,
    coverage: {
      reportsDirectory: "./artifacts/coverage",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts"],
    },
  },
});
