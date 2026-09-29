"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex, type CatAuthor, type CatWork } from "@/lib/catalog";
import { loadWorksMeta, FAMILIES, PERIODS, familyOf, periodOf, centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { commonShare, loadDifficulty, VOCAB_BANDS } from "@/lib/difficulty";
import { scrollBelowHeader } from "@/lib/header";
import styles from "./Library.module.css";

/**
 * Where to begin. The site's own guidance, following the brief; the reasons are the ones
 * teachers usually give. Difficulty is about the Greek, not the ideas.
 */
const START = [
  { level: "Gentle", why: "Short sentences and everyday words.", works: [["tlg0031.tlg004", "The Gospel of John"], ["tlg0096.tlg002", "Aesop's fables"]] },
  { level: "Steady", why: "Clear Classical Attic prose, the usual first authors after a textbook.", works: [["tlg0032.tlg006", "Xenophon, Anabasis"], ["tlg0540.tlg001", "Lysias, On the Murder of Eratosthenes"]] },
  { level: "Demanding", why: "Dense, unusual constructions and rare words, hard even for experienced readers.", works: [["tlg0003.tlg001", "Thucydides, History"], ["tlg0033.tlg001", "Pindar, Olympian Odes"]] },
];

type Sort = "author" | "title" | "period";
type Tr = "all" | "with" | "greek";
const SORTS: [Sort, string][] = [["author", "Author A–Z"], ["title", "Title A–Z"], ["period", "By period"]];
const TRS: [Tr, string][] = [["all", "All"], ["with", "With translation"], ["greek", "Greek only"]];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const UNDATED = "Not dated";
/** How many of an author's works show before "Show all" (while nothing narrows the list). */
const FEW = 6;

const readHref = (w: CatWork) => `/read?w=${w.id}`;
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const n = (x: number) => x.toLocaleString("en-GB");
/** The letter a name is filed under: its first Latin letter, accents ignored. */
const initial = (s: string) => fold(s).replace(/^[^a-z]+/, "").charAt(0).toUpperCase() || "#";
const byName = (a: string, b: string) => fold(a).localeCompare(fold(b), "en");

export function WorkItem({ w, author, meta, common }: { w: CatWork; author?: CatAuthor; meta?: WorkMeta; common: number | null }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  return (
    <li className={styles.work}>
      <Link href={readHref(w)} transitionTypes={["page-turn"]} className={styles.workLink}>
        <span className={styles.workTitle}>{author && <span className={styles.byline}>{author.name}, </span>}{w.title}</span>
        {grc?.label && grc.label !== w.title && <span className={styles.workGr} lang="grc">{grc.label}</span>}
      </Link>
      <span className={styles.meta}>
        {meta?.genre && <span className={styles.genre}>{meta.genre}{meta.from !== null ? ` · ${centuries(meta.from, meta.to)}` : ""}</span>}
        {tr ? <span className={styles.badge}>English</span> : <span className={`${styles.badge} ${styles.off}`}>Greek only</span>}
        {common !== null && <span title={`${common}% of this text's running words are among the 516 core words, the commonest in Greek`}>{common}% common words</span>}
        {grc && <span className={styles.size}>{kb(grc.size)}</span>}
      </span>
    </li>
  );
}

/** An author and the works of theirs that pass the filters. */
interface Row { a: CatAuthor; works: CatWork[]; from: number | null; to: number | null }
/** A lettered or dated section of the list. */
interface Group { key: string; label: string; short: string; rows?: Row[]; titles?: { w: CatWork; a: CatAuthor }[] }

export default function Library() {
  const params = useSearchParams();
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("author");
  const [tr, setTr] = useState<Tr>("all");
  const [family, setFamily] = useState("");
  const [period, setPeriod] = useState("");
  const [dialect, setDialect] = useState("");
  const [vocab, setVocab] = useState("");
  const [diff, setDiff] = useState<Record<string, [number, number]>>({});
  const [meta, setMeta] = useState<Record<string, WorkMeta>>({});
  // authors whose "Show all" the reader has pressed; an author arriving by ?a= starts open, so pressing flips it
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [more, setMore] = useState(false);                        // phones: the extra filters shown
  const query = useDeferredValue(q);
  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setError(e.message)); loadWorksMeta().then(setMeta); loadDifficulty().then(setDiff); }, []);
  // "where to begin" stays as the reader left it (the box itself holds whether it is open)
  const beginRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { try { if (beginRef.current && localStorage.getItem("mathesis:lib-begin") === "open") beginRef.current.open = true; } catch {} }, []);
  const rememberBegin = (open: boolean) => { try { localStorage.setItem("mathesis:lib-begin", open ? "open" : "shut"); } catch {} };

  const dialects = useMemo(() => [...new Set(Object.values(meta).map((m) => m.dialect).filter((d): d is string => !!d))].sort(), [meta]);
  const authors = useMemo(() => idx?.catalog.authors ?? [], [idx]);

  /** Does a work pass every filter except the genre? (The genre chips count with this.) */
  const keepBut = useMemo(() => (w: CatWork) => {
    if (tr === "with" && !hasTranslation(w)) return false;
    if (tr === "greek" && hasTranslation(w)) return false;
    const m = meta[w.id];
    if (period && periodOf(m?.from ?? null) !== period) return false;
    if (dialect && m?.dialect !== dialect) return false;
    if (vocab) {
      const p = commonShare(diff[w.id]);
      if (p === null || !VOCAB_BANDS.find(([id]) => id === vocab)?.[2](p)) return false;
    }
    return true;
  }, [tr, period, dialect, vocab, meta, diff]);

  /** The works that match the search and the filters (other than genre), by author. */
  const found = useMemo(() => {
    const f = fold(query.trim());
    const out: { a: CatAuthor; works: CatWork[] }[] = [];
    for (const a of authors) {
      const whole = f.length > 0 && fold(a.name).includes(f);
      const works = a.works.filter((w) => keepBut(w) && (!f || whole || fold(`${w.title} ${greekEditions(w)[0]?.label ?? ""} ${w.id}`).includes(f)));
      if (works.length) out.push({ a, works });
    }
    return out;
  }, [authors, keepBut, query]);

  const familyCounts = useMemo(() => {
    const c = new Map<string, number>();
    let all = 0;
    for (const { works } of found) for (const w of works) { all++; const fam = familyOf(meta[w.id]?.genre ?? null); if (fam) c.set(fam, (c.get(fam) ?? 0) + 1); }
    return { all, c };
  }, [found, meta]);

  const rows: Row[] = useMemo(() => found.map(({ a, works }) => {
    const ws = family ? works.filter((w) => familyOf(meta[w.id]?.genre ?? null) === family) : works;
    const froms = ws.map((w) => meta[w.id]?.from).filter((x): x is number => x !== null && x !== undefined);
    const tos = ws.map((w) => meta[w.id]?.to).filter((x): x is number => x !== null && x !== undefined);
    return { a, works: ws, from: froms.length ? Math.min(...froms) : null, to: tos.length ? Math.max(...tos) : null };
  }).filter((r) => r.works.length), [found, family, meta]);

  const groups: Group[] = useMemo(() => {
    if (sort === "title") {
      const all = rows.flatMap(({ a, works }) => works.map((w) => ({ w, a }))).sort((x, y) => byName(x.w.title, y.w.title));
      const by = new Map<string, Group>();
      for (const t of all) { const k = initial(t.w.title); if (!by.has(k)) by.set(k, { key: k, label: k, short: k, titles: [] }); by.get(k)!.titles!.push(t); }
      return [...by.values()];
    }
    if (sort === "period") {
      const by = new Map<string, Group>();
      for (const [p] of PERIODS) by.set(p, { key: p, label: p, short: p.split(" ·")[0], rows: [] });
      by.set(UNDATED, { key: UNDATED, label: "Not dated in GLAUx", short: "Undated", rows: [] });
      for (const r of [...rows].sort((x, y) => (x.from ?? 1e9) - (y.from ?? 1e9) || byName(x.a.name, y.a.name))) by.get(periodOf(r.from) ?? UNDATED)!.rows!.push(r);
      return [...by.values()].filter((g) => g.rows!.length);
    }
    const by = new Map<string, Group>();
    for (const r of [...rows].sort((x, y) => byName(x.a.name, y.a.name))) { const k = initial(r.a.name); if (!by.has(k)) by.set(k, { key: k, label: k, short: k, rows: [] }); by.get(k)!.rows!.push(r); }
    return [...by.values()];
  }, [rows, sort]);

  const shown = useMemo(() => ({ works: rows.reduce((s, r) => s + r.works.length, 0), authors: rows.length }), [rows]);
  const total = useMemo(() => ({
    authors: authors.length,
    works: authors.reduce((s, a) => s + a.works.length, 0),
    english: authors.reduce((s, a) => s + a.works.filter(hasTranslation).length, 0),
  }), [authors]);
  const narrowed = shown.works !== total.works;

  // the jump bar: every letter (or period), those with nothing to show greyed out
  const jumps = sort === "period" ? groups.map((g) => ({ key: g.key, short: g.short, on: true })) : LETTERS.map((l) => ({ key: l, short: l, on: groups.some((g) => g.key === l) }));
  const barRef = useRef<HTMLElement>(null);
  const jump = (key: string) => {
    const el = document.getElementById(`lib-${key}`);
    if (el) scrollBelowHeader(el, (barRef.current?.offsetHeight ?? 0) + 12, !matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  // arriving with ?a=tlg0012 (from the reader or an author page): bring that author into view and mark them
  const selected = params.get("a");
  const isOpen = (id: string) => flipped.has(id) !== (id === selected);
  useEffect(() => {
    if (!idx || !selected) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`author-${selected}`);
      if (el) scrollBelowHeader(el, (barRef.current?.offsetHeight ?? 0) + 12);
    });
  }, [idx, selected]);

  const clearAll = () => { setQ(""); setTr("all"); setFamily(""); setPeriod(""); setDialect(""); setVocab(""); };

  if (error) return <p className={`wrap ${styles.error}`}>{error}</p>;

  return (
    <div className={`wrap ${styles.lib}`}>
      {/* the search comes first: straight to the point */}
      <div className={styles.searchBox}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search authors and titles, English or Greek" aria-label="Search the library" />
      </div>

      <div className={styles.controls}>
        <div className="segmented" role="radiogroup" aria-label="Order">
          {SORTS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={sort === id} onClick={() => setSort(id)}>{label}</button>)}
        </div>
        <div className="segmented" role="radiogroup" aria-label="Translation">
          {TRS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={tr === id} onClick={() => setTr(id)}>{label}</button>)}
        </div>
        {/* phones: the three menus wait behind one button */}
        <button type="button" className={styles.moreBtn} aria-expanded={more} aria-controls="library-more" onClick={() => setMore(!more)}>
          More filters{(period ? 1 : 0) + (dialect ? 1 : 0) + (vocab ? 1 : 0) ? ` (${(period ? 1 : 0) + (dialect ? 1 : 0) + (vocab ? 1 : 0)})` : ""}
        </button>
        <div id="library-more" className={styles.selects} role="group" aria-label="More filters" data-open={more ? "" : undefined}>
          <select id="library-period" aria-label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} data-set={period ? "" : undefined}>
            <option value="">Every period</option>
            {PERIODS.map(([p]) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select id="library-dialect" aria-label="Dialect" value={dialect} onChange={(e) => setDialect(e.target.value)} data-set={dialect ? "" : undefined}>
            <option value="">Every dialect</option>
            {dialects.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select id="library-vocab" aria-label="Vocabulary" value={vocab} onChange={(e) => setVocab(e.target.value)} data-set={vocab ? "" : undefined}>
            <option value="">Any vocabulary</option>
            {VOCAB_BANDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.genres} role="group" aria-label="Kind of writing">
        <span className="label">Genre</span>
        <div className={styles.chipRow}>
          <button type="button" className="chip" aria-pressed={!family} onClick={() => setFamily("")}>All <small>{n(familyCounts.all)}</small></button>
          {FAMILIES.map(([f]) => {
            const c = familyCounts.c.get(f) ?? 0;
            return <button key={f} type="button" className="chip" aria-pressed={family === f} disabled={!c && family !== f} onClick={() => setFamily(family === f ? "" : f)}>{f} <small>{n(c)}</small></button>;
          })}
        </div>
      </div>

      {vocab && <p className={styles.note}>Vocabulary is the share of a text&apos;s running words that are among the 516 core words, the commonest in Greek (the Dickinson College Commentaries core list, counted over the GLAUx analysis; texts under 2,000 words are not rated). It measures words only, not grammar, dialect or how hard the ideas are: Aristotle&apos;s words are common, his arguments are not.</p>}

      <details ref={beginRef} className={styles.begin} onToggle={(e) => rememberBegin((e.currentTarget as HTMLDetailsElement).open)}>
        <summary><span className={styles.beginIcon} aria-hidden="true">✦</span> Not sure where to begin? <span className="muted">Our suggestions, by how hard the Greek is</span></summary>
        <div className={styles.levels}>
          {START.map((s) => (
            <div key={s.level} className={styles.level}>
              <h2>{s.level}</h2>
              <p className="muted">{s.why}</p>
              <ul>
                {s.works.map(([id, label]) => (
                  <li key={id}><Link href={`/read?w=${id}`} transitionTypes={["page-turn"]}>{label} <span aria-hidden="true">→</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <nav ref={barRef} className={styles.jumpBar} aria-label={sort === "period" ? "Jump to a period" : "Jump to a letter"} data-periods={sort === "period" ? "" : undefined}>
        {jumps.map((j) => <button key={j.key} type="button" disabled={!j.on} onClick={() => jump(j.key)}>{j.short}</button>)}
      </nav>

      <p className={styles.count} aria-live="polite">
        {!idx ? "Opening the catalogue…"
          : narrowed ? <>{n(shown.works)} of {n(total.works)} works, by {n(shown.authors)} author{shown.authors === 1 ? "" : "s"} · <button type="button" onClick={clearAll}>Show everything</button></>
          : `${n(total.works)} works by ${n(total.authors)} authors, ${n(total.english)} with an English translation`}
      </p>

      {idx && !groups.length && <p className={styles.nothing}>Nothing matches. Try fewer letters, search in English, or <button type="button" onClick={clearAll}>clear the filters</button>.</p>}

      <div className={styles.list}>
        {groups.map((g) => (
          <section key={`${sort}-${g.key}`} id={`lib-${g.key}`} className={styles.group} aria-labelledby={`lib-h-${g.key}`}>
            <h2 id={`lib-h-${g.key}`} className={styles.groupHead} data-period={sort === "period" ? "" : undefined}>{g.label}</h2>
            {g.rows?.map((r) => (
              <div key={r.a.id} id={`author-${r.a.id}`} className={styles.author} data-selected={r.a.id === selected ? "" : undefined}>
                <div className={styles.who}>
                  <Link href={`/library/author?a=${r.a.id}`} transitionTypes={["page-turn"]} className={styles.name}>{r.a.name}</Link>
                  {r.from !== null && <span className={styles.dates} title={DATE_NOTE}>{centuries(r.from, r.to)}</span>}
                </div>
                <ul className={styles.rows}>
                  {(narrowed || isOpen(r.a.id) ? r.works : r.works.slice(0, FEW)).map((w) => <Title key={w.id} w={w} meta={meta[w.id]} common={commonShare(diff[w.id])} />)}
                  {!narrowed && r.works.length > FEW && (
                    <li>
                      <button type="button" className={styles.more} aria-expanded={isOpen(r.a.id)}
                        onClick={() => setFlipped((s) => { const t = new Set(s); if (t.has(r.a.id)) t.delete(r.a.id); else t.add(r.a.id); return t; })}>
                        {isOpen(r.a.id) ? "Show fewer" : `Show all ${r.works.length} works`}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            {g.titles && (
              <ul className={`${styles.rows} ${styles.titleRows}`}>
                {g.titles.map(({ w, a }) => <Title key={w.id} w={w} by={a} meta={meta[w.id]} common={commonShare(diff[w.id])} />)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/** One work in the list: its title, Greek title, and what it offers, the whole row a link into the reader. */
function Title({ w, by, meta, common }: { w: CatWork; by?: CatAuthor; meta?: WorkMeta; common: number | null }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  return (
    <li>
      <Link href={readHref(w)} transitionTypes={["page-turn"]} className={styles.row}>
        <span className={styles.rowTitle}>
          <span className={styles.t}>{w.title}</span>
          {grc?.label && grc.label !== w.title && <span className={styles.gr} lang="grc">{grc.label}</span>}
          {by && <span className={styles.by}>{by.name}</span>}
        </span>
        <span className={styles.rowMeta}>
          {meta?.genre && <span className={styles.genre}>{meta.genre}</span>}
          {common !== null && <span className={styles.common} title={`${common}% of this text's running words are among the 516 core words, the commonest in Greek`}>{common}% common words</span>}
          {tr ? <span className={styles.badge}>English</span> : <span className={`${styles.badge} ${styles.off}`}>Greek only</span>}
          <span className={styles.go} aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  );
}
