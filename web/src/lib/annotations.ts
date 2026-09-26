/**
 * The reader's own marks on the texts: bookmarks, favourite passages, notes and highlights.
 * Kept in IndexedDB on this device (sync across devices comes with accounts, Phase 8).
 *
 * A mark points at a stretch of Greek by passage reference and word position, so it survives
 * page changes and different translations: { u: "1.33", i: 4 } is the 5th Greek word of 1.33.
 */
import { create } from "zustand";

export type Kind = "bookmark" | "favourite" | "note" | "highlight";
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
  work: string | null;
  marks: Mark[];
  error: string | null;
  load: (work: string) => Promise<void>;
  add: (m: Omit<Mark, "id" | "created" | "updated">) => Promise<Mark>;
  update: (id: string, patch: Partial<Pick<Mark, "text" | "colour">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useMarks = create<MarksState>()((set, get) => ({
  work: null,
  marks: [],
  error: null,
  async load(work) {
    set({ work });
    try {
      const marks = await marksFor(work);
      if (get().work === work) set({ marks: marks.sort((a, b) => a.created - b.created), error: null });
    } catch {
      set({ marks: [], error: "Your notes could not be opened in this browser." });
    }
  },
  async add(m) {
    const now = Date.now();
    const mark: Mark = { ...m, id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`, created: now, updated: now };
    await run("readwrite", (s) => s.put(mark));
    if (get().work === m.work) set((s) => ({ marks: [...s.marks, mark] }));
    return mark;
  },
  async update(id, patch) {
    const m = get().marks.find((x) => x.id === id);
    if (!m) return;
    const next = { ...m, ...patch, updated: Date.now() };
    await run("readwrite", (s) => s.put(next));
    set((s) => ({ marks: s.marks.map((x) => (x.id === id ? next : x)) }));
  },
  async remove(id) {
    await run("readwrite", (s) => s.delete(id));
    set((s) => ({ marks: s.marks.filter((x) => x.id !== id) }));
  },
}));
