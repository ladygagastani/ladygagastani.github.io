"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex, type CatAuthor, type CatWork } from "@/lib/catalog";
import { loadWorksMeta, FAMILIES, PERIODS, familyOf, periodOf, centuries, type WorkMeta } from "@/lib/works-meta";
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

const readHref = (w: CatWork) => `/read?w=${w.id}`;
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

function WorkItem({ w, author, meta }: { w: CatWork; author?: CatAuthor; meta?: WorkMeta }) {
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
        {grc && <span>{kb(grc.size)}</span>}
      </span>
    </li>
  );
}

export default function Library() {
  const params = useSearchParams();
  const router = useRouter();
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlyEnglish, setOnlyEnglish] = useState(false);
  const [family, setFamily] = useState("");
  const [period, setPeriod] = useState("");
  const [dialect, setDialect] = useState("");
  const [meta, setMeta] = useState<Record<string, WorkMeta>>({});
  const query = useDeferredValue(q);
  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setError(e.message)); loadWorksMeta().then(setMeta); }, []);
  const dialects = useMemo(() => [...new Set(Object.values(meta).map((m) => m.dialect).filter((d): d is string => !!d))].sort(), [meta]);
  const filtering = !!(family || period || dialect);

  const selected = params.get("a");
  const authors = useMemo(() => idx?.catalog.authors ?? [], [idx]);

  /** Does a work pass the chosen filters? */
  const keep = useMemo(() => (w: CatWork) => {
    if (onlyEnglish && !hasTranslation(w)) return false;
    const m = meta[w.id];
    if (family && familyOf(m?.genre ?? null) !== family) return false;
    if (period && periodOf(m?.from ?? null) !== period) return false;
    if (dialect && m?.dialect !== dialect) return false;
    return true;
  }, [onlyEnglish, family, period, dialect, meta]);
  const visibleAuthors = useMemo(() => authors.filter((a) => a.works.some(keep)), [authors, keep]);
  const author = idx && selected ? idx.author.get(selected) : undefined;

  const matches = useMemo(() => {
    const f = fold(query.trim());
    if ((f.length < 2 && !filtering) || !idx) return null;
    const works: { w: CatWork; a: CatAuthor }[] = [];
    for (const a of authors) for (const w of a.works) {
      if (!keep(w)) continue;
      if (f.length >= 2 && !fold(`${a.name} ${w.title} ${greekEditions(w)[0]?.label ?? ""}`).includes(f)) continue;
      works.push({ w, a });
    }
    return works;
  }, [query, idx, authors, keep, filtering]);

  const stats = useMemo(() => ({
    authors: authors.length,
    works: authors.reduce((n, a) => n + a.works.length, 0),
    english: authors.reduce((n, a) => n + a.works.filter(hasTranslation).length, 0),
  }), [authors]);

  const pick = (id: string) => router.replace(`/library?a=${id}`, { scroll: false });

  // keep the chosen author visible in the list (for example when arriving from the reader)
  useEffect(() => {
    if (!idx || !selected) return;
    document.querySelector(`[data-author="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [idx, selected]);

  if (error) return <p className={`wrap ${styles.error}`}>{error}</p>;

  return (
    <div className={styles.lib}>
      <section className="wrap">
        <div className={styles.start}>
          <div className={styles.startHead}>
            <span className="label">Where to begin</span>
            <p className="muted">Our suggestions, by how hard the Greek is.</p>
          </div>
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
      </section>

      <section className="wrap" aria-labelledby="browse-title">
        <div className={styles.browseHead}>
          <h2 id="browse-title">All texts</h2>
          <p className="muted">
            {idx ? `${stats.authors} authors · ${stats.works} works · ${stats.english} with an English translation` : "Opening the catalogue…"}
          </p>
        </div>
        <div className={styles.tools}>
          <input id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search authors and works, in English or Greek (accents optional)" aria-label="Search the library" />
          <button type="button" className="chip" aria-pressed={onlyEnglish} onClick={() => setOnlyEnglish(!onlyEnglish)}>
            <span className="dot" />With English translation
          </button>
        </div>
        <div className={styles.filters} role="group" aria-label="Filters">
          <label><span className="label">Genre</span>
            <select id="library-genre" value={family} onChange={(e) => setFamily(e.target.value)}>
              <option value="">All genres</option>
              {FAMILIES.map(([f]) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label><span className="label">Period</span>
            <select id="library-period" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="">All periods</option>
              {PERIODS.map(([p]) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label><span className="label">Dialect</span>
            <select id="library-dialect" value={dialect} onChange={(e) => setDialect(e.target.value)}>
              <option value="">All dialects</option>
              {dialects.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          {filtering && <button type="button" className="chip" onClick={() => { setFamily(""); setPeriod(""); setDialect(""); }}>Clear filters</button>}
          <p className={styles.small}>Genre, period and dialect come from the GLAUx corpus and cover {Object.keys(meta).length.toLocaleString("en-GB")} works; dates are by century.</p>
        </div>

        {matches ? (
          <div className={styles.results}>
            <p className="muted">{matches.length ? `${matches.length} work${matches.length === 1 ? "" : "s"} found` : "Nothing found. Try fewer letters, or search in English."}</p>
            <ul className={styles.works}>{matches.slice(0, 200).map(({ w, a }) => <WorkItem key={w.id} w={w} author={a} meta={meta[w.id]} />)}</ul>
            {matches.length > 200 && <p className="muted">Showing the first 200. Add more letters to narrow the search.</p>}
          </div>
        ) : (
          <div className={styles.browse}>
            <nav className={styles.authors} aria-label="Authors">
              <ul>
                {visibleAuthors.map((a) => (
                  <li key={a.id}>
                    <button type="button" data-author={a.id} onClick={() => pick(a.id)} aria-current={a.id === selected ? "true" : undefined}>
                      <span>{a.name}</span><small>{a.works.length}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.detail} aria-live="polite">
              {author ? (
                <>
                  <h3>{author.name}</h3>
                  <p className="muted">{author.works.length} work{author.works.length === 1 ? "" : "s"} in the collections</p>
                  <ul className={styles.works}>
                    {author.works.filter(keep).map((w) => <WorkItem key={w.id} w={w} meta={meta[w.id]} />)}
                  </ul>
                </>
              ) : (
                <div className={styles.empty}>
                  <p className={styles.emptyGr} lang="grc">βιβλία</p>
                  <p className="muted">Choose an author to see their works, or search above.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
