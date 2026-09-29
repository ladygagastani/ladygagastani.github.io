"use client";
/**
 * The same words in a new order: press the button and the adjective slides to its new place
 * (the words glide from where they were: a FLIP animation), the English and the name of the
 * position change with it. With reduced motion the words simply appear in the new order.
 */
import { useLayoutEffect, useRef, useState } from "react";
import type { Section } from "@/data/lessons";
import { fold } from "@/lib/catalog";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import styles from "./Academy.module.css";

type Item = Extract<Section, { kind: "shift" }>["items"][number];
const ARTICLES = new Set(["ο", "η", "το", "οι", "αι", "τα"]);

/** Each word keyed by its accentless form and which occurrence it is ("ο#0", "ο#1"), so the same word can glide. */
function keyed(phrase: string) {
  const seen = new Map<string, number>();
  return phrase.split(/\s+/).map((w) => {
    const f = fold(w);
    const n = seen.get(f) ?? 0;
    seen.set(f, n + 1);
    return { w, key: `${f}#${n}` };
  });
}

function ShiftItem({ it }: { it: Item }) {
  const [moved, setMoved] = useState(false);
  const motion = useSettings((s) => s.motion);
  const box = useRef<HTMLSpanElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  const a = keyed(it.a), b = keyed(it.b);
  const words = moved ? b : a;
  const other = moved ? a : b;
  // the word that changed place (not an article) is the adjective: mark it
  const shifted = new Set(words.filter((x, i) => !ARTICLES.has(x.key.split("#")[0]) && other.findIndex((y) => y.key === x.key) !== i).map((x) => x.key));

  const flip = () => {
    const el = box.current;
    if (el && !prefersReducedMotion(motion)) {
      before.current = new Map([...el.querySelectorAll<HTMLElement>("[data-k]")].map((s) => [s.dataset.k!, s.getBoundingClientRect()]));
    }
    setMoved(!moved);
  };

  useLayoutEffect(() => {
    const el = box.current, old = before.current;
    before.current = null;
    if (!el || !old) return;
    for (const s of el.querySelectorAll<HTMLElement>("[data-k]")) {
      const r0 = old.get(s.dataset.k!);
      const r1 = s.getBoundingClientRect();
      const anim = r0
        ? [{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px)` }, { transform: "none" }]
        : [{ opacity: 0, transform: "translateY(-10px)" }, { opacity: 1, transform: "none" }];
      s.animate(anim, { duration: 520, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
    }
  }, [moved]);

  return (
    <div className={styles.shiftItem}>
      <p className={styles.shiftGr} lang="grc">
        <span ref={box}>
          {words.map((x) => <span key={x.key} data-k={x.key} className={shifted.has(x.key) ? styles.shiftAdj : undefined}>{x.w}</span>)}
        </span>
      </p>
      <p className={styles.shiftEn} aria-live="polite">
        <span className={styles.shiftTag}>{moved ? "predicate" : "attributive"}</span> <span key={String(moved)} className={styles.shiftSay}>“{moved ? it.bEn : it.aEn}”</span>
      </p>
      {moved && <p className={styles.small}>{it.note}</p>}
      <button type="button" className="chip" onClick={flip} aria-pressed={moved}>{moved ? "Move it back" : "Move the adjective"}</button>
    </div>
  );
}

export default function Shift({ title, items }: Extract<Section, { kind: "shift" }>) {
  return (
    <div className={styles.shift}>
      <span className="label">{title}</span>
      {items.map((it) => <ShiftItem key={it.a} it={it} />)}
    </div>
  );
}
