/**
 * Fetch the Painted Stoa's pictures from open collections, with their credits, into
 * public/images/<id>.jpg and src/data/images.json (read by src/wiki/images.ts).
 *
 * Every picture comes from a record that states its licence: The Metropolitan Museum of Art's Open
 * Access objects (CC0, checked by the API's isPublicDomain flag) or Wikimedia Commons files (the
 * licence is read from the file's own record, and only public domain, CC0, CC BY and CC BY-SA are
 * accepted). The chosen pictures are listed in scripts/images.list.json.
 *
 *   npx tsx scripts/fetch-images.ts search <words>          Met objects with open images
 *   npx tsx scripts/fetch-images.ts info met <objectID>     one Met record
 *   npx tsx scripts/fetch-images.ts info commons "<File>"   one Commons record
 *   npx tsx scripts/fetch-images.ts                         fetch everything in the list
 *   npx tsx scripts/fetch-images.ts sizes                   (re)make the smaller copies of every picture
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { SIZES, type ImageCredit } from "../src/wiki/images";

const UA = { "User-Agent": "MathesisStoicheion/1.0 (non-commercial educational site; image credits pipeline)" };
const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const WIDTH = 1600;

interface ListItem { id: string; src: string; alt: string; title?: string; date?: string; place?: string; creator?: string }

const get = async (url: string) => {
  for (let a = 0; a < 4; a++) {
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r;
    if (r.status !== 429 && r.status < 500) throw new Error(`${r.status} ${url}`);
    await new Promise((s) => setTimeout(s, 10000 * (a + 1)));
  }
  throw new Error(`gave up on ${url}`);
};
const json = async (url: string) => (await get(url)).json();
const strip = (h = "") => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();

async function met(id: string) {
  const o = await json(`${MET}/objects/${id}`);
  if (!o.isPublicDomain || !o.primaryImage) throw new Error(`Met ${id} is not an Open Access (CC0) image`);
  return {
    url: o.primaryImage as string,
    credit: {
      title: o.title, date: o.objectDate, place: "The Metropolitan Museum of Art, New York" + (o.accessionNumber ? ` (${o.accessionNumber})` : ""),
      creator: o.artistDisplayName || "Unknown", licence: "CC0", licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      source: o.objectURL, sourceName: "The Metropolitan Museum of Art",
    },
    raw: { title: o.title, date: o.objectDate, culture: o.culture, period: o.period, artist: o.artistDisplayName, credit: o.creditLine, department: o.department },
  };
}

const OPEN = /^(public domain|pd\b|cc0|cc by(-sa)? [1-4]\.0|cc by(-sa)? 2\.5|cc by(-sa)? 3\.0)/i;
async function commons(file: string) {
  const q = `${COMMONS}?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=${WIDTH}&titles=${encodeURIComponent("File:" + file)}`;
  const d = await json(q);
  const page = Object.values(d.query.pages)[0] as { imageinfo?: { url: string; thumburl: string; descriptionurl: string; extmetadata: Record<string, { value: string }> }[] };
  const ii = page.imageinfo?.[0];
  if (!ii) throw new Error(`no Commons file ${file}`);
  const m = ii.extmetadata;
  const lic = strip(m.LicenseShortName?.value);
  if (!OPEN.test(lic)) throw new Error(`Commons ${file}: licence "${lic}" is not accepted`);
  return {
    url: ii.thumburl || ii.url,
    credit: {
      title: strip(m.ObjectName?.value) || file.replace(/\.\w+$/, ""), date: strip(m.DateTimeOriginal?.value), place: "",
      creator: strip(m.Artist?.value) || "Unknown", licence: lic, licenceUrl: m.LicenseUrl?.value || ii.descriptionurl,
      source: ii.descriptionurl, sourceName: "Wikimedia Commons",
    },
    raw: { description: strip(m.ImageDescription?.value).slice(0, 400), artist: strip(m.Artist?.value), credit: strip(m.Credit?.value), licence: lic, attribution: strip(m.Attribution?.value) },
  };
}

async function main() {
const [mode, a, b] = process.argv.slice(2);
if (mode === "search") {
  const words = process.argv.slice(3).join(" ");
  const r = await json(`${MET}/search?hasImages=true&q=${encodeURIComponent(words)}`);
  for (const id of (r.objectIDs ?? []).slice(0, 25)) {
    const o = await json(`${MET}/objects/${id}`);
    if (o.isPublicDomain) console.log(id, "|", o.title, "|", o.objectDate, "|", o.artistDisplayName, "|", o.accessionNumber);
  }
} else if (mode === "csearch") {
  const words = process.argv.slice(3).join(" ");
  const r = await json(`${COMMONS}?action=query&format=json&list=search&srnamespace=6&srlimit=20&srsearch=${encodeURIComponent(words)}`);
  for (const h of r.query.search) console.log(h.title.replace(/^File:/, ""));
} else if (mode === "info") {
  const x = a === "met" ? await met(b) : await commons(b);
  console.log(JSON.stringify({ ...x.credit, raw: x.raw, url: x.url }, null, 1));
} else if (mode === "sizes") {
  for (const file of Object.values(JSON.parse(readFileSync("src/data/images.json", "utf8")) as Record<string, ImageCredit>).map((x) => x.file)) {
    await smaller(file);
    console.log(file);
  }
} else {
  const list = JSON.parse(readFileSync("scripts/images.list.json", "utf8")) as ListItem[];
  const out: Record<string, ImageCredit> = {};
  mkdirSync("public/images", { recursive: true });
  for (const it of list) {
    const [kind, ref] = [it.src.slice(0, it.src.indexOf(":")), it.src.slice(it.src.indexOf(":") + 1)];
    const x = kind === "met" ? await met(ref) : await commons(ref);
    const file = `${it.id}.jpg`;
    if (!existsSync(`public/images/${file}`) || process.env.REFETCH) {
      const buf = Buffer.from(await (await get(x.url)).arrayBuffer());
      await sharp(buf).rotate().resize({ width: WIDTH, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(`public/images/${file}`);
    }
    await smaller(file);
    const meta = await sharp(`public/images/${file}`).metadata();
    out[it.id] = {
      file, width: meta.width!, height: meta.height!, alt: it.alt,
      ...x.credit,
      ...(it.title ? { title: it.title } : {}), ...(it.date ? { date: it.date } : {}), ...(it.place ? { place: it.place } : {}), ...(it.creator ? { creator: it.creator } : {}),
    } as ImageCredit;
    console.log(it.id, meta.width, meta.height, out[it.id].licence);
    await new Promise((r) => setTimeout(r, 3000)); // be gentle with the museums' servers
  }
  writeFileSync("src/data/images.json", JSON.stringify(out, null, 1) + "\n");
}
}
main();

/** Smaller copies for small screens and cards: public/images/w<width>/<file> (src/wiki/images.ts SIZES). */
async function smaller(file: string) {
  const { width } = await sharp(`public/images/${file}`).metadata();
  for (const w of SIZES) {
    if (width! <= w) continue;
    mkdirSync(`public/images/w${w}`, { recursive: true });
    await sharp(`public/images/${file}`).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true }).toFile(`public/images/w${w}/${file}`);
  }
}
