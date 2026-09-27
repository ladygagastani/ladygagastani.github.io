"use client";
/** Saved words, each opening its Word Study page, with its place in the review deck. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TypeConvert } from "ts-fsrs";
import { State, type DeckCard } from "@/lib/academy";
import { toGreek } from "@/components/notes/NoteField";
import { plural, wordHref, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";

export function reviewStatus(c: DeckCard, now = Date.now()): { label: string; tone: "new" | "learning" | "known" } {
  const card = TypeConvert.card(c.card);
  if (card.state === State.New) return { label: "New: not reviewed yet", tone: "new" };
  const due = card.due.getTime();
  const when = due <= now ? "due now" : `next review ${new Date(due).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  if (card.state === State.Review) return { label: `Known · ${when}`, tone: "known" };
  return { label: `Learning · ${when}`, tone: "learning" };
}

export default function WordsSection({ t }: { t: TreasuryState }) {
  const router = useRouter();
  const [all, setAll] = useState(false);
  const [order, setOrder] = useState<"new" | "abc">("new");
  const [look, setLook] = useState("");
  const words = useMemo(() => {
    const list = Object.values(t.deck).filter((c) => all || c.source === "saved");
    return order === "abc" ? list.sort((a, b) => a.lemma.localeCompare(b.lemma, "el")) : list.sort((a, b) => b.added - a.added);
  }, [t.deck, all, order]);
  const saved = Object.values(t.deck).filter((c) => c.source === "saved").length;
  const study = () => { const g = toGreek(look.trim()); if (g) router.push(wordHref(g)); };

  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Words</h2>
        <p className="muted">{plural(saved, "word")} saved from the reader{all ? `, ${plural(words.length - saved, "more", "more")} from lessons and the core list` : ""}. Each has a Word Study page: its dictionary entry, every form, where it is used, and its family.</p>
      </div>
      <div className={styles.filters}>
        <span className={styles.inlineForm}>
          <input value={look} onChange={(e) => setLook(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") study(); }}
            placeholder="Study any word: λόγος, or lo/gos in Beta Code" aria-label="Study any dictionary word" lang="grc" />
          <button type="button" className="chip" onClick={study} disabled={!look.trim()}>Word Study</button>
        </span>
        <span className={styles.seg} role="group" aria-label="Order">
          <button type="button" aria-pressed={order === "new"} onClick={() => setOrder("new")}>Newest</button>
          <button type="button" aria-pressed={order === "abc"} onClick={() => setOrder("abc")}>α–ω</button>
        </span>
        <label className={styles.check}><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Include lesson and core words</label>
      </div>
      {!words.length && <p className={styles.empty}>No saved words yet. Click any Greek word in the reader and press <b>Save word to my review</b>.</p>}
      <ol className={styles.words}>
        {words.map((c, i) => {
          const s = reviewStatus(c);
          const noted = !!t.pageNotes[`word:${c.lemma}`];
          return (
            <li key={c.id} style={{ "--i": Math.min(i, 16) } as React.CSSProperties}>
              <Link href={wordHref(c.lemma)} className={styles.wordCard} transitionTypes={["page-turn"]}>
                <span className={styles.wordGr} lang="grc">{c.lemma}</span>
                <span className={styles.gloss}>{c.gloss || <span className="muted">no short definition</span>}</span>
                <span className={styles.status} data-tone={s.tone}>{s.label}{noted ? " · your note" : ""}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
