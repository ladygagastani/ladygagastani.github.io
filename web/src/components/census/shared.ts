"use client";
import { useEffect, useState } from "react";

export interface EntryLink { slug: string; title: string }
/** Painted Stoa entries: by dictionary word (canonLemma), and by Pleiades place id. */
export interface Links { byName: Record<string, EntryLink[]>; byPlace: Record<string, EntryLink[]> }

/** A row as shown: the word, its count, and a line under it (meaning, English name or transliteration). */
export interface Shown { key: string; text: string; n: number; auto: boolean; sub: string | null }

export const fmt = (n: number) => n.toLocaleString("en-GB");

export type Load<T> = { state: "loading" } | { state: "done"; value: T } | { state: "error"; message: string };
const loading = { state: "loading" } as const;
export function useLoad<T>(key: string, fn: () => Promise<T>, enabled = true): Load<T> {
  const [v, setV] = useState<{ key: string; load: Load<T> }>({ key: "", load: loading });
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fn().then((value) => { if (live) setV({ key, load: { state: "done", value } }); }, (e: Error) => { if (live) setV({ key, load: { state: "error", message: e.message } }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return v.key === key ? v.load : loading;
}
