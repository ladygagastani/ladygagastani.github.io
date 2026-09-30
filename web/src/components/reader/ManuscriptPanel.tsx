"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type OpenSeadragon from "openseadragon";
import { lineIn, pagesOf, witnessesOf, type Witness } from "@/data/manuscripts";
import { stageWord, unitLines, type Stage } from "@/lib/scripts";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import type { Unit } from "@/lib/tei/types";
import styles from "./Manuscript.module.css";
import rs from "./Reader.module.css";

const MAX_WORDS = 90;

/** What each step shows, and where the facts come from. */
const STAGES: { label: string; say: React.ReactNode }[] = [
  { label: "Printed today", say: <>The edition&apos;s Greek as modern books print it, with spaces, punctuation, accents and breathings.</> },
  { label: "No accents", say: <>Accents and breathings were introduced by Aristophanes of Byzantium in the third century BC. They turn up only now and then in papyri from the second century AD, and became standard in the Middle Ages.<Src n={1} /></> },
  { label: "Capitals", say: <>Books were written in capital letters until minuscule, a smaller, joined-up hand, replaced them in the ninth and tenth centuries.<Src n={2} /> Sigma is the C-shaped Ϲ, the usual form from late antiquity on.<Src n={3} /> The mute iota is written beside its vowel (ΩΙ): the iota under the letter (ῳ) was invented by Byzantine scholars in the twelfth century.<Src n={4} /></> },
  { label: "No spaces", say: <>And no spaces: Greek was written as one continuous run of letters, <i>scriptio continua</i>, and the oldest books in capitals do not separate words.<Src n={5} /><Src n={6} sep /></> },
];
const SOURCES = [
  { label: "Wikipedia, Greek diacritics", url: "https://en.wikipedia.org/wiki/Greek_diacritics" },
  { label: "Wikipedia, Greek minuscule", url: "https://en.wikipedia.org/wiki/Greek_minuscule" },
  { label: "Wikipedia, Sigma (the lunate form)", url: "https://en.wikipedia.org/wiki/Sigma" },
  { label: "Wikipedia, Iota subscript", url: "https://en.wikipedia.org/wiki/Iota_subscript" },
  { label: "Wikipedia, Space (punctuation): scriptio continua", url: "https://en.wikipedia.org/wiki/Space_(punctuation)" },
  { label: "Wikipedia, Uncial script", url: "https://en.wikipedia.org/wiki/Uncial_script" },
];
function Src({ n, sep }: { n: number; sep?: boolean }) {
  return <sup className={styles.src}>{sep ? "," : ""}<a href={SOURCES[n - 1].url} target="_blank" rel="noreferrer" title={SOURCES[n - 1].label}>{n}</a></sup>;
}

/**
 * The passage at the top of the screen as a scribe would have written it, in four steps, and the
 * page of a real manuscript of the work: photographs shown from the library's own image server.
 */
