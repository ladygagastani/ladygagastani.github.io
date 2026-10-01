import { Fragment, memo, type ReactNode } from "react";
import type { Block, Inline } from "@/lib/tei/types";
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import { transliterate } from "@/lib/translit";
import type { LineRender, Mark } from "@/lib/metre/render";
import styles from "./Reader.module.css";

// Markers readers cite by (Stephanus pages, sections, page numbers) are shown; layout-only ones are not.
const SHOWN = new Set(["section", "page", "chapter", "subsection", "verse"]);

const LICENCE_NAME: Record<string, string> = {
  mcl: "a stop before λ, ρ, μ or ν: the syllable may count either way",
  correption: "a long vowel shortened before the next word's vowel (correption)",
  "inner-correption": "a diphthong shortened before a vowel (correption)",
  synizesis: "two vowels run together into one syllable (synizesis)",
  lengthening: "a short syllable counted long",
};

/** A word with its scansion drawn over it: marks over the vowels, foot divisions inside it. */
function scannedWord(part: string, marks: Mark[], bars: number[]): ReactNode[] {
  const cuts = new Set<number>([0, part.length, ...bars]);
  for (const m of marks) { cuts.add(m.a); cuts.add(m.b); }
  const pts = [...cuts].filter((x) => x >= 0 && x <= part.length).sort((a, b) => a - b);
  const out: ReactNode[] = [];
  for (let k = 0; k + 1 < pts.length; k++) {
    const a = pts[k], b = pts[k + 1];
    if (k > 0 && bars.includes(a)) out.push(<span key={`f${a}`} className={styles.ft} aria-hidden="true" />);
    const m = marks.find((x) => x.a === a && x.b === b);
    const text = part.slice(a, b);
    out.push(m
      ? <span key={a} className={styles.syl} data-q={m.q} data-i={m.i} data-f={m.footStart ? "1" : undefined} data-lic={m.licence}
          style={{ "--i": m.i } as React.CSSProperties} title={m.licence ? LICENCE_NAME[m.licence] : undefined}>{text}</span>
      : <Fragment key={a}>{text}</Fragment>);
  }
  return out;
}

type LineCtx = { n: number; r: LineRender | null } | null;

function words(text: string, clickable: boolean, key: string, line: LineCtx) {
  if (!clickable) return text;
  return text.split(GREEK_WORD).map((part, i) => {
    if (!part || !isGreekWord(part)) return <Fragment key={`${key}-${i}`}>{part}</Fragment>;
    const r = line?.r;
    const w = line ? line.n++ : -1;
    if (!r || r.state !== "scanned") return <span key={`${key}-${i}`} className={styles.w} data-w={part} tabIndex={-1}>{part}</span>;
    const marks = r.marks.filter((m) => m.w === w);
    const bars = r.bars.filter((b) => b.w === w);
    return (
      <Fragment key={`${key}-${i}`}>
        {bars.some((b) => b.at === 0) && <span className={styles.ft} aria-hidden="true" />}
        <span className={styles.w} data-w={part} tabIndex={-1}>{scannedWord(part, marks, bars.map((b) => b.at).filter((x) => x > 0))}</span>
        {r.caesura === w && <span className={styles.caes} aria-hidden="true" title={r.caesuraName ?? "caesura"} />}
      </Fragment>
    );
  });
}

function inlines(c: Inline[], greek: boolean, key: string, line: LineCtx = null) {
  return c.map((x, i) => {
    const k = `${key}.${i}`;
    if (typeof x === "string") return <Fragment key={k}>{words(x, greek, k, line)}</Fragment>;
    if ("gap" in x) return <span key={k} className={styles.gap} title="A gap in the text">…</span>;
    if ("note" in x) return <sup key={k} className={styles.note} title={x.note} aria-label={`Note: ${x.note}`} tabIndex={0} data-silent="">*</sup>;
    if (SHOWN.has(x.m) && x.n) return <span key={k} className={styles.mk} title={`${x.m} ${x.n}`} data-silent="">{x.n}</span>;
    return null;
  });
}

const lineNo = (n?: string) => n && /^\d+$/.test(n) && (+n % 5 === 0 || n === "1") ? n : "";

const plain = (c: Inline[]) => c.map((x) => (typeof x === "string" ? x : "")).join("");

/** The metre's state for one line: a play button when scanned, a "?" when the scanner is unsure. */
function MetreMark({ r }: { r: LineRender }) {
  if (r.state === "scanned" && r.marks.length) {
    return <button type="button" className={styles.beatBtn} data-beat="1" title={`Play the rhythm of this line (${r.label})`} aria-label="Play the rhythm of this line" />;
  }
  if (r.state === "unsure") {
    return <span className={styles.metreQ} title={r.readings > 1
      ? `The scanner found ${r.readings} equally good ways to scan this line, so it is left unmarked rather than guessed.`
      : "This line does not fit the metre as the scanner reads it (the text may differ, or it uses a licence the scanner does not know), so it is left unmarked."} />;
  }
  return null;
}

/** Renders TEI blocks exactly as the file gives them. Greek words become clickable. */
export const Blocks = memo(function Blocks({ blocks, greek, keyPrefix, translit = false, metre }: {
  blocks: Block[]; greek: boolean; keyPrefix: string; translit?: boolean; metre?: (LineRender | null)[];
}) {
  return (
    <>
      {blocks.map((b, i) => {
        const k = `${keyPrefix}-${i}`;
        const speaker = "speaker" in b && b.speaker ? <span className={styles.speaker} data-speaker="">{b.speaker}</span> : null;
        if (b.t === "head") return <p key={k} className={styles.head}>{inlines(b.c, greek, k)}</p>;
        if (b.t === "l") {
          const r = metre?.[i] ?? null;
          return (
            <div key={k} className={`${styles.line} ${b.para ? styles.para : ""}`} data-metre={r?.state}>
              {speaker}
              {r?.label && r.first && <span className={styles.metreLabel}>{r.label}</span>}
              <span className={styles.ln} aria-hidden="true">{lineNo(b.n)}</span>
              <span className={styles.lt}>{r && <MetreMark r={r} />}{inlines(b.c, greek, k, metre ? { n: 0, r } : null)}</span>
              {translit && <span className={styles.translit} aria-hidden="true">{transliterate(plain(b.c))}</span>}
            </div>
          );
        }
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
