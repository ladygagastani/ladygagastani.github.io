import { test, expect } from "@playwright/test";

// The Town Hall and the Pnyx read from Supabase, so these need internet, like the reader's tests.

test("the Town Hall can be read without an account, and explains its rules", async ({ page }) => {
  await page.goto("/town-hall");
  await expect(page.getByRole("button", { name: /^Grammar help/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The rules of the Town Hall" })).toBeVisible();
  await expect(page.getByText(/to start a thread or reply/)).toBeVisible();
  await page.getByRole("button", { name: /^Grammar help/ }).click();
  await expect(page).toHaveURL(/[?&]c=grammar/);
  await expect(page.getByRole("heading", { level: 2, name: /^Grammar help/ })).toBeVisible();
});

test("the Pnyx explains how it votes, and invites members to propose a motion", async ({ page }) => {
  await page.goto("/town-hall/pnyx?from=melos#propose");
  await expect(page.getByText(/voted by a show of hands/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Propose a motion" })).toBeVisible();
  await expect(page.getByText(/to propose a motion/).last()).toBeVisible();
});

test("the account page offers to join with a display name", async ({ page }) => {
  await page.goto("/account");
  await page.getByRole("tab", { name: "Join" }).click();
  await expect(page.getByLabel(/Display name/)).toBeVisible();
  await expect(page.getByLabel(/Password/)).toHaveAttribute("minlength", "10");
  await expect(page.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/credits#privacy");
});

test("a wiki entry offers to debate it in the Pnyx", async ({ page }) => {
  await page.goto("/stoa/melos");
  await expect(page.getByRole("link", { name: "Debate this in the Pnyx →" })).toHaveAttribute("href", "/town-hall/pnyx?from=melos#propose");
});

test("Ask in the forum carries the passage from the reader to a new thread", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await page.locator('[data-row="1.1"]').click();
  await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Ask in the forum" }).click();
  await expect(page).toHaveURL(/\/town-hall\/new\?ask=1/);
  await expect(page.locator("figure blockquote").first()).toContainText("μῆνιν");
  await expect(page.getByRole("link", { name: /1\.1/ }).first()).toHaveAttribute("href", /\/read\?w=tlg0012\.tlg001/);
  await expect(page.getByText(/to start a thread/)).toBeVisible();
});
