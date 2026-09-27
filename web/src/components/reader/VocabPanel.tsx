"use client";

import { useEffect, useRef, useState } from "react";
import { loadWordPack, lemmaCounts } from "@/lib/lookup/words";
import { lsjEntries } from "@/lib/lookup/lsj";
import { coreEntry } from "@/lib/lookup/core";
import styles from "./Reader.module.css";

interface Entry { lemma: string; n: number; gloss: string | null; core: number | null }

/** Dictionary words used on this page, most frequent first, with a short LSJ definition. */
export default function VocabPanel({ work, pageKeys, keys, depth, onClose, onPick }: {
  work: string; pageKeys: Set<string>; keys: Set<string>; depth: number; onClose: () => void; onPick: (lemma: string) => void;
}) {
  const [list, setList] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let live = true;
    loadWordPack(work).then(async (pack) => {
      if (!live) return;
      if (!pack) { setError("No word analyses exist for this text yet."); return; }
      const counts = [...lemmaCounts(pack, pageKeys, keys, depth).entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "el")).slice(0, 120);
      const entries: Entry[] = counts.map(([lemma, n]) => ({ lemma, n, gloss: null, core: null }));
      setList([...entries]);
      // fill in the short definitions a few at a time
      for (let i = 0; i < entries.length; i += 8) {
        await Promise.all(entries.slice(i, i + 8).map(async (e) => {
          // the core vocabulary's teacher-written definition first; LSJ's first translations otherwise
          const core = await coreEntry(e.lemma);
          if (core) { e.gloss = core.def; e.core = core.rank; return; }
          e.gloss = (await lsjEntries(e.lemma).catch(() => null))?.entries[0]?.s ?? "";
        }));
        if (!live) return;
        setList([...entries]);
      }
    }, (e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [work, pageKeys, keys, depth]);

  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);

  return (
    <aside ref={ref} className={styles.panel} aria-label="Vocabulary for this page" tabIndex={-1} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={styles.panelHead}>
        <h2 className={styles.vocabTitle}>Vocabulary for this page</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close vocabulary">×</button>
      </div>
      <p className={styles.fine}>Dictionary words used on this page, most frequent first, counted from GLAUx&apos;s analyses. Definitions from the DCC Greek Core Vocabulary for the commonest words (marked with their rank), otherwise from LSJ.</p>
      {error && <p className="muted">{error}</p>}
      {!list && !error && <p className="muted">Counting the words…</p>}
      {list && (
        <ol className={styles.vocab}>
          {list.map((e) => (
            <li key={e.lemma}>
              <button type="button" onClick={() => onPick(e.lemma)}>
                <span lang="grc" className={styles.vocabLemma}>{e.lemma}</span>
                <span className={styles.vocabN}>{e.n}×{e.core ? ` · core #${e.core}` : ""}</span>
                <span className={styles.vocabGloss}>{e.gloss === null ? "…" : e.gloss || "—"}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
