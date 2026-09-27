import { describe, expect, it } from "vitest";
import type { Mark, PageNote } from "./annotations";
import type { DeckCard } from "./academy";
import {
  EXPORT_APP, ImportProblem, exportHtml, mergeAcademy, mergeById, mergeDeck, mergePositions, noteHtml, parseExport, type TreasuryData,
} from "./treasury-io";

const mark = (id: string, updated: number, extra: Partial<Mark> = {}): Mark => ({
  id, kind: "note", work: "tlg0012.tlg001", ed: "perseus-grc2", start: { u: "1.1", i: 0 }, end: { u: "1.1", i: 0 },
  quote: "μῆνιν", text: "wrath", created: 1, updated, ...extra,
});
const card = (id: string, reps: number, last?: string): DeckCard =>
  ({ id, lemma: id, gloss: "", source: "saved", added: 1, card: { reps, last_review: last, due: "2026-01-01T00:00:00Z" } as unknown as DeckCard["card"] });

const data = (over: Partial<TreasuryData> = {}): TreasuryData => ({
  app: EXPORT_APP, format: 1, exported: "2026-09-27T10:00:00.000Z",
  marks: [mark("a", 5, { tags: ["themes"] })], notes: [], academy: { completed: {}, days: [], deck: {} }, positions: {}, ...over,
});

describe("merging", () => {
  it("adds what is new, replaces only with newer copies, and never deletes", () => {
    const { write, report } = mergeById([mark("a", 5), mark("b", 5)], [mark("a", 9), mark("b", 2), mark("c", 1)]);
    expect(write.map((m) => m.id)).toEqual(["a", "c"]);
    expect(report).toEqual({ added: 1, updated: 1, unchanged: 1 });
  });

  it("keeps the more-reviewed copy of a review card", () => {
    const { deck, report } = mergeDeck({ x: card("x", 3), y: card("y", 1, "2026-01-01") }, { x: card("x", 1), y: card("y", 1, "2026-02-01"), z: card("z", 0) });
    expect((deck.x.card as unknown as { reps: number }).reps).toBe(3);
    expect((deck.y.card as unknown as { last_review: string }).last_review).toBe("2026-02-01");
    expect(report).toEqual({ added: 1, updated: 1, unchanged: 1 });
  });

  it("keeps the earliest completion of a lesson and every active day", () => {
    const { academy } = mergeAcademy({ completed: { a: 5 }, days: ["2026-01-02"], deck: {} }, { completed: { a: 3, b: 7 }, days: ["2026-01-01", "2026-01-02"], deck: {} });
    expect(academy.completed).toEqual({ a: 3, b: 7 });
    expect(academy.days).toEqual(["2026-01-01", "2026-01-02"]);
  });

  it("keeps the more recent reading position", () => {
    const { positions, changed } = mergePositions({ w: { ed: "e", tr: null, at: "1.1", t: 5 } }, { w: { ed: "e", tr: null, at: "2.1", t: 9 }, v: { ed: "e", tr: null, at: "3", t: 1 } });
    expect(positions.w.at).toBe("2.1");
    expect(changed).toBe(2);
  });
});

describe("the export file", () => {
  it("reads as a document and carries its data, which parses back unchanged", () => {
    const note: PageNote = { id: "word:λόγος", kind: "word", target: "λόγος", text: "a <tag> & **bold**", created: 1, updated: 1 };
    const d = data({ notes: [note], marks: [mark("a", 5, { text: "</script><b>not html</b>" })] });
    const html = exportHtml(d, null, "https://example.org");
    expect(html).toContain("<h1>My Treasury</h1>");
    expect(html).toContain("a &lt;tag&gt; &amp; <b>bold</b>");
    expect(html).not.toContain("</script><b>not html</b>");
    expect(html).toContain("https://example.org/read?w=tlg0012.tlg001&amp;ed=perseus-grc2&amp;at=1.1");
    const back = parseExport(html);
    expect(back.marks[0].text).toBe("</script><b>not html</b>");
    expect(back.notes[0]).toEqual(note);
  });

  it("accepts plain JSON too, and refuses other files clearly", () => {
    expect(parseExport(JSON.stringify(data())).marks).toHaveLength(1);
    expect(() => parseExport("<html>hello</html>")).toThrow(ImportProblem);
    expect(() => parseExport(JSON.stringify({ app: "Other" }))).toThrow(/not made by Mathesis/);
    expect(() => parseExport(JSON.stringify({ ...data(), format: 99 }))).toThrow(/newer version/);
  });

  it("drops damaged records instead of failing", () => {
    const d = parseExport(JSON.stringify({ ...data(), marks: [mark("ok", 1), { id: 3 }, null] }));
    expect(d.marks.map((m) => m.id)).toEqual(["ok"]);
  });
});

describe("note formatting", () => {
  it("turns bold, italic and lists into HTML, escaping everything else", () => {
    expect(noteHtml("**B** and *i*\n- one\n- two\n\nnext <p>")).toBe("<p><b>B</b> and <i>i</i></p><ul><li>one</li><li>two</li></ul><p>next &lt;p&gt;</p>");
  });
});
