"use client";

import { useRef, useState } from "react";
import { LOWER, UPPER } from "@/data/strokes";
import { buzz } from "@/lib/haptics";
import styles from "./Academy.module.css";

type Pt = [number, number];

/** How closely the strokes drawn follow the guide: the share of the guide they cover, and of the ink that is on it. */
function score(guides: SVGPathElement[], drawn: Pt[][]) {
  const pts = drawn.flat();
  if (!pts.length) return { cover: 0, onGuide: 0 };
  const samples: Pt[] = [];
  for (const g of guides) {
    const len = g.getTotalLength();
    for (let i = 0; i <= 40; i++) { const p = g.getPointAtLength((len * i) / 40); samples.push([p.x, p.y]); }
  }
  const near = (a: Pt, set: Pt[], r: number) => set.some((b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 <= r * r);
  return {
    cover: samples.filter((s) => near(s, pts, 9)).length / samples.length,
    onGuide: pts.filter((p) => near(p, samples, 11)).length / pts.length,
  };
}

/**
 * A letter drawn stroke by stroke, with numbered starting points, over writing lines.
 * Each stroke uses pathLength = 1 so its dash animation is independent of its real length.
 * "Trace it" lets the learner write the letter over the guide with a finger (or the mouse); once as
 * many strokes as the letter has are drawn, they are checked against the guide.
 */
export default function StrokeLetter({ letter, size = 220 }: { letter: string; size?: number }) {
  const strokes = LOWER[letter] ?? UPPER[letter] ?? [];
  const [run, setRun] = useState(0);
  const [tracing, setTracing] = useState(false);
  const [drawn, setDrawn] = useState<Pt[][]>([]);
  const [result, setResult] = useState<null | "good" | "again">(null);
  const svg = useRef<SVGSVGElement>(null);
  const guides = useRef<(SVGPathElement | null)[]>([]);
  const pen = useRef<number | null>(null);
  const per = 0.9;   // seconds per stroke
  const start = (d: string) => /M\s*([\d.]+)[ ,]([\d.]+)/.exec(d)!.slice(1).map(Number);

  const at = (e: React.PointerEvent): Pt => {
    const m = svg.current!.getScreenCTM()!.inverse();
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    return [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10];
  };
  const check = (all: Pt[][]) => {
    const { cover, onGuide } = score(guides.current.filter(Boolean) as SVGPathElement[], all);
    const ok = cover >= 0.8 && onGuide >= 0.75;
    setResult(ok ? "good" : "again");
    if (ok) buzz("right");
  };
  // the strokes drawn so far, kept in a ref too so that the pointer handlers read them as they are
  const ink = useRef<Pt[][]>([]);
  const put = (d: Pt[][]) => { ink.current = d; setDrawn(d); };
  const clear = () => { put([]); setResult(null); };
  const draw = tracing ? {
    onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      pen.current = e.pointerId;
      // after a verdict, the next stroke starts a fresh try
      put([...(result ? [] : ink.current), [at(e)]]);
      if (result) setResult(null);
    },
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => {
      if (pen.current !== e.pointerId) return;
      const p = at(e), d = ink.current, last = d[d.length - 1], q = last[last.length - 1];
      if ((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 >= 1) put([...d.slice(0, -1), [...last, p]]);
    },
    onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => lift(e),
    // a stroke the browser breaks off (a system gesture) still counts as drawn
    onPointerCancel: (e: React.PointerEvent<SVGSVGElement>) => lift(e),
  } : {};
  function lift(e: React.PointerEvent) {
    if (pen.current !== e.pointerId) return;
    pen.current = null;
    if (ink.current.length >= strokes.length) check(ink.current);
  }

  return (
    <figure className={styles.stroke}>
      <svg ref={svg} key={tracing ? "trace" : run} viewBox="0 0 100 100" width={size} height={size} className={tracing ? styles.traceBox : undefined}
        role="img" aria-label={tracing ? `Write ${letter} here with your finger or the mouse, following the numbered strokes` : `How to write ${letter}, in ${strokes.length} stroke${strokes.length === 1 ? "" : "s"}`} {...draw}>
        <line x1="4" x2="96" y1="70" y2="70" className={styles.base} />
        <line x1="4" x2="96" y1="36" y2="36" className={styles.guide} />
        <line x1="4" x2="96" y1="10" y2="10" className={styles.guide} />
        <line x1="4" x2="96" y1="96" y2="96" className={styles.guide} />
        {strokes.map((d, i) => <path key={`g${i}`} ref={(el) => { guides.current[i] = el; }} d={d} className={styles.ghost} />)}
        {!tracing && strokes.map((d, i) => (
          <path key={i} d={d} pathLength={1} className={styles.pen} style={{ animationDelay: `${i * per}s`, animationDuration: `${per * 0.9}s` }} />
        ))}
        {tracing && drawn.map((s, i) => <polyline key={`t${i}`} points={s.map((p) => p.join(",")).join(" ")} className={`${styles.ink} ${result === "good" ? styles.inkGood : ""}`} />)}
        {strokes.map((d, i) => {
          const [x, y] = start(d);
          return (
            <g key={`n${i}`} className={tracing ? styles.numStill : styles.num} style={tracing ? undefined : { animationDelay: `${i * per}s` }}>
              <circle cx={x} cy={y} r="4.2" />
              <text x={x} y={y + 1.6} textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        {!tracing ? (
          <>
            <button type="button" className="chip" onClick={() => setRun((r) => r + 1)}>Write it again</button>
            <button type="button" className="chip" onClick={() => { clear(); setTracing(true); }}>Trace it yourself</button>
            <span className="muted">{strokes.length} stroke{strokes.length === 1 ? "" : "s"} · a common way to write it</span>
          </>
        ) : (
          <>
            <span className={result === "good" ? styles.good : result === "again" ? styles.bad : "muted"} role="status">
              {result === "good" ? "Well written!" : result === "again" ? "Not quite: start at 1 and follow the grey guide." : `Write it over the guide: ${strokes.length} stroke${strokes.length === 1 ? "" : "s"}, starting at 1.`}
            </span>
            <button type="button" className="chip" onClick={clear} disabled={!drawn.length}>Start again</button>
            <button type="button" className="chip" onClick={() => setTracing(false)}>Watch it written</button>
          </>
        )}
      </figcaption>
    </figure>
  );
}
