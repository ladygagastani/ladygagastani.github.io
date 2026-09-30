"use client";
/**
 * The Painted Stoa's front: a colonnade of painted panels, one per category, each listing its
 * entries, with a search across every entry and a featured entry that changes each day.
 */
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { fold } from "@/lib/catalog";
import { ENTRIES, entriesIn } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";
import { CATEGORIES } from "@/wiki/types";
import { IMAGES, srcSet } from "@/wiki/images";
import CategoryIcon from "./CategoryIcon";
import styles from "./Stoa.module.css";

const text = (s: string) => plain(inline(s));
const noSubscribe = () => () => {};
/** What a search looks in, folded once: the title, the hook and the whole text of each entry (not only its opening). */
const HAYSTACK = ENTRIES.map((e) => ({ e, hay: fold(`${e.title} ${e.greek ?? ""} ${e.kicker} ${text(e.hook)} ${e.body}`) }));

/** A reference page the Wiki offers besides its entries (Authors, Eras, Editions). */
export interface RefCard { href: string; title: string; greek: string; blurb: string }

/** A search handed over from Quick search (/stoa?q=…), also when this page is already open. */
function QueryFromUrl({ onQuery }: { onQuery: (q: string) => void }) {
  const v = useSearchParams().get("q");
  useEffect(() => { if (v) onQuery(v); }, [v, onQuery]);
  return null;
}

export default function StoaIndex({ reference = [] }: { reference?: RefCard[] }) {
  const [q, setQ] = useState("");
  const n = fold(q).trim();
  const found = useMemo(() => (n ? HAYSTACK.filter((h) => h.hay.includes(n)).map((h) => h.e) : []), [n]);
  // one entry featured each day, the same for everyone (by date, not at random); the built page shows the first
  const day = useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 864e5), () => 0);
  const featured = ENTRIES.length ? [...ENTRIES].sort((a, b) => a.slug.localeCompare(b.slug))[day % ENTRIES.length] : null;
  const pic = featured?.image ? IMAGES[featured.image] : undefined;

  return (
    <div className={`wrap ${styles.index}`}>
      <Suspense fallback={null}><QueryFromUrl onQuery={setQ} /></Suspense>
      <div className={styles.searchRow} role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input enterKeyHint="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search all ${ENTRIES.length} entries: Melos, plague…`} aria-label="Search the Painted Stoa" />
      </div>
      {n && (
        <section className={styles.found} aria-live="polite">
          <p className="label">{found.length} {found.length === 1 ? "entry" : "entries"}</p>
          <ul>{found.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}><b>{e.title}</b> <span>{e.kicker}</span></Link></li>)}</ul>
        </section>
      )}

      {featured && !n && (
        <Link href={`/stoa/${featured.slug}`} className={styles.featured} transitionTypes={["page-turn"]} data-pic={pic ? "" : undefined}>
          <span className={styles.featuredText}>
            <span className="label">On the wall today · {CATEGORIES.find((c) => c.id === featured.category)!.title}</span>
            <b>{featured.title}</b>
            <span className={styles.featuredHook}>{text(featured.hook)}</span>
            <span className={styles.featuredGo}>Read the entry →</span>
          </span>
          {pic
            // eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service
            ? <img className={styles.featuredPic} data-whole={pic.height > pic.width * 0.9 ? "" : undefined} src={`/images/${pic.file}`} srcSet={srcSet(pic)} sizes="(max-width: 760px) 100vw, 420px" alt={pic.alt} title={`${pic.title} · ${pic.sourceName} · ${pic.licence}`} width={pic.width} height={pic.height} loading="lazy" decoding="async" />
            : <span className={styles.featuredIcon}><CategoryIcon id={featured.category} /></span>}
        </Link>
      )}

      {!n && reference.length > 0 && (
        <nav className={styles.reference} aria-labelledby="ref-h">
          <h2 id="ref-h" className="label">Reference</h2>
          <ul>
            {reference.map((r) => (
              <li key={r.href}>
                <Link href={r.href} transitionTypes={["page-turn"]}>
                  <span className={styles.refGr} lang="grc">{r.greek}</span>
                  <b>{r.title}</b>
                  <span>{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ol className={styles.colonnade}>
        {CATEGORIES.map((c, i) => {
          const es = entriesIn(c.id);
          return (
            <li key={c.id} id={c.id} className={styles.panel} style={{ "--i": i } as React.CSSProperties}>
              <div className={styles.panelIn}>
                <span className={styles.roundel}><CategoryIcon id={c.id} /></span>
                <h2>{c.href ? <Link href={c.href} transitionTypes={["page-turn"]}>{c.title}</Link> : c.title}</h2>
                <p className={styles.blurb}>{c.blurb}</p>
                {es.length > 0
                  ? <ul>{es.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}>{e.title}</Link></li>)}</ul>
                  : <p className={styles.soonLine}>Entries in preparation.</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
