"use client";

import { useEffect, useState } from "react";
import { PARADIGMS, formsOf } from "@/data/paradigms";
import { fold } from "@/lib/catalog";
import { loadWordPack, type WordPack } from "@/lib/lookup/words";
import { readTag } from "@/lib/lookup/postag";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { useAcademy } from "@/lib/academy";
import { buzz } from "@/lib/haptics";
import { Blocks } from "@/components/reader/Blocks";
import styles from "./Academy.module.css";
import readerStyles from "@/components/reader/Reader.module.css";

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// ------------------------------------------------------------ 1. endings, from the checked tables
interface EndingQ { prompt: string; lemma: string; answer: string; options: string[] }
function makeEndingQ(): EndingQ {
  const pool = PARADIGMS.filter((p) => p.group !== "pronoun");
  const p = pool[Math.floor(Math.random() * pool.length)];
  const rows = p.rows.map((_, r) => r).filter((r) => p.rows[r] !== "vocative");
  const r = rows[Math.floor(Math.random() * rows.length)];
  const c = Math.floor(Math.random() * p.cols.length);
  const answer = formsOf(p.cells[r][c])[0];
  const all = [...new Set(p.cells.flat().flatMap(formsOf))].filter((f) => fold(f) !== fold(answer));
  const options = shuffle([answer, ...shuffle(all).slice(0, 3)]);
  return { prompt: `${p.rows[r]}, ${p.cols[c]}`, lemma: p.lemma, answer, options };
}

