"use client";
/** The reader's own notes on authors: pick an author, write; saved as you type. */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fold } from "@/lib/catalog";
import { usePageNotes, type PageNote } from "@/lib/annotations";
import NoteField from "@/components/notes/NoteField";
import RichText from "@/components/notes/RichText";
import notesCss from "@/components/notes/Notes.module.css";
import { ago, plural, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";

/** A note on one author, word or wiki section, saved as you type. Used here, on Word Study pages and in the Painted Stoa. */
export function PageNoteEditor({ kind, target, label, startOpen = false }: { kind: PageNote["kind"]; target: string; label: string; startOpen?: boolean }) {
  const id = `${kind}:${kind === "word" ? target.normalize("NFC") : target}`;
  const note = usePageNotes((s) => s.notes[id]);
  const save = usePageNotes((s) => s.save);
  const [editing, setEditing] = useState(startOpen);
  // what the reader has typed, if anything; until then the stored note (which may load after the first render)
  const [draft, setDraft] = useState<string | null>(null);
  const stored = note?.text ?? "";
  const text = draft ?? stored;
  const synced = draft === null || draft === stored;
  useEffect(() => {
    if (draft === null || draft === stored) return;
    const h = setTimeout(() => save(kind, target, draft), 600);
    return () => clearTimeout(h);
  }, [draft, stored, kind, target, save]);

  if (!editing) {
    return (
      <div className={styles.pageNote}>
        {note?.text ? <RichText text={note.text} className={notesCss.rich} /> : <p className="muted">No note yet.</p>}
        <p className={styles.pageNoteFoot}>
          <button type="button" className="chip" onClick={() => setEditing(true)}>{note?.text ? "Edit note" : "Write a note"}</button>
          {note && <span className="muted">Last changed {ago(note.updated)}</span>}
        </p>
      </div>
    );
  }
  return (
    <div className={styles.pageNote}>
      <NoteField label={label} value={text} onChange={setDraft} rows={6} onEscape={() => setEditing(false)}
        placeholder={kind === "author" ? "What you think of this author, what to read next, questions…" : kind === "stoa" ? "Your thoughts on this section, questions, passages to follow up…" : "Where you met this word, a memory aid, a nuance…"} />
      <p className={styles.pageNoteFoot}>
        <button type="button" className="chip" onClick={() => { if (!synced) save(kind, target, text); setEditing(false); }}>{synced ? "Done" : "Saving…"}</button>
        <span className="muted">Saved in this browser as you type. An empty note is deleted.</span>
      </p>
    </div>
  );
}

export default function AuthorsSection({ t }: { t: TreasuryState }) {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const chosen = params.get("a");
  const notes = useMemo(() => Object.values(t.pageNotes).filter((n) => n.kind === "author").sort((a, b) => b.updated - a.updated), [t.pageNotes]);
  const matches = useMemo(() => {
    const n = fold(q).trim();
    if (!n || !t.idx) return [];
    return t.idx.catalog.authors.filter((a) => fold(a.name).includes(n)).slice(0, 8);
  }, [q, t.idx]);
  const open = (id: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (id) p.set("a", id); else p.delete("a");
    setQ("");
    router.replace(`/treasury?${p}`, { scroll: false });
  };
  const name = (id: string) => t.idx?.author.get(id)?.name ?? id;
  const list = chosen && !notes.some((n) => n.target === chosen) ? [chosen, ...notes.map((n) => n.target)] : notes.map((n) => n.target);

  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Notes on authors</h2>
        <p className="muted">{plural(notes.length, "author")} with your notes.</p>
      </div>
      <div className={styles.filters}>
        <span className={styles.pick}>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find an author to write about" aria-label="Find an author"
            onKeyDown={(e) => { if (e.key === "Enter" && matches[0]) open(matches[0].id); }} />
          {matches.length > 0 && (
            <ul className={styles.pickList}>
              {matches.map((a) => <li key={a.id}><button type="button" onClick={() => open(a.id)}>{a.name} <small>{plural(a.works.length, "work")}</small></button></li>)}
            </ul>
          )}
        </span>
      </div>
      {!list.length && <p className={styles.empty}>No notes on authors yet. Find an author above to start one.</p>}
      <ol className={styles.authorNotes}>
        {list.map((id) => (
          <li key={id} className={styles.authorNote} data-open={chosen === id ? "" : undefined}>
            <h3>
              <span>{name(id)}</span>
              <Link className={styles.small} href={`/library/author?a=${id}`} transitionTypes={["page-turn"]}>Author page in the Mouseion →</Link>
            </h3>
            <PageNoteEditor kind="author" target={id} label={`Your note on ${name(id)}`} startOpen={chosen === id && !t.pageNotes[`author:${id}`]} />
          </li>
        ))}
      </ol>
    </>
  );
}
