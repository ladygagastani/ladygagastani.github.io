import { test, expect } from "@playwright/test";

test("the Periplus finds a place and shows which works name it most", async ({ page }) => {
  await page.goto("/stoa/periplus");
  await expect(page.getByRole("application", { name: /Map of the Greek world/ })).toBeVisible();
  await page.getByRole("searchbox", { name: "Find a place" }).fill("Σπαρτη");
  await page.getByRole("button", { name: /Σπάρτη Sparta/ }).click();
  await expect(page).toHaveURL(/[?&]p=570685/);
  await expect(page.getByRole("heading", { level: 2, name: /Σπάρτη/ })).toBeVisible();
  await expect(page.getByText(/Named \d+ times in \d+ works/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Growing up Spartan →" })).toBeVisible();
});

test("a saved place appears in the Treasury on a map of your own, and can be removed", async ({ page }) => {
  await page.goto("/stoa/periplus?p=550912");
  await expect(page.getByRole("heading", { level: 2, name: /Τένεδος/ })).toBeVisible();
  await page.getByRole("button", { name: "Save this place" }).click();
  await expect(page.getByRole("button", { name: "Saved to my places" })).toHaveAttribute("aria-pressed", "true");

  await page.goto("/treasury?s=places");
  await expect(page.getByRole("heading", { name: /Your places/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "A map of your saved place" })).toBeVisible();
  await page.getByRole("button", { name: /Remove Tenedos/ }).click();
  await expect(page.getByRole("heading", { name: "Places", exact: true })).toBeVisible();
});

test("a wiki entry links to its place on the map", async ({ page }) => {
  await page.goto("/stoa/spartan-upbringing");
  await page.getByRole("link", { name: /Σπάρτη Sparta →/ }).click();
  await expect(page).toHaveURL(/\/stoa\/periplus\?p=570685/);
  await expect(page.getByRole("heading", { level: 2, name: /Σπάρτη/ })).toBeVisible();
});

test("looking up a place name in the reader offers it on the map", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.38");
  await page.locator('[data-u="1.38"] [data-w^="Τενέδοι"]').click();
  const panel = page.getByRole("complementary", { name: /^Look-up: Τενέδοι/ });
  await panel.getByRole("link", { name: /On the map · Τένεδος/ }).click();
  await expect(page).toHaveURL(/\/stoa\/periplus\?p=550912/);
});

test("the painted map: a place is chosen by clicking its dot, and the zoom buttons glide", async ({ page }) => {
  await page.goto("/stoa/periplus?p=570685");
  const stage = page.getByRole("application", { name: /Map of the Greek world/ });
  await expect(page.getByRole("heading", { level: 2, name: /Σπάρτη/ })).toBeVisible();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-view", /\d/);
  await page.waitForTimeout(1800);   // the flight to Sparta has landed
  const k = async () => Number((await stage.getAttribute("data-view"))!.split(" ")[0]);
  // clicking the chosen place's dot (inside its ring) lets it go
  const ring = (await stage.locator("[class*='ring']").boundingBox())!;
  await page.mouse.click(ring.x + ring.width / 2, ring.y + ring.height / 2);
  await expect(page).not.toHaveURL(/p=570685/);
  // and clicking it again chooses it
  await page.mouse.click(ring.x + ring.width / 2, ring.y + ring.height / 2);
  await expect(page).toHaveURL(/p=570685/);
  const before = await k();
  await stage.getByRole("button", { name: "Zoom in" }).click();
  await expect.poll(k).toBeCloseTo(before * 1.6, 2);
  await stage.getByRole("button", { name: "Zoom out" }).click();
  await expect.poll(k).toBeCloseTo(before, 2);
});
