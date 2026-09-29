// Polish review helper: close-ups of the ends of every ornament band (meander, tongues, rays) and of the
// Stoa's end columns, at phone and wide widths, stitched into one picture per page. Not part of the site.
//   [DPR=1.25] node scripts/ornament-closeups.mjs <outdir> <baseUrl> <path> [<path> ...]
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const [outdir, base, ...paths] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const b = await chromium.launch({ channel: "msedge" });
for (const [name, vp] of [["phone", { width: 375, height: 812 }], ["wide", { width: 1366, height: 900 }]]) {
  // DPR=1.25 or 1.5 imitates a Windows display set to 125% or 150%
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: +(process.env.DPR ?? 3), reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const path of paths) {
    await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(1500);
    // the ornaments, and home-page registers (a ::before band), as boxes in page coordinates
    const boxes = await p.evaluate(() => {
      const out = [];
      const add = (e, r, kind) => { if (r.width > 20 && r.height > 3) out.push({ kind, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }); };
      for (const e of document.querySelectorAll(".meander, .tongues, .rays")) add(e, e.getBoundingClientRect(), e.className.split(" ")[0]);
      for (const e of document.querySelectorAll("section, li, div")) {
        const cs = getComputedStyle(e, "::before");
        if (cs.content !== "none" && cs.maskImage && cs.maskImage.includes("svg") && parseFloat(cs.height) === 16) {
          const r = e.getBoundingClientRect(), w = parseFloat(cs.width);
          add(e, { left: r.left + (r.width - w) / 2, top: r.top, width: w, height: 16 }, "register");
        }
      }
      const col = document.querySelector("[class*='colonnade']");
      if (col) { const r = col.getBoundingClientRect(); out.push({ kind: "colonnade", x: r.left + scrollX, y: r.top + scrollY + 60, w: r.width, h: 60 }); }
      const fr = document.querySelector("[class*='frieze']");
      if (fr) { const r = fr.getBoundingClientRect(); out.push({ kind: "frieze", x: r.left + scrollX, y: r.top + scrollY + 20, w: r.width, h: 60 }); }
      return out.slice(0, 8);
    });
    const shots = [];
    for (const bx of boxes) {
      for (const side of ["left", "right"]) {
        const W = 70, pad = 12;
        const clip = { x: Math.max(0, side === "left" ? bx.x - pad : bx.x + bx.w - W + pad), y: Math.max(0, bx.y - 6), width: W, height: Math.min(bx.h + 12, 80) };
        const buf = await p.screenshot({ clip, fullPage: true });
        shots.push({ label: `${bx.kind} ${side}`, png: buf.toString("base64") });
      }
    }
    if (!shots.length) { console.log("no ornaments on", path, name); continue; }
    // enlarged pixel for pixel, so a low scaling can still be judged
    const zoom = Math.max(1, Math.round(4 / +(process.env.DPR ?? 3)) * 2);
    const sheet = await p.evaluate(async ([shots, zoom]) => {
      const imgs = await Promise.all(shots.map(async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s.png; await i.decode(); return i; }));
      const cellW = Math.max(...imgs.map((i) => i.width)) * zoom, cellH = Math.max(...imgs.map((i) => i.height)) * zoom + 40;
      const cols = 4, rows = Math.ceil(imgs.length / cols);
      const c = document.createElement("canvas"); c.width = cols * (cellW + 16); c.height = rows * (cellH + 16);
      const g = c.getContext("2d"); g.imageSmoothingEnabled = false; g.fillStyle = "#888"; g.fillRect(0, 0, c.width, c.height);
      imgs.forEach((im, k) => { const x = (k % cols) * (cellW + 16) + 8, y = Math.floor(k / cols) * (cellH + 16) + 8; g.fillStyle = "#fff"; g.font = "28px sans-serif"; g.fillText(shots[k].label, x, y + 28); g.drawImage(im, x, y + 36, im.width * zoom, im.height * zoom); });
      return c.toDataURL("image/png").split(",")[1];
    }, [shots, zoom]);
    const file = `${outdir}/${path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home"}-${name}.png`;
    writeFileSync(file, Buffer.from(sheet, "base64"));
    console.log(file, shots.length / 2, "ornaments");
  }
  await ctx.close();
}
await b.close();
