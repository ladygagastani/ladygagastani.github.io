// Makes public/og-card.png: the picture that appears when a link to the site is shared (1200 x 630).
// Not part of the site. Needs a connection (it loads the site's typefaces from Google Fonts once, for this picture only).
//   node scripts/make-share-card.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og-card.png");

// a Greek-key (meander) band, drawn as a repeating pattern
const meander = (colour) => `
<svg width="100%" height="34" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id="m" width="34" height="34" patternUnits="userSpaceOnUse">
    <path d="M3 31 V3 H31 V25 H11 V11 H23 V17" fill="none" stroke="${colour}" stroke-width="3.2" stroke-linecap="square"/>
  </pattern></defs>
  <rect width="100%" height="34" fill="url(#m)"/>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital@0;1&family=Alegreya+SC:wght@500;700&family=GFS+Didot&display=block">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #16110E; color: #EDCBA0; position: relative; overflow: hidden; font-family: "Alegreya", Georgia, serif; }
  .glow { position: absolute; inset: 0; background: radial-gradient(900px 420px at 78% 42%, rgba(200,112,58,0.26), transparent 70%); }
  .band { position: absolute; left: 60px; right: 60px; }
  .top { top: 44px; } .bottom { bottom: 44px; }
  .frame { position: absolute; inset: 24px; border: 2px solid rgba(237,203,160,0.28); }
  main { position: absolute; left: 96px; right: 96px; top: 128px; }
  .kicker { font-family: "Alegreya SC", serif; font-weight: 500; letter-spacing: 0.18em; font-size: 26px; color: #E0673A; }
  h1 { font-family: "GFS Didot", serif; font-weight: 400; font-size: 112px; line-height: 1.1; margin-top: 16px; white-space: nowrap; color: #EDCBA0; }
  h1 span { color: #E0673A; }
  .latin { font-family: "Alegreya SC", serif; font-weight: 500; letter-spacing: 0.22em; font-size: 30px; color: #BE9876; margin-top: 8px; }
  .tag { font-style: italic; font-size: 38px; line-height: 1.3; color: #EDCBA0; margin-top: 30px; max-width: 900px; }
</style></head><body>
  <div class="glow"></div><div class="frame"></div>
  <div class="band top">${meander("#C8703A")}</div>
  <main>
    <div class="kicker">ANCIENT GREEK, READ WITH THE ENGLISH BESIDE IT</div>
    <h1>Μάθησις <span>Στοιχείων</span></h1>
    <div class="latin">MATHESIS STOICHEION</div>
    <p class="tag">Learn to read Ancient Greek, and meet the world that wrote it.</p>
  </main>
  <div class="band bottom">${meander("#C8703A")}</div>
</body></html>`;

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.setContent(html, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
await p.screenshot({ path: out });
await b.close();
console.log("wrote", out);
