"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex } from "@/lib/catalog";
import styles from "./Reader.module.css";

/** Choose a work to open in the second pane. */
export default function WorkPicker({ onPick, onClose }: { onPick: (work: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [q, setQ] = useState("");
  const query = useDeferredValue(q);
  useEffect(() => { ref.current?.showModal(); loadCatalog().then(setIdx); }, []);

  const results = useMemo(() => {
    if (!idx) return [];
    const f = fold(query.trim());
    const out: { id: string; label: string; gr: string | null; en: boolean }[] = [];
    for (const a of idx.catalog.authors) for (const w of a.works) {
      const gr = greekEditions(w)[0]?.label ?? null;
      if (f && !fold(`${a.name} ${w.title} ${w.orig ?? ""} ${gr ?? ""}`).includes(f)) continue;
      out.push({ id: w.id, label: `${a.name}, ${w.title}`, gr, en: hasTranslation(w) });
      if (out.length >= 60) return out;
    }
    return out;
  }, [idx, query]);

  return (
    <dialog ref={ref} className={styles.share} aria-labelledby="picker-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
      <div className={styles.shareIn}>
        <div className={styles.panelHead}>
          <h2 id="picker-title">Open a second book</h2>
          <button type="button" className={styles.x} onClick={() => ref.current?.close()} aria-label="Close">×</button>
        </div>
        <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="picker-search" type="search" className={styles.pickerInput} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search authors and works (English or Greek)" aria-label="Search for a work" autoFocus />
        <ul className={styles.pickerList}>
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => onPick(r.id)}>
                <span>{r.label}</span>
                {r.gr && r.gr !== r.label && <span lang="grc" className="muted">{r.gr}</span>}
                {r.en && <span className={styles.enBadge}>English</span>}
              </button>
            </li>
          ))}
          {idx && !results.length && <li className="muted">Nothing found.</li>}
        </ul>
      </div>
    </dialog>
  );
}
