"use client";
/**
 * Phones: the reader's controls along the bottom of the screen, in reach of the thumb (Phase 10).
 * Previous and next page, the contents (a drawer from the left edge: books or chapters, "go to",
 * and your marks), the reading aids, and "Aa" for the size and spacing of the text. The bar tucks
 * away with the header and the site's bar while reading on, or at a tap on the page; a thin line at
 * the top of the screen then shows how far through the book you are.
 * On wider screens the reader's sticky bar at the top does all this, and this renders nothing visible.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSettings, LIMITS } from "@/lib/settings";
import { useDragToClose } from "@/lib/use-drag-close";
import { holdBars } from "@/lib/header";
import styles from "./ReadBar.module.css";

export const PHONE = "(max-width: 760px)";
type Open = null | "contents" | "aids" | "size";

interface Props {
  title: string;
  author?: string;
  chunks: { label: string }[];
  chunk: number;
  go: (i: number) => void;
  /** the "go to a reference" form, and the reader's own marks (a list), both for the contents drawer;
      given the function that closes the drawer, for after they have gone somewhere */
  goto: (close: () => void) => ReactNode;
  marks: (close: () => void) => ReactNode;
  /** reading aids, columns, and anything else for the aids sheet */
  aids: ReactNode;
}

export default function ReadBar({ title, author, chunks, chunk, go: goTo, goto, marks, aids }: Props) {
  const [open, setOpen] = useState<Open>(null);
  // turning a page from the bar keeps the bar in hand
  const go = (i: number) => { holdBars(); goTo(i); };
  const toggle = (o: Open) => setOpen((cur) => (cur === o ? null : o));
  const close = () => setOpen(null);
  const prev = chunk > 0 ? chunks[chunk - 1].label : null;
  const next = chunk < chunks.length - 1 ? chunks[chunk + 1].label : null;
  const pick = (i: number) => { close(); go(i); };
  // the drawer's own links (go to, your marks) keep the bars too
  const leave = () => { close(); holdBars(); };

  return (
    <>
      <Progress chunk={chunk} of={chunks.length} />
      <div className={styles.bar} data-readbar="" role="toolbar" aria-label="Reading">
        <button type="button" className={styles.btn} onClick={() => go(chunk - 1)} disabled={!prev} aria-label={prev ? `Previous: ${prev}` : "Previous"}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <button type="button" className={`${styles.btn} ${styles.contents}`} data-sheet-toggle="" onClick={() => toggle("contents")} aria-expanded={open === "contents"} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11" /></svg>
          <span className={styles.where}><span className="visually-hidden">Contents: </span>{chunks[chunk]?.label}</span>
        </button>
        <button type="button" className={`${styles.btn} ${styles.word}`} data-sheet-toggle="" onClick={() => toggle("aids")} aria-expanded={open === "aids"} aria-controls="read-aids">
          Aids
        </button>
        <button type="button" className={`${styles.btn} ${styles.word}`} data-sheet-toggle="" onClick={() => toggle("size")} aria-expanded={open === "size"} aria-controls="read-size" aria-label="Text size and spacing">
          <span aria-hidden="true" className={styles.aa}>A<small>a</small></span>
        </button>
        <button type="button" className={styles.btn} onClick={() => go(chunk + 1)} disabled={!next} aria-label={next ? `Next: ${next}` : "Next"}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>

      <Contents open={open === "contents"} onClose={close} title={title} author={author}>
        {goto(leave)}
        <h3 className="label">{chunks.length > 1 ? "Parts of this text" : "This text"}</h3>
        <ol className={styles.parts}>
          {chunks.map((c, i) => (
            <li key={i}>
              <button type="button" aria-current={i === chunk ? "true" : undefined} onClick={() => pick(i)}>{c.label}</button>
            </li>
          ))}
        </ol>
        {marks(leave)}
      </Contents>

      <Sheet id="read-aids" label="Reading aids" open={open === "aids"} onClose={close}>{aids}</Sheet>
      <Sheet id="read-size" label="Text size and spacing" open={open === "size"} onClose={close}><SizeControls /></Sheet>
    </>
  );
}

