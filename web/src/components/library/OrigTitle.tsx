import type { CatWork } from "@/lib/catalog";

const GREEK = /[Ͱ-Ͽἀ-῿]/;

/** Where an English title comes from, in words (for a tooltip or a line under a title). */
export function titleSource(w: CatWork): string | null {
  if (!w.orig) return null;
  const lang = GREEK.test(w.orig) ? "Greek" : "Latin";
  return w.titleFrom === "tr"
    ? `English title from the library's English translation; the collection's own title is ${lang}: ${w.orig}`
    : `English title translated by this site from the collection's ${lang} title: ${w.orig}`;
}

/**
 * The collection's own title (Latin or Greek), for a work shown under its English title. `full` adds where the
 * English comes from; otherwise that is the tooltip.
 */
export default function OrigTitle({ work, full = false, className }: { work: CatWork; full?: boolean; className?: string }) {
  if (!work.orig) return null;
  const greek = GREEK.test(work.orig);
  return (
    <span className={className} title={full ? undefined : titleSource(work) ?? undefined}>
      <i lang={greek ? "grc" : "la"}>{work.orig}</i>
      {full && <> · {work.titleFrom === "tr" ? "English title from the library's translation" : `title translated from the ${greek ? "Greek" : "Latin"}`}</>}
    </span>
  );
}
