"use client";
/**
 * Quick search, from any page: press "/" or Ctrl+K (⌘K on a Mac). Suggests passages (from a typed
 * reference), works and authors by name, and the full searches of the Oracle.
 */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { detectScript, queryWords, toPattern } from "@/lib/search/input";
import { loadAbbrevs, readReference, type Abbrevs } from "@/lib/search/refs";
import { useUI } from "@/lib/ui";
import styles from "./QuickSearch.module.css";

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
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
    loadCatalog().then(setIdx, () => undefined);
    loadAbbrevs().then(setAbbrevs);
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
    if (idx) {
      const n = fold(t);
      if (n.length >= 3) {
        let k = 0;
        for (const a of idx.catalog.authors) {
          if (k >= 6) break;
          if (fold(a.name).includes(n)) { out.push({ id: `au:${a.id}`, kind: "Author", href: `/read?w=${a.works[0]?.id}`, label: <><b>{a.name}</b> <span className={styles.muted}>{a.works.length} works</span></> }); k++; }
          for (const w of a.works) {
            if (k >= 6) break;
            if (fold(w.title).includes(n)) { out.push({ id: `w:${w.id}`, kind: "Work", href: `/read?w=${w.id}`, label: <><b>{w.title}</b> <span className={styles.muted}>{a.name}</span></> }); k++; }
          }
        }
      }
    }
    if (/[a-z]/i.test(t) && !/\d/.test(t)) out.push({ id: "english", kind: "Search the translations", href: `/search?m=english&q=${e}`, label: <>for <b>{t}</b></> });
    out.push({ id: "library", kind: "Search my library", href: `/search?m=library&q=${e}`, label: <>for <b>{t}</b></> });
    return out;
  }, [q, idx, abbrevs]);

  const choose = (o: Option | undefined) => {
    if (!o) return;
    onClose();
    router.push(o.href);
  };
  const cur = Math.min(sel, Math.max(0, options.length - 1));

  return (
    <dialog ref={dialog} className={styles.dialog} aria-label="Quick search" onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}>
      <div className={styles.inner}>
        <input className={styles.input} autoFocus value={q} placeholder="λόγος, logos, Il. 1.1, Sophocles…" aria-label="Search"
          role="combobox" aria-expanded={options.length > 0} aria-controls="qs-list" aria-activedescendant={options[cur] ? `qs-${cur}` : undefined}
          autoComplete="off" spellCheck={false}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((cur + 1) % Math.max(1, options.length)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((cur - 1 + options.length) % Math.max(1, options.length)); }
            else if (e.key === "Enter") { e.preventDefault(); choose(options[cur]); }
          }} />
        {options.length > 0 ? (
          <ul id="qs-list" role="listbox" className={styles.list}>
            {options.map((o, i) => (
              <li key={o.id} id={`qs-${i}`} role="option" aria-selected={i === cur} onMouseEnter={() => setSel(i)} onClick={() => choose(o)}>
                <span className={styles.kind}>{o.kind}</span> <span>{o.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.help}>Type Greek, Latin letters or Beta Code, a reference such as <i>Il. 1.1</i>, or the name of an author or work. <kbd>↑</kbd> <kbd>↓</kbd> to choose, <kbd>Enter</kbd> to go, <kbd>Esc</kbd> to close.</p>
        )}
      </div>
    </dialog>
  );
}
