import { test, expect } from "@playwright/test";

// Author pages and the library's vocabulary measure: all from files the site itself serves.

test("an author page shows real dates, works and the wiki entries that read them", async ({ page }) => {
  await page.goto("/library/author?a=tlg0012");
  await expect(page.getByRole("heading", { level: 1, name: "Homer" })).toBeVisible();
  await expect(page.getByText("Wrote in")).toBeVisible();
  await expect(page.getByText(/8th c\. BC/).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "What Homer wrote" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Iliad/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Homer's similes/ })).toHaveAttribute("href", "/stoa/homeric-similes");
  await expect(page.getByRole("link", { name: /Your own notes on Homer/ })).toHaveAttribute("href", "/treasury?s=authors&a=tlg0012");
});

test("an unknown author is said to be unknown, not guessed at", async ({ page }) => {
  await page.goto("/library/author?a=tlg9999");
  await expect(page.getByRole("heading", { level: 1, name: "No such author" })).toBeVisible();
});

test("the library can be filtered by how familiar a text's vocabulary is, and says what that measures", async ({ page }) => {
  await page.goto("/library");
  await page.locator("#library-vocab").selectOption("familiar");
  await expect(page.getByText(/\b8\d% common words/).first()).toBeVisible();
  await expect(page.getByText(/measures words only, not grammar, dialect or how hard the ideas are/)).toBeVisible();
  await page.locator("#library-vocab").selectOption("rare");
  await expect(page.getByText(/\b[1-6]\d% common words/).first()).toBeVisible();
});

test("the library lists every author with their works, and an author's name leads to their page", async ({ page }) => {
  await page.goto("/library?a=tlg0012");
  const homer = page.locator("#author-tlg0012");
  await expect(homer).toBeInViewport();
  await expect(homer.getByRole("link", { name: /^Iliad/ })).toBeVisible();
  await homer.getByRole("link", { name: "Homer", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/author\?a=tlg0012/);
  await expect(page.getByRole("heading", { level: 1, name: "Homer" })).toBeVisible();
});

test("Quick search opens the wiki's and the forum's own searches", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search" }).fill("plague");
  await expect(page.getByRole("option", { name: /Search the Painted Stoa/ })).toBeVisible();
  await expect(page.getByRole("option", { name: /Search the Town Hall/ })).toBeVisible();
  await page.getByRole("option", { name: /Search the Painted Stoa/ }).click();
  await expect(page).toHaveURL(/\/stoa\?q=plague/);
  await expect(page.getByRole("searchbox", { name: "Search the Painted Stoa" })).toHaveValue("plague");
});
