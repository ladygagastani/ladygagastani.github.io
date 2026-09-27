"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { describe, versionOf } from "@/lib/catalog";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { norm } from "@/lib/lookup/words";
import { PASSAGES, todaysIndex, type DailyPassage } from "@/data/passages";
import { Blocks } from "@/components/reader/Blocks";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { useUI } from "@/lib/ui";
import { AREAS } from "@/config/areas";
import styles from "./PassageOfTheDay.module.css";
import readerStyles from "./reader/Reader.module.css";

interface Loaded extends LoadedPassage { p: DailyPassage }

/** Load today's passage; if it can't be read (offline and not downloaded), try the next ones. */
async function loadToday(): Promise<Loaded> {
  let lastError: Error | null = null;
  for (let k = 0; k < PASSAGES.length; k++) {
    const p = PASSAGES[(todaysIndex() + k) % PASSAGES.length];
    try { return { p, ...(await loadPassage(p.work, p.from, p.to)) }; }
    catch (e) { lastError = e as Error; }
  }
  throw lastError ?? new Error("No passage could be loaded.");
}

export default function PassageOfTheDay() {
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEng, setShowEng] = useState(true);
  const [showNums, setShowNums] = useState(true);
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  const toast = useUI((s) => s.showToast);

  useEffect(() => { loadToday().then(setData, (e: Error) => setError(e.message)); }, []);

  const translation = useMemo(() => data?.rows.flatMap((r) => r.trans) ?? [], [data]);

  if (error) {
    return (
      <div className={styles.passage}>
        <p className="muted">Today&apos;s passage could not be loaded ({error}). If you are offline, download the library in <Link href={AREAS.downloads.href}>{AREAS.downloads.name}</Link>.</p>
      </div>
    );
  }
  if (!data) return <div className={styles.passage}><span className={`meander ${styles.loading}`} aria-hidden="true" /><p className="muted">Unrolling today&apos;s passage…</p></div>;

  const { p, rows, grc, tr } = data;
  const cite = p.label;
  const copy = () => navigator.clipboard.writeText(cite).then(() => toast(`Citation copied: ${cite}`), () => toast(`Copying was blocked. The citation is: ${cite}`));

  const onClick = (e: React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w) return;
    document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel));
    w.classList.add(readerStyles.sel);
    const unit = w.closest<HTMLElement>("[data-u]");
    const same = unit ? [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!)) : [];
    setWord({ w: w.dataset.w!, ctx: unit ? { work: p.work, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: data.keys, depth: data.depth } : null });
  };

  return (
    <div className={styles.passage}>
      <div className={styles.aids} role="group" aria-label="Reading aids">
        {tr && <button className="chip" type="button" aria-pressed={showEng} onClick={() => setShowEng(!showEng)}><span className="dot" />Translation</button>}
        <button className="chip" type="button" aria-pressed={showNums} onClick={() => setShowNums(!showNums)}><span className="dot" />Line numbers</button>
      </div>

      <div className={`${styles.reading} ${showEng && tr ? "" : styles.noEng} ${showNums ? "" : styles.noNum}`}>
        <div className={`${styles.grc} ${readerStyles.grc}`} lang="grc" onClick={onClick}>
          {rows.flatMap((r) => r.greek).map((u) => (
            <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={`pd${u.ref.join(".")}`} /></div>
          ))}
        </div>
        {tr && (
          <div className={styles.eng}>
            <span className="label">{describe(tr)}</span>
            <Blocks blocks={translation} greek={false} keyPrefix="pdt" />
          </div>
        )}
        <aside className={styles.scholia} aria-label="In the margin">
          <span className="label">In the margin</span>
          <p>{p.about}</p>
        </aside>
      </div>

      <div className={styles.cite}>
        <strong>{cite}</strong>
        <button className="chip" type="button" onClick={copy}>Copy citation</button>
        <Link className="chip" href={`/read?w=${p.work}&ed=${versionOf(grc.urn)}&tr=${tr ? versionOf(tr.urn) : "none"}&at=${p.from}`} transitionTypes={["page-turn"]}>Read on →</Link>
        <span className="muted">Greek: {describe(grc)}. Click any word to look it up.</span>
      </div>

      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => { setWord(null); document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel)); }} />
    </div>
  );
}
