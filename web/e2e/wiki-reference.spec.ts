import { test, expect } from "@playwright/test";

test("the Wiki front offers the three reference pages", async ({ page }) => {
  await page.goto("/stoa");
  const ref = page.getByRole("navigation", { name: "Reference" });
  await expect(ref.getByRole("link", { name: /Authors/ })).toBeVisible();
  await expect(ref.getByRole("link", { name: /Eras of Greek/ })).toBeVisible();
  await expect(ref.getByRole("link", { name: /Editions & translations/ })).toBeVisible();
});

test("the Authors index groups by period, filters by period and kind, and opens an author", async ({ page }) => {
  await page.goto("/stoa/authors");
  await expect(page.getByRole("heading", { level: 1, name: /^Authors/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Archaic" })).toBeVisible();
  // a link's filters are applied: Classical drama is Aeschylus, Sophocles, Euripides and the like, and not Homer
  await page.goto("/stoa/authors?e=classical&k=Drama");
  await expect(page.getByRole("link", { name: /^Sophocles/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Homer/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Classical \d+/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /^Sophocles/ }).click();
  await expect(page).toHaveURL(/\/library\/author\?a=tlg0011/);
  await expect(page.getByRole("heading", { level: 1, name: "Sophocles" })).toBeVisible();
  await expect(page.getByText("From Wikidata")).toBeVisible();
});

test("the Authors index searches by name and says when nothing matches", async ({ page }) => {
  await page.goto("/stoa/authors");
  const search = page.getByRole("searchbox", { name: "Search authors" });
  await search.fill("plutarch");
  await expect(page.getByRole("link", { name: /^Plutarch/ })).toBeVisible();
  await search.fill("zzzzqq");
  await expect(page.getByText("No author matches")).toBeVisible();
});

test("Eras of Greek draws a column for each century and a section for each period", async ({ page }) => {
  await page.goto("/stoa/eras");
  await expect(page.getByRole("heading", { level: 2, name: "Greek through the centuries" })).toBeVisible();
  await expect(page.locator("li[aria-label^='5th c. BC']")).toBeAttached();
  await expect(page.locator("li[aria-label^='2nd c. AD']")).toBeAttached();
  for (const era of ["Archaic", "Classical", "Hellenistic", "Roman Imperial", "Late Antique", "Byzantine"]) {
    await expect(page.getByRole("heading", { level: 2, name: era, exact: true })).toBeVisible();
  }
  // a period's kinds of writing lead to the Authors index, filtered
  await page.locator("#classical").getByRole("link", { name: /^Drama/ }).click();
  await expect(page).toHaveURL(/\/stoa\/authors\?e=classical&k=Drama/);
  await expect(page.getByRole("link", { name: /^Sophocles/ })).toBeVisible();
});

test("Editions & translations groups texts by publisher and opens the exact text in the reader", async ({ page }) => {
  await page.goto("/stoa/editions");
  await expect(page.getByRole("heading", { level: 1, name: /^Editions & translations/ })).toBeVisible();
  await expect(page.getByText(/Loeb Classical Library/).first()).toBeVisible();
  await page.getByRole("searchbox", { name: /Search editions/ }).fill("Butler Odyssey");
  const row = page.getByRole("link", { name: /Homer, Odyssey.*Translation/ }).first();
  await expect(row).toBeVisible();
  await row.click();
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg002&tr=/);
});
