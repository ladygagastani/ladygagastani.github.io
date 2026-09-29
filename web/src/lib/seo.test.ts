import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PAGE_DESCRIPTIONS, SITE_URL, absolute, authorDescription, workDescription, workIdOf, workPath } from "./seo";
import { sitePaths } from "./site-paths";
import { siteData } from "./build-data";
import { PRIVATE_PAGES, STATIC_PAGES } from "@/config/pages";

describe("descriptions", () => {
  it("describe an author from what is known, and only that", () => {
    const d = authorDescription({ name: "Sophocles", desc: "ancient Greek playwright", lived: "5th c. BC", works: 8, english: 8 });
    expect(d).toContain("Sophocles: Ancient Greek playwright (5th c. BC).");
    expect(d).toContain("8 works in the library, each with an English translation");
    expect(authorDescription({ name: "X", works: 1, english: 0 })).toContain("1 work in the library, in Greek");
    expect(authorDescription({ name: "Aristotle", desc: "Greek philosopher", works: 48, english: 6 })).toContain("48 works in the library, 6 with an English translation");
    // without a description or dates nothing is invented
    expect(authorDescription({ name: "Anonymous", works: 2, english: 0 })).toBe("Anonymous: Author in the Greek library. 2 works in the library, in Greek. Read online, with every word one click from a dictionary.");
  });
  it("describe a work with and without a translation", () => {
    const w = workDescription({ title: "Iliad", author: "Homer", greekTitle: "Ἰλιάς", hasTranslation: true, genre: "Epic poetry", dialect: "Ionic/Epic", when: "8th c. BC" });
    expect(w).toBe("Read Homer: Iliad (Ἰλιάς) in Ancient Greek with an English translation beside it, and look up any word. Epic poetry · Ionic/Epic · 8th c. BC. Free, with no adverts.");
    expect(workDescription({ title: "Aetia", author: "Callimachus", hasTranslation: false })).toBe("Read the Greek text of Callimachus: Aetia, and look up any word. Free, with no adverts.");
  });
  it("keep every page description short enough to show in full", () => {
    for (const [k, d] of Object.entries(PAGE_DESCRIPTIONS)) expect(d.length, k).toBeLessThan(200);
  });
});

describe("the sitemap", () => {
  const paths = sitePaths();
  const { idx } = siteData();
  const works = idx.catalog.authors.flatMap((a) => a.works);
  it("lists each page once", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("has a page for every author and every work", () => {
    for (const a of idx.catalog.authors) expect(paths, a.id).toContain(`/author/${a.id}`);
    for (const w of works) expect(paths, w.id).toContain(workPath(w.id));
  });
  it("leaves out every private page and the recording studio", () => {
    for (const p of [...PRIVATE_PAGES, "/academy/studio"]) expect(paths, p).not.toContain(p);
    for (const p of STATIC_PAGES.filter((x) => !PRIVATE_PAGES.includes(x))) expect(paths, p).toContain(p);
  });
  it("gives every address as one clean path: no spaces, queries or doubled slashes", () => {
    for (const p of paths) expect(p, p).toMatch(/^\/[A-Za-z0-9._\-\/[\]]*$/);
    expect(paths.some((p) => p.includes("//"))).toBe(false);
  });
  it("writes a work's address with a dash, and reads it back to the catalogue's id", () => {
    expect(workPath("tlg0012.tlg001")).toBe("/work/tlg0012-tlg001");
    for (const w of works) { expect(workIdOf(workPath(w.id).slice("/work/".length)), w.id).toBe(w.id); expect(workPath(w.id)).not.toMatch(/\.[^/]*$/); }
  });
  it("makes absolute addresses on the site's own domain", () => {
    expect(absolute("/author/tlg0012")).toBe(`${SITE_URL}/author/tlg0012`);
    expect(new URL(absolute("/")).origin).toBe(SITE_URL);
  });
});

describe("every page of the site is either described for search engines or deliberately not indexed", () => {
  it("has a description or a noindex in its own file", () => {
    const dynamic = ["/academy/lesson/[id]", "/stoa/[slug]", "/author/[id]", "/work/[id]"];   // these write theirs in generateMetadata
    const bare: string[] = [];
    const walk = (dir: string, route: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p, `${route}/${f}`);
        else if (f === "page.tsx") {
          const src = readFileSync(p, "utf8");
          const path = route || "/";
          if (path === "/" || dynamic.includes(path)) continue;   // the home page uses the site's own description
          if (!/description|NOINDEX|index: false/.test(src)) bare.push(path);
        }
      }
    };
    walk(join(__dirname, "../app"), "");
    expect(bare).toEqual([]);
  });
});
