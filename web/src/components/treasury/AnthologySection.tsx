"use client";
/**
 * Favourite passages as a personal anthology, organised into collections the reader names.
 * A collection is a name on each favourite in it; the list of names (including empty ones just
 * made) is also kept in localStorage so a new collection shows before anything is put in it.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMarks, type Mark } from "@/lib/annotations";
import { rangeText } from "@/lib/treasury-io";
import { plural, readHref, workName, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";

const KEY = "mathesis:collections";
const UNSORTED = "~";   // in the address: the passages in no collection
function stored(): string[] { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
function store(names: string[]) { try { localStorage.setItem(KEY, JSON.stringify(names)); } catch { /* ignore */ } }
const cleanName = (s: string) => s.trim().replace(/\s+/g, " ").replace(/^~+/, "").slice(0, 60);

export default function AnthologySection({ t }: { t: TreasuryState }) {
  const params = useSearchParams();
  const router = useRouter();
  const update = useMarks((s) => s.update);
  const favs = useMemo(() => t.marks.filter((m) => m.kind === "favourite").sort((a, b) => b.created - a.created), [t.marks]);
  const [extra, setExtra] = useState<string[]>(() => (typeof window === "undefined" ? [] : stored()));
  const names = useMemo(() => [...new Set([...extra, ...favs.flatMap((m) => m.collections ?? [])])].sort((a, b) => a.localeCompare(b)), [extra, favs]);
  const current = params.get("c");
  const [making, setMaking] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [confirmDrop, setConfirmDrop] = useState(false);

  const open = (c: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (c) p.set("c", c); else p.delete("c");
    setConfirmDrop(false); setRenaming(null);
    router.replace(`/treasury?${p}`, { scroll: false });
  };
  const create = () => {
    const n = cleanName(newName);
    if (!n || n === UNSORTED) return;
    const next = [...new Set([...stored(), n])];
    store(next); setExtra(next); setNewName(""); setMaking(false); open(n);
  };
  const rename = async (from: string, to: string) => {
    const n = cleanName(to);
    if (!n || n === from) { setRenaming(null); return; }
    for (const m of favs) if (m.collections?.includes(from)) await update(m.id, { collections: [...new Set(m.collections.map((c) => (c === from ? n : c)))] });
    const next = [...new Set(stored().map((c) => (c === from ? n : c)).concat(n))];
    store(next); setExtra(next); setRenaming(null); open(n);
  };
  const drop = async (name: string) => {
    for (const m of favs) if (m.collections?.includes(name)) await update(m.id, { collections: m.collections.filter((c) => c !== name) });
    const next = stored().filter((c) => c !== name);
    store(next); setExtra(next); open(null);
  };
  const toggle = (m: Mark, name: string) => {
    const has = m.collections?.includes(name);
    update(m.id, { collections: has ? m.collections!.filter((c) => c !== name) : [...(m.collections ?? []), name] });
  };

  const shown = current === UNSORTED ? favs.filter((m) => !m.collections?.length)
    : current ? favs.filter((m) => m.collections?.includes(current)) : favs;
  const unsorted = favs.filter((m) => !m.collections?.length).length;

  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Anthology</h2>
        <p className="muted">{plural(favs.length, "favourite passage")}, gathered as the ancient anthologists gathered epigrams. Sort them into collections of your own.</p>
      </div>

      <div className={styles.tagRow} role="group" aria-label="Collections">
        <button type="button" className="chip" aria-pressed={!current} onClick={() => open(null)}>All <small>{favs.length}</small></button>
        {names.map((c) => <button key={c} type="button" className="chip" aria-pressed={current === c} onClick={() => open(c)}>{c} <small>{favs.filter((m) => m.collections?.includes(c)).length}</small></button>)}
        {names.length > 0 && unsorted > 0 && <button type="button" className="chip" aria-pressed={current === UNSORTED} onClick={() => open(UNSORTED)}>Not in a collection <small>{unsorted}</small></button>}
        {making
          ? <span className={styles.inlineForm}>
              <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name, e.g. Similes" aria-label="Name of the new collection"
                onKeyDown={(e) => { if (e.key === "Enter") create(); if (e.key === "Escape") setMaking(false); }} />
              <button type="button" className="chip" onClick={create} disabled={!cleanName(newName)}>Create</button>
              <button type="button" className="chip" onClick={() => setMaking(false)}>Cancel</button>
            </span>
          : <button type="button" className={`chip ${styles.add}`} onClick={() => setMaking(true)}>+ New collection</button>}
      </div>

      {current && current !== UNSORTED && (
        <div className={styles.collectionHead}>
          {renaming !== null
            ? <span className={styles.inlineForm}>
                <input autoFocus value={renaming} onChange={(e) => setRenaming(e.target.value)} aria-label="New name"
                  onKeyDown={(e) => { if (e.key === "Enter") rename(current, renaming); if (e.key === "Escape") setRenaming(null); }} />
                <button type="button" className="chip" onClick={() => rename(current, renaming)}>Rename</button>
                <button type="button" className="chip" onClick={() => setRenaming(null)}>Cancel</button>
              </span>
            : <h3 className={styles.collectionName}>{current}</h3>}
          {renaming === null && <button type="button" className="chip" onClick={() => setRenaming(current)}>Rename</button>}
          {confirmDrop
            ? <><button type="button" className="chip" onClick={() => drop(current)}>Remove the collection (the passages stay in your anthology)</button><button type="button" className="chip" onClick={() => setConfirmDrop(false)}>Keep it</button></>
            : <button type="button" className="chip" onClick={() => setConfirmDrop(true)}>Remove collection</button>}
        </div>
      )}

      {!favs.length && <p className={styles.empty}>No favourite passages yet. In the reader, select some Greek or click a passage number and choose <b>Favourite</b>.</p>}
      {favs.length > 0 && !shown.length && <p className={styles.empty}>Nothing in this collection yet. Open <b>All</b> and use <b>Collections</b> on a passage to add it here.</p>}

      <ol className={styles.anthology}>
        {shown.map((m, i) => <Leaf key={m.id} m={m} i={i} t={t} names={names} onToggle={toggle} />)}
      </ol>
    </>
  );
}

