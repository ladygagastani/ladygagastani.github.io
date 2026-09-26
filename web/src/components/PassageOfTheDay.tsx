"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { PASSAGE, LEXICON, referenceLinks } from "@/data/iliad-sample";
import { useUI } from "@/lib/ui";
import styles from "./PassageOfTheDay.module.css";

// Greek letters, combining accents and the elision mark count as part of a word.
const WORD = /([Ͱ-Ͽἀ-῿̀-ͯʼ]+)/;

interface Open { word: string; el: HTMLElement }

function Popover({ open, onClose }: { open: Open; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const toast = useUI((s) => s.showToast);
  const entry = LEXICON[open.word];

  // Sit below the word, or above it when there is no room; follow it while the page scrolls,
  // and close once the word has scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      const rect = open.el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) { onClose(); return; }
      const w = el.offsetWidth, h = el.offsetHeight;
      const left = Math.min(Math.max(16, rect.left + rect.width / 2 - w / 2), innerWidth - w - 16);
      const top = rect.bottom + h + 16 < innerHeight ? rect.bottom + 10 : Math.max(16, rect.top - h - 10);
      setPos({ left, top });
    };
    place();
    el.focus({ preventScroll: true });
    addEventListener("scroll", place, { passive: true });
    addEventListener("resize", place);
    return () => { removeEventListener("scroll", place); removeEventListener("resize", place); };
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      className={`${styles.pop} ${pos ? styles.show : ""}`}
      style={pos ?? undefined}
      role="dialog"
      aria-label={`Look-up: ${open.word}`}
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => { if (e.key === "Escape") { onClose(); open.el.focus(); } }}
    >
      <div className={styles.pw} lang="grc">{open.word}</div>
      {entry ? (
        <>
          <div className={styles.lem}>from <span lang="grc">{entry.head}</span></div>
          <div className={styles.parse}>{entry.parse}</div>
          <div className={styles.def}>{entry.gloss}</div>
          <div className={styles.acts}>
            <button type="button" onClick={() => toast("Saving words arrives with the Treasury in Phase 5.")}>Save word</button>
          </div>
          <div className={styles.refs}>
            <span className="label">Look it up in</span>
            {referenceLinks(entry.lemma, open.word).map((r) => (
              <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" title={r.note}>{r.name}</a>
            ))}
          </div>
        </>
      ) : (
        <p className={styles.def}>
          From Phase 2 every word has an entry. This sample includes {Object.keys(LEXICON).length} of them;
          switch on &ldquo;Underline words with entries&rdquo; to see which.
        </p>
      )}
    </div>
  );
}

export default function PassageOfTheDay() {
  const [showEng, setShowEng] = useState(true);
  const [showNums, setShowNums] = useState(true);
  const [showHas, setShowHas] = useState(false);
  const [open, setOpen] = useState<Open | null>(null);
  const toast = useUI((s) => s.showToast);

  const close = useCallback(() => setOpen(null), []);
  useEffect(() => {
    if (!open) return;
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open, close]);

  const pick = (el: HTMLElement) => setOpen({ word: el.dataset.w!, el });

  const cite = `${PASSAGE.author}, ${PASSAGE.work} ${PASSAGE.ref}`;
  const copy = () => navigator.clipboard.writeText(cite).then(
    () => toast(`Citation copied: ${cite}`),
    () => toast(`Copying was blocked. The citation is: ${cite}`),
  );

  return (
    <div className={styles.passage}>
      <div className={styles.aids} role="group" aria-label="Reading aids">
        <button className="chip" type="button" aria-pressed={showEng} onClick={() => setShowEng(!showEng)}><span className="dot" />Translation</button>
        <button className="chip" type="button" aria-pressed={showNums} onClick={() => setShowNums(!showNums)}><span className="dot" />Line numbers</button>
        <button className="chip" type="button" aria-pressed={showHas} onClick={() => setShowHas(!showHas)}><span className="dot" />Underline words with entries</button>
      </div>

      <div className={`${styles.reading} ${showEng ? "" : styles.noEng} ${showNums ? "" : styles.noNum} ${showHas ? styles.showHas : ""}`}>
        <div className={styles.grc} lang="grc"
          onClick={(e) => { const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]"); if (w) { e.stopPropagation(); pick(w); } }}
          onKeyDown={(e) => { const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]"); if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.stopPropagation(); pick(w); } }}>
          {PASSAGE.lines.map(([n, text]) => (
            <div className={styles.row} key={n}>
              <span className={styles.n} aria-hidden={n % 5 !== 0 && n !== 1}>{n % 5 === 0 || n === 1 ? n : ""}</span>
              <span className={styles.line}>
                {text.split(WORD).map((part, i) => WORD.test(part)
                  ? <span key={i} data-w={part} tabIndex={0} role="button"
                      className={`${styles.w} ${LEXICON[part] ? styles.has : ""} ${open?.el.dataset.w === part ? styles.sel : ""}`}>{part}</span>
                  : <Fragment key={i}>{part}</Fragment>)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.eng}>
          <span className="label">{PASSAGE.translator}</span>
          <p>{PASSAGE.english}</p>
        </div>

        <aside className={styles.scholia} aria-label="Notes in the margin">
          <span className="label">In the margin</span>
          {PASSAGE.notes.map((n) => (
            <p key={n.greek} className={styles.scholion}>
              <span className={styles.ref}>{n.line}</span>
              <b lang="grc">{n.greek}</b> {n.text}
              {"certainty" in n && n.certainty === "debated" && <><br /><span className="tag debated">Debated among scholars</span></>}
            </p>
          ))}
        </aside>
      </div>

      <div className={styles.cite}>
        <strong>{cite}</strong>
        <button className="chip" type="button" onClick={copy}>Copy citation</button>
        <span className="muted">Greek: {PASSAGE.edition}. Click any word to look it up.</span>
      </div>

      {open && <Popover open={open} onClose={close} />}
    </div>
  );
}
