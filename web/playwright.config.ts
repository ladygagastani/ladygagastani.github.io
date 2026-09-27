import { defineConfig } from "@playwright/test";

// Uses the Microsoft Edge already installed on Windows, so no extra browser download is needed.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  // the reader parses whole books (the Iliad) in the page; with many tests in parallel that can take longer than 5 s
  expect: { timeout: 15_000 },
  use: { baseURL: "http://localhost:3100", channel: "msedge" },
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
