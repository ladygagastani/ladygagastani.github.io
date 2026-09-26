"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { decapitalise, isElided, lookupForm } from "@/lib/greek";
import { lookUpWiktionary, type WiktResult, type WiktSense } from "@/lib/lookup/wiktionary";
import { loadWordPack, analyse, type Analysis } from "@/lib/lookup/words";
import { lsjEntries, citationHref, LSJ_CREDIT, type LsjEntry, type Seg } from "@/lib/lookup/lsj";
import { readTag } from "@/lib/lookup/postag";
import { useUI } from "@/lib/ui";
import styles from "./Reader.module.css";

export interface WordContext { work: string; unitKey: string; occurrence: number; keys: Set<string>; depth: number }

/** The dictionary forms worth trying for a word as printed. */
export function candidates(word: string): string[] {
  const base = lookupForm(word);
  const out: string[] = [];
  const add = (w: string) => { if (w && !out.includes(w)) out.push(w); };
  if (isElided(word)) {
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
        <li key={i}><span className="label">{s.pos}</span>{s.lines.map((l, j) => <p key={j}>{l}</p>)}</li>
      ))}
    </ol>
  );
}

function Segs({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) => {
        if (typeof s === "string") return <span key={i}>{s}</span>;
        if ("g" in s) return <span key={i} lang="grc" className={styles.lsjGr}>{s.g}</span>;
        const href = citationHref(s.u);
        return href ? <Link key={i} href={href} className={styles.cite} title="Open this passage in the reader">{s.c}</Link> : <span key={i}>{s.c}</span>;
      })}
    </>
  );
}

function LsjEntryView({ e, full }: { e: LsjEntry; full: boolean }) {
  if (!full) return <p className={styles.gloss}>{e.s || "See the full entry."}</p>;
  return (
    <div className={styles.lsj}>
      {e.b.map(([level, label, segs], i) => (
        <p key={i} style={{ paddingLeft: `${Math.max(0, level - 1) * 0.9}em` }}>
          {label && <b className={styles.senseN}>{label}.</b>} <Segs segs={segs} />
        </p>
      ))}
    </div>
  );
}

type Loaded<T> = { key: string; value: T | null; error?: string };

