import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The reader's Places and Manuscript panels. Texts come from GitHub and the photographs from the
// libraries' image servers, so these tests need a connection.
test.describe.configure({ timeout: 90_000 });

const open = async (page: Page, q: string, first: string) => {
  await page.goto(`/read?${q}`);
  await expect(page.locator(`[data-u="${first}"]`).first()).toBeVisible({ timeout: 30_000 });
};

test("Places lists the places the page names, marks their words, and goes to a passage", async ({ page }) => {
  await open(page, "w=tlg0016.tlg001&at=1.1.1", "1.1.1");
  await page.getByRole("button", { name: "Places", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "Places on this page" });
  const items = panel.locator("ol li");
  await expect(items.first()).toContainText("Ἄργος", { timeout: 30_000 });
  await expect(items.first()).toContainText("Argos");
  // the words themselves are marked in the text (the CSS Custom Highlight API)
  await expect.poll(() => page.evaluate(() => (CSS as unknown as { highlights: Map<string, Set<unknown>> }).highlights.get("place-1")?.size ?? 0)).toBeGreaterThan(50);
  // most named first: Sardis
  await panel.getByRole("radio", { name: "Most named" }).click();
  await expect(items.first()).toContainText("Σάρδεις");
  // choosing one place marks only its words
  await items.first().getByRole("button", { name: /Σάρδεις/ }).click();
  const one = await page.evaluate(() => (CSS as unknown as { highlights: Map<string, Set<unknown>> }).highlights.get("place-1")?.size ?? 0);
  expect(one).toBeGreaterThan(10);
  expect(one).toBeLessThan(80);
  await items.first().getByRole("button", { name: "Go to 1.30.1" }).click();
  await expect(page.locator('[data-u="1.30.1"]')).toBeInViewport();
  await expect(panel.getByRole("link", { name: /On the big map/ }).first()).toHaveAttribute("href", /\/stoa\/periplus\?p=\d+/);
});

test("Manuscript takes the passage back to capitals without spaces, and opens the Venetus A at the line", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduced" }, version: 0 })); });
  await open(page, "w=tlg0012.tlg001&at=1.1", "1.1");
  await page.getByRole("button", { name: "Manuscript", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "The manuscript" });
  const text = panel.locator('[data-stage]');
  await expect(text).toContainText("μῆνιν ἄειδε θεὰ");
  await panel.getByRole("radio", { name: "Capitals" }).click();
  await expect(text).toContainText("ΜΗΝΙΝ");
  await expect(text).toContainText("ΑΧΙΛΗΟϹ");
  await panel.getByRole("radio", { name: "No spaces" }).click();
  await expect(text).toContainText("ΜΗΝΙΝΑΕΙΔΕΘΕΑ");
  // the page of the manuscript that holds the line, with the line marked on the photograph
  await expect(panel.getByText("f. 12r")).toBeVisible({ timeout: 30_000 });
  await expect(panel.getByText(/The line you are reading, 1\.1, is marked/)).toBeVisible();
  await expect(panel.getByRole("button", { name: "Next page" })).toBeEnabled();
  await panel.getByRole("button", { name: "Next page" }).click();
  await expect(panel.getByText("f. 12v")).toBeVisible();
  const res = await new AxeBuilder({ page }).include("aside").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(res.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});

test("Manuscript opens a play in the Medicean manuscript at the leaf the catalogue gives", async ({ page }) => {
  await open(page, "w=tlg0085.tlg002&at=1", "1");
  await page.getByRole("button", { name: "Manuscript", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "The manuscript" });
  await expect(panel.getByText("f. 119r")).toBeVisible({ timeout: 30_000 });
  await expect(panel).toContainText("Plut. 32.9");
});
