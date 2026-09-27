/**
 * Check the site's scanner (src/lib/metre) against David Chamberlain's published scansions
 * (hypotactic.com, CC BY 4.0; downloaded by pipeline/fetch_hypotactic.py).
 *
 *   npx tsx scripts/check-metre.ts            summary by metre and by work
 *   npx tsx scripts/check-metre.ts errors 40  also list up to 40 disagreements per metre
 *
 * For every line in a metre the scanner knows, it scans Hypotactic's own words and compares the
 * long and short syllables (the last syllable of a line is free and not compared). Lines with
 * editorial additions or deletions are skipped. Writes pipeline/.cache/metre-check.json.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GREEK_WORD, isGreekWord } from "../src/lib/greek";
import { scanWords, type MetreId } from "../src/lib/metre/scan";

const DIR = "../pipeline/.cache/hypotactic";
const METRES: Record<string, MetreId> = { hexameter: "hexameter", pentameter: "pentameter", ia6: "trimeter", ia6g: "trimeter" };

export interface HLine { file: string; n: string; metre: string; words: string[]; q: string; skip: boolean }

const unescape = (s: string) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function readHypotactic(file: string): HLine[] {
  const html = readFileSync(join(DIR, file), "utf8");
  const out: HLine[] = [];
  for (const m of html.matchAll(/<div class="line[^"]*" data-metre="([^"]*)" data-number="([^"]*)"[^>]*>([\s\S]*?)<\/div>/g)) {
    const [, metre, n, body] = m;
    let q = "", text = "", skip = false;
    for (const w of body.split(/<span class="word"[^>]*>/).slice(1)) {
      for (const sy of w.matchAll(/<span class="syll ([^"]*)"[^>]*>([^<]*)<\/span>/g)) {
        const cls = sy[1].split(" ");
        if (cls.includes("added") || cls.includes("deleted")) skip = true;
        q += cls.includes("long") ? "L" : cls.includes("short") ? "S" : "?";
        text += unescape(sy[2]);
      }
      text += " ";
    }
    const words = text.split(GREEK_WORD).filter((p) => p && isGreekWord(p));
    out.push({ file, n, metre, words, q, skip: skip || q.includes("?") || /[†\[\]<>]/.test(text) });
  }
  return out;
}

/** The same lengths, except the last syllable (free) and places we mark as unknown (X). */
export const agrees = (ours: string, theirs: string) =>
  ours.length === theirs.length && [...ours.slice(0, -1)].every((c, i) => c === "X" || c === theirs[i]);

if (process.argv[1]?.endsWith("check-metre.ts")) {
  const showErrors = process.argv[2] === "errors" ? Number(process.argv[3] ?? 30) : 0;
  const files = readdirSync(DIR).filter((f) => f.endsWith(".html") && !f.startsWith("_"));
  type Tally = { lines: number; fit: number; sure: number; right: number; wrongSure: number; unsureRightFirst: number };
  const blank = (): Tally => ({ lines: 0, fit: 0, sure: 0, right: 0, wrongSure: 0, unsureRightFirst: 0 });
  const byMetre = new Map<MetreId, Tally>(), byWork = new Map<string, Tally>();
  const errors = new Map<MetreId, string[]>();
  const t0 = performance.now();
  for (const f of files) {
    const work = f.replace(/\d+\.html$|\.html$/, "");
    for (const l of readHypotactic(f)) {
      const metre = METRES[l.metre];
      if (!metre || l.skip) continue;
      const s = scanWords(l.words, metre);
      const ours = s.syllables.map((x) => x.q).join("");
      const same = agrees(ours, l.q);
      for (const t of [byMetre.get(metre) ?? blank(), byWork.get(`${work} (${metre})`) ?? blank()]) {
        t.lines++;
        if (s.readings > 0) t.fit++;
        if (s.sure) { t.sure++; if (same) t.right++; else t.wrongSure++; }
        else if (s.readings > 0 && same) t.unsureRightFirst++;
      }
      if (!byMetre.has(metre)) byMetre.set(metre, blank());
      if (!byWork.has(`${work} (${metre})`)) byWork.set(`${work} (${metre})`, blank());
      if (s.sure && !same) {
        const e = errors.get(metre) ?? [];
        if (e.length < showErrors) e.push(`${f} ${l.n}: ${l.words.join(" ")}\n   hypotactic ${l.q}\n   ours       ${ours}  ${s.syllables.filter((x) => x.licence).map((x) => x.licence).join(",")}`);
        errors.set(metre, e);
      }
    }
  }
  // (the tallies were created lazily above; recount cleanly)
  const pct = (a: number, b: number) => (b ? ((100 * a) / b).toFixed(1) : "–");
  const row = (name: string, t: Tally) => `${name.padEnd(34)} ${String(t.lines).padStart(6)}  fits ${pct(t.fit, t.lines).padStart(5)}%  scanned ${pct(t.sure, t.lines).padStart(5)}%  right when scanned ${pct(t.right, t.sure).padStart(5)}%  (${t.wrongSure} wrong)`;
  console.log(`Checked in ${((performance.now() - t0) / 1000).toFixed(1)} s\n`);
  for (const [m, t] of byMetre) console.log(row(m, t));
  console.log("");
  for (const [w, t] of [...byWork].sort((a, b) => b[1].lines - a[1].lines)) if (t.lines >= 200) console.log(row(w, t));
  for (const [m, e] of errors) if (e.length) console.log(`\n--- ${m}: disagreements on lines the scanner was sure of\n${e.join("\n")}`);
  writeFileSync("../pipeline/.cache/metre-check.json", JSON.stringify({ byMetre: Object.fromEntries(byMetre), byWork: Object.fromEntries(byWork) }, null, 1));
}
