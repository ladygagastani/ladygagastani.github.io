"use client";

import Link from "next/link";
import { useState } from "react";
import { KIND_LABEL, type MetreAbout, type TextMetre } from "@/lib/metre/text";
import styles from "./Reader.module.css";

const pct = (a: number, b: number) => `${Math.round((1000 * a) / Math.max(1, b)) / 10}%`;
const HYPOTACTIC = <><a href="https://hypotactic.com" target="_blank" rel="noopener noreferrer">David Chamberlain, hypotactic.com</a> (CC BY 4.0)</>;

/** The metre of the text: what it is, where the scansion comes from, the key to the marks, and how it works. */
export default function MetreBar({ info, about }: { info: TextMetre; about: MetreAbout | null }) {
  const [open, setOpen] = useState(false);
  const own = info.scanned - info.published;
  const acc = about?.accuracy;
  return (
    <div className={`wrap ${styles.metreBar}`} role="note" aria-label="Metre">
      <p className={styles.metreHead}>
        <span className={styles.metreName}>{KIND_LABEL[info.kind]}</span>
        <span className="muted">
          {info.published > 0 && <>Scansion of {pct(info.published, info.lines)} of the lines from the published scansion by {HYPOTACTIC}{own > 0 ? "; " : "."}</>}
          {own > 0 && <>{info.published > 0 ? "the rest" : `${pct(own, info.lines)} of the lines`} by this site&apos;s own scanner{info.check ? `, which agrees with the published scansion on ${pct(info.check.agree, info.check.lines)} of this edition's lines it scans` : ""}.</>}
        </span>
      </p>
      <p className={styles.metreKey} aria-label="Key to the marks">
        <span><b className={styles.kL}>–</b> long</span>
        <span><b className={styles.kS}>˘</b> short</span>
        <span><b className={styles.kX}>×</b> either: the metre allows both, and the spelling doesn&apos;t show the vowel&apos;s length</span>
        <span><b className={styles.kFt}>|</b> foot</span>
        <span><b className={styles.kCaes}>‖</b> caesura</span>
        <span><b className={styles.kLic}>–</b> a licence (hover to see which)</span>
        <span><b className={styles.kQ}>?</b> not scanned: the scanner is unsure</span>
        <span><b className={styles.kBeat}>▸</b> play the line&apos;s rhythm</span>
      </p>
      <p className={styles.metreLinks}>
        <button type="button" className="chip" aria-expanded={open} onClick={() => setOpen(!open)}>How this metre works</button>
        <Link className="chip" href="/academy/lesson/metre" transitionTypes={["page-turn"]}>Lesson: hearing Homer&apos;s rhythm</Link>
      </p>
      {open && (
        <div className={styles.metreHelp}>
          {(info.kind === "hexameter" || info.kind === "elegiac") && (
            <p><b>The hexameter</b> is the metre of Homer, Hesiod and all Greek epic. A line has six feet. Each of the first five is a <i>dactyl</i> (– ˘ ˘: one long, two shorts) or a <i>spondee</i> (– –); the fifth is nearly always a dactyl. The sixth has two syllables, and the last may be long or short. Most lines have a word break inside the third foot, the <i>caesura</i>: after its long syllable (&ldquo;masculine&rdquo;) or after its first short (&ldquo;feminine&rdquo;); failing both, after the long of the fourth foot.</p>
          )}
          {info.kind === "elegiac" && (
            <p><b>Elegiac couplets</b> pair a hexameter with a <i>pentameter</i>: two halves of – ˘ ˘ – ˘ ˘ –, with a word break between them. In the first half a spondee may replace a dactyl; in the second it may not.</p>
          )}
          {(info.kind === "drama" || info.kind === "comedy") && (
            <p><b>Iambic trimeter</b> is the spoken metre of Athenian drama: three <i>metra</i> of × – ˘ – (× may be long or short). A long may be split into two shorts (<i>resolution</i>), and so may the × of the first foot. Comedy does this more freely and allows ˘ ˘ – (an anapaest) in the first five feet. The last syllable may be short. The caesura usually falls after the fifth place, or else after the seventh. The sung parts (choral odes, lyric exchanges) and the chanted anapaests are in other metres; Perseus marks those passages, and they are labelled here, not scanned.</p>
          )}
          {info.kind === "lyric" && (
            <p><b>Lyric metres</b> are many and varied. Here the long and short syllables come from the published scansion, with its name for the metre; feet are not marked, since how lyric lines divide is often a matter of debate.</p>
          )}
          <p><b>Long and short.</b> A syllable is long if its vowel is long (η, ω, a diphthong, a vowel with a circumflex or an iota subscript), or if its vowel is followed by two consonants, even across a word break (ζ, ξ, ψ count as two). Otherwise it is short. α, ι and υ can be long or short, and the spelling usually doesn&apos;t say which: the metre, the accent or a known word decides.</p>
          <p><b>Licences.</b> Poets bend these rules in regular ways: a long vowel at the end of a word may count short before a vowel (<i>correption</i>); two vowels may run together as one syllable (<i>synizesis</i>, as in the -εω of Πηληϊάδεω); a stop followed by λ, ρ, μ or ν need not lengthen the syllable before it (usually long in Homer, usually short in Attic drama).</p>
          <p className="muted">How the scanner works: it divides each line into syllables, works out which lengths each can have (and which licences it would need), and fits them to the metre&apos;s patterns, preferring the commonest licences. If two different readings are equally good, the line is marked ? and left unscanned rather than guessed.{acc ? ` Checked against the published scansion (${acc.lines.toLocaleString()} lines in this library): hexameter ${acc.hexameter}, pentameter ${acc.pentameter}, iambic trimeter ${acc.trimeter} agree.` : ""} The rhythm player sounds a long syllable for two beats and a short for one; it plays the rhythm, not the words.</p>
        </div>
      )}
    </div>
  );
}