/** The thin line at the top of the screen, shown while the bars are tucked away: how far through the book. */
function Progress({ chunk, of }: { chunk: number; of: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const inPage = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1;
        ref.current?.style.setProperty("--p", String((chunk + inPage) / Math.max(1, of)));
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, [chunk, of]);
  return <div ref={ref} className={styles.progress} aria-hidden="true" />;
}

/** A drawer from the left edge; swipe it back to the left, tap outside it, or press Close. */
function Contents({ open, onClose, title, author, children }: { open: boolean; onClose: () => void; title: string; author?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { handlers, reset } = useDragToClose({ el: () => ref.current, onClose, direction: "left", draggingClass: styles.dragging });
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      reset();
      d.showModal();
      d.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: "center" });
    }
    if (!open && d.open) d.close();
    // reset is the same function every time in effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <dialog ref={ref} className={styles.drawer} aria-labelledby="read-contents-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }} {...handlers}>
      <div className={styles.drawerIn}>
        <div className={styles.drawerHead}>
          <div>
            <h2 id="read-contents-title">{title}</h2>
            {author && <p className="label">{author}</p>}
          </div>
          <button type="button" className={styles.x} onClick={onClose} aria-label="Close the contents">×</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** A sheet along the bottom that leaves the text in view (for aids and text size, whose effect you want to see). */
function Sheet({ id, label, open, onClose, children }: { id: string; label: string; open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { handlers, reset } = useDragToClose({ el: () => ref.current, onClose, direction: "down", draggingClass: styles.dragging });
  useEffect(() => {
    if (!open) return;
    reset();
    const back = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    // a tap anywhere else puts it away (its own button in the bar toggles it instead)
    const outside = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!ref.current?.contains(t) && !t.closest?.("[data-sheet-toggle]")) onClose();
    };
    addEventListener("keydown", key);
    addEventListener("pointerdown", outside, true);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("pointerdown", outside, true);
      if (ref.current?.contains(document.activeElement)) back?.focus({ preventScroll: true });
    };
    // reset and onClose do the same thing every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <div ref={ref} id={id} className={styles.sheet} data-open={open || undefined} role="dialog" aria-label={label} tabIndex={-1} aria-hidden={!open} inert={!open}>
      <div className={styles.sheetHead} {...handlers}>
        <span className={styles.handle} aria-hidden="true" />
        <h2 className="label">{label}</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label={`Close ${label.toLowerCase()}`}>×</button>
      </div>
      <div className={styles.sheetBody}>{children}</div>
    </div>
  );
}

function SizeControls() {
  const greekSize = useSettings((s) => s.greekSize);
  const leading = useSettings((s) => s.leading);
  const set = useSettings((s) => s.set);
  const { min: sMin, max: sMax, step: sStep } = LIMITS.greekSize;
  const { min: lMin, max: lMax, step: lStep } = LIMITS.leading;
  return (
    <div className={styles.sizes}>
      <div className={styles.sizeRow}>
        <span>Greek text size</span>
        <div className={styles.stepper}>
          <button type="button" onClick={() => set({ greekSize: greekSize - sStep })} disabled={greekSize <= sMin} aria-label="Smaller Greek text">
            <span lang="grc" style={{ fontSize: "0.8em" }}>α</span>
          </button>
          <output aria-live="polite">{Math.round(greekSize * 16)} px</output>
          <button type="button" onClick={() => set({ greekSize: greekSize + sStep })} disabled={greekSize >= sMax} aria-label="Larger Greek text">
            <span lang="grc" style={{ fontSize: "1.3em" }}>α</span>
          </button>
        </div>
      </div>
      <div className={styles.sizeRow}>
        <span>Line spacing</span>
        <div className={styles.stepper}>
          <button type="button" onClick={() => set({ leading: Math.round((leading - lStep) * 10) / 10 })} disabled={leading <= lMin} aria-label="Closer lines">−</button>
          <output aria-live="polite">{leading.toFixed(1)}</output>
          <button type="button" onClick={() => set({ leading: Math.round((leading + lStep) * 10) / 10 })} disabled={leading >= lMax} aria-label="Wider lines">+</button>
        </div>
      </div>
      <p className={styles.hint}>You can also pinch the Greek with two fingers. The same settings are in Settings.</p>
    </div>
  );
}
