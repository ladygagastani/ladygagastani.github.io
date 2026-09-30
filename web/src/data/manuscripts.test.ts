import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { WITNESSES, type LineIndex, type PageList } from "./manuscripts";

const catalog = JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as { authors: { works: { id: string }[] }[] };
const works = new Set(catalog.authors.flatMap((a) => a.works.map((w) => w.id)));
const read = <T,>(path: string) => JSON.parse(readFileSync(`public${path}`, "utf8")) as T;

describe("the manuscripts the reader shows", () => {
  for (const w of WITNESSES) {
    it(`${w.name}: its works are in the catalogue, and every page it names is one of its pages`, () => {
      expect(w.record.url).toMatch(/^https:\/\//);
      expect(w.terms.url).toMatch(/^https:\/\//);
      for (const [id, inW] of Object.entries(w.works)) {
        expect(works.has(id), id).toBe(true);
        const folios = new Set((inW.lines ? read<LineIndex>(inW.lines).pages : read<PageList>(`/data/manuscripts/${w.id}.json`).pages).map((p) => p[0]));
        for (const f of [inW.from, ...Object.values(inW.books ?? {})]) expect(folios.has(f), `${id} ${f}`).toBe(true);
      }
    });
  }

  it("the Venetus A's index places (nearly) every line of the Iliad, each inside its photograph", () => {
    const ix = read<LineIndex>("/data/manuscripts/venetus-a-iliad.json");
    const refs = Object.keys(ix.lines);
    expect(refs.length).toBeGreaterThan(15500);
    expect(new Set(refs.map((r) => r.split(".")[0])).size).toBe(24);
    expect(ix.pages[ix.lines["1.1"][0]][0]).toBe("12r");
    for (const [p, x, y, bw, bh] of Object.values(ix.lines)) {
      expect(ix.pages[p]).toBeDefined();
      expect(x >= 0 && y >= 0 && x + bw <= 1.001 && y + bh <= 1.001).toBe(true);
    }
  });
});
