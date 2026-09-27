"use client";
/** The reader's own labels on a note: shown as chips, added by typing (Enter or comma), removed with ×. */
import { useId, useState } from "react";
import styles from "./Notes.module.css";

export const cleanTag = (t: string) => t.trim().replace(/^#/, "").replace(/\s+/g, " ").slice(0, 40);

export default function TagInput({ tags, onChange, suggestions = [] }: { tags: string[]; onChange: (t: string[]) => void; suggestions?: string[] }) {
  const [text, setText] = useState("");
  const list = useId();
  const add = (raw: string) => {
    const t = cleanTag(raw);
    if (t && !tags.some((x) => x.toLowerCase() === t.toLowerCase())) onChange([...tags, t]);
    setText("");
  };
  return (
    <div className={styles.tags}>
      <span className="label">Tags</span>
      {tags.map((t) => (
        <span key={t} className={styles.tag}>
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove tag ${t}`}>×</button>
        </span>
      ))}
      <input value={text} list={list} placeholder={tags.length ? "add another" : "add a tag"} aria-label="Add a tag"
        onChange={(e) => { const v = e.target.value; if (v.endsWith(",")) add(v.slice(0, -1)); else setText(v); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); add(text); }
          if (e.key === "Backspace" && !text && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={() => text && add(text)} />
      <datalist id={list}>{suggestions.filter((s) => !tags.includes(s)).map((s) => <option key={s} value={s} />)}</datalist>
    </div>
  );
}
