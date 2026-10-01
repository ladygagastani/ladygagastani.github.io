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
  await page.addInitScript(() => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 0 })); });
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

test("opening and closing a side panel keeps the passage being read at the top (wide screens)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.200");
  const row = page.locator('article [data-key="1.200"]').first();
  await expect(row).toBeInViewport({ timeout: 30_000 });
  await page.waitForTimeout(1500);
  const top = () => row.evaluate((e) => Math.round(e.getBoundingClientRect().top));
  const before = await top();
  await page.getByRole("button", { name: "Manuscript", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "The manuscript" });
  await expect(panel).toContainText("Iliad 1.200");
  expect(Math.abs((await top()) - before)).toBeLessThan(4);
  await page.getByRole("button", { name: "Manuscript", exact: true }).click();
  await expect(panel).toBeHidden();
  expect(Math.abs((await top()) - before)).toBeLessThan(4);
});

test.describe("Manuscript panel on a phone", () => {
  test.use({ viewport: { width: 375, height: 760 }, isMobile: true, hasTouch: true });

  test("Watch it change plays through to the letters without spaces, and the words stay inside the panel", async ({ page }) => {
    await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
    await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
    await page.getByRole("toolbar", { name: "Reading" }).getByRole("button", { name: "Aids" }).click();
    await page.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name: "Manuscript", exact: true }).click();
    const panel = page.getByRole("complementary", { name: "The manuscript" });
    // no word may be drawn outside the panel at any moment
    await page.evaluate(() => {
      const w = window as unknown as { __out: number };
      w.__out = 0;
      const tick = () => {
        const a = document.querySelector('aside[aria-label="The manuscript"]');
        if (a) {
          const pr = a.getBoundingClientRect();
          for (const s of a.querySelectorAll("[data-k]")) { const r = s.getBoundingClientRect(); if (r.width && (r.left < pr.left - 1 || r.right > pr.right + 1)) w.__out++; }
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const t0 = Date.now();
    await panel.getByRole("button", { name: /Watch it change/ }).click();
    await expect(panel.getByRole("button", { name: /Watch it change/ })).toBeVisible({ timeout: 15_000 });
    expect(Date.now() - t0).toBeLessThan(10_000);
    await expect(panel.getByRole("radio", { name: "No spaces" })).toBeChecked();
    await expect(panel.locator("[data-k]").first()).toHaveText("ΜΗΝΙΝ");
    expect(await page.evaluate(() => (window as unknown as { __out: number }).__out)).toBe(0);
  });

  test("one finger scrolls the panel past the photograph; two fingers and a tap leave the panel where it is", async ({ page, context }) => {
    await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
    await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
    await page.getByRole("toolbar", { name: "Reading" }).getByRole("button", { name: "Aids" }).click();
    await page.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name: "Manuscript", exact: true }).click();
    const panel = page.getByRole("complementary", { name: "The manuscript" });
    await expect(panel.getByText("f. 12r")).toBeVisible({ timeout: 30_000 });
    const top = () => panel.evaluate((a) => a.scrollTop);
    // the photograph near the top of the panel, with room to scroll either way
    await panel.evaluate((a) => { const v = a.querySelector('[role=img][aria-label^="Folio"]')!; a.scrollTop += v.getBoundingClientRect().top - a.getBoundingClientRect().top - 60; });
    await page.waitForTimeout(400);
    const v = (await panel.getByRole("img", { name: /^Folio/ }).boundingBox())!;
    const cdp = await context.newCDPSession(page);
    const drag = async (fingers: number, dy: number) => {
      const pts = (y: number) => Array.from({ length: fingers }, (_, i) => ({ x: v.x + v.width / 2 + (i ? 60 : 0), y, id: i }));
      const y0 = v.y + 140;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pts(y0) });
      for (let k = 1; k <= 12; k++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pts(y0 + (dy * k) / 12) }); await page.waitForTimeout(16); }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForTimeout(700);
    };
    let before = await top();
    await drag(1, -120);
    expect(await top()).toBeGreaterThan(before + 40);
    before = await top();
    await drag(2, 100);
    expect(Math.abs((await top()) - before)).toBeLessThan(3);
    before = await top();
    // a tap where the photograph shows (a plain touch: Playwright's tap would first scroll it into view)
    const r = (await panel.getByRole("img", { name: /^Folio/ }).boundingBox())!, pr = (await panel.boundingBox())!;
    const ty = Math.max(r.y, pr.y) + 30;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: r.x + r.width / 2, y: ty, id: 0 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(700);
    expect(Math.abs((await top()) - before)).toBeLessThan(3);
  });
});
