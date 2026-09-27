"use client";
/**
 * "Did you know?": a few findings, each worked out live from the Census's own counts when the page
 * opens, so the words and the numbers can never drift apart. Each opens its ranking.
 */
import { useEffect, useState } from "react";
import { EMPTY_SCOPE, groupInfo, groupOf, loadGroup, type Category, type CensusMeta, type Scope } from "@/lib/census";
import { transliterate } from "@/lib/translit";
import { fmt } from "./shared";
import styles from "./Census.module.css";

/** Which ranking each finding reads, by the index of the kind of writing in the library's filters. */
const ASK: { c: string; scope: Scope }[] = [
  { c: "god", scope: { ...EMPTY_SCOPE, a: "tlg0012", w: "tlg0012.tlg001" } },      // the Iliad
  { c: "place", scope: { ...EMPTY_SCOPE, a: "tlg0016" } },                          // Herodotus
  { c: "phrase", scope: { ...EMPTY_SCOPE, f: 5 } },                                 // oratory
  { c: "obj:animals", scope: { ...EMPTY_SCOPE, a: "tlg0012", w: "tlg0012.tlg002" } }, // the Odyssey
  { c: "person", scope: { ...EMPTY_SCOPE, f: 4 } },                                 // philosophy
  { c: "obj:food", scope: { ...EMPTY_SCOPE, f: 7 } },                               // medicine
];

interface Fact { c: string; scope: Scope; where: string; one: string; first: [string, number]; second?: [string, number] }

export default function Facts({ meta, cats, onOpen }: { meta: CensusMeta; cats: Category[]; onOpen: (c: string, s: Scope) => void }) {
  const [facts, setFacts] = useState<Fact[] | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all(ASK.map(async ({ c, scope }) => {
      const g = groupOf(scope);
      const rows = (await loadGroup(g).catch(() => null))?.[c];
      const cat = cats.find((x) => x.id === c);
      if (!rows?.length || !cat) return null;
      return { c, scope, where: groupInfo(meta, g).label, one: cat.one, first: [rows[0][0], rows[0][1]], second: rows[1] ? [rows[1][0], rows[1][1]] : undefined } as Fact;
    })).then((fs) => { if (live) setFacts(fs.filter((f): f is Fact => !!f)); });
    return () => { live = false; };
  }, [meta, cats]);
  if (!facts?.length) return null;
  return (
    <section className={styles.facts} aria-labelledby="facts-h">
      <h2 id="facts-h">Did you know?</h2>
      <p className={styles.blurb}>Worked out from the counts as the page opens. Each opens its ranking.</p>
      <ul>
        {facts.map((f, i) => (
          <li key={i} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" onClick={() => onOpen(f.c, f.scope)}>
              <span className="label">{f.where}</span>
              <span className={styles.factText}>
                The most mentioned {f.one} is <b lang="grc">{f.first[0]}</b> <i>({transliterate(f.first[0])})</i>, {fmt(f.first[1])} times
                {f.second && <>, ahead of <span lang="grc">{f.second[0]}</span> with {fmt(f.second[1])}</>}.
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
