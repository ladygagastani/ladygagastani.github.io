import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

// The reader parts read texts from GitHub, and Word Study asks Wiktionary, so these need a connection.
test.describe.configure({ timeout: 90_000 });

const openIliad = async (page: Page) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
};
const act = (page: Page, name: string) => page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name, exact: true }).click();

test("a note with formatting, Greek typed in Beta Code and a tag appears in the Treasury", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-row="1.5"]').click();
  await act(page, "Note");
  const box = page.getByLabel("Your note", { exact: true });
  await box.fill("The plan of Zeus: ");
  await page.getByRole("button", { name: /Greek$/ }).click();
  await page.getByLabel(/Type Greek in Beta Code/).fill("boulh/");
  await expect(page.locator("output").filter({ hasText: "βουλή" })).toBeVisible();
  await page.getByRole("button", { name: "Insert" }).click();
  await expect(box).toHaveValue("The plan of Zeus: βουλή");
  await page.getByLabel("Add a tag").fill("plans");
  await page.getByLabel("Add a tag").press("Enter");
  await page.getByRole("button", { name: /^(Done|Saving…)$/ }).click();

  await page.goto("/treasury?s=notes");
  const notes = page.getByRole("button", { name: /Notes/ }).first();
  await expect(notes).toContainText("1");
  await expect(page.getByText("The plan of Zeus: βουλή")).toBeVisible();
  await expect(page.getByRole("button", { name: "#plans 1" })).toBeVisible();
  await expect(page.getByRole("link", { name: "1.5" })).toHaveAttribute("href", /w=tlg0012\.tlg001.*at=1\.5/);
});

test("favourite passages can be gathered into a named collection", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-row="1.1"]').click();
  await act(page, "Favourite");
  await page.goto("/treasury?s=anthology");
  await expect(page.locator("blockquote")).toContainText("μῆνιν");
  await page.getByRole("button", { name: "+ New collection" }).click();
  await page.getByLabel("Name of the new collection").fill("Openings");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Nothing in this collection yet")).toBeVisible();
  await page.getByRole("button", { name: /^All/ }).click();
  await page.getByRole("button", { name: "Collections", exact: true }).click();
  await page.getByLabel("Openings").check();
  await page.getByRole("button", { name: /^Openings/ }).click();
  await expect(page.locator("blockquote")).toHaveCount(1);
});

test("the Treasury downloads as one readable file and restores from it in an empty browser", async ({ page, browser }) => {
  await openIliad(page);
  await page.locator('[data-row="1.5"]').click();
  await act(page, "Bookmark");
  await page.goto("/treasury?s=bookmarks");
  await expect(page.getByRole("link", { name: "1.5" })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download my Treasury" }).click()]);
  const file = await download.path();
  const html = readFileSync(file, "utf8");
  expect(html).toContain("<h1>My Treasury</h1>");
  expect(html).toContain("Bookmarks");
  expect(html).toContain('id="mathesis-data"');

  const fresh = await browser.newPage();
  await fresh.goto("/treasury?s=bookmarks");
  await expect(fresh.getByText("No bookmarks yet")).toBeVisible();
  await fresh.getByLabel("Choose a Treasury file to restore").setInputFiles(file);
  const report = fresh.getByRole("complementary", { name: "Keep your Treasury safe" }).getByRole("status");
  await expect(report).toContainText("Marks and notes on passages: 1 added");
  await expect(fresh.getByRole("link", { name: "1.5" })).toBeVisible();
  // restoring the same file again changes nothing
  await fresh.getByLabel("Choose a Treasury file to restore").setInputFiles(file);
  await expect(report).toContainText("0 added, 0 updated to a newer copy, 1 already here");
  await fresh.close();
});

test("Word Study shows every form of λόγος, where it is used and real passages", async ({ page }) => {
  await page.goto(`/treasury/word?l=${encodeURIComponent("λόγος")}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("λόγος");
  const forms = page.getByRole("region", { name: "Every form" });
  await expect(forms.getByRole("row", { name: /Accusative/ })).toContainText("λόγον");
  await expect(forms.getByRole("row", { name: /Genitive/ })).toContainText("λόγων");
  const usage = page.getByRole("region", { name: "Where it is used" });
  await expect(usage).toContainText("Plato");
  await expect(usage.getByRole("listitem", { name: /^Classical: .* uses in/ })).toBeVisible();
  const examples = page.getByRole("region", { name: "In real texts" });
  await expect(examples.locator("mark").first()).toBeVisible({ timeout: 60_000 });
  await expect(page.getByRole("region", { name: "Family" })).toContainText("logos", { timeout: 20_000 });
});

test("the reader's look-up opens Word Study, where the word can be saved and noted", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').click();
  await page.getByRole("link", { name: /Word Study · μῆνις/ }).click();
  await expect(page).toHaveURL(/\/treasury\/word\?l=/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("μῆνις");
  await page.getByRole("button", { name: "Save word to my review" }).click();
  await expect(page.getByText(/New: not reviewed yet/)).toBeVisible();
  await page.getByRole("button", { name: "Write a note" }).click();
  await page.getByLabel("Your note on μῆνις").fill("The first word of the Iliad.");
  await page.waitForTimeout(900);
  await page.goto("/treasury?s=words");
  await expect(page.getByRole("link", { name: /μῆνις/ })).toContainText("your note");
});
