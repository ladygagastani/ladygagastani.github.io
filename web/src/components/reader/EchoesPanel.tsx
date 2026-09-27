"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadCatalog, versionOf, type CatalogIndex } from "@/lib/catalog";
import { exactEchoes, NEAR_MAX_WORDS, phraseEchoes, wordEchoes, type Echo, type Kind } from "@/lib/echoes/match";
import { authorPlan, bookFromDoc, bookFromUrn, lexicon, type AuthorPlan, type Book } from "@/lib/echoes/load";
import { positionOf } from "@/lib/echoes/stream";
import { echoContext } from "@/lib/echoes/context";
import { canonLemma, runSearch, type Outcome } from "@/lib/search/run";
import type { Point } from "@/lib/annotations";
import type { TeiDoc } from "@/lib/tei/types";
import styles from "./Reader.module.css";
import es from "./Echoes.module.css";

/** What Echoes was asked about: words selected (or clicked) in a book open in the reader. */
export interface EchoQuery { work: string; urn: string; doc: TeiDoc; title: string; start: Point; end: Point }
export interface EchoTarget { work: string; ed: string; at: string }
/** Words to mark in the reader, by edition and passage: which word, and whether it is the one asked about. */
export type EchoMarks = Map<string, Map<string, { i: number; self: boolean }[]>>;

type Scope = "book" | "author" | "corpus";
const LIKENESS: { v: number; label: string; hint: string }[] = [
  { v: 1, label: "Exact wording", hint: "The same forms in the same order" },
  { v: 0.75, label: "Close", hint: "Likeness 75% or more" },
  { v: 0.5, label: "Loose", hint: "Likeness 50% or more" },
];
const KIND_LABEL: Record<Kind, string> = { exact: "exact", forms: "other forms", near: "near" };
const PAGE = 60;
const MAX_WORDS = 200;

