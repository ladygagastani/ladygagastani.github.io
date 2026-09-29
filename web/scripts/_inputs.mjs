import { chromium } from "@playwright/test";
const base = "http://localhost:3100";
const paths = ["/", "/library", "/library/author?a=tlg0012", "/read?w=tlg0012.tlg001", "/search", "/downloads", "/treasury", "/treasury/word?l=λόγος",
  "/academy", "/academy/alphabet", "/academy/review", "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/today",
  "/stoa", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus", "/town-hall", "/town-hall/pnyx", "/town-hall/new", "/account", "/about", "/credits", "/stoa/melos"];
const b = await chromium.launch({ channel: "msedge" });
const p = await (await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage();
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => [...document.querySelectorAll("input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), select, textarea")]
    .filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && getComputedStyle(e).visibility !== "hidden"; })
    .map((e) => ({ el: `${e.tagName.toLowerCase()}${e.type ? "[" + e.type + "]" : ""} ${(e.getAttribute("aria-label") || e.getAttribute("placeholder") || e.id || "").slice(0, 30)}`,
      fs: parseFloat(getComputedStyle(e).fontSize), ac: e.getAttribute("autocorrect"), cap: e.getAttribute("autocapitalize"), sc: e.getAttribute("spellcheck"), ekh: e.getAttribute("enterkeyhint"), im: e.getAttribute("inputmode") })));
  const bad = r.filter((x) => x.fs < 16);
  console.log(path, r.length, "fields;", bad.length ? "SMALL: " + bad.map((x) => `${x.el} ${x.fs}px`).join(" | ") : "all ≥16px");
  for (const x of r) if (/search|go to|greek|word|find|filter|λόγος|reference/i.test(x.el) && x.el.startsWith("input")) console.log("   ", x.el, "fs", x.fs, "autocorrect", x.ac, "cap", x.cap, "spell", x.sc, "enter", x.ekh);
}
await b.close();
