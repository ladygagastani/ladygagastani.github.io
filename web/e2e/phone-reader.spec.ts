import { test, expect, type Page } from "@playwright/test";

// Phase 10: the reader made for one hand (ReadBar.tsx). These read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 60_000 });
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

const openIliad = async (page: Page, at = "1.1") => {
  await page.goto(`/read?w=tlg0012.tlg001&tr=perseus-eng3&at=${at}`);
  await expect(page.locator(`[data-key="${at}"]`).first()).toBeVisible({ timeout: 30_000 });
};
const readBar = (page: Page) => page.getByRole("toolbar", { name: "Reading" });
const top = (page: Page, sel: string) => page.locator(sel).first().evaluate((e) => Math.round(e.getBoundingClientRect().top));

test("the reader's controls sit in a bar at the bottom, above the site's bar", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  await expect(bar).toBeVisible();
  // the page's sticky bar at the top gives way to it
  await expect(page.getByLabel("Go to reference")).toBeHidden();
  const b = (await bar.boundingBox())!, tabs = (await page.locator("nav[style*='site-tabbar']").boundingBox())!;
  expect(Math.round(b.y + b.height)).toBe(Math.round(tabs.y));
  for (const btn of await bar.getByRole("button").all()) {
    const r = (await btn.boundingBox())!;
    expect(Math.min(r.width, r.height)).toBeGreaterThanOrEqual(44);
  }
  // the end of the page clears both bars (the page grows as passages are drawn, so go to the end each time)
  await expect.poll(() => page.evaluate(async () => {
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((f) => setTimeout(f, 400));
    const last = document.querySelector("main")!.lastElementChild!.getBoundingClientRect();
    return Math.round(document.querySelector("[data-readbar]")!.getBoundingClientRect().top - last.bottom);
  })).toBeGreaterThanOrEqual(-1);
});

test("next and previous turn to the next book, and the bar says where you are", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  await expect(bar.getByRole("button", { name: /^Contents/ })).toContainText("Book 1");
  await bar.getByRole("button", { name: "Next: Book 2" }).click();
  await expect(page).toHaveURL(/at=2\.1/);
  await expect(bar.getByRole("button", { name: /^Contents/ })).toContainText("Book 2");
  await bar.getByRole("button", { name: "Previous: Book 1" }).click();
  await expect(page).toHaveURL(/at=1\.1/);
});

