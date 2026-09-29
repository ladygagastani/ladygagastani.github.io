"use client";
/**
 * Today's session: a few minutes of study as the pages of a small book, turned forward with Next or
 * a swipe to the left (Phase 10). A few flashcards, one question on the forms, and one real sentence;
 * then a last page with what was done and the days in a row. Full screen on phones.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { useAcademy, streak } from "@/lib/academy";
import { AREAS } from "@/config/areas";
import Review from "./Review";
import { Endings, Parsing } from "./Practice";
import styles from "./Academy.module.css";

const STEPS = [
  { title: "Your cards", gr: "ἀνάμνησις", note: "Up to ten words from your review deck, due today." },
  { title: "One ending", gr: "ἄσκησις", note: "One question on the forms, from the tables." },
  { title: "One real sentence", gr: "λόγος", note: "A word in a verse of the Gospel of John, its analysis checked by hand." },
  { title: "Done for today", gr: "τέλος", note: "" },
] as const;
const CARDS = 10;

export default function DailySession() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [cards, setCards] = useState<number | null>(null);
  const [ending, setEnding] = useState<boolean | null>(null);
  const [sentence, setSentence] = useState<boolean[]>([]);
  const days = useAcademy((s) => s.days);
  const markActive = useAcademy((s) => s.markActive);
  const box = useRef<HTMLDivElement>(null);
  const done = [cards !== null, ending !== null, sentence.length >= 2, true];
  const last = STEPS.length - 1;

  const go = (n: number) => {
    if (n < 0 || n > last) return;
    setDir(n > step ? 1 : -1);
    setStep(n);
    if (n === last) markActive();
    box.current?.scrollTo({ top: 0 });
  };

  // a swipe to the left turns forward, to the right back (not on the flashcard, which has swipes of its own)
  const g = useRef<{ id: number; x: number; y: number } | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => {
      const t = e.target as Element;
      g.current = t.closest("[data-noswipe], button, a, input, select, textarea") ? null : { id: e.pointerId, x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = g.current;
      g.current = null;
      if (!s || s.id !== e.pointerId) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(step + (dx < 0 ? 1 : -1));
    },
    onPointerCancel: () => { g.current = null; },
  };

  const s = STEPS[step];
  return (
    <div ref={box} className={styles.session}>
      <div className={styles.sessionTop}>
        <Link className={styles.sessionX} href={AREAS.study.href} transitionTypes={["page-turn"]} aria-label={`Leave today's session, back to ${AREAS.study.name}`}>×</Link>
        <ol className={styles.dots} aria-label="Pages of today's session">
          {STEPS.map((x, i) => (
            <li key={x.title} aria-current={i === step ? "step" : undefined} data-done={i < step || undefined}>
              <span className="visually-hidden">{x.title}{i === step ? " (this page)" : ""}</span>
            </li>
          ))}
        </ol>
        <span className="label">{step + 1} of {STEPS.length}</span>
      </div>

      <section key={step} className={styles.sessionPage} data-dir={dir} aria-labelledby="session-title" {...swipe}>
        <header className={styles.sessionHead}>
          <h1 id="session-title">{s.title} <span lang="grc">{s.gr}</span></h1>
          {s.note && <p className="muted">{s.note}</p>}
        </header>
        {step === 0 && <div data-noswipe=""><Review limit={CARDS} onDone={(n) => setCards(n)} /></div>}
        {step === 1 && <Endings once onScore={(ok) => setEnding(ok)} />}
        {step === 2 && <Parsing once onScore={(ok) => setSentence((a) => [...a, ok])} />}
        {step === last && (
          <div className={styles.sessionDone}>
            <ul>
              <li>{cards ? `${cards} card${cards === 1 ? "" : "s"} reviewed` : "No cards were due"}</li>
              <li>{ending === null ? "The ending was skipped" : ending ? "The ending: right" : "The ending: one to look at again in the tables"}</li>
              <li>{sentence.length < 2 ? "The sentence was skipped" : `The sentence: ${sentence.filter(Boolean).length} of 2 right`}</li>
            </ul>
            <p className={styles.sessionDays}>
              <b>{streak(days)}</b> day{streak(days) === 1 ? "" : "s"} in a row. A few minutes each day is the surest way to learn a language.
            </p>
            <div className={styles.row}>
              <Link className="btn ghost" href="/academy/practice" transitionTypes={["page-turn"]}>More practice</Link>
              <Link className="btn ghost" href={AREAS.library.href} transitionTypes={["page-turn"]}>Read something</Link>
            </div>
          </div>
        )}
      </section>

      <div className={styles.sessionFoot}>
        {step > 0 && <button type="button" className="btn ghost" onClick={() => go(step - 1)}>Back</button>}
        {step < last
          ? <button type="button" className="btn" onClick={() => go(step + 1)}>{done[step] ? "Next" : "Skip"} <span className="arr" aria-hidden="true">→</span></button>
          : <Link className="btn" href={AREAS.study.href} transitionTypes={["page-turn"]}>Back to {AREAS.study.name}</Link>}
      </div>
    </div>
  );
}
