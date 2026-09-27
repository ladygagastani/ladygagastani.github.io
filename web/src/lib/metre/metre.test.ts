import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { patternText, scanWords } from "./scan";
import { shape } from "./prosody";
import { lineHash, scanLine } from "./text";
import { renderPassages, verseLines } from "./render";
import type { Unit } from "@/lib/tei/types";

const words = (s: string) => s.split(" ");
const q = (s: ReturnType<typeof scanWords>) => s.syllables.map((x) => x.q).join("");

describe("syllables and lengths", () => {
  it("finds diphthongs, but not where a diaeresis or a mark on the first vowel splits them", () => {
    const vowels = (w: string) => shape([w]).nuclei.map((n) => w.slice(n.a, n.b));
    expect(vowels("ἄειδε")).toEqual(["ἄ", "ει", "ε"]);
    expect(vowels("Πηληϊάδεω")).toEqual(["η", "η", "ϊ", "ά", "ε", "ω"]);
    expect(vowels("ἐύσκοπον")).toEqual(["ἐ", "ύ", "ο", "ο"]);
  });
  it("uses the accent where it proves a length", () => {
    // circumflex on the next-to-last syllable: the last vowel is short
    expect(shape(["Μοῦσα"]).nuclei.map((n) => n.nature)).toEqual(["L", "S"]);
    // acute on the third from last: the last vowel is short
    expect(shape(["ἄβατον"]).nuclei[2].nature).toBe("S");
  });
});

describe("dactylic hexameter", () => {
  it("Iliad 1.1, with synizesis in -δεω and the caesura after θεά", () => {
    const s = scanWords(words("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"), "hexameter");
    expect(s.sure).toBe(true);
    expect(patternText(s)).toBe("–⏑⏑ | –⏑⏑ | –– | –⏑⏑ | –⏑⏑ | –⏑");
    expect(s.syllables.find((x) => x.licence === "synizesis")).toBeTruthy();
    expect(s.caesura?.name).toMatch(/masculine/);
    expect(s.shape.words[s.shape.nuclei[s.syllables[s.caesura!.after].nuclei[0]].w]).toBe("θεὰ");
  });
  it("Odyssey 1.1: μοι is shortened before a vowel (correption)", () => {
    const s = scanWords(words("ἄνδρα μοι ἔννεπε Μοῦσα πολύτροπον ὃς μάλα πολλὰ"), "hexameter");
    expect(q(s).slice(0, 3)).toBe("LSS");
    expect(s.syllables[2].licence).toBe("correption");
  });
  it("marks a line that fits no hexameter as not scanned, never guessed", () => {
    const s = scanWords(words("ἀλλʼ οὐ δύναμαι"), "hexameter");
    expect(s.sure).toBe(false);
    expect(s.readings).toBe(0);
  });
});

describe("elegiac pentameter and iambic trimeter", () => {
  it("a pentameter: two halves with the break in the middle", () => {
    const s = scanWords(words("τὸν Μυτιληναῖον παῖδα τὸν Ὑρράδιον"), "pentameter");
    expect(s.sure).toBe(true);
    // as in the published scansion (hypotactic.com): τὸν Μυτι | ληναῖ | ον ‖ παῖδα τὸν | Ὑρράδι | ον
    expect(q(s).slice(0, -1)).toBe("LSSLLLLSSLSS");
    expect(s.caesura?.name).toMatch(/middle/);
  });
  it("Prometheus Bound 1", () => {
    const s = scanWords(words("χθονὸς μὲν ἐς τηλουρὸν ἥκομεν πέδον"), "trimeter");
    expect(s.sure).toBe(true);
    expect(q(s)).toMatch(/^SLSLLLSLSLS[LSX]$/);
  });
  it("in drama, sung passages are labelled and not scanned as trimeter", () => {
    const r = scanLine(words("ἰὼ ἰὼ δύστανε"), "drama", "strophe", undefined);
    expect(r.scan).toBeNull();
    expect(r.label).toMatch(/sung/);
  });
});

describe("published scansions", () => {
  it("a published scansion is followed exactly when it fits the words", () => {
    const r = scanLine(words("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"), "hexameter", undefined, "hexameter|LSSLSSLLLSSLSSLL");
    expect(r.source).toBe("published");
    expect(r.scan!.syllables.map((x) => x.q).join("")).toBe("LSSLSSLLLSSLSSLL");
  });
  it("lines are matched by their words, ignoring accents and punctuation", () => {
    expect(lineHash(words("μῆνιν ἄειδε θεὰ"))).toBe(lineHash(words("μῆνιν ἄειδε θεά,")));
  });
});

describe("lines split between speakers", () => {
  const unit = (ref: string, n: string, text: string): Unit => ({ ref: [ref], blocks: [{ t: "l", n, c: [text] }] });
  it("join 35 and 35b into one line for scanning, and hand each part its own marks", () => {
    const units = [unit("35", "35", "ἀτὰρ τί χρέος"), unit("35b", "35b", "ἔβα με μετὰ τὸν Πασίαν")];
    expect(verseLines(units).map((l) => l.words.length)).toEqual([8]);
    const r = renderPassages(units, "comedy", () => undefined, lineHash);
    const a = r.get("35")![0]!, b = r.get("35b")![0]!;
    if (a.state === "scanned") {
      expect(a.marks.every((m) => m.w < 3)).toBe(true);
      expect(b.marks.every((m) => m.w < 5)).toBe(true);
      expect(a.marks.length + b.marks.length).toBeGreaterThan(8);
    }
  });
});

// The whole check against the published scansions: pipeline/fetch_hypotactic.py, then
// npx tsx scripts/check-metre.ts (by metre) or npx tsx scripts/build-metre.ts (on the site's own texts).
const REPORT = "../pipeline/.cache/metre-report.json";
describe.skipIf(!existsSync(REPORT))("agreement with the published scansions (from the last build)", () => {
  it("is at least 99% for hexameter and pentameter and 95% for trimeter", () => {
    const { totals } = JSON.parse(readFileSync(REPORT, "utf8")) as { totals: { byMetre: Record<string, { checked: number; agree: number }> } };
    const r = (m: string) => totals.byMetre[m].agree / totals.byMetre[m].checked;
    expect(r("hexameter")).toBeGreaterThan(0.99);
    expect(r("pentameter")).toBeGreaterThan(0.99);
    expect(r("trimeter")).toBeGreaterThan(0.95);
  });
});
