/**
 * Every entry of the Painted Stoa. Add a new entry's module here (the order does not matter:
 * lists are sorted by title within each category).
 */
import type { CategoryId, Entry } from "./types";
import { CATEGORIES } from "./types";
import melos from "./entries/melos";

export const ENTRIES: Entry[] = [melos];

export const entryBySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
export const entriesIn = (c: CategoryId) => ENTRIES.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title));
export const categoryOf = (c: CategoryId) => CATEGORIES.find((x) => x.id === c)!;
