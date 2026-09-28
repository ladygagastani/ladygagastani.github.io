// Polish review helper: at phone width, lists what pokes out sideways, tiny tap targets and tiny text.
//   node scripts/phone-audit.mjs <baseUrl> <path> [<path> ...]   (a site served on <baseUrl>; not part of the site)
import { chromium } from "@playwright/test";

const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
const p = await ctx.newPage();
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const desc = (e) => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0].replace(/^.*__/, "") : ""} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 28)}"`;
    const visible = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const inScroller = (e) => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if ((o === "auto" || o === "scroll" || o === "hidden") && a.scrollWidth > a.clientWidth) return true; } return false; };
    const wide = [...document.querySelectorAll("body *")].filter((e) => visible(e) && e.getBoundingClientRect().right > W + 1 && !inScroller(e)).slice(0, 6).map(desc);
    const small = [...document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab]")]
      .filter((e) => visible(e) && !e.closest("[data-decorative]")).filter((e) => { const r = e.getBoundingClientRect(); return r.height < 24 || r.width < 24; })
      // an inline link inside a sentence is exempt, as WCAG allows
      .filter((e) => !(e.tagName === "A" && getComputedStyle(e).display === "inline"))
      .slice(0, 8).map((e) => { const r = e.getBoundingClientRect(); return `${desc(e)} ${Math.round(r.width)}x${Math.round(r.height)}`; });
    const tiny = new Set();
    for (const e of document.querySelectorAll("body *")) { if (!visible(e) || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 11.5) tiny.add(`${fs.toFixed(1)}px ${desc(e)}`); }
    return { overflow: document.documentElement.scrollWidth - W, wide, small, tiny: [...tiny].slice(0, 6) };
  });
  const bad = r.overflow > 1 || r.wide.length || r.small.length || r.tiny.length;
  console.log(bad ? "•" : "✓", path, bad ? JSON.stringify(r) : "");
}
await b.close();
