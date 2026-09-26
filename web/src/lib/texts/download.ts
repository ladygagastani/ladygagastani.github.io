/**
 * Download the original text files, one by one, from GitHub, pinned to the catalogue's exact
 * version of each collection. Each file is checked against GitHub's own fingerprint for it (its
 * git blob SHA-1), which proves the copy is byte-for-byte the original. Finished files are recorded,
 * so an interrupted download resumes where it stopped.
 */
import { rawUrl, type CatalogIndex, type CatText, type CollectionId } from "@/lib/catalog";
import { kvGet, kvSet } from "./kv";
import { folderWrite, opfsWrite, repoOf, askPersistence } from "./local";

export interface Plan { texts: CatText[]; bytes: number }
export interface PlanOptions { cols: CollectionId[]; langs: string[]; workIds?: Set<string> | null }

export function planDownload(idx: CatalogIndex, o: PlanOptions): Plan {
  const texts: CatText[] = [];
  for (const a of idx.catalog.authors) for (const w of a.works) {
    if (o.workIds && !o.workIds.has(w.id)) continue;
    for (const t of w.texts) if (o.cols.includes(t.col) && t.lang && o.langs.includes(t.lang)) texts.push(t);
  }
  return { texts, bytes: texts.reduce((n, t) => n + t.size, 0) };
}

export type Target = { kind: "browser" } | { kind: "folder"; handle: FileSystemDirectoryHandle; id: string };
export interface Progress { files: number; totalFiles: number; bytes: number; totalBytes: number; skipped: number; failed: { path: string; reason: string }[] }

const doneKey = (t: Target) => `downloaded:${t.kind === "browser" ? "browser" : t.id}`;

/** git's fingerprint of a file: SHA-1 of "blob <length>\0" followed by the bytes. */
export async function gitBlobSha(bytes: Uint8Array): Promise<string> {
  const head = new TextEncoder().encode(`blob ${bytes.byteLength}\0`);
  const all = new Uint8Array(head.byteLength + bytes.byteLength);
  all.set(head); all.set(bytes, head.byteLength);
  const d = new Uint8Array(await crypto.subtle.digest("SHA-1", all));
  return Array.from(d, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Which files are already saved at this target (path → fingerprint). */
export const downloadedAt = async (t: Target) => (await kvGet<Record<string, string>>(doneKey(t))) ?? {};

export async function runDownload(idx: CatalogIndex, plan: Plan, target: Target,
  onProgress: (p: Progress) => void, signal: AbortSignal, concurrency = 6): Promise<Progress> {
  if (target.kind === "browser") await askPersistence();
  const done = await downloadedAt(target);
  const p: Progress = { files: 0, totalFiles: plan.texts.length, bytes: 0, totalBytes: plan.bytes, skipped: 0, failed: [] };
  const queue = plan.texts.filter((t) => {
    const key = `${t.col}/${t.path}`;
    if (done[key] === t.sha) { p.files++; p.bytes += t.size; p.skipped++; return false; }
    return true;
  });
  onProgress({ ...p });

  let lastSave = Date.now();
  const save = () => kvSet(doneKey(target), done);

  async function one(t: CatText) {
    const key = `${t.col}/${t.path}`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(rawUrl(idx, t), { signal });
        if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());
        if ((await gitBlobSha(bytes)) !== t.sha) throw new Error("the file did not match its fingerprint");
        const repo = repoOf(idx, t.col);
        if (target.kind === "browser") await opfsWrite(repo, t.path, bytes);
        else await folderWrite(target.handle, repo, t.path, bytes);
        done[key] = t.sha;
        return;
      } catch (e) {
        if (signal.aborted) throw e;
        if (attempt === 2) { p.failed.push({ path: t.path, reason: (e as Error).message }); return; }
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }

  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (next < queue.length && !signal.aborted) {
      const t = queue[next++];
      await one(t);
      p.files++; p.bytes += t.size;
      onProgress({ ...p, failed: [...p.failed] });
      if (Date.now() - lastSave > 3000) { lastSave = Date.now(); await save(); }
    }
  });
  try { await Promise.all(workers); } finally { await save(); }
  return p;
}
