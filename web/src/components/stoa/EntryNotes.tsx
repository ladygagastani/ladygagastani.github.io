"use client";
/**
 * The reader's own notes on a Painted Stoa entry, one per section (and one on the opening), saved in
 * this browser with their other notes (the Treasury). Beside the scroll bar, markers show where the
 * notes are and where you left off last time; hover for a preview, click to go there.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePageNotes } from "@/lib/annotations";
import { savedScroll } from "@/lib/resume";
import { PageNoteEditor } from "@/components/treasury/AuthorsSection";
import ScrollMarkers, { MarkersLegend, type MarkerItem } from "@/components/reader/ScrollMarkers";
import styles from "./Stoa.module.css";

const useNotesLoaded = () => {
  const loaded = usePageNotes((s) => s.loaded);
  useEffect(() => { if (!loaded) usePageNotes.getState().load(); }, [loaded]);
};

/** Under a section heading: a note button, or the note itself once written. */
export function SectionNote({ slug, section, title }: { slug: string; section: string; title: string }) {
  useNotesLoaded();
  const note = usePageNotes((s) => s.notes[`stoa:${slug}#${section}`]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // opened by a click: put the cursor in the note straight away
  useEffect(() => { if (open) box.current?.querySelector("textarea")?.focus(); }, [open]);
  if (!note && !open) {
    return (
      <button type="button" className={`chip ${styles.noteBtn}`} onClick={() => setOpen(true)} aria-label={`Write a note on “${title}”`}>
        ✎ Note
      </button>
    );
  }
  return (
    <div className={styles.sectionNote} ref={box}>
      <PageNoteEditor kind="stoa" target={`${slug}#${section}`} label={`Your note on “${title}”`} startOpen={!note} />
    </div>
  );
}

/** Markers beside the scroll bar for this entry's notes and for where you left off. */
export function EntryMarkers({ slug, heads }: { slug: string; heads: { id: string; text: string }[] }) {
  useNotesLoaded();
  const notes = usePageNotes((s) => s.notes);
  const path = usePathname();
  // a hidden anchor inside the entry's <article>, whose parent is the area the markers map
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const el = anchor?.closest<HTMLElement>("article") ?? null;
  const root = useMemo(() => ({ current: el }), [el]);
  // the section heading nearest above where this page was last scrolled to (read once the page is on screen)
  const left = useMemo(() => {
    if (!el) return null;
    const y = savedScroll(path);
    if (y == null || y < 400) return null;
    let at: string | null = null;
    for (const h of el.querySelectorAll<HTMLElement>("[data-key]")) if (h.getBoundingClientRect().top + scrollY <= y + 120) at = h.dataset.key!;
    return at;
  }, [el, path]);

  const items = useMemo<MarkerItem[]>(() => {
    const out: MarkerItem[] = [];
    for (const h of [{ id: "top", text: "Opening" }, ...heads]) {
      const n = notes[`stoa:${slug}#${h.id}`];
      if (n?.text) out.push({ key: h.id, kind: "note", label: h.text, preview: n.text.length > 160 ? n.text.slice(0, 160) + "…" : n.text });
    }
    if (left) out.push({ key: left, kind: "left", label: heads.find((h) => h.id === left)?.text ?? "Opening" });
    return out;
  }, [notes, slug, heads, left]);

  const jump = (key: string) => document.querySelector(`[data-key="${CSS.escape(key)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <>
      <span ref={setAnchor} hidden />
      {el && <ScrollMarkers rootRef={root} contained={false} items={items} onJump={jump} depKey={`${items.length}|${left}`} />}
      {items.length > 0 && (
        <div className={styles.markersKey}>
          <MarkersLegend counts={{ note: items.filter((i) => i.kind === "note").length, left: left ? 1 : 0 }} />
        </div>
      )}
    </>
  );
}
