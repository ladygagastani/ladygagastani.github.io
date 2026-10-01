import { describe, expect, it } from "vitest";
import { ARTICLE_LOADERS, PIN_KINDS, type AuthorArticle } from "./author-articles";
import { ARTICLES as PUBLISHED } from "./author-articles-all";
import { blocks, inline, linksIn } from "./markup";
import { gapText, yearLabel, yearsBetween } from "../components/library/AuthorRoad";
import catalog from "../../public/data/catalog.json";

/** ARTICLE=tlg0014 tests that one article file instead (one being written, not yet in ARTICLES). */
const one = process.env.ARTICLE;
const ARTICLES: Record<string, AuthorArticle> = one
  ? Object.fromEntries(Object.values((await import(`./authors/${one}.ts`)) as Record<string, AuthorArticle>).map((a) => [a.id, a]))
  : PUBLISHED;

const cat = (catalog as { authors: { id: string; works: { id: string }[] }[] }).authors;
const authorIds = new Set(cat.map((a) => a.id));
const works = new Set(cat.flatMap((a) => a.works.map((w) => w.id)));

describe("numbered sources in markup", () => {
  it("reads [^2] and [^1,3]", () => {
    expect(inline("A claim[^2] and another[^1,3].")).toEqual(["A claim", { src: [2] }, " and another", { src: [1, 3] }, "."]);
  });
  it("does not confuse a source marker with a link", () => {
    expect(inline("[text](https://example.org)[^1]")).toEqual([{ ext: "https://example.org", text: "text" }, { src: [1] }]);
  });
});

describe("timeline years", () => {
  it("writes BC and AD the usual way", () => {
    expect(yearLabel(-490)).toBe("490 BC");
    expect(yearLabel(175)).toBe("AD 175");
    expect(yearLabel(1554)).toBe("1554");
  });
  it("says rough dates are 'about'", () => {
    expect(gapText(25)).toBe("25 years later");
    expect(gapText(80, true)).toBe("about 80 years later");
    expect(gapText(674)).toBe("about 670 years later");
  });
  it("counts across the turn of the era without a year 0", () => {
    expect(yearsBetween(-1, 1)).toBe(1);
    expect(yearsBetween(-490, -480)).toBe(10);
    expect(yearsBetween(175, 200)).toBe(25);
  });
});

/** Every article that is published has been checked: these tests keep an unchecked or broken one out. */
describe("published author articles", () => {
  const all = Object.values(ARTICLES);
  it("is keyed by its author's id, and the author is in the catalogue", () => {
    for (const [k, a] of Object.entries(ARTICLES)) {
      expect(a.id).toBe(k);
      expect(authorIds.has(k), k).toBe(true);
    }
  });
  it("has been checked on a real date and lists its sources", () => {
    for (const a of all) {
      expect(a.checked, a.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.sources.length, a.id).toBeGreaterThan(0);
      for (const s of a.sources) {
        expect(s.label.length, a.id).toBeGreaterThan(3);
        // a web page, or a passage of the texts in the reader (how ancient sources are cited)
        if (s.cite) expect(works.has(s.cite.work), `${a.id}: ${s.cite.work}`).toBe(true);
        else expect(s.url, a.id).toMatch(/^https?:\/\//);
      }
    }
  });
  it("points every marker at a source, and uses every source", () => {
    for (const a of all) {
      const used = new Set<number>();
      const text = [a.summary, a.transmission, a.variants, ...a.timeline.map((t) => t.what), ...a.editions.map((e) => e.text + (e.note ?? ""))].join("\n\n");
      for (const m of text.matchAll(/\[\^(\d+(?:,\d+)*)\]/g)) m[1].split(",").forEach((n) => used.add(Number(n)));
      a.timeline.forEach((t) => t.src?.forEach((n) => used.add(n)));
      for (const n of used) expect(n >= 1 && n <= a.sources.length, `${a.id}: source ${n}`).toBe(true);
      for (let n = 1; n <= a.sources.length; n++) expect(used.has(n), `${a.id}: source ${n} is never cited`).toBe(true);
    }
  });
  it("has a timeline in which a mark's sources exist and kinds are known", () => {
    for (const a of all) for (const t of a.timeline) {
      expect(PIN_KINDS[t.kind], a.id).toBeDefined();
      expect(Number.isInteger(t.year), a.id).toBe(true);
    }
  });
  it("parses, with known kinds of mark and links that exist", () => {
    for (const a of all) {
      for (const src of [a.summary, a.transmission, a.variants]) expect(() => blocks(src), a.id).not.toThrow();
      expect(a.summary.trim().length, a.id).toBeGreaterThan(200);
      for (const t of a.timeline) expect(PIN_KINDS[t.kind], a.id).toBeDefined();
      const { cites } = linksIn([...blocks(a.summary), ...blocks(a.transmission), ...blocks(a.variants)]);
      for (const c of cites) expect(works.has(c.work), `${a.id}: ${c.work}`).toBe(true);
    }
  });
});

describe("loading one article at a time", () => {
  it("has a loader for every published article, and it gives that article", async () => {
    expect(Object.keys(ARTICLE_LOADERS).sort()).toEqual(Object.keys(PUBLISHED).sort());
    for (const [id, load] of Object.entries(ARTICLE_LOADERS)) expect(await load()).toBe(PUBLISHED[id]);
  });
});
