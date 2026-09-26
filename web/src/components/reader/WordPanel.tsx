"use client";

import { useEffect, useRef, useState } from "react";
import { decapitalise, isElided, lookupForm } from "@/lib/greek";
import { lookUpWiktionary, type WiktResult, type WiktSense } from "@/lib/lookup/wiktionary";
import { useUI } from "@/lib/ui";
import styles from "./Reader.module.css";

/** The dictionary forms worth trying for a word as printed. */
export function candidates(word: string): string[] {
  const base = lookupForm(word);
  const out: string[] = [];
  const add = (w: string) => { if (w && !out.includes(w)) out.push(w); };
  if (isElided(word)) {
    // an elided vowel could be any of these; with or without an accent of its own
    for (const v of ["α", "ε", "ο", "ι"]) add(base + v);
    for (const v of ["ά", "έ", "ό", "ί"]) add(base + v);
  } else add(base);
  for (const w of [...out]) if (w !== decapitalise(w)) add(decapitalise(w));
  return out;
}

function Senses({ senses }: { senses: WiktSense[] }) {
  return (
    <ol className={styles.senses}>
      {senses.map((s, i) => (
        <li key={i}>
          <span className="label">{s.pos}</span>
          {s.lines.map((l, j) => <p key={j}>{l}</p>)}
        </li>
      ))}
    </ol>
  );
}

export default function WordPanel({ word, onClose }: { word: string | null; onClose: () => void }) {
  const [state, setState] = useState<{ word: string; result: WiktResult | null; error: string | null } | null>(null);
  const toast = useUI((s) => s.showToast);
  const ref = useRef<HTMLElement>(null);
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;

  useEffect(() => {
    if (!word || offline) return;
    const ctl = new AbortController();
    lookUpWiktionary(candidates(word), ctl.signal)
      .then((result) => setState({ word, result, error: null }))
      .catch((e: Error) => { if (!ctl.signal.aborted) setState({ word, result: null, error: `Wiktionary could not be reached (${e.message}).` }); });
    return () => ctl.abort();
  }, [word, offline]);

  useEffect(() => { if (word) ref.current?.focus({ preventScroll: true }); }, [word]);

  if (!word) return null;
  const r = offline ? { word, result: null, error: "You are offline. Live look-ups need a connection.", loading: false }
    : state?.word === word ? { ...state, loading: false } : { word, result: null, error: null, loading: true };
  const lemma = r?.result?.senses.find((s) => s.lemma)?.lemma ?? null;
  const headword = lemma ?? r?.result?.title ?? lookupForm(word);
  const enc = encodeURIComponent;

  return (
    <aside ref={ref} className={styles.panel} aria-label={`Look-up: ${word}`} tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={styles.panelHead}>
        <div>
          <div className={styles.pw} lang="grc">{word}</div>
          {r?.result && r.result.title !== word && <div className="muted">looked up as <span lang="grc">{r.result.title}</span></div>}
        </div>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close look-up">×</button>
      </div>

      {r?.loading && <p className="muted">Looking it up…</p>}
      {r?.error && <p className={styles.warn}>{r.error}</p>}
      {r && !r.loading && !r.error && !r.result && <p className="muted">Wiktionary has no entry for this form. Try the dictionaries below.</p>}

      {r?.result && (
        <>
          <section className={styles.sec}>
            <h3 className="label">This form</h3>
            <Senses senses={r.result.senses} />
            {r.result.senses.length > 1 || r.result.senses.some((s) => s.lines.length > 1)
              ? <p className={styles.fine}>Out of context a form can have more than one analysis; all are listed.</p> : null}
          </section>
          {lemma && r.result.lemmaSenses && (
            <section className={styles.sec}>
              <h3 className="label">Dictionary form <span lang="grc" className={styles.lemma}>{lemma}</span></h3>
              <Senses senses={r.result.lemmaSenses} />
            </section>
          )}
          <p className={styles.fine}>From <a href={r.result.url} target="_blank" rel="noopener noreferrer">Wiktionary</a>, CC BY-SA 4.0.</p>
        </>
      )}

      <section className={styles.sec}>
        <h3 className="label">Scholarly dictionaries</h3>
        <ul className={styles.refs}>
          <li><a href={`https://logeion.uchicago.edu/${enc(headword)}`} target="_blank" rel="noopener noreferrer">Logeion</a> <span className="muted">LSJ, Middle Liddell, Autenrieth and more</span></li>
          <li><a href={`https://www.perseus.tufts.edu/hopper/morph?l=${enc(lookupForm(word))}&la=greek`} target="_blank" rel="noopener noreferrer">Perseus</a> <span className="muted">every possible parsing (Morpheus)</span></li>
          <li><a href={`https://en.wiktionary.org/wiki/${enc(headword)}#Ancient_Greek`} target="_blank" rel="noopener noreferrer">Wiktionary</a> <span className="muted">full entry and all forms</span></li>
        </ul>
      </section>

      <button type="button" className="btn ghost" onClick={() => toast("Saving words arrives with the Treasury in Phase 5.")}>Save word</button>
    </aside>
  );
}
