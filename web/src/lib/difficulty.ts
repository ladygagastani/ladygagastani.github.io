/**
 * How much of a text's running words are among the commonest ~500 (scripts/build-difficulty.ts).
 * It measures vocabulary only: not syntax, dialect, or how hard the ideas are (Aristotle's words are
 * common; his arguments are not). Texts under 2,000 analysed words are too short to rate.
 */
let pending: Promise<Record<string, [number, number]>> | null = null;
export function loadDifficulty(): Promise<Record<string, [number, number]>> {
  pending ??= fetch("/data/difficulty.json").then((r) => (r.ok ? r.json() : { works: {} })).then((d) => d.works ?? {}).catch(() => ({}));
  return pending;
}

export const MIN_WORDS = 2000;

/** The share of common words, in whole percent, or null when the text is too short or not analysed. */
export const commonShare = (d: [number, number] | undefined): number | null => (d && d[0] >= MIN_WORDS ? Math.round(d[1] / 10) : null);

export const VOCAB_BANDS: [id: string, label: string, test: (pct: number) => boolean][] = [
  ["familiar", "Mostly familiar words (80% or more)", (p) => p >= 80],
  ["mixed", "A mix of familiar and rarer words (70–79%)", (p) => p >= 70 && p < 80],
  ["rare", "Many rarer words (under 70%)", (p) => p < 70],
];
