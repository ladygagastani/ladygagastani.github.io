"use client";

import { useEffect, useRef, useState } from "react";
import { useMarks, type Mark } from "@/lib/annotations";
import styles from "./Reader.module.css";

/** A note shown inline beside its passage: read it, edit it, delete it. Saves as you type (after a pause). */
export default function NoteEditor({ mark, startOpen, onClose }: { mark: Mark; startOpen: boolean; onClose: () => void }) {
  const update = useMarks((s) => s.update);
  const remove = useMarks((s) => s.remove);
  const [editing, setEditing] = useState(startOpen);
  const [text, setText] = useState(mark.text ?? "");
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(true);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (editing) area.current?.focus(); }, [editing]);
  useEffect(() => {
    if (text === (mark.text ?? "")) return;
    const t = setTimeout(() => update(mark.id, { text }).then(() => setSaved(true)), 600);
    return () => clearTimeout(t);
  }, [text, mark.id, mark.text, update]);

  return (
    <div className={styles.noteBox} id={`note-${mark.id}`}>
      <div className={styles.noteHead}>
        <span className="label">Your note · <span lang="grc">{mark.quote.length > 60 ? mark.quote.slice(0, 60) + "…" : mark.quote}</span></span>
        <span className={styles.noteActs}>
          {editing
            ? <button type="button" className="chip" onClick={() => { setEditing(false); onClose(); }}>{saved ? "Done" : "Saving…"}</button>
            : <button type="button" className="chip" onClick={() => setEditing(true)}>Edit</button>}
          {confirm
            ? <><button type="button" className="chip" onClick={() => remove(mark.id)}>Delete note</button><button type="button" className="chip" onClick={() => setConfirm(false)}>Keep</button></>
            : <button type="button" className="chip" onClick={() => setConfirm(true)}>Delete</button>}
        </span>
      </div>
      {editing ? (
        <textarea ref={area} id={`note-text-${mark.id}`} value={text} rows={4} placeholder="Write your note…"
          onChange={(e) => { setText(e.target.value); setSaved(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") { setEditing(false); onClose(); } }} />
      ) : (
        <p className={styles.noteText} onDoubleClick={() => setEditing(true)}>{text || <span className="muted">Empty note. Click Edit to write.</span>}</p>
      )}
    </div>
  );
}
