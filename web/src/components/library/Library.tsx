"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex, type CatAuthor, type CatWork } from "@/lib/catalog";
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

function WorkItem({ w, author }: { w: CatWork; author?: CatAuthor }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  return (
    <li className={styles.work}>
      <Link href={readHref(w)} transitionTypes={["page-turn"]} className={styles.workLink}>
        <span className={styles.workTitle}>{author && <span className={styles.byline}>{author.name}, </span>}{w.title}</span>
        {grc?.label && grc.label !== w.title && <span className={styles.workGr} lang="grc">{grc.label}</span>}
      </Link>
      <span className={styles.meta}>
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
  const query = useDeferredValue(q);
  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setError(e.message)); }, []);

  const selected = params.get("a");
  const authors = useMemo(() => idx?.catalog.authors ?? [], [idx]);

  const visibleAuthors = useMemo(() => authors.filter((a) => !onlyEnglish || a.works.some(hasTranslation)), [authors, onlyEnglish]);
  const author = idx && selected ? idx.author.get(selected) : undefined;

  const matches = useMemo(() => {
    const f = fold(query.trim());
    if (f.length < 2 || !idx) return null;
    const works: { w: CatWork; a: CatAuthor }[] = [];
    for (const a of authors) for (const w of a.works) {
      if (onlyEnglish && !hasTranslation(w)) continue;
      const hay = fold(`${a.name} ${w.title} ${greekEditions(w)[0]?.label ?? ""}`);
      if (hay.includes(f)) works.push({ w, a });
    }
    return works;
  }, [query, idx, authors, onlyEnglish]);

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

        {matches ? (
          <div className={styles.results}>
            <p className="muted">{matches.length ? `${matches.length} work${matches.length === 1 ? "" : "s"} found` : "Nothing found. Try fewer letters, or search in English."}</p>
            <ul className={styles.works}>{matches.slice(0, 200).map(({ w, a }) => <WorkItem key={w.id} w={w} author={a} />)}</ul>
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
                    {author.works.filter((w) => !onlyEnglish || hasTranslation(w)).map((w) => <WorkItem key={w.id} w={w} />)}
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
