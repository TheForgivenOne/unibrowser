import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run all test files in a single thread so the browser pool is shared
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
