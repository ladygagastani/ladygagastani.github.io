"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { loadWordPack } from "@/lib/lookup/words";
import { placeAnalyses } from "@/lib/lookup/placed";
import { loadMap, placesByName, project, SCALE, shortName, typeLabel, type Base } from "@/lib/map";
import { placeMarks, placesOnPage, type PagePlace } from "@/lib/page-places";
import { simplifyRing } from "@/components/map/draw";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import type { TeiDoc } from "@/lib/tei/types";
import styles from "./Places.module.css";
import rs from "./Reader.module.css";

type Marks = Map<string, Set<string>>;
interface ViewBox { x: number; y: number; w: number; h: number }

const RATIO = 3 / 4;          // the map's height to its width
const MIN_W = 5 * SCALE;      // never closer than about five degrees across
const PAD = 0.18;             // room around the outermost places

/** The sea, projected once and simplified per level of detail, as SVG paths. */
let projected: { water: number[][]; lakes: number[][] } | null = null;
const pathCache = new Map<number, string>();
function seaPath(base: Base, tol: number): string {
  projected ??= {
    water: base.water.map((r) => r.flatMap((_, i) => (i % 2 ? [] : project(base, r[i], r[i + 1])))),
    lakes: base.lakes.map((r) => r.flatMap((_, i) => (i % 2 ? [] : project(base, r[i], r[i + 1])))),
  };
  const hit = pathCache.get(tol);
  if (hit) return hit;
  let d = "";
  for (const r of [...projected.water, ...projected.lakes]) {
    const s = simplifyRing(r, tol);
    if (!s) continue;
    d += `M${s[0].toFixed(0)} ${s[1].toFixed(0)}`;
    for (let i = 2; i < s.length; i += 2) d += `L${s[i].toFixed(0)} ${s[i + 1].toFixed(0)}`;
    d += "Z";
  }
  pathCache.set(tol, d);
  return d;
}
const TOLS = [2, 3.5, 6, 12];
const tolFor = (w: number) => TOLS.reduce((best, t) => (t <= w / 260 ? t : best), TOLS[0]);

/** The view that holds every place, with room around them, in the map's proportions. */
function fit(base: Base, pts: [number, number][]): ViewBox {
  const [W, H] = [(base.bbox[2] - base.bbox[0]) * Math.cos((38 * Math.PI) / 180) * SCALE, (base.bbox[3] - base.bbox[1]) * SCALE];
  if (!pts.length) return { x: 0, y: 0, w: W, h: W * RATIO };
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let w = Math.max(MIN_W, (x1 - x0) * (1 + 2 * PAD), ((y1 - y0) * (1 + 2 * PAD)) / RATIO);
  w = Math.min(w, W);
  const h = w * RATIO;
  const x = Math.min(Math.max((x0 + x1) / 2 - w / 2, 0), Math.max(W - w, 0));
  const y = Math.min(Math.max((y0 + y1) / 2 - h / 2, 0), Math.max(H - h, 0));
  return { x, y, w, h };
}

/**
 * Places named on this page of Greek: a small map of them (the Periplus's own sea, no outside tiles)
 * and a list, each with the passages that name it. The words themselves are marked in the text.
 */
