/**
 * Read a ZIP of a collection (as GitHub offers it) and copy its text files into browser storage.
 * Only the central directory and the XML files under data/ are read; nothing is changed.
 */
import type { CatalogIndex } from "@/lib/catalog";
import { opfsWrite } from "./local";

interface Entry { name: string; method: number; csize: number; offset: number }

async function readEntries(file: File): Promise<Entry[]> {
  // the end-of-central-directory record sits in the last 64 KB + 22 bytes
  const tailStart = Math.max(0, file.size - 65557);
  const tail = new DataView(await file.slice(tailStart).arrayBuffer());
  let eocd = -1;
  for (let i = tail.byteLength - 22; i >= 0; i--) if (tail.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error("This file is not a ZIP archive.");
  const count = tail.getUint16(eocd + 10, true);
  const cdSize = tail.getUint32(eocd + 12, true);
  const cdOffset = tail.getUint32(eocd + 16, true);
  const cd = new DataView(await file.slice(cdOffset, cdOffset + cdSize).arrayBuffer());
  const dec = new TextDecoder();
  const out: Entry[] = [];
  let p = 0;
  for (let i = 0; i < count && p < cd.byteLength; i++) {
    if (cd.getUint32(p, true) !== 0x02014b50) break;
    const method = cd.getUint16(p + 10, true);
    const csize = cd.getUint32(p + 20, true);
    const nlen = cd.getUint16(p + 28, true), xlen = cd.getUint16(p + 30, true), clen = cd.getUint16(p + 32, true);
    const offset = cd.getUint32(p + 42, true);
    const name = dec.decode(new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nlen));
    out.push({ name, method, csize, offset });
    p += 46 + nlen + xlen + clen;
  }
  return out;
}

async function entryData(file: File, e: Entry): Promise<Blob> {
  const h = new DataView(await file.slice(e.offset, e.offset + 30).arrayBuffer());
  const start = e.offset + 30 + h.getUint16(26, true) + h.getUint16(28, true);
  const raw = file.slice(start, start + e.csize);
  if (e.method === 0) return raw;
  if (e.method !== 8) throw new Error(`unsupported compression in ${e.name}`);
  return new Response(raw.stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob();
}

/** Import one collection ZIP. Returns how many text files were copied, and which collection it was. */
export async function importZip(idx: CatalogIndex, file: File, onProgress: (done: number, total: number) => void) {
  const entries = (await readEntries(file)).filter((e) => /(^|\/)data\/.+\.xml$/.test(e.name) && !e.name.endsWith("__cts__.xml"));
  if (!entries.length) throw new Error("No text files were found in this ZIP. Choose the ZIP of Perseus canonical-greekLit or First1KGreek.");
  const top = entries[0].name.split("/")[0].toLowerCase();
  const col = Object.entries(idx.catalog.collections).find(([, c]) => top.startsWith(c.repo.toLowerCase()));
  if (!col) throw new Error("This ZIP is not one of the supported collections.");
  const repo = col[1].repo;
  let done = 0;
  for (const e of entries) {
    const path = e.name.slice(e.name.indexOf("data/"));
    await opfsWrite(repo, path, await entryData(file, e));
    onProgress(++done, entries.length);
  }
  return { files: done, repo };
}