/** `once`: a single question with no Next button (the daily session moves on by itself). */
export function Endings({ onScore, once = false }: { onScore: (ok: boolean) => void; once?: boolean }) {
  const [q, setQ] = useState<EndingQ>(makeEndingQ);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className={styles.drill}>
      <p className={styles.drillQ}>What is the <b>{q.prompt}</b> of <span lang="grc" className={styles.inlineGr}>{q.lemma}</span>?</p>
      <div className={styles.options}>
        {q.options.map((o) => (
          <button key={o} type="button" lang="grc" disabled={!!picked}
            className={`${styles.optGr} ${picked ? (o === q.answer ? styles.right : o === picked ? styles.wrong : "") : ""}`}
            onClick={() => { setPicked(o); onScore(o === q.answer); if (o === q.answer) buzz("right"); }}>{o}</button>
        ))}
      </div>
      {picked && (
        <div className={styles.drillFoot}>
          <p className={picked === q.answer ? styles.good : styles.bad} role="status">{picked === q.answer ? "Right." : <>It is <span lang="grc" className={styles.inlineGr}>{q.answer}</span>.</>}</p>
          {!once && <button type="button" className="btn" onClick={() => { setQ(makeEndingQ()); setPicked(null); }}>Next</button>}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ 2. parse a real word in a real sentence
const CASE_NAMES = ["nominative", "genitive", "dative", "accusative"];
interface ParseQ { unitKey: string; form: string; occurrence: number; lemma: string; tag: string }

function pickParseQ(pack: WordPack): ParseQ | null {
  for (let tries = 0; tries < 200; tries++) {
    const [loc, manual, forms, lem, tags] = pack.units[Math.floor(Math.random() * pack.units.length)];
    if (!manual) continue;                         // only hand-checked analyses
    const fs = forms.split(" ");
    const cands = fs.map((f, j) => ({ f, j, tag: pack.tags[tags[j]] })).filter(({ tag }) => /^[nal]/.test(tag) && "ngda".includes(tag[7]) && "sp".includes(tag[2]));
    if (!cands.length) continue;
    const { f, j, tag } = cands[Math.floor(Math.random() * cands.length)];
    const occurrence = fs.slice(0, j).filter((x) => x === f).length;
    // John is cited chapter.verse, which GLAUx gives as div_section "4.17"
    const si = pack.attrs.indexOf("div_section");
    const unitKey = si >= 0 ? loc[si] : loc[loc.length - 1];
    return { unitKey, form: f, occurrence, lemma: pack.lemmas[lem[j]], tag };
  }
  return null;
}

/** `once`: a single sentence with no Next button (the daily session moves on by itself). */
export function Parsing({ onScore, once = false }: { onScore: (ok: boolean) => void; once?: boolean }) {
  const WORK = "tlg0031.tlg004";          // the Gospel of John, hand-annotated (PROIEL) in GLAUx
  const [pack, setPack] = useState<WordPack | null>(null);
  const [round, setRound] = useState(0);
  const [state, setState] = useState<{ round: number; q: ParseQ | null; passage: LoadedPassage | null }>({ round: -1, q: null, passage: null });
  const [caseAns, setCaseAns] = useState<string | null>(null);
  const [numAns, setNumAns] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWordPack(WORK).then((p) => (p ? setPack(p) : setError("Word analyses are not available.")), (e: Error) => setError(e.message));
  }, []);

  // each round: pick a hand-checked word, then load its verse from the source file
  useEffect(() => {
    if (!pack) return;
    let live = true;
    const q = pickParseQ(pack);
    if (!q) return;
    loadPassage(WORK, q.unitKey).then(
      (passage) => { if (live) { setState({ round, q, passage }); setCaseAns(null); setNumAns(null); } },
      () => { if (live) setRound((r) => r + 1); },   // verse not found in this edition: try another
    );
    return () => { live = false; };
  }, [pack, round]);

  const q = state.round === round ? state.q : null;
  const passage = state.round === round ? state.passage : null;

  // highlight the word in the passage
  useEffect(() => {
    if (!passage || !q) return;
    const spans = [...document.querySelectorAll<HTMLElement>("[data-drill] [data-w]")].filter((s) => s.dataset.w!.normalize("NFC").replace(/[’'᾽]/g, "ʼ") === q.form);
    (spans[q.occurrence] ?? spans[0])?.setAttribute("data-quote", "1");
  }, [passage, q]);

  if (error) return <p className="muted">{error}</p>;
  if (!q || !passage) return <p className="muted">Finding a sentence…</p>;
  const rightCase = CASE_NAMES["ngda".indexOf(q.tag[7])];
  const rightNum = q.tag[2] === "s" ? "singular" : "plural";
  const parse = readTag(q.tag);
  return (
    <div className={styles.drill}>
      <div className={`${readerStyles.grc} ${styles.realGr}`} lang="grc" data-drill>
        {passage.rows.flatMap((r) => r.greek).map((u) => <div key={u.ref.join(".")}><Blocks blocks={u.blocks.filter((b) => b.t !== "head")} greek keyPrefix={`drill-${u.ref.join(".")}`} /></div>)}
      </div>
      <p className={styles.small}>Gospel of John {q.unitKey}</p>
      <p className={styles.drillQ}>Which case is <span lang="grc" className={styles.inlineGr}>{q.form}</span> here?</p>
      <div className={styles.options}>
        {CASE_NAMES.map((c) => (
          <button key={c} type="button" disabled={!!caseAns} className={caseAns ? (c === rightCase ? styles.right : c === caseAns ? styles.wrong : "") : ""}
            onClick={() => { setCaseAns(c); onScore(c === rightCase); if (c === rightCase) buzz("right"); }}>{c}</button>
        ))}
      </div>
      {caseAns && (
        <>
          <p className={styles.drillQ}>Singular or plural?</p>
          <div className={styles.options}>
            {["singular", "plural"].map((n) => (
              <button key={n} type="button" disabled={!!numAns} className={numAns ? (n === rightNum ? styles.right : n === numAns ? styles.wrong : "") : ""}
                onClick={() => { setNumAns(n); onScore(n === rightNum); if (n === rightNum) buzz("right"); }}>{n}</button>
            ))}
          </div>
        </>
      )}
      {numAns && (
        <div className={styles.drillFoot}>
          <p role="status"><span lang="grc" className={styles.inlineGr}>{q.form}</span>: {parse.pos}, {parse.detail}, from <span lang="grc" className={styles.inlineGr}>{q.lemma}</span>.
            <span className={styles.small}> Analysis checked by hand (PROIEL treebank, via GLAUx).</span></p>
          {!once && <button type="button" className="btn" onClick={() => setRound((r) => r + 1)}>Next sentence</button>}
        </div>
      )}
    </div>
  );
}

export default function Practice() {
  const [mode, setMode] = useState<"endings" | "parsing">("endings");
  const [score, setScore] = useState({ right: 0, total: 0 });
  const markActive = useAcademy((s) => s.markActive);   // any practice counts as a day of study
  const onScore = (ok: boolean) => {
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    if (score.total === 0) markActive();
  };
  return (
    <div className={styles.practice}>
      <div className={styles.tablesTools}>
        <div className={styles.seg} role="radiogroup" aria-label="Drill">
          <button type="button" role="radio" aria-checked={mode === "endings"} onClick={() => setMode("endings")}>Endings</button>
          <button type="button" role="radio" aria-checked={mode === "parsing"} onClick={() => setMode("parsing")}>Parse real sentences</button>
        </div>
        <span className={styles.small}>{score.total ? `${score.right} of ${score.total} right this session` : ""}</span>
      </div>
      {mode === "endings" ? <Endings key="e" onScore={onScore} /> : <Parsing key="p" onScore={onScore} />}
    </div>
  );
}