export default function ManuscriptPanel({ work, units, label, book, onClose }: {
  work: string; units: Unit[]; label: string; book: string | null; onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  const witnesses = witnessesOf(work);

  return (
    <aside ref={ref} className={rs.panel} aria-label="The manuscript" tabIndex={-1} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={rs.panelHead}>
        <h2 className={styles.title}>How it was written</h2>
        <button type="button" className={rs.x} onClick={onClose} aria-label="Close the manuscript panel">×</button>
      </div>
      <Stages units={units} label={label} />
      {witnesses.map((w) => <Photos key={w.id} w={w} work={work} line={units[0]?.ref.join(".") ?? null} book={book} />)}
      {!witnesses.length && (
        <p className={rs.fine}>No photographed manuscript of this work is linked here yet. So far: the Iliad (Venetus A), the plays of Aeschylus and Sophocles and the <i>Argonautica</i> (the Medicean manuscript in Florence), and Plato&apos;s <i>Republic</i>, <i>Laws</i> and their companions (Paris, grec 1807).</p>
      )}
      <details className={styles.sources}>
        <summary>Where these facts come from</summary>
        <ol>{SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ol>
      </details>
    </aside>
  );
}

/** The passage taken back towards the way it was first written, one step at a time. */
function Stages({ units, label }: { units: Unit[]; label: string }) {
  const [stage, setStage] = useState<Stage>(0);
  const [playing, setPlaying] = useState(false);
  const motion = useSettings((s) => s.motion);

  // the passage's words, line by line, capped so a long section stays readable
  const lines = useMemo(() => {
    const out: string[][] = [];
    let n = 0;
    for (const u of units) for (const l of unitLines(u)) {
      if (n >= MAX_WORDS) break;
      const ws = l.split(" ").slice(0, MAX_WORDS - n);
      n += ws.length;
      out.push(ws);
    }
    return out;
  }, [units]);
  const cut = units.reduce((a, u) => a + unitLines(u).join(" ").split(" ").length, 0) > MAX_WORDS;

  /** Change step; with the View Transitions API each word glides to its new place and shape. */
  const go = (s: Stage) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!doc.startViewTransition || prefersReducedMotion(motion)) { setStage(s); return Promise.resolve(); }
    document.documentElement.classList.add("ms-morph");
    return doc.startViewTransition(() => flushSync(() => setStage(s))).finished.catch(() => undefined)
      .finally(() => document.documentElement.classList.remove("ms-morph"));
  };
  const play = async () => {
    setPlaying(true);
    for (const s of [0, 1, 2, 3] as Stage[]) {
      await go(s);
      await new Promise((r) => setTimeout(r, s === 3 ? 0 : 1100));
    }
    setPlaying(false);
  };

  let i = 0;
  return (
    <section className={styles.stages} aria-label="The passage as it was written">
      <p className={styles.passage}><span className="label">{label}</span></p>
      <div className={`segmented ${styles.steps}`} role="radiogroup" aria-label="Step">
        {STAGES.map((st, n) => (
          <button key={st.label} type="button" role="radio" aria-checked={stage === n} disabled={playing} onClick={() => go(n as Stage)}>{st.label}</button>
        ))}
      </div>
      <div className={styles.page} data-stage={stage} lang="grc">
        {lines.map((ws, l) => (
          <p key={l}>
            {ws.map((w, j) => {
              const k = i++;
              const t = stageWord(w, stage);
              // real spaces (for screen readers and copying), gone at the last step
              return t ? <Fragment key={k}>{j > 0 && stage < 3 ? " " : ""}<span className={styles.w} style={{ viewTransitionName: `msw-${k}` } as React.CSSProperties}>{t}</span></Fragment> : null;
            })}
          </p>
        ))}
        {cut && <p className={styles.more} aria-hidden="true">…</p>}
      </div>
      <p className={styles.say}>{STAGES[stage].say}</p>
      <button type="button" className="btn small" onClick={play} disabled={playing}>{playing ? "Watching…" : "▸ Watch it change"}</button>
    </section>
  );
}

type Viewer = OpenSeadragon.Viewer;

