import { test, expect, type Page } from "@playwright/test";

// Phase 10, step 4: the other pages on a phone.
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

/** Synthetic touches (Playwright's touchscreen only taps): each step lists the fingers' [x, y]. */
async function touch(page: Page, target: string, steps: [number, number][][]) {
  await page.evaluate(async ({ target, steps }) => {
    const el = document.querySelector(target)!;
    let prev: Touch[] = [];
    const make = (pts: [number, number][]) => pts.map(([x, y], i) => new Touch({ identifier: i, target: el, clientX: x, clientY: y }));
    const fire = (type: string, touches: Touch[], changed: Touch[]) =>
      el.dispatchEvent(new TouchEvent(type, { touches, targetTouches: touches, changedTouches: changed, bubbles: true, cancelable: true }));
    for (let i = 0; i < steps.length; i++) {
      const now = make(steps[i]);
      fire(i === 0 ? "touchstart" : "touchmove", now, now);
      prev = now;
      await new Promise((f) => requestAnimationFrame(() => f(null)));
    }
    fire("touchend", [], prev);
  }, { target, steps });
}

test("home sections fold away, stay folded after a reload, and open again", async ({ page }) => {
  await page.goto("/");
  const fold = page.getByRole("button", { name: /Fold away “Passage of the day”/ });
  await fold.click();
  await expect(page.locator("html")).toHaveAttribute("data-folds", "passage");
  await expect(page.locator('[data-fold="passage"] [data-fold-hide]').first()).toBeHidden();
  await page.reload();
  // folded before the page is drawn (the boot script), and the button says so once the page runs
  await expect(page.locator("html")).toHaveAttribute("data-folds", "passage");
  await expect(page.locator('[data-fold="passage"] [data-fold-hide]').first()).toBeHidden();
  const open = page.getByRole("button", { name: /Show “Passage of the day”/ });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  await expect(page.locator('[data-fold="passage"] [data-fold-hide]').first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("mathesis:folds"))).toBe("[]");
});

test("card rows scroll sideways and snap, with the next card peeking in", async ({ page }) => {
  await page.goto("/academy");
  const row = page.locator(".snap-row").first();
  const info = await row.evaluate((e) => ({ scroll: e.scrollWidth > e.clientWidth, snap: getComputedStyle(e).scrollSnapType, first: e.firstElementChild!.getBoundingClientRect().width }));
  expect(info.scroll).toBe(true);
  expect(info.snap).toContain("x");
  expect(info.first).toBeLessThan(375 * 0.9);   // the next card shows at the edge
});

test("an offline phone says so above the bar", async ({ page, context }) => {
  await page.goto("/academy");
  await context.setOffline(true);
  await page.evaluate(() => dispatchEvent(new Event("offline")));
  const sign = page.getByRole("navigation", { name: "Areas of the site" }).getByRole("status");
  await expect(sign).toContainText("Offline");
  await context.setOffline(false);
  await page.evaluate(() => dispatchEvent(new Event("online")));
  await expect(sign).toBeHidden({ timeout: 20_000 });
});

test("pull down to refresh the Town Hall", async ({ page }) => {
  await page.goto("/town-hall");
  await expect(page.getByText(/Gathering the conversations|Latest activity/).first()).toBeVisible();
  await page.waitForTimeout(1500);
  const asked = [] as string[];
  page.on("request", (r) => { if (/rest\/v1\/(threads|forum_threads)/.test(r.url())) asked.push(r.url()); });
  await touch(page, "main", [[[187, 200]], [[187, 260]], [[187, 330]], [[187, 400]]]);
  await expect.poll(() => asked.length).toBeGreaterThan(0);
  // the ring spins while it waits, then goes
  await expect(page.locator(".pull")).not.toHaveAttribute("data-waiting", /.*/, { timeout: 20_000 });
});

test("the map: two fingers move it, one finger leaves it be and shows a hint", async ({ page }) => {
  await page.goto("/stoa/periplus");
  const stage = page.getByRole("application", { name: /Map of the Greek world/ });
  await expect(stage).toHaveAttribute("data-view", /\d/);   // painted, and at rest
  await page.waitForTimeout(600);
  const view = () => stage.getAttribute("data-view");
  const before = await view();
  const b = (await stage.boundingBox())!;
  const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
  // one finger: the map stays, a hint appears
  await touch(page, "[role='application']", [[[cx, cy]], [[cx + 20, cy + 30]], [[cx + 40, cy + 70]]]);
  expect(await view()).toBe(before);
  await expect(stage.getByRole("status")).toHaveText("Use two fingers to move the map");
  // two fingers: it moves
  await touch(page, "[role='application']", [[[cx - 40, cy], [cx + 40, cy]], [[cx - 10, cy + 30], [cx + 70, cy + 30]], [[cx + 20, cy + 60], [cx + 100, cy + 60]]]);
  await expect.poll(view).not.toBe(before);
});

test("a sideways swipe moves between the Oracle's kinds of search, and the Census's lists", async ({ page }) => {
  await page.goto("/search?q=λόγος");
  await expect(page.getByRole("tab", { name: /Greek/ }).first()).toHaveAttribute("aria-selected", "true");
  await touch(page, "[class*='Search'][class*='results']", [[[300, 600]], [[240, 603]], [[160, 606]], [[90, 608]]]);
  await expect(page).toHaveURL(/m=lemma/);

  await page.goto("/stoa/census?c=god");
  await expect(page.getByRole("button", { name: /Gods and heroes/ })).toHaveAttribute("aria-pressed", "true");
  await touch(page, "[class*='Census'][class*='census']", [[[300, 600]], [[240, 603]], [[160, 606]], [[90, 608]]]);
  await expect(page).not.toHaveURL(/c=god/);
});

test("an iPhone finds the home-screen icon", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  const res = await request.get("/apple-touch-icon.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
