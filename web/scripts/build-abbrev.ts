/**
 * Standard abbreviations for works ("Il.", "Hdt.", "S. Ant."), learnt from LSJ's own citations:
 * every citation in the dictionary carries both the printed abbreviation and the exact work it
 * points to. Kept only when an abbreviation points to one work nearly every time.
 *
 *   npx tsx scripts/build-abbrev.ts   (needs public/data/lsj, built by pipeline/build_lsj.py)
 * Writes public/data/abbrev.json: { "il": ["Il.", "tlg0012.tlg001", count], … } keyed by abbrevKey.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { abbrevKey } from "../src/lib/search/refs";

const DIR = "public/data/lsj";
const counts = new Map<string, Map<string, { label: string; n: number }>>();

function walk(x: unknown) {
  if (Array.isArray(x)) { x.forEach(walk); return; }
  if (!x || typeof x !== "object") return;
  const o = x as Record<string, unknown>;
  if (typeof o.c === "string" && typeof o.u === "string") {
    const m = /^urn:cts:greekLit:(tlg\d+\.tlg\d+)/.exec(o.u);
    // the abbreviation is the citation without its trailing reference ("S. Ant. 332" → "S. Ant.")
    const label = o.c.replace(/\s*[\d.:,;–-]+[a-e]?\s*$/, "").trim();
    if (m && /[A-Za-z]/.test(label)) {
      const k = abbrevKey(label);
      if (!counts.has(k)) counts.set(k, new Map());
      const byWork = counts.get(k)!;
      const c = byWork.get(m[1]) ?? { label, n: 0 };
      c.n++;
      byWork.set(m[1], c);
    }
  }
  for (const v of Object.values(o)) walk(v);
}

for (const f of readdirSync(DIR)) if (!f.startsWith("_")) walk(JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")));

const out: Record<string, [string, string, number]> = {};
for (const [k, byWork] of counts) {
  const all = [...byWork.entries()].sort((a, b) => b[1].n - a[1].n);
  const total = all.reduce((s, [, c]) => s + c.n, 0);
  const [work, top] = all[0];
  if (top.n >= 3 && top.n / total >= 0.9) out[k] = [top.label, work, top.n];
}
writeFileSync("public/data/abbrev.json", JSON.stringify(out));
console.log(`${Object.keys(out).length} abbreviations kept, of ${counts.size} seen`);
