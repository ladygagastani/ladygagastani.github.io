"use client";
/**
 * The Oracle: search the Greek texts (by form, by dictionary word, by grammar), the English
 * translations, and your own notes and saved words. Everything about a search lives in the
 * address, so a search can be bookmarked, shared, and gone back to.
 */
import { addRecentSearch } from "@/lib/recent-searches";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, versionOf, describe, type CatalogIndex } from "@/lib/catalog";
import { loadWorksMeta, familyOf, periodOf, FAMILIES, PERIODS, centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { detectScript, queryWords, toPattern, type Script } from "@/lib/search/input";
import { readReference, loadAbbrevs, type RefHit } from "@/lib/search/refs";
import { runSearch, QueryProblem, type Mode, type Outcome, type WorkHits } from "@/lib/search/run";
import { TAG_FIELDS, loadTags, type TagFilter } from "@/lib/search/engine";
import { loadDoc, snippet, type Part } from "@/lib/search/context";
import { englishWords } from "@/lib/search/codec";
import { readTag } from "@/lib/lookup/postag";
import { allMarks, allPageNotes, type Mark, type PageNote } from "@/lib/annotations";
import { useAcademy } from "@/lib/academy";
import type { TeiDoc } from "@/lib/tei/types";
import GreekKeyboard from "./GreekKeyboard";
import { useSwipeNav } from "@/lib/use-swipe-nav";
import styles from "./Search.module.css";
import { stoaLabel, useStoaTitles } from "@/wiki/useTitles";

type Tab = Mode | "library";
const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "forms", label: "Greek words", hint: "Words exactly as printed, accents ignored. Several words find them side by side." },
  { id: "lemma", label: "Dictionary word", hint: "Every form of a word (λόγος finds λόγου, λόγοις…), as the GLAUx treebank analyses it. Add grammar to narrow it, or search by grammar alone." },
  { id: "english", label: "Translations", hint: "Words in the English translations." },
  { id: "library", label: "My library", hint: "Your notes, bookmarks, highlights and saved words, on this device." },
];
const SCRIPTS: { id: Script | "auto"; label: string }[] = [
  { id: "auto", label: "Work it out" }, { id: "greek", label: "Greek letters" }, { id: "translit", label: "Latin letters" }, { id: "beta", label: "Beta Code" },
];
const EXAMPLES: Record<Tab, string[]> = {
  forms: ["μῆνιν", "ἄνδρα μοι", "rhododaktylos", "λογ*"],
  lemma: ["λόγος", "ψυχή", "ἀρετή", "δίκη"],
  english: ["wrath", "rosy-fingered", "justice", "wine-dark"],
  library: [],
};
const DIALECTS = ["Attic", "Attic/Koine", "Ionic", "Ionic/Epic", "Doric", "Koine"];

