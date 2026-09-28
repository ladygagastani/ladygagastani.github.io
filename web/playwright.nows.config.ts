import { defineConfig } from "@playwright/test";
// like playwright.config.ts, but against a site already being served on port 3100 (node scripts/serve-out.mjs 3100)
export default defineConfig({ testDir: "./e2e", timeout: 30_000, expect: { timeout: 15_000 }, use: { baseURL: "http://localhost:3100", channel: "msedge" } });
