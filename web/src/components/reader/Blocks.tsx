import { Fragment, memo } from "react";
import type { Block, Inline } from "@/lib/tei/types";
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import { transliterate } from "@/lib/translit";
import styles from "./Reader.module.css";

// Markers readers cite by (Stephanus pages, sections, page numbers) are shown; layout-only ones are not.
const SHOWN = new Set(["section", "page", "chapter", "subsection", "verse"]);

function words(text: string, clickable: boolean, key: string) {
  if (!clickable) return text;
  return text.split(GREEK_WORD).map((part, i) =>
    part && isGreekWord(part)
      ? <span key={`${key}-${i}`} className={styles.w} data-w={part} tabIndex={-1}>{part}</span>
      : <Fragment key={`${key}-${i}`}>{part}</Fragment>);
}

function inlines(c: Inline[], greek: boolean, key: string) {
  return c.map((x, i) => {
    const k = `${key}.${i}`;
    if (typeof x === "string") return <Fragment key={k}>{words(x, greek, k)}</Fragment>;
    if ("gap" in x) return <span key={k} className={styles.gap} title="A gap in the text">…</span>;
    if ("note" in x) return <sup key={k} className={styles.note} title={x.note} aria-label={`Note: ${x.note}`} tabIndex={0}>*</sup>;
    if (SHOWN.has(x.m) && x.n) return <span key={k} className={styles.mk} title={`${x.m} ${x.n}`}>{x.n}</span>;
    return null;
  });
}

const lineNo = (n?: string) => n && /^\d+$/.test(n) && (+n % 5 === 0 || n === "1") ? n : "";

const plain = (c: Inline[]) => c.map((x) => (typeof x === "string" ? x : "")).join("");

/** Renders TEI blocks exactly as the file gives them. Greek words become clickable. */

export const Blocks = memo(function Blocks({ blocks, greek, keyPrefix, translit = false }: { blocks: Block[]; greek: boolean; keyPrefix: string; translit?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        const k = `${keyPrefix}-${i}`;
        const speaker = "speaker" in b && b.speaker ? <span className={styles.speaker}>{b.speaker}</span> : null;
        if (b.t === "head") return <p key={k} className={styles.head}>{inlines(b.c, greek, k)}</p>;
        if (b.t === "l") return (
          <div key={k} className={`${styles.line} ${b.para ? styles.para : ""}`}>
            {speaker}
            <span className={styles.ln} aria-hidden="true">{lineNo(b.n)}</span>
            <span className={styles.lt}>{inlines(b.c, greek, k)}</span>
            {translit && <span className={styles.translit} aria-hidden="true">{transliterate(plain(b.c))}</span>}
          </div>
        );
        return (
          <Fragment key={k}>
            <p className={styles.p}>{speaker}{inlines(b.c, greek, k)}</p>
            {translit && <p className={styles.translit} aria-hidden="true">{transliterate(plain(b.c))}</p>}
          </Fragment>
        );
      })}
    </>
  );
});
