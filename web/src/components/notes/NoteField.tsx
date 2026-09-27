"use client";
/**
 * The box for writing a note: plain text with light formatting (bold, italic, lists) from the
 * toolbar or typed by hand, and a Greek typing field for readers without a Greek keyboard.
 */
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { betaToGreek, detectScript } from "@/lib/search/input";
import styles from "./Notes.module.css";

export interface NoteFieldHandle { focus: () => void }

/** Greek typed as Beta Code (a)/nqrwpos → ἄνθρωπος), or pasted in Greek letters. */
export const toGreek = (s: string) => (detectScript(s) === "greek" ? s.normalize("NFC") : betaToGreek(s));

const NoteField = forwardRef<NoteFieldHandle, {
  value: string; onChange: (v: string) => void; onEscape?: () => void; placeholder?: string; rows?: number; label: string; id?: string;
}>(function NoteField({ value, onChange, onEscape, placeholder = "Write your note…", rows = 4, label, id }, ref) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [greek, setGreek] = useState(false);
  const [beta, setBeta] = useState("");
  useImperativeHandle(ref, () => ({ focus: () => area.current?.focus() }));

  /** Replace the selection (or insert at the cursor) and keep the cursor after it. */
  const splice = (make: (sel: string) => string, cursorBack = 0) => {
    const ta = area.current;
    const a = ta?.selectionStart ?? value.length, b = ta?.selectionEnd ?? value.length;
    const ins = make(value.slice(a, b));
    onChange(value.slice(0, a) + ins + value.slice(b));
    requestAnimationFrame(() => { ta?.focus(); const p = a + ins.length - cursorBack; ta?.setSelectionRange(p, p); });
  };
  const wrap = (mark: string) => {
    const ta = area.current;
    const selected = !!ta && ta.selectionEnd > ta.selectionStart;
    splice((sel) => `${mark}${sel}${mark}`, selected ? 0 : mark.length);   // nothing selected: cursor between the marks
  };
  const list = () => splice((sel) => {
    const at = area.current?.selectionStart ?? 0;
    const lead = at > 0 && value[at - 1] !== "\n" ? "\n" : "";
    return lead + (sel ? sel.split("\n").map((l) => `- ${l}`).join("\n") : "- ");
  });
  const insertGreek = () => {
    const g = toGreek(beta);
    if (!g.trim()) return;
    splice(() => g);
    setBeta("");
  };

  return (
    <div className={styles.field}>
      <div className={styles.tools} role="toolbar" aria-label="Formatting">
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrap("**")} title="Bold (**text**)" aria-label="Bold"><b>B</b></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrap("*")} title="Italic (*text*)" aria-label="Italic"><i>I</i></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={list} title="List (a line starting with “- ”)" aria-label="List">•≡</button>
        <button type="button" aria-pressed={greek} onClick={() => setGreek(!greek)} title="Type Greek with an ordinary keyboard"><span lang="grc">Ελ</span> Greek</button>
      </div>
      {greek && (
        <div className={styles.greek}>
          <label>
            <span className="label">Type Greek in Beta Code, e.g. <code>mh=nin a)/eide</code></span>
            <input value={beta} onChange={(e) => setBeta(e.target.value)} spellCheck={false} autoCapitalize="off"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertGreek(); } }} aria-describedby={id ? `${id}-beta` : undefined} />
          </label>
          <output lang="grc" className={styles.preview} aria-live="polite">{toGreek(beta) || " "}</output>
          <button type="button" className="chip" onClick={insertGreek} disabled={!beta.trim()}>Insert</button>
          <p className={styles.help} id={id ? `${id}-beta` : undefined}>
            Letters: a b g d e z h q i k l m n c o p r s t u f x y w (q θ, c ξ, x χ, y ψ, h η, w ω). Marks after the letter:
            ) smooth, ( rough, / acute, \ grave, = circumflex, | iota subscript, + diaeresis; * before a letter for a capital.
          </p>
        </div>
      )}
      <textarea ref={area} id={id} aria-label={label} value={value} rows={rows} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onEscape?.();
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") { e.preventDefault(); wrap("**"); }
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") { e.preventDefault(); wrap("*"); }
        }} />
    </div>
  );
});

export default NoteField;
