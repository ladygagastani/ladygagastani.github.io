"use client";
/**
 * The 24 letters at a glance, for lesson 1 and the Academy's front page: tap a letter to see its
 * name and how it sounds in the chosen pronunciation (the same setting as the alphabet page), with
 * the recording where there is one. Writing each letter, and the diphthongs, are on /academy/alphabet.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { LETTERS, SYSTEMS, type System } from "@/data/alphabet";
import { audioKey } from "@/lib/audio";
import { useSettings } from "@/lib/settings";
import Say from "./Say";
import styles from "./Academy.module.css";

const ORDER: System[] = ["attic", "erasmian", "modern"];
const SHORT: Record<System, string> = { attic: "Classical Attic", erasmian: "Erasmian", modern: "Modern Greek" };

export default function AlphabetGlance({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const pron = useSettings((s) => s.pron);
  const set = useSettings((s) => s.set);
  const [sel, setSel] = useState<number | null>(null);
  // on a phone the card is below all six rows: bring it up when a letter is chosen
  const cardRef = useRef<HTMLDivElement>(null);
  const pick = (i: number) => {
    setSel(i === sel ? null : i);
    const c = cardRef.current;
    if (c && c.getBoundingClientRect().bottom > innerHeight - 90) {
      c.scrollIntoView({ block: "end", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };
  const L = sel === null ? null : LETTERS[sel];
  const H = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className={styles.glance}>
      <div className={styles.glanceHead}>
        <H className={styles.glanceTitle}>The 24 letters <span lang="grc">τὰ γράμματα</span></H>
        <div className={styles.seg} role="radiogroup" aria-label="Pronunciation">
          {ORDER.map((sys) => (
            <button key={sys} type="button" role="radio" aria-checked={pron === sys} title={SYSTEMS[sys].name} onClick={() => set({ pron: sys })}>{SHORT[sys]}</button>
          ))}
        </div>
      </div>

      <div className={styles.alphaGrid} role="listbox" aria-label="The 24 letters: choose one to hear it">
        {LETTERS.map((x, i) => (
          <button key={x.name} type="button" role="option" aria-selected={i === sel} onClick={() => pick(i)}
            className={`${styles.tile} ${x.vowel ? styles.vowelTile : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <span className={styles.tileGlyph} lang="grc">{x.upper}{x.lower}{x.final ?? ""}</span>
            <span className={styles.tileName}>{x.name}</span>
          </button>
        ))}
      </div>

      <div ref={cardRef} className={styles.glanceCard} aria-live="polite">
        {L ? (
          <div key={`${L.name}-${pron}`} className={styles.glanceIn}>
            <span className={styles.glanceBig} lang="grc">{L.upper}{L.lower}{L.final ? ` ${L.final}` : ""}</span>
            <div>
              <p className={styles.glanceName}>
                <b>{L.name}</b> <span lang="grc" className={styles.inlineGr}>{L.greekName}</span>
                <Say k={audioKey.letter(L.name)} label={L.name} />
              </p>
              <p>{L.sounds[pron].say} <span className={styles.ipa}>[{L.sounds[pron].ipa}]</span></p>
              {L.final && <p className={styles.small}>Written <span lang="grc" className={styles.inlineGr}>{L.final}</span> at the end of a word.</p>}
              {L.certainty === "debated" && <span className="tag debated">Debated among scholars</span>}
            </div>
          </div>
        ) : (
          <p className="muted">Tap a letter to see its name and hear how it sounded. <span className={styles.vowelKey} /> marks the seven vowels: α ε η ι ο υ ω.</p>
        )}
      </div>

      <p className={styles.small}>
        <Link href="/academy/alphabet" transitionTypes={["page-turn"]}>Learn to write each letter, and the vowel pairs →</Link>
      </p>
    </div>
  );
}
