"use client";
/**
 * One counted item: how often it is mentioned where you are looking and in the whole library, how
 * its use changes over the periods, who mentions it most, and where it clusters inside a work,
 * with links to Word Study, the map, the Painted Stoa and every mention in the Oracle.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtRate, groupInfo, groupOf, isName, oracleScope, phraseOccurrences, rate, type Category, type CensusMeta, type Scope } from "@/lib/census";
import { canonLemma, groupFreq, lexEntry, loadLexMeta, type LexEntry, type LexMeta } from "@/lib/lexicon";
import { loadCatalog } from "@/lib/catalog";
import { loadWorksMeta, familyOf, periodOf, PERIODS, type WorkMeta } from "@/lib/works-meta";
import { placeNamed } from "@/lib/map";
import { loadWordPack, type WordPack } from "@/lib/lookup/words";
import BarChart from "@/components/treasury/BarChart";
import { wordHref } from "@/components/treasury/data";
import { fmt, useLoad, type Links, type Shown } from "./shared";
import styles from "./Census.module.css";

/** The works a scope covers (null for the whole library). */
export function worksInScope(meta: CensusMeta, wm: Record<string, WorkMeta>, s: Scope): Set<string> | null {
  if (s.w) return new Set([s.w]);
  if (s.a) return new Set(meta.authors.find((a) => a[0] === s.a)?.[3].map(([w]) => w) ?? []);
  if (s.f === null && s.p === null) return null;
  const fam = s.f !== null ? meta.groups[`f${s.f}`]?.[0] : null;
  const per = s.p !== null ? meta.groups[`p${s.p}`]?.[0] : null;
  const out = new Set<string>();
  for (const [w, m] of Object.entries(wm)) {
    if (fam && familyOf(m.genre) !== fam) continue;
    if (per && periodOf(m.from) !== per) continue;
    out.add(w);
  }
  return out;
}

/** The works the Census counted and their sizes, in the shape of the Word Study index's list. */
function censusWorks(meta: CensusMeta): LexMeta {
  return { works: meta.authors.flatMap((a) => a[3].map(([w, , n]) => [w, n] as [string, number])), tags: [], lemmas: 0, forms: 0 };
}

