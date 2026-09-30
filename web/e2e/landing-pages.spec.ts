import { test, expect } from "@playwright/test";

const meta = (page: import("@playwright/test").Page, sel: string) => page.locator(sel).first().getAttribute("content");

test("an author has a page of its own that search engines and link previews can read", async ({ page }) => {
  await page.goto("/author/tlg0011");
  await expect(page.getByRole("heading", { level: 1, name: "Sophocles" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Oedipus Tyrannus/ }).first()).toBeVisible();
  await expect(page).toHaveTitle(/^Sophocles: works in Greek and English · Mathesis Stoicheion$/);
  expect(await meta(page, "meta[name=description]")).toMatch(/^Sophocles: Ancient Greek playwright \(5th c\. BC\)\. 8 works/);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", "https://mathesisstoicheion.com/author/tlg0011");
  expect(await meta(page, "meta[property='og:image']")).toBe("https://mathesisstoicheion.com/og-card.png");
  expect(await meta(page, "meta[property='og:title']")).toBe("Sophocles · Mathesis Stoicheion");
  const ld = JSON.parse((await page.locator("script[type='application/ld+json']").first().textContent())!);
  expect(ld["@type"]).toBe("Person");
  expect(ld.sameAs).toContain("https://en.wikipedia.org/wiki/Sophocles");
});

test("the author's page works without scripts: its content is in the page as delivered", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/author/tlg0011");
  await expect(page.getByRole("heading", { level: 1, name: "Sophocles" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Antigone/ }).first()).toBeVisible();
  await ctx.close();
});

test("a work has a page of its own, with a way in to the reader", async ({ page }) => {
  await page.goto("/work/tlg0012-tlg001");
  await expect(page.getByRole("heading", { level: 1, name: "Iliad" })).toBeVisible();
  await expect(page).toHaveTitle(/^Iliad, Homer: read in Greek and English/);
  expect(await meta(page, "meta[name=description]")).toMatch(/^Read Homer: Iliad \(Ἰλιάς\) in Ancient Greek with an English translation beside it/);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", "https://mathesisstoicheion.com/work/tlg0012-tlg001");
  const ld = JSON.parse((await page.locator("script[type='application/ld+json']").first().textContent())!);
  expect(ld).toMatchObject({ "@type": "CreativeWork", name: "Iliad", inLanguage: "grc", author: { name: "Homer" } });
  // each text the library holds is listed and opens itself in the reader
  await expect(page.getByRole("link", { name: /^English translation/ }).first()).toBeVisible();
  await page.getByRole("link", { name: /Read it with the English beside the Greek/ }).click();
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg001$/);
});

test("the author page links each work to its own page, and the app's own author page is not indexed", async ({ page }) => {
  await page.goto("/author/tlg0012");
  await page.getByRole("link", { name: "About" }).first().click();
  await expect(page).toHaveURL(/\/work\/tlg0012-tlg\d{3}/);
  await page.goto("/library/author?a=tlg0012");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  // the app's page does not add the "About" links (they would not work offline)
  await expect(page.getByRole("heading", { level: 1, name: "Homer" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
});

test("pages that describe themselves have their own preview title and description", async ({ page }) => {
  await page.goto("/stoa/eras");
  expect(await meta(page, "meta[property='og:title']")).toBe("Eras of Greek · The Painted Stoa · Mathesis Stoicheion");
  expect(await meta(page, "meta[property='og:description']")).toMatch(/^Two thousand years of Greek writing/);
  await page.goto("/account");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
});

test("robots.txt points to the sitemap, which lists the public pages and leaves out private ones", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://mathesisstoicheion.com/sitemap.xml");
  expect(robots).toContain("Disallow: /account");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://mathesisstoicheion.com/author/tlg0011</loc>");
  expect(sitemap).toContain("<loc>https://mathesisstoicheion.com/work/tlg0012-tlg001</loc>");
  expect(sitemap).toContain("<loc>https://mathesisstoicheion.com/stoa/eras</loc>");
  expect(sitemap).not.toContain("/account<");
  expect(sitemap).not.toContain("/treasury<");
  expect((sitemap.match(/<loc>/g) ?? []).length).toBeGreaterThan(2000);
});
