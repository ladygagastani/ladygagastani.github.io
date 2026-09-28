"use client";

import { useEffect, useRef, useState } from "react";
import { LETTERS, DIPHTHONGS, SYSTEMS, ALLEN, type System } from "@/data/alphabet";
import { coreWords, type CoreEntry } from "@/lib/lookup/core";
import { fold } from "@/lib/catalog";
import { audioKey } from "@/lib/audio";
import { useSettings } from "@/lib/settings";
import StrokeLetter from "./StrokeLetter";
import Say from "./Say";
import styles from "./Academy.module.css";

const ORDER: System[] = ["attic", "erasmian", "modern"];

export function SystemPicker() {
  const pron = useSettings((s) => s.pron);
  const set = useSettings((s) => s.set);
  return (
    <div className={styles.systems}>
      <div className={styles.seg} role="radiogroup" aria-label="Pronunciation">
        {ORDER.map((sys) => (
          <button key={sys} type="button" role="radio" aria-checked={pron === sys} onClick={() => set({ pron: sys })}>{SYSTEMS[sys].name}</button>
        ))}
      </div>
      <p className="muted">{SYSTEMS[pron].about}</p>
    </div>
  );
}

export default function Alphabet() {
  const pron = useSettings((s) => s.pron);
  const [sel, setSel] = useState(0);
  const [caps, setCaps] = useState(false);
  const [examples, setExamples] = useState<Record<string, { lemma: string; entry: CoreEntry }>>({});

  // an example for each letter: the commonest core-vocabulary word that begins with it
  useEffect(() => {
    coreWords().then((words) => {
      const out: Record<string, { lemma: string; entry: CoreEntry }> = {};
      for (const L of LETTERS) {
        const w = words.find((x) => x.entry.rank > 1 && fold(x.lemma).startsWith(fold(L.lower)));
        if (w) out[L.name] = w;
      }
      setExamples(out);
    });
  }, []);

  // on a phone the letter's details are below the whole grid: bring them into view
  const detailRef = useRef<HTMLElement>(null);
  const pick = (i: number) => {
    setSel(i);
    const d = detailRef.current;
    if (d && d.getBoundingClientRect().top > innerHeight * 0.6) d.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const L = LETTERS[sel];
  const sound = L.sounds[pron];
  const ex = examples[L.name];

  return (
    <div className={styles.alphabet}>
      <SystemPicker />

      <div className={styles.alphaGrid} role="listbox" aria-label="The 24 letters">
        {LETTERS.map((x, i) => (
          <button key={x.name} type="button" role="option" aria-selected={i === sel} onClick={() => pick(i)}
            className={`${styles.tile} ${x.vowel ? styles.vowelTile : ""}`}>
            <span className={styles.tileGlyph} lang="grc">{x.upper}{x.lower}{x.final ?? ""}</span>
            <span className={styles.tileName}>{x.name}</span>
          </button>
        ))}
      </div>
      <p className={styles.small}><span className={styles.vowelKey} /> vowels (7): α ε η ι ο υ ω</p>

      <section ref={detailRef} className={styles.detail} aria-live="polite">
        <div className={styles.detailDraw}>
          <StrokeLetter key={`${L.name}-${caps}`} letter={caps ? L.upper : L.lower} />
          <div className={styles.seg} role="radiogroup" aria-label="Letter form">
            <button type="button" role="radio" aria-checked={!caps} onClick={() => setCaps(false)}>Small letter</button>
            <button type="button" role="radio" aria-checked={caps} onClick={() => setCaps(true)}>Capital</button>
          </div>
          {L.final && !caps && <p className={styles.small}>At the end of a word: <span lang="grc" className={styles.inlineGr}>{L.final}</span></p>}
        </div>
        <div className={styles.detailText}>
          <p className={styles.bigName}>
            <span lang="grc">{L.upper} {L.lower}</span> {L.name}
            <Say k={audioKey.letter(L.name)} label={L.name} />
          </p>
          <p className="muted">Greek name <span lang="grc" className={styles.inlineGr}>{L.greekName}</span>
            {L.classicalName && <> · in Classical Athens <span lang="grc" className={styles.inlineGr}>{L.classicalName}</span></>}</p>
          <div className={styles.soundBox}>
            <span className="label">{SYSTEMS[pron].name}</span>
            <p className={styles.say2}>{sound.say}</p>
            <p className={styles.ipa}>IPA [{sound.ipa}]</p>
            {L.certainty === "debated" && <span className="tag debated">Debated among scholars</span>}
          </div>
          {L.note && <p>{L.note}</p>}
          {ex && (
            <p className={styles.example}>
              <span className="label">A common word</span>
              <span lang="grc" className={styles.inlineGr}>{ex.lemma}</span> <span className="muted">{ex.entry.def}</span>
            </p>
          )}
          <div className={styles.navLetters}>
            <button type="button" className="chip" disabled={sel === 0} onClick={() => setSel(sel - 1)}>← {sel > 0 ? LETTERS[sel - 1].name : ""}</button>
            <button type="button" className="chip" disabled={sel === LETTERS.length - 1} onClick={() => setSel(sel + 1)}>{sel < LETTERS.length - 1 ? LETTERS[sel + 1].name : ""} →</button>
          </div>
        </div>
      </section>

      <section className={styles.diph}>
        <h2>Vowel pairs (diphthongs)</h2>
        <p className="muted">Two vowels said as one sound. In {SYSTEMS[pron].name}:</p>
        <table>
          <thead><tr><th>Spelling</th><th>Sound</th><th>IPA</th><th /></tr></thead>
          <tbody>
            {DIPHTHONGS.map((d) => (
              <tr key={d.spelling}>
                <td lang="grc" className={styles.inlineGr}>{d.spelling}</td>
                <td>{d.sounds[pron].say}{d.note && <span className={styles.small}> {d.note}</span>}</td>
                <td className={styles.ipa}>[{d.sounds[pron].ipa}]</td>
                <td><Say k={audioKey.diphthong(d.spelling)} label={d.spelling} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className={styles.small}>Classical sounds after {ALLEN}. Example words and definitions from the Dickinson College Commentaries Greek Core Vocabulary (CC BY-SA 3.0).</p>
    </div>
  );
}
