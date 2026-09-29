"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAcademy, dueCards, previewIntervals, Rating, type DeckCard } from "@/lib/academy";
import { coreWords, coreEntry, type CoreEntry } from "@/lib/lookup/core";
import { audioKey } from "@/lib/audio";
import { useUI } from "@/lib/ui";
import { useSwipeCard, type SwipeDir } from "@/lib/use-swipe-card";
import { buzz } from "@/lib/haptics";
import Say from "./Say";
import styles from "./Academy.module.css";

const GRADES = [
  { g: Rating.Again, key: "again", label: "Again", hint: "I didn't know it" },
  { g: Rating.Hard, key: "hard", label: "Hard", hint: "I knew it, just" },
  { g: Rating.Good, key: "good", label: "Good", hint: "I knew it" },
  { g: Rating.Easy, key: "easy", label: "Easy", hint: "Too easy" },
] as const;

function AddCommon({ n = 20 }: { n?: number }) {
  const deck = useAcademy((s) => s.deck);
  const add = useAcademy((s) => s.addCard);
  const toast = useUI((s) => s.showToast);
  const addNext = async () => {
    const words = (await coreWords()).filter((w) => !deck[w.lemma]).slice(0, n);
    for (const w of words) add(w.lemma, w.entry.def, "core");
    toast(words.length ? `Added ${words.length} of the commonest words, from #${words[0].entry.rank} to #${words[words.length - 1].entry.rank}.` : "You already have every core word.");
  };
  return <button type="button" className="btn" onClick={addNext}>Add the next {n} commonest words</button>;
}

/** A throw of the card answers it: right "knew it", left "again", up "easy" (Hard has its button only). */
const SWIPE: Record<SwipeDir, Rating> = { right: Rating.Good, left: Rating.Again, up: Rating.Easy };

/**
 * The daily review. `limit` ends the round after that many cards (the daily session uses a short one)
 * and calls `onDone`.
 */
export default function Review({ limit, onDone }: { limit?: number; onDone?: (n: number) => void } = {}) {
  const deck = useAcademy((s) => s.deck);
  const review = useAcademy((s) => s.review);
  const [shown, setShown] = useState(false);
  const [doneToday, setDoneToday] = useState(0);
  const [core, setCore] = useState<CoreEntry | null>(null);
  const due = useMemo(() => dueCards(deck), [deck]);
  const finished = limit !== undefined && doneToday >= limit;
  const card: DeckCard | undefined = finished ? undefined : due[0];
  const flash = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    if (card) coreEntry(card.lemma).then((c) => { if (live) setCore(c); });
    return () => { live = false; };
  }, [card]);

  const answer = (g: Rating) => {
    if (!card) return;
    review(card.id, g as Exclude<Rating, Rating.Manual>);
    if (g === Rating.Good || g === Rating.Easy) buzz("right");
    setShown(false);
    setDoneToday((n) => n + 1);
  };
  const swipe = useSwipeCard({ el: () => flash.current, enabled: () => shown, onSwipe: (d) => answer(SWIPE[d]) });
  // the round is over (or there was nothing to review): tell the daily session, once
  const told = useRef(false);
  useEffect(() => { if (!card && onDone && !told.current) { told.current = true; onDone(doneToday); } }, [card, onDone, doneToday]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) return;
      if (!shown && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setShown(true); }
      else if (shown && ["1", "2", "3", "4"].includes(e.key)) answer(GRADES[+e.key - 1].g);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  if (!card && onDone) {
    return (
      <div className={styles.reviewEmpty}>
        <p className={styles.reviewBig}>{doneToday ? `${doneToday} card${doneToday === 1 ? "" : "s"} reviewed.` : Object.keys(deck).length ? "No cards are due today." : "Your deck is empty for now."}</p>
        {!Object.keys(deck).length && <p className="muted">Words you save in the reader or learn in the lessons come here. <AddCommon n={10} /></p>}
      </div>
    );
  }
  if (!card) {
    return (
      <div className={styles.reviewEmpty}>
        <p className={styles.reviewBig}>{doneToday ? `Done: ${doneToday} card${doneToday === 1 ? "" : "s"} reviewed.` : Object.keys(deck).length ? "Nothing to review right now." : "Your deck is empty."}</p>
        <p className="muted">Cards come back just before you would forget them. You can add more words now, or come back later.</p>
        <div className={styles.row}>
          <AddCommon />
          <Link className="btn ghost" href="/academy/vocabulary" transitionTypes={["page-turn"]}>Choose words from the list</Link>
        </div>
      </div>
    );
  }

  const iv = previewIntervals(card);
  return (
    <div className={styles.review}>
      <p className={styles.small}>{limit !== undefined ? `${Math.min(limit, doneToday + 1)} of ${Math.min(limit, due.length + doneToday)}` : `${due.length} to review${doneToday ? ` · ${doneToday} done` : ""}`}<span className={styles.keysHint}> · Space to turn · 1–4 to answer</span></p>
      <div ref={flash} className={`${styles.flash} ${shown ? styles.flipped : ""}`} data-noswipe="" {...swipe}
        onClick={() => { if (!shown) setShown(true); }}>
        <span className={styles.lean} data-for="right" aria-hidden="true">Knew it</span>
        <span className={styles.lean} data-for="left" aria-hidden="true">Again</span>
        <span className={styles.lean} data-for="up" aria-hidden="true">Easy</span>
        <div className={styles.flashIn}>
          <div className={styles.flashFront}>
            <span lang="grc" className={styles.flashWord}>{card.lemma}</span>
            <Say k={audioKey.word(card.lemma)} label={card.lemma} />
          </div>
          <div className={styles.flashBack} aria-hidden={!shown}>
            <span lang="grc" className={styles.flashSmall}>{core?.head ?? card.lemma}</span>
            <p className={styles.flashGloss}>{card.gloss || "No definition saved; look it up in the reader."}</p>
            {core && <p className={styles.small}>{core.pos} · one of the commonest words (#{core.rank})</p>}
          </div>
        </div>
      </div>
      {!shown ? (
        <button type="button" className="btn" onClick={() => setShown(true)}>Show the meaning</button>
      ) : (
        <>
        <p className={styles.swipeHint}>Swipe the card: right if you knew it, left to see it again soon, up if it was easy.</p>
        <div className={styles.grades} role="group" aria-label="How well did you know it?">
          {GRADES.map((x) => (
            <button key={x.key} type="button" className={styles.grade} onClick={() => answer(x.g)}>
              <b>{x.label}</b><span>{x.hint}</span><small>next in {iv[x.key]}</small>
            </button>
          ))}
        </div>
        </>
      )}
      <p className={styles.small}>Scheduling by FSRS (ts-fsrs). Definitions from the DCC Greek Core Vocabulary or LSJ.</p>
    </div>
  );
}
