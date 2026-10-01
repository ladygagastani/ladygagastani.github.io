import { describe, expect, it } from "vitest";
import { englishVoices, pieces, wordAt } from "./listen";

// (what is read from the page, speakable(), is checked in the browser: e2e/listen.spec.ts)

describe("listening: what is read", () => {
  it("cuts long text at sentence ends, and covers every word", () => {
    const text = Array.from({ length: 12 }, (_, i) => `This is sentence number ${i + 1}, which goes on for a while.`).join(" ");
    const ps = pieces(text, 120);
    for (const [a, b] of ps) expect(b - a).toBeLessThanOrEqual(121);
    expect(ps.map(([a, b]) => text.slice(a, b).trim()).join(" ")).toBe(text);
    expect(text.slice(...ps[0]).trim()).toMatch(/\.$/);
  });
  it("finds the word around a letter", () => {
    expect(wordAt("the wrath of Achilles", 6)).toEqual([4, 9]);
  });
  it("offers English voices only, natural ones first", () => {
    const v = (name: string, lang: string) => ({ name, lang, localService: true, default: false, voiceURI: name }) as SpeechSynthesisVoice;
    const out = englishVoices([v("Greek", "el-GR"), v("David", "en-US"), v("Libby Online (Natural)", "en-GB")]);
    expect(out.map((x) => x.name)).toEqual(["Libby Online (Natural)", "David"]);
  });
});
