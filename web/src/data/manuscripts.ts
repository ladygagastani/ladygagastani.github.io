/**
 * Manuscripts the reader can show beside a text: famous medieval copies whose holding library (or a
 * scholarly project working with it) publishes photographs of every page through IIIF, the standard
 * way libraries share page images. The photographs are shown from the library's own server, with its
 * credit, and never copied here.
 *
 * RULE: every fact below (shelfmark, date, place, which pages hold which work) is taken from the
 * library's own catalogue record, linked in `record`. Nothing is written from memory. Page numbers are
 * folios: "119r" is the front (recto) of leaf 119, "119v" its back (verso). Where the catalogue names only
 * the leaf, the front is given, so a work that begins on the back is one page turn away. Openings looked
 * at on the photographs: the Iliad (12r), Electra (17r), Persians (119r), Seven against Thebes (169r),
 * Suppliants (179r).
 *
 * The pages of each manuscript (folio → the photograph's address on the library's image server) are
 * built by pipeline/build_manuscripts.py into public/data/manuscripts/<id>.json.
 */

export interface WorkInWitness {
  /** the folio where the work begins */
  from: string;
  /** where each book begins, keyed by the reader's first citation level ("1", "2"…) */
  books?: Record<string, string>;
  /** a line-by-line index of pages and places on the photograph (the Iliad in the Venetus A) */
  lines?: string;
}

export interface Witness {
  id: string;
  /** what scholars call it */
  name: string;
  shelfmark: string;
  date: string;
  place?: string;
  /** a sentence or two, from the sources in `record` and `sources` */
  about: string;
  /** the holding library's catalogue record */
  record: { label: string; url: string };
  /** further sources for `about` */
  sources?: { label: string; url: string }[];
  /** whose photographs, and on what terms */
  credit: string;
  terms: { label: string; url: string };
  /** the IIIF presentation manifest the page list was built from */
  manifest: string;
  works: Record<string, WorkInWitness>;
}

const FLORENCE_TERMS = { label: "Biblioteca Medicea Laurenziana: images for personal and non-commercial use, citing the source", url: "https://tecabml.contentdm.oclc.org/digital/collection/plutei" };
const GALLICA_TERMS = { label: "Gallica: free non-commercial reuse, crediting “Source gallica.bnf.fr / BnF”", url: "https://gallica.bnf.fr/edit/und/conditions-dutilisation-des-contenus-de-gallica" };

