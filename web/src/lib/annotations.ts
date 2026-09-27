/**
 * The reader's own marks on the texts: bookmarks, favourite passages, notes and highlights.
 * Kept in IndexedDB on this device (sync across devices comes with accounts, Phase 8).
 *
 * A mark points at a stretch of Greek by passage reference and word position, so it survives
 * page changes and different translations: { u: "1.33", i: 4 } is the 5th Greek word of 1.33.
 */
import { create } from "zustand";

export type Kind = "bookmark" | "favourite" | "note" | "highlight" | "xref";
export type Colour = "red" | "ochre" | "blue" | "green";
export interface Point { u: string; i: number }
export interface Mark {
  id: string;
  kind: Kind;
  work: string;
  ed: string;            // Greek edition version, e.g. "perseus-grc2"
  start: Point;
  end: Point;
  quote: string;         // the Greek words marked, for lists and search
  text?: string;         // note text
  colour?: Colour;       // highlight colour
  link?: { work: string; ed: string; start: Point; label: string };   // cross-reference: the other passage
  created: number;
  updated: number;
}

const DB = "mathesis-user", STORE = "marks";
let dbp: Promise<IDBDatabase> | null = null;
function db() {
  dbp ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const s = req.result.createObjectStore(STORE, { keyPath: "id" });
      s.createIndex("work", "work");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { dbp = null; reject(req.error); };
  });
  return dbp;
}
function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then((d) => new Promise<T>((resolve, reject) => {
    const r = fn(d.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}

export const allMarks = () => run<Mark[]>("readonly", (s) => s.getAll());
const marksFor = (work: string) => run<Mark[]>("readonly", (s) => s.index("work").getAll(work));

/** Compare two points in reading order, given the order of passages in the text. */
export function cmp(a: Point, b: Point, order: Map<string, number>) {
  const d = (order.get(a.u) ?? 0) - (order.get(b.u) ?? 0);
  return d || a.i - b.i;
}

interface MarksState {
  byWork: Record<string, Mark[]>;   // marks of every work opened so far (two books can be open)
  error: string | null;
  load: (work: string) => Promise<void>;
  add: (m: Omit<Mark, "id" | "created" | "updated">) => Promise<Mark>;
  update: (id: string, patch: Partial<Pick<Mark, "text" | "colour">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const put = (byWork: Record<string, Mark[]>, work: string, marks: Mark[]) => ({ byWork: { ...byWork, [work]: marks } });
const find = (byWork: Record<string, Mark[]>, id: string) => Object.values(byWork).flat().find((m) => m.id === id);

export const useMarks = create<MarksState>()((set, get) => ({
  byWork: {},
  error: null,
  async load(work) {
    try {
      const marks = await marksFor(work);
      set((s) => ({ ...put(s.byWork, work, marks.sort((a, b) => a.created - b.created)), error: null }));
    } catch {
      set({ error: "Your notes could not be opened in this browser." });
    }
  },
  async add(m) {
    const now = Date.now();
    const mark: Mark = { ...m, id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`, created: now, updated: now };
    await run("readwrite", (s) => s.put(mark));
    set((s) => (s.byWork[m.work] ? put(s.byWork, m.work, [...s.byWork[m.work], mark]) : s));
    return mark;
  },
  async update(id, patch) {
    const m = find(get().byWork, id);
    if (!m) return;
    const next = { ...m, ...patch, updated: Date.now() };
    await run("readwrite", (s) => s.put(next));
    set((s) => put(s.byWork, m.work, s.byWork[m.work].map((x) => (x.id === id ? next : x))));
  },
  async remove(id) {
    const m = find(get().byWork, id);
    await run("readwrite", (s) => s.delete(id));
    if (m) set((s) => put(s.byWork, m.work, s.byWork[m.work].filter((x) => x.id !== id)));
  },
}));
