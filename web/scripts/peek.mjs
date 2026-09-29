// Review helper: one screenful of a page in the installed Microsoft Edge, after an optional script (e.g. a scroll).
// Not part of the site.
//   node scripts/peek.mjs <out.png> <url> [wide|phone] [light|dark] ["<javascript run in the page first>"]
// e.g. node scripts/peek.mjs lib.png http://localhost:3000/library phone dark "document.getElementById('lib-A').scrollIntoView()"
import { chromium } from "@playwright/test";

const [out, url, size = "wide", theme = "light", js] = process.argv.slice(2);
if (!out || !url) { console.error("usage: node scripts/peek.mjs <out.png> <url> [wide|phone] [light|dark] [js]"); process.exit(1); }
const phone = size === "phone";
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({
  viewport: phone ? { width: 375, height: 812 } : { width: 1366, height: 900 }, colorScheme: theme, reducedMotion: "reduce",
  ...(phone ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}),
});
await ctx.addInitScript((t) => { try { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t }, version: 0 })); } catch {} }, theme);
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(2500);
if (js) { await p.evaluate(js); await p.waitForTimeout(900); }
await p.screenshot({ path: out });
console.log(out);
await b.close();
