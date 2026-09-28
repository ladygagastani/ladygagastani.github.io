/**
 * How hard the Greek of each text is to begin with, measured, not guessed: the share of a text's running
 * words that belong to the ~500 commonest words (the Dickinson College Commentaries core list), counted
 * over the GLAUx analysis of the text. A text whose words are mostly the commonest ones can be read by
 * a beginner with a small vocabulary; a text full of rare words cannot. It says nothing about syntax,
 * dialect or ideas, and the site says so wherever it shows the rating.
 *
 *   npx tsx scripts/build-difficulty.ts   (needs public/data/words, built by pipeline/build_words.py)
 * Writes public/data/difficulty.json: { works: { "tlg0012.tlg001": [words counted, share in ‰], … } }.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fold } from "../src/lib/catalog";

const core = new Set(Object.keys(JSON.parse(readFileSync("public/data/core.json", "utf8")).words as Record<string, unknown>).map(fold));
const works: Record<string, [number, number]> = {};
for (const f of readdirSync("public/data/words").filter((f) => /^tlg\d+\.tlg\d+\.json$/.test(f)).sort()) {
  const pack = JSON.parse(readFileSync(`public/data/words/${f}`, "utf8")) as { lemmas: string[]; tags: string[]; units: [unknown, unknown, unknown, number[], number[]][] };
  const inCore = pack.lemmas.map((l) => core.has(fold(l)));
  let total = 0, hit = 0;
  for (const [, , , lem, tags] of pack.units) lem.forEach((l, j) => {
    if (pack.tags[tags[j]].startsWith("u")) return;   // punctuation
    total++;
    if (inCore[l]) hit++;
  });
  if (total > 0) works[f.replace(".json", "")] = [total, Math.round((hit / total) * 1000)];
}
const out = { source: "GLAUx word packs and the DCC core vocabulary", core: core.size, works };
writeFileSync("public/data/difficulty.json", JSON.stringify(out) + "\n");
console.log(Object.keys(works).length, "works;", core.size, "core words");
