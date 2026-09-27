"use client";
/**
 * The floating reader: the reader in a small window that stays open while you move around the site
 * (it lives in the root layout, so changing page never resets it). Drag it by its title bar, resize
 * it from its edges, drop it near an edge or corner to snap it there, minimise it to a tab that
 * shows the book and passage, or expand it back into the full reader at the same passage.
 * Keyboard: with the title bar focused, arrows move it and Shift+arrows resize it.
 */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { useFloat, expandHref, snapRect, clampRect, snapFor, DEFAULT_SIZE, type Rect, type Snap } from "@/lib/float";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import { ReaderBooks, ReaderNavContext, type ReaderNav } from "./Reader";
import styles from "./Float.module.css";

type Drag = { kind: "move" | "resize"; edge: string; px: number; py: number; start: Rect };

export default function FloatingReader() {
  const f = useFloat();
  const router = useRouter();
  const motion = useSettings((s) => s.motion);
  const [hydrated, setHydrated] = useState(false);
  const [vw, setVw] = useState(0), [vh, setVh] = useState(0);
  const [live, setLive] = useState<Rect | null>(null);        // the rectangle while dragging
  const [preview, setPreview] = useState<Snap>("free");       // where a drop would snap
  const [closing, setClosing] = useState(false);
  const drag = useRef<Drag | null>(null);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);

  useEffect(() => {
    Promise.resolve(useFloat.persist.rehydrate()).then(() => setHydrated(true));
    const size = () => { setVw(innerWidth); setVh(innerHeight); };
    size();
    addEventListener("resize", size);
    return () => removeEventListener("resize", size);
  }, []);
  useEffect(() => { if (f.open && !idx) loadCatalog().then(setIdx, () => undefined); }, [f.open, idx]);

  const params = useMemo(() => new URLSearchParams(f.qs), [f.qs]);
  const nav = useMemo<ReaderNav>(() => ({
    params,
    go: (q, how) => useFloat.getState().go(q.toString(), how),
    floating: true,
    onPosition: (at) => useFloat.getState().setAt(at),
  }), [params]);

  const base: Rect = f.rect ?? { x: 0, y: 0, ...DEFAULT_SIZE };
  const rect = live ?? (vw ? snapRect(f.snap, base, vw, vh) : null);
  const work = idx?.work.get(params.get("w") ?? "");
  const author = idx?.authorOf.get(params.get("w") ?? "");
  const second = idx?.work.get(params.get("w2") ?? "");
  const title = work ? `${work.title}${second ? ` + ${second.title}` : ""}` : "Reader";
  const where = f.at ?? params.get("at") ?? "";

  // ------------------------------------------------------------ dragging and resizing
  const begin = (e: React.PointerEvent, kind: Drag["kind"], edge = "") => {
    if (e.button !== 0 || !rect) return;
    if ((e.target as HTMLElement).closest("button") && kind === "move") return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { kind, edge, px: e.clientX, py: e.clientY, start: rect };
    setLive(rect);
  };
  const moveTo = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    if (d.kind === "move") {
      setLive({ ...d.start, x: d.start.x + dx, y: d.start.y + dy });
      setPreview(snapFor(e.clientX, e.clientY, vw, vh));
    } else {
      let { x, y, w, h } = d.start;
      if (d.edge.includes("e")) w += dx;
      if (d.edge.includes("s")) h += dy;
      if (d.edge.includes("w")) { w -= dx; x += dx; }
      if (d.edge.includes("n")) { h -= dy; y += dy; }
      if (w < 300) { if (d.edge.includes("w")) x -= 300 - w; w = 300; }
      if (h < 220) { if (d.edge.includes("n")) y -= 220 - h; h = 220; }
      setLive({ x, y, w, h });
    }
  };
  const end = () => {
    const d = drag.current;
    if (!d || !live) { drag.current = null; return; }
    drag.current = null;
    const snap = d.kind === "move" ? preview : "free";
    const r = clampRect(live, vw, vh);
    f.setRect(r, snap);
    setLive(null);
    setPreview("free");
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!rect || !e.key.startsWith("Arrow")) return;
    e.preventDefault();
    const step = e.altKey ? 4 : 24;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key as "ArrowLeft"]!;
    const r = e.shiftKey ? { ...rect, w: rect.w + d[0], h: rect.h + d[1] } : { ...rect, x: rect.x + d[0], y: rect.y + d[1] };
    f.setRect(clampRect(r, vw, vh), "free");
  };

  // ------------------------------------------------------------ open, close, expand
  const close = () => {
    if (prefersReducedMotion(motion)) { f.close(); return; }
    setClosing(true);
    setTimeout(() => { setClosing(false); useFloat.getState().close(); }, 220);
  };
  const expand = () => {
    const href = expandHref(f.qs, f.at);
    useFloat.getState().close();
    router.push(href);
  };

  if (!hydrated || !f.open || !rect) return null;

  if (f.minimized) {
    return (
      <div className={styles.tab} data-float-tab="" data-snap={f.snap}>
        <button type="button" className={styles.tabMain} onClick={() => f.setMinimized(false)} title="Show the floating reader again">
          <span className={styles.tabIcon} aria-hidden="true" />
          <span className={styles.tabText}><b>{title}</b>{where && <small>{where}</small>}</span>
        </button>
        <button type="button" className={styles.tabBtn} onClick={expand} aria-label="Open in the full reader" title="Open in the full reader">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg>
        </button>
        <button type="button" className={styles.tabBtn} onClick={close} aria-label="Close the floating reader" title="Close">×</button>
      </div>
    );
  }

  const ghost = live && preview !== "free" ? snapRect(preview, live, vw, vh) : null;
  return (
    <>
      {ghost && <div className={styles.ghost} style={{ left: ghost.x, top: ghost.y, width: ghost.w, height: ghost.h }} aria-hidden="true" />}
      <section className={`${styles.win} ${live ? styles.dragging : ""} ${closing ? styles.closing : ""}`} data-float-window="" data-snap={f.snap}
        style={{ transform: `translate(${rect.x}px, ${rect.y}px)`, width: rect.w, height: rect.h }}
        aria-label={`Floating reader: ${title}`} role="dialog" aria-modal="false">
        <header className={styles.bar} onPointerDown={(e) => begin(e, "move")} onPointerMove={moveTo} onPointerUp={end} onPointerCancel={end}
          onDoubleClick={expand} tabIndex={0} onKeyDown={onKey}
          title="Drag to move; drop near an edge or corner to snap. Arrows move it, Shift+arrows resize it. Double-click to open the full reader.">
          <span className={styles.grip} aria-hidden="true" />
          <span className={styles.title}>
            <b>{title}</b>
            <small>{[author?.name, where].filter(Boolean).join(" · ")}</small>
          </span>
          {f.history.length > 0 && <button type="button" className={styles.btn} onClick={() => f.back()} aria-label="Back" title="Back to the passage before">←</button>}
          <button type="button" className={styles.btn} onClick={() => f.setMinimized(true)} aria-label="Minimise" title="Minimise to a tab">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18h14" /></svg>
          </button>
          <button type="button" className={styles.btn} onClick={expand} aria-label="Open in the full reader" title="Open in the full reader, at this passage">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg>
          </button>
          <button type="button" className={styles.btn} onClick={close} aria-label="Close the floating reader" title="Close">×</button>
        </header>
        <div className={styles.body}>
          <ReaderNavContext.Provider value={nav}>
            <ReaderBooks />
          </ReaderNavContext.Provider>
        </div>
        {["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((edge) => (
          <span key={edge} className={styles.edge} data-edge={edge} aria-hidden="true"
            onPointerDown={(e) => begin(e, "resize", edge)} onPointerMove={moveTo} onPointerUp={end} onPointerCancel={end} />
        ))}
      </section>
    </>
  );
}
