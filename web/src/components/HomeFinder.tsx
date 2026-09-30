"use client";
/**
 * "Find something to read", on the home page: a search over every work (title, author, Greek title),
 * a switch for translated or Greek-only texts, and, until something is typed, suggested starting points.
 * The suggestions arrive with the page; the catalogue itself is fetched only when the reader first
 * uses the box, so the home page stays light.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex } from "@/lib/catalog";
import { loadDifficulty, commonShare } from "@/lib/difficulty";
import styles from "./HomeFinder.module.css";

export interface Start { id: string; title: string; author: string; grc: string | null }
type Tr = "all" | "with" | "greek";
const TRS: [Tr, string][] = [["all", "All"], ["with", "With translation"], ["greek", "Greek only"]];
const SHOWN = 12;

interface Hit { id: string; title: string; author: string; grc: string | null; tr: boolean }

export default function HomeFinder({ starts, total }: { starts: Start[]; total: number }) {
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [diff, setDiff] = useState<Record<string, [number, number]>>({});
  const [q, setQ] = useState("");
  const [tr, setTr] = useState<Tr>("all");
  const wake = () => { loadCatalog().then(setIdx, () => setFailed(true)); loadDifficulty().then(setDiff); };
  useEffect(() => { if (q || tr !== "all") wake(); }, [q, tr]);

  const known = useMemo(() => new Set(starts.map((s) => s.id)), [starts]);
  const query = fold(q.trim());
  const hits = useMemo<Hit[] | null>(() => {
    if (!idx || (!query && tr === "all")) return null;
    const terms = query.split(/\s+/).filter(Boolean);
    const out: { h: Hit; rank: number }[] = [];
    for (const a of idx.catalog.authors) {
      const author = fold(a.name);
      for (const w of a.works) {
        const has = hasTranslation(w);
        if ((tr === "with" && !has) || (tr === "greek" && has)) continue;
        const grc = greekEditions(w)[0]?.label ?? null;
        const title = fold(w.title);
        const hay = `${author} ${title} ${w.orig ? fold(w.orig) : ""} ${grc ? fold(grc) : ""} ${fold(w.id)}`;
        let rank = 9;
        // someone typing a name wants that author's works first; the well-known ones lead each group
        if (!query) rank = 5;
        else if (terms.every((t) => hay.includes(t))) {
          rank = author.startsWith(terms[0]) || author.includes(` ${terms[0]}`) ? 0 : title.startsWith(terms[0]) ? 1 : 2;
        }
        if (rank < 9) out.push({ h: { id: w.id, title: w.title, author: a.name, grc, tr: has }, rank: rank * 100 + (known.has(w.id) ? 0 : 50) });
      }
    }
    out.sort((x, y) => x.rank - y.rank);
    return out.map((o) => o.h);
  }, [idx, query, tr, known]);

  // with the box empty: the suggestions ("Greek only" has none to suggest, since all have a translation)
  const cards: Hit[] = hits ? hits.slice(0, SHOWN) : tr === "greek" ? [] : starts.map((s) => ({ ...s, tr: true }));
  const heading = hits
    ? `${hits.length.toLocaleString("en-GB")} ${hits.length === 1 ? "work" : "works"}${query ? ` for “${q.trim()}”` : ""}`
    : "Suggested starting points";
  const pending = !idx && !failed && (query !== "" || tr !== "all");

  return (
    <div className={styles.finder}>
      <div className={styles.bar}>
        <div className={styles.box}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
          <input type="search" enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} value={q}
            onFocus={wake} onChange={(e) => setQ(e.target.value)} aria-label="Search the library"
            placeholder={`Search ${total.toLocaleString("en-GB")} works by title or author, English or Greek`} />
        </div>
        <div className="segmented" role="radiogroup" aria-label="Show">
          {TRS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={tr === id} onClick={() => setTr(id)}>{label}</button>)}
        </div>
      </div>

      <h3 className={styles.heading} aria-live="polite">{pending ? "Searching…" : failed ? "The catalogue could not be loaded" : heading}</h3>
      {cards.length > 0 && (
        <ul className={styles.cards}>
          {cards.map((c) => {
            const pct = commonShare(diff[c.id]);
            return (
              <li key={c.id}>
                <Link href={`/read?w=${c.id}`} transitionTypes={["page-turn"]}>
                  <span className={styles.grc} lang="grc">{c.grc ?? c.title}</span>
                  <span className={styles.en}>{c.title}</span>
                  <span className={styles.by}>{c.author}</span>
                  <span className={styles.meta}>
                    <span className={c.tr ? styles.badge : `${styles.badge} ${styles.off}`}>{c.tr ? "English" : "Greek only"}</span>
                    {pct !== null && <span title="The share of this text's running words that are among the 516 commonest Greek words">{pct}% common words</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {cards.length === 0 && !pending && !failed && (
        <p className={styles.none}>
          {hits ? "Nothing matches. Try a shorter word, or the author's name." : "Greek-only texts have no English beside them, so none are suggested here. Type a name above, or browse them in the Library."}
        </p>
      )}
      <p className={styles.more}>
        <Link href={q.trim() ? `/library?q=${encodeURIComponent(q.trim())}` : "/library"} transitionTypes={["page-turn"]}>
          {hits && hits.length > SHOWN ? `See all ${hits.length.toLocaleString("en-GB")} in the Library` : "Browse the whole Library"} →
        </Link>
        {q.trim() && <Link href={`/search?q=${encodeURIComponent(q.trim())}`} transitionTypes={["page-turn"]}>Search inside the texts for “{q.trim()}” →</Link>}
      </p>
    </div>
  );
}
