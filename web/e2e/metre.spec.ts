import { test, expect } from "@playwright/test";

// These tests read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 90_000 });

test("Metre marks Iliad 1.1 from the published scansion, and plays its rhythm", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&ed=perseus-grc2&tr=none&at=1.1");
  await expect(page.locator('[data-u="1.1"]')).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Metre", exact: true }).click();
  const bar = page.getByRole("note", { name: "Metre" });
  await expect(bar).toContainText("Dactylic hexameter");
  await expect(bar).toContainText("hypotactic.com");
  const line = page.locator('[data-u="1.1"] [data-metre="scanned"]');
  await expect(line.locator("[data-q]")).toHaveCount(16);
  await expect(line.locator('[data-q="L"]')).toHaveCount(8);
  await line.getByRole("button", { name: "Play the rhythm of this line" }).click();
  await expect(line).toHaveClass(/playing/);
  await bar.getByRole("button", { name: "How this metre works" }).click();
  await expect(bar).toContainText("six feet");
});

test("in a tragedy, spoken lines are scanned and sung ones labelled", async ({ page }) => {
  await page.goto("/read?w=tlg0011.tlg004&tr=none&at=1");
  await expect(page.locator('[data-u="1"]')).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Metre", exact: true }).click();
  await expect(page.getByRole("note", { name: "Metre" })).toContainText("Iambic trimeter in the spoken parts");
  await expect(page.locator('[data-u="1"] [data-metre="scanned"] [data-q]').first()).toBeVisible();
  await page.getByLabel("Page", { exact: true }).selectOption({ index: 1 });
  await expect(page.getByText(/sung or chanted; not scanned/).first()).toBeVisible({ timeout: 30_000 });
});

test("the metre lesson shows Homer's lines scanned", async ({ page }) => {
  await page.goto("/academy/lesson/metre");
  const iliad = page.locator('[data-real="tlg0012.tlg001:1.1"]');
  await expect(iliad.locator("[data-q]").first()).toBeVisible({ timeout: 30_000 });
  await expect(iliad.locator("[data-q]")).toHaveCount(16);
});