test("the contents drawer lists the books, goes to a passage, and swipes away", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  await bar.getByRole("button", { name: /^Contents/ }).click();
  const drawer = page.getByRole("dialog", { name: "Iliad" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Book 1", exact: true })).toHaveAttribute("aria-current", "true");
  await expect(drawer.getByRole("button", { name: "Book 24", exact: true })).toBeAttached();
  await drawer.getByRole("button", { name: "Book 3", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/at=3\.1/);

  // go to a passage: it lands just below the site's header, clear of it
  await bar.getByRole("button", { name: /^Contents/ }).click();
  await drawer.getByLabel("Go to a passage").fill("1.40");
  await drawer.getByRole("button", { name: "Go", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator('[data-key="1.40"]')).toBeVisible();
  await expect.poll(async () => {
    const hdr = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-vis")) || 0);
    return (await top(page, '[data-key="1.40"]')) - hdr;
  }).toBeGreaterThanOrEqual(0);
  expect(await top(page, '[data-key="1.40"]')).toBeLessThan(140);

  // a swipe to the left puts the drawer away
  await bar.getByRole("button", { name: /^Contents/ }).click();
  await expect(drawer).toBeVisible();
  await expect.poll(async () => (await drawer.boundingBox())!.x).toBe(0);   // slid fully in
  const d = (await drawer.boundingBox())!;
  await page.mouse.move(d.x + d.width - 40, d.y + 200);
  await page.mouse.down();
  await page.mouse.move(d.x + 20, d.y + 205, { steps: 8 });
  await page.mouse.up();
  await expect(drawer).toBeHidden();
});

test("reading aids and text size open as sheets over the bar, and a tap elsewhere puts them away", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  await bar.getByRole("button", { name: "Aids" }).click();
  const aids = page.getByRole("dialog", { name: "Reading aids" });
  await expect(aids).toBeVisible();
  await aids.getByRole("button", { name: "Transliteration" }).click();
  await expect(page.locator('[data-key="1.1"]').first()).toContainText("mēnin");
  await aids.getByRole("button", { name: "Transliteration" }).click();
  // a tap on the text outside the sheet puts it away
  await page.mouse.click(30, 200);
  await expect(aids).toBeHidden();

  await bar.getByRole("button", { name: "Text size and spacing" }).click();
  const size = page.getByRole("dialog", { name: "Text size and spacing" });
  await expect(size).toBeVisible();
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"));
  await size.getByRole("button", { name: "Larger Greek text" }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"))).not.toBe(before);
  await size.getByRole("button", { name: "Close text size and spacing" }).click();
  await expect(size).toBeHidden();
});

test("a tap on the page gives a clean page, with a line showing how far through the book; another brings the bars back", async ({ page }) => {
  await openIliad(page, "1.20");
  const html = page.locator("html");
  // a point on the page away from any word or button (the space after a line, or between lines)
  await page.waitForTimeout(800);
  const spot = await page.locator('[data-key="1.20"]').first().evaluate((row) => {
    const r = row.getBoundingClientRect();
    for (let y = r.top + 6; y < r.bottom; y += 4) for (let x = r.right - 4; x > r.left + 60; x -= 6) {
      const e = document.elementFromPoint(x, y);
      if (e && row.contains(e) && !e.closest("[data-w], button, a, input")) return { x, y };
    }
    return null;
  });
  expect(spot).not.toBeNull();
  const r = { x: spot!.x, y: spot!.y, width: 8 };
  // (the jump to 1.20 scrolled down, which tucked the bars away: a small scroll up brings them back first)
  await page.mouse.wheel(0, -40);
  await expect(html).toHaveAttribute("data-hdr", "shown");
  await page.mouse.click(r.x + r.width - 8, r.y);
  await expect(html).toHaveAttribute("data-hdr", "hidden");
  await expect.poll(() => readBar(page).evaluate((e) => e.getBoundingClientRect().top)).toBeGreaterThanOrEqual(812);
  await expect.poll(() => page.locator("[class*='ReadBar'][class*='progress']").evaluate((e) => getComputedStyle(e).opacity)).not.toBe("0");
  await page.mouse.click(r.x + r.width - 8, r.y);
  await expect(html).toHaveAttribute("data-hdr", "shown");
  // a word still opens its look-up instead
  const word = page.locator('[data-u="1.20"] [data-w]').first();
  await word.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const before = await html.getAttribute("data-hdr");
  await word.click();
  await expect(page.getByRole("complementary", { name: /^Look-up/ })).toBeVisible();
  expect(await html.getAttribute("data-hdr")).toBe(before);
});

test("pinching the Greek changes its size, and the passage under the fingers stays put", async ({ page }) => {
  await openIliad(page, "1.20");
  const key = '[data-key="1.20"]';
  await page.waitForTimeout(800);
  const y0 = await top(page, key);
  const size0 = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--greek-size")));
  // two fingers moving apart over the passage (synthetic touches: Playwright's touchscreen only taps)
  await page.evaluate(async (sel) => {
    const el = document.querySelector<HTMLElement>(sel)!, r = el.getBoundingClientRect(), y = r.top + 30, t = document.querySelector("article")!;
    const touches = (gap: number) => [0, 1].map((i) => new Touch({ identifier: i, target: t, clientX: 187 + (i ? gap : -gap), clientY: y }));
    const fire = (type: string, list: Touch[]) => t.dispatchEvent(new TouchEvent(type, { touches: type === "touchend" ? [] : list, changedTouches: list, bubbles: true, cancelable: true }));
    fire("touchstart", touches(50));
    for (let g = 55; g <= 90; g += 5) { fire("touchmove", touches(g)); await new Promise((f) => requestAnimationFrame(f)); }
    fire("touchend", touches(90));
  }, key);
  await expect.poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--greek-size")))).toBeGreaterThan(size0 * 1.4);
  // remembered in Settings
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings")!).state.greekSize);
  expect(saved).toBeGreaterThan(size0 * 1.4);
  expect(Math.abs((await top(page, key)) - y0)).toBeLessThan(40);
});

test("the look-up is a sheet: it opens at a peek, drags to half or full height, steps word to word, and drags away", async ({ page }) => {
  await openIliad(page);
  const words = page.locator('[data-u="1.1"] [data-w]');
  const first = await words.nth(0).getAttribute("data-w"), second = await words.nth(1).getAttribute("data-w");
  await words.nth(0).click();
  const sheet = page.getByRole("complementary", { name: `Look-up: ${first}` });
  await expect(sheet).toBeVisible();
  const height = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().height));
  await expect.poll(height).toBe(Math.round(Math.min(812 * 0.46, 400)));
  // all of it, by the button
  await sheet.getByRole("button", { name: "Show all of the look-up" }).click();
  await expect.poll(height).toBe(812 - 10);
  // the next word, by the button and back by a swipe to the right
  await sheet.getByRole("button", { name: "Next word" }).click();
  const next = page.getByRole("complementary", { name: `Look-up: ${second}` });
  await expect(next).toBeVisible();
  const head = async () => (await next.locator("div").first().boundingBox())!;
  let h = await head();
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 220, h.y + h.height / 2 + 4, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("complementary", { name: `Look-up: ${first}` })).toBeVisible();
  await expect.poll(height).toBe(812 - 10);   // moving word to word keeps the height
  // drag the handle down to about half: it settles at half
  const s = page.getByRole("complementary", { name: `Look-up: ${first}` });
  h = (await s.locator("div").first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, h.y + 10 + 250, { steps: 25 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect.poll(() => s.evaluate((e) => Math.round(e.getBoundingClientRect().height))).toBe(Math.round(812 * 0.7));
  // and well down: it closes
  h = (await s.locator("div").first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, 790, { steps: 25 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect(s).toBeHidden();
});

test("press and hold a word: the passage actions dock at the bottom with the word's meaning, and More opens the look-up", async ({ page }) => {
  await openIliad(page);
  const word = page.locator('[data-u="1.1"] [data-w="ἄειδε"]');
  // a finger selects the word (the phone's own press-and-hold selection, made here by script after a touch)
  const box = (await word.boundingBox())!;
  await page.touchscreen.tap(box.x + 2, box.y - 30);
  await word.evaluate((el) => getSelection()!.selectAllChildren(el));
  const bar = page.getByRole("toolbar", { name: "Passage actions" });
  await expect(bar).toBeVisible();
  await expect.poll(() => bar.evaluate((e) => Math.round(e.getBoundingClientRect().bottom))).toBe(812);
  await expect(bar).toContainText("ἀείδω");
  await expect(bar).toContainText(/sing/);
  for (const b of await bar.getByRole("button").all()) {
    const r = (await b.boundingBox())!;
    if (!(await b.getAttribute("aria-label"))?.startsWith("Highlight")) expect(r.height, await b.textContent() ?? "").toBeGreaterThanOrEqual(44);
  }
  await bar.getByRole("button", { name: "More" }).click();
  await expect(page.getByRole("complementary", { name: "Look-up: ἄειδε" })).toBeVisible();
  await expect(bar).toBeHidden();

  // a passage number: the actions for the whole passage, without a word's meaning; × closes them
  await page.getByRole("button", { name: "Close look-up" }).click();
  await page.locator('[data-key="1.1"] button[data-row]').first().click();
  await expect(bar).toBeVisible();
  await expect(bar).not.toContainText("More");
  await bar.getByRole("button", { name: "Close passage actions" }).click();
  await expect(bar).toBeHidden();
});

test("Try it first hides each translation until it is tapped; Fit lines keeps every verse line whole", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  await bar.getByRole("button", { name: "Aids" }).click();
  const aids = page.getByRole("dialog", { name: "Reading aids" });
  await aids.getByRole("button", { name: "Try it first" }).click();
  await page.keyboard.press("Escape");
  const tr = page.locator('[data-key="1.1"] [data-veiled]');
  await expect(tr).toBeVisible();
  await expect(page.getByText("The wrath sing, goddess")).toBeHidden();
  await tr.getByRole("button", { name: /tap to see the translation/i }).click();
  await expect(page.getByText(/The wrath sing, goddess/)).toBeVisible();
  // the next passage is still veiled
  await expect(page.locator('[data-key="1.5"] [data-veiled]')).toBeAttached();

  await page.mouse.wheel(0, -40);   // (reaching the veil scrolled down, which tucked the bars away)
  await bar.getByRole("button", { name: "Aids" }).click();
  await aids.getByRole("button", { name: "Try it first" }).click();
  await aids.getByRole("button", { name: "Fit lines" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-veiled]")).toHaveCount(0);
  const fit = () => page.locator("article").evaluate((a) => parseFloat(getComputedStyle(a).getPropertyValue("--fit")) || 1);
  await expect.poll(fit).toBeLessThan(1);
  expect(await fit()).toBeGreaterThanOrEqual(0.5);
  // every line of the book on this page fits its column, including those drawn only when scrolled to
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((f) => setTimeout(f, 20)); } });
  const over = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("article [class*='_lt_']")].filter((lt) => lt.scrollWidth > lt.clientWidth + 1).length);
  expect(over).toBe(0);
  // remembered
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings")!).state.fitLines)).toBe(true);
});

test("a reading aid that opens a panel puts the aids sheet away, so the panel is not hidden under it", async ({ page }) => {
  await openIliad(page);
  const bar = readBar(page);
  const aids = page.getByRole("dialog", { name: "Reading aids" });
  for (const [aid, panel] of [["Vocabulary", /vocabulary/i], ["Places", "Places on this page"], ["Manuscript", "The manuscript"]] as const) {
    await bar.getByRole("button", { name: "Aids" }).click();
    await expect(aids).toBeVisible();
    await aids.getByRole("button", { name: aid, exact: true }).click();
    await expect(aids).toBeHidden();
    const shown = page.getByRole("complementary", { name: panel }).first();
    await expect(shown).toBeVisible();
    await shown.getByRole("button", { name: /^Close/ }).first().click();
    await expect(shown).toBeHidden();
  }
});
