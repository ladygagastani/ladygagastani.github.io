import { chromium } from "@playwright/test";
const out = process.argv[2];
const b = await chromium.launch({ channel: "msedge" });
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: theme });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3100/");
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/h-${theme}-top.png` });
  await p.evaluate(() => localStorage.setItem("mathesis:folds", JSON.stringify(["learn", "passage", "forum"])));
  await p.reload(); await p.waitForTimeout(2000);
  await p.evaluate(() => scrollTo(0, 700)); await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/h-${theme}-folded.png` });
  await p.goto("http://localhost:3100/academy"); await p.waitForTimeout(1200);
  await p.locator(".snap-row").first().scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/h-${theme}-academy.png` });
  await ctx.close();
}
await b.close();
