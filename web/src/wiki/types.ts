/**
 * The Painted Stoa (wiki): what an entry is made of.
 *
 * Prose is written in a small markup (see markup.ts). Everything that must be checked against the
 * texts is structured: quotations (Greek copied from the corpus, translation copied from the
 * corpus's translation or marked as the site's own), citations, and secondary sources.
 * test: src/wiki/entries.test.ts (always) and CORPUS=1 … entries.corpus.test.ts (against the texts).
 */
export type Certainty = "well" | "debated" | "legend";

export const CERTAINTY: Record<Certainty, { label: string; cls: string; about: string }> = {
  well: { label: "Well established", cls: "well", about: "Scholars agree on this, from good evidence." },
  debated: { label: "Debated among scholars", cls: "debated", about: "The evidence allows more than one reading, and specialists disagree." },
  legend: { label: "Ancient tradition / legend", cls: "legend", about: "This is what ancient writers told; it may not be what happened." },
};

/** A place in the library: work id, reference (the start of a range), an optional end, and how it is cited. */
export interface Citation { work: string; ref: string; to?: string; label: string }

/** A quotation from the texts: the Greek exactly as in the edition, and a translation. */
export interface Quote {
  work: string;
  ref: string;
  grc: string;
  tr: string;
  /** "corpus": copied from the library's own translation of this work (checked); "site": this site's translation */
  trFrom: "corpus" | "site";
  trBy: string;             // "C. F. Smith (1921)", or "this site"
  label: string;            // "Thucydides 5.89"
}

/** A work of modern scholarship, in bibliography.ts. `checked` is where its details were verified. */
export interface Secondary {
  author: string;
  title: string;
  year: number;
  publisher: string;        // publisher (and place), or journal with volume and pages
  checked: string;          // the page the details were checked against (publisher, library catalogue)
}

export type CategoryId =
  | "people" | "democracy" | "education" | "daily" | "religion" | "beautiful" | "weird" | "strange" | "dark" | "archaeology" | "language";

export interface Entry {
  slug: string;
  title: string;
  greek?: string;
  category: CategoryId;
  /** one short line under the title */
  kicker: string;
  image?: string;           // an id in data/images.json
  /** the one-paragraph hook (inline markup) */
  hook: string;
  /** the body (block markup) */
  body: string;
  quotes?: Record<string, Quote>;
  timeline?: { when: string; what: string; certainty?: Certainty }[];
  /** "Read it yourself": the key passages, each with a line on why */
  readIt: (Citation & { why: string })[];
  related: string[];
  primary: Citation[];
  /** ids in bibliography.ts, each with an optional note on what it offers */
  secondary: { id: string; note?: string }[];
  /** Pleiades ids of places the entry is about (for the map) */
  places?: string[];
  written: string;          // YYYY-MM-DD
}

export interface Category { id: CategoryId; title: string; blurb: string; href?: string }

export const CATEGORIES: Category[] = [
  { id: "people", title: "People and power", blurb: "Kings, tyrants, generals and the women the sources could not ignore." },
  { id: "democracy", title: "Democracy", blurb: "How Athens ruled itself: the Assembly, the lot, the courts, ostracism, and its failures." },
  { id: "education", title: "Education", blurb: "Learning to read, to fight, to argue: from the schoolroom to the Academy." },
  { id: "daily", title: "Daily life", blurb: "Food, wine, clothes, houses, money, medicine, sport and the theatre." },
  { id: "religion", title: "Religion and belief", blurb: "The gods as the Greeks worshipped them: sacrifice, oracles, mysteries, magic and the dead." },
  { id: "beautiful", title: "The beautiful", blurb: "Poetry, painted statues, vases and the passages worth learning Greek for." },
  { id: "weird", title: "The weird", blurb: "Marvels, taboos, odd lives and odder deaths, and what is likely true." },
  { id: "strange", title: "The strange", blurb: "Unsolved mysteries, lost wonders and the things archaeology cannot yet explain." },
  { id: "dark", title: "The dark side", blurb: "Slavery, war, plague and cruelty, told factually, without sensation and without apology." },
  { id: "archaeology", title: "Archaeology", blurb: "How we know: excavation, dating, pottery, great sites and finds, and the problems.", href: "/stoa/kerameikos" },
  { id: "language", title: "Language", blurb: "Where Greek came from, how it was written, and what became of it." },
];
