"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMarks, type Mark } from "@/lib/annotations";
import NoteField, { type NoteFieldHandle } from "@/components/notes/NoteField";
import RichText from "@/components/notes/RichText";
import TagInput from "@/components/notes/TagInput";
import notes from "@/components/notes/Notes.module.css";
import styles from "./Reader.module.css";

/** Every tag used on any note loaded so far, for suggestions. */
export function useKnownTags() {
  const byWork = useMarks((s) => s.byWork);
  return useMemo(() => [...new Set(Object.values(byWork).flat().flatMap((m) => m.tags ?? []))].sort(), [byWork]);
}

/**
 * A note shown inline beside its passage (or as a card in the Treasury): read it, edit it with
 * light formatting, Greek typing and tags, delete it. Saves as you type (after a pause).
 */
export default function NoteEditor({ mark, startOpen, onClose, head }: { mark: Mark; startOpen: boolean; onClose: () => void; head?: React.ReactNode }) {
  const update = useMarks((s) => s.update);
  const remove = useMarks((s) => s.remove);
  const known = useKnownTags();
  const [editing, setEditing] = useState(startOpen);
  const [text, setText] = useState(mark.text ?? "");
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(true);
  const field = useRef<NoteFieldHandle>(null);

  useEffect(() => { if (editing) field.current?.focus(); }, [editing]);
  useEffect(() => {
    if (text === (mark.text ?? "")) return;
    const t = setTimeout(() => update(mark.id, { text }).then(() => setSaved(true)), 600);
    return () => clearTimeout(t);
  }, [text, mark.id, mark.text, update]);

  const done = () => { if (text !== (mark.text ?? "")) update(mark.id, { text }); setEditing(false); onClose(); };

  return (
    <div className={styles.noteBox} id={`note-${mark.id}`}>
      <div className={styles.noteHead}>
        {head ?? <span className="label">Your note · <span lang="grc">{mark.quote.length > 60 ? mark.quote.slice(0, 60) + "…" : mark.quote}</span></span>}
        <span className={styles.noteActs}>
          {editing
            ? <button type="button" className="chip" onClick={done}>{saved ? "Done" : "Saving…"}</button>
            : <button type="button" className="chip" onClick={() => setEditing(true)}>Edit</button>}
          {confirm
            ? <><button type="button" className="chip" onClick={() => remove(mark.id)}>Delete note</button><button type="button" className="chip" onClick={() => setConfirm(false)}>Keep</button></>
            : <button type="button" className="chip" onClick={() => setConfirm(true)}>Delete</button>}
        </span>
      </div>
      {editing ? (
        <>
          <NoteField ref={field} id={`note-text-${mark.id}`} label="Your note" value={text}
            onChange={(v) => { setText(v); setSaved(false); }} onEscape={done} />
          <TagInput tags={mark.tags ?? []} suggestions={known} onChange={(tags) => update(mark.id, { tags })} />
        </>
      ) : (
        <div onDoubleClick={() => setEditing(true)}>
          {text ? <RichText text={text} className={notes.rich} /> : <p className="muted">Empty note. Click Edit to write.</p>}
          {!!mark.tags?.length && <p className={styles.noteTags}>{mark.tags.map((t) => <span key={t}>#{t}</span>)}</p>}
        </div>
      )}
    </div>
  );
}
