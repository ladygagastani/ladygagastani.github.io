// Phone check, part 3: as a phone really behaves (animations on, the page's own clipping in place), does the
// screen's layout width ever grow past the phone's width, even for a moment while something slides in?
// Samples window.innerWidth every animation frame during each action.
//   node scripts/sideways-live.mjs <baseUrl> [width]
import { chromium } from "@playwright/test";

const [base, w] = process.argv.slice(2);
const width = Number(w) || 360;
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width, height: 760 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "no-preference" });
await ctx.addInitScript(() => {
  // the widest the layout got, sampled every frame from the start of the page
  window.__widest = 0;
  const tick = () => { window.__widest = Math.max(window.__widest, innerWidth, document.documentElement.scrollWidth); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
const p = await ctx.newPage();
p.setDefaultTimeout(30000);
let bad = 0;
const check = async (label, act) => {
  await p.evaluate(() => { window.__widest = 0; });
  try { await act(); await p.waitForTimeout(1500); } catch (e) { console.log(`?? ${label}: ${e.message.split("\n")[0].slice(0, 100)}`); return; }
  const widest = await p.evaluate(() => window.__widest);
  if (widest > width + 1) { bad++; console.log(`✗ ${label}: the page was ${widest}px wide at some moment`); } else console.log(`✓ ${label}`);
};
const go = (u) => check(`load ${u}`, async () => { await p.goto(base + u, { timeout: 120000 }); await p.waitForTimeout(2500); });
const iliad = () => go("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1").then(() => p.locator('[data-key="1.1"]').first().waitFor({ timeout: 60000 }));
const bar = () => p.getByRole("toolbar", { name: "Reading" });
const aid = async (name) => { await bar().getByRole("button", { name: "Aids" }).click(); await p.waitForTimeout(500); await p.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name, exact: true }).click(); };
const scrollAll = () => p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });

for (const u of ["/", "/library", "/academy", "/academy/today", "/academy/alphabet", "/academy/lesson/letters", "/academy/practice", "/stoa", "/stoa/womens-lives", "/stoa/census", "/stoa/periplus", "/town-hall", "/treasury", "/search"]) {
  await go(u);
  await check(`${u} scrolled`, scrollAll);
}
await go("/");
await check("menu nudge / quick search", async () => { await p.getByRole("button", { name: /^Search/ }).last().click(); await p.getByRole("combobox", { name: "Search" }).fill("plato"); });
await go("/");
await check("settings", async () => { await p.getByRole("button", { name: "Settings" }).first().click(); });
await go("/academy/today");
await check("today: next page", async () => { for (let i = 0; i < 3; i++) { const b2 = p.getByRole("button", { name: /next|start|begin|continue/i }).first(); if (await b2.count()) { await b2.click(); await p.waitForTimeout(900); } } });
await go("/stoa/census");
await check("census: open an item", async () => { await p.locator("main button, main a[href*='i=']").nth(6).click(); await p.waitForTimeout(1500); });

await iliad();
await check("reader scrolled", async () => { await p.evaluate(async () => { for (let y = 0; y < 8000; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); }); });
await check("reader: word look-up", async () => { await p.locator('[data-u="1.1"] [data-w="μῆνιν"]').first().click(); await p.waitForTimeout(2000); });
await check("reader: next word (swipe panel)", async () => { await p.locator('[data-u="1.1"] [data-w="ἄειδε"]').first().click(); await p.waitForTimeout(1500); });
await iliad();
await check("reader again (markers slide in)", async () => {});
for (const a of ["Vocabulary", "Places", "Manuscript"]) { await iliad(); await check(`reader: ${a}`, async () => { await aid(a); await p.waitForTimeout(2500); }); }
await iliad();
await check("reader: passage toolbar", async () => { await p.locator('[data-key="1.1"] button[data-row]').first().click(); });
await iliad();
await check("reader: next book", async () => { await bar().getByRole("button", { name: /next/i }).last().click(); await p.waitForTimeout(3000); });
await go("/read?w=tlg0012.tlg001&w2=tlg0012.tlg002");
await check("reader: two books scrolled", scrollAll);
await b.close();
console.log(`${bad} problems at ${width}px`);
