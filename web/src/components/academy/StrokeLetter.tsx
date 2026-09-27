"use client";

import { useState } from "react";
import { LOWER, UPPER } from "@/data/strokes";
import styles from "./Academy.module.css";

/**
 * A letter drawn stroke by stroke, with numbered starting points, over writing lines.
 * Each stroke uses pathLength = 1 so its dash animation is independent of its real length.
 */
export default function StrokeLetter({ letter, size = 220 }: { letter: string; size?: number }) {
  const strokes = LOWER[letter] ?? UPPER[letter] ?? [];
  const [run, setRun] = useState(0);
  const per = 0.9;   // seconds per stroke
  const start = (d: string) => /M\s*([\d.]+)[ ,]([\d.]+)/.exec(d)!.slice(1).map(Number);

  return (
    <figure className={styles.stroke}>
      <svg key={run} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`How to write ${letter}, in ${strokes.length} stroke${strokes.length === 1 ? "" : "s"}`}>
        <line x1="4" x2="96" y1="70" y2="70" className={styles.base} />
        <line x1="4" x2="96" y1="36" y2="36" className={styles.guide} />
        <line x1="4" x2="96" y1="10" y2="10" className={styles.guide} />
        <line x1="4" x2="96" y1="96" y2="96" className={styles.guide} />
        {strokes.map((d, i) => <path key={`g${i}`} d={d} className={styles.ghost} />)}
        {strokes.map((d, i) => (
          <path key={i} d={d} pathLength={1} className={styles.pen} style={{ animationDelay: `${i * per}s`, animationDuration: `${per * 0.9}s` }} />
        ))}
        {strokes.map((d, i) => {
          const [x, y] = start(d);
          return (
            <g key={`n${i}`} className={styles.num} style={{ animationDelay: `${i * per}s` }}>
              <circle cx={x} cy={y} r="4.2" />
              <text x={x} y={y + 1.6} textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        <button type="button" className="chip" onClick={() => setRun((r) => r + 1)}>Write it again</button>
        <span className="muted">{strokes.length} stroke{strokes.length === 1 ? "" : "s"} · a common way to write it</span>
      </figcaption>
    </figure>
  );
}
