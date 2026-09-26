/**
 * The offline library, as one piece of state shared by the front page, Settings and the Scroll Case.
 * A download keeps running while the reader moves around the site (the store lives outside pages).
 */
import { create } from "zustand";
import { loadCatalog, type CollectionId } from "@/lib/catalog";
import { planDownload, runDownload, downloadedAt, type Plan, type Progress, type Target, type PlanOptions } from "@/lib/texts/download";
import {
  listFolders, connectFolder, reconnectFolders, forgetFolder, canUseFolders, hasBrowserStorage,
  storageEstimate, opfsRemoveRepo, type Folder,
} from "@/lib/texts/local";
import { importZip } from "@/lib/texts/zip";
import { kvGet, kvSet } from "@/lib/texts/kv";

export interface BrowserCopy { col: CollectionId; files: number; bytes: number }

interface OfflineState {
  ready: boolean;
  supportsFolders: boolean;
  supportsBrowser: boolean;
  online: boolean;
  folders: Folder[];
  browser: BrowserCopy[];               // what is saved in browser storage, per collection
  zipImported: Record<string, number>;  // repo → files imported from a ZIP
  usage: { used: number; quota: number } | null;
  job: { label: string; progress: Progress | null; running: boolean; error: string | null; kind: "download" | "zip" } | null;

  refresh: () => Promise<void>;
  download: (o: PlanOptions & { label: string }, target?: Target) => Promise<void>;
  cancel: () => void;
  connect: () => Promise<string>;
  reconnect: () => Promise<string>;
  forget: (id: string) => Promise<void>;
  loadZip: (file: File) => Promise<string>;
  removeBrowserCopy: (col: CollectionId) => Promise<void>;
  plan: (o: PlanOptions) => Promise<Plan>;
}

let controller: AbortController | null = null;

export const useOffline = create<OfflineState>()((set, get) => ({
  ready: false,
  supportsFolders: false,
  supportsBrowser: false,
  online: true,
  folders: [],
  browser: [],
  zipImported: {},
  usage: null,
  job: null,

  async refresh() {
    const idx = await loadCatalog();
    const done = await downloadedAt({ kind: "browser" });
    const by: Record<string, BrowserCopy> = {};
    for (const key of Object.keys(done)) {
      const col = key.slice(0, key.indexOf("/")) as CollectionId;
      const t = idx.text.size ? findText(idx, key) : null;
      by[col] ??= { col, files: 0, bytes: 0 };
      by[col].files++;
      by[col].bytes += t?.size ?? 0;
    }
    const est = await storageEstimate();
    set({
      ready: true,
      supportsFolders: canUseFolders(),
      supportsBrowser: hasBrowserStorage(),
      online: navigator.onLine,
      folders: canUseFolders() ? await listFolders() : [],
      browser: Object.values(by),
      zipImported: (await kvGet<Record<string, number>>("zip-imported")) ?? {},
      usage: est ? { used: est.usage ?? 0, quota: est.quota ?? 0 } : null,
    });
  },

  async plan(o) { return planDownload(await loadCatalog(), o); },

  async download(o, target = { kind: "browser" }) {
    if (get().job?.running) return;
    const idx = await loadCatalog();
    const plan = planDownload(idx, o);
    controller = new AbortController();
    set({ job: { label: o.label, progress: null, running: true, error: null, kind: "download" } });
    try {
      const p = await runDownload(idx, plan, target, (progress) => set((s) => ({ job: s.job && { ...s.job, progress } })), controller.signal);
      set((s) => ({ job: s.job && { ...s.job, progress: p, running: false } }));
    } catch (e) {
      const paused = controller.signal.aborted;
      set((s) => ({ job: s.job && { ...s.job, running: false, error: paused ? null : (e as Error).message } }));
    } finally {
      controller = null;
      await get().refresh();
    }
  },

  cancel() { controller?.abort(); },

  async connect() {
    const r = await connectFolder();
    await get().refresh();
    if (!r) return "No folder chosen.";
    return r.found
      ? `Connected "${r.folder.name}". Texts will be read from it.`
      : `Connected "${r.folder.name}", but no collection was found in it. Choose the folder that contains canonical-greekLit or First1KGreek.`;
  },

  async reconnect() {
    const r = await reconnectFolders();
    await get().refresh();
    if (!r.total) return "No folders are connected yet.";
    return r.granted === r.total ? `Reconnected ${r.total === 1 ? "your folder" : `all ${r.total} folders`}.` : `Reconnected ${r.granted} of ${r.total} folders.`;
  },

  async forget(id) { await forgetFolder(id); await get().refresh(); },

  async loadZip(file) {
    const idx = await loadCatalog();
    set({ job: { label: `Importing ${file.name}`, progress: null, running: true, error: null, kind: "zip" } });
    try {
      const r = await importZip(idx, file, (done, total) => set((s) => ({
        job: s.job && { ...s.job, progress: { files: done, totalFiles: total, bytes: 0, totalBytes: 0, skipped: 0, failed: [] } },
      })));
      const imported = { ...get().zipImported, [r.repo]: r.files };
      await kvSet("zip-imported", imported);
      set((s) => ({ job: s.job && { ...s.job, running: false } }));
      await get().refresh();
      return `Imported ${r.files} text files from ${r.repo}.`;
    } catch (e) {
      set((s) => ({ job: s.job && { ...s.job, running: false, error: (e as Error).message } }));
      throw e;
    }
  },

  async removeBrowserCopy(col) {
    const idx = await loadCatalog();
    const repo = idx.catalog.collections[col].repo;
    await opfsRemoveRepo(repo);
    const done = await downloadedAt({ kind: "browser" });
    for (const k of Object.keys(done)) if (k.startsWith(`${col}/`)) delete done[k];
    await kvSet("downloaded:browser", done);
    const imported = { ...get().zipImported };
    delete imported[repo];
    await kvSet("zip-imported", imported);
    await get().refresh();
  },
}));

function findText(idx: Awaited<ReturnType<typeof loadCatalog>>, key: string) {
  const path = key.slice(key.indexOf("/") + 1);
  const parts = path.split("/");
  const work = idx.work.get(`${parts[1]}.${parts[2]}`);
  return work?.texts.find((t) => t.path === path) ?? null;
}

export const mb = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(1)} GB` : n >= 1e6 ? `${Math.round(n / 1e6)} MB` : `${n ? Math.max(1, Math.round(n / 1e3)) : 0} KB`);
/** Rough download size: GitHub compresses text files, to about a quarter in our measurements. */
export const transferEstimate = (bytes: number) => bytes * 0.25;
