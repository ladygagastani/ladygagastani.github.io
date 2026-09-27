/**
 * The prosody of a Greek verse line: its syllables, and what length each one can have.
 *
 * A syllable is long "by nature" (η, ω, a diphthong, a vowel with a circumflex or iota subscript),
 * short by nature (ε, ο), or either (α, ι, υ, whose length the spelling does not show), and long
 * "by position" when its vowel is followed by two or more consonants, in the same word or across a
 * word break (ζ, ξ, ψ count as two; a rough breathing is not a consonant).
 *
 * The licences poets use are offered as choices, each with a cost, and the metre decides:
 * - a stop followed by λ, ρ, μ or ν need not make the syllable before it long ("muta cum liquida");
 * - a long vowel or diphthong at the end of a word may be shortened before a vowel ("correption");
 * - a diphthong may be shortened before a vowel inside a word;
 * - two vowels of one word may be run together into one syllable ("synizesis"), as in -εω, -εα;
 * - a short syllable at the end of a word may be lengthened.
 * The costs differ by metre (scan.ts): in Homer correption is everyday, in tragedy rare.
 * The accent is used where it proves a length (a circumflex on the next-to-last syllable means the
 * last vowel is short, and so on).
 */

import { formKey } from "@/lib/greek";

export type Q = "L" | "S";
export type Licence = "mcl" | "correption" | "inner-correption" | "synizesis" | "lengthening";

/** A letter as written: its base letter and marks, and where it sits in its word. */
interface Letter { base: string; marks: string; a: number; b: number }

const VOWELS = "αεηιουω";
const CONS: Record<string, number> = { β: 1, γ: 1, δ: 1, ζ: 2, θ: 1, κ: 1, λ: 1, μ: 1, ν: 1, ξ: 2, π: 1, ρ: 1, σ: 1, τ: 1, φ: 1, χ: 1, ψ: 2, ϝ: 1 };
const STOPS = "πβφκγχτδθ";
const LIQUIDS = "λρμν";
const DIPHTHONGS = new Set(["αι", "ει", "οι", "υι", "αυ", "ευ", "ου", "ηυ", "ωυ"]);

const ACUTE = "́", GRAVE = "̀", CIRC = "͂", DIAER = "̈", IOTA_SUB = "ͅ", MACRON = "̄", BREVE = "̆";

function letters(word: string): Letter[] {
  const out: Letter[] = [];
  let i = 0;
  for (const ch of word) {
    const d = ch.normalize("NFD");
    const base = d[0].toLowerCase().replace(/[ςϲ]/, "σ");
    if (/\p{M}/u.test(d[0]) && out.length) {
      const l = out[out.length - 1];
      l.marks += d; l.b = i + ch.length;
    } else out.push({ base, marks: d.slice(1), a: i, b: i + ch.length });
    i += ch.length;
  }
  return out;
}

/** One vowel or diphthong (the core of a syllable) of a word, and the consonants that follow it. */
export interface Nucleus {
  w: number;              // word
  a: number; b: number;   // where it is in the word (characters)
  nature: Q | "A";        // A: α, ι or υ of unknown length
  diphthong: boolean;
  vowels: string;         // base letters, e.g. "ει"
  accent: "" | "acute" | "circ";
}

/** A line broken into the vowels of its syllables and the consonants between them. */
export interface LineShape {
  words: string[];
  nuclei: Nucleus[];
  /** consonants after each nucleus, up to the next one: [weight, the consonants, crossesWordBreak] */
  after: { weight: number; cons: string; crosses: boolean; split: boolean; toVowel: boolean }[];
  /** where each syllable (except the first) may be said to begin, for drawing foot divisions */
  onset: { w: number; at: number }[];
  elided: boolean[];      // each word ends in an elision mark
}

