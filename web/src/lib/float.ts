/**
 * The floating reader: a small window holding the reader that follows the reader around the site.
 * What it shows is kept as the same query string the full reader uses (w=…&ed=…&at=…, and w2=…
 * for a second book), so floating and expanding back are exact. Its position, size and state are
 * remembered on this device (localStorage), so it comes back where it was after a reload.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export type Snap = "free" | "left" | "right" | "tl" | "tr" | "bl" | "br";
export interface Rect { x: number; y: number; w: number; h: number }

interface FloatState {
  open: boolean;
  qs: string;             // the reader's query string (without "?")
  history: string[];      // earlier query strings, for "← Back" after an Echoes jump
  at: string | null;      // the passage at the top of the window now (first book)
  rect: Rect | null;      // null: the default place, bottom right
  snap: Snap;
  minimized: boolean;
  float: (qs: string) => void;
  go: (qs: string, how?: "replace" | "push") => void;
  back: () => void;
  setAt: (at: string) => void;
  setRect: (r: Rect, snap?: Snap) => void;
  setMinimized: (v: boolean) => void;
  close: () => void;
}

const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

export const useFloat = create<FloatState>()(
  persist(
    (set) => ({
      open: false, qs: "", history: [], at: null, rect: null, snap: "br", minimized: false,
      float: (qs) => set({ open: true, qs, history: [], at: new URLSearchParams(qs).get("at"), minimized: false }),
      go: (qs, how = "replace") => set((s) => ({ qs, history: how === "push" ? [...s.history, s.qs].slice(-20) : s.history })),
      back: () => set((s) => (s.history.length ? { qs: s.history[s.history.length - 1], history: s.history.slice(0, -1) } : s)),
      setAt: (at) => set((s) => (s.at === at ? s : { at })),
      setRect: (rect, snap) => set((s) => ({ rect, snap: snap ?? s.snap })),
      setMinimized: (minimized) => set({ minimized }),
      close: () => set({ open: false, history: [] }),
    }),
    {
      name: "mathesis:float",
      storage: createJSONStorage(() => safe),
      partialize: ({ open, qs, at, rect, snap, minimized }) => ({ open, qs, at, rect, snap, minimized }),
      skipHydration: true,
    },
  ),
);

/** The full reader's address for what the window shows, at the passage now in view. */
export function expandHref(qs: string, at: string | null): string {
  const q = new URLSearchParams(qs);
  if (at) q.set("at", at);
  for (const k of ["hl", "find", "tu"]) q.delete(k);
  return `/read?${q}`;
}

const HEADER = 76, M = 12;

/** Where a window of this size sits when snapped, in a viewport of this size. */
export function snapRect(snap: Snap, r: Rect, vw: number, vh: number): Rect {
  const w = Math.min(r.w, vw - 2 * M), h = Math.min(r.h, vh - HEADER - M);
  switch (snap) {
    case "left": return { x: M, y: HEADER, w, h: vh - HEADER - M };
    case "right": return { x: vw - w - M, y: HEADER, w, h: vh - HEADER - M };
    case "tl": return { x: M, y: HEADER, w, h };
    case "tr": return { x: vw - w - M, y: HEADER, w, h };
    case "bl": return { x: M, y: vh - h - M, w, h };
    case "br": return { x: vw - w - M, y: vh - h - M, w, h };
    default: return clampRect(r, vw, vh);
  }
}

/** Keep a window on screen: at least its title bar stays reachable. */
export function clampRect(r: Rect, vw: number, vh: number): Rect {
  const w = Math.max(300, Math.min(r.w, vw - 2 * M)), h = Math.max(220, Math.min(r.h, vh - HEADER - M));
  return { w, h, x: Math.min(Math.max(M, r.x), vw - w - M), y: Math.min(Math.max(HEADER, r.y), vh - h - M) };
}

/** Which snap a drop at this pointer position asks for: near an edge docks, near a corner tucks in. */
export function snapFor(px: number, py: number, vw: number, vh: number, zone = 32): Snap {
  const left = px < zone, right = px > vw - zone, top = py < HEADER + zone, bottom = py > vh - zone;
  if (top && left) return "tl";
  if (top && right) return "tr";
  if (bottom && left) return "bl";
  if (bottom && right) return "br";
  if (left) return "left";
  if (right) return "right";
  return "free";
}

export const DEFAULT_SIZE = { w: 480, h: 580 };
