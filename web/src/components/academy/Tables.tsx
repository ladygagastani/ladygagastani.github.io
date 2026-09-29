"use client";

import { useMemo, useState } from "react";
import { PARADIGMS, formsOf, type Paradigm } from "@/data/paradigms";
import ATTESTED from "@/data/paradigms-attested.json";
import { fold } from "@/lib/catalog";
import styles from "./Academy.module.css";

const GROUPS: [Paradigm["group"] | "all", string][] = [["all", "All"], ["article", "Article"], ["noun", "Nouns"], ["adjective", "Adjectives"], ["pronoun", "Pronouns"], ["verb", "Verbs"]];
const attested = ATTESTED as Record<string, number[][]>;

/** The part all forms share (ignoring accents), so the endings can be shown apart. */
function stemLength(p: Paradigm): number {
  const forms = p.cells.flat().flatMap(formsOf).map((f) => fold(f));
  if (p.group === "article" || p.group === "pronoun") return 0;
  let n = 0;
  while (forms.every((f) => f[n] && f[n] === forms[0][n])) n++;
  return n;
}

function Cell({ form, stem, hit, count }: { form: string; stem: number; hit: boolean; count: number }) {
  // split each alternative at the shared stem; letters and folded letters line up one to one
  return (
    <td className={hit ? styles.hit : undefined} title={count ? `Found ${count.toLocaleString("en-GB")} times in the analysed texts` : "Rare in the analysed texts"}>
      {form.split(/(,\s*)/).map((part, i) => /^,/.test(part) ? part : (
        <span key={i} lang="grc">
          {[...part.normalize("NFC")].slice(0, stem).join("")}
          <span className={styles.ending}>{[...part.normalize("NFC")].slice(stem).join("")}</span>
        </span>
      ))}
      <span className={styles.count}>{count ? (count >= 1000 ? `${Math.round(count / 1000)}k` : count) : "·"}</span>
    </td>
  );
}

/** One table, as shown on the tables page and inside lessons. */
export function ParadigmTable({ p, query = "" }: { p: Paradigm; query?: string }) {
  const stem = stemLength(p);
  const counts = attested[p.id];
  return (
    <section className={styles.table} aria-labelledby={`t-${p.id}`}>
      <h2 id={`t-${p.id}`}>{p.title}</h2>
      {p.note && <p className="muted">{p.note}</p>}
      <div className={styles.scrollX}>
        <table>
          <thead><tr><th />{p.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {p.cells.map((row, r) => (
              <tr key={p.rows[r]}>
                <th scope="row">{p.rows[r]}</th>
                {row.map((cell, c) => <Cell key={c} form={cell} stem={stem} count={counts?.[r]?.[c] ?? 0}
                  hit={!!query && formsOf(cell).some((f) => fold(f) === query)} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Tables() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<(typeof GROUPS)[number][0]>("all");
  const query = fold(q.trim());

  const matches = useMemo(() => {
    if (!query) return [];
    const out: string[] = [];
    for (const p of PARADIGMS) p.cells.forEach((row, r) => row.forEach((cell, c) => {
      if (formsOf(cell).some((f) => fold(f) === query)) out.push(`${cell} = ${p.rows[r]}, ${p.cols[c]} of ${p.lemma}`);
    }));
    return out;
  }, [query]);

  const shown = PARADIGMS.filter((p) => group === "all" || p.group === group);

  return (
    <div className={styles.tables}>
      <div className={styles.tablesTools}>
        <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="tables-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} className={styles.searchInput}
          placeholder="Find a form, e.g. λογου (accents optional)" aria-label="Find a form" />
        <div className={styles.seg} role="radiogroup" aria-label="Show">
          {GROUPS.map(([g, l]) => <button key={g} type="button" role="radio" aria-checked={group === g} onClick={() => setGroup(g)}>{l}</button>)}
        </div>
      </div>
      {query && (
        <p className={styles.found} aria-live="polite">
          {matches.length ? matches.map((m) => <span key={m} lang="grc">{m}</span>) : "That form is not in these tables."}
        </p>
      )}
      <p className={styles.small}>Endings are shown in red. The small number after each form is how often it occurs with that analysis in the 16 million analysed words of GLAUx; every form was checked against it.</p>
      {shown.map((p) => <ParadigmTable key={p.id} p={p} query={query} />)}
    </div>
  );
}
