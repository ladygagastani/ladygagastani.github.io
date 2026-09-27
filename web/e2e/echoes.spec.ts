import { test, expect, type Page } from "@playwright/test";

// These tests read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 90_000 });

const openAt = async (page: Page, at: string) => {
  await page.goto(`/read?w=tlg0012.tlg001&ed=perseus-grc2&tr=none&at=${at}`);
  await expect(page.locator(`[data-u="${at}"]`)).toBeVisible({ timeout: 30_000 });
};
/** Select every word of a line, as a reader would by dragging across it. */
const selectLine = async (page: Page, at: string) => {
  await page.evaluate(async (u) => {
    const el = document.querySelector(`[data-u="${u}"]`)!;
    el.scrollIntoView({ block: "center" });
    await new Promise((r) => setTimeout(r, 400));
    const r = new Range(); r.selectNodeContents(el);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(r);
    el.closest("article")!.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }, at);
};

test("Echoes of a line: exact, other forms and near repetitions, and a jump there and back", async ({ page }) => {
  await openAt(page, "1.84");
  await selectLine(page, "1.84");
  await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Echoes" }).click();
  const panel = page.getByRole("complementary", { name: "Echoes" });
  await expect(panel).toContainText("times in Iliad");
  await expect(panel.getByRole("button", { name: /^1\.215/ })).toContainText("other forms");
  await expect(panel.getByRole("button", { name: /^1\.364/ })).toContainText("near");
  await expect(panel.getByRole("button", { name: /^9\.307/ })).toContainText("exact");

  await panel.getByRole("button", { name: /^16\.48/ }).click();
  await expect(page).toHaveURL(/at=16\.48/);
  await expect(page.locator('[data-u="16.48"]')).toBeVisible();
  await panel.getByRole("button", { name: "← Back to Iliad 1.84" }).click();
  await expect(page).toHaveURL(/at=1\.84/);
});

test("Echoes of a word: this form, or every form of its dictionary word", async ({ page }) => {
  await openAt(page, "1.1");
  await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').click();
  await page.getByRole("button", { name: "Echoes · where else it occurs" }).click();
  const panel = page.getByRole("complementary", { name: "Echoes" });
  await expect(panel.getByText(/^9$/)).toBeVisible();
  await panel.getByRole("radio", { name: "Every form of μῆνις" }).click();
  await expect(panel.getByText(/^12$/)).toBeVisible();
  await expect(panel.getByRole("button", { name: /^5\.178/ })).toContainText("μῆνις");
});

test("Echoes across Homer counts the dawn formula in the Odyssey too", async ({ page }) => {
  await openAt(page, "1.477");
  await selectLine(page, "1.477");
  await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Echoes" }).click();
  const panel = page.getByRole("complementary", { name: "Echoes" });
  await panel.getByRole("button", { name: /^All Homer/ }).click();
  await expect(panel.getByText("Odyssey · 20").first()).toBeVisible({ timeout: 60_000 });
  await expect(panel.getByText("Iliad · 2").first()).toBeVisible();
});