/** A page of a real manuscript, in a deep-zoom viewer, at the passage (Iliad) or where the work or book begins. */
function Photos({ w, work, line, book }: { w: Witness; work: string; line: string | null; book: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const osd = useRef<typeof OpenSeadragon | null>(null);
  const [pages, setPages] = useState<{ folio: string; service: string }[] | null>(null);
  const [at, setAt] = useState<number | null>(null);
  const [mark, setMark] = useState<{ folio: string; box: [number, number, number, number] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const motion = useSettings((s) => s.motion);
  const inW = w.works[work];
  const lined = !!inW.lines;

  // the pages, and where to open: the line (Iliad), else the book's or the work's first page
  useEffect(() => {
    let live = true;
    (async () => {
      const ps = await pagesOf(w, work);
      const hit = lined && line ? await lineIn(w, work, line) : null;
      if (!live) return;
      const folio = hit?.folio ?? (book && inW.books?.[book]) ?? inW.from;
      setPages(ps);
      setMark(hit);
      setAt(Math.max(0, ps.findIndex((p) => p.folio === folio)));
    })().catch((e: Error) => { if (live) setError(`The pages could not be loaded (${e.message}).`); });
    return () => { live = false; };
  }, [w, work, line, book, lined, inW]);

  // the viewer, created once, from the site's own bundle (loaded only when this panel opens)
  useEffect(() => {
    let live = true;
    import("openseadragon").then(({ default: OSD }) => {
      if (!live || !box.current) return;
      osd.current = OSD;
      viewer.current = OSD({
        element: box.current, showNavigationControl: false, showNavigator: false,
        visibilityRatio: 0.6, minZoomImageRatio: 0.6, maxZoomPixelRatio: 2.5,
        animationTime: prefersReducedMotion(motion) ? 0 : 0.9, springStiffness: 8,
        gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
        // shown, never read: one image server does not allow scripts to read its pictures, which WebGL drawing needs
        drawer: "canvas", crossOriginPolicy: false, preserveViewport: false,
      });
      setReady(true);
    }, (e: Error) => { if (live) setError(`The viewer could not start (${e.message}).`); });
    return () => { live = false; viewer.current?.destroy(); viewer.current = null; };
    // the viewer is made once; motion is read when it is made
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // open the page; on the line's own page, frame the line and mark it
  useEffect(() => {
    const v = viewer.current;
    if (!ready || !v || !pages || at === null) return;
    const page = pages[at];
    v.addOnceHandler("open", () => {
      v.clearOverlays();
      const item = v.world.getItemAt(0);
      if (!item || !mark || mark.folio !== page.folio) return;
      const { x: W, y: H } = item.getContentSize();
      const [x, y, bw, bh] = mark.box;
      const r = item.imageToViewportRectangle(x * W, y * H, bw * W, bh * H);
      const el = document.createElement("div");
      el.className = styles.lineMark;
      v.addOverlay({ element: el, location: r });
      // a few lines above and below, so the line is seen in its place
      const pad = r.height * 3;
      if (osd.current) v.viewport.fitBounds(new osd.current.Rect(r.x - r.width * 0.15, r.y - pad, r.width * 1.3, r.height + pad * 2));
    });
    v.addOnceHandler("open-failed", () => setError("This page's photograph could not be loaded from the library's server."));
    v.open({ tileSource: `${page.service}/info.json` });
  }, [ready, pages, at, mark]);

  const page = pages && at !== null ? pages[at] : null;
  const turn = (d: number) => pages && setAt((a) => Math.min(pages.length - 1, Math.max(0, (a ?? 0) + d)));

  return (
    <section className={styles.ms} aria-label={`${w.name}, ${w.shelfmark}`}>
      <h3 className={styles.msName}>{w.name}</h3>
      <p className={styles.msMeta}>{w.shelfmark} · {w.date}{w.place ? ` · ${w.place}` : ""}</p>
      <p className={styles.msAbout}>{w.about}</p>
      <div className={styles.viewerWrap}>
        <div ref={box} className={styles.viewer} role="img" aria-label={page ? `Folio ${page.folio} of ${w.name}` : `${w.name}, loading`} />
        {!page && !error && <p className={styles.wait}>Opening the manuscript…</p>}
        <div className={styles.tools}>
          <button type="button" onClick={() => turn(-1)} disabled={!page || at === 0} aria-label="Previous page">‹</button>
          <span className={styles.folio} aria-live="polite">{page ? `f. ${page.folio}` : "…"}</span>
          <button type="button" onClick={() => turn(1)} disabled={!page || !pages || at === pages.length - 1} aria-label="Next page">›</button>
          <span className={styles.gap} />
          <button type="button" onClick={() => viewer.current?.viewport.zoomBy(1.6)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => viewer.current?.viewport.zoomBy(1 / 1.6)} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => viewer.current?.viewport.goHome()} aria-label="The whole page">⌂</button>
        </div>
      </div>
      {error && <p className={styles.err}>{error}</p>}
      <p className={rs.fine}>
        {lined ? (mark ? `The line you are reading, ${line}, is marked. ` : "This line is not in the manuscript's index; the page opens where the poem begins. ") : `Opens at the ${book && inW.books?.[book] ? "book" : "work"}'s first leaf, from the library's catalogue. `}
        {w.credit}, shown from their server; <a href={w.terms.url} target="_blank" rel="noreferrer">{w.terms.label}</a>. <a href={w.record.url} target="_blank" rel="noreferrer">{w.record.label} ↗</a>
      </p>
    </section>
  );
}
