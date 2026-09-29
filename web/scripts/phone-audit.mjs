// Polish review helper: at phone width, lists what pokes out sideways, tiny tap targets, tiny text and text boxes under 16 px (iPhones zoom into them).
//   node scripts/phone-audit.mjs <baseUrl> <path> [<path> ...]   (a site served on <baseUrl>; not part of the site)
//   TAP=44 node scripts/phone-audit.mjs ...   reports tap targets under 44 px (Phase 10's size) instead of WCAG's 24 px
import { chromium } from "@playwright/test";

const [base, ...paths] = process.argv.slice(2);
const TAP = Number(process.env.TAP) || 24;
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
const p = await ctx.newPage();
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(2500);
  const r = await p.evaluate((TAP) => {
    const W = document.documentElement.clientWidth;
    const desc = (e) => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0].replace(/^.*__/, "") : ""} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 28)}"`;
    const visible = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const inScroller = (e) => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if ((o === "auto" || o === "scroll" || o === "hidden") && a.scrollWidth > a.clientWidth) return true; } return false; };
    // (a drawing's own shapes are clipped by its <svg>, so only the <svg> itself counts)
    const wide = [...document.querySelectorAll("body *")].filter((e) => !(e instanceof SVGElement && e.ownerSVGElement) && visible(e) && e.getBoundingClientRect().right > W + 1 && !inScroller(e)).slice(0, 6).map(desc);
    // body hides sideways overflow, so also look for anything spilling past its page column (.wrap) into the margin
    const clipped = (e, stop) => { for (let a = e.parentElement; a && a !== stop; a = a.parentElement) if (getComputedStyle(a).overflowX !== "visible") return true; return false; };
    const spill = [];
    for (const e of document.querySelectorAll(".wrap *")) {
      if ((e instanceof SVGElement && e.ownerSVGElement) || !visible(e) || /absolute|fixed/.test(getComputedStyle(e).position) || spill.some((s) => s.contains(e))) continue;
      const w = e.closest(".wrap"), wr = w.getBoundingClientRect(), cs = getComputedStyle(w), r = e.getBoundingClientRect();
      const out = r.right > wr.right - parseFloat(cs.paddingRight) + 1.5 || r.left < wr.left + parseFloat(cs.paddingLeft) - 1.5;
      // the header's menu, and rows of cards to swipe (.snap-row), reach into the margin on purpose
      if (out && !clipped(e, w) && !e.closest("header, .snap-row")) spill.push(e);
    }
    wide.push(...spill.slice(0, 6).map((e) => `${desc(e)} (into the margin)`));
    const small = [...document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab]")]
      // [data-tap-equivalent]: the same link is offered nearby at full size (WCAG 2.5.8's "equivalent" exception)
      .filter((e) => visible(e) && !e.closest("[data-decorative], [data-tap-equivalent]")).filter((e) => { const r = e.getBoundingClientRect(); return r.height < TAP - 0.5 || r.width < TAP - 0.5; })
      // an inline link inside a sentence is exempt, as WCAG allows
      .filter((e) => !(e.tagName === "A" && getComputedStyle(e).display === "inline"))
      // a tick box or radio button inside its label is tapped by the whole label
      .filter((e) => !(e.tagName === "INPUT" && /checkbox|radio/.test(e.type) && e.closest("label") && e.closest("label").getBoundingClientRect().height >= TAP - 0.5))
      // a touch area stretched by ::after (chips, whole-row links) counts as the target
      .filter((e) => { const a = getComputedStyle(e, "::after"); if (a.content === "none" || a.position !== "absolute") return true; const box = e.closest("li, tr") ?? e; const r = e.getBoundingClientRect(); return !(r.height + 8 >= TAP - 0.5 || box.getBoundingClientRect().height >= TAP - 0.5); })
      .slice(0, TAP > 24 ? 40 : 8).map((e) => { const r = e.getBoundingClientRect(); return `${desc(e)} ${Math.round(r.width)}x${Math.round(r.height)}`; });
    const tiny = new Set();
    for (const e of document.querySelectorAll("body *")) { if (e instanceof SVGElement || !visible(e) || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 11.5) tiny.add(`${fs.toFixed(1)}px ${desc(e)}`); }
    // text boxes under 16 px make an iPhone zoom in when they are tapped
    const zoom = [...document.querySelectorAll("input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), select, textarea")]
      .filter((e) => visible(e) && parseFloat(getComputedStyle(e).fontSize) < 16).slice(0, 6).map((e) => `${desc(e)} ${getComputedStyle(e).fontSize}`);
    return { overflow: document.documentElement.scrollWidth - W, wide, small, tiny: [...tiny].slice(0, 6), zoom };
  }, TAP);
  const bad = r.overflow > 1 || r.wide.length || r.small.length || r.tiny.length || r.zoom.length;
  console.log(bad ? "•" : "✓", path, bad ? JSON.stringify(r) : "");
}
await b.close();
