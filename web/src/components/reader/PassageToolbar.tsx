"use client";

import { useEffect, useRef } from "react";
import type { Colour } from "@/lib/annotations";
import styles from "./Reader.module.css";

export interface Selection {
  start: { u: string; i: number };
  end: { u: string; i: number };
  quote: string;               // the Greek words selected
  rowKeys: string[];           // rows the selection touches
  rect: { left: number; top: number; bottom: number };
}

const COLOURS: [Colour, string][] = [["red", "Red"], ["ochre", "Ochre"], ["blue", "Blue"], ["green", "Green"]];

/** Floating toolbar for a selected passage. */
export default function PassageToolbar({ sel, onAction, onClose, xref = null }: {
  sel: Selection;
  onAction: (a: "bookmark" | "favourite" | "note" | "share" | "xref" | "xref-here" | { highlight: Colour }) => void;
  onClose: () => void;
  xref?: "start" | "here" | null;   // side-by-side only: begin a cross-reference, or finish one here
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    const left = Math.min(Math.max(12, sel.rect.left), innerWidth - w - 12);
    const top = sel.rect.top - h - 10 > 70 ? sel.rect.top - h - 10 : sel.rect.bottom + 10;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.opacity = "1";
  }, [sel]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div ref={ref} className={styles.toolbar} role="toolbar" aria-label="Passage actions" onMouseDown={(e) => e.preventDefault()}>
      <button type="button" onClick={() => onAction("bookmark")} title="Bookmark this place">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg><span>Bookmark</span>
      </button>
      <button type="button" onClick={() => onAction("favourite")} title="Add to your favourite passages">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg><span>Favourite</span>
      </button>
      <button type="button" onClick={() => onAction("note")} title="Write a note on this passage">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H8l-4 4z" /></svg><span>Note</span>
      </button>
      <span className={styles.swatches} role="group" aria-label="Highlight">
        {COLOURS.map(([c, name]) => (
          <button key={c} type="button" className={styles[`sw-${c}`]} onClick={() => onAction({ highlight: c })} title={`Highlight in ${name.toLowerCase()}`} aria-label={`Highlight in ${name.toLowerCase()}`} />
        ))}
      </span>
      <button type="button" onClick={() => onAction("share")} title="Share this passage">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h8M14 8l4 4-4 4M4 4v16" /></svg><span>Share</span>
      </button>
      {xref === "start" && <button type="button" onClick={() => onAction("xref")} title="Link this passage to one in the other book"><span>Cross-reference</span></button>}
      {xref === "here" && <button type="button" className={styles.linkHere} onClick={() => onAction("xref-here")} title="Finish the cross-reference with this passage"><span>Link here</span></button>}
      <button type="button" disabled title="Echoes arrive in Phase 4"><span>Echoes</span></button>
      <button type="button" disabled title="The forum arrives in Phase 8"><span>Ask in the forum</span></button>
    </div>
  );
}
