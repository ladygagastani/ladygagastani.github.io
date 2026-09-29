import { test, expect } from "@playwright/test";

test.describe.configure({ timeout: 60_000 });

test("the alphabet shows each letter's sound in the chosen pronunciation", async ({ page }) => {
  await page.goto("/academy/alphabet");
  await page.getByRole("option", { name: /theta/ }).click();
  await expect(page.getByText("IPA [tʰ]")).toBeVisible();
  await page.getByRole("radio", { name: "Modern Greek" }).click();
  await expect(page.getByText("IPA [θ]")).toBeVisible();
});

test("a lesson shows a real sentence from the source file, and its quiz responds", async ({ page }) => {
  await page.goto("/academy/lesson/case");
  const real = page.locator('[data-real="tlg0031.tlg004:3.35"]');
  await expect(real).toContainText("ὁ πατὴρ ἀγαπᾷ τὸν υἱόν", { timeout: 30_000 });
  await expect(real.locator("[data-quote]")).toHaveCount(5);
  await page.getByRole("button", { name: "the father (ὁ πατήρ)" }).click();
  await expect(page.getByText(/Right\./).first()).toBeVisible();
});

test("lesson words go into the daily review, and a card can be answered", async ({ page }) => {
  await page.goto("/academy/lesson/letters");
  await page.getByRole("button", { name: /to my daily review/ }).click();
  await page.goto("/academy/review");
  await expect(page.getByRole("button", { name: "Show the meaning" })).toBeVisible();
  await page.getByRole("button", { name: "Show the meaning" }).click();
  await page.getByRole("button", { name: /^Good/ }).click();
  await expect(page.getByText(/to review|Done:/)).toBeVisible();
});

test("the tables find a form without accents", async ({ page }) => {
  await page.goto("/academy/tables");
  await page.getByLabel("Find a form").fill("λογου");
  await expect(page.getByText("λόγου = genitive, singular of λόγος")).toBeVisible();
});

test("vocabulary shows how much of a text the commonest words cover", async ({ page }) => {
  await page.goto("/academy/vocabulary");
  await expect(page.locator("[class*=covRow]").nth(1)).toContainText(/\d+%/, { timeout: 30_000 });
});

test("the alphabet is on the Academy's front page and in lesson 1: tap a letter to see how it sounds", async ({ page }) => {
  for (const url of ["/academy", "/academy/lesson/letters"]) {
    await page.goto(url);
    const grid = page.getByRole("listbox", { name: /The 24 letters/ });
    await expect(grid.getByRole("option")).toHaveCount(24);
    await grid.getByRole("option", { name: /gamma/ }).click();
    await expect(page.getByText(/always hard, as in "go"/)).toBeVisible();
    await page.getByRole("radio", { name: "Modern Greek" }).first().click();
    await expect(page.getByText(/a soft throaty g/)).toBeVisible();
    await page.getByRole("radio", { name: "Classical Attic" }).first().click();
  }
});

test("lessons 10 to 13: prepositions drawn, adjectives that move, the third declension and the past", async ({ page }) => {
  await page.goto("/academy/lesson/prepositions");
  await expect(page.getByText("ἐκ τῆς οἰκίας")).toBeVisible();
  await expect(page.getByRole("table")).toContainText("because of");
  await page.goto("/academy/lesson/adjectives");
  const first = page.getByRole("button", { name: "Move the adjective" }).first();
  await expect(page.getByText("“the good person”").first()).toBeVisible();
  await first.click();
  await expect(page.getByText("“the person is good”").first()).toBeVisible();
  await page.goto("/academy/lesson/third-declension");
  await expect(page.getByText("πόλεως").first()).toBeVisible();
  await page.goto("/academy/lesson/past-tenses");
  await expect(page.getByRole("link", { name: /Next:/ })).toHaveCount(0);
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});
