"use client";
/**
 * A ranging pole (the red-and-white measuring rod in every excavation photograph) standing beside the
 * Kerameikos' layers. A marker slides down it as you read down the trench. Decorative: hidden from
 * screen readers, and still (at the top) with reduced motion.
 */
import { useEffect, useRef } from "react";
import styles from "./Kerameikos.module.css";

export default function DepthPole() {
  const pole = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = pole.current;
    const trench = el?.closest<HTMLElement>("[data-trench]");
    if (!el || !trench) return;
    const html = document.documentElement;
    const reduce = html.dataset.motion === "reduce" || (html.dataset.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduce) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = trench.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / Math.max(1, r.height - innerHeight * 0.3)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <div className={styles.poleRail} aria-hidden="true">
      <div ref={pole} className={styles.pole}>
        <span className={styles.poleMark} />
      </div>
    </div>
  );
}