export default function EchoesPanel({ q, onJump, onMarks, onClose }: {
  q: EchoQuery; onJump: (t: EchoTarget) => void; onMarks: (m: EchoMarks | null) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [book, setBook] = useState<{ key: EchoQuery; book?: Book; error?: string } | null>(null);
  const [scope, setScope] = useState<Scope>("book");
  const [by, setBy] = useState<"form" | "lemma">("form");
  const [min, setMin] = useState(0.75);
  const [more, setMore] = useState<{ of: Echo[] | null; n: number }>({ of: null, n: PAGE });
  const [away, setAway] = useState(false);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);

  useEffect(() => { loadCatalog().then(setIdx, () => undefined); }, []);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, [q]);

  // 1. the book being read, as a stream of words with their dictionary words
  useEffect(() => {
    let live = true;
    bookFromDoc(q.doc, q.work, q.urn, q.title).then(
      (b) => { if (live) setBook({ key: q, book: b }); },
      (e: Error) => { if (live) setBook({ key: q, error: e.message }); });
    return () => { live = false; };
  }, [q]);
  const b = book?.key === q ? book.book : undefined;
  const pos = useMemo(() => (b ? { from: positionOf(b.stream, q.start.u, q.start.i), to: positionOf(b.stream, q.end.u, q.end.i) } : null), [b, q]);
  const from = pos?.from ?? -1, to = pos?.to ?? -1;
  const n = to - from + 1;
  const isWord = n === 1;
  const words = b && from >= 0 ? b.stream.text.slice(from, to + 1) : [];
  const lemmaId = b && isWord ? b.stream.lemma[from] : -1;
  const lemma = lemmaId >= 0 ? lexicon.lemmaNames[lemmaId] : null;
  const wordBy = isWord && by === "lemma" && lemma ? "lemma" : "form";

  // 2. the author's other books, read one by one when asked for (only when small enough to compare here)
  const plan: AuthorPlan | null = useMemo(() => (idx ? authorPlan(idx, q.work, q.urn) : null), [idx, q.work, q.urn]);
  const [others, setOthers] = useState<{ key: string; books: Book[]; failed: number; done: boolean } | null>(null);
  const planKey = plan ? `${plan.author.id}|${q.urn}` : "";
  useEffect(() => {
    if (scope !== "author" || !plan?.local || plan.works.length < 2) return;
    let live = true;
    (async () => {
      const got: Book[] = [];
      let failed = 0;
      setOthers({ key: planKey, books: [], failed: 0, done: false });
      for (const w of plan.works.slice(1)) {
        try { got.push(await bookFromUrn(w.work, w.urn, w.title)); } catch { failed++; }
        if (!live) return;
        setOthers({ key: planKey, books: [...got], failed, done: false });
      }
      setOthers({ key: planKey, books: got, failed, done: true });
    })();
    return () => { live = false; };
  }, [scope, plan, planKey]);

  // 3. the echoes (in the browser: this book, or a small author's books)
  const local = scope === "book" || (scope === "author" && !!plan?.local);
  const books = useMemo(() => (!b ? [] : scope === "author" && others?.key === planKey ? [b, ...others.books] : [b]), [b, scope, others, planKey]);
  const echoes = useMemo<Echo[] | null>(() => {
    if (!pos || pos.from < 0 || pos.to < pos.from || pos.to - pos.from >= MAX_WORDS || !local || !books.length) return null;
    const query = { s: 0, from: pos.from, to: pos.to };
    const ss = books.map((x) => x.stream);
    if (pos.from === pos.to) return wordEchoes(ss, query, wordBy);
    return min >= 1 ? exactEchoes(ss, query) : phraseEchoes(ss, query, min);
  }, [pos, books, wordBy, min, local]);

  // 4. across the whole library, or a very large author: the search index
  const [indexed, setIndexed] = useState<{ key: string; outcome?: Outcome; error?: string } | null>(null);
  const indexKey = !local && idx && words.length ? `${scope}|${wordBy}|${words.join(" ")}|${lemma}` : "";
  useEffect(() => {
    if (!indexKey || !idx) return;
    let live = true;
    const works = scope === "author" && plan ? new Set(plan.works.map((w) => w.work)) : null;
    const query = wordBy === "lemma" && lemma
      ? { mode: "lemma" as const, q: lemma, lemma: canonLemma(lemma) }
      : { mode: "forms" as const, q: words.join(" "), lemma: null };
    runSearch(idx, { ...query, script: "greek", tags: {}, works, allEditions: false }).then(
      (outcome) => { if (live) setIndexed({ key: indexKey, outcome }); },
      (e: Error) => { if (live) setIndexed({ key: indexKey, error: e.message }); });
    return () => { live = false; };
    // the query is identified by indexKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexKey]);
  const ix = indexed?.key === indexKey ? indexed : null;

  // tell the reader which words to mark
  useEffect(() => {
    if (!echoes) { onMarks(null); return; }
    const m: EchoMarks = new Map();
    for (const e of echoes) {
      const s = books[e.s].stream;
      let byUnit = m.get(s.urn);
      if (!byUnit) m.set(s.urn, (byUnit = new Map()));
      for (const p of e.hit) {
        const r = s.refs[s.unit[p]];
        const l = byUnit.get(r) ?? [];
        l.push({ i: s.word[p], self: e.self });
        byUnit.set(r, l);
      }
    }
    onMarks(m);
  }, [echoes, books, onMarks]);
  useEffect(() => () => onMarks(null), [onMarks]);
  const shown = more.of === echoes ? more.n : PAGE;

  const jump = (t: EchoTarget) => { setAway(true); onJump(t); };
  const origin: EchoTarget = { work: q.work, ed: versionOf(q.urn), at: q.start.u };

  const counts = useMemo(() => {
    const c = { exact: 0, forms: 0, near: 0 } as Record<Kind, number>;
    for (const e of echoes ?? []) c[e.kind]++;
    return c;
  }, [echoes]);
  const perBook = useMemo(() => {
    const out = books.map(() => [] as Echo[]);
    for (const e of echoes ?? []) out[e.s].push(e);
    return out;
  }, [echoes, books]);

  const quote = words.length > 12 ? `${words.slice(0, 12).join(" ")} …` : words.join(" ");
  const where = scope === "book" ? <i>{q.title}</i> : scope === "author" ? `${plan?.author.name ?? "this author"}’s works` : "all the Greek texts";

  return (
    <aside ref={ref} className={`${styles.panel} ${es.panel}`} aria-label="Echoes" tabIndex={-1} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={styles.panelHead}>
        <div>
          <p className="label">Echoes · where it recurs</p>
          <p className={es.quote} lang="grc">{quote || "…"}</p>
        </div>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close Echoes">×</button>
      </div>

      {away && (
        <button type="button" className={`chip ${es.back}`} onClick={() => { setAway(false); onJump(origin); }}>
          ← Back to {q.title} {q.start.u}
        </button>
      )}

      {book?.key === q && book.error && <p className={styles.warn}>{book.error}</p>}
      {!b && !book?.error && <p className="muted">Reading the book…</p>}
      {b && from < 0 && <p className={styles.warn}>These words could not be found in the book. Select them again.</p>}

      {b && from >= 0 && n > MAX_WORDS && <p className={styles.warn}>Echoes compares up to {MAX_WORDS} words at a time; this selection has {n}. Select a shorter stretch.</p>}
      {b && from >= 0 && n <= MAX_WORDS && (
        <>
          <div className={es.controls}>
            {isWord ? (
              <div className={styles.seg} role="radiogroup" aria-label="Match">
                <button type="button" role="radio" aria-checked={wordBy === "form"} onClick={() => setBy("form")}>This form</button>
                <button type="button" role="radio" aria-checked={wordBy === "lemma"} disabled={!lemma} onClick={() => setBy("lemma")}
                  title={lemma ? `Every form of ${lemma}` : "No dictionary-word analysis for this word"}>
                  Every form of <span lang="grc">{lemma ?? "…"}</span>
                </button>
              </div>
            ) : (
              <div className={styles.seg} role="radiogroup" aria-label="How alike">
                {LIKENESS.map((l) => (
                  <button key={l.v} type="button" role="radio" aria-checked={(local && n <= NEAR_MAX_WORDS ? min : 1) === l.v} title={l.hint}
                    disabled={l.v < 1 && (n > NEAR_MAX_WORDS || !local)} onClick={() => setMin(l.v)}>{l.label}</button>
                ))}
              </div>
            )}
            <div className={es.scopes} role="group" aria-label="Where to look">
              <button type="button" className="chip" aria-pressed={scope === "book"} onClick={() => setScope("book")}>This book</button>
              {plan && plan.works.length > 1 && (
                <button type="button" className="chip" aria-pressed={scope === "author"} onClick={() => setScope("author")}>
                  All {plan.author.name} <span className="muted">({plan.works.length} works)</span>
                </button>
              )}
              <button type="button" className="chip" aria-pressed={scope === "corpus"} onClick={() => setScope("corpus")}>All Greek texts</button>
            </div>
          </div>

          {isWord && !lemma && <p className={styles.fine}>{b.pack ? "GLAUx has no analysis of this word here, so only this form can be followed." : "No dictionary-word analyses exist for this work yet, so only this form can be followed."}</p>}

          {echoes && (
            <>
              <Summary n={echoes.length} counts={counts} isWord={isWord} where={where} />
              {scope === "author" && others?.key === planKey && !others.done && (
                <p className={`muted ${es.progress}`}>Reading {plan!.author.name}’s works: {others.books.length + 1 + others.failed} of {plan!.works.length}…</p>
              )}
              {scope === "author" && others?.done && others.failed > 0 && <p className={styles.fine}>{others.failed} work{others.failed > 1 ? "s" : ""} could not be loaded and {others.failed > 1 ? "are" : "is"} left out.</p>}
              <div className={es.strips}>
                {books.map((bk, i) => (scope === "book" || perBook[i].length > 0) && (
                  <Strip key={bk.stream.urn} book={bk} echoes={perBook[i]} label={scope === "author" ? bk.title : null}
                    onPick={(e) => jump({ work: bk.stream.work, ed: versionOf(bk.stream.urn), at: bk.stream.refs[bk.stream.unit[e.from]] })} />
                ))}
                <p className={es.legend} aria-hidden="true">
                  <span className={es.kExact}>exact</span>
                  {(!isWord || wordBy === "lemma") && <span className={es.kForms}>other forms</span>}
                  {!isWord && min < 1 && <span className={es.kNear}>near (shorter = less alike)</span>}
                  <span className={es.kSelf}>you are here</span>
                </p>
              </div>

              <ol className={es.list}>
                {listed(books, perBook, shown).map(({ e, bi, head }) => {
                  const bk = books[bi];
                  const s = bk.stream;
                  const at = s.refs[s.unit[e.from]];
                  return (
                    <li key={`${bi}:${e.from}`} className={head ? es.bookHead : undefined}>
                      {head && <p className="label">{bk.title} · {perBook[bi].length}</p>}
                      <button type="button" className={e.self ? es.self : undefined}
                        onClick={() => jump({ work: s.work, ed: versionOf(s.urn), at })}>
                        <span className={es.ref}>{at}{s.unit[e.to] !== s.unit[e.from] ? `–${s.refs[s.unit[e.to]]}` : ""}</span>
                        <span className={`${es.kind} ${es[`k-${e.kind}`]}`}>{e.self ? "this passage" : KIND_LABEL[e.kind]}{e.kind === "near" ? ` · ${Math.round(e.likeness * 100)}%` : ""}</span>
                        <span className={es.ctx} lang="grc">
                          {echoContext(bk.doc, s, e).map((p, i) => (p.k ? <span key={i} className={p.k === "hit" ? es.hit : es.odd}>{p.t}</span> : p.t))}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {echoes.length > shown && <button type="button" className="chip" onClick={() => setMore({ of: echoes, n: shown + 200 })}>Show more ({echoes.length - shown} left)</button>}
            </>
          )}

          {!local && <IndexResults ix={ix} idx={idx} words={words} lemma={wordBy === "lemma" ? lemma : null} scope={scope} plan={plan} isWord={isWord} />}

          <details className={es.rules} open={false}>
            <summary>What counts as a match</summary>
            {isWord ? (
              <ul>
                <li><b>This form</b>: the same letters, breathings and accents. Capitals, a grave accent (an acute written before another word), a second accent from a following enclitic (ἄνθρωπός τις), and the elision mark are ignored, since they depend only on the neighbouring words.</li>
                <li><b>Every form</b> of a dictionary word: every word that GLAUx analyses as a form of it{b.pack ? `. GLAUx's analyses are placed on this edition's words; ${Math.round(b.stream.lemmaCover * 100)}% of the words in this book have one` : ""}. GLAUx is about 99% right about the dictionary word.</li>
              </ul>
            ) : (
              <ul>
                <li><b>Exact</b>: the same forms (as for a single word) in the same order. A line or section break in between does not matter.</li>
                <li><b>Other forms</b>: the same dictionary words in the same order, nothing added or left out, but not all in the same form (ῥοδοδάκτυλος Ἠώς, ῥοδοδάκτυλον Ἠῶ).</li>
                <li><b>Near</b>: most of the phrase again, in the same order, within a stretch at most a quarter longer than it. Words count as the same when they are forms of the same dictionary word. Rarer words count for more, so sharing καί or δέ counts for little. The <b>likeness</b> is the share of the phrase found again, weighted this way. Close means 75% or more; Loose, 50% or more.</li>
                <li>In the list, matching words are <span className={es.hit}>marked</span>; words inside the match that differ are <span className={es.odd}>pale</span>.</li>
                {n > NEAR_MAX_WORDS && <li>Near repetitions are looked for in selections of up to {NEAR_MAX_WORDS} words; this one has {n}.</li>}
              </ul>
            )}
            <p className={styles.fine}>
              In this book{plan?.local ? ` and across ${plan.author.name}’s works` : ""}, every word of the text is compared here in your browser.
              Across all the Greek texts{plan && !plan.local ? `, and across ${plan.author.name}’s ${plan.works.length} works,` : ""} Echoes uses the search index instead: a word’s form (accents ignored) or dictionary word, or a phrase word for word within one passage. Near repetitions are not looked for there.
              Each work is counted in the edition the reader opens first, so parallel editions do not count twice.
            </p>
          </details>
        </>
      )}
    </aside>
  );
}

function Summary({ n, counts, isWord, where }: { n: number; counts: Record<Kind, number>; isWord: boolean; where: React.ReactNode }) {
  const parts = ([["exact", "exact"], ["forms", "in other forms"], ["near", "near"]] as [Kind, string][]).filter(([k]) => counts[k] > 0);
  return (
    <div className={es.summary} aria-live="polite">
      <span className={es.big}>{n.toLocaleString("en-GB")}</span>
      <span>
        {n === 1 ? "time" : "times"} in {where}{n > 0 ? ", this one included" : ""}
        {(!isWord || counts.forms > 0) && parts.length > 1 && <span className="muted"> · {parts.map(([k, l]) => `${counts[k].toLocaleString("en-GB")} ${l}`).join(" · ")}</span>}
      </span>
    </div>
  );
}

/** The echoes to list, book by book, up to `max`. */
function listed(books: Book[], perBook: Echo[][], max: number) {
  const out: { e: Echo; bi: number; head: boolean }[] = [];
  for (let bi = 0; bi < books.length && out.length < max; bi++) {
    perBook[bi].forEach((e, i) => { if (out.length < max) out.push({ e, bi, head: books.length > 1 && i === 0 }); });
  }
  return out;
}

/** A thin strip standing for the whole book, with a mark at every echo. Click a mark to go there. */
function Strip({ book, echoes, label, onPick }: { book: Book; echoes: Echo[]; label: string | null; onPick: (e: Echo) => void }) {
  const s = book.stream;
  const len = Math.max(1, s.text.length);
  const [hover, setHover] = useState<Echo | null>(null);
  const x = (p: number) => (p / len) * 1000;
  const nearest = (ev: React.MouseEvent<SVGSVGElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * 1000;
    let best: Echo | null = null, d = 14 * (1000 / r.width);
    for (const e of echoes) { const dd = Math.abs(x(e.from) - px); if (dd < d) { d = dd; best = e; } }
    return best;
  };
  const ticks = s.chunks.length > 1 && s.chunks.length <= 300 ? s.chunks.slice(1) : [];
  const where = (e: Echo) => `${s.refs[s.unit[e.from]]}${e.self ? " (this passage)" : ""} · ${KIND_LABEL[e.kind]}${e.kind === "near" ? ` ${Math.round(e.likeness * 100)}%` : ""}`;
  return (
    <figure className={es.strip}>
      {label && <figcaption className="label">{label} · {echoes.length}</figcaption>}
      <svg viewBox="0 0 1000 46" preserveAspectRatio="none" role="img" aria-label={`${echoes.length} places marked along ${book.title}`}
        onMouseMove={(ev) => setHover(nearest(ev))} onMouseLeave={() => setHover(null)}
        onClick={(ev) => { const e = nearest(ev); if (e) onPick(e); }} style={{ cursor: hover ? "pointer" : "default" }}>
        <rect className={es.ground} x="0" y="10" width="1000" height="28" />
        {ticks.map((c) => <line key={c.at} className={es.tick} x1={x(c.at)} x2={x(c.at)} y1="38" y2="45" vectorEffect="non-scaling-stroke"><title>{c.label}</title></line>)}
        {echoes.map((e) => {
          const h = e.kind === "near" ? 6 + 18 * e.likeness : e.kind === "forms" ? 23 : 28;
          return (
            <rect key={e.from} className={`${es.mark} ${es[`m-${e.kind}`]} ${e.self ? es.mSelf : ""} ${hover === e ? es.mHover : ""}`}
              x={x(e.from)} y={38 - h} width={Math.max(3, x(e.to + 1) - x(e.from))} height={h}
              style={{ animationDelay: `${Math.round(x(e.from) * 0.7)}ms` }} />
          );
        })}
        {echoes.filter((e) => e.self).map((e) => <path key={`s${e.from}`} className={es.here} d={`M${x(e.from) - 9} 0 L${x(e.from) + 9} 0 L${x(e.from)} 8 Z`} />)}
      </svg>
      <div className={es.stripFoot}>
        <span>{s.chunks[0]?.label ?? ""}</span>
        <span className={es.hoverLabel}>{hover ? where(hover) : ""}</span>
        <span>{s.chunks.length > 1 ? s.chunks[s.chunks.length - 1].label : ""}</span>
      </div>
    </figure>
  );
}

/** Counts from the search index, by work, with links to see every result in the Oracle. */
function IndexResults({ ix, idx, words, lemma, scope, plan, isWord }: {
  ix: { outcome?: Outcome; error?: string } | null; idx: CatalogIndex | null; words: string[]; lemma: string | null;
  scope: Scope; plan: AuthorPlan | null; isWord: boolean;
}) {
  if (!ix) return <p className="muted">Searching the index…</p>;
  if (ix.error || !ix.outcome) return <p className="muted">{ix.error ?? "The search index could not be read."}</p>;
  const o = ix.outcome;
  const oracle = (w?: string) => {
    const p = new URLSearchParams(lemma ? { m: "lemma", q: lemma, lem: lemma } : { q: words.join(" ") });
    if (w) p.set("w", w); else if (scope === "author" && plan) p.set("a", plan.author.id);
    return `/search?${p}`;
  };
  const top = [...o.works].sort((a, b) => b.count - a.count).slice(0, 25);
  const most = top[0]?.count ?? 1;
  const where = scope === "author" ? `${plan?.author.name ?? "this author"}’s works` : "all the Greek texts";
  return (
    <>
      <div className={es.summary} aria-live="polite">
        <span className={es.big}>{o.hits.toLocaleString("en-GB")}</span>
        <span>{o.hits === 1 ? "time" : "times"} in {where}, in {o.works.length.toLocaleString("en-GB")} work{o.works.length === 1 ? "" : "s"}
          <span className="muted"> · {lemma ? `every form of ${lemma}` : isWord ? "accents ignored" : "word for word, within one passage, accents ignored"}</span>
        </span>
      </div>
      {top.length > 0 && (
        <ol className={es.works}>
          {top.map((w) => (
            <li key={w.work}>
              <Link href={oracle(w.work)} transitionTypes={["page-turn"]}>
                <span className={es.wName}>{idx?.authorOf.get(w.work)?.name}, <i>{idx?.work.get(w.work)?.title}</i></span>
                <span className={es.wBar}><span style={{ width: `${(w.count / most) * 100}%` }} /></span>
                <span className={es.wN}>{w.count.toLocaleString("en-GB")}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
      {o.works.length > top.length && <p className={styles.fine}>The {top.length} works where it occurs most, of {o.works.length.toLocaleString("en-GB")}.</p>}
      <Link className="btn ghost" href={oracle()} transitionTypes={["page-turn"]}>See every place in the Oracle</Link>
    </>
  );
}
