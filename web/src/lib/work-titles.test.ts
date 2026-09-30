import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { indexCatalog, type Catalog } from "./catalog";
import { readReference } from "./search/refs";

const catalog = JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog;
const idx = indexCatalog(catalog);
const works = catalog.authors.flatMap((a) => a.works);
const work = (id: string) => works.find((w) => w.id === id)!;

describe("English titles for works the collections name in Latin or Greek", () => {
  it("keep the collection's own title, and say where the English comes from", () => {
    const titled = works.filter((w) => w.orig);
    expect(titled.length).toBeGreaterThan(1200);
    for (const w of titled) {
      expect(w.title, w.id).not.toBe(w.orig);
      expect(["tr", "site"], w.id).toContain(w.titleFrom);
    }
    expect(work("tlg0732.tlg001")).toMatchObject({ title: "On Mixture", orig: "De mixtione", titleFrom: "site" });
    expect(work("tlg0085.tlg001")).toMatchObject({ title: "Suppliant Maidens", orig: "Supplices", titleFrom: "tr" });
    expect(work("tlg0011.tlg004")).toMatchObject({ title: "Oedipus the King", orig: "Oedipus Tyrannus" });
  });

  it("an English title from a translation is that translation's own title", () => {
    for (const w of works.filter((x) => x.titleFrom === "tr")) {
      expect(w.texts.some((t) => t.kind === "translation"), w.id).toBe(true);
    }
  });

  it("leaves English titles and names alone", () => {
    expect(work("tlg0012.tlg001").orig).toBeUndefined();
    expect(work("tlg1286.tlg001").title).toBe("Poimandres");
  });

  it("a typed reference finds the work by its English or its Latin title", () => {
    expect(readReference("On Mixture 1", idx, {}).map((r) => r.work)).toContain("tlg0732.tlg001");
    expect(readReference("De mixtione 1", idx, {}).map((r) => r.work)).toContain("tlg0732.tlg001");
  });
});
