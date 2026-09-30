import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const theme of ["light", "dark"] as const) {
  test(`herodotus article ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t, motion: "reduced" }, version: 0 })); }, theme);
    await page.goto("/author/tlg0016");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Life and work" })).toBeVisible();
    await expect(page.locator("ol[aria-label=Timeline] li")).toHaveCount(9);
    await expect(page.locator("#sources-title")).toBeVisible();
    await expect(page.locator("ol li[id^=src-]")).toHaveCount(36);
    await page.waitForTimeout(800);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    console.log(theme, JSON.stringify(res.violations.map((v) => [v.id, v.impact, v.nodes.length, v.nodes[0]?.target.join(" ")])));
    expect(res.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  });
}
test("footnote jumps to its source, and a Scroll link opens the passage", async ({ page }) => {
  await page.goto("/author/tlg0016");
  await page.locator('a[aria-label="Source 4"]').first().click();
  await expect(page).toHaveURL(/#src-4$/);
  await expect(page.locator("#src-4")).toBeInViewport();
  await page.locator("#src-6 a").click();
  await expect(page).toHaveURL(/\/read\?w=tlg0016\.tlg001&at=7\.137\.1/);
});
test("the published site carries only checked articles (no draft text)", async ({ page }) => {
  await page.goto("/author/tlg0532");
  await expect(page.locator("[data-article]")).toHaveCount(0);
  await page.goto("/author/tlg0012");
  await expect(page.locator("[data-article]")).toHaveCount(0);
});
