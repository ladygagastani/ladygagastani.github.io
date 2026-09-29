"use client";
/**
 * The Wiki's Eras page: "Greek through the centuries", a column per century (works by the authors placed there),
 * and a section per period with what the library holds from it. All counted from the catalogue, Wikidata's dates
 * and GLAUx's dialects (lib/eras.ts); no prose about the periods is written here that a source does not back.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { loadWorksMeta, type WorkMeta } from "@/lib/works-meta";
import { ERAS, KINDS, authorRows, eraOfYear, loadAuthorsMeta, type AuthorMeta } from "@/lib/authors-meta";
import { centuryBars, eraStats } from "@/lib/eras";
import styles from "./WikiEras.module.css";
import idx from "./WikiIndex.module.css";

const num = (n: number) => n.toLocaleString("en-GB");
const kindLabel = (id: string) => KINDS.find(([k]) => k === id)?.[1] ?? id;
/** "5th c. BC" → "5 BC" for a narrow axis */
const short = (label: string) => { const m = /^(\d+)\w+ c\. (BC|AD)$/.exec(label); return m ? `${m[1]} ${m[2]}` : label; };

export default function WikiEras() {
  const [cat, setCat] = useState<CatalogIndex | null>(null);
  const [meta, setMeta] = useState<Record<string, AuthorMeta>>({});
  const [wmeta, setWmeta] = useState<Record<string, WorkMeta>>({});
  const [failed, setFailed] = useState(false);
  useEffect(() => { loadCatalog().then(setCat, () => setFailed(true)); loadAuthorsMeta().then(setMeta); loadWorksMeta().then(setWmeta); }, []);

  const rows = useMemo(() => (cat ? authorRows(cat.catalog.authors, meta, wmeta) : []), [cat, meta, wmeta]);
  const stats = useMemo(() => eraStats(rows), [rows]);
  const bars = useMemo(() => centuryBars(rows, eraOfYear), [rows]);
  const undated = rows.filter((r) => !r.era);
  const max = Math.max(1, ...bars.map((b) => b.works));

  if (failed) return <div className="wrap"><p className={idx.empty} role="alert">The catalogue could not be opened. Check your connection and try again.</p></div>;
  if (!cat) return <div className="wrap"><p className={idx.empty}>Opening the catalogue…</p></div>;

  // the axis groups the columns by period: each period's label spans its columns
  const bands: { era: (typeof ERAS)[number]; n: number }[] = [];
  for (const b of bars) { const last = bands[bands.length - 1]; if (last && last.era.id === b.era.id) last.n++; else bands.push({ era: b.era, n: 1 }); }

  return (
    <div className={`wrap ${idx.page}`}>
      <section aria-labelledby="chart-h" className={styles.chartBox}>
        <h2 id="chart-h" className={styles.h2}>Greek through the centuries</h2>
        <p className={idx.note}>
          One column for each century: how many works the library holds by the authors placed in it. The number above a column is that count.
          {" "}{num(undated.length)} authors ({num(undated.reduce((n, r) => n + r.works, 0))} works) are left out because no source dates them: anonymous works, collections and the like.
        </p>
        <div className={styles.scroll} tabIndex={0} role="group" aria-label="Works by century">
          <ol className={styles.chart}>
            {bars.map((b, i) => (
              <li key={b.key} className={styles.col} data-era={ERAS.findIndex((e) => e.id === b.era.id) % 2}
                title={`${b.label}: ${num(b.works)} works by ${num(b.authors)} authors`} aria-label={`${b.label}: ${num(b.works)} works by ${num(b.authors)} authors`}>
                <span className={styles.value}>{b.works ? num(b.works) : ""}</span>
                <span className={styles.bar} style={{ "--h": `${(b.works / max) * 100}%`, "--i": i } as React.CSSProperties} />
                <span className={styles.tick}>{short(b.label)}</span>
              </li>
            ))}
          </ol>
          <div className={styles.bands} style={{ gridTemplateColumns: bands.map((b) => `${b.n}fr`).join(" ") }}>
            {bands.map((b) => <span key={b.era.id} data-era={ERAS.findIndex((e) => e.id === b.era.id) % 2}>{b.era.name}</span>)}
          </div>
        </div>
      </section>

      <ol className={styles.eras}>
        {stats.map((s) => (
          <li key={s.era.id} id={s.era.id} className={styles.era}>
            <div className={styles.eraHead}>
              <h2>{s.era.name}</h2>
              <span>{s.era.span}</span>
            </div>
            <dl className={styles.counts}>
              <div><dt>{num(s.authors)}</dt><dd>authors</dd></div>
              <div><dt>{num(s.works)}</dt><dd>works</dd></div>
              <div><dt>{num(s.english)}</dt><dd>in English</dd></div>
            </dl>
            {s.biggest.length > 0 && (
              <div>
                <p className="label">Best represented</p>
                <ul className={styles.plain}>
                  {s.biggest.map(({ row, works }) => (
                    <li key={row.a.id}><Link href={`/library/author?a=${row.a.id}`} transitionTypes={["page-turn"]}>{row.a.name}</Link> <span>{num(works)} {works === 1 ? "work" : "works"}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {s.kinds.length > 0 && (
              <div>
                <p className="label">Kinds of writing</p>
                <div className={styles.kinds}>
                  {s.kinds.slice(0, 6).map(([k, n]) => (
                    <Link key={k} className="chip" href={`/stoa/authors?e=${s.era.id}&k=${encodeURIComponent(k)}`} transitionTypes={["page-turn"]}>{kindLabel(k)} <small>{num(n)}</small></Link>
                  ))}
                </div>
              </div>
            )}
            {s.dialects.length > 0 && (
              <p className={idx.note}>
                <b>Dialects</b>, where GLAUx classifies the works ({num(s.covered)} of {num(s.works)}): {s.dialects.map(([d, n]) => `${d} ${num(n)}`).join(" · ")}.
              </p>
            )}
            <Link className={styles.all} href={`/stoa/authors?e=${s.era.id}`} transitionTypes={["page-turn"]}>All {num(s.authors)} authors of this period →</Link>
          </li>
        ))}
      </ol>

      <p className={idx.credit}>
        Counts are made from the library&apos;s catalogue. An author is placed in a period by the middle of their adult life (from age 25 to death), or by their floruit where
        <a href="https://www.wikidata.org" target="_blank" rel="noreferrer noopener"> Wikidata</a> (CC0) gives one; where Wikidata has no date, by the span GLAUx gives for their works.
        The periods are the usual conventions and their edges are not sharp: a language does not change on a set day. A period can hold fewer authors than you might expect only because the library holds
        just what survives in the Perseus and First1KGreek collections.
      </p>
    </div>
  );
}
