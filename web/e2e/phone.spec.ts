import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Phase 10, the phone edition: the bottom bar, the one-row header, search as a full-screen sheet.
const PHONE = { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true };

const tabBar = (page: Page) => page.getByRole("navigation", { name: "Areas of the site" });
const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

test.describe("on a phone", () => {
  test.use(PHONE);

  test("the bottom bar holds the five places in order, and the header fits in one row", async ({ page }) => {
    await page.goto("/");
    const links = tabBar(page).locator("a, button");
    await expect(links).toHaveCount(5);
    const labels = await links.evaluateAll((els) => els.map((e) => e.firstElementChild?.nextElementSibling?.firstChild?.textContent));
    expect(labels).toEqual(["Library", "Learn Greek", "Search", "Wiki", "My Library"]);
    // the forum moves to the header, where the search button was
    await expect(page.locator("header").getByRole("link", { name: "The Town Hall: Forum" })).toBeVisible();
    await expect(page.locator("header").getByRole("button", { name: "The Oracle: Search" })).toBeHidden();
    // the bar is along the bottom edge of the screen
    const box = (await tabBar(page).boundingBox())!;
    expect(Math.round(box.y + box.height)).toBe(812);
    // the header's sideways menu gives way to the bar; its buttons and the bar's places are finger-sized
    const header = page.locator("header").first();
    await expect(header.getByRole("link", { name: /The Mouseion/ })).toBeHidden();
    for (const el of [...await header.locator("button:visible, a:visible").all(), ...await links.all()]) {
      const b = (await el.boundingBox())!;
      expect(Math.min(b.width, b.height), await el.getAttribute("aria-label") ?? await el.textContent() ?? "").toBeGreaterThanOrEqual(44);
    }
    expect(await noSideways(page)).toBeLessThanOrEqual(0);
  });

  test("a place in the bar opens without reloading, and is marked as the current one", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
    await tabBar(page).getByRole("link", { name: /Learn Greek/ }).click();
    await expect(page).toHaveURL(/\/academy$/);
    await expect(tabBar(page).getByRole("link", { name: /Learn Greek/ })).toHaveAttribute("aria-current", "page");
    expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
    // the reader belongs to the Library
    await page.goto("/read?w=tlg0012.tlg001");
    await expect(tabBar(page).getByRole("link", { name: /^Library/ })).toHaveAttribute("aria-current", "page");
    // pages outside the five places mark none
    await page.goto("/about");
    await expect(tabBar(page).locator("[aria-current]")).toHaveCount(0);
  });

  test("the bar tucks away while reading on and comes back on a scroll up", async ({ page }) => {
    await page.goto("/academy");
    const bottom = () => tabBar(page).evaluate((e) => Math.round(e.getBoundingClientRect().top));
    await page.mouse.wheel(0, 700);
    await expect(page.locator("html")).toHaveAttribute("data-hdr", "hidden");
    await expect.poll(bottom).toBeGreaterThanOrEqual(812);
    await page.mouse.wheel(0, -200);
    await expect(page.locator("html")).toHaveAttribute("data-hdr", "shown");
    const h = await tabBar(page).evaluate((e) => e.getBoundingClientRect().height);
    await expect.poll(bottom).toBe(Math.round(812 - h));
  });

  test("the end of a page is never hidden under the bar", async ({ page }) => {
    await page.goto("/about");
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    // at the very end the bar shows again, and the footer ends just above it
    await expect(page.locator("html")).not.toHaveAttribute("data-hdr", "hidden");
    await expect.poll(() => page.evaluate(() => {
      const bar = document.querySelector("nav[style*='site-tabbar']")!.getBoundingClientRect().top;
      return Math.round(document.querySelector(".site-footer")!.getBoundingClientRect().bottom - bar);
    })).toBeLessThanOrEqual(1);
  });

  test("search opens as a full-screen sheet with Greek letters, and closes", async ({ page }) => {
    await page.goto("/");
    await tabBar(page).getByRole("button", { name: /^Search/ }).click();
    const sheet = page.getByRole("dialog", { name: "Quick search" });
    await expect(sheet).toBeVisible();
    // it rises into place, then covers the whole screen
    await expect.poll(async () => { const b = (await sheet.boundingBox())!; return [b.x, b.y, b.width, b.height]; }).toEqual([0, 0, 375, 812]);
    await sheet.getByRole("button", { name: "Greek letters on screen" }).click();
    await sheet.getByRole("button", { name: "lambda" }).click();
    await sheet.getByRole("button", { name: "omicron", exact: true }).click();
    await sheet.getByRole("button", { name: "gamma" }).click();
    await expect(sheet.getByRole("combobox", { name: "Search" })).toHaveValue("λογ");
    await expect(sheet.getByRole("option").first()).toContainText("λογ");
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
  });

  test("Settings rise from the bottom, and go away with a drag down or the Close button", async ({ page }) => {
    await page.goto("/");
    const sheet = page.getByRole("dialog", { name: "Settings" });
    const top = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().top));
    const bottom = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().bottom));
    await page.getByRole("button", { name: "Settings" }).click();
    await expect.poll(bottom).toBe(812);
    for (const b of await sheet.getByRole("button").or(sheet.getByRole("radio")).all()) {
      if (!await b.isVisible()) continue;
      expect((await b.boundingBox())!.height, await b.textContent() ?? "").toBeGreaterThanOrEqual(44);
    }
    // a short drag springs back
    const y0 = await top();
    await page.mouse.move(187, y0 + 12);
    await page.mouse.down();
    await page.mouse.move(187, y0 + 50, { steps: 5 });
    await page.mouse.up();
    await expect.poll(top).toBe(y0);
    await expect(sheet).toBeVisible();
    // a long one puts it away
    await page.mouse.move(187, y0 + 12);
    await page.mouse.down();
    await page.mouse.move(187, y0 + 260, { steps: 8 });
    await page.mouse.up();
    await expect(sheet).toBeHidden();
    // and it opens in place again, not where the finger left it
    await page.getByRole("button", { name: "Settings" }).click();
    await expect.poll(top).toBe(y0);
    await sheet.getByRole("button", { name: "Close settings" }).click();
    await expect(sheet).toBeHidden();
  });

  for (const theme of ["light", "dark"] as const) {
    test(`the phone header, bar and sheets pass the accessibility check (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => {
        localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t, motion: "reduce" }, version: 0 }));
      }, theme);
      const check = async (what: string) => {
        const res = await new AxeBuilder({ page }).include("header").include("nav[style*='site-tabbar']").include("dialog[open]")
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`), what).toEqual([]);
      };
      await page.goto("/academy");
      await expect(page.locator("h1").first()).toBeVisible();
      await check("header and bar");
      await page.getByRole("button", { name: "Settings" }).click();
      await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
      await check("Settings");
      await page.keyboard.press("Escape");
      await tabBar(page).getByRole("button", { name: /^Search/ }).click();
      await page.getByRole("button", { name: "Greek letters on screen" }).click();
      await page.getByRole("combobox", { name: "Search" }).fill("logos");
      await check("Quick search");
    });
  }

  test("nothing pokes out sideways, even on the smallest phones", async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 700 });
      for (const path of ["/", "/library", "/academy", "/stoa", "/town-hall", "/treasury", "/read?w=tlg0012.tlg001"]) {
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        expect(await noSideways(page), `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });
});

test("the browser's bar takes the colour of the theme chosen in Settings", async ({ page }) => {
  await page.goto("/");
  const first = () => page.locator('meta[name="theme-color"]').first().evaluate((m) => [m.getAttribute("media"), m.getAttribute("content")]);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Black-figure (dark)" }).click();
  expect(await first()).toEqual([null, "#16110E"]);
  await page.reload();
  expect(await first()).toEqual([null, "#16110E"]);
  await expect(page.locator('meta[name="theme-color"]:not([media])')).toHaveCount(1);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Papyrus (light)" }).click();
  expect(await first()).toEqual([null, "#E6C39B"]);
  await page.getByRole("radio", { name: "Automatic" }).first().click();
  await expect(page.locator('meta[name="theme-color"]:not([media])')).toHaveCount(0);
});

test("wide screens keep the header's menu and have no bottom bar", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header").getByRole("link", { name: /The Mouseion/ })).toBeVisible();
  await expect(page.locator("nav[style*='site-tabbar']")).toBeHidden();
  // the header's search button opens Quick search, which also leads to the Oracle's full page
  await page.getByRole("button", { name: "The Oracle: Search" }).click();
  const box = page.getByRole("dialog", { name: "Quick search" });
  await box.getByRole("link", { name: /the full search/ }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(box).toBeHidden();
});
