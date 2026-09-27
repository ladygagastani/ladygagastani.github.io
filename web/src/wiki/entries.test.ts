/**
 * Checks every Painted Stoa entry without the texts: its markup parses, every quotation, link,
 * related entry, image and bibliography item exists, and every cited work is in the catalogue.
 * The check against the texts themselves is entries.corpus.test.ts.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { indexCatalog, type Catalog } from "@/lib/catalog";
import { ENTRIES, entryBySlug } from "./index";
import { BIB } from "./bibliography";
import { blocks, inline, linksIn } from "./markup";
import { CATEGORIES } from "./types";
import { IMAGES } from "./images";
import mapData from "../../public/data/map/places.json";

const MAP_PLACES = new Set((mapData as { places: { id: string }[] }).places.map((p) => p.id));

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

describe("the markup", () => {
  it("reads headings, quotations, boxes, lists and claims", () => {
    const b = blocks("## A heading\n\nText with *it* and [Thuc. 1.1](cts:tlg0003.tlg001:1.1).\n\n{{quote:x}}\n\n!! Did you know\n!! more\n\n- one\n- two\n\n{debated} A claim.");
    expect(b.map((x) => Object.keys(x)[0])).toEqual(["h2", "p", "quote", "dyk", "list", "p"]);
    expect((b[5] as { cert: string }).cert).toBe("debated");
    expect(inline("[x](cts:tlg0003.tlg001:5.84-5.116)")).toEqual([{ cite: { work: "tlg0003.tlg001", ref: "5.84", to: "5.116" }, text: "x" }]);
  });
  it("refuses links it does not know, so a typo cannot slip through", () => {
    expect(() => inline("[x](melos)")).toThrow();
    expect(() => blocks("{{quot:x}}")).toThrow();
  });
});

describe.each(ENTRIES.map((e) => [e.slug, e] as const))("entry %s", (slug, e) => {
  const body = blocks(e.body);
  const hook = inline(e.hook);
  const { cites, wikis } = linksIn([...body, { p: hook }]);

  it("has the parts every entry needs", () => {
    expect(e.slug).toMatch(/^[a-z0-9-]+$/);
    expect(CATEGORIES.some((c) => c.id === e.category)).toBe(true);
    expect(e.hook.length).toBeGreaterThan(80);
    expect(e.readIt.length).toBeGreaterThan(0);
    expect(e.primary.length).toBeGreaterThan(0);
    expect(e.secondary.length).toBeGreaterThan(0);
    expect(e.written).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("uses every quotation it defines, and defines every one it uses", () => {
    const used = body.flatMap((b) => ("quote" in b ? [b.quote] : []));
    expect(new Set(used)).toEqual(new Set(Object.keys(e.quotes ?? {})));
  });
  it("links only to entries, images and books that exist", () => {
    for (const w of [...wikis, ...e.related]) expect(entryBySlug.has(w), `${slug} → ${w}`).toBe(true);
    for (const b of body) if ("figure" in b) expect(IMAGES[b.figure], b.figure).toBeTruthy();
    if (e.image) expect(IMAGES[e.image], e.image).toBeTruthy();
    for (const s of e.secondary) expect(BIB[s.id], s.id).toBeTruthy();
    if (body.some((b) => "timeline" in b)) expect(e.timeline?.length).toBeGreaterThan(0);
    for (const p of e.places ?? []) expect(MAP_PLACES.has(p), `${slug}: Pleiades ${p} is not on the map`).toBe(true);
  });
  it("cites only works in the catalogue", () => {
    const works = [...cites.map((c) => c.work), ...Object.values(e.quotes ?? {}).map((q) => q.work), ...e.readIt.map((c) => c.work), ...e.primary.map((c) => c.work)];
    for (const w of works) expect(idx.work.has(w), `${slug}: ${w}`).toBe(true);
  });
});

describe("the bibliography", () => {
  it("records where every work was checked", () => {
    for (const [id, b] of Object.entries(BIB)) {
      expect(b.checked, id).toMatch(/^https:\/\//);
      expect(b.year, id).toBeGreaterThan(1800);
    }
  });
  it("has nothing unused", () => {
    const used = new Set(ENTRIES.flatMap((e) => e.secondary.map((s) => s.id)));
    for (const id of Object.keys(BIB)) expect(used.has(id), id).toBe(true);
  });
});

describe("the Kerameikos", () => {
  it("lists only entries that exist, each once, and dig sites that are on the map", async () => {
    const { LAYERS, DIG_SITES } = await import("./kerameikos");
    const slugs = LAYERS.flatMap((l) => l.slugs);
    for (const s of slugs) expect(entryBySlug.has(s), `Kerameikos: no entry "${s}"`).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const e of ENTRIES) if (e.category === "archaeology") expect(slugs, `archaeology entry ${e.slug} is not in a Kerameikos layer`).toContain(e.slug);
    for (const s of DIG_SITES) expect(MAP_PLACES.has(s.id), `Kerameikos: ${s.en} (${s.id}) is not on the map`).toBe(true);
  });
});
