"use client";
/**
 * The Wiki's Editions & translations page: every text in the library with the printed source its
 * description names, grouped by publisher (lib/editions.ts). The descriptions are the collections' own,
 * shown unchanged; each row opens that very text in the reader.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadCatalog, fold, type CatalogIndex } from "@/lib/catalog";
import { editionRows, groupsOf, type EditionRow } from "@/lib/editions";
import styles from "./WikiEditions.module.css";
import idx from "./WikiIndex.module.css";

type Kind = "" | "edition" | "translation" | "commentary";
const KINDS: [Kind, string][] = [["", "All"], ["edition", "Greek editions"], ["translation", "Translations"], ["commentary", "Commentaries"]];
const FIRST = 40;
const num = (n: number) => n.toLocaleString("en-GB");
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export default function WikiEditions() {
  const [cat, setCat] = useState<CatalogIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind>("");
  const [all, setAll] = useState<Set<string>>(new Set());
  useEffect(() => { loadCatalog().then(setCat, () => setFailed(true)); }, []);

  const rows = useMemo<EditionRow[]>(() => (cat ? editionRows(cat.catalog) : []), [cat]);
  const haystack = useMemo(() => rows.map((r) => fold(`${r.author} ${r.title} ${r.text.desc ?? ""} ${r.text.label ?? ""}`)), [rows]);
  const query = fold(q.trim());
  const terms = query.split(/\s+/).filter(Boolean);
  const matches = (i: number) => terms.every((t) => haystack[i].includes(t));
  const kindCount = (k: Kind) => rows.filter((r, i) => matches(i) && (!k || r.text.kind === k)).length;
  const shown = rows.filter((r, i) => matches(i) && (!kind || r.text.kind === kind));
  const groups = groupsOf(shown);

  if (failed) return <div className="wrap"><p className={idx.empty} role="alert">The catalogue could not be opened. Check your connection and try again.</p></div>;
  if (!cat) return <div className="wrap"><p className={idx.empty}>Opening the catalogue…</p></div>;

  return (
    <div className={`wrap ${idx.page}`}>
      <div className={idx.search} role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input type="search" enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by author, work, editor, translator, publisher or year" aria-label="Search editions and translations" />
      </div>
      <div className={idx.chips}>
        {KINDS.map(([k, label]) => <button key={k || "all"} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{label} <small>{num(kindCount(k))}</small></button>)}
      </div>
      <p className={idx.count} aria-live="polite">{num(shown.length)} {shown.length === 1 ? "text" : "texts"} in {num(groups.length)} {groups.length === 1 ? "group" : "groups"}</p>
      {shown.length === 0 && <p className={idx.empty}>Nothing matches. Try a shorter search.</p>}

      {groups.map((g) => {
        const full = terms.length > 0 || all.has(g.id);
        const list = full ? g.rows : g.rows.slice(0, FIRST);
        return (
          <details key={g.id} className={styles.group} open={terms.length > 0 || g === groups[0]}>
            <summary><span className={styles.gname}>{g.name}</span><span className={styles.gcount}>{num(g.rows.length)}</span></summary>
            <ul className={styles.list}>
              {list.map((r) => (
                <li key={r.text.urn}>
                  <Link className={styles.row} href={r.href} transitionTypes={["page-turn"]}>
                    <span className={styles.what}>
                      <span className={styles.title}>{r.author}, {r.title}</span>
                      <span className={styles.kind}>{r.text.kind === "edition" ? "Greek edition" : r.text.kind === "translation" ? `Translation${r.text.lang ? ` (${r.text.lang})` : ""}` : "Commentary"}</span>
                    </span>
                    <span className={styles.desc}>{r.text.desc ?? "No description in the source."}</span>
                    <span className={styles.size}>{kb(r.text.size)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {!full && g.rows.length > FIRST && (
              <button type="button" className={`btn small ghost ${styles.more}`} onClick={() => setAll(new Set([...all, g.id]))}>Show all {num(g.rows.length)}</button>
            )}
          </details>
        );
      })}

      <p className={idx.credit}>
        Each description is the one in the text&apos;s own file at the Perseus Digital Library (<code>canonical-greekLit</code>) or Open Greek and Latin (<code>First1KGreek</code>), shown as written, including any slips.
        The grouping is by the publisher named in it; texts whose description names none of the publishers above are under &ldquo;Other&rdquo;.
        A row opens that exact text in the reader. Nothing here is edited: when a description is wrong, the fix belongs at the source.
      </p>
    </div>
  );
}
