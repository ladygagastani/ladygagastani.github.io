"use client";
/**
 * "The long road of the text": an author's timeline drawn as a road. Each mark is a shape and a word
 * (the author, a copy, a printing, a reader), and the stretch between two marks says how many years
 * lie between them, so the long silence between an author and the oldest surviving copies is visible.
 * The road draws itself as it scrolls into view (nothing moves with reduced motion; the final drawing
 * is the resting state). On a phone it runs downwards.
 */
import { useEffect, useRef } from "react";
import { inline } from "@/wiki/markup";
import { PIN_KINDS, type AuthorArticle, type PinKind } from "@/wiki/author-articles";
import { CertTag, Inline } from "../stoa/Markup";
import styles from "./AuthorArticle.module.css";

/** -490 → "490 BC"; 175 → "AD 175"; 1554 → "1554" */
export const yearLabel = (y: number) => (y < 0 ? `${-y} BC` : y < 1000 ? `AD ${y}` : String(y));

/** Whole years from one mark to the next (there is no year 0). */
export const yearsBetween = (from: number, to: number) => to - from - (from < 0 && to > 0 ? 1 : 0);

function gapText(n: number): string {
  if (n < 1) return "";
  // dates in the timeline are often round or approximate, so long gaps are rounded and said to be "about"
  if (n >= 100) return `about ${(Math.round(n / 10) * 10).toLocaleString("en-GB")} years later`;
  return `${n} year${n === 1 ? "" : "s"} later`;
}

/** One small drawing per kind of mark (a stylus, a scroll, a press block, a speech mark). */
export function PinIcon({ kind }: { kind: PinKind }) {
  const p = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
  switch (kind) {
    case "writing": return <svg {...p}><path d="M3 13l1-3 7-7 2 2-7 7z" /><path d="M10 4l2 2" /></svg>;
    case "copy": return <svg {...p}><path d="M4 3h7a1 1 0 011 1v8a1 1 0 01-1 1H4" /><path d="M4 3a1.5 1.5 0 000 3h1M4 13a1.5 1.5 0 010-3h1" /><path d="M7 6h3M7 9h3" /></svg>;
    case "print": return <svg {...p}><rect x="3" y="3" width="10" height="10" rx="1" /><path d="M6 6h4M6 8h4M6 10h2" /></svg>;
    case "reception": return <svg {...p}><path d="M3 4h10v6H8l-3 3v-3H3z" /></svg>;
  }
}

export default function AuthorRoad({ items }: { items: AuthorArticle["timeline"] }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    const reduce = html.dataset.motion === "reduce" || (html.dataset.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.dataset.play = "1"; io.disconnect(); } }), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rows = [...items].sort((a, b) => a.year - b.year);
  const kinds = [...new Set(rows.map((r) => r.kind))];
  return (
    <div className={styles.roadWrap}>
      <ol ref={ref} className={styles.road} aria-label="Timeline" tabIndex={0}>
        {rows.map((t, i) => {
          const gap = i ? gapText(yearsBetween(rows[i - 1].year, t.year)) : "";
          return (
            <li key={`${t.year}-${i}`} className={styles.stop} data-kind={t.kind} style={{ "--i": i } as React.CSSProperties}>
              {gap && <span className={styles.gap}>{gap}</span>}
              <span className={styles.pin}><PinIcon kind={t.kind} /></span>
              <span className={styles.when}>{yearLabel(t.year)}</span>
              <span className={styles.kindName}>{PIN_KINDS[t.kind].label}</span>
              <span className={styles.what}>
                <Inline xs={inline(t.what)} />{t.src && t.src.length > 0 && <Inline xs={[{ src: t.src }]} />}
                {t.certainty && t.certainty !== "well" && <> <CertTag c={t.certainty} /></>}
              </span>
            </li>
          );
        })}
      </ol>
      <ul className={styles.legend} aria-label="What the marks mean">
        {kinds.map((k) => (
          <li key={k} data-kind={k} title={PIN_KINDS[k].about}><span className={styles.keyPin}><PinIcon kind={k} /></span>{PIN_KINDS[k].label}</li>
        ))}
      </ul>
    </div>
  );
}
