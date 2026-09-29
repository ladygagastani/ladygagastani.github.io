/**
 * GLAUx's analyses placed on the very words the reader shows, worked out once per book and edition.
 *
 * Matching by reference (lookup/words.ts) fails where GLAUx cites a work by another scheme than the
 * edition on screen (Aristotle by Bekker page, say): nothing matches, and asking the whole work for
 * every word on a page froze the browser. Here both texts are walked in reading order instead, as
 * the search index and Echoes do (search/place.ts), so any edition of the work lines up, in one pass.
 */
import { greekKey, unitWords } from "@/lib/search/codec";
import { alignStream } from "@/lib/search/place";
import type { TeiDoc } from "@/lib/tei/types";
import type { WordPack } from "./words";

export interface Placed {
  /** passage reference ("1.33") → passage number */
  unitOf: Map<string, number>;
  /** position of each passage's first word (length: passages + 1) */
  unitStart: Int32Array;
  /** each word's search key (accents, breathings and case removed), to check a word before using its analysis */
  key: string[];
  /** for each word: index into pack.lemmas and pack.tags, or -1 where GLAUx has no word here */
  lemma: Int32Array;
  tag: Int32Array;
  manual: Uint8Array;
  /** share of the words that have an analysis */
  cover: number;
}

const cache = new WeakMap<WordPack, WeakMap<TeiDoc, Placed>>();

export function placeAnalyses(pack: WordPack, doc: TeiDoc): Placed {
  let byDoc = cache.get(pack);
  if (!byDoc) cache.set(pack, (byDoc = new WeakMap()));
  const hit = byDoc.get(doc);
  if (hit) return hit;

  const key: string[] = [];
  const unitStart = new Int32Array(doc.units.length + 1);
  const unitOf = new Map<string, number>();
  doc.units.forEach((u, i) => {
    unitStart[i] = key.length;
    unitOf.set(u.ref.join("."), i);
    for (const w of unitWords(u)) key.push(greekKey(w));
  });
  unitStart[doc.units.length] = key.length;

  const gKeys: string[] = [], gLemma: number[] = [], gTag: number[] = [], gManual: number[] = [];
  for (const [, manual, forms, lem, tag] of pack.units) forms.split(" ").forEach((f, j) => {
    const k = greekKey(f);
    if (!k || pack.tags[tag[j]].startsWith("u")) return;   // punctuation
    gKeys.push(k); gLemma.push(lem[j]); gTag.push(tag[j]); gManual.push(manual);
  });

  const at = alignStream(gKeys, key);
  const lemma = new Int32Array(key.length).fill(-1), tag = new Int32Array(key.length).fill(-1), manual = new Uint8Array(key.length);
  let n = 0;
  at.forEach((pos, i) => { if (pos >= 0) { lemma[pos] = gLemma[i]; tag[pos] = gTag[i]; manual[pos] = gManual[i]; n++; } });

  const placed: Placed = { unitOf, unitStart, key, lemma, tag, manual, cover: key.length ? n / key.length : 0 };
  byDoc.set(doc, placed);
  return placed;
}

/**
 * The positions of a passage's words, matched to its clickable words on screen in order. A word on
 * screen whose spelling does not agree with the next word of the passage is skipped rather than
 * given another word's analysis. Returns, for each span, its position or -1.
 */
export function positionsFor(p: Placed, ref: string, spans: string[]): number[] {
  const u = p.unitOf.get(ref);
  if (u === undefined) return spans.map(() => -1);
  let q = p.unitStart[u];
  const end = p.unitStart[u + 1];
  return spans.map((w) => {
    const k = greekKey(w);
    let r = q;
    while (r < end && p.key[r] !== k) r++;
    if (r >= end) return -1;
    q = r + 1;
    return r;
  });
}

/** How often each dictionary word occurs in the given passages. */
export function placedLemmaCounts(pack: WordPack, p: Placed, refs: Iterable<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const ref of refs) {
    const u = p.unitOf.get(ref);
    if (u === undefined) continue;
    for (let i = p.unitStart[u]; i < p.unitStart[u + 1]; i++) {
      if (p.lemma[i] < 0) continue;
      const l = pack.lemmas[p.lemma[i]];
      counts.set(l, (counts.get(l) ?? 0) + 1);
    }
  }
  return counts;
}
