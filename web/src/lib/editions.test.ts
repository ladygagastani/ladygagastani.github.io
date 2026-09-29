import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { OTHER, PUBLISHERS, editionRows, groupsOf, publisherOf } from "./editions";
import { indexCatalog, type Catalog } from "./catalog";

const catalog = JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog;
const rows = editionRows(catalog);

describe("publishers", () => {
  it("are recognised in real descriptions", () => {
    expect(publisherOf("Epictetus. Epicteti Dissertationes ab Arriano Digestae. Schenkl, Heinrich, editor. Leipzig:Teubner, 1916.")).toBe("teubner");
    expect(publisherOf("Demosthenes. Orationes, Vol. II, Part 1. Butcher, S. H., editor. Oxford: Clarendon Press, 1907.")).toBe("oxford");
    expect(publisherOf("Andocides. Minor Attic Orators, Vol. 1. Maidment, Kenneth John, translator. London: William Heinemann, Ltd.; Cambridge, MA: Harvard University Press, 1941 (1960 printing).")).toBe("loeb");
    expect(publisherOf("Hippocrates. Oeuvres complètes d'Hippocrate, Vol. 6. Littré, Émile, editor. Paris: Baillière, 1849")).toBe("bailliere");
    expect(publisherOf("something nobody has heard of")).toBe(OTHER.id);
    expect(publisherOf(null)).toBe(OTHER.id);
  });
  it("have distinct ids", () => {
    expect(new Set(PUBLISHERS.map((p) => p.id)).size).toBe(PUBLISHERS.length);
  });
});

describe("edition rows", () => {
  it("cover every text in the catalogue exactly once", () => {
    expect(rows.length).toBe(Object.values(catalog.authors).flatMap((a) => a.works.flatMap((w) => w.texts)).length);
    expect(new Set(rows.map((r) => r.text.urn)).size).toBe(rows.length);
  });
  it("group most texts under a named publisher", () => {
    const named = rows.filter((r) => r.group !== OTHER.id).length;
    expect(named / rows.length).toBeGreaterThan(0.85);
  });
  it("link to a text that the reader can pick", () => {
    const idx = indexCatalog(catalog);
    for (const r of rows.slice(0, 500)) {
      const work = idx.work.get(r.work)!;
      expect(work.texts.some((t) => t.urn === r.text.urn)).toBe(true);
      expect(r.href).toContain(`w=${r.work}`);
    }
  });
  it("list the biggest group first and 'other' last", () => {
    const gs = groupsOf(rows);
    expect(gs[gs.length - 1].id).toBe(OTHER.id);
    expect(gs.reduce((n, g) => n + g.rows.length, 0)).toBe(rows.length);
  });
});