export default function ItemPanel({ meta, cat, item, listed, scope, links, onClose }: {
  meta: CensusMeta; cat: Category; item: Shown; listed: number | null; scope: Scope; links: Links; onClose: () => void;
}) {
  const phrase = cat.id === "phrase";
  // a word's counts per work come from the Word Study index; a phrase's from the Census's own files
  const lex = useLoad(`lex|${item.text}`, () => Promise.all([lexEntry(item.text), loadLexMeta()]), !phrase);
  const occ = useLoad(`ph|${item.text}`, () => phraseOccurrences(item.text), phrase);
  const wm = useLoad("worksmeta", loadWorksMeta);
  const place = useLoad(`place|${item.text}`, () => placeNamed(item.text), cat.id === "place");
  const phraseWorks = useMemo(() => censusWorks(meta), [meta]);
  const lexMeta = phrase ? phraseWorks : lex.state === "done" ? lex.value[1] : null;
  // the Word Study index is not on every copy of the site (it is part of the downloadable word data)
  const noIndex = !phrase && lex.state === "done" && !lex.value[1];

  // the item's uses per work, as a Word Study entry (a phrase's come from the Census's own file)
  const entry: LexEntry | null = useMemo(() => {
    if (!lexMeta) return null;
    if (!phrase) return lex.state === "done" ? lex.value[0]?.entry ?? null : null;
    if (occ.state !== "done" || !occ.value) return null;
    const index = new Map(lexMeta.works.map(([w], i) => [w, i]));
    const w = occ.value.filter(([id]) => index.has(id)).map(([id, us]) => [index.get(id)!, us.length] as [number, number]);
    return { n: w.reduce((s, [, n]) => s + n, 0), f: [], w };
  }, [lex, occ, lexMeta, phrase]);

  const inScope = useMemo(() => {
    if (noIndex) return listed;
    if (!entry || !lexMeta || wm.state !== "done") return null;
    const set = worksInScope(meta, wm.value, scope);
    if (!set) return entry.n;
    return entry.w.reduce((s, [wi, n]) => s + (set.has(lexMeta.works[wi]?.[0]) ? n : 0), 0);
  }, [entry, lexMeta, wm, meta, scope, noIndex, listed]);

  const group = groupOf(scope);
  const info = groupInfo(meta, group);
  const oracle = phrase
    ? `/search?m=forms&q=${encodeURIComponent(item.text)}${oracleScope(meta, scope)}`
    : `/search?m=lemma&q=${encodeURIComponent(item.text)}${oracleScope(meta, scope)}`;
  const entries = [
    ...(links.byName[canonLemma(item.text)] ?? []),
    ...(place.state === "done" && place.value ? links.byPlace[place.value.id] ?? [] : []),
  ].filter((e, i, all) => all.findIndex((x) => x.slug === e.slug) === i);
  const failed = lex.state === "error" || occ.state === "error";

  return (
    <article className={styles.panel}>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close">✕</button>
      <p className="label">{cat.label}{item.auto && " · sorted automatically"}</p>
      <h2 lang="grc" className={styles.panelWord}>{item.text}</h2>
      {item.sub && <p className={styles.panelSub}>{item.sub}</p>}
      {cat.id === "place" && place.state === "done" && place.value && item.sub !== place.value.en && <p className={styles.panelSub}>{place.value.en}</p>}

      <dl className={styles.stats}>
        <div>
          <dt>{group === "all" ? "In the whole library" : `In ${info.label}`}</dt>
          <dd>{inScope === null ? "…" : fmt(inScope)}<small>{inScope !== null && info.words > 0 && `${fmtRate(rate(inScope, info.words))} per 10,000 words`}</small></dd>
        </div>
        {group !== "all" && !noIndex && (
          <div>
            <dt>In the whole library</dt>
            <dd>{entry ? fmt(entry.n) : "…"}<small>{entry && `in ${fmt(entry.w.length)} works`}</small></dd>
          </div>
        )}
      </dl>
      {failed && <p className={styles.warn}>The counts per work could not be loaded. Check the connection, then try again.</p>}
      {noIndex && <p className={styles.note}>How this word spreads over the periods and the works comes from the Word Study index, which this copy of the site does not have yet, so the charts cannot be shown here.</p>}
      {!failed && !noIndex && lex.state === "done" && !lex.value[0] && <p className={styles.warn}>Word Study has no entry for this word, so its spread cannot be shown.</p>}

      <nav className={styles.go} aria-label="More about it">
        <Link className="btn" href={oracle} transitionTypes={["page-turn"]}>Every mention <span className="arr">→</span></Link>
        {!phrase && <Link className="btn ghost" href={wordHref(item.text)} transitionTypes={["page-turn"]}>Word Study</Link>}
        {place.state === "done" && place.value && <Link className="btn ghost" href={`/stoa/periplus?p=${place.value.id}`} transitionTypes={["page-turn"]}>On the map</Link>}
      </nav>
      {entries.length > 0 && (
        <p className={styles.stoa}>In the Painted Stoa: {entries.map((e, i) => <span key={e.slug}>{i > 0 && " · "}<Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}>{e.title}</Link></span>)}</p>
      )}

      {entry && lexMeta && wm.state === "done" && <Spread entry={entry} lexMeta={lexMeta} wm={wm.value} />}
      {entry && lexMeta && wm.state === "done" && (
        <Clusters entry={entry} lexMeta={lexMeta} meta={meta} scope={scope} wm={wm.value} item={item} phrase={phrase}
          occ={occ.state === "done" ? occ.value : null} />
      )}
      <p className={styles.fine}>
        {phrase ? "Counted in exactly this form, inside one sentence." : isName(cat.id) ? "Counted by dictionary word: every form of the name, and everyone who bears it." : "Counted by dictionary word: every form together."}
        {" "}The Oracle searches the reader&apos;s own editions, so its totals can differ a little from GLAUx&apos;s.
      </p>
    </article>
  );
}

