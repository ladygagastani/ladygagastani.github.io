/**
 * Echoes: where a word, phrase or sentence recurs.
 *
 * What counts as a match (the reader's panel explains the same rules):
 * - A word: the same form (see formKey), or any form of the same dictionary word.
 * - A phrase, "exact": the same forms in the same order, even across a line or section break.
 * - A phrase, "same words, other forms": the same dictionary words in the same order, with no
 *   word added or missing, at least one of them in a different form (ῥοδοδάκτυλος Ἠώς / ῥοδοδάκτυλον Ἠῶ).
 * - A phrase, "near": most of the phrase again, in the same order, in a stretch at most a quarter
 *   longer than the phrase. Rare words weigh more than common ones (each weighs log(words in the
 *   books searched ÷ how often it occurs)), so sharing καί and δέ counts for little. The share of
 *   the phrase's weight found again is the match's likeness; the reader chooses how much is enough.
 * Two words are "the same word" when they are forms of the same dictionary word (per GLAUx), or,
 * where GLAUx has no analysis, the same form.
 */
import type { Stream } from "./stream";

export type Kind = "exact" | "forms" | "near";

export interface Echo {
  s: number;          // which stream (book)
  from: number;       // first and last word of the match, positions in the stream
  to: number;
  hit: number[];      // positions of the words that match the query
  kind: Kind;
  likeness: number;   // 0..1, share of the query's weight found (1 for exact and forms)
  self: boolean;      // the query itself
}

export interface Query { s: number; from: number; to: number }

/** Phrases longer than this are matched exactly only (near-matching grows with the square of the length). */
export const NEAR_MAX_WORDS = 40;

/** Every occurrence of a single word: by form, or by dictionary word. */
export function wordEchoes(streams: Stream[], q: Query, by: "form" | "lemma"): Echo[] {
  const qs = streams[q.s];
  const f = qs.form[q.from], l = qs.lemma[q.from];
  if (by === "lemma" && l < 0) return [];
  const out: Echo[] = [];
  streams.forEach((s, si) => {
    const arr = by === "form" ? s.form : s.lemma, want = by === "form" ? f : l;
    for (let p = 0; p < arr.length; p++) {
      if (arr[p] !== want) continue;
      out.push({ s: si, from: p, to: p, hit: [p], kind: s.form[p] === f ? "exact" : "forms", likeness: 1, self: si === q.s && p === q.from });
    }
  });
  return out;
}

/** Exact repetitions of a phrase: the same forms, in order. */
export function exactEchoes(streams: Stream[], q: Query): Echo[] {
  const qs = streams[q.s];
  const qf = qs.form.subarray(q.from, q.to + 1);
  const n = qf.length, out: Echo[] = [];
  streams.forEach((s, si) => {
    for (let p = 0; p + n <= s.form.length; p++) {
      let j = 0;
      while (j < n && s.form[p + j] === qf[j]) j++;
      if (j < n) continue;
      out.push({ s: si, from: p, to: p + n - 1, hit: range(p, p + n - 1), kind: "exact", likeness: 1, self: si === q.s && p === q.from });
      p += n - 1;
    }
  });
  return out;
}

/**
 * Exact, same-words and near repetitions of a phrase whose likeness is at least `min` (0..1).
 * Returns the matches in reading order; overlapping candidates keep only the likeliest.
 */
