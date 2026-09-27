import { test, expect } from "@playwright/test";

test("the Painted Stoa lists its entries and searches them", async ({ page }) => {
  await page.goto("/stoa");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Painted Stoa");
  const search = page.getByRole("searchbox", { name: "Search the Painted Stoa" });
  await search.fill("ostracis");
  await expect(page.getByRole("link", { name: /Ostracism/ }).first()).toBeVisible();
});

test("an entry shows its picture with a credit, its quotations, and links into the reader", async ({ page }) => {
  await page.goto("/stoa/pericles");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Pericles");
  const lead = page.locator("figure").first();
  await expect(lead.locator("img")).toHaveAttribute("src", "/images/pericles-bust.jpg");
  await expect(lead).toContainText("CC BY 2.5");
  await expect(page.getByText("ἐγίγνετό τε λόγῳ μὲν δημοκρατία")).toBeVisible();
  await expect(page.getByRole("link", { name: "Thucydides 2.35–46" })).toHaveAttribute("href", /\/read\?w=tlg0003\.tlg001/);
});

test("a note on a section of an entry is saved, marked beside the scroll bar, and listed in the Treasury", async ({ page }) => {
  await page.goto("/stoa/pericles");
  await page.getByRole("button", { name: "Write a note on “The Olympian”" }).click();
  const box = page.getByRole("textbox", { name: "Your note on “The Olympian”" });
  await expect(box).toBeFocused();
  await box.fill("Compare Thucydides on his speaking.");
  await page.waitForTimeout(900);   // notes save as you type, after a short pause
  await expect(page.getByRole("listitem", { name: /^Note at The Olympian: Compare Thucydides/ })).toBeAttached();

  await page.reload();
  await expect(page.getByText("Compare Thucydides on his speaking.")).toBeVisible();

  await page.goto("/treasury");
  await expect(page.getByRole("link", { name: "Pericles › The Olympian" })).toBeVisible();
});

test("Quick search finds wiki entries", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search" }).fill("symposi");
  await page.getByRole("option", { name: /The symposium/ }).click();
  await expect(page).toHaveURL(/\/stoa\/symposium$/);
});

test("the home page shows three entries from the Painted Stoa, one of them from the dark side", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator('section[aria-labelledby="stoa-title"] a[href^="/stoa/"]');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('section[aria-labelledby="stoa-title"]')).toContainText("The dark side");
});

test("the credits page lists every picture with its licence", async ({ page }) => {
  await page.goto("/credits");
  await expect(page.getByRole("heading", { name: "Pictures" })).toBeVisible();
  await expect(page.getByText("Symposium scene from the Tomb of the Diver at Paestum")).toBeVisible();
});