function Leaf({ m, i, t, names, onToggle }: { m: Mark; i: number; t: TreasuryState; names: string[]; onToggle: (m: Mark, name: string) => void }) {
  const w = workName(t.idx, m.work);
  const [menu, setMenu] = useState(false);
  const [sure, setSure] = useState(false);
  const long = m.quote.length > 420;
  const [more, setMore] = useState(false);
  return (
    <li className={styles.leaf} style={{ "--i": Math.min(i, 12) } as React.CSSProperties}>
      <blockquote lang="grc" className={styles.leafGreek}>{long && !more ? `${m.quote.slice(0, 420)}…` : m.quote}</blockquote>
      {long && <button type="button" className={styles.more} onClick={() => setMore(!more)}>{more ? "Less" : "The whole passage"}</button>}
      <p className={styles.leafCite}>
        <Link href={readHref(m)} transitionTypes={["page-turn"]}>{w.author ? `${w.author}, ` : ""}<i>{w.title}</i> {rangeText(m)}</Link>
      </p>
      <div className={styles.leafFoot}>
        {m.collections?.map((c) => <span key={c} className={styles.colTag}>{c}</span>)}
        <span className={styles.menuWrap}>
          <button type="button" className="chip" aria-expanded={menu} onClick={() => setMenu(!menu)}>Collections</button>
          {menu && (
            <span className={styles.menu} role="group" aria-label="Collections for this passage">
              {!names.length && <span className="muted">Make a collection first, with “+ New collection”.</span>}
              {names.map((c) => (
                <label key={c}><input type="checkbox" checked={!!m.collections?.includes(c)} onChange={() => onToggle(m, c)} /> {c}</label>
              ))}
            </span>
          )}
        </span>
        {sure
          ? <><button type="button" className="chip" onClick={() => useMarks.getState().remove(m.id)}>Remove from anthology</button><button type="button" className="chip" onClick={() => setSure(false)}>Keep</button></>
          : <button type="button" className={styles.x} onClick={() => setSure(true)} aria-label="Remove from anthology" title="Remove from anthology">×</button>}
      </div>
    </li>
  );
}
