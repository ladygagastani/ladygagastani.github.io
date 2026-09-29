// Polish review helper: a whole page at phone width, cut into strips laid side by side in one picture,
// so a long page can be looked over at a glance. Not part of the site.
//   node scripts/contact-sheet.mjs <outdir> <baseUrl> <theme light|dark> <path> [<path> ...]
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const [outdir, base, theme, ...paths] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: theme, reducedMotion: "reduce" });
await ctx.addInitScript((t) => { try { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t }, version: 0 })); } catch {} }, theme);
const p = await ctx.newPage();
const STRIP = 1500;
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(2200);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(500);
  const png = (await p.screenshot({ fullPage: true })).toString("base64");
  const sheet = await p.evaluate(async ({ png, STRIP }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + png;
    await img.decode();
    const n = Math.ceil(img.height / STRIP), gap = 12;
    const c = document.createElement("canvas");
    c.width = n * img.width + (n - 1) * gap; c.height = Math.min(STRIP, img.height);
    const g = c.getContext("2d");
    g.fillStyle = "#777"; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < n; i++) g.drawImage(img, 0, i * STRIP, img.width, STRIP, i * (img.width + gap), 0, img.width, STRIP);
    return c.toDataURL("image/png").split(",")[1];
  }, { png, STRIP });
  const file = `${outdir}/${path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home"}-${theme}.png`;
  writeFileSync(file, Buffer.from(sheet, "base64"));
  console.log(file);
}
await b.close();
