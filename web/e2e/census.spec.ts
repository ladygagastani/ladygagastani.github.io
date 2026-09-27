import { test, expect } from "@playwright/test";

test("the Census ranks gods and heroes, and an item shows where it is mentioned", async ({ page }) => {
  await page.goto("/stoa/census");
  const ranking = page.getByRole("region", { name: "Gods and heroes in The whole library" });
  await expect(ranking.getByRole("button", { name: /^1 Ζεύς Zeus .*8,397/ })).toBeVisible();
  await ranking.getByRole("button", { name: /^1 Ζεύς/ }).click();
  await expect(page).toHaveURL(/[?&]i=/);
  await expect(page.getByRole("heading", { level: 2, name: "Ζεύς" })).toBeVisible();
  const more = page.getByRole("navigation", { name: "More about it" });
  await expect(more.getByRole("link", { name: "Word Study" })).toHaveAttribute("href", /\/treasury\/word\?l=/);
  await expect(more.getByRole("link", { name: /Every mention/ })).toHaveAttribute("href", /\/search\?m=lemma&q=/);
});

test("the Census filters by author, and compares two side by side", async ({ page }) => {
  await page.goto("/stoa/census?c=place");
  await page.getByRole("combobox", { name: "Author" }).first().selectOption({ label: "Herodotus" });
  await expect(page).toHaveURL(/[?&]a=tlg0016/);
  const left = page.getByRole("region", { name: "Places in Herodotus" });
  await expect(left.getByRole("button", { name: /^1 Αἴγυπτος/ })).toBeVisible();

  await page.getByRole("button", { name: /Compare side by side/ }).click();
  await expect(page).toHaveURL(/[?&]cmp=1/);
  await expect(page.getByRole("region", { name: "Places in Homer" })).toBeVisible();
});

test("the Census counts things and phrases, and says how", async ({ page }) => {
  await page.goto("/stoa/census");
  await page.getByRole("button", { name: /^Things/ }).click();
  await page.getByRole("button", { name: /^Ships and boats/ }).click();
  await expect(page.getByRole("region", { name: "Ships and boats in The whole library" }).getByRole("button", { name: /^1 ναῦς/ })).toBeVisible();

  await page.getByRole("button", { name: /^Phrases/ }).click();
  await expect(page.getByRole("region", { name: "Phrases in The whole library" }).getByRole("button", { name: /^1 ὦ ἄνδρες Ἀθηναῖοι/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How the counting was done" })).toBeVisible();
  await expect(page.getByText(/89\.2% accurate by GLAUx/)).toBeVisible();
});
