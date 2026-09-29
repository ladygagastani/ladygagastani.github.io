// Polish review helper: collects what should match from page to page, at phone and wide widths, and lists
// the odd ones out. Not part of the site.
//   node scripts/consistency-audit.mjs <baseUrl> <path> [<path> ...]
// Looks at: ornament bands that do not line up with the text column; page-title sizes and the space under
// the page header; button and chip heights; corner rounding of boxes.
import { chromium } from "@playwright/test";

const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ channel: "msedge" });
const tally = {};   // what -> value -> [pages]
const note = (what, value, where) => { ((tally[what] ??= {})[value] ??= []).push(where); };
for (const [size, vp] of [["phone", { width: 375, height: 812 }], ["wide", { width: 1366, height: 900 }]]) {
  const ctx = await b.newContext({ viewport: vp, reducedMotion: "reduce", ...(size === "phone" ? { isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage();
  for (const path of paths) {
    await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(1800);
    const r = await p.evaluate(() => {
      const out = { bands: [], h1: null, afterHead: null, btn: [], chip: [], radius: [] };
      const visible = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
      // bands against the column they sit in (.wrap's content box)
      for (const e of document.querySelectorAll("main .meander, main .rays")) {
        if (!visible(e)) continue;
        const w = e.closest(".wrap"); if (!w) continue;
        const wr = w.getBoundingClientRect(), cs = getComputedStyle(w), r = e.getBoundingClientRect();
        const l = r.left - (wr.left + parseFloat(cs.paddingLeft)), rt = (wr.right - parseFloat(cs.paddingRight)) - r.right;
        if (Math.abs(l) > 1 || Math.abs(rt) > 1) out.bands.push(`${e.className.split(" ")[0]} ${Math.round(l)}|${Math.round(rt)} in "${(e.parentElement.textContent || "").trim().slice(0, 24)}"`);
      }
      const h1 = document.querySelector("main h1");
      if (h1 && visible(h1)) {
        out.h1 = `${parseFloat(getComputedStyle(h1).fontSize).toFixed(0)}px ${getComputedStyle(h1).fontFamily.split(",")[0]}`;
        // the space from the header's band (if any) to the next thing
        const head = h1.closest("header, .page-head, [class*='head']");
        const band = head?.querySelector(".meander") ?? head?.nextElementSibling?.querySelector?.(".meander");
        if (band) {
          const br = band.getBoundingClientRect();
          let next = null;
          for (const e of document.querySelectorAll("main *")) { const r = e.getBoundingClientRect(); if (r.top >= br.bottom + 1 && visible(e) && r.height > 8 && !e.closest("header") && (e.textContent || "").trim()) { if (!next || r.top < next.top) next = r; } }
          if (next) out.afterHead = Math.round(next.top - br.bottom);
        }
      }
      for (const e of document.querySelectorAll("main .btn")) if (visible(e)) out.btn.push(Math.round(e.getBoundingClientRect().height));
      for (const e of document.querySelectorAll("main .chip")) if (visible(e)) out.chip.push(Math.round(e.getBoundingClientRect().height));
      for (const e of document.querySelectorAll("main *")) {
        if (!visible(e)) continue;
        const cs = getComputedStyle(e);
        const boxy = (cs.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(cs.borderTopWidth) > 0) && e.getBoundingClientRect().width > 150 && e.getBoundingClientRect().height > 60;
        if (boxy && !e.matches(".btn, .chip, input, select, textarea, button")) out.radius.push(cs.borderTopLeftRadius);
      }
      return out;
    });
    const where = `${path} (${size})`;
    for (const x of r.bands) note("band not on the text column (left|right px)", x, where);
    if (r.h1) note(`page title (${size})`, r.h1, path);
    if (r.afterHead !== null) note(`space under the header band (${size})`, `${r.afterHead}px`, path);
    for (const v of new Set(r.btn)) note(`button height (${size})`, `${v}px`, path);
    for (const v of new Set(r.chip)) note(`chip height (${size})`, `${v}px`, path);
    for (const v of new Set(r.radius)) note("box corner radius", v, where);
  }
  await ctx.close();
}
await b.close();
for (const [what, values] of Object.entries(tally)) {
  console.log(`\n${what}`);
  for (const [v, ws] of Object.entries(values).sort((a, b) => b[1].length - a[1].length)) console.log(`   ${v.padEnd(34)} ${ws.length}×  ${[...new Set(ws)].slice(0, 6).join(", ")}${ws.length > 6 ? " …" : ""}`);
}
