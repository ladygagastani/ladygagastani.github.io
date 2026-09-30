import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { offlinePages } from "../src/config/pages";

/**
 * Accessibility: every page is checked by axe (the standard automated checker, WCAG 2.1 AA rules)
 * in both themes. With A11Y_REPORT=1 it writes everything it found to test-results/a11y.json
 * instead of failing, for working through the list.
 */
const REPORT = !!process.env.A11Y_REPORT;

// pages that need something to show: a book in the reader, a word, a search
const EXTRA = ["/read?w=tlg0012.tlg001", "/treasury/word?l=λόγος", "/search?q=μῆνιν", "/author/tlg0011", "/work/tlg0012-tlg001"];
const PAGES = [...[...new Set(offlinePages())].filter((p) => !["/town-hall/thread", "/town-hall/member", "/town-hall/pnyx/debate"].includes(p)), ...EXTRA];

async function audit(page: Page, path: string, theme: "light" | "dark") {
  await page.addInitScript((t) => {
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t, motion: "reduce" }, version: 0 }));
  }, theme);
  await page.goto(path);
  await expect(page.locator("h1").first()).toBeVisible();
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(600);
  // big faint Greek words behind empty states are decoration (WCAG 1.4.3 exempts it), marked data-decorative
  const res = await new AxeBuilder({ page }).exclude("[data-decorative]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return res.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help,
    nodes: v.nodes.slice(0, 8).map((n) => ({ target: n.target.join(" "), summary: n.failureSummary?.split("\n").slice(0, 3).join(" | "), html: n.html.slice(0, 160) })),
    count: v.nodes.length,
  }));
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility, ${theme}`, () => {
    for (const path of PAGES) {
      test(`${path} (${theme})`, async ({ page }) => {
        test.setTimeout(60_000);
        const v = await audit(page, path, theme);
        if (REPORT) {
          mkdirSync("test-results", { recursive: true });
          writeFileSync(`test-results/a11y-${theme}-${encodeURIComponent(path)}.json`, JSON.stringify(v, null, 1));
          return;
        }
        expect(v.filter((x) => x.impact === "serious" || x.impact === "critical"), JSON.stringify(v, null, 1)).toEqual([]);
      });
    }
  });
}

/** Things that only appear after a click: panels, pop-ups, editors. Each is checked open, in both themes. */
const ILIAD = "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1";
const iliad = async (page: Page) => expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
const STATES: [string, string, (page: Page) => Promise<void>][] = [
  ["settings panel", "/", async (page) => { await page.getByRole("button", { name: "Settings" }).click(); }],
  ["connection panel", "/", async (page) => { await page.getByRole("button", { name: /^Connection:/ }).click(); }],
  ["quick search", "/", async (page) => { await page.keyboard.press("/"); await page.keyboard.type("λογος"); await page.waitForTimeout(800); }],
  ["word look-up", ILIAD, async (page) => { await iliad(page); await page.locator('[data-u="1.1"] [data-w="ἄειδε"]').click(); await expect(page.getByRole("complementary", { name: "Look-up: ἄειδε" })).toBeVisible(); }],
  ["passage toolbar and note", ILIAD, async (page) => { await iliad(page); await page.locator('[data-row="1.5"]').click(); await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Note", exact: true }).click(); }],
  ["reading aids", ILIAD, async (page) => { await iliad(page); for (const b of ["Transliteration", "Colour by case", "Metre", "Vocabulary"]) await page.getByRole("button", { name: b }).click(); }],
  ["echoes", ILIAD, async (page) => { await iliad(page); await page.locator('[data-row="1.5"]').click(); await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Echoes" }).click(); await expect(page.getByRole("complementary", { name: "Echoes" })).toBeVisible(); await page.waitForTimeout(2000); }],
  ["places panel", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=2.494", async (page) => { await expect(page.locator('[data-u="2.494"]').first()).toBeVisible({ timeout: 30_000 }); await page.getByRole("button", { name: "Places", exact: true }).click(); await expect(page.getByRole("complementary", { name: "Places on this page" }).locator("ol li").first()).toBeVisible({ timeout: 30_000 }); }],
  ["manuscript panel", ILIAD, async (page) => { await iliad(page); await page.getByRole("button", { name: "Manuscript", exact: true }).click(); const p = page.getByRole("complementary", { name: "The manuscript" }); await p.getByRole("radio", { name: "No spaces" }).click(); await expect(p.getByText("f. 12r")).toBeVisible({ timeout: 30_000 }); }],
  ["census item", "/stoa/census", async (page) => { await page.getByRole("button", { name: /^1 Ζεύς/ }).first().click(); await expect(page.getByRole("heading", { level: 2, name: "Ζεύς" })).toBeVisible(); }],
  ["map place", "/stoa/periplus?p=570685", async (page) => { await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible(); }],
  ["wiki note editor", "/stoa/delphi", async (page) => { await page.getByRole("button", { name: /Write a note on/ }).first().click(); }],
  ["treasury notes", "/treasury?s=notes", async () => {}],
  ["treasury anthology", "/treasury?s=anthology", async () => {}],
  ["treasury words", "/treasury?s=words", async () => {}],
  ["treasury places", "/treasury?s=places", async () => {}],
  ["treasury authors", "/treasury?s=authors", async () => {}],
  ["alphabet letter", "/academy/alphabet", async (page) => { await page.getByRole("option", { name: /theta/ }).click(); }],
  ["account join", "/account", async (page) => { await page.getByRole("tab", { name: "Join" }).click(); }],
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility after a click, ${theme}`, () => {
    for (const [name, path, act] of STATES) {
      test(`${name} (${theme})`, async ({ page }) => {
        test.setTimeout(90_000);
        await page.addInitScript((t) => {
          localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t, motion: "reduce" }, version: 0 }));
        }, theme);
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        await act(page);
        await page.waitForTimeout(600);
        const res = await new AxeBuilder({ page }).exclude("[data-decorative]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const v = res.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, count: x.nodes.length,
          nodes: x.nodes.slice(0, 8).map((n) => ({ target: n.target.join(" "), summary: n.failureSummary?.split("\n").slice(0, 3).join(" | "), html: n.html.slice(0, 160) })) }));
        if (REPORT) {
          mkdirSync("test-results", { recursive: true });
          writeFileSync(`test-results/a11y-${theme}-${encodeURIComponent("state " + name)}.json`, JSON.stringify(v, null, 1));
          return;
        }
        expect(v.filter((x) => x.impact === "serious" || x.impact === "critical"), JSON.stringify(v, null, 1)).toEqual([]);
      });
    }
  });
}
