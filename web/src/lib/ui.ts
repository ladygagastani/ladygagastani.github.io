import { create } from "zustand";

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
}));
