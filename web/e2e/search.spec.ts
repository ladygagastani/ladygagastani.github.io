import { test, expect } from "@playwright/test";

// These tests need the search index (npx tsx scripts/build-search.ts grc|eng|lem) and, to show
// passages in context, a connection to GitHub.
test.describe.configure({ timeout: 60_000 });

test("searching Greek finds μῆνιν in the Iliad and links to the exact word", async ({ page }) => {
  await page.goto("/search?q=μῆνιν&w=tlg0012.tlg001&a=tlg0012");
  await expect(page.getByText(/results? in 1 work/)).toBeVisible({ timeout: 20_000 });
  const first = page.getByRole("link", { name: "1.1", exact: true });
  await expect(first).toHaveAttribute("href", /at=1\.1&hl=0$/);
  await first.click();
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg001/);
  await expect(page.locator('[data-u="1.1"]')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => {
    const h = (CSS as unknown as { highlights?: Map<string, Set<Range>> }).highlights?.get("search-hit-1");
    return h ? [...h].map((r) => r.toString()).join(" ") : "";
  })).toBe("μῆνιν");
});

test("Latin letters are read as Greek, and shown back before searching", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("textbox").first().fill("anthropos");
  await expect(page.getByText("Searching for")).toContainText("ανθροπος");
  await page.getByRole("button", { name: "Ask" }).click();
  await expect(page.getByText(/results? in [\d,]+ works?/)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("Typed e and o also find η and ω")).toBeVisible();
});

test("a dictionary word with grammar finds only those forms", async ({ page }) => {
  await page.goto("/search?m=lemma&q=λόγος&t=n------d&w=tlg0059.tlg030&a=tlg0059");
  await expect(page.getByText(/results? in 1 work/)).toBeVisible({ timeout: 20_000 });
  const tags = page.locator("text=/noun · dative/");
  await expect(tags.first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator("mark").first()).toHaveText(/^λόγ(ῳ|οις)$/);
});

test("quick search goes straight to a typed reference", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  const box = page.getByRole("dialog", { name: "Quick search" });
  await expect(box).toBeVisible();
  await box.getByRole("combobox").fill("Il. 1.1");
  await expect(box.getByRole("option").first()).toContainText("Iliad");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg001&at=1\.1/);
});
