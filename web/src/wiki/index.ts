/**
 * Every entry of the Painted Stoa. Add a new entry's module here (the order does not matter:
 * lists are sorted by title within each category).
 */
import type { CategoryId, Entry } from "./types";
import { CATEGORIES } from "./types";
import melos from "./entries/melos";
import ostracism from "./entries/ostracism";
import laurion from "./entries/laurion";
import linearB from "./entries/linear-b";
import plague from "./entries/plague";
import mytilene from "./entries/mytilene";
import helots from "./entries/helots";
import diogenes from "./entries/diogenes";
import delphi from "./entries/delphi";
import paintedStatues from "./entries/painted-statues";
import antikythera from "./entries/antikythera";
import kerameikos from "./entries/kerameikos";
import blackAndRedFigure from "./entries/black-and-red-figure";
import pericles from "./entries/pericles";
import hipparchia from "./entries/hipparchia";
import school from "./entries/school";
import spartanUpbringing from "./entries/spartan-upbringing";
import symposium from "./entries/symposium";
import olympicGames from "./entries/olympic-games";

export const ENTRIES: Entry[] = [melos, ostracism, laurion, linearB, plague, mytilene, helots, diogenes, delphi, paintedStatues, antikythera, kerameikos, blackAndRedFigure, pericles, hipparchia, school, spartanUpbringing, symposium, olympicGames];

export const entryBySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
export const entriesIn = (c: CategoryId) => ENTRIES.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title));
export const categoryOf = (c: CategoryId) => CATEGORIES.find((x) => x.id === c)!;