export default function Search() {
  const params = useSearchParams();
  const router = useRouter();
  const tab = (TABS.some((t) => t.id === params.get("m")) ? params.get("m") : "forms") as Tab;
  const q = params.get("q") ?? "";
  const script = (params.get("s") ?? "auto") as Script | "auto";
  const lemma = params.get("lem");
  const tagStr = (params.get("t") ?? "").padEnd(9, "-").slice(0, 9);
  const scope = { a: params.get("a"), w: params.get("w"), g: params.get("g"), p: params.get("p"), d: params.get("d") };
  const allEditions = params.get("all") === "1";
  const sort = params.get("o") === "date" ? "date" : "most";

  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [meta, setMeta] = useState<Record<string, WorkMeta> | null>(null);
  const [abbrevs, setAbbrevs] = useState<Awaited<ReturnType<typeof loadAbbrevs>> | null>(null);
  useEffect(() => {
    loadCatalog().then(setIdx, () => undefined);
    loadWorksMeta().then(setMeta);
    loadAbbrevs().then(setAbbrevs);
  }, []);

  /** Change the search: a new query is a new history entry, a refinement replaces it. */
  const go = (patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null || v === "") p.delete(k); else p.set(k, v); }
    const url = `/search?${p}`;
    if (push) router.push(url, { scroll: false }); else router.replace(url, { scroll: false });
  };

  const tags = useMemo<TagFilter>(() => Object.fromEntries(TAG_FIELDS.map((f, i) => [f.id, tagStr[i] === "-" ? undefined : tagStr[i]])), [tagStr]);
  const works = useMemo(() => {
    if (!idx || (!scope.a && !scope.w && !scope.g && !scope.p && !scope.d)) return null;
    if ((scope.g || scope.p || scope.d) && !meta) return undefined;   // still loading
    const out = new Set<string>();
    for (const w of idx.work.values()) {
      if (scope.w && w.id !== scope.w) continue;
      if (scope.a && idx.authorOf.get(w.id)?.id !== scope.a) continue;
      const m = meta?.[w.id];
      if ((scope.g || scope.p || scope.d) && !m) continue;
      if (scope.g && familyOf(m!.genre) !== scope.g) continue;
      if (scope.p && periodOf(m!.from) !== scope.p) continue;
      if (scope.d && m!.dialect !== scope.d) continue;
      out.add(w.id);
    }
    return out;
  }, [idx, meta, scope.a, scope.w, scope.g, scope.p, scope.d]);

  const refs: RefHit[] = useMemo(() => (idx && abbrevs && q && /\d/.test(q) ? readReference(q, idx, abbrevs) : []), [idx, abbrevs, q]);
  // phones: a sideways swipe over the results moves to the next or previous kind of search
  const swipe = useSwipeNav((d) => {
    const i = TABS.findIndex((t) => t.id === tab) + d;
    if (i >= 0 && i < TABS.length) go({ m: TABS[i].id === "forms" ? null : TABS[i].id, lem: null }, true);
  });

  return (
    <div className={`wrap ${styles.page}`}>
      <SearchBox key={`${tab}|${q}`} tab={tab} initial={q} script={script}
        onTab={(t) => go({ m: t === "forms" ? null : t, lem: null }, true)}
        onScript={(s) => go({ s: s === "auto" ? null : s })}
        onSubmit={(text) => { addRecentSearch(text); go({ q: text.trim(), lem: null }, true); }} />

      {refs.length > 0 && (
        <section className={styles.refs} aria-label="Go to a passage">
          <span className="label">Go straight to the passage</span>
          <ul>
            {refs.map((r) => (
              <li key={r.work}>
                <Link href={`/read?w=${r.work}${r.at ? `&at=${encodeURIComponent(r.at)}` : ""}`} transitionTypes={["page-turn"]}>
                  <b>{r.label}</b>{r.at && <> {r.at.replace(/\./g, " . ")}</>} <span aria-hidden="true">→</span>
                </Link>
                <small className="muted"> read as {r.how}</small>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div {...swipe}>
      {tab === "library" ? (
        <LibraryResults q={q} idx={idx} />
      ) : (
        <div className={styles.layout}>
          <aside className={styles.filters} aria-label="Narrow the search">
            <Filters idx={idx} tab={tab} scope={scope} allEditions={allEditions} tagStr={tagStr} go={go} />
          </aside>
          <div className={styles.results}>
            {!q && !(tab === "lemma" && Object.values(tags).some(Boolean)) ? (
              <Welcome tab={tab} onExample={(e) => go({ q: e, lem: null }, true)} />
            ) : idx && works !== undefined ? (
              <Results key={`${tab}|${q}|${script}|${lemma}|${tagStr}|${[...(works ?? [])].length}|${scope.a}|${scope.w}|${scope.g}|${scope.p}|${scope.d}|${allEditions}`}
                idx={idx} meta={meta} tab={tab as Mode} q={q} script={script} lemma={lemma} tags={tags} works={works} allEditions={allEditions}
                sort={sort} refsFound={refs.length > 0} go={go} />
            ) : (
              <p className={styles.status}>Opening the catalogue…</p>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ the search box
function SearchBox({ tab, initial, script, onTab, onScript, onSubmit }: {
  tab: Tab; initial: string; script: Script | "auto";
  onTab: (t: Tab) => void; onScript: (s: Script | "auto") => void; onSubmit: (q: string) => void;
}) {
  const [text, setText] = useState(initial);
  const [kbd, setKbd] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const greekTab = tab === "forms" || tab === "lemma";

  // what the typed words will be read as, shown back as the reader types
  const preview = readBack(text, script, greekTab);

  const key = (k: string) => {
    const el = input.current;
    if (!el) return;
    const a = el.selectionStart ?? text.length, b = el.selectionEnd ?? text.length;
    const next = k === "Backspace" ? (a === b ? text.slice(0, Math.max(0, a - 1)) + text.slice(b) : text.slice(0, a) + text.slice(b)) : text.slice(0, a) + k + text.slice(b);
    const caret = k === "Backspace" ? (a === b ? Math.max(0, a - 1) : a) : a + k.length;
    setText(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(caret, caret); });
  };

  return (
    <section className={styles.box} aria-label="Search">
      <div className={styles.tabs} role="tablist" aria-label="What to search">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === tab} onClick={() => onTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <form className={styles.form} role="search" onSubmit={(e) => { e.preventDefault(); onSubmit(text); }}>
        <label className="visually-hidden" htmlFor="oracle-q">{TABS.find((t) => t.id === tab)!.label}</label>
        <input id="oracle-q" ref={input} className={styles.input} value={text} onChange={(e) => setText(e.target.value)}
          lang={greekTab ? "grc" : undefined} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search"
          placeholder={tab === "english" ? "wrath, rosy-fingered…" : tab === "library" ? "a word from your notes or saved words" : "λόγος, logos, lo/gos, or Il. 1.1"} />
        {greekTab && (
          <button type="button" className={styles.kbdBtn} aria-pressed={kbd} onClick={() => setKbd((v) => !v)} title="Greek letters on screen">
            <span lang="grc" aria-hidden="true">αβγ</span><span className="visually-hidden">Show Greek letters on screen</span>
          </button>
        )}
        <button className="btn" type="submit">Ask</button>
      </form>
      <p className={styles.hint}>{TABS.find((t) => t.id === tab)!.hint}</p>
      {greekTab && (
        <div className={styles.readAs}>
          <label>
            <span className="label">Latin letters are</span>{" "}
            <select value={script} onChange={(e) => onScript(e.target.value as Script | "auto")}>
              {SCRIPTS.map((s) => <option key={s.id} value={s.id}>{s.id === "auto" ? "worked out for me" : s.id === "translit" ? "transliteration" : s.label}</option>)}
            </select>
          </label>
          {preview && ("error" in preview
            ? <span className={styles.warn}>{preview.error}</span>
            : preview.greek && <span>Searching for <b lang="grc" className={styles.gr}>{preview.greek}</b>{preview.as !== "greek" && <span className="muted"> (read as {preview.as === "beta" ? "Beta Code" : "transliteration"})</span>}</span>)}
        </div>
      )}
      {kbd && greekTab && <GreekKeyboard onKey={key} />}
    </section>
  );
}

/** What the typed words will be read as, shown back while typing. */
function readBack(text: string, script: Script | "auto", greekTab: boolean): { greek: string; as: Script } | { error: string; as: Script } | null {
  if (!greekTab || !text.trim()) return null;
  const out: string[] = [];
  for (const w of queryWords(text)) {
    if (/^\d/.test(w)) continue;
    const s = script === "auto" ? detectScript(w) : script;
    const p = toPattern(w, s);
    if ("error" in p) return { error: p.error, as: s };
    out.push(p.greek);
  }
  return { greek: out.join(" "), as: script === "auto" ? detectScript(text) : script };
}

function Welcome({ tab, onExample }: { tab: Tab; onExample: (q: string) => void }) {
  return (
    <div className={styles.welcome}>
      <p>Try one of these:</p>
      <div className={styles.examples}>
        {EXAMPLES[tab].map((e) => <button key={e} type="button" className="chip" lang={tab === "english" ? undefined : "grc"} onClick={() => onExample(e)}>{e}</button>)}
      </div>
      <ul className={styles.tips}>
        <li>Accents and breathings never matter: <span lang="grc">λογος</span> finds <span lang="grc">λόγος</span>.</li>
        <li>Type Greek, or Latin letters (<i>psyche</i>, <i>anthrōpos</i>), or Beta Code (<code>a)/nqrwpos</code>).</li>
        <li><code>*</code> stands for any letters and <code>?</code> for one: <span lang="grc">λογ*</span>, <span lang="grc">λ?γος</span>.</li>
        <li>Type a reference such as <i>Il. 1.1</i>, <i>S. Ant. 332</i> or <i>Plato Republic 327a</i> to go straight there.</li>
        <li>Press <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> on any page to search from there.</li>
      </ul>
    </div>
  );
}

// ------------------------------------------------------------ filters
function Filters({ idx, tab, scope, allEditions, tagStr, go }: {
  idx: CatalogIndex | null; tab: Tab; scope: Record<"a" | "w" | "g" | "p" | "d", string | null>; allEditions: boolean; tagStr: string;
  go: (p: Record<string, string | null>) => void;
}) {
  const authors = useMemo(() => (idx ? [...idx.catalog.authors].sort((a, b) => a.name.localeCompare(b.name)) : []), [idx]);
  const author = scope.a ? idx?.author.get(scope.a) : undefined;
  const setTag = (i: number, v: string) => go({ t: (tagStr.slice(0, i) + (v || "-") + tagStr.slice(i + 1)).replace(/-+$/, "") || null, lem: null });
  const any = Object.values(scope).some(Boolean) || tagStr.replace(/-/g, "") || allEditions;
  return (
    <div className={styles.filterBody}>
      {tab === "lemma" && (
        <fieldset className={styles.fs}>
          <legend>Grammar</legend>
          {TAG_FIELDS.map((f, i) => (
            <label key={f.id} className={styles.field}>
              <span>{f.label}</span>
              <select value={tagStr[i] === "-" ? "" : tagStr[i]} onChange={(e) => setTag(i, e.target.value)}>
                <option value="">any</option>
                {Object.entries(f.values).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          ))}
          <p className={styles.small}>As analysed in GLAUx: most of it by computer, some checked by hand.</p>
        </fieldset>
      )}
      <fieldset className={styles.fs}>
        <legend>Where</legend>
        <label className={styles.field}>
          <span>Author</span>
          <select value={scope.a ?? ""} onChange={(e) => go({ a: e.target.value || null, w: null })}>
            <option value="">any author</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        {author && (
          <label className={styles.field}>
            <span>Work</span>
            <select value={scope.w ?? ""} onChange={(e) => go({ w: e.target.value || null })}>
              <option value="">all {author.works.length} works</option>
              {author.works.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
            </select>
          </label>
        )}
        <label className={styles.field}>
          <span>Kind of writing</span>
          <select value={scope.g ?? ""} onChange={(e) => go({ g: e.target.value || null })}>
            <option value="">any</option>
            {FAMILIES.map(([f]) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>Period</span>
          <select value={scope.p ?? ""} onChange={(e) => go({ p: e.target.value || null })}>
            <option value="">any</option>
            {PERIODS.map(([p]) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>Dialect</span>
          <select value={scope.d ?? ""} onChange={(e) => go({ d: e.target.value || null })}>
            <option value="">any</option>
            {DIALECTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        {(scope.g || scope.p || scope.d) && <p className={styles.small}>Kind, period and dialect are known for the 1,186 works GLAUx describes; other works are left out when these are set.</p>}
        <label className={styles.check}>
          <input type="checkbox" checked={allEditions} onChange={(e) => go({ all: e.target.checked ? "1" : null })} />
          <span>Every {tab === "english" ? "translation" : "edition"}, not only the one the reader opens first</span>
        </label>
      </fieldset>
      {any && <button type="button" className="chip" onClick={() => go({ a: null, w: null, g: null, p: null, d: null, t: null, all: null, lem: null })}>Clear all</button>}
    </div>
  );
}

// ------------------------------------------------------------ results
function Results({ idx, meta, tab, q, script, lemma, tags, works, allEditions, sort, refsFound, go }: {
  idx: CatalogIndex; meta: Record<string, WorkMeta> | null; tab: Mode; q: string; script: Script | "auto"; lemma: string | null;
  tags: TagFilter; works: Set<string> | null; allEditions: boolean; sort: "most" | "date"; refsFound: boolean;
  go: (p: Record<string, string | null>) => void;
}) {
  const [res, setRes] = useState<{ outcome?: Outcome; error?: string; problem?: boolean } | null>(null);
  const [shownWorks, setShownWorks] = useState(40);
  useEffect(() => {
    let live = true;
    runSearch(idx, { mode: tab, q, script, lemma, tags, works, allEditions }).then(
      (outcome) => { if (live) setRes({ outcome }); },
      (e: Error) => { if (live) setRes({ error: e.message, problem: e instanceof QueryProblem }); },
    );
    return () => { live = false; };
    // the component is keyed by every input, so this runs once per search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!res) return <p className={styles.status} aria-live="polite"><span className={styles.pulse} aria-hidden="true" />Consulting the index…</p>;
  if (res.error) {
    if (res.problem && refsFound) return null;
    return <p className={res.problem ? styles.status : styles.warn} role="alert">{res.error}</p>;
  }
  const o = res.outcome!;
  const authors = new Set(o.works.map((w) => idx.authorOf.get(w.work)?.id)).size;
  const sorted = [...o.works].sort(sort === "date"
    ? (a, b) => (meta?.[a.work]?.from ?? 9999) - (meta?.[b.work]?.from ?? 9999) || b.count - a.count
    : (a, b) => b.count - a.count);

  return (
    <div className={styles.found}>
      <div className={styles.summary} aria-live="polite">
        <p className={styles.count}>
          {o.hits ? <><b>{o.hits.toLocaleString("en-GB")}</b> {o.hits === 1 ? "result" : "results"} in <b>{o.works.length.toLocaleString("en-GB")}</b> {o.works.length === 1 ? "work" : "works"} by {authors} {authors === 1 ? "author" : "authors"}</> : "Nothing found."}
        </p>
        {o.works.length > 1 && (
          <div className={styles.seg} role="radiogroup" aria-label="Order">
            <button type="button" role="radio" aria-checked={sort === "most"} onClick={() => go({ o: null })}>Most results</button>
            <button type="button" role="radio" aria-checked={sort === "date"} onClick={() => go({ o: "date" })}>Earliest first</button>
          </div>
        )}
      </div>

      {tab === "lemma" && o.lemmas.length > 1 && (
        <div className={styles.lemmas}>
          <span className="label">Dictionary words spelled this way</span>
          <div className={styles.examples}>
            <button type="button" className="chip" aria-pressed={!lemma} onClick={() => go({ lem: null })}>all of them</button>
            {o.lemmas.slice(0, 24).map((l) => (
              <button key={l.lemma} type="button" className="chip" lang="grc" aria-pressed={o.read[0]?.matched.length === 1 && o.read[0].matched[0].key === l.lemma}
                onClick={() => go({ lem: l.lemma })}>{l.lemma} <small className="muted">{l.count.toLocaleString("en-GB")}</small></button>
            ))}
          </div>
        </div>
      )}
      {tab === "forms" && o.read.some((r) => r.matched.length > 1) && (
        <div className={styles.lemmas}>
          {o.read.filter((r) => r.matched.length > 1).map((r) => (
            <p key={r.typed} className={styles.small}>
              <span lang="grc">{r.greek}</span> matched {r.more ? "more than " : ""}{r.matched.length} forms: <span lang="grc">{r.matched.slice(0, 30).map((m) => m.label).join(", ")}{r.matched.length > 30 || r.more ? " …" : ""}</span>
            </p>
          ))}
        </div>
      )}
      {o.notes.map((n) => <p key={n} className={styles.note}>{n}</p>)}

      <ol className={styles.groups}>
        {sorted.slice(0, shownWorks).map((g, i) => (
          <WorkGroup key={g.work} g={g} idx={idx} meta={meta?.[g.work]} texts={o.texts} startOpen={i < 3} tab={tab} allEditions={allEditions} />
        ))}
      </ol>
      {sorted.length > shownWorks && (
        <button type="button" className="btn ghost" onClick={() => setShownWorks((n) => n + 60)}>Show more works ({(sorted.length - shownWorks).toLocaleString("en-GB")} left)</button>
      )}
      <p className={styles.small}>
        {tab === "english" ? "Translations as published in the Perseus and First1K collections." : "Greek texts from the Perseus and First1K collections."}
        {tab === "lemma" && " Dictionary forms and grammar from GLAUx (Keersmaekers, CC BY-SA 4.0), placed on the words of these editions."}
      </p>
    </div>
  );
}

function WorkGroup({ g, idx, meta, texts, startOpen, tab, allEditions }: {
  g: WorkHits; idx: CatalogIndex; meta: WorkMeta | undefined; texts: Outcome["texts"]; startOpen: boolean; tab: Mode; allEditions: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [shown, setShown] = useState(12);
  const [docs, setDocs] = useState<Record<number, TeiDoc | string>>({});
  const work = idx.work.get(g.work);
  const author = idx.authorOf.get(g.work);
  const list = useMemo(() => [...g.texts].flatMap(([t, hs]) => hs.map((h) => ({ t, h }))), [g]);
  const visible = list.slice(0, shown);
  const need = useMemo(() => [...new Set(visible.map((x) => x.t))], [visible]);

  useEffect(() => {
    if (!open) return;
    let live = true;
    for (const t of need) {
      loadDoc(texts[t].urn).then(
        (d) => { if (live) setDocs((s) => (s[t] ? s : { ...s, [t]: d })); },
        (e: Error) => { if (live) setDocs((s) => ({ ...s, [t]: e.message })); },
      );
    }
    return () => { live = false; };
  }, [open, need, texts]);

  const lang = tab === "english" ? "eng" : "grc";
  return (
    <li className={styles.group}>
      <button type="button" className={styles.groupHead} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={styles.groupTitle}><b>{work?.title ?? g.work}</b> <span className="muted">{author?.name}</span></span>
        {meta?.from != null && <span className={styles.groupDate} title={DATE_NOTE}>{centuries(meta.from, meta.to)}</span>}
        <span className={styles.groupCount}>{g.count.toLocaleString("en-GB")}</span>
      </button>
      {open && (
        <div className={styles.hits}>
          <ol>
            {visible.map(({ t, h }) => {
              const d = docs[t];
              const info = texts[t];
              const cat = idx.text.get(info.urn);
              const key = `${t}:${h.unit}:${h.words.join(",")}`;
              if (typeof d === "string") return <li key={key} className={styles.warn}>{d}</li>;
              if (!d) return <li key={key} className={styles.hitLoading}>…</li>;
              const u = d.units[h.unit];
              if (!u) return null;
              const ref = u.ref.join(".");
              const parts = snippet(u, h.words, lang);
              const href = lang === "grc"
                ? `/read?w=${g.work}&ed=${versionOf(info.urn)}&at=${encodeURIComponent(ref)}&hl=${h.words.join(",")}`
                : `/read?w=${g.work}&tr=${versionOf(info.urn)}&tu=${h.unit}&find=${encodeURIComponent(h.words.map((i) => englishWords(u)[i]).filter(Boolean).join(" "))}`;
              const tagText = h.tag !== undefined ? <TagLabel id={h.tag} /> : null;
              return (
                <li key={key} className={styles.hit}>
                  <Link className={styles.ref} href={href} transitionTypes={["page-turn"]}>{ref}</Link>
                  <p lang={lang === "grc" ? "grc" : undefined} className={lang === "grc" ? styles.gr : undefined}>
                    {parts.map((p: Part, i) => (p.hit ? <mark key={i}>{p.t}</mark> : p.t))}
                  </p>
                  {(tagText || (allEditions && cat)) && (
                    <p className={styles.hitMeta}>{tagText}{allEditions && cat && <span className="muted">{describe(cat)}</span>}</p>
                  )}
                </li>
              );
            })}
          </ol>
          {list.length > shown && <button type="button" className="chip" onClick={() => setShown((n) => n + 40)}>Show more here ({(list.length - shown).toLocaleString("en-GB")} left)</button>}
        </div>
      )}
    </li>
  );
}

let tagList: string[] | null = null;
function TagLabel({ id }: { id: number }) {
  const [tags, setTags] = useState<string[] | null>(tagList);
  useEffect(() => { if (!tags) loadTags().then((t) => { tagList = t; setTags(t); }); }, [tags]);
  if (!tags?.[id]) return null;
  const r = readTag(tags[id]);
  return <span className={styles.tagText}>{r.pos}{r.detail ? ` · ${r.detail}` : ""}</span>;
}

// ------------------------------------------------------------ my library
function LibraryResults({ q, idx }: { q: string; idx: CatalogIndex | null }) {
  const [marks, setMarks] = useState<Mark[] | null>(null);
  const [pageNotes, setPageNotes] = useState<PageNote[]>([]);
  const stoa = useStoaTitles(pageNotes.some((p) => p.kind === "stoa"));
  const deck = useAcademy((s) => s.deck);
  useEffect(() => { allMarks().then(setMarks, () => setMarks([])); allPageNotes().then(setPageNotes, () => {}); }, []);
  const n = fold(q).trim().replace(/^#/, "");
  if (!n) return <p className={styles.status}>Type a word to look for in your notes (and their tags), bookmarks, highlights and saved words.</p>;
  const found = (marks ?? []).filter((m) => [m.quote, m.text, m.link?.label, idx?.work.get(m.work)?.title, ...(m.tags ?? []), ...(m.collections ?? [])].some((s) => s && fold(s).includes(n)));
  const others = pageNotes.filter((p) => [p.text, p.target, p.kind === "author" ? idx?.author.get(p.target)?.name : p.kind === "stoa" ? stoaLabel(stoa, p.target) : null, ...(p.tags ?? [])].some((s) => s && fold(s).includes(n)));
  const words = Object.values(deck).filter((c) => fold(c.lemma).includes(n) || fold(c.gloss).includes(n));
  const KIND: Record<Mark["kind"], string> = { bookmark: "Bookmark", favourite: "Favourite", note: "Note", highlight: "Highlight", xref: "Cross-reference" };
  return (
    <div className={styles.found}>
      <p className={styles.count}><b>{found.length}</b> in your notes and marks · <b>{others.length}</b> notes on authors, words and the Painted Stoa · <b>{words.length}</b> saved words</p>
      {found.length > 0 && (
        <ol className={styles.libList}>
          {found.map((m) => (
            <li key={m.id}>
              <Link href={`/read?w=${m.work}&ed=${m.ed}&at=${encodeURIComponent(m.start.u)}`} transitionTypes={["page-turn"]}>
                <span className="label">{KIND[m.kind]}</span> <b>{idx?.work.get(m.work)?.title ?? m.work} {m.start.u}</b>
              </Link>
              {m.quote && <p lang="grc" className={styles.gr}>{m.quote}</p>}
              {m.text && <p>{m.text}</p>}
              {!!m.tags?.length && <p className={styles.small}>{m.tags.map((t) => `#${t}`).join(" ")}</p>}
            </li>
          ))}
        </ol>
      )}
      {others.length > 0 && (
        <ol className={styles.libList}>
          {others.map((p) => (
            <li key={p.id}>
              <Link href={p.kind === "author" ? `/treasury?s=authors&a=${p.target}` : p.kind === "stoa" ? `/stoa/${p.target.replace("#top", "")}` : `/treasury/word?l=${encodeURIComponent(p.target)}`} transitionTypes={["page-turn"]}>
                <span className="label">{p.kind === "author" ? "Note on an author" : p.kind === "stoa" ? "Note in the Painted Stoa" : "Note on a word"}</span>{" "}
                <b lang={p.kind === "word" ? "grc" : undefined}>{p.kind === "author" ? idx?.author.get(p.target)?.name ?? p.target : p.kind === "stoa" ? stoaLabel(stoa, p.target) : p.target}</b>
              </Link>
              <p>{p.text.length > 240 ? p.text.slice(0, 240) + "…" : p.text}</p>
            </li>
          ))}
        </ol>
      )}
      {words.length > 0 && (
        <ol className={styles.libList}>
          {words.map((c) => (
            <li key={c.id}><span className="label">Saved word</span> <Link href={`/treasury/word?l=${encodeURIComponent(c.lemma)}`} transitionTypes={["page-turn"]}><b lang="grc" className={styles.gr}>{c.lemma}</b></Link> <span className="muted">{c.gloss}</span></li>
          ))}
        </ol>
      )}
      <p className={styles.small}>Your library lives only in this browser; nothing is sent anywhere.</p>
    </div>
  );
}
