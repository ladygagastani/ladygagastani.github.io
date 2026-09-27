"use client";
/** "On this page": the entry's sections, with the one being read marked as you scroll. */
import { useEffect, useState } from "react";
import styles from "./Stoa.module.css";

export default function Contents({ heads }: { heads: { id: string; text: string }[] }) {
  const [current, setCurrent] = useState(heads[0]?.id);
  useEffect(() => {
    const onScroll = () => {
      let at = heads[0]?.id;
      for (const h of heads) { const el = document.getElementById(h.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.3) at = h.id; }
      setCurrent(at);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [heads]);
  return (
    <nav className={styles.contents} aria-label="On this page">
      <p className="label">On this page</p>
      <ol>
        {heads.map((h) => (
          <li key={h.id}><a href={`#${h.id}`} aria-current={current === h.id ? "location" : undefined}>{h.text}</a></li>
        ))}
      </ol>
    </nav>
  );
}
