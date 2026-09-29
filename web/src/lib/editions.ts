/**
 * The Wiki's "Editions & translations": every text in the catalogue (a Greek edition, a translation or a
 * commentary) with the printed source its description names, grouped by publisher. The descriptions are
 * the collections' own (TEI headers of Perseus and First1KGreek) and are shown as they are; only the
 * grouping is done here, by publisher names found in them.
 */
import { versionOf, type Catalog, type CatText } from "./catalog";

/** Publisher groups in the order they are tried. `pattern` is matched against the description. */
export const PUBLISHERS: { id: string; name: string; pattern: RegExp }[] = [
  { id: "loeb", name: "William Heinemann and Harvard University Press (the Loeb Classical Library's publishers)", pattern: /Heinemann|Heinmann|Harvard University Press/i },
  { id: "teubner", name: "Teubner (Leipzig)", pattern: /Teubner|Teuber/i },
  { id: "oxford", name: "Oxford: Clarendon Press and Oxford University Press", pattern: /Clarendon|Oxford University Pres|Oxford: /i },
  { id: "reimer", name: "Reimer (Berlin)", pattern: /Reimer/i },
  { id: "knobloch", name: "Knobloch (Leipzig)", pattern: /K?nobloch|Cnobloch/i },
  { id: "didot", name: "Firmin Didot (Paris)", pattern: /Didot/i },
  { id: "cambridge", name: "Cambridge University Press", pattern: /Cambridge University Press|Cambridge, UK|Cambridge: C/i },
  { id: "hinrichs", name: "Hinrichs (Leipzig)", pattern: /Hinrichs/i },
  { id: "bailliere", name: "Baillière (Paris)", pattern: /Bailli/i },
  { id: "hakkert", name: "Hakkert (Amsterdam)", pattern: /Hakkert/i },
  { id: "weidmann", name: "Weidmann (Berlin)", pattern: /Weidmann/i },
  { id: "belleslettres", name: "Les Belles Lettres (Paris)", pattern: /Belles Lettres/i },
  { id: "harper", name: "Harper and Brothers (New York)", pattern: /Harper/i },
  { id: "littlebrown", name: "Little, Brown (Boston)", pattern: /Little,? Brown|Boston: Little/i },
  { id: "bohn", name: "Henry G. Bohn (London)", pattern: /Henry G|Bohn/i },
  { id: "bell", name: "George Bell and Sons (London)", pattern: /George Bell/i },
  { id: "wood", name: "William Wood and Company (New York)", pattern: /William Wood/i },
  { id: "macmillan", name: "Macmillan (London)", pattern: /Macmillan and Co/i },
];
export const OTHER = { id: "other", name: "Other publishers and sources" };

export interface EditionRow {
  work: string; title: string; author: string;
  text: CatText; version: string;
  group: string;
  /** the link that opens this very text in the reader */
  href: string;
}

export function publisherOf(desc: string | null): string {
  if (!desc) return OTHER.id;
  return PUBLISHERS.find((p) => p.pattern.test(desc))?.id ?? OTHER.id;
}

export function editionRows(catalog: Catalog): EditionRow[] {
  const out: EditionRow[] = [];
  for (const a of catalog.authors) for (const w of a.works) for (const t of w.texts) {
    const version = versionOf(t.urn);
    out.push({
      work: w.id, title: w.title, author: a.name, text: t, version, group: publisherOf(t.desc),
      href: `/read?w=${w.id}&${t.kind === "translation" ? "tr" : "ed"}=${encodeURIComponent(version)}`,
    });
  }
  return out;
}

/** The groups that hold at least one of the given rows, biggest first, "other" last. */
export function groupsOf(rows: EditionRow[]): { id: string; name: string; rows: EditionRow[] }[] {
  const by = new Map<string, EditionRow[]>();
  for (const r of rows) by.set(r.group, [...(by.get(r.group) ?? []), r]);
  const name = (id: string) => (id === OTHER.id ? OTHER.name : PUBLISHERS.find((p) => p.id === id)!.name);
  return [...by].map(([id, rs]) => ({ id, name: name(id), rows: rs }))
    .sort((a, b) => (a.id === OTHER.id ? 1 : b.id === OTHER.id ? -1 : b.rows.length - a.rows.length));
}
