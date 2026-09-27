/**
 * The reader's own marks on the texts: bookmarks, favourite passages, notes and highlights, and
 * their notes on authors and on dictionary words (the Treasury).
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
  tags?: string[];       // the reader's own labels on a note
  collections?: string[];   // favourites: the anthologies it belongs to, by name
  created: number;
  updated: number;
}

/** A note on an author ("author:tlg0012") or on a dictionary word ("word:λόγος"). */
export interface PageNote { id: string; kind: "author" | "word"; target: string; text: string; tags?: string[]; created: number; updated: number }
export const pageNoteId = (kind: PageNote["kind"], target: string) => `${kind}:${kind === "word" ? target.normalize("NFC") : target}`;

const DB = "mathesis-user", STORE = "marks", NOTES = "notes";
let dbp: Promise<IDBDatabase> | null = null;
function db() {
  dbp ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 2);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: "id" }).createIndex("work", "work");
      if (!d.objectStoreNames.contains(NOTES)) d.createObjectStore(NOTES, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { dbp = null; reject(req.error); };
  });
  return dbp;
}
function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>, store = STORE): Promise<T> {
  return db().then((d) => new Promise<T>((resolve, reject) => {
    const r = fn(d.transaction(store, mode).objectStore(store));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}

export const allMarks = () => run<Mark[]>("readonly", (s) => s.getAll());
export const allPageNotes = () => run<PageNote[]>("readonly", (s) => s.getAll(), NOTES);

/** Write many records at once (restoring from an export). */
export function putAll(marks: Mark[], notes: PageNote[]): Promise<void> {
  return db().then((d) => new Promise<void>((resolve, reject) => {
    const tx = d.transaction([STORE, NOTES], "readwrite");
    for (const m of marks) tx.objectStore(STORE).put(m);
    for (const n of notes) tx.objectStore(NOTES).put(n);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}
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
  /** every work's marks at once (the Treasury) */
  loadAll: () => Promise<void>;
  allLoaded: boolean;
  add: (m: Omit<Mark, "id" | "created" | "updated">) => Promise<Mark>;
  update: (id: string, patch: Partial<Pick<Mark, "text" | "colour" | "tags" | "collections">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const put = (byWork: Record<string, Mark[]>, work: string, marks: Mark[]) => ({ byWork: { ...byWork, [work]: marks } });
const find = (byWork: Record<string, Mark[]>, id: string) => Object.values(byWork).flat().find((m) => m.id === id);

export const useMarks = create<MarksState>()((set, get) => ({
  byWork: {},
  error: null,
  allLoaded: false,
  async loadAll() {
    try {
      const byWork: Record<string, Mark[]> = {};
      for (const m of (await allMarks()).sort((a, b) => a.created - b.created)) (byWork[m.work] ??= []).push(m);
      set({ byWork, error: null, allLoaded: true });
    } catch {
      set({ error: "Your notes could not be opened in this browser." });
    }
  },
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
    set((s) => (s.byWork[m.work] || s.allLoaded ? put(s.byWork, m.work, [...(s.byWork[m.work] ?? []), mark]) : s));
    return mark;
  },
  async update(id, patch) {
    const m = find(get().byWork, id);
    if (!m) return;
    const next = { ...m, ...patch, updated: Date.now() };
    // show the change at once (a ticked box stays ticked), then store it; put it back if storing fails
    const swap = (to: Mark) => set((s) => put(s.byWork, m.work, s.byWork[m.work].map((x) => (x.id === id ? to : x))));
    swap(next);
    try { await run("readwrite", (s) => s.put(next)); } catch (e) { swap(m); set({ error: "That change could not be saved in this browser." }); throw e; }
  },
  async remove(id) {
    const m = find(get().byWork, id);
    await run("readwrite", (s) => s.delete(id));
    if (m) set((s) => put(s.byWork, m.work, s.byWork[m.work].filter((x) => x.id !== id)));
  },
}));

// ------------------------------------------------------------ notes on authors and words
interface PageNotesState {
  notes: Record<string, PageNote>;
  loaded: boolean;
  load: () => Promise<void>;
  /** Write a note; an empty text deletes it. */
  save: (kind: PageNote["kind"], target: string, text: string, tags?: string[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const usePageNotes = create<PageNotesState>()((set, get) => ({
  notes: {},
  loaded: false,
  async load() {
    try {
      const all = await allPageNotes();
      set({ notes: Object.fromEntries(all.map((n) => [n.id, n])), loaded: true });
    } catch {
      set({ loaded: true });
    }
  },
  async save(kind, target, text, tags) {
    const id = pageNoteId(kind, target);
    if (!text.trim() && !tags?.length) return get().remove(id);
    const now = Date.now();
    const old = get().notes[id];
    const note: PageNote = { id, kind, target: id.slice(kind.length + 1), text, tags: tags ?? old?.tags, created: old?.created ?? now, updated: now };
    await run("readwrite", (s) => s.put(note), NOTES);
    set((s) => ({ notes: { ...s.notes, [id]: note } }));
  },
  async remove(id) {
    await run("readwrite", (s) => s.delete(id), NOTES);
    set((s) => { const notes = { ...s.notes }; delete notes[id]; return { notes }; });
  },
}));
