/// <reference lib="webworker" />
/** Parses TEI off the main thread so the page stays smooth, even for large texts. */
import { parseTei } from "./parse";
import { placePieces, translationPieces } from "./align";

export interface ParseRequest { id: number; grc: string; tr?: string | null }

self.onmessage = (e: MessageEvent<ParseRequest>) => {
  const { id, grc, tr } = e.data;
  try {
    const doc = parseTei(grc);
    let placed = null, trLevels = null;
    if (tr) {
      const t = parseTei(tr);
      placed = placePieces(doc, translationPieces(doc, t));
      trLevels = t.levels;
    }
    (self as unknown as Worker).postMessage({ id, doc, placed, trLevels });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: (err as Error).message });
  }
};
