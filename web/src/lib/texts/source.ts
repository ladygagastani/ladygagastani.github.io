/** Get a text's XML from the best available place: local copies first, then GitHub. */
import { rawUrl, type CatalogIndex, type CatText } from "@/lib/catalog";
import { readLocal, type Origin } from "./local";

export type From = Origin | "github";

export class TextUnavailable extends Error {}

const memory = new Map<string, { xml: string; from: From }>();

export async function getXml(idx: CatalogIndex, t: CatText): Promise<{ xml: string; from: From }> {
  const hit = memory.get(t.urn);
  if (hit) return hit;
  const local = await readLocal(idx, t).catch(() => null);
  if (local) return remember(t, local);
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new TextUnavailable("You are offline and this text is not in your downloaded library.");
  }
  let res: Response;
  try { res = await fetch(rawUrl(idx, t)); }
  catch { throw new TextUnavailable("GitHub could not be reached. Check your connection, or read from a downloaded copy."); }
  if (!res.ok) throw new TextUnavailable(`GitHub answered ${res.status} for this file.`);
  return remember(t, { xml: await res.text(), from: "github" });
}

function remember(t: CatText, v: { xml: string; from: From }) {
  if (memory.size > 12) memory.delete(memory.keys().next().value!);
  memory.set(t.urn, v);
  return v;
}
