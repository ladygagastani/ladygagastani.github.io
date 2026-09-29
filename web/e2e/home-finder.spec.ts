import { test, expect } from "@playwright/test";

test("the home page suggests twelve starting points, and searches all works by several words", async ({ page }) => {
  await page.goto("/");
  const finder = page.locator("section[aria-labelledby=find-title]");
  await expect(finder.getByRole("heading", { level: 3, name: "Suggested starting points" })).toBeVisible();
  await expect(finder.locator("ul li")).toHaveCount(12);
  const box = finder.getByRole("searchbox", { name: "Search the library" });
  await box.fill("homer odyssey");
  await expect(finder.getByRole("heading", { level: 3, name: /works? for/ })).toBeVisible();
  await expect(finder.locator("ul li a").first()).toContainText("Odyssey");
  // a name lists that author's works, the well-known ones first
  await box.fill("plato");
  await expect(finder.locator("ul li a").first()).toContainText("Plato");
  // Greek only shows works with no English beside them
  await finder.getByRole("radio", { name: "Greek only" }).click();
  await expect(finder.getByText("Greek only").first()).toBeVisible();
  await expect(finder.getByText("English", { exact: true })).toHaveCount(0);
  // the way on to the Library keeps the search
  await expect(finder.getByRole("link", { name: /in the Library|Browse the whole Library/ })).toHaveAttribute("href", /\/library\?q=plato/);
});

test("the Library opens with the search it was handed", async ({ page }) => {
  await page.goto("/library?q=odyssey");
  await expect(page.getByRole("searchbox", { name: "Search the library" })).toHaveValue("odyssey");
  await expect(page.locator("#author-tlg0012")).toBeVisible();
});