export const WITNESSES: Witness[] = [
  {
    id: "venetus-a",
    name: "Venetus A",
    shelfmark: "Venice, Biblioteca Nazionale Marciana, Marc. gr. Z. 454 (= 822)",
    date: "10th century",
    about: "The oldest complete text of the Iliad. The Homer Multitext project has photographed every page and recorded where each line of the poem is written, so the page opens at the line you are reading, marked on the photograph.",
    record: { label: "Homer Multitext project: the Venetus A", url: "https://www.homermultitext.org/manuscripts/venetusA/" },
    credit: "Photographs and line index: the Homer Multitext project, with the Biblioteca Nazionale Marciana",
    terms: { label: "Homer Multitext project: Creative Commons Attribution-NonCommercial", url: "https://www.homermultitext.org/" },
    manifest: "https://github.com/homermultitext/hmt-archive/blob/master/iiif/venetusA.json",
    works: { "tlg0012.tlg001": { from: "12r", lines: "/data/manuscripts/venetus-a-iliad.json" } },
  },
  {
    id: "laur-32-9",
    name: "The Medicean manuscript",
    shelfmark: "Florence, Biblioteca Medicea Laurenziana, Plut. 32.9",
    date: "10th century",
    about: "The main medieval copy of Aeschylus and Sophocles, with Apollonius' Argonautica. It holds all seven surviving plays of each; for Aeschylus' Libation Bearers and Suppliants it is the only independent witness. Editors call it M in Aeschylus and L in Sophocles.",
    record: { label: "Biblissima: Florence, Biblioteca Medicea Laurenziana, Plut. 32.9 (contents and folios)", url: "https://portail.biblissima.fr/en/ark:/43093/mdata09b34dedbb1800b415c285017f6e4215acd89842" },
    sources: [
      { label: "Teca digitale, Biblioteca Medicea Laurenziana: Plut. 32.9", url: "https://tecabml.contentdm.oclc.org/digital/collection/plutei/id/711140" },
      { label: "Roger Pearse, Notes on the transmission of Aeschylus (after T. G. Rosenmeyer)", url: "https://www.roger-pearse.com/weblog/2011/05/26/notes-on-the-transmission-of-aeschylus/" },
      { label: "Roger Pearse, Some manuscript traditions of the Greek classics (Sophocles)", url: "https://www.tertullian.org/rpearse/manuscripts/greek_classics.htm" },
    ],
    credit: "Photographs: Biblioteca Medicea Laurenziana, Florence (Teca digitale)",
    terms: FLORENCE_TERMS,
    manifest: "https://cdm21059.contentdm.oclc.org/iiif/plutei:711140/manifest.json",
    works: {
      "tlg0011.tlg003": { from: "1r" },     // Ajax
      "tlg0011.tlg005": { from: "17r" },    // Electra
      "tlg0011.tlg004": { from: "33v" },    // Oedipus the King
      "tlg0011.tlg002": { from: "49v" },    // Antigone
      "tlg0011.tlg001": { from: "64v" },    // Women of Trachis
      "tlg0011.tlg006": { from: "79v" },    // Philoctetes
      "tlg0011.tlg007": { from: "96r" },    // Oedipus at Colonus
      "tlg0085.tlg002": { from: "119r" },   // Persians
      "tlg0085.tlg005": { from: "131r" },   // Agamemnon
      "tlg0085.tlg006": { from: "136r" },   // Libation Bearers
      "tlg0085.tlg003": { from: "147v" },   // Prometheus Bound
      "tlg0085.tlg007": { from: "159r" },   // Eumenides
      "tlg0085.tlg004": { from: "169r" },   // Seven against Thebes
      "tlg0085.tlg001": { from: "179r" },   // Suppliants
      "tlg0001.tlg001": { from: "190r" },   // Argonautica
    },
  },
  {
    id: "paris-gr-1807",
    name: "Parisinus graecus 1807 (Plato A)",
    shelfmark: "Paris, Bibliothèque nationale de France, grec 1807",
    date: "850–875",
    place: "Constantinople",
    about: "Plato's last two groups of dialogues (the eighth and ninth tetralogies), copied in Constantinople in the third quarter of the ninth century. The text is written in minuscule, lower-case letters; the titles and the notes in the margins are in capitals.",
    record: { label: "BnF Archives et manuscrits: Grec 1807 (description and contents by folio)", url: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc19975p" },
    sources: [{ label: "Gallica: Platon (A), BnF grec 1807", url: "https://gallica.bnf.fr/ark:/12148/btv1b8419248n" }],
    credit: "Photographs: Source gallica.bnf.fr / Bibliothèque nationale de France",
    terms: GALLICA_TERMS,
    manifest: "https://gallica.bnf.fr/iiif/ark:/12148/btv1b8419248n/manifest.json",
    works: {
      "tlg0059.tlg029": { from: "1r" },     // Clitophon
      "tlg0059.tlg030": { from: "3r", books: { 1: "3r", 2: "14r", 3: "25r", 4: "37v", 5: "48v", 6: "61v", 7: "73r", 8: "83v", 9: "94r", 10: "103r" } },   // Republic
      "tlg0059.tlg031": { from: "114r" },   // Timaeus
      "tlg0059.tlg032": { from: "145r" },   // Critias
      "tlg0059.tlg033": { from: "151v" },   // Minos
      "tlg0059.tlg034": { from: "155r", books: { 1: "155r", 2: "165r", 3: "174r", 4: "184v", 5: "193r", 6: "202r", 7: "216r", 8: "232r", 9: "241v", 10: "256r", 11: "267r", 12: "279r" } },   // Laws
      "tlg0059.tlg035": { from: "291r" },   // Epinomis
      "tlg0059.tlg036": { from: "299v" },   // Letters
    },
  },
];

/** The manuscripts that hold a work. */
export const witnessesOf = (work: string) => WITNESSES.filter((w) => w.works[work]);

/** A manuscript's pages as built by the pipeline: [folio, IIIF image service] in the order of the book. */
export interface PageList { pages: [string, string][] }
/** The Iliad in the Venetus A: each line's page (index into `pages`) and its box on the photograph (fractions). */
export interface LineIndex { images: string; pages: [string, string][]; lines: Record<string, [number, number, number, number, number]> }

const cache = new Map<string, Promise<unknown>>();
function json<T>(url: string): Promise<T> {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); }).catch((e) => { cache.delete(url); throw e; }));
  return cache.get(url) as Promise<T>;
}

/** Every page of a manuscript, with the address of its photograph's IIIF image service. */
export async function pagesOf(w: Witness, work: string): Promise<{ folio: string; service: string }[]> {
  const lines = w.works[work]?.lines;
  if (lines) {
    const ix = await json<LineIndex>(lines);
    return ix.pages.map(([folio, id]) => ({ folio, service: ix.images.replace("{id}", id) }));
  }
  const pl = await json<PageList>(`/data/manuscripts/${w.id}.json`);
  return pl.pages.map(([folio, service]) => ({ folio, service }));
}

/** Where a line of the Iliad is in the Venetus A: its page and its box on the photograph. */
export async function lineIn(w: Witness, work: string, ref: string): Promise<{ folio: string; box: [number, number, number, number] } | null> {
  const lines = w.works[work]?.lines;
  if (!lines) return null;
  const ix = await json<LineIndex>(lines);
  const hit = ix.lines[ref];
  return hit ? { folio: ix.pages[hit[0]][0], box: [hit[1], hit[2], hit[3], hit[4]] } : null;
}
