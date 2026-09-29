"use client";
/**
 * When does a participle's action happen? Each real sentence gets a strip of time: the main verb
 * as a plain bar (ink colour), the participle as a red one, before it (aorist), alongside it (present) or after
 * it (future, dashed: intended, not yet done). The bars grow in the order the actions happen when
 * the strips scroll into view; "Again" replays. With reduced motion they are simply drawn.
 */
import { useEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import styles from "./Academy.module.css";

type Props = Extract<Section, { kind: "timeline" }>;
type Item = Props["items"][number];

// x ranges on a 320-wide strip; the main verb always sits in the middle
const MAIN: [number, number] = [120, 210];
const PTC: Record<Item["time"], [number, number]> = { before: [18, 112], same: [104, 226], after: [218, 312] };
const WORD: Record<Item["time"], string> = { before: "before", same: "at the same time", after: "after" };

function Strip({ it }: { it: Item }) {
  const [p0, p1] = PTC[it.time];
  const ptcFirst = it.time === "before";
  const mainY = it.time === "same" ? 44 : 34, ptcY = it.time === "same" ? 18 : 34;
  return (
    <svg viewBox="0 0 330 78" className={styles.tlSvg} aria-hidden="true">
      <path d="M8 60H318m-7-4l7 4-7 4" className={styles.tlAxis} />
      <text x="318" y="76" className={styles.tlTime}>time</text>
      <g className={`${styles.tlBar} ${styles.tlMain}`} style={{ animationDelay: ptcFirst ? "1s" : "0.3s" }}>
        <rect x={MAIN[0]} y={mainY - 11} width={MAIN[1] - MAIN[0]} height="22" rx="3" />
        <text x={(MAIN[0] + MAIN[1]) / 2} y={mainY + 5}>{it.verb}</text>
      </g>
      <g className={`${styles.tlBar} ${styles.tlPtc} ${it.time === "after" ? styles.tlIntent : ""}`}
        style={{ animationDelay: ptcFirst ? "0.3s" : it.time === "same" ? "0.3s" : "1s" }}>
        <rect x={p0} y={ptcY - 11} width={p1 - p0} height="22" rx="3" />
        <text x={(p0 + p1) / 2} y={ptcY + 5}>{it.ptc}</text>
      </g>
    </svg>
  );
}

/** the sentence with the participle in red and the main verb in bold */
function Marked({ it }: { it: Item }) {
  return (
    <>
      {it.grc.split(/(\s+)/).map((w, i) => (
        w === it.ptc ? <b key={i} className={styles.tlWPtc}>{w}</b> : w === it.verb ? <b key={i}>{w}</b> : w
      ))}
    </>
  );
}

export default function Timeline({ title, items }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);   // 0 = not yet in view; each increase plays the strips once
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setRun(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={styles.timeline} data-go={run > 0 ? "" : undefined}>
      <span className="label">{title}</span>
      <div key={run} className={styles.tlList}>
        {items.map((it) => (
          <div key={it.ptc} className={styles.tlItem}>
            <span className={styles.shiftTag}>{WORD[it.time]}</span>
            <Strip it={it} />
            <p className={styles.tlGr} lang="grc"><Marked it={it} /></p>
            <p className={styles.vEn}>“{it.en}”</p>
            <p className={styles.small}>{it.note} <span className={styles.tlSrc}>{it.label}</span></p>
          </div>
        ))}
      </div>
      <figcaption className={styles.motCap}>
        <span>In red, the participle; the other bar is the main verb. Dashed: intended, not yet done.</span>
        <button type="button" className="chip" onClick={() => setRun((n) => n + 1)}>Again</button>
      </figcaption>
    </figure>
  );
}
