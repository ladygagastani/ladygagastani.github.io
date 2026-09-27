/**
 * The words around a search hit, taken from the text itself (the same file the reader opens),
 * with the found words marked.
 */
import { loadCatalog, type CatText } from "@/lib/catalog";
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import { getXml } from "@/lib/texts/source";
import { parseInWorker } from "@/lib/tei/client";
import type { TeiDoc, Unit } from "@/lib/tei/types";

const docs = new Map<string, Promise<TeiDoc>>();

/** A text, parsed, kept for a few texts at a time. */
export function loadDoc(urn: string): Promise<TeiDoc> {
  if (!docs.has(urn)) {
    if (docs.size > 8) docs.delete(docs.keys().next().value!);
    docs.set(urn, (async () => {
      const idx = await loadCatalog();
      const t = idx.text.get(urn) as CatText | undefined;
      if (!t) throw new Error("This text is not in the catalogue.");
      const { xml } = await getXml(idx, t);
      return (await parseInWorker(xml)).doc;
    })().catch((e) => { docs.delete(urn); throw e; }));
  }
  return docs.get(urn)!;
}

export interface Part { t: string; hit?: boolean }

const ENGLISH_WORD = /([A-Za-z]+(?:[’'][a-z]+)?)/;

/**
 * The passage as plain text, split into words and the spaces between them, with the words at the
 * given positions marked. Long passages are cut to about `around` words either side of the hit.
 */
export function snippet(u: Unit, words: number[], lang: "grc" | "eng", around = 14): Part[] {
  const re = lang === "grc" ? GREEK_WORD : ENGLISH_WORD;
  const isWord = lang === "grc" ? isGreekWord : (s: string) => /^[A-Za-z]/.test(s);
  const parts: (Part & { w?: number })[] = [];
  let n = 0;
  u.blocks.forEach((b) => {
    // blocks are lines of verse (shown divided by /) or paragraphs (¶); empty ones are skipped
    if (!b.c.some((x) => typeof x === "string" && x.trim())) return;
    if (parts.length) parts.push({ t: b.t === "l" ? " / " : " ¶ " });
    for (const x of b.c) {
      if (typeof x !== "string") continue;
      for (const s of x.split(re)) {
        if (!s) continue;
        if (isWord(s)) { parts.push({ t: s, w: n, hit: words.includes(n) }); n++; }
        else parts.push({ t: s.replace(/\s+/g, " ") });
      }
    }
  });
  const first = parts.findIndex((p) => p.hit), last = parts.findLastIndex((p) => p.hit);
  if (first < 0) return tidy(parts.slice(0, 60));
  const fw = parts[first].w!, lw = parts[last].w!;
  const from = parts.findIndex((p) => p.w !== undefined && p.w >= fw - around);
  const toW = lw + around;
  let to = parts.length - 1;
  for (let i = last; i < parts.length; i++) if (parts[i].w !== undefined && parts[i].w! > toW) { to = i - 1; break; }
  const out = tidy(parts.slice(from, to + 1));
  if (from > 0) out.unshift({ t: "… " });
  if (to < parts.length - 1) out.push({ t: " …" });
  return out;
}

const tidy = (ps: Part[]): Part[] => ps.map(({ t, hit }) => (hit ? { t, hit } : { t }));
