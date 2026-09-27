/**
 * Reading a typed reference ("Il. 1.1", "S. Ant. 332", "Iliad 9 312", "Hdt. 1.5.3") as a work and
 * a place in it. Abbreviations are LSJ's own (public/data/abbrev.json, scripts/build-abbrev.ts);
 * English titles and author names from the catalogue work too.
 */
import { fold, type CatalogIndex } from "@/lib/catalog";

/** "S. Ant." → "s ant"; the same key for "S Ant", "s. ant" … */
export const abbrevKey = (s: string) => fold(s).replace(/\./g, " ").replace(/\s+/g, " ").trim();

export type Abbrevs = Record<string, [label: string, work: string, n: number]>;
let pending: Promise<Abbrevs> | null = null;
export function loadAbbrevs(): Promise<Abbrevs> {
  pending ??= fetch("/data/abbrev.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  return pending;
}

export interface RefHit { work: string; at: string | null; label: string; how: string }

/** Split "S. Ant. 332" into "S. Ant." and "332" (a reference is numbers, with a letter allowed: "327a"). */
export function splitRef(q: string): { name: string; at: string | null } {
  const m = /^(.*?[^\d\s:,])\s*((?:\d+[a-z]?)(?:[\s.:,]+\d+[a-z]?)*)\s*$/i.exec(q.trim());
  if (!m) return { name: q.trim(), at: null };
  return { name: m[1].trim(), at: m[2].split(/[\s.:,]+/).join(".") };
}

/** Works a typed reference could mean, best first. Empty if it does not look like a reference. */
export function readReference(q: string, idx: CatalogIndex, abbrevs: Abbrevs): RefHit[] {
  const { name, at } = splitRef(q);
  if (!name || name.length < 2) return [];
  const out: RefHit[] = [];
  const seen = new Set<string>();
  const add = (h: RefHit) => { if (!seen.has(h.work) && idx.work.has(h.work)) { seen.add(h.work); out.push(h); } };

  const a = abbrevs[abbrevKey(name)];
  if (a) add({ work: a[1], at, label: titleOf(idx, a[1]), how: `“${a[0]}” as LSJ abbreviates it` });

  // English titles, optionally after the author's name: "Iliad", "Sophocles Antigone"
  const n = fold(name).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (n.length >= 3) {
    for (const au of idx.catalog.authors) {
      const an = fold(au.name).toLowerCase();
      for (const w of au.works) {
        const t = fold(w.title).toLowerCase();
        if (t === n || `${an} ${t}` === n || (t.startsWith(n) && n.length >= 4) || (n.startsWith(`${an} `) && t.startsWith(n.slice(an.length + 1)))) {
          add({ work: w.id, at, label: titleOf(idx, w.id), how: "title" });
        }
      }
    }
  }
  return out.slice(0, 6);
}

const titleOf = (idx: CatalogIndex, work: string) => `${idx.authorOf.get(work)?.name ?? ""}, ${idx.work.get(work)?.title ?? work}`;
