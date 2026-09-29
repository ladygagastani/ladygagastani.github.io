"use client";
/**
 * Active, middle, passive: one scene drawn three times (a father frees his daughter). An arrow
 * shows who acts on whom, the rope falls from the daughter, and the subject of each sentence
 * stands on a patch of red; the verb is marked in the sentence. In the middle a second arrow
 * turns back to the father: he frees her for himself. The drawings play when they scroll into
 * view; "Again" plays them once more. With reduced motion they are still, in their final state.
 */
import { useEffect, useId, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import styles from "./Academy.module.css";

type Props = Extract<Section, { kind: "voice" }>;
type Item = Props["items"][number];

function Scene({ it, id }: { it: Item; id: string }) {
  const subj = it.left.role === "subject" ? "left" : "right";
  return (
    <svg viewBox="0 0 240 130" className={styles.vSvg} aria-hidden="true">
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M1 1l8 4-8 4" className={styles.vHead} />
        </marker>
      </defs>
      <line x1="8" y1="112" x2="232" y2="112" className={styles.vGround} />
      <ellipse cx={subj === "left" ? 62 : 178} cy="112" rx="28" ry="5" className={styles.vSpot} />
      {/* the father: head, pointed beard, robe, an arm to his staff */}
      <g className={styles.vFig}>
        <circle cx="62" cy="34" r="9" />
        <path d="M56 39l6 13 7-13z" />
        <path d="M52 46h20l9 64H43z" />
        <path d="M70 52l17 10" className={styles.vStaff} />
        <line x1="88" y1="28" x2="88" y2="110" className={styles.vStaff} />
      </g>
      {/* the daughter: head with a knot of hair, robe */}
      <g className={styles.vFig}>
        <circle cx="178" cy="46" r="8" />
        <circle cx="170" cy="42" r="4" />
        <path d="M170 56h16l8 54h-32z" />
      </g>
      {/* the rope: tied round her, then lying on the ground */}
      <g className={styles.vRope}>
        <ellipse cx="178" cy="74" rx="15" ry="5" />
        <path d="M191 76l6 8m-4-9l7 5" />
      </g>
      <path d="M92 22Q130 0 164 30" pathLength={1} className={styles.vArrow} markerEnd={`url(#${id})`} />
      {it.voice === "middle" && <path d="M150 90Q120 104 96 90" pathLength={1} className={`${styles.vArrow} ${styles.vBack}`} markerEnd={`url(#${id})`} />}
    </svg>
  );
}

function Who({ w }: { w: Item["left"] }) {
  return (
    <span className={w.role === "subject" ? styles.vSubj : undefined}>
      <b lang="grc">{w.grc}</b>
      <small>{w.role}</small>
    </span>
  );
}

export default function Voice({ items, caption }: Props) {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  const [run, setRun] = useState(0);   // 0 = not yet in view; each increase plays the drawings once
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setRun(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={styles.voice} data-go={run > 0 ? "" : undefined}>
      <div className={styles.vRow} key={run}>
        {items.map((it) => (
          <div key={it.voice} className={styles.vPanel}>
            <span className={styles.shiftTag}>{it.voice}</span>
            <Scene it={it} id={`${uid}-${it.voice}`} />
            <p className={styles.vWho}><Who w={it.left} /><Who w={it.right} /></p>
            <p className={styles.vGr} lang="grc">
              {it.grc.split(it.verb).flatMap((part, i) => (i ? [<b key={i}>{it.verb}</b>, part] : [part]))}
            </p>
            <p className={styles.vEn}>“{it.en}”</p>
            <p className={styles.small}>{it.note}</p>
          </div>
        ))}
      </div>
      <figcaption className={styles.motCap}>
        <span>{caption}</span>
        <button type="button" className="chip" onClick={() => setRun((n) => n + 1)}>Again</button>
      </figcaption>
    </figure>
  );
}
