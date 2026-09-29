import { test, expect } from "@playwright/test";

test("the library opens with its search, and lists authors with their works", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  const first = page.locator("section[id^=lib-]").first();
  await expect(first).toBeVisible();
  // the search comes before everything else in the list
  expect((await search.boundingBox())!.y).toBeLessThan((await first.boundingBox())!.y);
  await expect(page.locator("#author-tlg0012").getByRole("link", { name: /^Iliad/ })).toBeVisible();
});

test("the library sorts by title and by period, and jumps to a letter", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("radio", { name: "Title A–Z" }).click();
  await expect(page.locator("#lib-I").getByRole("link", { name: /^Iliad.*Homer/ })).toBeAttached();
  await page.getByRole("navigation", { name: "Jump to a letter" }).getByRole("button", { name: "O", exact: true }).click();
  await expect(page.locator("#lib-O")).toBeInViewport();
  await page.getByRole("radio", { name: "By period" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Archaic/ })).toBeVisible();
});

test("the genre chips count and filter, and a long list of works folds", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("button", { name: /^Drama \d+/ }).click();
  await expect(page.locator("#author-tlg0011")).toBeVisible();      // Sophocles
  await expect(page.locator("#author-tlg0012")).toHaveCount(0);     // Homer wrote no drama
  await expect(page.getByText(/of 1,\d{3} works/)).toBeVisible();
  await page.getByRole("button", { name: "Show everything" }).click();
  const plato = page.locator("#author-tlg0059");
  await plato.getByRole("button", { name: /Show all \d+ works/ }).click();
  await expect(plato.getByRole("button", { name: "Show fewer" })).toBeVisible();
});

test("wiki categories have their signs, and the featured entry its picture or sign", async ({ page }) => {
  await page.goto("/stoa");
  await expect(page.locator("#people svg")).toBeVisible();
  const featured = page.getByRole("link", { name: /On the wall today/ });
  await expect(featured.locator("img, svg").first()).toBeVisible();
});

test("the map and the Town Hall put their search first", async ({ page }) => {
  await page.goto("/stoa/periplus");
  const find = page.getByRole("searchbox", { name: "Find a place" });
  const map = page.getByRole("application");
  expect((await find.boundingBox())!.y).toBeLessThan((await map.boundingBox())!.y);
  await page.goto("/town-hall");
  const hall = page.getByRole("searchbox", { name: "Search the Town Hall" });
  const cats = page.getByRole("navigation", { name: "Categories" });
  expect((await hall.boundingBox())!.y).toBeLessThan((await cats.boundingBox())!.y);
});
