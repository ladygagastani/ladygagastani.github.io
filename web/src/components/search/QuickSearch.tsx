"use client";
/**
 * Quick search, from any page: press "/" or Ctrl+K (⌘K on a Mac), or the search button in the header.
 * On phones it is a full-screen sheet, with Greek letters that can sit just above the phone's keyboard. Suggests passages (from a typed
 * reference), works and authors by name, Painted Stoa entries, and the full searches of the Oracle.
 */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { detectScript, queryWords, toPattern } from "@/lib/search/input";
import { loadAbbrevs, readReference, type Abbrevs } from "@/lib/search/refs";
import { useUI } from "@/lib/ui";
import { AREAS } from "@/config/areas";
import GreekKeyboard from "./GreekKeyboard";
import styles from "./QuickSearch.module.css";

/** What Quick search needs of each wiki entry; loaded only when the box opens. */
type StoaItem = { slug: string; title: string; greek?: string; kicker: string };

interface Option { id: string; href: string; kind: string; label: React.ReactNode; greek?: boolean }

export default function QuickSearch() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setOpen(!useUI.getState().searchOpen); }
      else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); setOpen(true); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;
  return <Box onClose={() => setOpen(false)} />;
}

function Box({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [abbrevs, setAbbrevs] = useState<Abbrevs | null>(null);
  const [stoa, setStoa] = useState<StoaItem[]>([]);
  const [kbd, setKbd] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // phones: the sheet covers only what the on-screen keyboard leaves visible, so nothing hides behind it
  useEffect(() => {
    const vv = window.visualViewport, d = dialog.current;
    if (!vv || !d) return;
    const fit = () => { d.style.setProperty("--vv-h", `${vv.height}px`); d.style.setProperty("--vv-top", `${vv.offsetTop}px`); };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); };
  }, []);

  useEffect(() => {
    dialog.current?.showModal();
    loadCatalog().then(setIdx, () => undefined);
    loadAbbrevs().then(setAbbrevs);
    import("@/wiki/index").then((m) => setStoa(m.ENTRIES.map(({ slug, title, greek, kicker }) => ({ slug, title, greek, kicker }))), () => undefined);
  }, []);

  const options = useMemo<Option[]>(() => {
    const t = q.trim();
    if (!t) return [];
    const out: Option[] = [];
    if (idx && abbrevs && /\d/.test(t)) {
      for (const r of readReference(t, idx, abbrevs)) {
        out.push({ id: `ref:${r.work}`, kind: "Passage", href: `/read?w=${r.work}${r.at ? `&at=${encodeURIComponent(r.at)}` : ""}`, label: <><b>{r.label}</b> {r.at}</> });
      }
    }
    const e = encodeURIComponent(t);
    const greekOk = queryWords(t).every((w) => !("error" in toPattern(w, detectScript(w))));
    if (greekOk && !/\d/.test(t)) {
      const shown = queryWords(t).map((w) => { const p = toPattern(w, detectScript(w)); return "error" in p ? w : p.greek; }).join(" ");
      out.push({ id: "forms", kind: "Search the Greek", href: `/search?q=${e}`, label: <>for <b lang="grc">{shown}</b></>, greek: true });
      if (queryWords(t).length === 1) out.push({ id: "lemma", kind: "Every form of", href: `/search?m=lemma&q=${e}`, label: <b lang="grc">{shown}</b>, greek: true });
    }
    if (stoa.length && !/\d/.test(t)) {
      const n = fold(t);
      if (n.length >= 3) {
        for (const e of stoa.filter((e) => fold(`${e.title} ${e.greek ?? ""} ${e.kicker}`).includes(n)).slice(0, 4)) {
          out.push({ id: `stoa:${e.slug}`, kind: "Painted Stoa", href: `/stoa/${e.slug}`, label: <><b>{e.title}</b> <span className={styles.muted}>{e.kicker}</span></> });
        }
      }
    }
    if (idx) {
      const n = fold(t);
      if (n.length >= 3) {
        let k = 0;
        for (const a of idx.catalog.authors) {
          if (k >= 6) break;
          if (fold(a.name).includes(n)) { out.push({ id: `au:${a.id}`, kind: "Author", href: `/library/author?a=${a.id}`, label: <><b>{a.name}</b> <span className={styles.muted}>{a.works.length} works</span></> }); k++; }
          for (const w of a.works) {
            if (k >= 6) break;
            if (fold(w.title).includes(n)) { out.push({ id: `w:${w.id}`, kind: "Work", href: `/read?w=${w.id}`, label: <><b>{w.title}</b> <span className={styles.muted}>{a.name}</span></> }); k++; }
          }
        }
      }
    }
    if (/[a-z]/i.test(t) && !/\d/.test(t)) out.push({ id: "english", kind: "Search the translations", href: `/search?m=english&q=${e}`, label: <>for <b>{t}</b></> });
    if (/[a-z]/i.test(t) && !/\d/.test(t)) out.push({ id: "wiki", kind: "Search the Painted Stoa", href: `/stoa?q=${e}`, label: <>for <b>{t}</b></> });
    if (/[a-z]/i.test(t) && !/\d/.test(t)) out.push({ id: "forum", kind: "Search the Town Hall", href: `/town-hall?q=${e}`, label: <>for <b>{t}</b></> });
    out.push({ id: "library", kind: "Search my library", href: `/search?m=library&q=${e}`, label: <>for <b>{t}</b></> });
    return out;
  }, [q, idx, abbrevs, stoa]);

  const choose = (o: Option | undefined) => {
    if (!o) return;
    onClose();
    router.push(o.href);
  };
  const cur = Math.min(sel, Math.max(0, options.length - 1));

  // the on-screen Greek letters type at the caret, as on the Oracle's page
  const key = (k: string) => {
    const el = input.current;
    if (!el) return;
    const a = el.selectionStart ?? q.length, b = el.selectionEnd ?? q.length;
    const next = k === "Backspace" ? (a === b ? q.slice(0, Math.max(0, a - 1)) + q.slice(b) : q.slice(0, a) + q.slice(b)) : q.slice(0, a) + k + q.slice(b);
    const caret = k === "Backspace" ? (a === b ? Math.max(0, a - 1) : a) : a + k.length;
    setQ(next);
    setSel(0);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(caret, caret); });
  };

  return (
    <dialog ref={dialog} className={styles.dialog} aria-label="Quick search" onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}>
      <div className={styles.inner}>
        <div className={styles.head}>
        <input ref={input} className={styles.input} autoFocus value={q} placeholder="λόγος, logos, Il. 1.1, Sophocles…" aria-label="Search"
          role="combobox" aria-expanded={options.length > 0} aria-controls="qs-list" aria-activedescendant={options[cur] ? `qs-${cur}` : undefined}
          type="search" enterKeyHint="search" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((cur + 1) % Math.max(1, options.length)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((cur - 1 + options.length) % Math.max(1, options.length)); }
            else if (e.key === "Enter") { e.preventDefault(); choose(options[cur]); }
          }} />
        <button type="button" className={styles.kbdBtn} lang="grc" aria-pressed={kbd} onClick={() => setKbd(!kbd)}
          onMouseDown={(e) => e.preventDefault()} aria-label="Greek letters on screen" title="Greek letters on screen">αβγ</button>
        <button type="button" className={styles.close} onClick={onClose}>Close</button>
        </div>
        <div className={styles.body}>
        {options.length > 0 ? (
          <ul id="qs-list" role="listbox" className={styles.list}>
            {options.map((o, i) => (
              <li key={o.id} id={`qs-${i}`} role="option" aria-selected={i === cur} onMouseEnter={() => setSel(i)} onClick={() => choose(o)}>
                <span className={styles.kind}>{o.kind}</span> <span>{o.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.help}>Type Greek, Latin letters or Beta Code, a reference such as <i>Il. 1.1</i>, the name of an author or work, or a subject in the Painted Stoa.<span className={styles.keys}> <kbd>↑</kbd> <kbd>↓</kbd> to choose, <kbd>Enter</kbd> to go, <kbd>Esc</kbd> to close.</span></p>
        )}
        <a className={styles.full} href={AREAS.search.href} onClick={(e) => { e.preventDefault(); onClose(); router.push(AREAS.search.href); }}>
          {AREAS.search.name}: the full search, with grammar and filters <span aria-hidden="true">→</span>
        </a>
        </div>
        {kbd && <GreekKeyboard onKey={key} docked />}
      </div>
    </dialog>
  );
}
