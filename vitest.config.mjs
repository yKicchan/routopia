import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    root: "src",
    globals: true,
    env: {
      TZ: "Asia/Tokyo",
    },
    coverage: {
      reportsDirectory: "../coverage",
      reporter: ["text", "json-summary", "html"],
    },
  },
});
