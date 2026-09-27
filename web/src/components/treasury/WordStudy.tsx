"use client";
/**
 * Word Study: everything about one dictionary word. Its meaning (core vocabulary, LSJ), every form
 * it takes with its grammar, where and when it is used (GLAUx counts), real examples linked into
 * the reader, its family from Wiktionary, and the reader's own note and review status.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, versionOf, type CatalogIndex } from "@/lib/catalog";
import { buildParadigm, formList, groupFreq, lexEntry, loadLexMeta, type Grid, type LexEntry, type LexMeta } from "@/lib/lexicon";
import { lsjEntries, LSJ_CREDIT, type LsjEntry } from "@/lib/lookup/lsj";
import { coreEntry, CORE_CREDIT, type CoreEntry } from "@/lib/lookup/core";
import { readTag } from "@/lib/lookup/postag";
import { wordFamily, type WordFamily } from "@/lib/lookup/wiktionary-family";
import { centuries, DATE_NOTE, loadWorksMeta, periodOf, PERIODS, type WorkMeta } from "@/lib/works-meta";
import { transliterate } from "@/lib/translit";
import { useAcademy } from "@/lib/academy";
import { usePageNotes } from "@/lib/annotations";
import { runSearch, canonLemma } from "@/lib/search/run";
import { loadTags } from "@/lib/search/engine";
import { loadDoc, snippet, type Part } from "@/lib/search/context";
import { useUI } from "@/lib/ui";
import { LsjEntryView } from "@/components/reader/WordPanel";
import { PageNoteEditor } from "./AuthorsSection";
import { reviewStatus } from "./WordsSection";
import BarChart from "./BarChart";
import { wordHref } from "./data";
import styles from "./WordStudy.module.css";

type Load<T> = { state: "loading" } | { state: "done"; value: T } | { state: "error"; message: string };
const loading = { state: "loading" } as const;
function useLoad<T>(key: string, fn: () => Promise<T>, enabled = true): Load<T> {
  const [v, setV] = useState<{ key: string; load: Load<T> }>({ key: "", load: loading });
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fn().then((value) => { if (live) setV({ key, load: { state: "done", value } }); }, (e: Error) => { if (live) setV({ key, load: { state: "error", message: e.message } }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return v.key === key ? v.load : loading;
}

export default function WordStudy() {
  const params = useSearchParams();
  const asked = (params.get("l") ?? "").normalize("NFC").trim();
  const lex = useLoad(`lex|${asked}`, () => Promise.all([lexEntry(asked), loadLexMeta()]), !!asked);
  const found = lex.state === "done" ? lex.value[0] : null;
  const meta = lex.state === "done" ? lex.value[1] : null;
  const lemma = found?.lemma ?? asked;

  if (!asked) return <div className={`wrap ${styles.ws}`}><Finder /></div>;
  return (
    <div className={`wrap ${styles.ws}`}>
      <p className={styles.crumbs}><Link href="/treasury?s=words" transitionTypes={["page-turn"]}>The Treasury · Words</Link> / Word Study</p>
      <Head lemma={lemma} entry={found?.entry ?? null} meta={meta} lexState={lex.state} alike={found?.alike ?? []} />
      <div className={styles.layout}>
        <div className={styles.main}>
          <Meaning lemma={lemma} />
          {lex.state === "error" && <p className={styles.warn}>The word index could not be loaded ({lex.message}).</p>}
          {lex.state === "done" && !found && (
            <section className={styles.sec}>
              <p className={styles.warn}>GLAUx has no dictionary word spelled <span lang="grc">{asked}</span>, so there are no forms or counts for it.
                {" "}Word Study needs the dictionary form (λόγος, not λόγου; λύω, not ἔλυσε). <Link href={`/search?m=forms&q=${encodeURIComponent(asked)}`}>Search the texts for this form →</Link></p>
            </section>
          )}
          {found && meta && <Forms entry={found.entry} meta={meta} />}
          {found && meta && <Usage entry={found.entry} meta={meta} />}
          {found && <Examples lemma={found.lemma} />}
        </div>
        <aside className={styles.side}>
          <Mine lemma={lemma} />
          <Family lemma={lemma} />
        </aside>
      </div>
    </div>
  );
}

function Finder() {
  return (
    <section className={styles.sec}>
      <h2>Word Study</h2>
      <p>Open a word from <Link href="/treasury?s=words">your saved words</Link>, or from the look-up panel in the reader (“Word Study”).</p>
    </section>
  );
}

// ------------------------------------------------------------ head
function Head({ lemma, entry, meta, lexState, alike }: { lemma: string; entry: LexEntry | null; meta: LexMeta | null; lexState: string; alike: string[] }) {
  const pos = useMemo(() => {
    if (!entry || !meta) return null;
    const top = readTag(meta.tags[entry.f[0]?.[1]] ?? "");
    if (top.pos === "noun") {
      const g = new Map<string, number>();
      for (const [, t, n] of entry.f) { const c = meta.tags[t]?.[6]; if (c && c !== "-") g.set(c, (g.get(c) ?? 0) + n); }
      const main = [...g].sort((a, b) => b[1] - a[1])[0]?.[0];
      return `noun${main ? `, ${{ m: "masculine", f: "feminine", n: "neuter", c: "common gender" }[main] ?? ""}` : ""}`;
    }
    if (top.pos === "infinitive" || top.pos === "participle") return "verb";
    return top.pos;
  }, [entry, meta]);
  return (
    <header className={styles.head}>
      <h1 lang="grc" className={styles.lemma}>{lemma}</h1>
      <p className={styles.headMeta}>
        <span className={styles.translit}>{transliterate(lemma)}</span>
        {pos && <span>{pos}</span>}
        {entry && meta && <span>{entry.n.toLocaleString("en-GB")} times in {entry.w.length.toLocaleString("en-GB")} of GLAUx&apos;s {meta.works.length.toLocaleString("en-GB")} works</span>}
        {lexState === "loading" && <span className="muted">counting…</span>}
      </p>
      {alike.length > 0 && <p className={styles.alike}>Spelled alike without accents: {alike.slice(0, 6).map((a, i) => <span key={a}>{i > 0 && ", "}<Link href={wordHref(a)} lang="grc">{a}</Link></span>)}</p>}
      <div className="meander draw" aria-hidden="true" />
    </header>
  );
}

// ------------------------------------------------------------ meaning
function Meaning({ lemma }: { lemma: string }) {
  const core = useLoad(`core|${lemma}`, () => coreEntry(lemma));
  const lsj = useLoad(`lsj|${lemma}`, () => lsjEntries(lemma));
  const [full, setFull] = useState(false);
  const c: CoreEntry | null = core.state === "done" ? core.value : null;
  const l = lsj.state === "done" ? lsj.value : null;
  return (
    <section className={styles.sec} aria-labelledby="ws-meaning">
      <h2 id="ws-meaning">Meaning</h2>
      {c && (
        <div className={styles.core}>
          <p className={styles.coreDef}>{c.def}</p>
          <p className={styles.fine}>One of the commonest words of Greek (#{c.rank} in the core list) · {c.pos}. {CORE_CREDIT}.</p>
        </div>
      )}
      <h3 className="label">Liddell–Scott–Jones {l && l.head !== lemma && <span lang="grc">· {l.head}</span>}</h3>
      {lsj.state === "loading" && <p className="muted">Opening the dictionary…</p>}
      {lsj.state === "error" && <p className={styles.warn}>The dictionary could not be loaded ({lsj.message}).</p>}
      {lsj.state === "done" && !l && <p className="muted">No LSJ entry under this headword.</p>}
      {l && l.entries.map((e: LsjEntry, i) => <LsjEntryView key={i} e={e} full={full} tall />)}
      {l && <button type="button" className="chip" onClick={() => setFull(!full)} aria-expanded={full}>{full ? "Short definition" : "The full entry"}</button>}
      {l && full && <p className={styles.fine}>{LSJ_CREDIT}</p>}
      <p className={styles.fine}>
        Also in <a href={`https://logeion.uchicago.edu/${encodeURIComponent(lemma)}`} target="_blank" rel="noopener noreferrer">Logeion</a> (LSJ, Middle Liddell, Autenrieth and more).
      </p>
    </section>
  );
}

// ------------------------------------------------------------ forms
function GridTable({ g, verb }: { g: Grid; verb: boolean }) {
  const extras = verb ? [...g.cells].filter(([k]) => k.startsWith("nf|")) : [];
  const cell = (k: string) => {
    const c = g.cells.get(k);
    if (!c) return <td key={k} className={styles.none}>—</td>;
    const [top, ...rest] = c.forms;
    return (
      <td key={k} title={c.forms.map((f) => `${f.form} ×${f.n.toLocaleString("en-GB")}`).join("\n")}>
        <span lang="grc">{top.form}</span><small>{top.n.toLocaleString("en-GB")}</small>
        {rest.slice(0, 2).map((f) => <span key={f.form} className={styles.variant}><span lang="grc">{f.form}</span><small>{f.n.toLocaleString("en-GB")}</small></span>)}
        {rest.length > 2 && <span className={styles.variant}>+{rest.length - 2}</span>}
      </td>
    );
  };
  return (
    <figure className={styles.grid}>
      {g.title && <figcaption>{g.title} <small>{g.n.toLocaleString("en-GB")}</small></figcaption>}
      {g.rows.length > 0 && (
        <div className={styles.scrollX}>
          <table>
            <thead><tr><td />{g.cols.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
            <tbody>
              {g.rows.map((r, i) => (
                <tr key={r.key} style={{ "--i": i } as React.CSSProperties}>
                  <th scope="row">{r.label}</th>
                  {g.cols.map((c) => cell(`${r.key}|${c.key}`))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {extras.length > 0 && (
        <p className={styles.nonFinite}>
          {extras.map(([k, c]) => (
            <span key={k}>
              <span className="label">{k === "nf|inf|" ? "Infinitive" : `Participle, nom. sg. ${({ m: "masc.", f: "fem.", n: "neut." } as Record<string, string>)[k.slice(-1)] ?? ""}`}</span>{" "}
              <span lang="grc">{c.forms[0].form}</span> <small>{c.forms[0].n.toLocaleString("en-GB")}</small>
            </span>
          ))}
        </p>
      )}
    </figure>
  );
}

function Forms({ entry, meta }: { entry: LexEntry; meta: LexMeta }) {
  const p = useMemo(() => buildParadigm(entry, meta.tags), [entry, meta]);
  const [view, setView] = useState<"table" | "list">(p.kind === "list" ? "list" : "table");
  const [shown, setShown] = useState(40);
  const list = useMemo(() => formList(entry, meta.tags), [entry, meta]);
  const main = p.grids.filter((g) => !g.minor), minor = p.grids.filter((g) => g.minor);
  return (
    <section className={styles.sec} aria-labelledby="ws-forms">
      <div className={styles.secHead}>
        <h2 id="ws-forms">Every form</h2>
        {p.kind !== "list" && (
          <span className={styles.seg} role="group" aria-label="Show forms as">
            <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>As tables</button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>As a list</button>
          </span>
        )}
      </div>
      <p className={styles.lead}>
        {entry.f.length.toLocaleString("en-GB")} different forms with their grammar, as they occur in the texts. The number beside each
        form is how often it occurs. Only attested forms appear, so a gap means GLAUx never met that form.
      </p>
      {view === "table" && (
        <>
          <div className={styles.grids}>{main.map((g, i) => <GridTable key={`${g.title}${i}`} g={g} verb={p.kind === "verb"} />)}</div>
          {minor.length > 0 && (
            <details className={styles.minor}>
              <summary>Rarer forms and analyses ({minor.reduce((a, g) => a + g.n, 0).toLocaleString("en-GB")} occurrences)</summary>
              <p className={styles.fine}>Each of these is under 3% of the word&apos;s uses. Some are real rare forms; some are slips of the automatic analysis (about 97% accurate).</p>
              <div className={styles.grids}>{minor.map((g, i) => <GridTable key={`${g.title}${i}`} g={g} verb={p.kind === "verb"} />)}</div>
            </details>
          )}
        </>
      )}
      {view === "list" && (
        <>
          <ol className={styles.formList}>
            {list.slice(0, shown).map((f, i) => (
              <li key={`${f.form}${i}`}>
                <span lang="grc" className={styles.formGr}>{f.form}</span>
                <span>{f.parsing.pos}{f.parsing.detail ? ` · ${f.parsing.detail}` : ""}</span>
                <span className={styles.num}>{f.n.toLocaleString("en-GB")}</span>
              </li>
            ))}
          </ol>
          {list.length > shown && <button type="button" className="chip" onClick={() => setShown((n) => n + 80)}>More forms ({(list.length - shown).toLocaleString("en-GB")} left)</button>}
        </>
      )}
      <p className={styles.fine}>Forms and grammar: GLAUx (Keersmaekers 2021), CC BY-SA 4.0: about 16 million words analysed, partly by hand (treebanks), mostly automatically (lemma 98.8%, grammar 97.2% accurate). Accents are shown as in a dictionary: a grave written as an acute.</p>
    </section>
  );
}

// ------------------------------------------------------------ usage
function Usage({ entry, meta }: { entry: LexEntry; meta: LexMeta }) {
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [wm, setWm] = useState<Record<string, WorkMeta> | null>(null);
  useEffect(() => { loadCatalog().then(setIdx, () => {}); loadWorksMeta().then(setWm); }, []);
  const periods = useMemo(() => {
    if (!wm) return null;
    const f = groupFreq(entry, meta, (w) => { const p = periodOf(wm[w]?.from ?? null); return p ? { key: p, label: p } : null; });
    return PERIODS.map(([p]) => f.find((x) => x.key === p)).filter((x): x is NonNullable<typeof x> => !!x && x.words > 0);
  }, [entry, meta, wm]);
  const authors = useMemo(() => {
    if (!idx) return null;
    return groupFreq(entry, meta, (w) => { const a = idx.authorOf.get(w); return a ? { key: a.id, label: a.name } : null; })
      .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 10);
  }, [entry, meta, idx]);
  const fmtRate = (r: number) => (r >= 10 ? r.toFixed(0) : r >= 1 ? r.toFixed(1) : r.toFixed(2));
  return (
    <section className={styles.sec} aria-labelledby="ws-usage">
      <h2 id="ws-usage">Where it is used</h2>
      <p className={styles.lead}>How often per 10,000 words in each period, so periods with more surviving text don&apos;t win by size alone; then the authors who use it most.</p>
      <div className={styles.charts}>
        {periods && <BarChart caption="By period · uses per 10,000 words" unit="per 10,000 words" bars={periods.map((p) => ({
          key: p.key, label: p.label.split(" · ")[0], sub: p.label.split(" · ")[1], value: p.rate, valueText: fmtRate(p.rate),
          tip: `${p.n.toLocaleString("en-GB")} uses in ${p.words.toLocaleString("en-GB")} words of analysed text`,
        }))} />}
        {authors && <BarChart caption="Authors who use it most · uses" unit="uses" bars={authors.map((a) => ({
          key: a.key, label: a.label, value: a.n,
          tip: `${a.n.toLocaleString("en-GB")} uses; ${fmtRate(a.rate)} per 10,000 of the ${a.words.toLocaleString("en-GB")} words of ${a.label} that GLAUx analyses`,
        }))} />}
      </div>
      <p className={styles.fine}>Counted in GLAUx, which covers 1,186 of the library&apos;s works. Periods follow GLAUx&apos;s date for each author, by century.</p>
    </section>
  );
}

// ------------------------------------------------------------ examples
interface Example { work: string; author: string; title: string; period: string | null; href: string; ref: string; parts: Part[]; parse: string | null }

async function findExamples(lemma: string): Promise<Example[]> {
  const idx = await loadCatalog();
  const [out, wm, tags] = await Promise.all([
    runSearch(idx, { mode: "lemma", q: lemma, script: "greek", lemma: canonLemma(lemma), tags: {}, works: null, allEditions: false }),
    loadWorksMeta(), loadTags(),
  ]);
  // one work per period (the one that uses the word most), then more from other authors, at most 6
  const works = out.works.map((g) => ({ g, meta: wm[g.work], author: idx.authorOf.get(g.work)?.id ?? g.work }));
  const picked: typeof works = [];
  for (const [p] of PERIODS) {
    const best = works.filter((w) => periodOf(w.meta?.from ?? null) === p).sort((a, b) => b.g.count - a.g.count)[0];
    if (best) picked.push(best);
  }
  for (const w of [...works].sort((a, b) => b.g.count - a.g.count)) {
    if (picked.length >= 6) break;
    if (!picked.some((x) => x.author === w.author)) picked.push(w);
  }
  picked.sort((a, b) => (a.meta?.from ?? 9999) - (b.meta?.from ?? 9999));
  const res: Example[] = [];
  for (const { g, meta } of picked.slice(0, 6)) {
    const [textId, hits] = [...g.texts][0];
    const info = out.texts[textId];
    const h = hits[Math.min(hits.length - 1, Math.floor(hits.length / 3))];   // not always the very first use
    try {
      const doc = await loadDoc(info.urn);
      const u = doc.units[h.unit];
      if (!u) continue;
      const ref = u.ref.join(".");
      const w = idx.work.get(g.work)!, a = idx.authorOf.get(g.work);
      const t = h.tag !== undefined ? readTag(tags[h.tag] ?? "") : null;
      res.push({
        work: g.work, author: a?.name ?? "", title: w.title, period: centuries(meta?.from ?? null, meta?.to ?? null),
        href: `/read?w=${g.work}&ed=${versionOf(info.urn)}&at=${encodeURIComponent(ref)}&hl=${h.words.join(",")}`,
        ref, parts: snippet(u, h.words, "grc", 16), parse: t ? `${t.pos}${t.detail ? ` · ${t.detail}` : ""}` : null,
      });
    } catch { /* this text could not be opened: skip it */ }
  }
  return res;
}