// ------------------------------------------------------------ over time, and who
function Spread({ entry, lexMeta, wm }: { entry: LexEntry; lexMeta: LexMeta; wm: Record<string, WorkMeta> }) {
  const idx = useLoad("catalog", loadCatalog);
  const periods = useMemo(() => {
    const f = groupFreq(entry, lexMeta, (w) => { const p = periodOf(wm[w]?.from ?? null); return p ? { key: p, label: p } : null; });
    return PERIODS.map(([p]) => f.find((x) => x.key === p)).filter((x): x is NonNullable<typeof x> => !!x && x.words > 0);
  }, [entry, lexMeta, wm]);
  const authors = useMemo(() => {
    if (idx.state !== "done") return null;
    return groupFreq(entry, lexMeta, (w) => { const a = idx.value.authorOf.get(w); return a ? { key: a.id, label: a.name } : null; })
      .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 6);
  }, [entry, lexMeta, idx]);
  return (
    <section className={styles.charts} aria-label="Over time, and who">
      <BarChart caption="Over time · per 10,000 words" unit="per 10,000 words" bars={periods.map((p) => ({
        key: p.key, label: p.label.split(" · ")[0], sub: p.label.split(" · ")[1], value: p.rate, valueText: fmtRate(p.rate),
        tip: `${fmt(p.n)} mentions in ${fmt(p.words)} words of this period`,
      }))} />
      {authors && authors.length > 0 && <BarChart caption="Who mentions it most" unit="mentions" bars={authors.map((a) => ({
        key: a.key, label: a.label, value: a.n,
        tip: `${fmt(a.n)} mentions; ${fmtRate(a.rate)} per 10,000 of the ${fmt(a.words)} words of ${a.label} that GLAUx analyses`,
      }))} />}
    </section>
  );
}

// ------------------------------------------------------------ where it clusters in a work
const canonCache = new WeakMap<WordPack, string[]>();

/** The most specific reference GLAUx gives a passage ("1.33" rather than "1"). */
function unitLabel(pack: WordPack, i: number): string {
  let best = "";
  for (const v of pack.units[i][0]) if (v && v.split(".").length >= best.split(".").length) best = v;
  return best;
}

/** The work cut into at most SLICES equal slices; each mark is the mentions in one slice. */
const SLICES = 150;
interface Strip { total: number; slices: number; hits: [number, number, string][]; books: [number, string][] }
function stripOf(pack: WordPack, key: string, units: number[] | null): Strip {
  const perUnit = new Map<number, number>();
  if (units) for (const u of units) perUnit.set(u, (perUnit.get(u) ?? 0) + 1);
  else {
    let canon = canonCache.get(pack);
    if (!canon) canonCache.set(pack, (canon = pack.lemmas.map(canonLemma)));
    pack.units.forEach((u, i) => { let c = 0; for (const l of u[3]) if (canon![l] === key) c++; if (c) perUnit.set(i, c); });
  }
  const total = pack.units.length;
  const slices = Math.min(total, SLICES);
  const slice = (u: number) => Math.min(slices - 1, Math.floor((u / total) * slices));
  const bins = new Map<number, { n: number; first: number; last: number }>();
  for (const [u, n] of [...perUnit].sort((a, b) => a[0] - b[0])) {
    const b = slice(u);
    const x = bins.get(b);
    if (x) { x.n += n; x.last = u; } else bins.set(b, { n, first: u, last: u });
  }
  const hits = [...bins].sort((a, b) => a[0] - b[0]).map(([b, x]): [number, number, string] => {
    const a = unitLabel(pack, x.first), z = unitLabel(pack, x.last);
    return [b, x.n, a === z ? a : `${a} – ${z}`];
  });
  const books: [number, string][] = [];
  let last: string | null = null;
  pack.units.forEach((_, i) => {
    const l = unitLabel(pack, i);
    const b = l.includes(".") ? l.split(".")[0] : null;
    if (b !== null && b !== last) { books.push([i / total, b]); last = b; }
  });
  return { total, slices, hits, books: books.length > 1 && books.length <= 60 ? books : [] };
}

