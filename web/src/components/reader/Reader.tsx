"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  loadCatalog, greekEditions, translations, describe, versionOf,
  type CatalogIndex, type CatText, type CatWork,
} from "@/lib/catalog";
import { getXml, type From } from "@/lib/texts/source";
import { parseInWorker, type Parsed } from "@/lib/tei/client";
import { alignChunk, coverage, type Row } from "@/lib/tei/align";
import { findRef, chunkOf } from "@/lib/tei/refs";
import { getPosition, savePosition } from "@/lib/position";
import { useSettings, type Columns } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import { AREAS } from "@/config/areas";
import { Blocks } from "./Blocks";
import WordPanel, { type WordContext } from "./WordPanel";
import { norm } from "@/lib/lookup/words";
import { useMarks, cmp, type Mark, type Colour } from "@/lib/annotations";
import type { Block } from "@/lib/tei/types";
import PassageToolbar, { type Selection } from "./PassageToolbar";
import NoteEditor from "./NoteEditor";
import ShareDialog, { type ShareData } from "./ShareDialog";
import styles from "./Reader.module.css";

type Load = { state: "loading"; step: string } | { state: "error"; message: string } | { state: "ready" };

const FROM_TEXT: Record<From, string> = { github: "GitHub", browser: "your browser storage", folder: "your folder" };

function pickEdition(w: CatWork, ed: string | null, remembered: string | null): CatText | undefined {
  const eds = greekEditions(w);
  const all = eds.length ? eds : w.texts.filter((t) => t.kind === "edition");
  return all.find((t) => versionOf(t.urn) === ed) ?? all.find((t) => versionOf(t.urn) === remembered) ?? all.find((t) => t.col === "perseus") ?? all[0];
}
function pickTranslation(w: CatWork, tr: string | null, remembered: string | null | undefined): CatText | null {
  if (tr === "none") return null;
  const all = translations(w);
  if (!all.length) return null;
  if (tr) return all.find((t) => versionOf(t.urn) === tr) ?? all[0];
  if (remembered === null) return null;
  return all.find((t) => versionOf(t.urn) === remembered) ?? all[0];
}

const blockText = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ").replace(/\s+/g, " ").trim();

const MARK_ICON: Record<string, React.ReactNode> = {
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  favourite: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  note: <path d="M4 4h16v12H8l-4 4z" />,
};

/** One passage row: reference and your marks in the margin, Greek, translation, and any notes. */
const RowView = memo(function RowView({ row, marks, openNote, onCloseNote }: { row: Row; marks: Mark[]; openNote: string | null; onCloseNote: () => void }) {
  const notes = marks.filter((m) => m.kind === "note");
  return (
    <section className={styles.row} id={`r-${row.key}`} data-key={row.key}>
      <div className={styles.ref}>
        <button type="button" data-row={row.key} title="Actions for this passage">{row.key}</button>
        {marks.some((m) => m.kind !== "highlight") && (
          <span className={styles.marks}>
            {marks.filter((m) => m.kind !== "highlight").map((m) => (
              <button key={m.id} type="button" className={styles[`mk-${m.kind}`]} data-mark={m.id} title={m.kind === "note" ? (m.text || "Note") : m.kind === "bookmark" ? "Bookmark (click to remove)" : "Favourite (click to remove)"}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{MARK_ICON[m.kind]}</svg>
              </button>
            ))}
          </span>
        )}
      </div>
      <div className={styles.grc} lang="grc">
        {row.greek.map((u) => <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={u.ref.join(".")} /></div>)}
      </div>
      <div className={styles.tr}>
        {row.trans.length ? <Blocks blocks={row.trans} greek={false} keyPrefix={`t${row.key}`} /> : <span className={styles.none} aria-label="No translation for this passage">—</span>}
      </div>
      {notes.length > 0 && (
        <div className={styles.notes}>
          {notes.map((m) => <NoteEditor key={`${m.id}-${openNote === m.id}`} mark={m} startOpen={openNote === m.id} onClose={onCloseNote} />)}
        </div>
      )}
    </section>
  );
});