export default function PlacesPanel({ work, doc, pageKeys, onJump, onMarks, onClose }: {
  work: string; doc: TeiDoc; pageKeys: Set<string>;
  onJump: (ref: string) => void; onMarks: (m: Marks | null) => void; onClose: () => void;
}) {
  const [list, setList] = useState<PagePlace[] | null>(null);
  const [base, setBase] = useState<Base | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [byCount, setByCount] = useState(false);
  const [allRefs, setAllRefs] = useState<string | null>(null);
  // a new page: nothing chosen
  const [keysSeen, setKeysSeen] = useState(pageKeys);
  if (keysSeen !== pageKeys) { setKeysSeen(pageKeys); setActive(null); setAllRefs(null); }
  const motion = useSettings((s) => s.motion);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let live = true;
    Promise.all([loadWordPack(work), placesByName(), loadMap()]).then(([pack, byName, map]) => {
      if (!live) return;
      setError(null);
      setBase(map.base);
      if (!pack) { setError("This text has no word analyses yet, so the places it names cannot be found."); setList([]); return; }
      setList(placesOnPage(pack, placeAnalyses(pack, doc), pageKeys, byName));
    }, (e: Error) => { if (live) setError(`The map could not be loaded (${e.message}).`); });
    return () => { live = false; };
  }, [work, doc, pageKeys]);

  // the words that name the places, marked in the text (only the chosen place's while one is chosen)
  useEffect(() => { onMarks(list?.length ? placeMarks(list, active ?? undefined) : null); }, [list, active, onMarks]);
  useEffect(() => () => onMarks(null), [onMarks]);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);

  // the view glides from one page's places to the next
  const target = useMemo(() => (base && list ? fit(base, list.map((p) => project(base, p.place.lon, p.place.lat))) : null), [base, list]);
  const [view, setView] = useState<ViewBox | null>(null);
  const viewRef = useRef<ViewBox | null>(null);
  useEffect(() => {
    if (!target) return;
    const from = viewRef.current;
    if (!from || prefersReducedMotion(motion)) { viewRef.current = target; setView(target); return; }
    const t0 = performance.now(), dur = 700;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3;
      const v = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      viewRef.current = v; setView(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, motion]);

  const sea = base && view ? seaPath(base, tolFor(view.w)) : "";
  const chosen = list?.find((p) => p.place.id === active) ?? null;
  // the numbers stay those of reading order, whichever way the list is sorted
  const num = useMemo(() => new Map(list?.map((p, i) => [p.place.id, i + 1])), [list]);
  const shown = useMemo(() => (list && byCount ? [...list].sort((a, b) => b.n - a.n) : list), [list, byCount]);

  return (
    <aside ref={ref} className={rs.panel} aria-label="Places on this page" tabIndex={-1} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={rs.panelHead}>
        <h2 className={styles.title}>Places on this page</h2>
        <button type="button" className={rs.x} onClick={onClose} aria-label="Close places">×</button>
      </div>

      {base && view && (
        <div className={styles.map} data-empty={list && !list.length ? "" : undefined} data-many={list && list.length > 20 ? "" : undefined}>
          <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d={sea} className={styles.sea} fillRule="evenodd" />
          </svg>
          {list?.map((p, i) => {
            const [x, y] = project(base, p.place.lon, p.place.lat);
            const left = ((x - view.x) / view.w) * 100, top = ((y - view.y) / view.h) * 100;
            if (left < -5 || left > 105 || top < -5 || top > 105) return null;
            return (
              <button key={`${p.place.id}-${[...pageKeys][0]}`} type="button" className={styles.dot} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${Math.min(i, 12) * 70}ms` }}
                data-active={active === p.place.id ? "" : undefined} data-auto={p.place.checked ? undefined : ""}
                onClick={() => setActive(active === p.place.id ? null : p.place.id)}
                onMouseEnter={() => setActive(p.place.id)} aria-label={`${shortName(p.place)}: mark only its words`}>
                <span aria-hidden="true">{i + 1}</span>
              </button>
            );
          })}
          {chosen && (() => {
            const [x, y] = project(base, chosen.place.lon, chosen.place.lat);
            const left = ((x - view.x) / view.w) * 100;
            return <span className={styles.tag} data-flip={left > 55 ? "" : undefined} style={{ left: `${left}%`, top: `${((y - view.y) / view.h) * 100}%` }} aria-hidden="true"><b lang="grc">{chosen.lemma}</b> {shortName(chosen.place)}</span>;
          })()}
        </div>
      )}

      {error && <p className="muted">{error}</p>}
      {!list && !error && <p className="muted">Finding the places…</p>}
      {list && !list.length && !error && <p className="muted">No place on the map is named on this page.</p>}

      {list && list.length > 1 && (
        <div className={`segmented ${styles.order}`} role="radiogroup" aria-label="Order of the places">
          <button type="button" role="radio" aria-checked={!byCount} onClick={() => setByCount(false)}>In reading order</button>
          <button type="button" role="radio" aria-checked={byCount} onClick={() => setByCount(true)}>Most named</button>
        </div>
      )}
      {shown && shown.length > 0 && (
        <ol className={styles.list} onMouseLeave={() => setActive(null)}>
          {shown.map((p) => (
            <li key={p.place.id} data-active={active === p.place.id ? "" : undefined} onMouseEnter={() => setActive(p.place.id)}>
              <span className={styles.num} data-auto={p.place.checked ? undefined : ""} aria-hidden="true">{num.get(p.place.id)}</span>
              <div>
                <button type="button" className={styles.name} aria-pressed={active === p.place.id} onClick={() => setActive(active === p.place.id ? null : p.place.id)}>
                  <b lang="grc">{p.lemma}</b> {shortName(p.place)}
                </button>
                <p className={styles.meta}>{typeLabel(p.place.type)} · {p.n === 1 ? "once" : `${p.n} times`} here{p.place.checked ? "" : " · matched automatically"}</p>
                <p className={styles.refs}>
                  {(allRefs === p.place.id ? p.refs : p.refs.slice(0, 8)).map((r) => <button key={r} type="button" onClick={() => onJump(r)} aria-label={`Go to ${r}`}>{r}</button>)}
                  {p.refs.length > 8 && allRefs !== p.place.id && <button type="button" className={styles.more} onClick={() => setAllRefs(p.place.id)} aria-label={`Show all ${p.refs.length} passages`}>+{p.refs.length - 8}</button>}
                  <Link href={`/stoa/periplus?p=${p.place.id}`} transitionTypes={["page-turn"]}>On the big map →</Link>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <p className={rs.fine}>Names found from GLAUx&apos;s analysis of the words, matched to Pleiades places as on the Periplus map.
        A hollow number means the match was made automatically and has not been checked by hand. Choose a place to mark only its words.</p>
    </aside>
  );
}
