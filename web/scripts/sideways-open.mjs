// Phone check, part 2: open the site's sheets, panels and pop-ups one by one and measure whether anything then
// sticks out sideways (with the page's safety nets switched off, as in scripts/sideways.mjs).
//   node scripts/sideways-open.mjs <baseUrl> [width]
import { chromium } from "@playwright/test";

const [base, w] = process.argv.slice(2);
const width = Number(w) || 360;
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width, height: 760 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "reduce" });
const p = await ctx.newPage();
p.setDefaultTimeout(20000);

const measure = (label) => p.evaluate((label) => {
  document.body.style.overflowX = "visible"; document.querySelectorAll("main").forEach((m) => { m.style.overflowX = "visible"; }); document.documentElement.style.overflowX = "visible";
  const W = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth;
  const out = [];
  for (const e of document.querySelectorAll("body *")) {
    if (e instanceof SVGElement && e.ownerSVGElement) continue;
    const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.right <= W + 1) continue;
    let inside = false; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (a.tagName !== "MAIN" && getComputedStyle(a).overflowX !== "visible") { inside = true; break; }
    if (inside || out.some((o) => o.contains(e))) continue;
    out.push(e);
  }
  document.body.style.overflowX = ""; document.querySelectorAll("main").forEach((m) => { m.style.overflowX = ""; }); document.documentElement.style.overflowX = "";
  const d = (e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0].replace(/^(.*?)_(.*?)__.*$/, "$1_$2")} [${Math.round(e.getBoundingClientRect().left)}..${Math.round(e.getBoundingClientRect().right)}]${getComputedStyle(e).position === "fixed" ? " fixed" : ""} "${(e.textContent || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 36)}"`;
  return { label, sw, W, out: out.slice(0, 5).map(d) };
}, label);

let bad = 0;
const check = async (label, act) => {
  try { await act(); await p.waitForTimeout(900); } catch (e) { console.log(`?? ${label}: could not open (${e.message.split("\n")[0].slice(0, 90)})`); return; }
  const r = await measure(label);
  if (r.out.length || r.sw > r.W + 1) { bad++; console.log(`✗ ${label}: page ${r.sw}px of ${r.W}\n    ${r.out.join("\n    ")}`); } else console.log(`✓ ${label}`);
};
const go = async (u, wait = 2500) => { await p.goto(base + u, { timeout: 120000 }); await p.waitForTimeout(wait); };
const iliad = async () => { await go("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1", 0); await p.locator('[data-key="1.1"]').first().waitFor({ timeout: 60000 }); await p.waitForTimeout(1500); };
const bar = () => p.getByRole("toolbar", { name: "Reading" });
const aid = async (name) => { await bar().getByRole("button", { name: "Aids" }).click(); await p.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name, exact: true }).click(); };

await go("/");
await check("home", async () => {});
await check("quick search, typed", async () => { await p.getByRole("button", { name: /^Search/ }).last().click(); await p.getByRole("combobox", { name: "Search" }).fill("sparta"); await p.waitForTimeout(1500); });
await check("quick search, Greek keyboard", async () => { await p.getByRole("button", { name: "Greek letters on screen" }).click(); });
await go("/");
await check("settings", async () => { await p.getByRole("button", { name: "Settings" }).first().click(); });
await go("/");
await check("home scrolled to the end", async () => { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } }); });

await iliad();
await check("reader", async () => {});
await check("reader: word look-up", async () => { await p.locator('[data-u="1.1"] [data-w="μῆνιν"]').first().click(); await p.waitForTimeout(2500); });
await iliad();
await check("reader: passage toolbar", async () => { await p.locator('[data-key="1.1"] button[data-row]').first().click(); });
await iliad();
await check("reader: aids sheet", async () => { await bar().getByRole("button", { name: "Aids" }).click(); });
await iliad();
await check("reader: text size sheet", async () => { await bar().getByRole("button", { name: "Text size and spacing" }).click(); });
await iliad();
await check("reader: contents", async () => { await bar().getByRole("button", { name: /^Contents/ }).click(); });
for (const a of ["Vocabulary", "Places", "Manuscript"]) { await iliad(); await check(`reader: ${a}`, async () => { await aid(a); await p.waitForTimeout(3000); }); }
for (const a of ["Transliteration", "Colour by case", "Metre", "Fit lines", "Try it first"]) {
  await iliad(); await check(`reader: ${a} on`, async () => { await aid(a); await p.mouse.click(10, 200); await p.waitForTimeout(1500); });
  await aid(a).catch(() => {}); await p.mouse.click(10, 200);
}
await iliad();
await check("reader: Echoes", async () => { await p.locator('[data-key="1.1"] button[data-row]').first().click(); await p.getByRole("button", { name: "Echoes" }).first().click(); await p.waitForTimeout(4000); });
await go("/read?w=tlg0012.tlg001&w2=tlg0012.tlg002", 8000);
await check("reader: two books", async () => {});
await check("reader: two books, scrolled", async () => { await p.evaluate(async () => { for (let y = 0; y < 20000; y += 900) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } }); });
await go("/read?w=tlg0059.tlg030", 8000);
await check("reader: Republic", async () => {});
await go("/read?w=tlg0031.tlg004", 8000);
await check("reader: John (verses)", async () => {});

for (const u of ["/academy/tables", "/academy/practice", "/academy/today", "/academy/review", "/academy/alphabet", "/academy/lesson/third-declension", "/academy/lesson/participles", "/academy/lesson/metre",
  "/stoa/census", "/stoa/census?c=people", "/stoa/eras", "/stoa/editions", "/treasury", "/treasury?s=words", "/treasury?s=notes", "/downloads", "/search?q=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82", "/search?m=lemma&q=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82"]) {
  await go(u, 3500);
  await check(u, async () => { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } }); });
}
await b.close();
console.log(`${bad} problems at ${width}px`);
