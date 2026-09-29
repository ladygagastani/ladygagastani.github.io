// Polish review helper: at phone width, lists what looks lopsided. Not part of the site.
//   node scripts/symmetry-audit.mjs <baseUrl> <path> [<path> ...]   (a site served on <baseUrl>)
// Reports: boxes (a background, border or picture) narrower than their column and pushed to one side;
// wrapped rows of chips or buttons whose last line is short; grids that leave a lone item on the last row.
import { chromium } from "@playwright/test";

const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
const p = await ctx.newPage();
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } scrollTo(0, 0); });
  const r = await p.evaluate(() => {
    const out = [];
    const desc = (e) => `${e.tagName.toLowerCase()}.${String(e.className || "").split(" ")[0].replace(/^.*?_(\w+)__.*$/, "$1")} "${(e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30)}"`;
    const visible = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const y = (e) => Math.round(e.getBoundingClientRect().top + scrollY);
    for (const e of document.querySelectorAll("main *")) {
      if (!visible(e) || e.closest("header, nav[aria-label='Areas of the site'], .snap-row, [data-decorative], svg")) continue;
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      const parent = e.parentElement, pr = parent.getBoundingClientRect(), pcs = getComputedStyle(parent);
      const inL = pr.left + parseFloat(pcs.paddingLeft), inR = pr.right - parseFloat(pcs.paddingRight), inner = inR - inL;
      // 1. a box narrower than its column, off to one side (text runs are fine)
      const boxy = /IMG|CANVAS|VIDEO|FIGURE|svg/i.test(e.tagName) || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") || parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0 || cs.boxShadow !== "none";
      const block = /block|flex|grid|table/.test(cs.display) && !/inline/.test(cs.display);
      if (boxy && block && pcs.display === "block" && inner > 200 && r.width > 120 && r.width < inner - 24) {
        const gl = r.left - inL, gr = inR - r.right;
        if (Math.abs(gl - gr) > 24) out.push(`off-centre box (${Math.round(gl)} | ${Math.round(gr)}): ${desc(e)} @${y(e)}`);
      }
      // 2. a wrapped row whose last line is short and hangs to the left
      if (cs.display === "flex" && cs.flexWrap === "wrap" && e.children.length >= 3 && !/center|space/.test(cs.justifyContent)) {
        const kids = [...e.children].filter(visible);
        const rows = new Map();
        for (const k of kids) { const t = Math.round(k.getBoundingClientRect().top); rows.set(t, [...(rows.get(t) ?? []), k]); }
        if (rows.size >= 2) {
          const last = [...rows.values()].at(-1), lr = last.at(-1).getBoundingClientRect().right - last[0].getBoundingClientRect().left;
          const first = [...rows.values()][0], fr = first.at(-1).getBoundingClientRect().right - first[0].getBoundingClientRect().left;
          if (lr < fr * 0.72 && kids.every((k) => k.getBoundingClientRect().height < 70)) out.push(`ragged wrap (${rows.size} rows, last ${Math.round(lr)} of ${Math.round(fr)}px): ${desc(e)} @${y(e)}`);
        }
      }
      // 3. a grid with a lone item on its last row
      if (cs.display === "grid") {
        const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
        const kids = [...e.children].filter(visible);
        if (cols >= 2 && kids.length > cols && kids.length % cols !== 0 && kids.length % cols <= cols / 2) out.push(`grid ${cols} across, ${kids.length} items (last row ${kids.length % cols}): ${desc(e)} @${y(e)}`);
      }
    }
    return [...new Set(out)].slice(0, 14);
  });
  console.log(r.length ? "•" : "✓", path);
  for (const x of r) console.log("    ", x);
}
await b.close();
