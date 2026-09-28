// Polish review helper: screenshots of pages at desktop and phone width, light and dark, into a folder.
//   node scripts/shots.mjs <outdir> <baseUrl> <path> [<path> ...]
// e.g. node scripts/shots.mjs shots http://localhost:3100 / /academy /stoa
// Uses the installed Microsoft Edge, like the browser tests. Not part of the site.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [outdir, base, ...paths] = process.argv.slice(2);
if (!outdir || !base || paths.length === 0) { console.error("usage: node scripts/shots.mjs <outdir> <baseUrl> <path>..."); process.exit(1); }
mkdirSync(outdir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const SIZES = [["wide", { width: 1440, height: 900 }], ["phone", { width: 375, height: 812 }]];
for (const theme of ["light", "dark"]) {
  for (const [name, viewport] of SIZES) {
    const ctx = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce", deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => { try { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t }, version: 0 })); } catch {} }, theme);
    const page = await ctx.newPage();
    for (const p of paths) {
      try {
        await page.goto(base + p, { waitUntil: "load" });
        await page.waitForTimeout(1500);
        // reveal-on-scroll sections: scroll through once so every section is drawn
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
        await page.waitForTimeout(400);
        const file = `${outdir}/${p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home"}-${name}-${theme}.png`;
        await page.screenshot({ path: file, fullPage: true });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        console.log(file, overflow > 1 ? `  !! horizontal overflow ${overflow}px` : "");
      } catch (e) { console.log("FAILED", p, name, theme, String(e).split("\n")[0]); }
    }
    await ctx.close();
  }
}
await browser.close();
