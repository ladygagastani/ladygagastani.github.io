"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LESSONS } from "@/data/lessons";
import { useAcademy, dueCards, streak, knownLemmas } from "@/lib/academy";
import styles from "./Academy.module.css";

/** Where the learner stands, and what to do next. */
export default function AcademyProgress() {
  const { completed, days, deck } = useAcademy();
  const done = LESSONS.filter((l) => completed[l.id]).length;
  const next = LESSONS.find((l) => !completed[l.id]);
  const due = useMemo(() => dueCards(deck).length, [deck]);
  const known = useMemo(() => knownLemmas(deck).size, [deck]);
  const cards = Object.keys(deck).length;
  const s = streak(days);

  return (
    <section className={styles.progress} aria-label="Your progress">
      <div className={styles.stats}>
        <div><b>{done}<small>/{LESSONS.length}</small></b><span>lessons done</span></div>
        <div><b>{known}</b><span>words learned</span></div>
        <div><b>{due}</b><span>cards due today</span></div>
        <div><b>{s}</b><span>day{s === 1 ? "" : "s"} in a row</span></div>
      </div>
      <div className={styles.nextStep}>
        <span className="label">Next step</span>
        {due > 0
          ? <p>You have {due} word{due === 1 ? "" : "s"} to review. <Link href="/academy/review" transitionTypes={["page-turn"]}>Start today&apos;s review →</Link></p>
          : next
            ? <p>{done ? "Carry on with" : "Begin with"} <Link href={`/academy/lesson/${next.id}`} transitionTypes={["page-turn"]}>Lesson {LESSONS.indexOf(next) + 1}: {next.title} →</Link></p>
            : <p>You have finished every lesson so far. <Link href="/academy/vocabulary" transitionTypes={["page-turn"]}>Grow your vocabulary →</Link></p>}
        {cards === 0 && <p className="muted">Your review deck is empty. Words from lessons, the vocabulary list and the reader&apos;s &ldquo;Save word&rdquo; all go into it.</p>}
      </div>
    </section>
  );
}
