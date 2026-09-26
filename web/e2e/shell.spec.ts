import { test, expect } from "@playwright/test";

test("home page shows the site name, the passage and the offline block", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toContainText("Μάθησις");
  await expect(page.getByRole("heading", { name: "Passage of the day" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read without a connection" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Perseus Digital Library/ }).first()).toHaveAttribute("href", /canonical-greekLit\/archive/);
});

test("clicking a Greek word opens its look-up", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "μῆνιν", exact: true }).click();
  const pop = page.getByRole("dialog", { name: "Look-up: μῆνιν" });
  await expect(pop).toContainText("accusative singular feminine");
  await expect(pop.getByRole("link", { name: "Logeion" })).toHaveAttribute("href", /logeion\.uchicago\.edu/);
  await page.keyboard.press("Escape");
  await expect(pop).toBeHidden();
});

test("moving between areas does not reload the page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
  await page.getByRole("navigation", { name: "Areas of the site" }).getByRole("link", { name: /The Academy/ }).click();
  await expect(page).toHaveURL(/\/academy$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Academy");
  expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
});

test("the chosen theme is remembered after a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Black-figure (dark)" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("every area page opens and explains its name", async ({ page }) => {
  for (const path of ["/library", "/read", "/academy", "/stoa", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus",
    "/town-hall", "/town-hall/pnyx", "/treasury", "/downloads", "/search", "/about", "/credits"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1").first(), path).toBeVisible();
  }
});
