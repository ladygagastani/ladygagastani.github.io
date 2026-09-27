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
import { useMarks, cmp, type Mark, type Colour, type Point } from "@/lib/annotations";
import type { Block } from "@/lib/tei/types";
import PassageToolbar, { type Selection } from "./PassageToolbar";
import NoteEditor from "./NoteEditor";
import ShareDialog, { type ShareData } from "./ShareDialog";
import WorkPicker from "./WorkPicker";
import VocabPanel from "./VocabPanel";
import EchoesPanel, { type EchoMarks, type EchoQuery, type EchoTarget } from "./EchoesPanel";
import MetreBar from "./MetreBar";
import { metreIndex, publishedFor, loadLengths } from "@/lib/metre/load";
import { renderPassages, type LineRender } from "@/lib/metre/render";
import { lineHash, type MetreIndex } from "@/lib/metre/text";
import { playLine as playLineRhythm } from "@/lib/metre/beat";
import { loadWordPack, analyse as analyseWord } from "@/lib/lookup/words";
import { caseOf } from "@/lib/lookup/postag";
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

const NO_MARKS: Mark[] = [];
const blockText = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ").replace(/\s+/g, " ").trim();

const MARK_ICON: Record<string, React.ReactNode> = {
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  favourite: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  note: <path d="M4 4h16v12H8l-4 4z" />,
  xref: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
};

