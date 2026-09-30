import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export type ThemePref = "auto" | "light" | "dark";
export type MotionPref = "auto" | "reduce" | "full";
export type Columns = "both" | "greek" | "trans";
export type Pronunciation = "attic" | "erasmian" | "modern";
/** The typeface of Greek text, and of English reading text. Headings keep the site's own (GFS Didot). */
export type GreekFace = "didot" | "gentium" | "sans";
export type TextFace = "serif" | "sans";
/** Kinds of marker beside the reader's scroll bar. */
export type MarkerKind = "note" | "bookmark" | "highlight" | "favourite" | "xref" | "left" | "echo";
export const MARKER_KINDS: MarkerKind[] = ["note", "bookmark", "highlight", "favourite", "xref", "left", "echo"];

export interface Settings {
  theme: ThemePref;
  motion: MotionPref;
  greekSize: number;   // rem
  leading: number;     // unitless line height for reading text
  columns: Columns;    // reader: Greek and translation, or one of them
  translit: boolean;   // reader aid: transliteration under the Greek
  cases: boolean;      // reader aid: colour words by case
  metre: boolean;      // reader aid: show the scansion of verse
  tryFirst: boolean;   // reader aid: each translation stays hidden until tapped, so the Greek is read first
  fitLines: boolean;   // reader aid: verse lines shrink to fit the width instead of wrapping
  vibrate: boolean;    // phones: a short vibration on a save, a bookmark, a right answer (lib/haptics.ts)
  pron: Pronunciation; // pronunciation system shown in the Academy
  markers: MarkerKind[];   // reader: which kinds of marker to show beside the scroll bar
  greekFace: GreekFace;
  textFace: TextFace;
}

export const DEFAULTS: Settings = { theme: "auto", motion: "auto", greekSize: 1.25, leading: 1.75, columns: "both", translit: false, cases: false, metre: false, tryFirst: false, fitLines: false, vibrate: true, pron: "attic", markers: MARKER_KINDS, greekFace: "didot", textFace: "serif" };
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
      partialize: ({ theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace }) => ({ theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace }),
      skipHydration: true,
    },
  ),
);

/**
 * The colour of the browser's own bar on phones (and of an installed app's title bar): the page colour of each theme.
 * layout.tsx gives one per system theme; a theme chosen in Settings adds a first <meta> that wins over both.
 */
export const THEME_COLOURS = { light: "#E6C39B", dark: "#16110E" } as const;
const THEME_META = "theme-colour";

/** Writes the settings onto <html>. Kept in one place so the no-flash boot script matches it. */
export function applySettings(s: Settings) {
  const el = document.documentElement;
  if (s.theme === "auto") el.removeAttribute("data-theme"); else el.setAttribute("data-theme", s.theme);
  let meta = document.getElementById(THEME_META) as HTMLMetaElement | null;
  if (s.theme === "auto") meta?.remove();
  else {
    if (!meta) { meta = document.createElement("meta"); meta.id = THEME_META; meta.name = "theme-color"; document.head.prepend(meta); }
    meta.content = THEME_COLOURS[s.theme];
  }
  if (s.motion === "auto") el.removeAttribute("data-motion"); else el.setAttribute("data-motion", s.motion);
  el.style.setProperty("--greek-size", `${s.greekSize}rem`);
  el.style.setProperty("--reading-leading", String(s.leading));
  if (s.greekFace === "didot") el.removeAttribute("data-greek-face"); else el.setAttribute("data-greek-face", s.greekFace);
  if (s.textFace === "serif") el.removeAttribute("data-text-face"); else el.setAttribute("data-text-face", s.textFace);
}

/** True when animation should be skipped: the user's setting wins, then the system setting. */
export function prefersReducedMotion(motion: MotionPref): boolean {
  if (motion === "reduce") return true;
  if (motion === "full") return false;
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "smooth" unless animation is reduced (the site's setting, then the device's): for scrollTo, scrollBy and scrollIntoView. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth");

/**
 * Runs before first paint (inlined in <head>) so the saved theme never flashes.
 * Must mirror applySettings().
 */
export const BOOT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}").state||{};var e=document.documentElement;
if(s.theme==="light"||s.theme==="dark"){e.setAttribute("data-theme",s.theme);var m=document.createElement("meta");m.id=${JSON.stringify(THEME_META)};m.name="theme-color";m.content=${JSON.stringify(THEME_COLOURS)}[s.theme];document.head.prepend(m);}
if(s.motion==="reduce"||s.motion==="full")e.setAttribute("data-motion",s.motion);
if(s.greekSize)e.style.setProperty("--greek-size",s.greekSize+"rem");
if(s.leading)e.style.setProperty("--reading-leading",String(s.leading));
if(s.greekFace==="gentium"||s.greekFace==="sans")e.setAttribute("data-greek-face",s.greekFace);
if(s.textFace==="sans")e.setAttribute("data-text-face","sans");}catch(_){}
try{var f=JSON.parse(localStorage.getItem("mathesis:folds")||"[]");if(f.length)document.documentElement.setAttribute("data-folds",f.join(" "));}catch(_){}})();`;
