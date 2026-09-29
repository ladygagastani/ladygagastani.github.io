import { test, expect, type Page } from "@playwright/test";

// These tests read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 60_000 });

const openIliad = async (page: Page, extra = "") => {
  await page.goto(`/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1${extra}`);
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
};

test("the reader shows the Iliad with Murray's translation beside it", async ({ page }) => {
  await openIliad(page);
  const row = page.locator('[data-key="1.1"]').first();
  await expect(row).toContainText("μῆνιν ἄειδε θεὰ");
  await expect(row).toContainText("The wrath sing, goddess");
  await expect(page.getByText(/Greek read from/)).toContainText("shown exactly as published");
});

test("going to a reference opens the right book", async ({ page }) => {
  await openIliad(page);
  await page.getByLabel("Go to reference").fill("2.1");
  await page.getByRole("button", { name: "Go", exact: true }).click();
  await expect(page.getByLabel("Page", { exact: true })).toHaveValue("1");
  await expect(page.locator('[data-u="2.1"]')).toBeVisible();
});

test("clicking a word shows its analysis in this passage and its LSJ entry", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-u="1.1"] [data-w="ἄειδε"]').click();
  const panel = page.getByRole("complementary", { name: "Look-up: ἄειδε" });
  await expect(panel).toContainText("ἀείδω");
  await expect(panel).toContainText("present active imperative");
  await expect(panel).toContainText("Checked by hand");
  await expect(panel).toContainText("sing");
});

test("words can be looked up with the keyboard alone", async ({ page }) => {
  await openIliad(page);
  // the text is one stop for Tab: the first word
  await page.locator('article [data-w][tabindex="0"]').first().focus();
  await expect(page.locator('[data-u="1.1"] [data-w="μῆνιν"]')).toBeFocused();
  await page.keyboard.press("ArrowRight");
  const aeide = page.locator('[data-u="1.1"] [data-w="ἄειδε"]');
  await expect(aeide).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("complementary", { name: "Look-up: ἄειδε" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(aeide).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('[data-u="1.2"] [data-w]:focus')).toHaveCount(1);
  // the arrow keys moved between words, not pages
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible();
});

test("bookmarks and highlights are kept after a reload", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-row="1.5"]').click();
  await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Bookmark" }).click();
  await page.locator('[data-row="1.10"]').click();
  await page.getByRole("button", { name: "Highlight in blue" }).click();
  await page.reload();
  await expect(page.locator('[data-key="1.5"] [data-mark]')).toHaveCount(1, { timeout: 30_000 });
  await expect(page.locator('[data-u="1.10"] [data-hl="blue"]').first()).toBeVisible();
});

test("two books open side by side", async ({ page }) => {
  await openIliad(page, "&w2=tlg0012.tlg002&at2=1.1");
  await expect(page.locator("article")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Close this book" })).toBeVisible();
  await expect(page.locator("article").nth(1)).toContainText("ἄνδρα μοι ἔννεπε", { timeout: 30_000 });
});

test("the library finds works with or without accents", async ({ page }) => {
  await page.goto("/library");
  await page.getByLabel("Search the library").fill("απολογια");
  await expect(page.getByRole("link", { name: /Apology/ }).first()).toBeVisible();
});

test("the Scroll Case works out a download's size", async ({ page }) => {
  await page.goto("/downloads");
  await expect(page.getByText(/files, .* on disk, about .* to download/)).toBeVisible({ timeout: 20_000 });
});

test("reading aids: transliteration, colour by case and the page's vocabulary", async ({ page }) => {
  await openIliad(page);
  await page.getByRole("button", { name: "Transliteration" }).click();
  await expect(page.locator('[data-u="1.1"]')).toContainText("mēnin aeide thea Pēlēiadeō Achilēos");
  await page.getByRole("button", { name: "Colour by case" }).click();
  await expect(page.locator('[data-u="1.1"] [data-w="μῆνιν"]')).toHaveAttribute("data-case", "accusative");
  await page.getByRole("button", { name: "Vocabulary" }).click();
  const vocab = page.getByRole("complementary", { name: "Vocabulary for this page" });
  await expect(vocab).toContainText("core #1");
  await expect(vocab).toContainText("the");
});

test("colour by case and the vocabulary list work where GLAUx cites the text by another scheme (Aristotle's Metaphysics)", async ({ page }) => {
  // GLAUx cites the Metaphysics by Bekker page, the reader by book and section: before, colouring
  // asked the whole book about every word on the page and froze the browser
  await page.goto("/read?w=tlg0086.tlg025");
  await expect(page.locator('[data-u="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Colour by case" }).click();
  await expect(page.locator('[data-u="1.1"] [data-w="πάντες"]').first()).toHaveAttribute("data-case", "nominative", { timeout: 15_000 });
  expect(await page.locator("[data-w][data-case]").count()).toBeGreaterThan(1000);
  await page.getByRole("button", { name: "Vocabulary" }).first().click();
  await expect(page.getByRole("complementary", { name: "Vocabulary for this page" }).getByRole("listitem").first()).toContainText("ὁ");
  await page.getByRole("button", { name: "Colour by case" }).click();   // leave the setting as it was
});
