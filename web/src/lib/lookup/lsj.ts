/**
 * Liddell–Scott–Jones, from the files built by pipeline/build_lsj.py (PerseusDL/lexica, CC BY-SA 4.0).
 * Shards are fetched on demand, or read from browser storage when downloaded for offline use.
 */
import { fold } from "@/lib/catalog";
import { opfsRead } from "@/lib/texts/local";

export type Seg = string | { g: string } | { c: string; u: string };
export interface LsjEntry { k: string; s: string; b: [number, string, Seg[]][] }

export const LSJ_DIR = "mathesis-lsj";
export const LSJ_CREDIT = "Text provided under a CC BY-SA license by Perseus Digital Library, http://www.perseus.tufts.edu, with funding from The National Endowment for the Humanities. Data accessed from https://github.com/PerseusDL/lexica/.";

const shards = new Map<string, Promise<Record<string, LsjEntry[]> | null>>();

export const shardOf = (headword: string) => fold(headword).replace(/[^α-ωϝ]/g, "").slice(0, 2) || "_";

function loadShard(shard: string) {
  if (!shards.has(shard)) {
    shards.set(shard, (async () => {
      const local = await opfsRead(LSJ_DIR, `${shard}.json`).catch(() => null);
      if (local) return JSON.parse(local);
      const res = await fetch(`/data/lsj/${encodeURIComponent(shard)}.json`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`LSJ unavailable (${res.status})`);
      return res.json();
    })().catch((e) => { shards.delete(shard); throw e; }));
  }
  return shards.get(shard)!;
}

/** Entries for a headword: exact spelling first, else the same letters ignoring accents. */
export async function lsjEntries(headword: string): Promise<{ head: string; entries: LsjEntry[] } | null> {
  const h = headword.normalize("NFC");
  const data = await loadShard(shardOf(h));
  if (!data) return null;
  if (data[h]) return { head: h, entries: data[h] };
  const f = fold(h);
  const key = Object.keys(data).find((k) => fold(k) === f);
  return key ? { head: key, entries: data[key] } : null;
}

/** "urn:cts:greekLit:tlg0019.tlg006.perseus-grc1:827" → a link into the reader. */
export function citationHref(urn: string): string | null {
  const m = /^urn:cts:greekLit:(tlg\d+\.tlg\d+)(?:\.[\w-]+)?(?::([\w.]+))?/.exec(urn);
  if (!m) return null;
  return `/read?w=${m[1]}${m[2] ? `&at=${encodeURIComponent(m[2])}` : ""}`;
}
