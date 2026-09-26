"use client";

import { useState } from "react";
import styles from "./LetterTiles.module.css";

// Sounds in the reconstructed pronunciation of Classical Athens (W. S. Allen, Vox Graeca, 3rd ed. 1987).
const LETTERS: [string, string, string, string][] = [
  ["Α", "α", "alpha", "a, as in \"father\" when long"],
  ["Β", "β", "beta", "b"],
  ["Γ", "γ", "gamma", "g, as in \"go\""],
  ["Δ", "δ", "delta", "d"],
  ["Ε", "ε", "epsilon", "short e, as in \"pet\""],
  ["Ω", "ω", "omega", "long open o, as in \"saw\""],
];

export default function LetterTiles() {
  const [on, setOn] = useState<Set<string>>(new Set());
  const flip = (n: string) => setOn((s) => { const t = new Set(s); if (t.has(n)) t.delete(n); else t.add(n); return t; });

  return (
    <div className={styles.letters}>
      {LETTERS.map(([U, l, name, sound]) => (
        <button key={name} type="button" className={`${styles.tile} ${on.has(name) ? styles.on : ""}`}
          onClick={() => flip(name)} aria-pressed={on.has(name)} aria-label={`${U} ${l}, ${name}: ${sound}`}>
          <span className={styles.in}>
            <span className={styles.face}><span className={styles.glyph} lang="grc">{U}<small>{l}</small></span></span>
            <span className={`${styles.face} ${styles.back}`}><b>{name}</b><span>{sound}</span></span>
          </span>
        </button>
      ))}
    </div>
  );
}
