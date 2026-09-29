"use client";
/**
 * An author's page: everything the site knows about them from real data, and nothing invented.
 * Dates, kinds of writing and dialect come from GLAUx (by century of the author's life); the works
 * from the catalogue; "Where to begin" is the work with the most familiar vocabulary (see
 * lib/difficulty.ts, vocabulary only); the entries are the Painted Stoa's, which cite this author.
 * "Why they matter" is left to those entries: no author blurbs are written here.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, hasTranslation, type CatalogIndex } from "@/lib/catalog";
import { centuries, DATE_NOTE, loadWorksMeta, type WorkMeta } from "@/lib/works-meta";
import { commonShare, loadDifficulty } from "@/lib/difficulty";
import { AREAS } from "@/config/areas";
import { WorkItem } from "./Library";
import lib from "./Library.module.css";
import styles from "./AuthorProfile.module.css";

export interface RelatedEntry { slug: string; title: string; kicker: string; hook: string }

const num = (n: number) => n.toLocaleString("en-GB");

export default function AuthorProfile({ related }: { related: Record<string, RelatedEntry[]> }) {
  const id = useSearchParams().get("a");
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [meta, setMeta] = useState<Record<string, WorkMeta>>({});
  const [diff, setDiff] = useState<Record<string, [number, number]>>({});
  const [failed, setFailed] = useState(false);
  useEffect(() => { loadCatalog().then(setIdx, () => setFailed(true)); loadWorksMeta().then(setMeta); loadDifficulty().then(setDiff); }, []);

  const author = idx && id ? idx.author.get(id) : undefined;
  const facts = useMemo(() => {
    if (!author) return null;
    const ms = author.works.map((w) => meta[w.id]).filter((m): m is WorkMeta => !!m);
    const froms = ms.map((m) => m.from).filter((x): x is number => x !== null);
    const tos = ms.map((m) => m.to).filter((x): x is number => x !== null);
    const genres = new Map<string, number>();
    for (const m of ms) if (m.genre) genres.set(m.genre, (genres.get(m.genre) ?? 0) + 1);
    const dialects = [...new Set(ms.map((m) => m.dialect).filter((d): d is string => !!d))];
    const words = ms.reduce((n, m) => n + (m.tokens ?? 0), 0);
    return {
      when: froms.length && tos.length ? centuries(Math.min(...froms), Math.max(...tos)) : null,
      genres: [...genres].sort((a, b) => b[1] - a[1]),
      dialects, words,
      english: author.works.filter(hasTranslation).length,
    };
  }, [author, meta]);

  // where to begin: the works with an English translation whose words are the most familiar
  const begin = useMemo(() => {
    if (!author) return [];
    return author.works
      .map((w) => ({ w, p: commonShare(diff[w.id]) }))
      .filter((x): x is { w: typeof x.w; p: number } => x.p !== null && hasTranslation(x.w))
      .sort((a, b) => b.p - a.p).slice(0, 3);
  }, [author, diff]);

  if (failed) return <div className="wrap"><p className={styles.msg} role="alert">The catalogue could not be opened. Check your connection and try again.</p></div>;
  if (!idx) return <div className="wrap"><p className={styles.msg}>Opening the catalogue…</p></div>;
  if (!author || !facts) {
    return (
      <div className="wrap">
        <p className={styles.crumb}><Link href={AREAS.library.href}>← {AREAS.library.name}</Link></p>
        <h1 className={`page-title ${styles.name}`}>No such author</h1>
        <p className={styles.msg}>That author is not in the catalogue. <Link href={AREAS.library.href}>Browse the library</Link>.</p>
      </div>
    );
  }
  const entries = related[author.id] ?? [];
  return (
    <div className={`wrap ${styles.page}`}>
      <p className={styles.crumb}><Link href={AREAS.library.href}>← {AREAS.library.name} · {AREAS.library.english}</Link></p>
      <header className={styles.head}>
        <div className="area-kicker"><span className="tongues draw" aria-hidden="true" /><span className="label">Author</span></div>
        <h1 className={`page-title ${styles.name}`}>{author.name}</h1>
        <dl className={styles.facts}>
          {facts.when && <div><dt>Wrote in</dt><dd title={DATE_NOTE}>{facts.when}</dd></div>}
          {facts.genres.length > 0 && <div><dt>Kinds of writing</dt><dd>{facts.genres.map(([g, n]) => `${g}${n > 1 ? ` (${n})` : ""}`).join(", ")}</dd></div>}
          {facts.dialects.length > 0 && <div><dt>Dialect</dt><dd>{facts.dialects.join(", ")}</dd></div>}
          <div><dt>In the library</dt><dd>{author.works.length} work{author.works.length === 1 ? "" : "s"}, {facts.english} with an English translation{facts.words > 0 ? `; ${num(facts.words)} words analysed` : ""}</dd></div>
        </dl>
        {!facts.when && <p className={styles.note}>GLAUx, the source of the dates and kinds of writing, does not analyse this author&apos;s texts, so none are shown. Nothing is guessed.</p>}
      </header>
      <div><div className="meander draw" aria-hidden="true" /></div>

      {begin.length > 0 && author.works.length > 3 && (
        <section className={styles.sec} aria-labelledby="begin-title">
          <h2 id="begin-title">Where to begin</h2>
          <p className="muted">The works here with a translation and the most familiar vocabulary: the fewest rare words to look up. That is vocabulary only; grammar, dialect and ideas may still be demanding.</p>
          <ul className={lib.works}>
            {begin.map(({ w, p }) => <WorkItem key={w.id} w={w} meta={meta[w.id]} common={p} />)}
          </ul>
        </section>
      )}

      <section className={styles.sec} aria-labelledby="works-title">
        <h2 id="works-title">What {author.name} wrote</h2>
        <ul className={lib.works}>
          {author.works.map((w) => <WorkItem key={w.id} w={w} meta={meta[w.id]} common={commonShare(diff[w.id])} />)}
        </ul>
      </section>

      {entries.length > 0 && (
        <section className={styles.sec} aria-labelledby="stoa-title">
          <h2 id="stoa-title">In {AREAS.wiki.name}</h2>
          <p className="muted">Entries that quote or point to {author.name}'s Greek.</p>
          <div className={styles.cards}>
            {entries.map((e) => (
              <Link key={e.slug} href={`/stoa/${e.slug}`} className={styles.card} transitionTypes={["page-turn"]}>
                <span className="label">{e.kicker}</span>
                <b>{e.title}</b>
                <span>{e.hook}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.sec} aria-labelledby="more-title">
        <h2 id="more-title">More</h2>
        <ul className={styles.links}>
          <li><Link href={`/stoa/census?c=word&a=${author.id}`}>The most mentioned words in {author.name}</Link> <span className="muted">(the Census)</span></li>
          <li><Link href={`/treasury?s=authors&a=${author.id}`}>Your own notes on {author.name}</Link> <span className="muted">(the Treasury)</span></li>
        </ul>
      </section>
    </div>
  );
}