export default function WordPanel({ word, ctx, onClose }: { word: string | null; ctx: WordContext | null; onClose: () => void }) {
  const toast = useUI((s) => s.showToast);
  const ref = useRef<HTMLElement>(null);
  const [analysis, setAnalysis] = useState<Loaded<Analysis>>({ key: "", value: null });
  const [lsj, setLsj] = useState<Loaded<{ head: string; entries: LsjEntry[] }>>({ key: "", value: null });
  const [wikt, setWikt] = useState<Loaded<WiktResult>>({ key: "", value: null });
  const [full, setFull] = useState(false);
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const key = word && ctx ? `${ctx.work}|${ctx.unitKey}|${ctx.occurrence}|${word}` : word ?? "";

  // 1. this word in this passage (GLAUx)
  useEffect(() => {
    if (!word || !ctx) return;
    let live = true;
    loadWordPack(ctx.work)
      .then((pack) => { if (live) setAnalysis({ key, value: pack ? analyse(pack, word, ctx.unitKey, ctx.occurrence, ctx.keys, ctx.depth) : null }); })
      .catch((e: Error) => { if (live) setAnalysis({ key, value: null, error: e.message }); });
    return () => { live = false; };
  }, [key, word, ctx]);

  const lemma = analysis.key === key ? analysis.value?.lemma ?? null : null;
  const analysisDone = analysis.key === key;

  // 2. LSJ for the dictionary form (or the word itself when there is no analysis)
  const lsjKey = analysisDone ? `${key}|${lemma ?? ""}` : "";
  useEffect(() => {
    if (!word || !lsjKey) return;
    let live = true;
    (async () => {
      for (const h of lemma ? [lemma] : candidates(word)) {
        const r = await lsjEntries(h);
        if (r) return r;
      }
      return null;
    })()
      .then((value) => { if (live) setLsj({ key: lsjKey, value }); })
      .catch((e: Error) => { if (live) setLsj({ key: lsjKey, value: null, error: e.message }); });
    return () => { live = false; };
  }, [lsjKey, word, lemma]);

  // 3. Wiktionary, live
  useEffect(() => {
    if (!word || offline) return;
    const ctl = new AbortController();
    lookUpWiktionary(candidates(word), ctl.signal)
      .then((value) => setWikt({ key: word, value }))
      .catch((e: Error) => { if (!ctl.signal.aborted) setWikt({ key: word, value: null, error: e.message }); });
    return () => ctl.abort();
  }, [word, offline]);

  useEffect(() => { if (word) ref.current?.focus({ preventScroll: true }); }, [word]);

  if (!word) return null;
  const a = analysisDone ? analysis.value : undefined;
  const l = lsj.key === lsjKey ? lsj : null;
  const w = wikt.key === word ? wikt : null;
  const headword = lemma ?? l?.value?.head ?? w?.value?.title ?? lookupForm(word);
  const enc = encodeURIComponent;
  const parsing = a ? readTag(a.tag) : null;

  return (
    <aside ref={ref} className={styles.panel} aria-label={`Look-up: ${word}`} tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={styles.panelHead}>
        <div className={styles.pw} lang="grc">{word}</div>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close look-up">×</button>
      </div>

      {/* ------------------------------------------------ here */}
      <section className={styles.sec}>
        <h3 className="label">In this passage</h3>
        {!analysisDone && ctx && <p className="muted">Finding this word…</p>}
        {analysisDone && !a && <p className="muted">{analysis.error ? `Word analyses could not be loaded (${analysis.error}).` : "No analysis is available for this text yet."}</p>}
        {a && parsing && (
          <div className={styles.here}>
            <p className={styles.lemmaBig} lang="grc">{a.lemma}</p>
            <p className={styles.parse}><b>{parsing.pos}</b>{parsing.detail ? ` · ${parsing.detail}` : ""}</p>
            {a.where === "here" && (a.manual
              ? <span className="tag well">Checked by hand · treebank</span>
              : <span className="tag debated">Automatic analysis · about 97% accurate</span>)}
            {a.where === "passage" && <span className="tag debated">Matched to this passage, not to this exact word</span>}
            {a.where === "work" && (
              <div className={styles.fine}>
                <p>This exact place could not be matched. Elsewhere in this work the form is analysed as:</p>
                <ul>{a.others.slice(0, 4).map((o, i) => { const p = readTag(o.tag); return <li key={i}><span lang="grc">{o.lemma}</span>, {p.pos}{p.detail ? ` · ${p.detail}` : ""} ({o.n}×)</li>; })}</ul>
              </div>
            )}
            <p className={styles.fine}>Analysis: GLAUx (Keersmaekers 2021), CC BY-SA 4.0.</p>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ LSJ */}
      <section className={styles.sec}>
        <h3 className="label">Dictionary · LSJ {l?.value && <span lang="grc" className={styles.lemma}>{l.value.head}</span>}</h3>
        {!l && <p className="muted">Opening the dictionary…</p>}
        {l && !l.value && <p className="muted">{l.error ? `The dictionary could not be loaded (${l.error}).` : "No LSJ entry found under this headword."}</p>}
        {l?.value && l.value.entries.map((e, i) => <LsjEntryView key={i} e={e} full={full} />)}
        {l?.value && <button type="button" className="chip" onClick={() => setFull(!full)}>{full ? "Short definition" : "Full entry"}</button>}
        {l?.value && full && <p className={styles.fine}>{LSJ_CREDIT}</p>}
      </section>

      {/* ------------------------------------------------ Wiktionary */}
      <section className={styles.sec}>
        <h3 className="label">Wiktionary · live</h3>
        {offline && <p className="muted">You are offline. Wiktionary needs a connection.</p>}
        {!offline && !w && <p className="muted">Looking it up…</p>}
        {w && !w.value && <p className="muted">{w.error ? `Wiktionary could not be reached (${w.error}).` : "No Wiktionary entry for this form."}</p>}
        {w?.value && (
          <>
            <Senses senses={w.value.senses} />
            {w.value.lemmaSenses && w.value.senses.some((s) => s.lemma) && <Senses senses={w.value.lemmaSenses} />}
            <p className={styles.fine}>From <a href={w.value.url} target="_blank" rel="noopener noreferrer">Wiktionary</a>, CC BY-SA 4.0.</p>
          </>
        )}
      </section>

      <section className={styles.sec}>
        <h3 className="label">More dictionaries</h3>
        <ul className={styles.refs}>
          <li><a href={`https://logeion.uchicago.edu/${enc(headword)}`} target="_blank" rel="noopener noreferrer">Logeion</a> <span className="muted">LSJ, Middle Liddell, Autenrieth and more</span></li>
          <li><a href={`https://www.perseus.tufts.edu/hopper/morph?l=${enc(lookupForm(word))}&la=greek`} target="_blank" rel="noopener noreferrer">Perseus</a> <span className="muted">every possible parsing (Morpheus)</span></li>
        </ul>
      </section>

      <button type="button" className="btn ghost" onClick={() => toast("Saving words arrives with the Treasury in Phase 5.")}>Save word</button>
    </aside>
  );
}
