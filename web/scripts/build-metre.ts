/**
 * Metre data for the reader. For every Greek edition in the corpus (pipeline/.cache/corpus):
 * - decide whether it is verse, and in which metre (by scanning its lines, and from the published
 *   scansions where they cover it);
 * - write the published scansions (David Chamberlain, hypotactic.com, CC BY 4.0; downloaded by
 *   pipeline/fetch_hypotactic.py) of the lines whose words match this edition, keyed by lineHash;
 * - check the site's scanner against them on this edition's own words, and report.
 *
 *   npx tsx scripts/build-metre.ts
 *
 * Output: public/data/metre/_index.json ({ urn: TextMetre }) and public/data/metre/<urn>.json
 * ({ [lineHash]: "tag|LSSL…" }). Report: pipeline/.cache/metre-report.json.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, type Catalog } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import { fitLengths, scanWords } from "../src/lib/metre/scan";
import { setKnownLengths } from "../src/lib/metre/prosody";
import { formKey } from "../src/lib/greek";
import { blockWords, hypotacticMetre, lineHash, scanLine, SUNG_PARTS, type MetreAbout, type TextKind, type TextMetre } from "../src/lib/metre/text";
import { readHypotactic, agrees } from "./check-metre";

const CORPUS = "../pipeline/.cache/corpus";
const COMIC_AUTHORS = new Set(["tlg0019", "tlg0541"]);   // Aristophanes, Menander
const OUT = "public/data/metre";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

// ------------------------------------------------------------ the published scansions, by line
const published = new Map<string, string>();
for (const f of readdirSync("../pipeline/.cache/hypotactic").filter((f) => f.endsWith(".html") && !f.startsWith("_"))) {
  for (const l of readHypotactic(f)) {
    if (l.skip || l.words.length < 2 || /[?]/.test(l.q)) continue;
    const h = lineHash(l.words);
    if (!published.has(h)) published.set(h, `${l.metre}|${l.q}`);
  }
}
console.log(`${published.size.toLocaleString()} published lines`);

// ------------------------------------------------------------ vowel lengths learned from the published scansions
// For each α, ι, υ whose length the spelling does not show, in a syllable not long by position and
// with no licence at play, the published scansion shows its length. Kept when the evidence agrees.
const seen = new Map<string, number[][]>();   // form → per vowel [long, short]
for (const f of readdirSync("../pipeline/.cache/hypotactic").filter((f) => f.endsWith(".html") && !f.startsWith("_"))) {
  for (const l of readHypotactic(f)) {
    if (l.skip || l.words.length < 2) continue;
    const m = hypotacticMetre(l.metre);
    const s = m ? scanWords(l.words, m, l.q) : fitLengths(l.words, l.q, false);
    if (!s.readings) continue;
    s.syllables.forEach((x, i) => {
      if (i === s.syllables.length - 1 || x.nuclei.length !== 1 || x.licence) return;
      const k = x.nuclei[0], n = s.shape.nuclei[k];
      if (n.nature !== "A" || s.shape.after[k].weight >= 2) return;
      if (s.shape.after[k].weight === 0 && s.shape.after[k].toVowel) return;   // hiatus: length may be affected
      const word = s.shape.words[n.w];
      const ns = s.shape.nuclei.filter((y) => y.w === n.w);
      const key = formKey(word);
      const per = seen.get(key) ?? ns.map(() => [0, 0]);
      if (per.length !== ns.length) return;
      per[ns.indexOf(n)][x.q === "L" ? 0 : 1]++;
      seen.set(key, per);
    });
  }
}
const lengths = new Map<string, string>();
for (const [k, per] of seen) {
  const pat = per.map(([L, S]) => (L + S >= 2 && L >= 0.9 * (L + S) ? "L" : L + S >= 2 && S >= 0.9 * (L + S) ? "S" : L + S === 1 ? (L ? "L" : "S") : ".")).join("");
  if (/[LS]/.test(pat)) lengths.set(k, pat);
}
console.log(`${lengths.size.toLocaleString()} word forms with a known vowel length`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const index: Record<string, TextMetre> = {};
const usedForms = new Set<string>();
const report: { urn: string; title: string; kind: TextKind; lines: number; scanned: number; published: number; check?: TextMetre["check"] }[] = [];
const totals = { lines: 0, scanned: 0, published: 0, checked: 0, agree: 0, byMetre: {} as Record<string, { checked: number; agree: number; sure: number; lines: number }> };

for (const a of idx.catalog.authors) for (const w of a.works) for (const t of w.texts) {
  if (t.kind !== "edition" || t.lang !== "grc") continue;
  const file = join(CORPUS, t.col, t.path);
  if (!existsSync(file)) continue;
  let doc;
  try { doc = parseTei(readFileSync(file, "utf8")); } catch { continue; }
  const blocks = doc.units.flatMap((u) => u.blocks);
  const verse = blocks.filter((b) => b.t === "l").map((b) => ({ words: blockWords(b), part: b.t === "l" ? b.part : undefined })).filter((l) => l.words.length >= 3);
  const prose = blocks.filter((b) => b.t === "p").length;
  if (verse.length < 20 || verse.length < prose) continue;

  // which metre? the published tags where they cover the text; the scanner otherwise
  const pub = verse.map((l) => published.get(lineHash(l.words)));
  const hasPub = pub.filter(Boolean).length;
  const spoken = verse.filter((l) => !l.part || !SUNG_PARTS.has(l.part));
  const sample = spoken.filter((_, i) => i % Math.max(1, Math.floor(spoken.length / 400)) === 0);
  setKnownLengths(lengths);
  const rate = (m: "hexameter" | "pentameter" | "trimeter" | "comic") => sample.filter((l) => scanWords(l.words, m).sure).length / Math.max(1, sample.length);
  const hex = rate("hexameter"), pen = rate("pentameter"), tri = rate("trimeter");
  const comic = rate("comic");
  const tags = new Map<string, number>();
  for (const p of pub) if (p) { const m = p.split("|")[0]; tags.set(m, (tags.get(m) ?? 0) + 1); }
  const pubHex = (tags.get("hexameter") ?? 0), pubPen = (tags.get("pentameter") ?? 0), pubTri = (tags.get("ia6") ?? 0) + (tags.get("ia6g") ?? 0);
  let kind: TextKind | null = null;
  if (hasPub >= verse.length * 0.3 && hasPub >= 20) {
    kind = pubPen > hasPub * 0.2 ? "elegiac" : pubHex > hasPub * 0.8 ? "hexameter" : pubTri > hasPub * 0.3 ? "drama" : "lyric";
  } else if (hex >= 0.85 && pen < hex * 0.9) kind = "hexameter";
  else if (hex + pen >= 0.85 && pen >= 0.25 && hex >= 0.25) kind = "elegiac";
  // the comic poets, and texts where comedy's freer trimeter fits clearly more lines than tragedy's
  else if (COMIC_AUTHORS.has(a.id) && comic >= 0.3) kind = "comedy";
  else if (comic >= 0.6 && comic >= tri + 0.08) kind = "comedy";
  else if (tri >= 0.6) kind = "drama";
  else if (hex >= 0.85) kind = "hexameter";
  if (!kind) continue;

  // every line: published or scanned, and the scanner checked against the published
  let scanned = 0, npub = 0, checked = 0, agree = 0;
  const pack: Record<string, string> = {};
  verse.forEach((l, i) => {
    const p = pub[i];
    setKnownLengths(lengths);
    const r = scanLine(l.words, kind!, l.part, p);
    if (r.source === "published") { npub++; pack[lineHash(l.words)] = p!; }
    else for (const w of l.words) if (lengths.has(formKey(w))) usedForms.add(formKey(w));
    if (r.scan?.sure) scanned++;
    const m = p ? hypotacticMetre(p.split("|")[0]) : null;
    if (p && m) {
      // the check uses the scanner alone, without the lengths learned from these same scansions
      setKnownLengths(null);
      const s = scanWords(l.words, m);
      const t0 = (totals.byMetre[m] ??= { checked: 0, agree: 0, sure: 0, lines: 0 });
      t0.lines++;
      if (s.sure) {
        t0.sure++; t0.checked++; checked++;
        if (agrees(s.syllables.map((x) => x.q).join(""), p.split("|")[1])) { agree++; t0.agree++; }
      }
    }
  });
  const entry: TextMetre = { kind, lines: verse.length, scanned, published: npub, pack: npub > 0, ...(checked ? { check: { lines: checked, agree } } : {}) };
  index[t.urn] = entry;
  if (npub) writeFileSync(join(OUT, `${t.urn.replace(/^urn:cts:greekLit:/, "")}.json`), JSON.stringify(pack));
  report.push({ urn: t.urn, title: `${a.name}, ${w.title}`, kind, lines: verse.length, scanned, published: npub, check: entry.check });
  totals.lines += verse.length; totals.scanned += scanned; totals.published += npub; totals.checked += checked; totals.agree += agree;
}

const pc = (m: string) => { const t = totals.byMetre[m]; return t ? `${(Math.round((1000 * t.agree) / Math.max(1, t.checked)) / 10).toFixed(1)}%` : "–"; };
const about: MetreAbout = { accuracy: { lines: totals.checked, hexameter: pc("hexameter"), pentameter: pc("pentameter"), trimeter: pc("trimeter") } };
writeFileSync(join(OUT, "_index.json"), JSON.stringify({ texts: index, about }));
// the learned vowel lengths, for the words of lines that have no published scansion
writeFileSync(join(OUT, "_lengths.json"), JSON.stringify(Object.fromEntries([...usedForms].sort().map((f) => [f, lengths.get(f)!]))));
console.log(`${usedForms.size.toLocaleString()} word forms with known vowel lengths written for the reader`);
writeFileSync("../pipeline/.cache/metre-report.json", JSON.stringify({ totals, texts: report }, null, 1));
const pct = (a: number, b: number) => `${((100 * a) / Math.max(1, b)).toFixed(1)}%`;
console.log(`${report.length} verse texts, ${totals.lines.toLocaleString()} lines: ${pct(totals.scanned, totals.lines)} scanned, ${pct(totals.published, totals.lines)} from the published scansion`);
console.log(`Scanner vs published, on the site's own text: ${pct(totals.agree, totals.checked)} agree (${totals.checked.toLocaleString()} lines the scanner was sure of)`);
for (const [m, t] of Object.entries(totals.byMetre)) console.log(`  ${m}: sure on ${pct(t.sure, t.lines)} of ${t.lines.toLocaleString()} lines, agrees on ${pct(t.agree, t.checked)}`);
const kinds: Record<string, number> = {};
for (const r of report) kinds[r.kind] = (kinds[r.kind] ?? 0) + 1;
console.log(kinds);
for (const r of report.sort((a, b) => b.lines - a.lines).slice(0, 40)) console.log(`  ${r.kind.padEnd(9)} ${r.title.slice(0, 60).padEnd(60)} ${String(r.lines).padStart(6)} scanned ${pct(r.scanned, r.lines).padStart(6)} published ${pct(r.published, r.lines).padStart(6)}${r.check ? ` agree ${pct(r.check.agree, r.check.lines)}` : ""}`);