function Examples({ lemma }: { lemma: string }) {
  const ex = useLoad(`ex|${lemma}`, () => findExamples(lemma));
  return (
    <section className={styles.sec} aria-labelledby="ws-examples">
      <div className={styles.secHead}>
        <h2 id="ws-examples">In real texts</h2>
        <Link className="chip" href={`/search?m=lemma&q=${encodeURIComponent(lemma)}&lem=${encodeURIComponent(canonLemma(lemma))}`} transitionTypes={["page-turn"]}>Every occurrence in the Oracle →</Link>
      </div>
      <p className={styles.lead}>One passage from each period, where the word is used, opened straight from the original files.</p>
      {ex.state === "loading" && <p className="muted">Finding passages and opening the texts…</p>}
      {ex.state === "error" && <p className={styles.warn}>{ex.message} Examples need the search index.</p>}
      {ex.state === "done" && !ex.value.length && <p className="muted">No passage could be opened for this word.</p>}
      {ex.state === "done" && (
        <ol className={styles.examples}>
          {ex.value.map((e, i) => (
            <li key={e.work} style={{ "--i": i } as React.CSSProperties}>
              <p className={styles.exWhere}>
                {e.period && <span className="label" title={DATE_NOTE}>{e.period}</span>}
                <Link href={e.href} transitionTypes={["page-turn"]}>{e.author}, <i>{e.title}</i> {e.ref}</Link>
              </p>
              <p lang="grc" className={styles.exGr}>{e.parts.map((p, j) => (p.hit ? <mark key={j}>{p.t}</mark> : p.t))}</p>
              {e.parse && <p className={styles.fine}>Here: {e.parse}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

// ------------------------------------------------------------ the reader's own
function Mine({ lemma }: { lemma: string }) {
  const card = useAcademy((s) => s.deck[lemma.normalize("NFC")]);
  const toast = useUI((s) => s.showToast);
  const [gloss, setGloss] = useState("");
  useEffect(() => {
    useAcademy.persist.rehydrate();
    usePageNotes.getState().load();
    let live = true;
    Promise.all([coreEntry(lemma), lsjEntries(lemma).catch(() => null)]).then(([c, l]) => { if (live) setGloss(c?.def || l?.entries[0]?.s || ""); });
    return () => { live = false; };
  }, [lemma]);
  const status = card ? reviewStatus(card) : null;
  return (
    <section className={`${styles.sec} ${styles.mine}`} aria-labelledby="ws-mine">
      <h2 id="ws-mine">Yours</h2>
      <div className={styles.review}>
        {card && status
          ? <>
              <p><span className={styles.status} data-tone={status.tone}>{status.label}</span></p>
              <p className={styles.fine}>In your daily review since {new Date(card.added).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{card.source === "saved" ? ", saved from the reader" : card.source === "lesson" ? ", from a lesson" : ""}.</p>
              <p><Link href="/academy/review" transitionTypes={["page-turn"]}>Go to today&apos;s review →</Link></p>
            </>
          : <>
              <p className="muted">Not in your review deck.</p>
              <button type="button" className="btn ghost" onClick={() => {
                const added = useAcademy.getState().addCard(lemma, gloss, "saved");
                toast(added ? `Saved ${lemma} to your daily review.` : `${lemma} is already in your daily review.`);
              }}>Save word to my review</button>
            </>}
      </div>
      <h3 className="label">Your note on this word</h3>
      <PageNoteEditor kind="word" target={lemma} label={`Your note on ${lemma}`} />
    </section>
  );
}

// ------------------------------------------------------------ family (Wiktionary, live)
function Family({ lemma }: { lemma: string }) {
  const online = typeof navigator === "undefined" || navigator.onLine !== false;
  const fam = useLoad<WordFamily | null>(`fam|${lemma}`, () => wordFamily(lemma), online);
  const [all, setAll] = useState(false);
  const f = fam.state === "done" ? fam.value : null;
  const greek = f ? [...f.derived, ...f.related.filter((r) => !f.derived.includes(r))] : [];
  return (
    <section className={styles.sec} aria-labelledby="ws-family">
      <h2 id="ws-family">Family</h2>
      {!online && <p className="muted">You are offline. The word family comes live from Wiktionary.</p>}
      {online && fam.state === "loading" && <p className="muted">Asking Wiktionary…</p>}
      {fam.state === "error" && <p className={styles.warn}>Wiktionary could not be reached ({fam.message}).</p>}
      {fam.state === "done" && !f && <p className="muted">Wiktionary has no Ancient Greek entry for this word.</p>}
      {f && (
        <>
          {f.etymology.length > 0 && (
            <div className={styles.famBlock}>
              <h3 className="label">Where it comes from</h3>
              {f.etymology.slice(0, 3).map((p, i) => <p key={i} className={styles.ety}>{p}</p>)}
            </div>
          )}
          {f.english.length > 0 && (
            <div className={styles.famBlock}>
              <h3 className="label">English words from it</h3>
              <p className={styles.english}>{f.english.map((w) => <span key={w}>{w}</span>)}</p>
            </div>
          )}
          {greek.length > 0 && (
            <div className={styles.famBlock}>
              <h3 className="label">Greek words built on it · {greek.length.toLocaleString("en-GB")}</h3>
              <p className={styles.kin}>
                {(all ? greek : greek.slice(0, 24)).map((w) => <Link key={w} href={wordHref(w)} lang="grc">{w}</Link>)}
              </p>
              {greek.length > 24 && <button type="button" className="chip" onClick={() => setAll(!all)}>{all ? "Fewer" : `All ${greek.length.toLocaleString("en-GB")}`}</button>}
            </div>
          )}
          {!f.etymology.length && !f.english.length && !greek.length && <p className="muted">Wiktionary&apos;s entry lists no etymology, derived words or descendants yet.</p>}
          <p className={styles.fine}>As listed by <a href={f.url} target="_blank" rel="noopener noreferrer">Wiktionary</a>&apos;s editors, CC BY-SA 4.0. Only this word is sent to Wiktionary.</p>
        </>
      )}
    </section>
  );
}
