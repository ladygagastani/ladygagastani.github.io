"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAcademy, dueCards, previewIntervals, Rating, type DeckCard } from "@/lib/academy";
import { coreWords, coreEntry, type CoreEntry } from "@/lib/lookup/core";
import { audioKey } from "@/lib/audio";
import { useUI } from "@/lib/ui";
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

export default function Review() {
  const deck = useAcademy((s) => s.deck);
  const review = useAcademy((s) => s.review);
  const [shown, setShown] = useState(false);
  const [doneToday, setDoneToday] = useState(0);
  const [core, setCore] = useState<CoreEntry | null>(null);
  const due = useMemo(() => dueCards(deck), [deck]);
  const card: DeckCard | undefined = due[0];

  useEffect(() => {
    let live = true;
    if (card) coreEntry(card.lemma).then((c) => { if (live) setCore(c); });
    return () => { live = false; };
  }, [card]);

  const answer = (g: Rating) => {
    if (!card) return;
    review(card.id, g as Exclude<Rating, Rating.Manual>);
    setShown(false);
    setDoneToday((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) return;
      if (!shown && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setShown(true); }
      else if (shown && ["1", "2", "3", "4"].includes(e.key)) answer(GRADES[+e.key - 1].g);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

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
      <p className={styles.small}>{due.length} to review{doneToday ? ` · ${doneToday} done` : ""} · Space to turn · 1–4 to answer</p>
      <div className={`${styles.flash} ${shown ? styles.flipped : ""}`}>
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
        <div className={styles.grades} role="group" aria-label="How well did you know it?">
          {GRADES.map((x) => (
            <button key={x.key} type="button" className={styles.grade} onClick={() => answer(x.g)}>
              <b>{x.label}</b><span>{x.hint}</span><small>next in {iv[x.key]}</small>
            </button>
          ))}
        </div>
      )}
      <p className={styles.small}>Scheduling by FSRS (ts-fsrs). Definitions from the DCC Greek Core Vocabulary or LSJ.</p>
    </div>
  );
}