/** @param useKnown  apply the learned vowel lengths (not when fitting a published scansion, which knows better) */
export function shape(words: string[], useKnown = true): LineShape {
  const nuclei: Nucleus[] = [];
  // every letter of the line in order, with its word, and where the nuclei are
  const seq: { l: Letter; w: number; nuc: number }[] = [];
  const elided = words.map((w) => /[ʼ’'᾽]$/u.test(w));
  words.forEach((word, w) => {
    const ls = letters(word).filter((l) => VOWELS.includes(l.base) || l.base in CONS);
    for (let i = 0; i < ls.length; i++) {
      const l = ls[i];
      if (!VOWELS.includes(l.base)) { seq.push({ l, w, nuc: -1 }); continue; }
      const n = ls[i + 1];
      const pair = n ? l.base + n.base : "";
      const diph = !!n && DIPHTHONGS.has(pair) && !n.marks.includes(DIAER) && !/[́̀͂̓̔ͅ]/.test(l.marks);
      const marks = diph ? l.marks + n.marks : l.marks;
      const nature: Q | "A" =
        diph || "ηω".includes(l.base) || marks.includes(IOTA_SUB) || marks.includes(CIRC) || marks.includes(MACRON) ? "L"
        : "εο".includes(l.base) || marks.includes(BREVE) ? "S" : "A";
      const accent = marks.includes(CIRC) ? "circ" : marks.includes(ACUTE) || marks.includes(GRAVE) ? "acute" : "";
      nuclei.push({ w, a: l.a, b: diph ? n.b : l.b, nature, diphthong: diph, vowels: diph ? pair : l.base, accent });
      seq.push({ l, w, nuc: nuclei.length - 1 });
      if (diph) i++;
    }
  });
  accentRules(nuclei, words, elided);
  if (known && useKnown) knownLengths(nuclei, words);

  const after: LineShape["after"] = [];
  const onset: LineShape["onset"] = [];
  for (let k = 0; k < seq.length; k++) {
    if (seq[k].nuc < 0) continue;
    let weight = 0, cons = "", crosses = false, j = k + 1;
    const cs: { l: Letter; w: number }[] = [];
    for (; j < seq.length && seq[j].nuc < 0; j++) {
      const c = seq[j];
      if (c.w !== seq[k].w) crosses = true;
      weight += CONS[c.l.base]; cons += c.l.base; cs.push(c);
    }
    if (j < seq.length && seq[j].w !== seq[k].w) crosses = true;
    after.push({ weight, cons, crosses, split: new Set(cs.map((c) => c.w)).size > 1, toVowel: j < seq.length });
    if (j < seq.length) {
      // the next syllable begins with the last consonant before it (or all of them at the start of a word)
      const next = seq[j];
      const inWord = cs.filter((c) => c.w === next.w);
      let start: { w: number; at: number };
      if (cs.length === 0) start = next.w !== seq[k].w ? { w: next.w, at: 0 } : { w: next.w, at: next.l.a };
      else if (inWord.length === cs.length && cs[0].w === seq[k].w) start = { w: next.w, at: cs[cs.length - 1].l.a };   // inside a word: V C . C V
      else if (inWord.length && inWord.length < cs.length) {
        // consonants from an earlier word (an elided δʼ, a final ν…): the syllable starts at the break
        const firstOther = cs.find((c) => c.w !== seq[k].w);
        start = firstOther && firstOther.w !== next.w ? { w: firstOther.w, at: 0 } : { w: next.w, at: 0 };
      } else start = { w: next.w, at: inWord.length ? 0 : next.l.a };
      onset.push(start);
    }
  }
  return { words, nuclei, after, onset, elided };
}

const plain = (w: string) => w.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const ENCLITIC_END = /(τις|τι|τινα|τινες|νυν|περ|γε)$/;

/**
 * Lengths of α, ι and υ in particular words, learned from published scansions
 * (scripts/build-metre.ts → public/data/metre/_lengths.json): form → one letter per vowel,
 * L long, S short, "." unknown.
 */
let known: Map<string, string> | null = null;
export function setKnownLengths(m: Map<string, string> | null) { known = m; }

function knownLengths(nuclei: Nucleus[], words: string[]) {
  for (let w = 0; w < words.length; w++) {
    const pat = known!.get(formKey(words[w]));
    if (!pat) continue;
    const ns = nuclei.filter((n) => n.w === w);
    if (ns.length !== pat.length) continue;
    ns.forEach((n, i) => { if (n.nature === "A" && pat[i] !== ".") n.nature = pat[i] as Q; });
  }
}

/** What the accent proves about vowel lengths (on words that are not elided). */
function accentRules(nuclei: Nucleus[], words: string[], elided: boolean[]) {
  for (let w = 0; w < words.length; w++) {
    if (elided[w]) continue;
    const ns = nuclei.filter((n) => n.w === w);
    const m = ns.length;
    if (m < 2) continue;
    const accented = ns.findIndex((n) => n.accent);          // the word's own accent (an enclitic's comes later)
    if (accented < 0) continue;
    const pos = m - 1 - accented;                           // 0 ultima, 1 penult, 2 antepenult
    const ult = ns[m - 1], pen = ns[m - 2];
    const ultShortForAccent = ult.nature === "S" || (ult.diphthong && /^(αι|οι)$/.test(ult.vowels) && words[w].normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[ʼ’'᾽]$/, "").endsWith(ult.vowels));
    if (pos === 2 && ult.nature === "A") ult.nature = "S";                       // acute on the antepenult: last vowel short
    if (pos === 1 && pen.accent === "circ" && ult.nature === "A") ult.nature = "S";   // circumflex on the penult: last vowel short
    if (pos === 1 && pen.accent === "acute") {
      // long penult with acute: last vowel long; not in words that end in an enclitic (οὔτις, ὥστε, τοίνυν), which keep their own accent
      if (pen.nature === "L" && ult.nature === "A" && !ENCLITIC_END.test(plain(words[w]))) ult.nature = "L";
      if (pen.nature === "A" && ultShortForAccent) pen.nature = "S";           // acute (not circumflex) before a short last vowel: penult short
    }
  }
}

/** A syllable's possible lengths, each with the licence it needs (if any). */
export interface Option { q: Q; licence?: Licence }

/** The lengths each syllable can take. `synizesis` merges are handled by the caller (variants). */
export function options(sh: LineShape, i: number, attic = false): Option[] {
  const n = sh.nuclei[i], af = sh.after[i];
  const last = i === sh.nuclei.length - 1;
  const endsWord = last || sh.nuclei[i + 1].w !== n.w;
  if (af.weight >= 2) {
    // long by position, unless the two consonants are a stop and a liquid or nasal in one word
    const [c1, c2] = af.cons;
    if (af.weight === 2 && af.cons.length === 2 && STOPS.includes(c1) && LIQUIDS.includes(c2) && !af.split && n.nature !== "L") {
      // in Attic verse such a syllable is usually short; in epic, usually long
      return attic ? [{ q: "S" }, { q: "L", licence: "mcl" }] : [{ q: "L" }, { q: "S", licence: "mcl" }];
    }
    return [{ q: "L" }];
  }
  const out: Option[] = [];
  const hiatus = af.weight === 0 && af.toVowel;
  if (n.nature === "L") {
    out.push({ q: "L" });
    if (hiatus && endsWord && !sh.elided[n.w]) out.push({ q: "S", licence: "correption" });
    else if (hiatus && n.diphthong && /[ιυ]$/.test(n.vowels)) out.push({ q: "S", licence: "inner-correption" });
  } else if (n.nature === "A") {
    out.push({ q: "L" }, { q: "S" });
  } else {
    out.push({ q: "S" });
    if (endsWord && !last) out.push({ q: "L", licence: "lengthening" });
  }
  return out;
}

/**
 * Pairs of neighbouring vowels that may be run together into one syllable: in one word, ε before
 * α, η, ο, ω or a diphthong (synizesis: θεός, Πηληϊάδεω); across words, a short word such as ἤ,
 * μή, ἐπεί, δή, ἐγώ before a vowel (synecphonesis: ἢ οὐ, μὴ ἄλλος).
 */
export function synizesisCandidates(sh: LineShape): number[] {
  const out: number[] = [];
  for (let i = 0; i + 1 < sh.nuclei.length; i++) {
    const a = sh.nuclei[i], b = sh.nuclei[i + 1];
    if (sh.after[i].weight !== 0) continue;
    if (a.w === b.w) {
      if (a.vowels === "ε" && /^(α|η|ο|ω|ου|οι|ει|αι)/.test(b.vowels)) out.push(i);
    } else if (b.w === a.w + 1 && !sh.elided[a.w] && SYNECPHONESIS.has(plain(sh.words[a.w]))) out.push(i);
  }
  return out;
}
const SYNECPHONESIS = new Set(["η", "μη", "επει", "δη", "εγω", "ω"]);
