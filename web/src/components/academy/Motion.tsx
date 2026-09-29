"use client";
/**
 * Out of, in, into: three small drawings of a house and a traveller, each with its preposition and
 * case. The traveller leaves (genitive), stays (dative) or enters (accusative) when the drawing
 * scrolls into view; "Again" plays it once more. With reduced motion the drawings are still.
 */
import { useEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import styles from "./Academy.module.css";

type Props = Extract<Section, { kind: "motion" }>;
const PANELS = [
  { k: "from", caseName: "genitive", word: "out of", cls: "motFrom" },
  { k: "in", caseName: "dative", word: "in", cls: "motIn" },
  { k: "to", caseName: "accusative", word: "into", cls: "motTo" },
] as const;

function House({ cls }: { cls: string }) {
  return (
    <svg viewBox="0 0 200 120" className={styles.motSvg} aria-hidden="true">
      <line x1="6" y1="104" x2="194" y2="104" className={styles.motGround} />
      {/* a house: walls, a pitched roof with its gable, a doorway */}
      <path d="M62 104V58h76v46" className={styles.motWall} />
      <path d="M54 60l46-30 46 30z" className={styles.motRoof} />
      <path d="M92 104V80h16v24" className={styles.motDoor} />
      <g className={`${styles.motWho} ${styles[cls]}`}>
        <circle cx="100" cy="86" r="7" />
      </g>
      {cls !== "motIn" && <path d={cls === "motFrom" ? "M150 70h28m-8-6l8 6-8 6" : "M22 70h28m-8-6l8 6-8 6"} className={styles.motArrow} />}
    </svg>
  );
}

export default function Motion({ noun, en }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);   // 0 = not yet in view; each increase plays the drawings once
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setRun(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={styles.motion} data-go={run > 0 ? "" : undefined}>
      <div className={styles.motRow} key={run}>
        {PANELS.map((p) => (
          <div key={p.k} className={styles.motPanel}>
            <House cls={p.cls} />
            <p className={styles.motGr} lang="grc">{noun[p.k]}</p>
            <p className={styles.motCase}><b>{p.caseName}</b> · {p.word} {en}</p>
          </div>
        ))}
      </div>
      <figcaption className={styles.motCap}>
        <span>Away from: genitive. At rest: dative. Towards: accusative.</span>
        <button type="button" className="chip" onClick={() => setRun((n) => n + 1)}>Again</button>
      </figcaption>
    </figure>
  );
}
