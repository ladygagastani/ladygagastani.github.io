// Bug-hunting helper: opens pages of a served site in Edge, wide and on a phone, and lists console errors, uncaught
// errors, failed requests to the site itself, and pages wider than the phone's screen. Not part of the site.
//   node scripts/crawl.mjs <baseUrl> [all]      (all: every wiki entry, 60 authors and 60 works, not a sample)
//   VIEWS=wide node scripts/crawl.mjs ...       only the wide, light view (quicker, e.g. against `next dev` for React's warnings)
import { chromium } from "@playwright/test";
import { readdirSync } from "node:fs";

const [base, mode] = process.argv.slice(2);
const all = mode === "all";
const pick = (xs, n) => (all ? xs : xs.filter((_, i) => i % Math.ceil(xs.length / n) === 0));
const names = (d) => readdirSync(`out/${d}`).filter((f) => f.endsWith(".html")).map((f) => `/${d}/${f.replace(/\.html$/, "")}`);
const top = ["/", "/about", "/credits", "/downloads", "/library", "/search", "/stoa", "/town-hall", "/town-hall/pnyx", "/treasury",
  "/account", "/academy", "/academy/alphabet", "/academy/practice", "/academy/review", "/academy/tables", "/academy/today", "/academy/vocabulary",
  "/nothing-here", "/treasury/word?w=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82", "/library/author?a=tlg0012", "/search?q=%CE%BC%E1%BF%86%CE%BD%CE%B9%CE%BD",
  "/read?w=tlg0012.tlg001", "/read?w=tlg0059.tlg030", "/read?w=tlg0003.tlg001", "/read?w=tlg0085.tlg005", "/read?w=tlg0031.tlg004",
  "/read?w=tlg0012.tlg001&w2=tlg0012.tlg002", "/read?w=tlg0540.tlg001&at=1"];
const paths = [...top, ...names("academy/lesson"), ...names("academy/guide"), ...pick(names("stoa"), 30), ...pick(names("author"), 40).slice(0, all ? 60 : 40), ...pick(names("work"), 40).slice(0, all ? 60 : 40)];

const b = await chromium.launch({ channel: "msedge" });
const found = [];
for (const [label, opts] of [["wide", { viewport: { width: 1280, height: 860 } }], ["phone", { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true }]]) {
  for (const theme of ["light", "dark"]) {
    if (theme === "dark" && label === "wide" && !all) continue;
    if (process.env.VIEWS === "wide" && (label !== "wide" || theme !== "light")) continue;
    const ctx = await b.newContext({ ...opts, reducedMotion: "reduce" });
    await ctx.addInitScript((t) => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t }, version: 0 })), theme);
    const p = await ctx.newPage();
    let cur = "";
    const note = (kind, msg) => found.push(`${label}/${theme} ${cur}  [${kind}] ${String(msg).slice(0, 220)}`);
    p.on("console", (m) => { if ((m.type() === "error" || (process.env.VIEWS && m.type() === "warning")) && !/Failed to load resource.*(404|403)/.test(m.text()) ) note("console", m.text()); });
    p.on("pageerror", (e) => note("pageerror", e.message));
    p.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400 && !r.url().includes("/packs/") && cur !== "/nothing-here") note("http " + r.status(), r.url().slice(base.length)); });
    for (const path of paths) {
      cur = path;
      try {
        await p.goto(base + path, { waitUntil: "load", timeout: 30000 });
        await p.waitForTimeout(path.startsWith("/read") ? 5000 : 1200);
        if (label === "phone") {
          const w = await p.evaluate(() => {
            const W = document.documentElement.clientWidth;
            return [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > W + 2 && getComputedStyle(e).position !== "fixed"; })
              .filter((e) => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== "visible" && a.scrollWidth > a.clientWidth) return false; } return true; })
              .slice(0, 3).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} "${(e.textContent || "").trim().slice(0, 30)}"`);
          });
          if (w.length) note("too wide", w.join(" | "));
        }
        const txt = await p.evaluate(() => document.body.innerText);
        if (/undefined|NaN|\[object Object\]/.test(txt)) note("text", (txt.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/) || [""])[0].replace(/\s+/g, " "));
      } catch (e) { note("load", e.message.split("\n")[0]); }
    }
    await ctx.close();
  }
}
await b.close();
console.log(`${paths.length} pages; ${found.length} findings`);
for (const f of found) console.log(f);