function Clusters({ entry, lexMeta, meta, scope, wm, item, phrase, occ }: {
  entry: LexEntry; lexMeta: LexMeta; meta: CensusMeta; scope: Scope; wm: Record<string, WorkMeta>; item: Shown; phrase: boolean; occ: [string, number[]][] | null;
}) {
  const set = worksInScope(meta, wm, scope);
  const options = useMemo(() => {
    const all = entry.w.map(([wi, n]) => [lexMeta.works[wi][0], n] as [string, number]).sort((a, b) => b[1] - a[1]);
    const inside = set ? all.filter(([w]) => set.has(w)) : all;
    return (inside.length ? inside : all).slice(0, 15);
  }, [entry, lexMeta, set]);
  const [work, setWork] = useState<string | null>(null);
  const chosen = work && options.some(([w]) => w === work) ? work : options[0]?.[0] ?? null;
  const pack = useLoad(`pack|${chosen}`, () => loadWordPack(chosen!), !!chosen);
  const strip = useMemo(() => {
    if (pack.state !== "done" || !pack.value) return null;
    const units = phrase ? occ?.find(([w]) => w === chosen)?.[1] ?? [] : null;
    return stripOf(pack.value, canonLemma(item.text), units);
  }, [pack, phrase, occ, chosen, item.text]);
  const [hover, setHover] = useState<number | null>(null);
  if (!chosen) return null;
  const title = (w: string) => {
    const a = meta.authors.find((x) => w.startsWith(`${x[0]}.`));
    const t = a?.[3].find(([id]) => id === w)?.[1];
    return a ? `${a[1]}, ${t ?? w}` : w;
  };
  const max = strip ? Math.max(1, ...strip.hits.map(([, n]) => n)) : 1;
  const every = `/search?m=${phrase ? "forms" : "lemma"}&q=${encodeURIComponent(item.text)}&w=${chosen}`;
  const hovered = hover !== null && strip ? strip.hits[hover] : null;
  return (
    <section className={styles.clusters} aria-labelledby="cl-h">
      <h3 id="cl-h" className="label">Where it clusters</h3>
      <select value={chosen} onChange={(e) => setWork(e.target.value)} aria-label="Work">
        {options.map(([w, n]) => <option key={w} value={w}>{title(w)} ({fmt(n)})</option>)}
      </select>
      {pack.state === "loading" && <p className="muted"><span className={styles.spinner} aria-hidden="true" /> Opening the text…</p>}
      {(pack.state === "error" || (pack.state === "done" && !pack.value)) && <p className={styles.warn}>This work&apos;s word analyses are not on this site, so the strip cannot be drawn.</p>}
      {strip && (
        <figure className={styles.strip} key={chosen}>
          <svg viewBox="0 0 1000 64" preserveAspectRatio="none" role="img"
            aria-label={`${fmt(strip.hits.reduce((s, [, n]) => s + n, 0))} mentions across ${title(chosen)}, from the first passage to the last`}
            onMouseLeave={() => setHover(null)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * strip.slices;
              let best = -1, d = Infinity;
              strip.hits.forEach(([b], i) => { const dd = Math.abs(b + 0.5 - x); if (dd < d) { d = dd; best = i; } });
              setHover(best >= 0 && d < 3 ? best : null);
            }}>
            <rect className={styles.stripBase} x="0" y="52" width="1000" height="1.5" />
            {strip.books.map(([at, b]) => <rect key={b + at} className={styles.notch} x={at * 1000} y="46" width="1.5" height="12" />)}
            {strip.hits.map(([b, n], i) => (
              <rect key={b} className={styles.mark} data-on={hover === i ? "" : undefined} style={{ "--i": i } as React.CSSProperties}
                x={(b / strip.slices) * 1000 + 0.6} y={52 - 4 - (n / max) * 42} width={Math.max(1.5, 1000 / strip.slices - 1.2)} height={4 + (n / max) * 42} />
            ))}
          </svg>
          <figcaption>
            {hovered
              ? <span><b>{hovered[2]}</b> · {hovered[1] === 1 ? "once" : `${fmt(hovered[1])} times`}</span>
              : <span>{fmt(strip.hits.reduce((s, [, n]) => s + n, 0))} mentions from the start of the work (left) to the end (right){strip.slices > 1 && strip.slices < strip.total && `, in ${strip.slices} equal slices`}{strip.books.length > 0 && "; notches mark the books"}. Point at a mark for its passages.</span>}
          </figcaption>
          {strip.books.length > 0 && strip.books.length <= 24 && (
            <div className={styles.bookNums} aria-hidden="true">
              {strip.books.map(([at, b], i) => {
                const end = strip.books[i + 1]?.[0] ?? 1;
                return <span key={b + at} style={{ left: `${((at + end) / 2) * 100}%` }}>{b}</span>;
              })}
            </div>
          )}
        </figure>
      )}
      <Link href={every} className={styles.small} transitionTypes={["page-turn"]}>Read every mention in this work →</Link>
    </section>
  );
}
