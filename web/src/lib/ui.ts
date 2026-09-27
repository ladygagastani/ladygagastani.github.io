import { create } from "zustand";
import type { Point } from "./annotations";

/** A passage chosen as the first end of a cross-reference, waiting for the second. */
export interface PendingXref { pane: 1 | 2; work: string; ed: string; start: Point; end: Point; quote: string; label: string }

/**
 * Site-wide interface state that lives in the root layout and so survives page changes.
 * The floating reader (Phase 6) will keep its "what's open" state here too.
 */
interface UIStore {
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toast: { id: number; text: string } | null;
  showToast: (text: string) => void;

  // side-by-side reading
  activePane: 1 | 2;
  setActivePane: (p: 1 | 2) => void;
  syncScroll: boolean;
  setSyncScroll: (v: boolean) => void;
  scrollAnchor: { pane: 1 | 2; key: string } | null;
  setScrollAnchor: (a: { pane: 1 | 2; key: string }) => void;
  pendingXref: PendingXref | null;
  setPendingXref: (x: PendingXref | null) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUI = create<UIStore>()((set) => ({
  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  toast: null,
  showToast: (text) => {
    const id = Date.now();
    set({ toast: { id, text } });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : s)), 2800);
  },

  activePane: 1,
  setActivePane: (activePane) => set((s) => (s.activePane === activePane ? s : { activePane })),
  syncScroll: true,
  setSyncScroll: (syncScroll) => set({ syncScroll }),
  scrollAnchor: null,
  setScrollAnchor: (scrollAnchor) => set({ scrollAnchor }),
  pendingXref: null,
  setPendingXref: (pendingXref) => set({ pendingXref }),
}));
