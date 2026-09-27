"use client";
/**
 * Names for notes on Painted Stoa entries ("melos#the-dialogue" → "The Melian Dialogue › The
 * dialogue"), for lists outside the wiki (the Treasury, the Oracle). The wiki is loaded only when
 * such a note exists, so those pages do not carry every entry otherwise.
 */
import { useEffect, useState } from "react";

export interface StoaTitles { entry: Map<string, string>; section: Map<string, string> }

let cache: Promise<StoaTitles> | null = null;
function load(): Promise<StoaTitles> {
  cache ??= Promise.all([import("./index"), import("./markup")]).then(([{ ENTRIES }, { blocks }]) => {
    const entry = new Map<string, string>(), section = new Map<string, string>();
    for (const e of ENTRIES) {
      entry.set(e.slug, e.title);
      section.set(`${e.slug}#top`, "Opening");
      for (const b of blocks(e.body)) if ("h2" in b) section.set(`${e.slug}#${b.id}`, b.h2);
    }
    return { entry, section };
  });
  return cache;
}

/** "Entry › Section" for a note's target, or the raw target until the names have loaded. */
export function stoaLabel(t: StoaTitles | null, target: string): string {
  const slug = target.split("#")[0];
  if (!t) return target;
  const e = t.entry.get(slug) ?? slug, s = t.section.get(target);
  return s && s !== "Opening" ? `${e} › ${s}` : e;
}

export function useStoaTitles(needed: boolean): StoaTitles | null {
  const [t, setT] = useState<StoaTitles | null>(null);
  useEffect(() => { if (needed) load().then(setT, () => undefined); }, [needed]);
  return t;
}