export function phraseEchoes(streams: Stream[], q: Query, min: number): Echo[] {
  const qs = streams[q.s];
  const n = q.to - q.from + 1;
  if (n < 2 || n > NEAR_MAX_WORDS) return exactEchoes(streams, q);
  const qForm = Array.from(qs.form.subarray(q.from, q.to + 1));
  const qLem = Array.from(qs.lemma.subarray(q.from, q.to + 1));

  // which query words each form or dictionary word stands for
  const byForm = new Map<number, number[]>(), byLem = new Map<number, number[]>();
  const push = (m: Map<number, number[]>, k: number, j: number) => { const l = m.get(k); if (l) l.push(j); else m.set(k, [j]); };
  for (let j = 0; j < n; j++) { push(byForm, qForm[j], j); if (qLem[j] >= 0) push(byLem, qLem[j], j); }
  const matchesAt = (s: Stream, p: number, into: Set<number>) => {
    into.clear();
    for (const j of byForm.get(s.form[p]) ?? []) into.add(j);
    if (s.lemma[p] >= 0) for (const j of byLem.get(s.lemma[p]) ?? []) into.add(j);
    return into;
  };
  const same = (s: Stream, p: number, j: number) => s.form[p] === qForm[j] || (qLem[j] >= 0 && s.lemma[p] === qLem[j]);

  // weights: rare words count for more
  const df = new Float64Array(n);
  let total = 0;
  const J = new Set<number>();
  for (const s of streams) { total += s.form.length; for (let p = 0; p < s.form.length; p++) for (const j of matchesAt(s, p, J)) df[j]++; }
  const w = Array.from(df, (d) => Math.log((total + 1) / (d + 1)) + 0.05);
  const W = w.reduce((a, b) => a + b, 0);
  const need = Math.max(min, 1e-9) * W - 1e-9;
  const minWords = Math.min(n, 2);
  const width = n + Math.max(1, Math.floor(n / 4));

  const found: Echo[] = [];
  streams.forEach((s, si) => {
    const N = s.form.length;
    const cnt = new Int32Array(n);
    let have = 0, distinct = 0;
    const add = (p: number, d: 1 | -1) => {
      for (const j of matchesAt(s, p, J)) {
        cnt[j] += d;
        if (d === 1 && cnt[j] === 1) { have += w[j]; distinct++; }
        if (d === -1 && cnt[j] === 0) { have -= w[j]; distinct--; }
      }
    };
    for (let p = 0; p < Math.min(width, N); p++) add(p, 1);
    for (let a = 0; a < N; a++) {
      // window [a, a + width): could it hold enough of the phrase? And does a match start here?
      const starts = byForm.has(s.form[a]) || (s.lemma[a] >= 0 && byLem.has(s.lemma[a]));
      if (starts && have >= need && distinct >= minWords) {
        const e = align(s, a, Math.min(N, a + width), n, w, same);
        if (e && e.weight >= need && e.hit.length >= minWords) {
          const from = e.hit[0], to = e.hit[e.hit.length - 1];
          let kind: Kind = "near";
          if (e.hit.length === n && to - from === n - 1) kind = e.hit.every((p, j) => s.form[p] === qForm[j]) ? "exact" : "forms";
          found.push({ s: si, from, to, hit: e.hit, kind, likeness: kind === "near" ? e.weight / W : 1, self: si === q.s && from <= q.to && to >= q.from });
        }
      }
      add(a, -1);
      if (a + width < N) add(a + width, 1);
    }
  });
  return pickBest(found);
}

/** The best in-order matching of the query words to the words at [a, b), by weight. */
function align(s: Stream, a: number, b: number, n: number, w: number[], same: (s: Stream, p: number, j: number) => boolean) {
  const m = b - a;
  const T = new Float64Array((n + 1) * (m + 1));
  const at = (j: number, k: number) => j * (m + 1) + k;
  for (let j = 1; j <= n; j++) for (let k = 1; k <= m; k++) {
    let v = Math.max(T[at(j - 1, k)], T[at(j, k - 1)]);
    if (same(s, a + k - 1, j - 1)) v = Math.max(v, T[at(j - 1, k - 1)] + w[j - 1]);
    T[at(j, k)] = v;
  }
  const weight = T[at(n, m)];
  if (weight <= 0) return null;
  const hit: number[] = [];
  for (let j = n, k = m; j > 0 && k > 0;) {
    if (same(s, a + k - 1, j - 1) && T[at(j, k)] === T[at(j - 1, k - 1)] + w[j - 1]) { hit.push(a + k - 1); j--; k--; }
    else if (T[at(j, k)] === T[at(j - 1, k)]) j--;
    else k--;
  }
  return { weight, hit: hit.reverse() };
}

/** Of overlapping matches in the same book keep the likeliest (then the most words, then the tightest). */
function pickBest(es: Echo[]): Echo[] {
  const rank = (e: Echo) => [e.likeness, e.hit.length, -(e.to - e.from)];
  const better = (x: Echo, y: Echo) => { const a = rank(x), b = rank(y); for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i]; return x.from < y.from; };
  const sorted = [...es].sort((x, y) => (better(x, y) ? -1 : better(y, x) ? 1 : 0));
  const taken = new Map<number, Uint8Array>();
  const out: Echo[] = [];
  for (const e of sorted) {
    let t = taken.get(e.s);
    if (!t) taken.set(e.s, (t = new Uint8Array(e.to + 1 + 4096)));
    if (t.length <= e.to) { const u = new Uint8Array(e.to * 2 + 1); u.set(t); taken.set(e.s, (t = u)); }
    if (t.subarray(e.from, e.to + 1).some((x) => x)) continue;
    t.fill(1, e.from, e.to + 1);
    out.push(e);
  }
  return out.sort((x, y) => x.s - y.s || x.from - y.from);
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
