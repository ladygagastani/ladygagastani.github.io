"use client";
/**
 * A single-series horizontal bar chart in plain HTML: thin bars from one baseline, the value at
 * each tip in ink (never the bar colour), a tooltip on hover or focus, and the same numbers as a
 * table for anyone who prefers one. Bars grow in once when first shown.
 */
import { useState } from "react";
import styles from "./WordStudy.module.css";

export interface Bar { key: string; label: string; value: number; tip: string; valueText?: string; sub?: string }

export default function BarChart({ bars, caption, unit }: { bars: Bar[]; caption: string; unit: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...bars.map((b) => b.value), 0) || 1;
  return (
    <figure className={styles.chart}>
      <figcaption className="label">{caption}</figcaption>
      <ol className={styles.bars} onMouseLeave={() => setHover(null)}>
        {bars.map((b, i) => (
          <li key={b.key} className={styles.barRow} tabIndex={0} onMouseEnter={() => setHover(b.key)} onFocus={() => setHover(b.key)} onBlur={() => setHover(null)}
            aria-label={`${b.label}: ${b.tip}`} data-hover={hover === b.key ? "" : undefined}>
            <span className={styles.barLabel}>{b.label}{b.sub && <small>{b.sub}</small>}</span>
            <span className={styles.barTrack}>
              <span className={styles.bar} style={{ "--w": `${(b.value / max) * 100}%`, "--i": i } as React.CSSProperties} />
              <span className={styles.barValue} style={{ "--w": `${(b.value / max) * 100}%` } as React.CSSProperties}>{b.valueText ?? b.value.toLocaleString("en-GB")}</span>
            </span>
            {hover === b.key && <span className={styles.tip} role="tooltip">{b.tip}</span>}
          </li>
        ))}
      </ol>
      <details className={styles.asTable}>
        <summary>Show as a table</summary>
        <table>
          <thead><tr><th scope="col">{caption}</th><th scope="col">{unit}</th><th scope="col">Details</th></tr></thead>
          <tbody>{bars.map((b) => <tr key={b.key}><th scope="row">{b.label}</th><td>{b.valueText ?? b.value.toLocaleString("en-GB")}</td><td>{b.tip}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
