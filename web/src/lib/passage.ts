/** Load a stretch of a work (Greek + aligned translation) straight from the source files. */
import { loadCatalog, greekEditions, translations, type CatText } from "@/lib/catalog";
import { getXml } from "@/lib/texts/source";
import { parseInWorker } from "@/lib/tei/client";
import { alignChunk, type Row } from "@/lib/tei/align";
import { findRef } from "@/lib/tei/refs";

export interface LoadedPassage { rows: Row[]; grc: CatText; tr: CatText | null; keys: Set<string>; depth: number }

export async function loadPassage(work: string, from: string, to = from): Promise<LoadedPassage> {
  const idx = await loadCatalog();
  const w = idx.work.get(work);
  if (!w) throw new Error(`${work} is not in the catalogue`);
  const grc = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
  const tr = translations(w)[0] ?? null;
  const [g, t] = await Promise.all([getXml(idx, grc), tr ? getXml(idx, tr).catch(() => null) : null]);
  const parsed = await parseInWorker(g.xml, t?.xml ?? null);
  const a = findRef(parsed.doc, from), b = findRef(parsed.doc, to);
  if (a < 0 || b < a) throw new Error(`reference ${from} not found`);
  // the last unit of a range: extend to the end of the passage named by `to` (e.g. "1.1.2" and its subsections)
  let end = b;
  const toKey = parsed.doc.units[b].ref.join(".");
  while (end + 1 < parsed.doc.units.length && parsed.doc.units[end + 1].ref.join(".").startsWith(toKey + ".")) end++;
  const rows = alignChunk(parsed.doc, { first: a, last: end }, t ? parsed.placed : null);
  return { rows, grc, tr: t ? tr : null, keys: new Set(parsed.doc.units.map((u) => u.ref.join("."))), depth: parsed.doc.levels.length };
}
