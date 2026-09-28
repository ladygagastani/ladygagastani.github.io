/**
 * Offline copies of the look-up data: word analyses (per work), the LSJ dictionary (per shard) and
 * the Word Study index (per shard).
 * Each file is checked against the SHA-1 in the pack index before it is saved to browser storage.
 */
import { kvGet, kvSet } from "./kv";
import { opfsWrite } from "./local";
import { WORD_PACK_DIR } from "@/lib/lookup/words";
import { LSJ_DIR } from "@/lib/lookup/lsj";
import { LEXICON_DIR } from "@/lib/lexicon";
import { PACKS } from "@/config/packs";

export interface PackFile { url: string; dir: string; name: string; size: number; sha: string; key: string }
type Index = Record<string, [number, string]>;

const indexes = new Map<string, Promise<Index>>();
const loadIndex = (kind: "words" | "lsj" | "lexicon") => {
  if (!indexes.has(kind)) indexes.set(kind, fetch(`${PACKS}/${kind}/_index.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  return indexes.get(kind)!;
};

/** Word analyses for these works (or all), plus the whole LSJ and the whole Word Study index. */
export async function planPacks(workIds: Iterable<string> | null): Promise<PackFile[]> {
  const [words, lsj, lexicon] = await Promise.all([loadIndex("words"), loadIndex("lsj"), loadIndex("lexicon")]);
  const want = workIds ? new Set(workIds) : null;
  const files: PackFile[] = [];
  for (const [work, [size, sha]] of Object.entries(words)) {
    if (want && !want.has(work)) continue;
    files.push({ url: `${PACKS}/words/${work}.json`, dir: WORD_PACK_DIR, name: `${work}.json`, size, sha, key: `words/${work}` });
  }
  for (const [shard, [size, sha]] of Object.entries(lsj)) {
    files.push({ url: `${PACKS}/lsj/${encodeURIComponent(shard)}.json`, dir: LSJ_DIR, name: `${shard}.json`, size, sha, key: `lsj/${shard}` });
  }
  for (const [shard, [size, sha]] of Object.entries(lexicon)) {
    files.push({ url: `${PACKS}/lexicon/${encodeURIComponent(shard)}.json`, dir: LEXICON_DIR, name: `${shard}.json`, size, sha, key: `lexicon/${shard}` });
  }
  return files;
}

async function sha1(bytes: Uint8Array<ArrayBuffer>) {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-1", bytes));
  return Array.from(d, (b) => b.toString(16).padStart(2, "0")).join("");
}

const DONE = "packs-downloaded";
export const packsDownloaded = async () => (await kvGet<Record<string, string>>(DONE)) ?? {};

export async function runPackDownload(files: PackFile[], onProgress: (done: number, total: number, bytes: number, totalBytes: number) => void, signal: AbortSignal) {
  const done = await packsDownloaded();
  const todo = files.filter((f) => done[f.key] !== f.sha);
  const totalBytes = todo.reduce((n, f) => n + f.size, 0);
  let n = 0, bytes = 0, failed = 0, next = 0;
  onProgress(0, todo.length, 0, totalBytes);
  const worker = async () => {
    while (next < todo.length && !signal.aborted) {
      const f = todo[next++];
      try {
        const res = await fetch(f.url, { signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = new Uint8Array(await res.arrayBuffer());
        if ((await sha1(data)) !== f.sha) throw new Error("fingerprint mismatch");
        await opfsWrite(f.dir, f.name, data);
        done[f.key] = f.sha;
      } catch (e) { if (signal.aborted) throw e; failed++; }
      n++; bytes += f.size;
      onProgress(n, todo.length, bytes, totalBytes);
      if (n % 40 === 0) await kvSet(DONE, done);
    }
  };
  try { await Promise.all(Array.from({ length: 6 }, worker)); } finally { await kvSet(DONE, done); }
  return { files: n, failed };
}
