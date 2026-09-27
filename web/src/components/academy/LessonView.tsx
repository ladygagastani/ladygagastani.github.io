"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { LESSONS, type Lesson, type Section } from "@/data/lessons";
import { PARADIGMS } from "@/data/paradigms";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { fold, describe } from "@/lib/catalog";
import { norm } from "@/lib/lookup/words";
import { coreEntry } from "@/lib/lookup/core";
import { lsjEntries } from "@/lib/lookup/lsj";
import { useAcademy } from "@/lib/academy";
import { useUI } from "@/lib/ui";
import { Blocks } from "@/components/reader/Blocks";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { ParadigmTable } from "./Tables";
import styles from "./Academy.module.css";
import readerStyles from "@/components/reader/Reader.module.css";

/** «Greek», **bold** and *italic* inside lesson text. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(«[^»]+»|\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
        if (part.startsWith("«")) return <span key={i} lang="grc" className={styles.inlineGr}>{part.slice(1, -1)}</span>;
        if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
        if (part.startsWith("*") && part.length > 1) return <i key={i}>{part.slice(1, -1)}</i>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function Check({ items }: { items: Extract<Section, { kind: "check" }>["items"] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className={styles.check}>
      <span className="label">Check yourself</span>
      {items.map((q, i) => {
        const p = picked[i];
        return (
          <fieldset key={i} className={styles.q}>
            <legend><Rich text={q.q} /></legend>
            <div className={styles.options}>
              {q.options.map((o, j) => (
                <button key={j} type="button" disabled={p !== undefined}
                  className={p === undefined ? "" : j === q.answer ? styles.right : j === p ? styles.wrong : ""}
                  onClick={() => setPicked((s) => ({ ...s, [i]: j }))}><Rich text={o} /></button>
              ))}
            </div>
            {p !== undefined && <p className={p === q.answer ? styles.good : styles.bad} role="status">{p === q.answer ? "Right. " : "Not quite. "}<Rich text={q.why} /></p>}
          </fieldset>
        );
      })}
    </div>
  );
}

function Reveal({ title, items }: Extract<Section, { kind: "reveal" }>) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  return (
    <div className={styles.reveal}>
      <span className="label">{title}</span>
      <div className={styles.revealGrid}>
        {items.map((it, i) => (
          <button key={i} type="button" className={`${styles.revealCard} ${open.has(i) ? styles.revealed : ""}`}
            onClick={() => setOpen((s) => new Set(s).add(i))} aria-expanded={open.has(i)}>
            <span lang="grc" className={styles.revealGr}>{it.grc}</span>
            <span className={styles.revealAns}>{open.has(i) ? it.answer : "Say it, then tap to check"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RealPassage({ item, onWord }: { item: Extract<Section, { kind: "real" }>["items"][number]; onWord: (w: string, ctx: WordContext | null) => void }) {
  const [data, setData] = useState<LoadedPassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadPassage(item.work, item.ref).then(setData, (e: Error) => setError(e.message)); }, [item.work, item.ref]);

  // highlight the first run of words that matches the quote
  useEffect(() => {
    if (!data) return;
    const clean = (w: string) => fold(w).replace(/[^\p{L}]/gu, "");
    const want = item.quote.split(/\s+/).map(clean).filter(Boolean);
    const spans = [...document.querySelectorAll<HTMLElement>(`[data-real="${item.work}:${item.ref}"] [data-w]`)];
    const words = spans.map((sp) => clean(sp.dataset.w!));
    for (let i = 0; i + want.length <= words.length; i++) {
      if (want.every((w, j) => words[i + j] === w)) { for (let j = 0; j < want.length; j++) spans[i + j].dataset.quote = "1"; break; }
    }
  }, [data, item.work, item.ref, item.quote]);

  const click = (e: React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || !data) return;
    const unit = w.closest<HTMLElement>("[data-u]");
    const same = unit ? [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!)) : [];
    onWord(w.dataset.w!, unit ? { work: item.work, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: data.keys, depth: data.depth } : null);
  };

  return (
    <figure className={styles.real} data-real={`${item.work}:${item.ref}`}>
      <figcaption className={styles.realHead}>
        <b>{item.label}</b>
        <Link className="chip" href={`/read?w=${item.work}&at=${item.ref}`} transitionTypes={["page-turn"]}>Open in the reader →</Link>
      </figcaption>
      {error && <p className="muted">This passage could not be loaded ({error}).</p>}
      {!data && !error && <p className="muted">Unrolling the passage…</p>}
      {data && (
        <div className={styles.realBody}>
          <div className={`${readerStyles.grc} ${styles.realGr}`} lang="grc" onClick={click}>
            {data.rows.flatMap((r) => r.greek).map((u) => (
              <div key={u.ref.join(".")} data-u={u.ref.join(".")}>
                <Blocks blocks={u.blocks.filter((b) => b.t !== "head")} greek keyPrefix={`lesson-${u.ref.join(".")}`} />
              </div>
            ))}
          </div>
          {data.tr && <div className={styles.realTr}><span className="label">{describe(data.tr)}</span><Blocks blocks={data.rows.flatMap((r) => r.trans)} greek={false} keyPrefix="lesson-tr" /></div>}
        </div>
      )}
      <p className={styles.realNote}><Rich text={item.note} /></p>
      <p className={styles.small}>Greek {data ? `from ${describe(data.grc)}, ` : ""}shown exactly as the source file gives it. Click any word to look it up.</p>
    </figure>
  );
}

function SectionView({ s, onWord }: { s: Section; onWord: (w: string, ctx: WordContext | null) => void }) {
  switch (s.kind) {
    case "p": return <p className={styles.lp}><Rich text={s.text} /></p>;
    case "tip": return <aside className={styles.tipBox}><span className="label">Tip</span><p><Rich text={s.text} /></p></aside>;
    case "table": { const p = PARADIGMS.find((x) => x.id === s.paradigm); return p ? <ParadigmTable p={p} /> : null; }
    case "made": return (
      <div className={styles.made}>
        <span className="label">{s.title ?? "Practice sentences (made up for this lesson)"}</span>
        {s.items.map((it, i) => (
          <p key={i}><span lang="grc" className={styles.inlineGr}>{it.grc}</span> <span className="muted">{it.en}</span>{it.note && <span className={styles.small}> {it.note}</span>}</p>
        ))}
      </div>
    );
    case "reveal": return <Reveal {...s} />;
    case "check": return <Check items={s.items} />;
    case "real": return (
      <div className={styles.realList}>
        <span className="label">{s.title ?? "From the texts"}</span>
        {s.items.map((it) => <RealPassage key={`${it.work}:${it.ref}`} item={it} onWord={onWord} />)}
      </div>
    );
  }
}

function LessonWords({ lesson }: { lesson: Lesson }) {
  const [glosses, setGlosses] = useState<Record<string, string>>({});
  const deck = useAcademy((s) => s.deck);
  const add = useAcademy((s) => s.addCard);
  const toast = useUI((s) => s.showToast);
  useEffect(() => {
    let live = true;
    Promise.all(lesson.words.map(async (w) => [w, (await coreEntry(w))?.def ?? (await lsjEntries(w).catch(() => null))?.entries[0]?.s ?? ""] as const))
      .then((r) => { if (live) setGlosses(Object.fromEntries(r)); });
    return () => { live = false; };
  }, [lesson]);
  const missing = lesson.words.filter((w) => !deck[w.normalize("NFC")]);
  return (
    <section className={styles.words}>
      <span className="label">Words from this lesson</span>
      <ul>
        {lesson.words.map((w) => (
          <li key={w}><span lang="grc" className={styles.inlineGr}>{w}</span> <span className="muted">{glosses[w] ?? "…"}</span>{deck[w.normalize("NFC")] && <span className={styles.inDeck}>in your deck</span>}</li>
        ))}
      </ul>
      {missing.length > 0 && (
        <button type="button" className="btn ghost" onClick={() => {
          for (const w of missing) add(w, glosses[w] ?? "", "lesson");
          toast(`Added ${missing.length} word${missing.length === 1 ? "" : "s"} to your daily review.`);
        }}>Add {missing.length === lesson.words.length ? "them" : `the other ${missing.length}`} to my daily review</button>
      )}
    </section>
  );
}

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  const done = useAcademy((s) => !!s.completed[lesson.id]);
  const complete = useAcademy((s) => s.completeLesson);
  const i = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[i + 1];

  return (
    <article className={styles.lesson}>
      {lesson.sections.map((s, k) => <SectionView key={k} s={s} onWord={(w, ctx) => setWord({ w, ctx })} />)}
      <LessonWords lesson={lesson} />
      <footer className={styles.lessonEnd}>
        {done ? <p className={styles.good}>You have completed this lesson.</p>
          : <button type="button" className="btn" onClick={() => complete(lesson.id)}>I have finished this lesson</button>}
        {next && <Link className="btn ghost" href={`/academy/lesson/${next.id}`} transitionTypes={["page-turn"]}>Next: {next.title} →</Link>}
      </footer>
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => setWord(null)} />
    </article>
  );
}
