/**
 * What the library holds from each period of Greek, counted from the catalogue, Wikidata's dates for the authors
 * and GLAUx's dialects. Every figure is a count; nothing is estimated except which period an author belongs to
 * (see placingYear in authors-meta.ts).
 */
import { ERAS, KINDS, type AuthorRow, type Era } from "./authors-meta";

export interface EraStats {
  era: Era;
  authors: number;
  works: number;
  english: number;
  /** the authors with the most works in the library */
  biggest: { row: AuthorRow; works: number }[];
  /** kinds of writing, by number of authors, most first */
  kinds: [id: string, authors: number][];
  /** GLAUx's dialect for the works it covers, most first; `covered` is how many works it covers */
  dialects: [dialect: string, works: number][];
  covered: number;
}

export function eraStats(rows: AuthorRow[]): EraStats[] {
  return ERAS.map((era) => {
    const mine = rows.filter((r) => r.era?.id === era.id);
    const kinds = new Map<string, number>();
    const dialects = new Map<string, number>();
    let covered = 0;
    for (const r of mine) {
      for (const k of r.kinds) kinds.set(k, (kinds.get(k) ?? 0) + 1);
      for (const w of r.workMeta) if (w?.dialect) { dialects.set(w.dialect, (dialects.get(w.dialect) ?? 0) + 1); covered++; }
    }
    return {
      era,
      authors: mine.length,
      works: mine.reduce((n, r) => n + r.works, 0),
      english: mine.reduce((n, r) => n + r.english, 0),
      biggest: [...mine].sort((a, b) => b.works - a.works || a.a.name.localeCompare(b.a.name)).slice(0, 6).map((row) => ({ row, works: row.works })),
      kinds: [...kinds].sort((a, b) => b[1] - a[1] || KINDS.findIndex(([id]) => id === a[0]) - KINDS.findIndex(([id]) => id === b[0])),
      dialects: [...dialects].sort((a, b) => b[1] - a[1]),
      covered,
    };
  });
}

/** One column of "Greek through the centuries": the authors placed in that century, and their works. */
export interface CenturyBar { key: number; label: string; era: Era; authors: number; works: number }

/** The century a year is in, as a sort key (BC negative, no zero) and a label. */
function centuryKey(y: number): { key: number; label: string } {
  const n = y < 0 ? Math.ceil(-y / 100) : Math.floor((y - 1) / 100) + 1;
  const suf = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return { key: y < 0 ? -n : n, label: `${n}${suf} c. ${y < 0 ? "BC" : "AD"}` };
}

/** Every century from the earliest to the latest author, empty ones included, so the chart's axis is even. */
export function centuryBars(rows: AuthorRow[], eraOfYear: (y: number) => Era): CenturyBar[] {
  const by = new Map<number, CenturyBar>();
  for (const r of rows) {
    if (r.year === null) continue;
    const { key, label } = centuryKey(r.year);
    const bar = by.get(key) ?? { key, label, era: eraOfYear(r.year), authors: 0, works: 0 };
    bar.authors++; bar.works += r.works;
    by.set(key, bar);
  }
  if (!by.size) return [];
  const keys = [...by.keys()];
  const out: CenturyBar[] = [];
  for (let k = Math.min(...keys); k <= Math.max(...keys); k++) {
    if (k === 0) continue;
    const got = by.get(k);
    if (got) { out.push(got); continue; }
    const mid = k < 0 ? -(-k * 100 - 50) : (k - 1) * 100 + 50;
    out.push({ key: k, label: centuryKey(mid).label, era: eraOfYear(mid), authors: 0, works: 0 });
  }
  return out;
}
