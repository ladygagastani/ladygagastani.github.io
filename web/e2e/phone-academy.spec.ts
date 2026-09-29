import { test, expect, type Page } from "@playwright/test";

// Phase 10, step 3: the Academy on a phone.
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

/** Record every call to navigator.vibrate (phones that allow it buzz; the test browser does not). */
const recordBuzz = (page: Page) => page.addInitScript(() => {
  const w = window as unknown as { buzzes: unknown[] };
  w.buzzes = [];
  Object.defineProperty(Navigator.prototype, "vibrate", { configurable: true, value: (p: unknown) => { w.buzzes.push(p); return true; } });
});
const buzzes = (page: Page) => page.evaluate(() => (window as unknown as { buzzes: unknown[] }).buzzes.length);

/** Drag an element's centre by (dx, dy) with the mouse, in small steps. */
async function drag(page: Page, sel: string, dx: number, dy: number) {
  const b = (await page.locator(sel).first().boundingBox())!;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 12 });
  await page.mouse.up();
}

test("flashcards turn with a tap and answer with a swipe: right knew it, left again", async ({ page }) => {
  await recordBuzz(page);
  await page.goto("/academy/review");
  await page.getByRole("button", { name: /Add the next 20 commonest words/ }).click();
  await expect(page.getByText(/^20 to review/)).toBeVisible();
  const card = "[data-noswipe]";
  // before it is turned, a swipe does nothing; a tap turns it
  await drag(page, card, 200, 0);
  await expect(page.getByText(/^20 to review/)).toBeVisible();
  await page.locator(card).click();
  await expect(page.getByText(/Swipe the card/)).toBeVisible();
  // a short drag springs back without answering
  await drag(page, card, 60, 0);
  await expect(page.getByText(/^20 to review/)).toBeVisible();
  // a throw to the right: "Good", with a buzz
  await drag(page, card, 220, 10);
  await expect(page.getByText(/^19 to review · 1 done/)).toBeVisible();
  expect(await buzzes(page)).toBe(1);
  // a throw to the left: "Again" (the card stays due today), no buzz
  await page.locator(card).click();
  await drag(page, card, -220, 10);
  await expect(page.getByText(/· 2 done/)).toBeVisible();
  expect(await buzzes(page)).toBe(1);
  // the card is back in the middle, ready for the next
  await expect.poll(() => page.locator(card).evaluate((e) => e.style.transform)).toBe("");
});

test("practice answers are large buttons, and a right answer buzzes", async ({ page }) => {
  await recordBuzz(page);
  await page.goto("/academy/practice");
  const options = page.locator("[class*='options'] button");
  await expect(options.first()).toBeVisible();
  for (const b of await options.all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(56);
  await options.first().click();
  const right = await options.first().evaluate((e) => /right/.test(e.className));
  expect(await buzzes(page)).toBe(right ? 1 : 0);
});

test("trace a letter over its guide: a good tracing is praised, a scribble is not", async ({ page }) => {
  await page.goto("/academy/alphabet");
  await page.getByRole("button", { name: "Trace it yourself" }).click();
  const box = page.getByRole("img", { name: /^Write α here/ });
  await expect(box).toBeVisible();
  // follow the guide stroke (α has one), point by point
  const pts = await box.evaluate((svg) => {
    const path = svg.querySelector<SVGPathElement>("path")!, m = (svg as SVGSVGElement).getScreenCTM()!, len = path.getTotalLength();
    return Array.from({ length: 41 }, (_, i) => { const p = path.getPointAtLength((len * i) / 40); const s = new DOMPoint(p.x, p.y).matrixTransform(m); return [s.x, s.y]; });
  });
  await page.mouse.move(pts[0][0], pts[0][1]);
  await page.mouse.down();
  for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y);
  await page.mouse.up();
  await expect(page.getByRole("status").filter({ hasText: "Well written!" })).toBeVisible();
  // a line across the box instead
  const b = (await box.boundingBox())!;
  await page.mouse.move(b.x + 10, b.y + 10);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width - 10, b.y + 20, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
});

test("today's session: full screen, pages turned by Next or a swipe, and a last page with the days in a row", async ({ page }) => {
  await page.goto("/academy/today");
  const top = page.getByRole("list", { name: "Pages of today's session" });
  await expect(top).toBeVisible();
  // it covers the whole screen, the site's bars included
  const session = top.locator("xpath=../..");
  expect(await session.boundingBox()).toEqual({ x: 0, y: 0, width: 375, height: 812 });
  await expect(page.getByRole("heading", { name: /Your cards/ })).toBeVisible();
  await expect(page.getByText(/Your deck is empty for now/)).toBeVisible();
  // a swipe to the left turns the page
  const h = (await page.getByRole("heading", { name: /Your cards/ }).boundingBox())!;
  await page.mouse.move(h.x + 300, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + 60, h.y + 16, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("heading", { name: /One ending/ })).toBeVisible();
  await page.locator("[class*='options'] button").first().click();
  await page.getByRole("button", { name: /^Next/ }).click();
  await expect(page.getByRole("heading", { name: /One real sentence/ })).toBeVisible();
  await page.getByRole("button", { name: /^Skip/ }).click();
  await expect(page.getByRole("heading", { name: /Done for today/ })).toBeVisible();
  await expect(page.getByText(/1 day in a row/)).toBeVisible();
  await expect(page.getByText("The sentence was skipped")).toBeVisible();
  // back goes to the previous page
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("heading", { name: /One real sentence/ })).toBeVisible();
});

test("the vibration switch in Settings stops the buzzes", async ({ page }) => {
  await recordBuzz(page);
  await page.goto("/academy/review");
  await page.getByRole("button", { name: "Settings" }).click();
  const sheet = page.getByRole("dialog", { name: "Settings" });
  await sheet.getByRole("radiogroup", { name: "Short vibrations" }).getByRole("radio", { name: "Off" }).click();
  await sheet.getByRole("button", { name: "Close settings" }).click();
  await page.getByRole("button", { name: /Add the next 20 commonest words/ }).click();
  await page.locator("[data-noswipe]").click();
  await page.getByRole("button", { name: /^Good/ }).click();
  await expect(page.getByText(/1 done/)).toBeVisible();
  expect(await buzzes(page)).toBe(0);
});