/** One passage row: reference and your marks in the margin, Greek, translation, and any notes. */
const RowView = memo(function RowView({ row, marks, openNote, onCloseNote, translit, metre }: {
  row: Row; marks: Mark[]; openNote: string | null; onCloseNote: () => void; translit: boolean; metre: Map<string, (LineRender | null)[]> | null;
}) {
  const notes = marks.filter((m) => m.kind === "note");
  return (
    <section className={styles.row} data-key={row.key}>
      <div className={styles.ref}>
        <button type="button" data-row={row.key} title="Actions for this passage">{row.key}</button>
        {marks.some((m) => m.kind !== "highlight") && (
          <span className={styles.marks}>
            {marks.filter((m) => m.kind !== "highlight").map((m) => (
              <button key={m.id} type="button" className={styles[`mk-${m.kind}`]} data-mark={m.id} title={m.kind === "note" ? (m.text || "Note") : m.kind === "xref" ? `Cross-reference to ${m.link?.label ?? "another passage"} (click to open it beside this one)` : m.kind === "bookmark" ? "Bookmark (click to remove)" : "Favourite (click to remove)"}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{MARK_ICON[m.kind]}</svg>
              </button>
            ))}
          </span>
        )}
      </div>
      <div className={styles.grc} lang="grc">
        {row.greek.map((u) => <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={u.ref.join(".")} translit={translit} metre={metre?.get(u.ref.join("."))} /></div>)}
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

export interface PaneProps { pane: 1 | 2; split: boolean; onOpenSecond: () => void }

/** One reading pane. With two panes, pane 2 uses the same query keys with a "2" on the end. */
function ReaderPane({ pane, split, onOpenSecond }: PaneProps) {
  const params = useSearchParams();
  const P = (k: string) => params.get(pane === 1 ? k : `${k}2`);
  const rootRef = useRef<HTMLDivElement>(null);
  const root = () => rootRef.current ?? document;
  const active = useUI((s) => s.activePane === pane);
  const pendingXref = useUI((s) => s.pendingXref);
  const router = useRouter();
  const toast = useUI((s) => s.showToast);
  const columns = useSettings((s) => s.columns);
  const setSettings = useSettings((s) => s.set);
  const translit = useSettings((s) => s.translit);
  const cases = useSettings((s) => s.cases);
  const metreOn = useSettings((s) => s.metre);
  const [vocabOpen, setVocabOpen] = useState(false);

  const workId = P("w") ?? "";
  const at = P("at");
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; parsed?: Parsed; from?: { grc: From; tr: From | null }; error?: string } | null>(null);
  const [step, setStep] = useState<{ key: string; text: string } | null>(null);
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null; at: Point | null } | null>(null);
  const [echo, setEcho] = useState<EchoQuery | null>(null);
  const [echoMarks, setEchoMarks] = useState<EchoMarks | null>(null);
  const [sel, setSel] = useState<Selection | null>(null);
  const [share, setShare] = useState<ShareData | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [marksOpen, setMarksOpen] = useState(false);
  const allMarks = useMarks((s) => s.byWork[workId]) ?? NO_MARKS;
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
  const grcText = work ? pickEdition(work, P("ed"), remembered?.ed ?? null) : undefined;
  const trText = work ? pickTranslation(work, P("tr"), remembered ? remembered.tr : undefined) : null;
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
  const placed = parsed?.placed ?? null;
  // a search hit in the translation (?tu=its passage number there): open beside the Greek it translates
  const tu = P("tu");
  const tuAt = useMemo(() => {
    if (tu === null || !placed) return undefined;
    let best: number | undefined;
    for (const p of placed) { if (p.src > Number(tu)) break; best = p.at; }
    return best;
  }, [tu, placed]);
  const startUnit = tuAt !== undefined ? tuAt : doc && target ? Math.max(0, findRef(doc, target)) : 0;
  const chunk = doc ? chunkOf(doc, startUnit) : 0;
  const unitKeys = useMemo(() => new Set(doc?.units.map((u) => u.ref.join(".")) ?? []), [doc]);
  const pageKeys = useMemo(() => new Set(doc && doc.chunks[chunk] ? doc.units.slice(doc.chunks[chunk].first, doc.chunks[chunk].last + 1).map((u) => u.ref.join(".")) : []), [doc, chunk]);
  const rows = useMemo(() => (doc && doc.chunks[chunk] ? alignChunk(doc, doc.chunks[chunk], placed) : []), [doc, chunk, placed]);
  const cov = trText && placed ? coverage(rows) : 1;

  // ------------------------------------------------------------ metre
  const [mIndex, setMIndex] = useState<MetreIndex | null>(null);
  useEffect(() => { metreIndex().then(setMIndex, () => undefined); }, []);
  const grcUrn = grcText?.urn;
  const mInfo = grcUrn && mIndex ? mIndex.texts[grcUrn] : undefined;
  const [mData, setMData] = useState<{ urn: string; pub: Map<string, string> } | null>(null);
  useEffect(() => {
    if (!metreOn || !mInfo || !grcUrn) return;
    let live = true;
    Promise.all([publishedFor(grcUrn, mInfo.pack), loadLengths()])
      .then(([pub]) => { if (live) setMData({ urn: grcUrn, pub }); })
      .catch(() => { if (live) toast("The metre data could not be loaded."); });
    return () => { live = false; };
  }, [metreOn, mInfo, grcUrn, toast]);
  const metre = useMemo(() => {
    if (!metreOn || !mInfo || !doc || !doc.chunks[chunk] || !grcUrn || mData?.urn !== grcUrn) return null;
    const c = doc.chunks[chunk];
    const pub = mData.pub;
    return renderPassages(doc.units.slice(c.first, c.last + 1), mInfo.kind, (h) => pub.get(h), lineHash);
  }, [metreOn, mInfo, doc, chunk, grcUrn, mData]);
  const stopBeat = useRef<(() => void) | null>(null);
  useEffect(() => () => stopBeat.current?.(), []);
  /** Play a line's rhythm, lighting each syllable as it sounds. */
  const playLine = (line: HTMLElement) => { stopBeat.current = playLineRhythm(line, { playing: styles.playing, now: styles.beatNow }); };
  const startKey = doc && startUnit > 0 ? doc.units[startUnit].ref.join(".") : null;

  // once the page is drawn, bring the requested passage into view (and briefly mark it if it was asked for)
  useEffect(() => {
    if (!rows.length) return;
    if (!startKey) { if (split) rootRef.current?.scrollTo({ top: 0 }); else window.scrollTo({ top: 0 }); return; }
    const row = rows.find((r) => r.greek.some((u) => u.ref.join(".") === startKey));
    const el = row && root().querySelector<HTMLElement>(`[data-key="${CSS.escape(row.key)}"]`);
    if (!el) return;
    requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    if (at || tu) { el.classList.remove(styles.flash); void el.offsetWidth; el.classList.add(styles.flash); }
  }, [rows, startKey, at, tu, split]);

  // words found by a search: ?hl= their positions in the passage (Greek), ?find= the words (translation)
  const hl = P("hl"), find = P("find");
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const name = `search-hit-${pane}`;
    if (!reg || !H || !doc || !rows.length || (!hl && !find)) return;
    const unitKey = doc.units[startUnit]?.ref.join(".");
    const row = rows.find((r) => r.greek.some((u) => u.ref.join(".") === unitKey));
    const ranges: Range[] = [];
    if (hl && unitKey) {
      const spans = root().querySelector(`[data-u="${CSS.escape(unitKey)}"]`)?.querySelectorAll("[data-w]");
      for (const i of hl.split(",").map(Number)) {
        const sp = spans?.[i];
        if (sp) { const r = new Range(); r.selectNodeContents(sp); ranges.push(r); }
      }
    }
    const words = (find ?? "").split(/\s+/).filter((w) => /^[A-Za-z’']+$/.test(w));   // letters only: safe in a pattern
    if (words.length && row) {
      // a translation passage can run over several rows: mark the words in the first row that has them
      const re = new RegExp(`\\b(?:${words.join("|")})\\b`, "gi");
      const first = rows.indexOf(row);
      for (let i = first; i < Math.min(rows.length, first + 60); i++) {
        const el = root().querySelector<HTMLElement>(`[data-key="${CSS.escape(rows[i].key)}"]`);
        const trEl = el?.querySelector(`.${styles.tr}`);
        if (!el || !trEl) continue;
        const walk = document.createTreeWalker(trEl, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          for (const m of n.textContent!.matchAll(re)) {
            const r = new Range(); r.setStart(n, m.index!); r.setEnd(n, m.index! + m[0].length); ranges.push(r);
          }
        }
        if (ranges.length) {
          if (i !== first) requestAnimationFrame(() => requestAnimationFrame(() => el.scrollIntoView({ block: "center" })));
          break;
        }
      }
    }
    reg.set(name, new H(...ranges));
    return () => { reg.delete(name); };
  }, [rows, hl, find, doc, startUnit, pane]);

  // ------------------------------------------------------------ remember where the reader is
  const edV = grcText ? versionOf(grcText.urn) : null;
  const trV = trText ? versionOf(trText.urn) : null;
  useEffect(() => {
    if (!rows.length || !edV) return;
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) savePosition(workId, { ed: edV, tr: trV, at: (top.target as HTMLElement).dataset.key! });
    }, { root: split ? rootRef.current : null, rootMargin: split ? "-60px 0px -70% 0px" : "-80px 0px -70% 0px" });
    root().querySelectorAll("[data-key]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rows, workId, edV, trV, split]);

  // ------------------------------------------------------------ navigation
  const href = (o: { ed?: string; tr?: string | null; at?: string }) => {
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (pane === 1 ? x : `${x}2`);
    q.set(k("w"), workId);
    const ed = o.ed ?? edV;
    if (ed) q.set(k("ed"), ed);
    q.set(k("tr"), o.tr === undefined ? (trV ?? "none") : (o.tr ?? "none"));
    if (o.at) q.set(k("at"), o.at); else q.delete(k("at"));
    for (const x of ["hl", "find", "tu"]) q.delete(k(x));   // a search's marks belong to the passage it found
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
      if (split && useUI.getState().activePane !== pane) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goChunkRef.current(chunk + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goChunkRef.current(chunk - 1); }
      else if (e.key === "g") { e.preventDefault(); gotoRef.current?.focus(); }
      else if (e.key === "?") setHelp((h) => !h);
      else if (e.key === "Escape") { setWord(null); setHelp(false); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [chunk, split, pane]);

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
    root().querySelectorAll("[data-hl]").forEach((el) => el.removeAttribute("data-hl"));
    for (const m of marks) {
      if (m.kind !== "highlight") continue;
      const a = order.get(m.start.u), b = order.get(m.end.u);
      if (a === undefined || b === undefined) continue;
      for (let i = a; i <= b; i++) {
        const key = doc!.units[i].ref.join(".");
        const unit = root().querySelector(`[data-u="${CSS.escape(key)}"]`);
        if (!unit) continue;
        const spans = unit.querySelectorAll<HTMLElement>("[data-w]");
        const from = i === a ? m.start.i : 0, to = i === b ? m.end.i : spans.length - 1;
        for (let j = from; j <= to && j < spans.length; j++) spans[j].dataset.hl = m.colour ?? "ochre";
      }
    }
  }, [marks, rows, order, doc]);

  // colour by case: mark each Greek word with the case GLAUx gives it here
  useEffect(() => {
    const clear = () => root().querySelectorAll("[data-case]").forEach((el) => el.removeAttribute("data-case"));
    if (!cases || !rows.length || !doc) { clear(); return; }
    let live = true;
    loadWordPack(workId).then((pack) => {
      if (!live) return;
      clear();
      if (!pack) { toast("No word analyses exist for this text yet, so words can't be coloured by case."); return; }
      root().querySelectorAll<HTMLElement>("[data-u]").forEach((unit) => {
        const seen = new Map<string, number>();
        unit.querySelectorAll<HTMLElement>("[data-w]").forEach((sp) => {
          const f = norm(sp.dataset.w!);
          const occ = seen.get(f) ?? 0;
          seen.set(f, occ + 1);
          const a = analyseWord(pack, sp.dataset.w!, unit.dataset.u!, occ, unitKeys, doc.levels.length);
          const c = a && a.where !== "work" ? caseOf(a.tag) : null;
          if (c) sp.dataset.case = c;
        });
      });
    }).catch(() => undefined);
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases, rows, doc, workId, unitKeys]);

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
    const spans = [...root().querySelectorAll<HTMLElement>("article [data-u] [data-w]")].filter((sp) => range.intersectsNode(sp));
    selectSpans(spans, range.getBoundingClientRect());
  };

  const rangeLabel = (a: string, b: string) => (a === b ? a : `${a}–${b}`);
  async function act(a: "bookmark" | "favourite" | "note" | "share" | "xref" | "xref-here" | "echoes" | { highlight: Colour }) {
    if (!sel || !edV) return;
    if (a === "echoes") {
      openEchoes(sel.start, sel.end);
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref") {
      useUI.getState().setPendingXref({ pane, work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote, label: `${cite} ${rangeLabel(sel.start.u, sel.end.u)}` });
      toast("Now select the passage in the other book and choose \u201cLink here\u201d.");
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref-here" && pendingXref) {
      const here = { work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote, label: `${cite} ${rangeLabel(sel.start.u, sel.end.u)}` };
      const { add } = useMarks.getState();
      await add({ kind: "xref", work: pendingXref.work, ed: pendingXref.ed, start: pendingXref.start, end: pendingXref.end, quote: pendingXref.quote,
        link: { work: here.work, ed: here.ed, start: here.start, label: here.label } });
      await add({ kind: "xref", ...here, link: { work: pendingXref.work, ed: pendingXref.ed, start: pendingXref.start, label: pendingXref.label } });
      useUI.getState().setPendingXref(null);
      toast(`Linked ${pendingXref.label} with ${here.label}.`);
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref-here") return;   // no first passage chosen yet
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
    const beat = el.closest<HTMLElement>("[data-beat]");
    if (beat) { playLine(beat.closest<HTMLElement>(`.${styles.line}`)!); return; }
    const w = el.closest<HTMLElement>("[data-w]");
    if (w) {
      root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel));
      w.classList.add(styles.sel);
      // which passage the word is in, and which occurrence of this form within it
      const unit = w.closest<HTMLElement>("[data-u]");
      let ctx: WordContext | null = null;
      if (unit && doc) {
        const same = [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!));
        ctx = { work: workId, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: unitKeys, depth: doc.levels.length };
      }
      setWord({ w: w.dataset.w!, ctx, at: unit ? { u: unit.dataset.u!, i: [...unit.querySelectorAll("[data-w]")].indexOf(w) } : null });
      return;
    }
    const r = el.closest<HTMLElement>("[data-row]");
    if (r) {
      const row = root().querySelector(`[data-key="${CSS.escape(r.dataset.row!)}"]`);
      const spans = row ? [...row.querySelectorAll<HTMLElement>("[data-u] [data-w]")] : [];
      selectSpans(spans, r.getBoundingClientRect());
      return;
    }
    const mk = el.closest<HTMLElement>("[data-mark]");
    if (mk) {
      const m = marks.find((x) => x.id === mk.dataset.mark);
      if (!m) return;
      if (m.kind === "note") setOpenNote(openNote === m.id ? null : m.id);
      else if (m.kind === "xref" && m.link) openInPane(pane === 1 ? 2 : 1, m.link.work, m.link.ed, m.link.start.u);
      else { useMarks.getState().remove(m.id); toast(m.kind === "bookmark" ? "Bookmark removed." : "Removed from favourites."); }
    }
  };

  // ------------------------------------------------------------ Echoes
  function openEchoes(start: Point, end: Point) {
    if (!doc || !grcText || !work) return;
    setEcho({ work: workId, urn: grcText.urn, doc, title: work.title, start, end });
    setWord(null); setVocabOpen(false);
  }
  const echoJump = (t: EchoTarget) => {
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (pane === 1 ? x : `${x}2`);
    if (t.work !== workId) q.delete(k("tr"));
    q.set(k("w"), t.work); q.set(k("ed"), t.ed); q.set(k("at"), t.at);
    for (const x of ["hl", "find", "tu"]) q.delete(k(x));
    router.push(`/read?${q}`, { scroll: false });
  };
  // the words Echoes found, marked wherever they are on the page
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const names = [`echo-${pane}`, `echo-self-${pane}`];
    const here = grcText ? echoMarks?.get(grcText.urn) : undefined;
    if (!reg || !H || !here || !rows.length) return;
    const ranges: Range[] = [], self: Range[] = [];
    root().querySelectorAll<HTMLElement>("[data-u]").forEach((unit) => {
      const ws = here.get(unit.dataset.u!);
      if (!ws) return;
      const spans = unit.querySelectorAll("[data-w]");
      for (const { i, self: me } of ws) {
        const sp = spans[i];
        if (!sp) continue;
        const r = new Range(); r.selectNodeContents(sp);
        (me ? self : ranges).push(r);
      }
    });
    reg.set(names[0], new H(...ranges));
    reg.set(names[1], new H(...self));
    return () => { for (const n of names) reg.delete(n); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echoMarks, rows, grcText?.urn, pane]);

  /** Show a passage in the given pane (opening the second pane if needed). */
  const openInPane = (target: 1 | 2, w: string, ed: string, u: string) => {
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (target === 1 ? x : `${x}2`);
    q.set(k("w"), w); q.set(k("ed"), ed); q.set(k("at"), u);
    if (!q.get(k("tr"))) q.delete(k("tr"));
    router.replace(`/read?${q}`, { scroll: false });
  };
  const closePane = () => {
    const q = new URLSearchParams(params.toString());
    for (const k of ["w2", "ed2", "tr2", "at2"]) q.delete(k);
    router.replace(`/read?${q}`, { scroll: false });
  };

  // ------------------------------------------------------------ synced scrolling (same work in both panes)
  const sync = useUI((s) => s.syncScroll);
  const otherWork = params.get(pane === 1 ? "w2" : "w");
  const canSync = split && otherWork === workId;
  useEffect(() => {
    const el = rootRef.current;
    if (!canSync || !sync || !el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (useUI.getState().activePane !== pane) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const top = el.getBoundingClientRect().top + 70;
        const row = [...el.querySelectorAll<HTMLElement>("[data-key]")].find((r) => r.getBoundingClientRect().bottom > top);
        if (row) useUI.getState().setScrollAnchor({ pane, key: row.dataset.key! });
      }, 60);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const unsub = useUI.subscribe((s, prev) => {
      const a = s.scrollAnchor;
      if (!a || a === prev.scrollAnchor || a.pane === pane) return;
      // find the row here that contains the other pane's passage, or the nearest before it
      const idxOf = order.get(a.key);
      if (idxOf === undefined) return;
      const target = [...el.querySelectorAll<HTMLElement>("[data-u]")].reverse().find((u) => (order.get(u.dataset.u!) ?? Infinity) <= idxOf);
      target?.closest<HTMLElement>("[data-key]")?.scrollIntoView({ block: "start" });
    });
    return () => { el.removeEventListener("scroll", onScroll); unsub(); clearTimeout(timer); };
  }, [canSync, sync, pane, order]);

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
    <div ref={rootRef} className={`${styles.reader} ${styles["cols-" + columns]} ${word || echo || vocabOpen ? styles.withPanel : ""} ${split ? styles.pane : ""} ${split && active ? styles.activePane : ""}`}
      onPointerDown={() => useUI.getState().setActivePane(pane)} onFocusCapture={() => useUI.getState().setActivePane(pane)}>
      {split && (
        <div className={styles.paneBar}>
          <span className="label">{pane === 1 ? "Left book" : "Right book"}</span>
          {canSync && <button type="button" className="chip" aria-pressed={sync} onClick={() => useUI.getState().setSyncScroll(!sync)}>Sync scrolling</button>}
          {pane === 2 && <button type="button" className="chip" onClick={closePane}>Close this book</button>}
        </div>
      )}
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
            {!split && <button type="button" className="chip" onClick={onOpenSecond}>Open a second book beside this one</button>}
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
            <div className={styles.aids} role="group" aria-label="Reading aids">
              <button type="button" className="chip" aria-pressed={translit} onClick={() => setSettings({ translit: !translit })} title="Show each line in Latin letters">Transliteration</button>
              <button type="button" className="chip" aria-pressed={cases} onClick={() => setSettings({ cases: !cases })} title="Underline nouns, adjectives and participles in the colour of their case">Colour by case</button>
              {mInfo && <button type="button" className="chip" aria-pressed={metreOn} onClick={() => setSettings({ metre: !metreOn })} title="Mark long and short syllables, feet and caesura">Metre</button>}
              <button type="button" className="chip" aria-pressed={vocabOpen} onClick={() => { setVocabOpen(!vocabOpen); setWord(null); setEcho(null); }}>Vocabulary</button>
            </div>
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

          {cases && (
            <p className={`wrap ${styles.legend}`} aria-label="Case colours">
              <span data-case="nominative">nominative</span> <span data-case="genitive">genitive</span> <span data-case="dative">dative</span>
              <span data-case="accusative">accusative</span> <span data-case="vocative">vocative</span>
              <span className="muted">From GLAUx&apos;s analyses of this text.</span>
            </p>
          )}
          {metreOn && mInfo && <MetreBar info={mInfo} about={mIndex?.about ?? null} />}
          {translit && <p className={`wrap ${styles.legend}`}><span className="muted">Transliteration uses a simple scheme: η ē, ω ō, rough breathing h, υ y (u in diphthongs), χ ch, φ ph, θ th, iota subscript i; accents are left out.</span></p>}
          {help && (
            <div className={`wrap ${styles.help}`} role="note">
              <p><kbd>←</kbd> <kbd>→</kbd> previous / next page · <kbd>g</kbd> go to a reference · click a word to look it up · select words or click a passage number for bookmarks, notes, highlights, sharing and Echoes · <kbd>Esc</kbd> close</p>
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

          <article className={`wrap ${styles.text} ${metre ? styles.metreOn : ""}`} onClick={onTextClick} onMouseUp={onTextMouseUp} aria-label={`${cite}, ${chunkInfo.label}`}>
            {rows.map((r) => <RowView key={r.key} row={r} marks={marksByRow.get(r.key) ?? noMarks} openNote={openNote} onCloseNote={() => setOpenNote(null)} translit={translit} metre={metre} />)}
          </article>
          {sel && <PassageToolbar sel={sel} onAction={act} onClose={() => setSel(null)}
            xref={split ? (pendingXref && pendingXref.pane !== pane ? "here" : "start") : null} />}
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

      {vocabOpen && doc && !word && (
        <VocabPanel work={workId} pageKeys={pageKeys} keys={unitKeys} depth={doc.levels.length}
          onClose={() => setVocabOpen(false)} onPick={(lemma) => setWord({ w: lemma, ctx: null, at: null })} />
      )}
      {echo && !word && <EchoesPanel q={echo} onJump={echoJump} onMarks={setEchoMarks} onClose={() => setEcho(null)} />}
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onEchoes={word?.at ? () => openEchoes(word.at!, word.at!) : undefined} onClose={() => { setWord(null); root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel)); }} />
    </div>
  );
}

/** The reader: one pane, or two side by side (when the address has w2=…). */
export default function Reader() {
  const params = useSearchParams();
  const router = useRouter();
  const split = !!params.get("w2");
  const [picking, setPicking] = useState(false);
  const open = (w: string) => {
    const q = new URLSearchParams(params.toString());
    q.set("w2", w);
    for (const k of ["ed2", "tr2", "at2"]) q.delete(k);
    router.replace(`/read?${q}`, { scroll: false });
    setPicking(false);
  };
  return (
    <div className={split ? styles.split : undefined}>
      <ReaderPane pane={1} split={split} onOpenSecond={() => setPicking(true)} />
      {split && <ReaderPane pane={2} split onOpenSecond={() => undefined} />}
      {picking && <WorkPicker onPick={open} onClose={() => setPicking(false)} />}
    </div>
  );
}
