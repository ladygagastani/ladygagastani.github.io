/**
 * A book as one long run of words, the way Echoes compares it: every Greek word the reader makes
 * clickable, in reading order, with where it stands (passage and word number), its form, and its
 * dictionary word where GLAUx analyses it.
 */
import { canonLemma } from "@/lib/search/run";
import { greekKey, unitWords } from "@/lib/search/codec";
import { alignStream } from "@/lib/search/place";
import type { WordPack } from "@/lib/lookup/words";
import type { TeiDoc } from "@/lib/tei/types";

export interface Stream {
  work: string;
  urn: string;
  refs: string[];           // reference of each passage ("1.33")
  unitStart: Int32Array;    // position of each passage's first word (length units + 1)
  chunks: { label: string; at: number }[];   // the reader's pages (books, scenes…) and where each begins
  unit: Int32Array;         // passage of each word
  word: Int32Array;         // word number within its passage (the reader's [data-w] order)
  text: string[];           // the word as printed
  form: Int32Array;         // id of the form (see formKey), shared by every stream in a Lexicon
  lemma: Int32Array;        // id of the dictionary word, or -1 where GLAUx has no analysis here
  lemmaCover: number;       // share of words with a dictionary word (0 when there is no word pack)
}

/** Ids for forms and dictionary words, shared by all the books compared together. */
export class Lexicon {
  forms = new Map<string, number>();
  lemmas = new Map<string, number>();
  lemmaNames: string[] = [];
  formId(k: string) { let i = this.forms.get(k); if (i === undefined) this.forms.set(k, (i = this.forms.size)); return i; }
  lemmaId(l: string) {
    let i = this.lemmas.get(l);
    if (i === undefined) { this.lemmas.set(l, (i = this.lemmas.size)); this.lemmaNames.push(l); }
    return i;
  }
}

const ACCENT = /[́͂]/g;

/**
 * The "exact form" of a word, as Echoes compares it. Letters, breathings and accents count;
 * these differences do not, because they depend only on the neighbouring words:
 * capitals, a grave accent (written for an acute before another word), a second accent thrown
 * back by a following enclitic (ἄνθρωπός τις), final sigma, and the elision mark.
 */
export function formKey(w: string): string {
  let s = w.normalize("NFD").toLowerCase().replace(/[ʼ’'᾽]$/u, "").replace(/̀/g, "́").replace(/̀/g, "́").replace(/́/g, "́");
  const accents = [...s.matchAll(ACCENT)];
  if (accents.length > 1) { const last = accents[accents.length - 1].index!; s = s.slice(0, last) + s.slice(last + 1); }
  return s.replace(/[ςϲ]/g, "σ").normalize("NFC");
}

/** The reader's words of a text, in order. */
export function buildStream(doc: TeiDoc, work: string, urn: string, lex: Lexicon): Stream {
  const text: string[] = [], unit: number[] = [], word: number[] = [];
  const unitStart = new Int32Array(doc.units.length + 1);
  doc.units.forEach((u, ui) => {
    unitStart[ui] = text.length;
    unitWords(u).forEach((w, wi) => { text.push(w); unit.push(ui); word.push(wi); });
  });
  unitStart[doc.units.length] = text.length;
  return {
    work, urn, refs: doc.units.map((u) => u.ref.join(".")), unitStart,
    chunks: doc.chunks.map((c) => ({ label: c.label, at: unitStart[c.first] })),
    unit: Int32Array.from(unit), word: Int32Array.from(word), text,
    form: Int32Array.from(text, (w) => lex.formId(formKey(w))),
    lemma: new Int32Array(text.length).fill(-1), lemmaCover: 0,
  };
}

/**
 * Give each word its dictionary word by placing GLAUx's analysed words on the text, the same way
 * the search index does (so any edition of the work can be used, not only the one GLAUx follows).
 */
export function attachLemmas(s: Stream, pack: WordPack, lex: Lexicon) {
  const keys: string[] = [], lemmas: number[] = [];
  for (const [, , forms, lem, tags] of pack.units) forms.split(" ").forEach((f, j) => {
    const k = greekKey(f);
    if (!k || pack.tags[tags[j]].startsWith("u")) return;
    const l = canonLemma(pack.lemmas[lem[j]]);
    if (!greekKey(l)) return;
    keys.push(k); lemmas.push(lex.lemmaId(l));
  });
  const at = alignStream(keys, s.text.map(greekKey));
  let n = 0;
  at.forEach((pos, i) => { if (pos >= 0) { s.lemma[pos] = lemmas[i]; n++; } });
  s.lemmaCover = s.text.length ? n / s.text.length : 0;
}

/** Position in the stream of word i of the passage with this reference, or -1. */
export function positionOf(s: Stream, ref: string, i: number): number {
  const u = s.refs.indexOf(ref);
  if (u < 0) return -1;
  const p = s.unitStart[u] + i;
  return p < s.unitStart[u + 1] ? p : -1;
}
