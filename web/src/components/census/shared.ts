"use client";

export interface EntryLink { slug: string; title: string }
/** Painted Stoa entries: by dictionary word (canonLemma), and by Pleiades place id. */
export interface Links { byName: Record<string, EntryLink[]>; byPlace: Record<string, EntryLink[]> }

/** A row as shown: the word, its count, and a line under it (meaning, English name or transliteration). */
export interface Shown { key: string; text: string; n: number; auto: boolean; sub: string | null }

export const fmt = (n: number) => n.toLocaleString("en-GB");

export { useLoad, type Load } from "@/lib/use-load";
