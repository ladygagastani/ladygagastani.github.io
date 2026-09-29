"use client";

import { useEffect, useRef } from "react";
import type { Colour } from "@/lib/annotations";
import { useQuickGloss, type WordContext } from "./WordPanel";
import styles from "./Reader.module.css";

const PHONE = "(max-width: 760px)";

export interface Selection {
  start: { u: string; i: number };
  end: { u: string; i: number };
  quote: string;               // the Greek words selected
  rowKeys: string[];           // rows the selection touches
  rect: { left: number; top: number; bottom: number };
}

const COLOURS: [Colour, string][] = [["red", "Red"], ["ochre", "Ochre"], ["blue", "Blue"], ["green", "Green"]];

/**
 * Floating toolbar for a selected passage. On phones it docks along the bottom of the screen instead
 * (the phone's own Copy and Share menu sits by the words), with finger-sized buttons; when one word is
 * selected (press and hold it) it starts with the word's dictionary form and one-line meaning.
 */
export default function PassageToolbar({ sel, onAction, onClose, xref = null, word = null, onLookUp }: {
  sel: Selection;
  onAction: (a: "bookmark" | "favourite" | "note" | "share" | "xref" | "xref-here" | "echoes" | "ask" | { highlight: Colour }) => void;
  onClose: () => void;
  xref?: "start" | "here" | null;   // side-by-side only: begin a cross-reference, or finish one here
  /** the one word selected, for its quick meaning (phones) */
  word?: { w: string; ctx: WordContext | null } | null;
  onLookUp?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quick = useQuickGloss(word?.w ?? null, word?.ctx ?? null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia(PHONE).matches && !el.parentElement?.closest("[data-float-window]")) {
      // placed along the bottom by the CSS: move the page if the words would be hidden behind it
      el.style.opacity = "1";
      const cover = el.getBoundingClientRect().top - 16;
      if (sel.rect.bottom > cover) scrollBy({ top: sel.rect.bottom - cover, behavior: "smooth" });
      return;
    }
    const w = el.offsetWidth, h = el.offsetHeight;
    // inside the floating window, "fixed" is measured from the window, not the screen
    const box = el.parentElement?.closest("[data-float-window]")?.getBoundingClientRect();
    const ox = box?.left ?? 0, oy = box?.top ?? 0, width = box?.width ?? innerWidth, minTop = box ? 50 : 70;
    const left = Math.min(Math.max(12, sel.rect.left - ox), width - w - 12);
    const top = sel.rect.top - oy - h - 10 > minTop ? sel.rect.top - oy - h - 10 : sel.rect.bottom - oy + 10;
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
      {word && (
        <div className={styles.quickRow}>
          <p><b lang="grc">{quick.lemma ?? word.w}</b> {quick.done ? (quick.gloss || <span className={styles.quickNone}>no short definition</span>) : "…"}</p>
          {onLookUp && <button type="button" onClick={onLookUp}>More</button>}
        </div>
      )}
      <button type="button" className={styles.tbClose} onClick={onClose} aria-label="Close passage actions">×</button>
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
      <button type="button" onClick={() => onAction("echoes")} title="Where these words recur, in this book and beyond">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h2M9 7v10M13 4v16M17 8v8M21 11v2" /></svg><span>Echoes</span>
      </button>
      <button type="button" onClick={() => onAction("ask")} title="Ask the Town Hall about this passage">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4zM12 13v.01M12 7.5a2 2 0 0 1 1 3.7c-.6.3-1 .8-1 1.3" /></svg><span>Ask in the forum</span>
      </button>
    </div>
  );
}
