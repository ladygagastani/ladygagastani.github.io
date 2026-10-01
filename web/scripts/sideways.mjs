// Phone check: what really sticks out sideways on each page, with the page's safety nets (overflow on <body> and <main>)
// switched off (older iPhones ignore it, and some phones let you pan to clipped content anyway).
// Elements inside their own sideways scroller (a row of cards to swipe) or a box that clips them do not count.
//   node scripts/sideways.mjs <baseUrl> [all] [width]     (all: every wiki entry, lesson, 60 authors and 60 works)
import { chromium } from "@playwright/test";
import { readdirSync } from "node:fs";

const [base, mode, w] = process.argv.slice(2);
const all = mode === "all";
const width = Number(w) || 375;
const names = (d) => readdirSync(`out/${d}`).filter((f) => f.endsWith(".html")).map((f) => `/${d}/${f.replace(/\.html$/, "")}`);
const pick = (xs, n) => (all ? xs.slice(0, Math.max(n, 60)) : xs.filter((_, i) => i % Math.ceil(xs.length / n) === 0));
const top = ["/", "/about", "/credits", "/downloads", "/library", "/search", "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/editions", "/stoa/kerameikos",
  "/stoa/census", "/stoa/periplus", "/town-hall", "/town-hall/pnyx", "/town-hall/new", "/treasury", "/account", "/academy", "/academy/alphabet", "/academy/practice",
  "/academy/review", "/academy/tables", "/academy/today", "/academy/vocabulary", "/nothing-here", "/treasury/word?l=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82",
  "/library/author?a=tlg0012", "/search?q=%CE%BC%E1%BF%86%CE%BD%CE%B9%CE%BD", "/read?w=tlg0012.tlg001", "/read?w=tlg0059.tlg030", "/read?w=tlg0003.tlg001",
  "/read?w=tlg0085.tlg005", "/read?w=tlg0031.tlg004", "/read?w=tlg0012.tlg001&w2=tlg0012.tlg002", "/town-hall/thread?id=1"];
const paths = [...top, ...names("academy/lesson"), ...names("academy/guide"), ...(all ? names("stoa") : pick(names("stoa"), 30)), ...pick(names("author"), 25), ...pick(names("work"), 25)];

const b = await chromium.launch({ channel: "msedge" });
let bad = 0;
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t }, version: 0 })), theme);
  const p = await ctx.newPage();
  for (const path of theme === "dark" ? paths.slice(0, top.length) : paths) {
    try {
      await p.goto(base + path, { waitUntil: "load", timeout: 45000 });
      await p.waitForTimeout(path.startsWith("/read") ? 6000 : 1500);
      // scroll through the page so anything drawn on the way down is there
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
      const r = await p.evaluate(() => {
        document.body.style.overflowX = "visible"; document.querySelectorAll("main").forEach((m) => { m.style.overflowX = "visible"; });
        document.documentElement.style.overflowX = "visible";
        const W = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const isScrollerOrClip = (a) => { const cs = getComputedStyle(a); return a.tagName !== "MAIN" && cs.overflowX !== "visible"; };
        const out = [];
        for (const e of document.querySelectorAll("body *")) {
          if (e instanceof SVGElement && e.ownerSVGElement) continue;
          const cs = getComputedStyle(e);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const rc = e.getBoundingClientRect();
          if (!rc.width || !rc.height) continue;
          if (rc.right <= W + 1 && rc.left >= -1) continue;
          let inside = false;
          for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (isScrollerOrClip(a)) { inside = true; break; }
          if (inside) continue;
          // only the outermost offender
          if (out.some((o) => o.el.contains(e))) continue;
          out.push({ el: e, s: `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}.${String(e.className).split(" ")[0].replace(/^(.*?)_(.*?)__.*$/, "$1_$2")} [${Math.round(rc.left)}..${Math.round(rc.right)}]${cs.position === "fixed" ? " fixed" : ""} "${(e.textContent || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"` });
        }
        document.body.style.overflowX = ""; document.querySelectorAll("main").forEach((m) => { m.style.overflowX = ""; });
        document.documentElement.style.overflowX = "";
        return { sw, W, out: out.slice(0, 6).map((o) => o.s) };
      });
      if (r.out.length || r.sw > r.W + 1) { bad++; console.log(`${theme} ${path}  page ${r.sw}px wide of ${r.W}\n   ${r.out.join("\n   ")}`); }
    } catch (e) { console.log(`${theme} ${path}  [load] ${e.message.split("\n")[0]}`); }
  }
  await ctx.close();
}
await b.close();
console.log(`${paths.length} pages; ${bad} with something sticking out`);
