/** Metre data for the reader, from public/data/metre (built by scripts/build-metre.ts). */
import { setKnownLengths } from "./prosody";
import type { MetreIndex } from "./text";

const BASE = "/data/metre";
let indexP: Promise<MetreIndex> | null = null;
let lengthsP: Promise<void> | null = null;
const packs = new Map<string, Promise<Map<string, string>>>();

async function json<T>(url: string, empty: T): Promise<T> {
  const r = await fetch(url);
  if (r.status === 404) return empty;
  if (!r.ok) throw new Error(`metre data unavailable (${r.status})`);
  return r.json() as Promise<T>;
}

/** Which texts are verse, in which metre. */
export const metreIndex = () => (indexP ??= json<MetreIndex>(`${BASE}/_index.json`, { texts: {}, about: { accuracy: { lines: 0, hexameter: "", pentameter: "", trimeter: "" } } })
  .catch((e) => { indexP = null; throw e; }));

/** The published scansions of an edition's lines, by lineHash; empty when there are none. */
export function publishedFor(urn: string, has: boolean): Promise<Map<string, string>> {
  if (!has) return Promise.resolve(new Map());
  if (!packs.has(urn)) {
    packs.set(urn, json<Record<string, string>>(`${BASE}/${urn.replace(/^urn:cts:greekLit:/, "")}.json`, {})
      .then((o) => new Map(Object.entries(o)))
      .catch((e) => { packs.delete(urn); throw e; }));
  }
  return packs.get(urn)!;
}

/** The vowel lengths learned from published scansions, handed to the scanner once. */
export const loadLengths = () => (lengthsP ??= json<Record<string, string>>(`${BASE}/_lengths.json`, {})
  .then((o) => setKnownLengths(new Map(Object.entries(o))))
  .catch((e) => { lengthsP = null; throw e; }));
