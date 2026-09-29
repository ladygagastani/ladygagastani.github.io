"use client";
/**
 * The Wiki's Authors index: every author in the library, by period and by kind of writing, with a search.
 * Dates, places and descriptions come from Wikidata (lib/authors-meta.ts); where Wikidata has no date, the
 * span GLAUx gives for the author's works is used and marked †. Authors no source dates (anonymous works,
 * collections) are listed last, not guessed.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, fold, type CatalogIndex } from "@/lib/catalog";
import { loadWorksMeta, type WorkMeta } from "@/lib/works-meta";
import { ERAS, KINDS, authorRows, eraById, loadAuthorsMeta, type AuthorMeta, type AuthorRow, type Era } from "@/lib/authors-meta";
import styles from "./WikiIndex.module.css";

type Row = AuthorRow;
const NONE = "none";
const num = (n: number) => n.toLocaleString("en-GB");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function WikiAuthors() {
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [meta, setMeta] = useState<Record<string, AuthorMeta>>({});
  const [wmeta, setWmeta] = useState<Record<string, WorkMeta>>({});
  const [failed, setFailed] = useState(false);
  // a period, kind or search handed over by a link (/stoa/authors?e=classical&k=Drama)
  const params = useSearchParams();
  const e0 = params.get("e"), k0 = params.get("k");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [era, setEra] = useState(e0 && (e0 === NONE || eraById(e0)) ? e0 : "");
  const [kind, setKind] = useState(k0 && KINDS.some(([id]) => id === k0) ? k0 : "");
  useEffect(() => { loadCatalog().then(setIdx, () => setFailed(true)); loadAuthorsMeta().then(setMeta); loadWorksMeta().then(setWmeta); }, []);
  const keep = (e: string, k: string) => {
    const p = new URLSearchParams();
    if (e) p.set("e", e);
    if (k) p.set("k", k);
    history.replaceState(null, "", p.size ? `?${p}` : location.pathname);
  };
  const pickEra = (v: string) => { const n = era === v ? "" : v; setEra(n); keep(n, kind); };
  const pickKind = (v: string) => { const n = kind === v ? "" : v; setKind(n); keep(era, n); };

  const rows = useMemo<Row[]>(() => (idx ? authorRows(idx.catalog.authors, meta, wmeta) : []), [idx, meta, wmeta]);

  const query = fold(q.trim());
  const terms = query.split(/\s+/).filter(Boolean);
  const matchesQuery = (r: Row) => { const hay = fold(`${r.a.name} ${r.meta?.desc ?? ""} ${r.meta?.place ?? ""}`); return terms.every((t) => hay.includes(t)); };
  const eraKey = (r: Row) => r.era?.id ?? NONE;
  const shown = rows.filter((r) => matchesQuery(r) && (!era || eraKey(r) === era) && (!kind || r.kinds.includes(kind)));
  const eraCount = (id: string) => rows.filter((r) => matchesQuery(r) && (!kind || r.kinds.includes(kind)) && (id === "" || eraKey(r) === id)).length;
  const kindCount = (id: string) => rows.filter((r) => matchesQuery(r) && (!era || eraKey(r) === era) && (id === "" || r.kinds.includes(id))).length;

  const groups: { id: string; era: Era | null; rows: Row[] }[] = [
    ...ERAS.map((e) => ({ id: e.id, era: e, rows: shown.filter((r) => eraKey(r) === e.id).sort((x, y) => (x.year ?? 0) - (y.year ?? 0) || x.a.name.localeCompare(y.a.name)) })),
    { id: NONE, era: null, rows: shown.filter((r) => eraKey(r) === NONE).sort((x, y) => x.a.name.localeCompare(y.a.name)) },
  ].filter((g) => g.rows.length);

  if (failed) return <div className="wrap"><p className={styles.empty} role="alert">The catalogue could not be opened. Check your connection and try again.</p></div>;
  if (!idx) return <div className="wrap"><p className={styles.empty}>Opening the catalogue…</p></div>;

  return (
    <div className={`wrap ${styles.page}`}>
      <div className={styles.search} role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input type="search" enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search authors by name, place or what they wrote" aria-label="Search authors" />
      </div>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <span className="label">Period</span>
          <div className={styles.chips}>
            <button type="button" className="chip" aria-pressed={!era} onClick={() => { setEra(""); keep("", kind); }}>All <small>{num(eraCount(""))}</small></button>
            {ERAS.map((e) => <button key={e.id} type="button" className="chip" aria-pressed={era === e.id} disabled={!eraCount(e.id) && era !== e.id} onClick={() => pickEra(e.id)}>{e.name} <small>{num(eraCount(e.id))}</small></button>)}
            <button type="button" className="chip" aria-pressed={era === NONE} disabled={!eraCount(NONE) && era !== NONE} onClick={() => pickEra(NONE)}>Not dated <small>{num(eraCount(NONE))}</small></button>
          </div>
        </div>
        <div className={styles.filterRow}>
          <span className="label">Writing</span>
          <div className={styles.chips}>
            <button type="button" className="chip" aria-pressed={!kind} onClick={() => { setKind(""); keep(era, ""); }}>All <small>{num(kindCount(""))}</small></button>
            {KINDS.map(([id, label]) => <button key={id} type="button" className="chip" aria-pressed={kind === id} disabled={!kindCount(id) && kind !== id} onClick={() => pickKind(id)}>{label} <small>{num(kindCount(id))}</small></button>)}
          </div>
        </div>
      </div>

      <p className={styles.count} aria-live="polite">{num(shown.length)} {shown.length === 1 ? "author" : "authors"}</p>
      {shown.length === 0 && <p className={styles.empty}>No author matches. Try fewer filters or a shorter search.</p>}

      {groups.map((g) => (
        <section key={g.id} className={styles.group} aria-labelledby={`ah-${g.id}`}>
          <div className={styles.groupHead}>
            <h2 id={`ah-${g.id}`}>{g.era ? g.era.name : "Not dated"}</h2>
            <span>{g.era ? g.era.span : "Anonymous works, collections and authors that no source dates"} · {num(g.rows.length)}</span>
          </div>
          <ul className={styles.list}>
            {g.rows.map((r) => (
              <li key={r.a.id}>
                <Link className={styles.row} href={`/library/author?a=${r.a.id}`} transitionTypes={["page-turn"]}>
                  <span className={styles.who}>
                    <span className={styles.nameLine}>
                      <span className={styles.name}>{r.a.name}</span>
                      {r.span && <span className={styles.when} title={r.estimated ? "From the dates GLAUx gives for this author's works" : "From Wikidata"}>{r.span}{r.estimated ? " †" : ""}</span>}
                    </span>
                    {(r.meta?.desc || r.meta?.place) && <span className={styles.desc}>{r.meta?.desc ? cap(r.meta.desc) : ""}{r.meta?.desc && r.meta?.place ? " · " : ""}{r.meta?.place ? `born at ${r.meta.place}` : ""}</span>}
                  </span>
                  <span className={styles.meta}>
                    {r.kinds.slice(0, 2).map((k) => <span key={k} className={styles.kind}>{k}</span>)}
                    <span>{r.works} {r.works === 1 ? "work" : "works"}{r.english ? ` · ${r.english} in English` : ""}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className={styles.credit}>
        Dates, birthplaces and descriptions are from <a href="https://www.wikidata.org" target="_blank" rel="noreferrer noopener">Wikidata</a> (CC0), matched to each author by their TLG number.
        An author is placed in a period by the middle of their adult life (from age 25 to death), or by their floruit (the time they were active) where Wikidata gives one; ancient dates are often approximate, so only centuries are shown.
        † marks a span taken from GLAUx&apos;s dating of the author&apos;s works, where Wikidata has none. The periods are the usual conventions:
        {" "}{ERAS.map((e) => `${e.name} ${e.span}`).join("; ")}.
      </p>
    </div>
  );
}
