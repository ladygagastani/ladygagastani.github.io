import { test, expect } from "@playwright/test";

const btt = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Back to top" });

test("a long wiki entry offers 'Back to top' once you have scrolled down, and it takes you there", async ({ page }) => {
  await page.goto("/stoa/pericles");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(btt(page)).toHaveCount(0);
  await page.mouse.wheel(0, 2500);
  await expect(btt(page)).toBeVisible();
  await btt(page).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(btt(page)).toHaveCount(0);
});

test("two books side by side: each has its own button, which scrolls only its own book", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/read?w=tlg0012.tlg001&w2=tlg0012.tlg002");
  await expect(page.locator("article [data-key]").first()).toBeVisible();
  await expect(page.locator("article").nth(1).locator("[data-key]").first()).toBeVisible();
  const panes = page.locator("article").locator("xpath=ancestor::div[contains(@class,'pane')][1]");
  await panes.evaluateAll((ps) => ps.forEach((p) => { p.scrollTop = 3000; p.dispatchEvent(new Event("scroll")); }));
  await expect(btt(page)).toHaveCount(2);
  await btt(page).first().click();
  await expect.poll(() => panes.evaluateAll((ps) => ps.map((p) => p.scrollTop > 0))).toEqual([false, true]);
});
