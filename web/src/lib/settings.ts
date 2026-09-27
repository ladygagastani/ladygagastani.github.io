import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export type ThemePref = "auto" | "light" | "dark";
export type MotionPref = "auto" | "reduce" | "full";
export type Columns = "both" | "greek" | "trans";

export interface Settings {
  theme: ThemePref;
  motion: MotionPref;
  greekSize: number;   // rem
  leading: number;     // unitless line height for reading text
  columns: Columns;    // reader: Greek and translation, or one of them
  translit: boolean;   // reader aid: transliteration under the Greek
  cases: boolean;      // reader aid: colour words by case
}

export const DEFAULTS: Settings = { theme: "auto", motion: "auto", greekSize: 1.25, leading: 1.75, columns: "both", translit: false, cases: false };
export const LIMITS = {
  greekSize: { min: 1, max: 2, step: 0.0625 },
  leading: { min: 1.4, max: 2.2, step: 0.1 },
};
export const STORAGE_KEY = "mathesis:settings";

interface SettingsStore extends Settings {
  set: (patch: Partial<Settings>) => void;
  reset: () => void;
}

/** localStorage can be missing or throw (private windows, blocked site data); never let that break the page. */
const safeStorage: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

const clamp = (v: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, v));

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (patch) => set((s) => ({
        ...patch,
        greekSize: clamp(patch.greekSize ?? s.greekSize, LIMITS.greekSize),
        leading: clamp(patch.leading ?? s.leading, LIMITS.leading),
      })),
      reset: () => set(DEFAULTS),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ theme, motion, greekSize, leading, columns, translit, cases }) => ({ theme, motion, greekSize, leading, columns, translit, cases }),
      skipHydration: true,
    },
  ),
);

/** Writes the settings onto <html>. Kept in one place so the no-flash boot script matches it. */
export function applySettings(s: Settings) {
  const el = document.documentElement;
  if (s.theme === "auto") el.removeAttribute("data-theme"); else el.setAttribute("data-theme", s.theme);
  if (s.motion === "auto") el.removeAttribute("data-motion"); else el.setAttribute("data-motion", s.motion);
  el.style.setProperty("--greek-size", `${s.greekSize}rem`);
  el.style.setProperty("--reading-leading", String(s.leading));
}

/** True when animation should be skipped: the user's setting wins, then the system setting. */
export function prefersReducedMotion(motion: MotionPref): boolean {
  if (motion === "reduce") return true;
  if (motion === "full") return false;
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs before first paint (inlined in <head>) so the saved theme never flashes.
 * Must mirror applySettings().
 */
export const BOOT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}").state||{};var e=document.documentElement;
if(s.theme==="light"||s.theme==="dark")e.setAttribute("data-theme",s.theme);
if(s.motion==="reduce"||s.motion==="full")e.setAttribute("data-motion",s.motion);
if(s.greekSize)e.style.setProperty("--greek-size",s.greekSize+"rem");
if(s.leading)e.style.setProperty("--reading-leading",String(s.leading));}catch(_){}})();`;
