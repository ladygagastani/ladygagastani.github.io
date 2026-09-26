/** Main-thread side of the parsing worker. */
import type { Placed } from "./align";
import type { TeiDoc } from "./types";
import type { ParseRequest } from "./worker";

export interface Parsed { doc: TeiDoc; placed: Placed[] | null; trLevels: string[] | null }

let worker: Worker | null = null;
let seq = 0;
const waiting = new Map<number, { resolve: (p: Parsed) => void; reject: (e: Error) => void }>();

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ id: number; error?: string } & Parsed>) => {
      const w = waiting.get(e.data.id);
      if (!w) return;
      waiting.delete(e.data.id);
      if (e.data.error) w.reject(new Error(e.data.error));
      else w.resolve({ doc: e.data.doc, placed: e.data.placed, trLevels: e.data.trLevels });
    };
  }
  return worker;
}

export function parseInWorker(grc: string, tr?: string | null): Promise<Parsed> {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    waiting.set(id, { resolve, reject });
    getWorker().postMessage({ id, grc, tr } satisfies ParseRequest);
  });
}
