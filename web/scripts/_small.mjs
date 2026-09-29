import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "msedge" });
const p = await (await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage();
for (const path of process.argv.slice(2)) {
  await p.goto("http://localhost:3100" + path); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => [...document.querySelectorAll("a[href], button")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 43.5 || r.width < 43.5) && !(e.tagName === "A" && getComputedStyle(e).display === "inline") && !e.classList.contains("chip"); })
    .slice(0, 6).map((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)} ${e.outerHTML.slice(0, 150)}  <in ${String(e.parentElement.getAttribute("class")).slice(0, 40)}>`; }));
  console.log(path); r.forEach((x) => console.log("   ", x));
}
await b.close();
