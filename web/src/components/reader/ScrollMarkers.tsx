"use client";
/**
 * Markers beside the reader's scroll bar: where your notes, bookmarks, highlights, favourites and
 * cross-references are on this page, where you left off, and the current Echoes. Hover (or focus)
 * a marker for a preview; click it to go there. A legend switches each kind on and off.
 *
 * The track sits in a zero-height sticky strip at the top of the scrolling area (the page, or a
 * pane of its own), so it stays in view and lines up with that area's scroll bar.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MARKER_KINDS, useSettings, type MarkerKind } from "@/lib/settings";
import { headerHeight } from "@/lib/header";
import styles from "./Markers.module.css";

export interface MarkerItem { key: string; kind: MarkerKind; label: string; preview?: string; colour?: string }

export const MARKER_LABEL: Record<MarkerKind, string> = {
  note: "Notes", bookmark: "Bookmarks", highlight: "Highlights", favourite: "Favourites", xref: "Cross-references", left: "Where you left off", echo: "Echoes",
};

interface Placed extends MarkerItem { top: number; id: string }

export default function ScrollMarkers({ rootRef, contained, items, onJump, depKey }: {
  rootRef: React.RefObject<HTMLElement | null>;   // the reader's own root (its rows are found inside it)
  contained: boolean;              // true when the reader scrolls inside its own box (side by side, floating)
  items: MarkerItem[];
  onJump: (key: string) => void;
  depKey: string;                  // changes whenever the page's rows change
}) {
  const shown = useSettings((s) => s.markers);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [height, setHeight] = useState(0);
  const [tip, setTip] = useState<Placed | null>(null);
  const frame = useRef(0);

  const measure = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const scroller = contained ? root : document.documentElement;
      // page mode: the track starts below the site header (which slides away on scroll; see lib/header.ts)
      const offset = contained ? 0 : headerHeight();
      const viewH = contained ? root.clientHeight : innerHeight - offset;
      const total = scroller.scrollHeight - (contained ? 0 : offset);
      const base = contained ? root.getBoundingClientRect().top - root.scrollTop : -scrollY + offset;
      const out: Placed[] = [];
      for (const it of items) {
        const el = root.querySelector<HTMLElement>(`[data-key="${CSS.escape(it.key)}"]`);
        if (!el) continue;
        const y = el.getBoundingClientRect().top - base;
        out.push({ ...it, id: `${it.kind}:${it.key}:${it.label}`, top: Math.max(0, Math.min(1, y / Math.max(1, total))) * viewH });
      }
      setHeight(viewH);
      setPlaced(out);
    });
  }, [rootRef, contained, items]);

  useLayoutEffect(() => { measure(); }, [measure, depKey]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(measure);
    const article = root.querySelector("article");
    if (article) ro.observe(article);
    ro.observe(contained ? root : document.body);
    addEventListener("resize", measure);
    return () => { ro.disconnect(); removeEventListener("resize", measure); cancelAnimationFrame(frame.current); };
  }, [rootRef, contained, measure]);

  const visible = placed.filter((p) => shown.includes(p.kind));
  if (!visible.length) return null;
  return (
    <div className={styles.strip} style={{ top: contained ? 0 : "var(--hdr-vis)" }} aria-hidden={false}>
      <div className={styles.track} style={{ height }} role="list" aria-label="Markers on this page">
        {visible.map((p, i) => (
          <button key={p.id} type="button" role="listitem" className={styles.marker} data-kind={p.kind} data-colour={p.colour}
            style={{ top: p.top, "--i": i } as React.CSSProperties}
            aria-label={`${MARKER_LABEL[p.kind].replace(/s$/, "")} at ${p.label}${p.preview ? `: ${p.preview}` : ""}`}
            onMouseEnter={() => setTip(p)} onMouseLeave={() => setTip(null)} onFocus={() => setTip(p)} onBlur={() => setTip(null)}
            onClick={() => onJump(p.key)} />
        ))}
        {tip && (
          <div className={styles.tip} style={{ top: Math.min(Math.max(0, tip.top - 12), Math.max(0, height - 90)) }} role="tooltip">
            <span className="label">{MARKER_LABEL[tip.kind].replace(/s$/, "")} · {tip.label}</span>
            {tip.preview && <span className={styles.preview}>{tip.preview}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/** The legend: what each marker means, with a switch for each kind. */
export function MarkersLegend({ counts }: { counts: Partial<Record<MarkerKind, number>> }) {
  const shown = useSettings((s) => s.markers);
  const set = useSettings((s) => s.set);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, [open]);
  const toggle = (k: MarkerKind) => set({ markers: shown.includes(k) ? shown.filter((x) => x !== k) : MARKER_KINDS.filter((x) => x === k || shown.includes(x)) });
  return (
    <div className={styles.legendWrap} ref={box}
      onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); box.current?.querySelector("button")?.focus(); } }}>
      <button type="button" className={styles.legendBtn} aria-expanded={open} onClick={() => setOpen(!open)} title="What the marks beside the scroll bar mean">
        <span className={styles.legendIcon} aria-hidden="true" /> Markers
      </button>
      {open && (
        <div className={styles.legend} role="group" aria-label="Markers beside the scroll bar">
          <p className="label">Beside the scroll bar, on this page</p>
          {MARKER_KINDS.map((k) => (
            <label key={k}>
              <input type="checkbox" checked={shown.includes(k)} onChange={() => toggle(k)} />
              <span className={styles.sample} data-kind={k} aria-hidden="true" />
              <span>{MARKER_LABEL[k]}</span>
              <small>{counts[k] ?? 0}</small>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
