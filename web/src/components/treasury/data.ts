"use client";
/** Everything the Treasury shows, loaded once: the catalogue, every mark, notes on authors and words, the deck. */
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { useMarks, usePageNotes, type Mark } from "@/lib/annotations";
import { useAcademy } from "@/lib/academy";
import { allPositions, type Position } from "@/lib/position";

export function useTreasury() {
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  // the Treasury renders only in the browser (it reads the address), so storage can be read at once
  const [positions, setPositions] = useState<Record<string, Position>>(() => (typeof window === "undefined" ? {} : allPositions()));
  const byWork = useMarks((s) => s.byWork);
  const allLoaded = useMarks((s) => s.allLoaded);
  const error = useMarks((s) => s.error);
  const pageNotes = usePageNotes((s) => s.notes);
  const notesLoaded = usePageNotes((s) => s.loaded);
  const deck = useAcademy((s) => s.deck);

  useEffect(() => {
    loadCatalog().then(setIdx, () => setIdx(null));
    useMarks.getState().loadAll();
    usePageNotes.getState().load();
    useAcademy.persist.rehydrate();
  }, []);

  const marks = useMemo(() => Object.values(byWork).flat(), [byWork]);
  return { idx, marks, pageNotes, deck, positions, setPositions, ready: allLoaded && notesLoaded, error };
}

export type TreasuryState = ReturnType<typeof useTreasury>;

export function workName(idx: CatalogIndex | null, work: string) {
  const w = idx?.work.get(work), a = idx?.authorOf.get(work);
  return { title: w?.title ?? work, author: a?.name ?? "", authorId: a?.id ?? null };
}

export const readHref = (m: Pick<Mark, "work" | "ed" | "start">) => `/read?w=${m.work}&ed=${m.ed}&at=${encodeURIComponent(m.start.u)}`;
export const wordHref = (lemma: string) => `/treasury/word?l=${encodeURIComponent(lemma.normalize("NFC"))}`;

/** Group marks by work, works in catalogue order (author, then title). */
export function byWorkSorted(idx: CatalogIndex | null, marks: Mark[]): [string, Mark[]][] {
  const g = new Map<string, Mark[]>();
  for (const m of marks) g.set(m.work, [...(g.get(m.work) ?? []), m]);
  const key = (w: string) => { const n = workName(idx, w); return `${n.author} ${n.title}`; };
  return [...g].sort((a, b) => key(a[0]).localeCompare(key(b[0])));
}

export function ago(t: number, now = Date.now()): string {
  const d = Math.floor((now - t) / 864e5);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 14) return `${d} days ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-GB")} ${n === 1 ? one : many}`;