export default function Reader() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useUI((s) => s.showToast);
  const columns = useSettings((s) => s.columns);
  const setSettings = useSettings((s) => s.set);

  const workId = params.get("w") ?? "";
  const at = params.get("at");
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; parsed?: Parsed; from?: { grc: From; tr: From | null }; error?: string } | null>(null);
  const [step, setStep] = useState<{ key: string; text: string } | null>(null);
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  const [sel, setSel] = useState<Selection | null>(null);
  const [share, setShare] = useState<ShareData | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [marksOpen, setMarksOpen] = useState(false);
  const allMarks = useMarks((s) => s.marks);
  useEffect(() => { if (workId) useMarks.getState().load(workId); }, [workId]);
  const [goto, setGoto] = useState("");
  const [help, setHelp] = useState(false);
  const [retry, setRetry] = useState(0);
  const gotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setCatalogError(e.message)); }, []);

  // where the reader stopped last time, read once when a work opens
  const [snap, setSnap] = useState<{ work: string; pos: ReturnType<typeof getPosition> } | null>(null);
  if (idx && snap?.work !== workId) setSnap({ work: workId, pos: getPosition(workId) });
  const remembered = snap?.work === workId ? snap.pos : null;

  const work = idx?.work.get(workId);
  const author = idx?.authorOf.get(workId);
  const grcText = work ? pickEdition(work, params.get("ed"), remembered?.ed ?? null) : undefined;
  const trText = work ? pickTranslation(work, params.get("tr"), remembered ? remembered.tr : undefined) : null;
  const cite = `${author?.name ?? ""}, ${work?.title ?? ""}`;
  const loadKey = grcText && snap?.work === workId ? `${grcText.urn}|${trText?.urn ?? ""}|${retry}` : null;

  // ------------------------------------------------------------ load and parse the texts
  useEffect(() => {
    if (!idx || !grcText || !loadKey) return;
    let stale = false;
    (async () => {
      try {
        const [g, t] = await Promise.all([getXml(idx, grcText), trText ? getXml(idx, trText).catch(() => null) : null]);
        if (stale) return;
        setStep({ key: loadKey, text: "Preparing the text…" });
        const p = await parseInWorker(g.xml, t?.xml ?? null);
        if (stale) return;
        setResult({ key: loadKey, parsed: p, from: { grc: g.from, tr: t?.from ?? null } });
        if (trText && !t) toast("The translation could not be loaded; showing the Greek only.");
      } catch (e) {
        if (!stale) setResult({ key: loadKey, error: (e as Error).message });
      }
    })();
    return () => { stale = true; };
    // grcText and trText are identified by loadKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, loadKey, toast]);

  const current = result && result.key === loadKey ? result : null;
  const load: Load = catalogError ? { state: "error", message: catalogError }
    : !current ? { state: "loading", step: !idx ? "Opening the catalogue…" : step?.key === loadKey ? step.text : "Fetching the Greek text…" }
    : current.error ? { state: "error", message: current.error } : { state: "ready" };
  const parsed = current?.parsed ?? null;
  const from = current?.from ?? null;
  const doc = parsed?.doc;

  // ------------------------------------------------------------ which page, and which passage to show
  const target = at ?? remembered?.at ?? null;
  const startUnit = doc && target ? Math.max(0, findRef(doc, target)) : 0;
  const chunk = doc ? chunkOf(doc, startUnit) : 0;
  const placed = parsed?.placed ?? null;
  const unitKeys = useMemo(() => new Set(doc?.units.map((u) => u.ref.join(".")) ?? []), [doc]);
  const rows = useMemo(() => (doc && doc.chunks[chunk] ? alignChunk(doc, doc.chunks[chunk], placed) : []), [doc, chunk, placed]);
  const cov = trText && placed ? coverage(rows) : 1;
  const startKey = doc && startUnit > 0 ? doc.units[startUnit].ref.join(".") : null;

  // once the page is drawn, bring the requested passage into view (and briefly mark it if it was asked for)
  useEffect(() => {
    if (!rows.length) return;
    if (!startKey) { window.scrollTo({ top: 0 }); return; }
    const row = rows.find((r) => r.greek.some((u) => u.ref.join(".") === startKey));
    const el = row && document.getElementById(`r-${row.key}`);
    if (!el) return;
    requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    if (at) { el.classList.remove(styles.flash); void el.offsetWidth; el.classList.add(styles.flash); }
  }, [rows, startKey, at]);

  // ------------------------------------------------------------ remember where the reader is
  const edV = grcText ? versionOf(grcText.urn) : null;
  const trV = trText ? versionOf(trText.urn) : null;
  useEffect(() => {
    if (!rows.length || !edV) return;
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) savePosition(workId, { ed: edV, tr: trV, at: (top.target as HTMLElement).dataset.key! });
    }, { rootMargin: "-80px 0px -70% 0px" });
    document.querySelectorAll("[data-key]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rows, workId, edV, trV]);

  // ------------------------------------------------------------ navigation
  const href = (o: { ed?: string; tr?: string | null; at?: string }) => {
    const q = new URLSearchParams({ w: workId });
    const ed = o.ed ?? edV;
    if (ed) q.set("ed", ed);
    q.set("tr", o.tr === undefined ? (trV ?? "none") : (o.tr ?? "none"));
    if (o.at) q.set("at", o.at);
    return `/read?${q}`;
  };
  const goChunk = (i: number) => {
    if (!doc || i < 0 || i >= doc.chunks.length) return;
    router.replace(href({ at: doc.units[doc.chunks[i].first].ref.join(".") }), { scroll: false });
  };
  const goChunkRef = useRef(goChunk);
  useEffect(() => { goChunkRef.current = goChunk; });

  const submitGoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return;
    const i = findRef(doc, goto);
    if (i < 0) { toast(`No passage "${goto}" in this text. Try a reference like ${doc.units[Math.min(40, doc.units.length - 1)].ref.join(".")}.`); return; }
    router.replace(href({ at: goto.trim().replace(/\s+/g, ".") }), { scroll: false });
    setGoto("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goChunkRef.current(chunk + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goChunkRef.current(chunk - 1); }
      else if (e.key === "g") { e.preventDefault(); gotoRef.current?.focus(); }
      else if (e.key === "?") setHelp((h) => !h);
      else if (e.key === "Escape") { setWord(null); setHelp(false); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [chunk]);

  // ------------------------------------------------------------ your marks
  const order = useMemo(() => new Map(doc?.units.map((u, i) => [u.ref.join("."), i]) ?? []), [doc]);
  const marks = useMemo(() => allMarks.filter((m) => m.ed === edV), [allMarks, edV]);
  const marksByRow = useMemo(() => {
    const byUnit = new Map<string, string>();
    for (const r of rows) for (const u of r.greek) byUnit.set(u.ref.join("."), r.key);
    const out = new Map<string, Mark[]>();
    for (const m of marks) {
      const rk = byUnit.get(m.start.u);
      if (rk) out.set(rk, [...(out.get(rk) ?? []), m]);
    }
    return out;
  }, [rows, marks]);
  const noMarks = useMemo<Mark[]>(() => [], []);

  // highlights are drawn onto the word spans after each render of the page
  useEffect(() => {
    document.querySelectorAll("[data-hl]").forEach((el) => el.removeAttribute("data-hl"));
    for (const m of marks) {
      if (m.kind !== "highlight") continue;
      const a = order.get(m.start.u), b = order.get(m.end.u);
      if (a === undefined || b === undefined) continue;
      for (let i = a; i <= b; i++) {
        const key = doc!.units[i].ref.join(".");
        const unit = document.querySelector(`[data-u="${CSS.escape(key)}"]`);
        if (!unit) continue;
        const spans = unit.querySelectorAll<HTMLElement>("[data-w]");
        const from = i === a ? m.start.i : 0, to = i === b ? m.end.i : spans.length - 1;
        for (let j = from; j <= to && j < spans.length; j++) spans[j].dataset.hl = m.colour ?? "ochre";
      }
    }
  }, [marks, rows, order, doc]);

  const pointOf = (span: HTMLElement) => {
    const unit = span.closest<HTMLElement>("[data-u]")!;
    return { u: unit.dataset.u!, i: [...unit.querySelectorAll("[data-w]")].indexOf(span) };
  };
  const selectSpans = (spans: HTMLElement[], rect: DOMRect) => {
    if (!spans.length) return;
    const rowKeys = [...new Set(spans.map((s) => s.closest<HTMLElement>("[data-key]")!.dataset.key!))];
    setSel({ start: pointOf(spans[0]), end: pointOf(spans[spans.length - 1]), quote: spans.map((s) => s.textContent).join(" "), rowKeys,
      rect: { left: rect.left, top: rect.top, bottom: rect.bottom } });
  };
  const onTextMouseUp = () => {
    const s = window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return;
    const range = s.getRangeAt(0);
    const spans = [...document.querySelectorAll<HTMLElement>("article [data-u] [data-w]")].filter((sp) => range.intersectsNode(sp));
    selectSpans(spans, range.getBoundingClientRect());
  };

  const rangeLabel = (a: string, b: string) => (a === b ? a : `${a}–${b}`);
  async function act(a: "bookmark" | "favourite" | "note" | "share" | { highlight: Colour }) {
    if (!sel || !edV) return;
    const base = { work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote };
    const where = rangeLabel(sel.start.u, sel.end.u);
    if (a === "share") {
      const rowsHit = rows.filter((r) => sel.rowKeys.includes(r.key));
      const tr = rowsHit.map((r) => blockText(r.trans)).filter(Boolean).join(" ");
      setShare({ words: sel.quote.split(" "), greekText: sel.quote, translation: tr || null, cite: `${cite} ${where}`,
        link: `${location.origin}${href({ at: sel.start.u })}` });
    } else if (typeof a === "object") {
      await useMarks.getState().add({ ...base, kind: "highlight", colour: a.highlight });
    } else if (a === "note") {
      const m = await useMarks.getState().add({ ...base, kind: "note", text: "" });
      setOpenNote(m.id);
    } else {
      await useMarks.getState().add({ ...base, kind: a });
      toast(a === "bookmark" ? `Bookmarked ${where}.` : `Added ${where} to your favourite passages.`);
    }
    window.getSelection()?.removeAllRanges();
    setSel(null);
  }

  // clicks inside the text: words open the look-up; margin references and marks act on the passage
  const onTextClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    const w = el.closest<HTMLElement>("[data-w]");
    if (w) {
      document.querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel));
      w.classList.add(styles.sel);
      // which passage the word is in, and which occurrence of this form within it
      const unit = w.closest<HTMLElement>("[data-u]");
      let ctx: WordContext | null = null;
      if (unit && doc) {
        const same = [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!));
        ctx = { work: workId, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: unitKeys, depth: doc.levels.length };
      }
      setWord({ w: w.dataset.w!, ctx });
      return;
    }
    const r = el.closest<HTMLElement>("[data-row]");
    if (r) {
      const row = document.getElementById(`r-${r.dataset.row}`);
      const spans = row ? [...row.querySelectorAll<HTMLElement>("[data-u] [data-w]")] : [];
      selectSpans(spans, r.getBoundingClientRect());
      return;
    }
    const mk = el.closest<HTMLElement>("[data-mark]");
    if (mk) {
      const m = marks.find((x) => x.id === mk.dataset.mark);
      if (!m) return;
      if (m.kind === "note") setOpenNote(openNote === m.id ? null : m.id);
      else { useMarks.getState().remove(m.id); toast(m.kind === "bookmark" ? "Bookmark removed." : "Removed from favourites."); }
    }
  };

  // ------------------------------------------------------------ render
  if (!workId || (idx && !work)) {
    return (
      <div className={`wrap ${styles.message}`}>
        <h1>No work chosen</h1>
        <p className="muted">Choose something to read in {AREAS.library.name}.</p>
        <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Open {AREAS.library.name}</Link>
      </div>
    );
  }

  const chunkInfo = doc?.chunks[chunk];
  const setCols = (c: Columns) => setSettings({ columns: c });

  return (
    <div className={`${styles.reader} ${styles["cols-" + columns]} ${word ? styles.withPanel : ""}`}>
      <header className={`wrap ${styles.top}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumbs">
          <Link href={AREAS.library.href} transitionTypes={["page-turn"]}>{AREAS.library.name}</Link>
          {author && <><span aria-hidden="true">›</span><Link href={`${AREAS.library.href}?a=${author.id}`} transitionTypes={["page-turn"]}>{author.name}</Link></>}
        </nav>
        <h1 className={styles.title}>{work?.title ?? " "}
          {grcText?.label && grcText.label !== work?.title && <span className={styles.titleGr} lang="grc">{grcText.label}</span>}
        </h1>

        {work && grcText && (
          <div className={styles.controls}>
            <label className={styles.pick}><span className="label">Greek text</span>
              <select value={versionOf(grcText.urn)} onChange={(e) => router.replace(href({ ed: e.target.value }), { scroll: false })}>
                {(greekEditions(work).length ? greekEditions(work) : work.texts.filter((t) => t.kind === "edition")).map((t) => <option key={t.urn} value={versionOf(t.urn)}>{describe(t)}</option>)}
              </select>
            </label>
            <label className={styles.pick}><span className="label">Translation</span>
              <select value={trText ? versionOf(trText.urn) : "none"} onChange={(e) => router.replace(href({ tr: e.target.value }), { scroll: false })}>
                <option value="none">None</option>
                {translations(work).map((t) => <option key={t.urn} value={versionOf(t.urn)}>{describe(t)}</option>)}
              </select>
            </label>
            <div className={styles.seg} role="radiogroup" aria-label="Columns">
              {([["both", "Both"], ["greek", "Greek"], ["trans", "English"]] as [Columns, string][]).map(([c, l]) => (
                <button key={c} type="button" role="radio" aria-checked={columns === c} onClick={() => setCols(c)} disabled={c !== "greek" && !trText}>{l}</button>
              ))}
            </div>
          </div>
        )}
      </header>

      {load.state === "loading" && <div className={`wrap ${styles.status}`}><span className={`meander ${styles.loadingBand}`} aria-hidden="true" /><p>{load.step}</p></div>}
      {load.state === "error" && (
        <div className={`wrap ${styles.status}`}>
          <p className={styles.warn}>{load.message}</p>
          <div className={styles.statusActions}>
            <button type="button" className="btn" onClick={() => setRetry((r) => r + 1)}>Try again</button>
            <Link className="btn ghost" href={AREAS.downloads.href} transitionTypes={["page-turn"]}>Offline library</Link>
          </div>
        </div>
      )}

      {load.state === "ready" && doc && chunkInfo && (
        <>
          <div className={`wrap ${styles.bar}`}>
            <div className={styles.pager}>
              <button type="button" onClick={() => goChunk(chunk - 1)} disabled={chunk === 0} aria-label="Previous page">←</button>
              <select aria-label="Page" value={chunk} onChange={(e) => goChunk(+e.target.value)}>
                {doc.chunks.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
              </select>
              <button type="button" onClick={() => goChunk(chunk + 1)} disabled={chunk === doc.chunks.length - 1} aria-label="Next page">→</button>
            </div>
            <form className={styles.goto} onSubmit={submitGoto} role="search">
              <input ref={gotoRef} id="reader-goto" value={goto} onChange={(e) => setGoto(e.target.value)} placeholder={`Go to ${doc.levels.join(".")}`} aria-label="Go to reference" />
              <button type="submit">Go</button>
            </form>
            <div className={styles.marksMenu}>
              <button type="button" onClick={() => setMarksOpen(!marksOpen)} aria-expanded={marksOpen}>Your marks ({allMarks.length})</button>
              {marksOpen && (
                <ul>
                  {!allMarks.length && <li className="muted">Select words in the Greek, or click a passage number, to bookmark, highlight or write a note.</li>}
                  {[...allMarks].sort((a, b) => cmp(a.start, b.start, order)).map((m) => (
                    <li key={m.id}>
                      <button type="button" onClick={() => { setMarksOpen(false); router.replace(href({ at: m.start.u }), { scroll: false }); }}>
                        <span className="label">{m.kind} · {rangeLabel(m.start.u, m.end.u)}</span>
                        <span>{m.kind === "note" && m.text ? m.text.slice(0, 80) : <span lang="grc">{m.quote.slice(0, 60)}</span>}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="button" className={styles.helpBtn} onClick={() => setHelp((h) => !h)} aria-expanded={help}>Keys <kbd>?</kbd></button>
          </div>

          {help && (
            <div className={`wrap ${styles.help}`} role="note">
              <p><kbd>←</kbd> <kbd>→</kbd> previous / next page · <kbd>g</kbd> go to a reference · click a word to look it up · select words or click a passage number for bookmarks, notes, highlights and sharing · <kbd>Esc</kbd> close</p>
            </div>
          )}

          {trText && cov < 1 && (
            <p className={`wrap ${styles.cover}`}>
              The translation has text beside {Math.round(cov * 100)}% of the passages on this page. It follows its own divisions, so some Greek passages share one stretch of English.
            </p>
          )}

          <div className={`wrap ${styles.cols}`} aria-hidden="true">
            <span />
            <span className="label">Greek · {describe(grcText!)}</span>
            <span className="label">{trText ? `English · ${describe(trText)}` : ""}</span>
          </div>

          <article className={`wrap ${styles.text}`} onClick={onTextClick} onMouseUp={onTextMouseUp} aria-label={`${cite}, ${chunkInfo.label}`}>
            {rows.map((r) => <RowView key={r.key} row={r} marks={marksByRow.get(r.key) ?? noMarks} openNote={openNote} onCloseNote={() => setOpenNote(null)} />)}
          </article>
          {sel && <PassageToolbar sel={sel} onAction={act} onClose={() => setSel(null)} />}
          {share && <ShareDialog data={share} onClose={() => setShare(null)} />}

          <div className={`wrap ${styles.bottom}`}>
            <button type="button" className="btn ghost" onClick={() => goChunk(chunk - 1)} disabled={chunk === 0}>← {chunk > 0 ? doc.chunks[chunk - 1].label : ""}</button>
            <button type="button" className="btn" onClick={() => goChunk(chunk + 1)} disabled={chunk === doc.chunks.length - 1}>{chunk < doc.chunks.length - 1 ? doc.chunks[chunk + 1].label : ""} →</button>
          </div>

          {from && (
            <p className={`wrap ${styles.source}`}>
              Greek read from {FROM_TEXT[from.grc]}{from.tr ? `, translation from ${FROM_TEXT[from.tr]}` : ""}. Files from{" "}
              {idx!.catalog.collections[grcText!.col].repo} ({grcText!.urn}), shown exactly as published. CC BY-SA 4.0.
            </p>
          )}
        </>
      )}

      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => { setWord(null); document.querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel)); }} />
    </div>
  );
}
