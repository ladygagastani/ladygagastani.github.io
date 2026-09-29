"use client";
/**
 * The Painted Stoa's front: a colonnade of painted panels, one per category, each listing its
 * entries, with a search across every entry and a featured entry that changes each day.
 */
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { fold } from "@/lib/catalog";
import { ENTRIES, entriesIn } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";
import { CATEGORIES } from "@/wiki/types";
import styles from "./Stoa.module.css";

const text = (s: string) => plain(inline(s));
const noSubscribe = () => () => {};
/** What a search looks in, folded once: the title, the hook and the whole text of each entry (not only its opening). */
const HAYSTACK = ENTRIES.map((e) => ({ e, hay: fold(`${e.title} ${e.greek ?? ""} ${e.kicker} ${text(e.hook)} ${e.body}`) }));

export default function StoaIndex() {
  const [q, setQ] = useState("");
  const n = fold(q).trim();
  const found = useMemo(() => (n ? HAYSTACK.filter((h) => h.hay.includes(n)).map((h) => h.e) : []), [n]);
  // a search handed over from Quick search (/stoa?q=…)
  useEffect(() => { const v = new URLSearchParams(location.search).get("q"); if (v) setQ(v); }, []);
  // one entry featured each day, the same for everyone (by date, not at random); the built page shows the first
  const day = useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 864e5), () => 0);
  const featured = ENTRIES.length ? [...ENTRIES].sort((a, b) => a.slug.localeCompare(b.slug))[day % ENTRIES.length] : null;

  return (
    <div className={`wrap ${styles.index}`}>
      <div className={styles.searchRow}>
        <input enterKeyHint="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${ENTRIES.length === 1 ? "the entry" : `${ENTRIES.length} entries`} in full: Melos, plague, ostracism…`} aria-label="Search the Painted Stoa" />
      </div>
      {n && (
        <section className={styles.found} aria-live="polite">
          <p className="label">{found.length} {found.length === 1 ? "entry" : "entries"}</p>
          <ul>{found.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}><b>{e.title}</b> <span>{e.kicker}</span></Link></li>)}</ul>
        </section>
      )}

      {featured && !n && (
        <Link href={`/stoa/${featured.slug}`} className={styles.featured} transitionTypes={["page-turn"]}>
          <span className="label">On the wall today · {CATEGORIES.find((c) => c.id === featured.category)!.title}</span>
          <b>{featured.title}</b>
          <span className={styles.featuredHook}>{text(featured.hook)}</span>
          <span className={styles.featuredGo}>Read the entry →</span>
        </Link>
      )}

      <ol className={styles.colonnade}>
        {CATEGORIES.map((c, i) => {
          const es = entriesIn(c.id);
          return (
            <li key={c.id} id={c.id} className={styles.panel} style={{ "--i": i } as React.CSSProperties}>
              <div className={styles.panelIn}>
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
