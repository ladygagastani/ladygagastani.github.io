"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { coreWords, type CoreEntry } from "@/lib/lookup/core";
import { loadWordPack } from "@/lib/lookup/words";
import { fold } from "@/lib/catalog";
import { useAcademy, knownLemmas } from "@/lib/academy";
import { useUI } from "@/lib/ui";
import styles from "./Academy.module.css";

const TEXTS: [string, string][] = [
  ["tlg0031.tlg004", "Gospel of John"],
  ["tlg0096.tlg002", "Aesop's fables"],
  ["tlg0032.tlg006", "Xenophon, Anabasis"],
  ["tlg0540.tlg001", "Lysias 1, On the Murder of Eratosthenes"],
  ["tlg0059.tlg002", "Plato, Apology"],
  ["tlg0012.tlg001", "Homer, Iliad"],
  ["tlg0003.tlg001", "Thucydides, History"],
];

/** How much of a text's running words a set of dictionary words covers. */
function useCoverage(work: string) {
  const [freq, setFreq] = useState<{ work: string; counts: Map<string, number>; total: number } | null>(null);
  useEffect(() => {
    let live = true;
    loadWordPack(work).then((pack) => {
      if (!live || !pack) return;
      const counts = new Map<string, number>();
      let total = 0;
      for (const [, , , lem, tags] of pack.units) lem.forEach((l, j) => {
        if (pack.tags[tags[j]].startsWith("u")) return;
        const k = fold(pack.lemmas[l]);
        counts.set(k, (counts.get(k) ?? 0) + 1);
        total++;
      });
      setFreq({ work, counts, total });
    }).catch(() => undefined);
    return () => { live = false; };
  }, [work]);
  const f = freq?.work === work ? freq : null;
  const share = (lemmas: Iterable<string>) => {
    if (!f) return null;
    let n = 0;
    for (const l of new Set([...lemmas].map(fold))) n += f.counts.get(l) ?? 0;
    return n / f.total;
  };
  return { share, total: f?.total ?? null };
}

export default function Vocabulary() {
  const [words, setWords] = useState<{ lemma: string; entry: CoreEntry }[]>([]);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [work, setWork] = useState(TEXTS[0][0]);
  const query = useDeferredValue(fold(q.trim()));
  const deck = useAcademy((s) => s.deck);
  const add = useAcademy((s) => s.addCard);
  const toast = useUI((s) => s.showToast);
  useEffect(() => { coreWords().then(setWords); }, []);

  const known = useMemo(() => knownLemmas(deck), [deck]);
  const { share, total } = useCoverage(work);
  const groups = useMemo(() => [...new Set(words.map((w) => w.entry.group))].sort(), [words]);
  const shown = words.filter((w) => (!group || w.entry.group === group) && (!query || fold(w.lemma).includes(query) || w.entry.def.toLowerCase().includes(q.trim().toLowerCase())));
  const pct = (x: number | null) => (x === null ? "…" : `${Math.round(x * 100)}%`);

  return (
    <div className={styles.vocabPage}>
      <section className={styles.coverage} aria-labelledby="cov-title">
        <h2 id="cov-title">How much can you read?</h2>
        <label className={styles.covPick}><span className="label">Text</span>
          <select id="coverage-text" value={work} onChange={(e) => setWork(e.target.value)}>
            {TEXTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <div className={styles.covBars}>
          {[
            ["Words you have learned", share(known), `${known.size} words`],
            ["The 100 commonest words", share(words.slice(0, 100).map((w) => w.lemma)), "DCC core #1–100"],
            ["The 250 commonest words", share(words.slice(0, 250).map((w) => w.lemma)), "DCC core #1–250"],
            [`All ${words.length} core words`, share(words.map((w) => w.lemma)), "the whole DCC core list"],
          ].map(([label, v, sub]) => (
            <div key={label as string} className={styles.covRow}>
              <span>{label as string} <small className="muted">{sub as string}</small></span>
              <span className={styles.covBar}><i style={{ width: typeof v === "number" ? `${v * 100}%` : 0 }} /></span>
              <b>{pct(v as number | null)}</b>
            </div>
          ))}
        </div>
        <p className={styles.small}>Share of the running words of this text ({total ? total.toLocaleString("en-GB") : "…"} words) whose dictionary form is in each set, counted from GLAUx&apos;s analyses. Knowing a word&apos;s dictionary form is only the first step: its forms still have to be recognised.</p>
      </section>

      <section className={styles.coreList} aria-labelledby="core-title">
        <h2 id="core-title">The commonest words</h2>
        <div className={styles.tablesTools}>
          <input id="vocab-search" type="search" className={styles.searchInput} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word, in Greek or English" aria-label="Find a word" />
          <select id="vocab-group" value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Group">
            <option value="">All groups</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className={styles.scrollX}>
          <table className={styles.coreTable}>
            <thead><tr><th>#</th><th>Word</th><th>Meaning</th><th>Kind</th><th /></tr></thead>
            <tbody>
              {shown.map((w) => {
                const c = deck[w.lemma];
                return (
                  <tr key={w.lemma}>
                    <td className={styles.rank}>{w.entry.rank}</td>
                    <td lang="grc" className={styles.inlineGr}>{w.entry.head}</td>
                    <td>{w.entry.def}</td>
                    <td className={styles.small}>{w.entry.pos}</td>
                    <td>{known.has(w.lemma) ? <span className={styles.inDeck}>learned</span>
                      : c ? <span className={styles.inDeck}>in your deck</span>
                      : <button type="button" className="chip" onClick={() => { add(w.lemma, w.entry.def, "core"); toast(`Added ${w.lemma} to your daily review.`); }}>Learn</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={styles.small}>Dickinson College Commentaries Greek Core Vocabulary (Christopher Francese et al.), CC BY-SA 3.0.</p>
      </section>
    </div>
  );
}
