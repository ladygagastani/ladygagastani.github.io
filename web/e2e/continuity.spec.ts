import { test, expect, type Page } from "@playwright/test";

// The reader reads texts from GitHub, so these need a connection (until the offline part).
test.describe.configure({ timeout: 90_000 });

const openIliad = async (page: Page, at = "1.1") => {
  await page.goto(`/read?w=tlg0012.tlg001&tr=perseus-eng3&at=${at}`);
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
};
const act = (page: Page, name: string) => page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name, exact: true }).click();

test("the site keeps working offline once visited, and the connection light says so", async ({ page, context }) => {
  await page.goto("/");
  // wait until the offline helper has kept the pages
  await expect.poll(() => page.evaluate(async () => {
    const keys = await caches.keys();
    const pages = keys.find((k) => k.startsWith("pages-"));
    return !!navigator.serviceWorker.controller && !!pages && (await (await caches.open(pages)).keys()).length > 20;
  }), { timeout: 60_000 }).toBe(true);
  await expect(page.getByRole("button", { name: "Connection: Online" })).toBeVisible();

  await context.setOffline(true);
  await expect(page.getByRole("button", { name: "Connection: Offline" })).toBeVisible();
  await page.goto("/treasury");
  await expect(page.getByRole("heading", { level: 1, name: /The Treasury/ })).toBeVisible();
  // moving between areas offline, through the site's own links
  await page.getByRole("link", { name: /The Academy/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: /The Academy/ })).toBeVisible();
  await page.goto("/academy/lesson/case");
  await expect(page.locator("h1").first()).toBeVisible();

  await page.getByRole("button", { name: "Connection: Offline" }).click();
  const panel = page.getByRole("dialog", { name: "Connection and offline reading" });
  await expect(panel).toContainText("Every page of the site is kept in this browser");
  await panel.getByRole("button", { name: "Reconnect" }).click();
  await expect(panel.getByRole("status")).toContainText("Still offline");

  await context.setOffline(false);
  await panel.getByRole("button", { name: "Reconnect" }).click();
  await expect(panel.getByRole("status")).toContainText("Connected", { timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Connection: Online" })).toBeVisible();
});

test("markers beside the scroll bar show notes and bookmarks, preview them and jump to them", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-row="1.5"]').click();
  await act(page, "Bookmark");
  await page.locator('[data-row="1.30"]').click();
  await act(page, "Note");
  await page.getByLabel("Your note", { exact: true }).fill("Agamemnon refuses the ransom.");
  await page.getByRole("button", { name: /^(Done|Saving…)$/ }).click();
  const markers = page.getByRole("list", { name: "Markers on this page" });
  await expect(markers.getByRole("listitem", { name: /^Bookmark at 1\.5/ })).toBeVisible();
  const note = markers.getByRole("listitem", { name: /^Note at 1\.30/ });
  await note.hover();
  await expect(page.getByRole("tooltip")).toContainText("Agamemnon refuses the ransom.");
  // the legend switches a kind off
  await page.getByRole("button", { name: "Markers" }).click();
  await page.getByRole("group", { name: "Markers beside the scroll bar" }).getByLabel("Bookmarks").uncheck();
  await expect(markers.getByRole("listitem", { name: /^Bookmark at/ })).toHaveCount(0);
  await page.getByRole("group", { name: "Markers beside the scroll bar" }).getByLabel("Bookmarks").check();
  await page.getByRole("button", { name: "Markers" }).click();
  // jump: the note's passage comes to the top
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight }));
  await note.click();
  await expect(page.locator('[data-key="1.30"]')).toBeInViewport();
});

test("the floating reader follows the reader around the site, snaps, minimises and expands back", async ({ page }) => {
  await page.goto("/treasury");
  await page.waitForTimeout(1200);   // the visit is remembered once the page settles
  await openIliad(page, "1.40");
  await page.getByRole("button", { name: /Float the reader/ }).click();
  // back to the page before the reader, with the book in a window
  await expect(page).toHaveURL(/\/treasury$/);
  const win = page.getByRole("dialog", { name: /Floating reader: Iliad/ });
  await expect(win.locator('[data-key="1.40"]')).toBeVisible({ timeout: 30_000 });

  // it keeps working: look up a word inside the window
  await win.locator('[data-u="1.40"] [data-w]').first().click();
  await expect(win.getByRole("complementary", { name: /^Look-up:/ })).toBeVisible();
  await win.getByRole("button", { name: "Close look-up" }).click();

  // it survives moving to another area, and a reload
  await page.getByRole("link", { name: /The Academy/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: /The Academy/ })).toBeVisible();
  await expect(win).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog", { name: /Floating reader: Iliad/ })).toBeVisible();

  // drag it to the left edge: it docks there
  const bar = page.locator("[data-float-window] header").first();
  const bb = (await bar.boundingBox())!;
  await page.mouse.move(bb.x + 80, bb.y + 20);
  await page.mouse.down();
  await page.mouse.move(400, 400, { steps: 5 });
  await page.mouse.move(4, 450, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator("[data-float-window]")).toHaveAttribute("data-snap", "left");

  // minimise to a tab, then open the full reader at the passage in view
  await page.getByRole("dialog", { name: /Floating reader/ }).getByRole("button", { name: "Minimise" }).click();
  const tab = page.locator("[data-float-tab]");
  await expect(tab).toContainText("Iliad");
  await tab.getByRole("button", { name: "Open in the full reader" }).click();
  await expect(page).toHaveURL(/\/read\?.*w=tlg0012\.tlg001.*at=1\.40/);
  await expect(page.locator("[data-float-window], [data-float-tab]")).toHaveCount(0);
});

test("a passage dragged from the reader lands in a note with its citation", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-row="1.5"]').click();
  await act(page, "Note");
  const box = page.getByLabel("Your note", { exact: true });
  // both on screen: the passage, and the note being written
  await page.locator('[data-key="1.1"]').first().evaluate((el) => el.scrollIntoView({ block: "start" }));
  // drag the grip beside 1.1 onto the note, as a person would
  await page.locator('[data-key="1.1"]').first().hover();
  const from = (await page.locator('[data-drag="1.1"]').boundingBox())!, to = (await box.boundingBox())!;
  await page.mouse.move(from.x + 5, from.y + 8);
  await page.mouse.down();
  await page.mouse.move(from.x + 40, from.y + 40, { steps: 5 });
  await page.mouse.move(to.x + 30, to.y + 20, { steps: 10 });
  await page.mouse.up();
  await expect(box).toHaveValue(/^“μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος.*” \(Homer, Iliad 1\.1\)$/);
});

test("the home page offers to continue where you left off", async ({ page }) => {
  await openIliad(page, "1.100");
  await page.waitForTimeout(1200);
  await page.goto("/academy/lesson/case");
  await page.waitForTimeout(1200);
  await page.goto("/");
  const card = page.getByRole("region", { name: /Lesson 3/ });
  await expect(card.getByRole("link", { name: /Lesson 3: Who does what/ })).toBeVisible();
  // the reader remembers the passage (a group of lines) that line 1.100 is in
  await expect(card.getByRole("link", { name: /Homer, Iliad/ })).toHaveAttribute("href", /at=1\.(9[5-9]|100)(&|$)/);
  await card.getByRole("link", { name: /Lesson 3/ }).click();
  await expect(page).toHaveURL(/\/academy\/lesson\/case/);
});
