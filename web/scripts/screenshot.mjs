// Screenshot a page of the built site (npx next start -p 3100) with Edge, metre turned on:
//   node scripts/screenshot.mjs <path> <out.png> [width] [height] [light|dark] [js to run first] [clip x,y,w,h]
// (In Git Bash, set MSYS_NO_PATHCONV=1 so a path like /academy is not rewritten.)
import { chromium } from "@playwright/test";
const [, , path, out, w = "1280", h = "900", theme = "light", js = "", clip = ""] = process.argv;
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: clip ? 2 : 1, colorScheme: theme === "dark" ? "dark" : "light" });
await page.addInitScript(() => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { metre: true }, version: 0 })));
await page.goto(`http://localhost:3100${path}`);
await page.waitForTimeout(6000);
if (js) { await page.evaluate(js); await page.waitForTimeout(1500); }
const [x, y, cw, ch] = clip ? clip.split(",").map(Number) : [];
await page.screenshot({ path: out, ...(clip ? { clip: { x, y, width: cw, height: ch } } : {}) });
await browser.close();
