/**
 * What search engines and link previews read: the site's address, and titles and descriptions for
 * authors and works. Every sentence is built from data the site holds (catalogue, GLAUx, Wikidata);
 * nothing is written about an author or a work that a source does not give.
 */
import { SITE } from "@/config/areas";

export const SITE_URL = "https://mathesisstoicheion.github.io";
export const absolute = (path: string) => new URL(path, SITE_URL).toString();
/**
 * A work's page address. The catalogue's id has a dot ("tlg0012.tlg001"); in the address it is a dash
 * ("/work/tlg0012-tlg001"), so no host can mistake the end of it for a file extension.
 */
export const workPath = (id: string) => `/work/${id.replace(".", "-")}`;
export const workIdOf = (slug: string) => slug.replace("-", ".");

export const SHARE_IMAGE = { url: "/og-card.png", width: 1200, height: 630, alt: `${SITE.latin}: ${SITE.tagline}` };

const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-GB")} ${n === 1 ? one : many}`;
const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);
const upFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface AuthorFacts {
  name: string;
  /** Wikidata's one-line description */
  desc?: string;
  /** "5th c. BC" */
  lived?: string | null;
  works: number;
  english: number;
}

/** "Sophocles: Ancient Greek playwright (5th c. BC). 8 works in the library, all with an English translation…" */
export function authorDescription(a: AuthorFacts): string {
  const who = a.desc ? `${upFirst(a.desc.replace(/\.$/, ""))}${a.lived ? ` (${a.lived})` : ""}` : a.lived ? `Greek author of the ${a.lived}` : "Author in the Greek library";
  const have = a.english === 0 ? `${plural(a.works, "work")} in the library, in Greek`
    : a.english === a.works ? `${plural(a.works, "work")} in the library, each with an English translation beside the Greek`
    : `${plural(a.works, "work")} in the library, ${a.english.toLocaleString("en-GB")} with an English translation beside the Greek`;
  return `${a.name}: ${sentence(who)} ${sentence(have)} Read online, with every word one click from a dictionary.`;
}

export interface WorkFacts {
  title: string;
  author: string;
  greekTitle?: string | null;
  hasTranslation: boolean;
  genre?: string | null;
  dialect?: string | null;
  when?: string | null;
}

export const workTitle = (w: Pick<WorkFacts, "title" | "author">) => `${w.title}, ${w.author}`;

/** "Read Homer's Iliad in Ancient Greek with an English translation beside it. Epic poetry · Ionic/Epic · 9th–8th c. BC…" */
export function workDescription(w: WorkFacts): string {
  const read = w.hasTranslation
    ? `Read ${w.author}: ${w.title}${w.greekTitle && w.greekTitle !== w.title ? ` (${w.greekTitle})` : ""} in Ancient Greek with an English translation beside it`
    : `Read the Greek text of ${w.author}: ${w.title}${w.greekTitle && w.greekTitle !== w.title ? ` (${w.greekTitle})` : ""}`;
  const facts = [w.genre, w.dialect, w.when].filter(Boolean).join(" · ");
  return `${read}, and look up any word. ${facts ? `${facts}. ` : ""}Free, with no adverts.`;
}

/** Pages that are a person's own or work from a query address: kept out of search results. */
export const NOINDEX = { robots: { index: false, follow: true } } as const;

/**
 * What each public page says about itself in search results. Written to be true of the page whatever the
 * data holds, so no number here can go out of date.
 */
export const PAGE_DESCRIPTIONS = {
  library: "Every Greek text in the Perseus and First1KGreek collections, by author and title, with English translations where they exist, each opening beside the Greek.",
  academy: "Learn to read Ancient Greek from the letters up: the alphabet with stroke order and sound, short lessons with real sentences from the texts, tables of forms, vocabulary and a daily review.",
  alphabet: "The Greek alphabet, letter by letter: how each is written stroke by stroke, its name and its sound in three pronunciations, with example words.",
  tables: "Greek noun, article and verb forms in tables, with the endings highlighted and how often each form is found in real texts.",
  vocabulary: "The commonest Greek words with short definitions, and how much of each text in the library you could read by knowing them.",
  practice: "Practise Greek endings and parse real words from the Gospel of John, using tables and analyses checked by scholars.",
  stoa: "The Painted Stoa, the wiki: entries on Greek history, daily life, religion and archaeology, each saying how sure we can be, with reference pages for authors, eras and editions.",
  authors: "Every author in the library by period and kind of writing, with dates and birthplaces from Wikidata, each opening their works in Greek and English.",
  eras: "Two thousand years of Greek writing: how many works the library holds from each century and each period, from Archaic to Byzantine.",
  editions: "The printed edition and translation behind every text in the library, as the collections describe it, grouped by publisher.",
  census: "Every word, person, god and place in the Greek texts, counted: what the library mentions most, and where.",
  periplus: "A map of the places named in the Greek texts.",
  kerameikos: "The Kerameikos, Athens' potters' quarter and its main cemetery, and what its excavated layers show.",
  townHall: "The community's meeting place: questions from beginners, help with a passage, and discussion of the texts.",
  pnyx: "Weekly debates on the ancient world: argue a motion, then vote on it.",
  downloads: "Download the Greek and English text collections once and read without a connection.",
  about: "Why each part of the site has the name it has, from the Greek words and places it borrows.",
  credits: "The sources, licences and thanks behind the site, and what it stores on your device.",
} as const;
