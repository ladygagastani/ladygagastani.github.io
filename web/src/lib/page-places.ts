/**
 * The places a page of Greek names: GLAUx's dictionary words, placed on the words the reader shows
 * (lookup/placed.ts), matched to the Periplus's places by name (map.ts). Pure, so it can be tested.
 */
import type { Place } from "./map";
import type { Placed } from "./lookup/placed";
import type { WordPack } from "./lookup/words";

export interface PagePlace {
  place: Place;
  /** the dictionary word as the text uses it */
  lemma: string;
  /** mentions on this page */
  n: number;
  /** the passages that name it, in reading order */
  refs: string[];
  /** per passage, the search keys of the words that name it (to mark them on screen) */
  keys: Map<string, Set<string>>;
}

/** Places named in these passages, in the order they first come up. */
export function placesOnPage(pack: WordPack, placed: Placed, refs: Iterable<string>, byName: Map<string, Place>): PagePlace[] {
  const out = new Map<string, PagePlace>();
  for (const ref of refs) {
    const u = placed.unitOf.get(ref);
    if (u === undefined) continue;
    for (let i = placed.unitStart[u]; i < placed.unitStart[u + 1]; i++) {
      if (placed.lemma[i] < 0) continue;
      const lemma = pack.lemmas[placed.lemma[i]];
      const place = byName.get(lemma.normalize("NFC"));
      if (!place) continue;
      let pp = out.get(place.id);
      if (!pp) out.set(place.id, (pp = { place, lemma, n: 0, refs: [], keys: new Map() }));
      pp.n++;
      if (pp.refs[pp.refs.length - 1] !== ref) pp.refs.push(ref);
      let ks = pp.keys.get(ref);
      if (!ks) pp.keys.set(ref, (ks = new Set()));
      ks.add(placed.key[i]);
    }
  }
  return [...out.values()];
}

/** Every passage's words to mark, for all the places at once (or one place). */
export function placeMarks(list: PagePlace[], only?: string): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>();
  for (const pp of list) {
    if (only && pp.place.id !== only) continue;
    for (const [ref, ks] of pp.keys) {
      let s = m.get(ref);
      if (!s) m.set(ref, (s = new Set()));
      for (const k of ks) s.add(k);
    }
  }
  return m;
}
