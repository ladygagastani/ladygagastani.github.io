"use client";
/**
 * The Treasury (My Library): everything the reader has saved, in one place.
 * The overview is a Doric frieze, as on the treasuries at Delphi: each metope holds one kind of
 * offering (notes, favourite passages, bookmarks…) with its count, and opens that section.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTreasury, plural } from "./data";
import { NotesSection, BookmarksSection, HighlightsSection, XrefsSection, RecentSection } from "./MarkSections";
import AnthologySection from "./AnthologySection";
import WordsSection from "./WordsSection";
import AuthorsSection from "./AuthorsSection";
import KeepSafe from "./KeepSafe";
import styles from "./Treasury.module.css";
import PlacesSection from "./PlacesSection";
import { loadSavedPlaces, useSavedPlaces } from "@/lib/map";

export type SectionId = "recent" | "notes" | "anthology" | "bookmarks" | "highlights" | "xrefs" | "words" | "authors" | "places";

export default function Treasury() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useTreasury();
  const { marks, deck, pageNotes } = t;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  useEffect(() => { loadSavedPlaces(); }, []);
  const section = (params.get("s") ?? "recent") as SectionId;

  const counts = useMemo(() => {
    const k = (kind: string) => marks.filter((m) => m.kind === kind).length;
    return {
      notes: k("note"), anthology: k("favourite"), bookmarks: k("bookmark"), highlights: k("highlight"), xrefs: k("xref"),
      words: Object.values(deck).filter((c) => c.source === "saved").length,
      authors: Object.values(pageNotes).filter((n) => n.kind === "author").length,
    };
  }, [marks, deck, pageNotes]);

  const METOPES: { id: SectionId; label: string; n: number | null; hint: string }[] = [
    { id: "notes", label: "Notes", n: counts.notes, hint: "on passages" },
    { id: "anthology", label: "Anthology", n: counts.anthology, hint: "favourite passages" },
    { id: "bookmarks", label: "Bookmarks", n: counts.bookmarks, hint: "and where you stopped" },
    { id: "highlights", label: "Highlights", n: counts.highlights, hint: "in four colours" },
    { id: "xrefs", label: "Cross-references", n: counts.xrefs, hint: "between passages" },
    { id: "words", label: "Words", n: counts.words, hint: "saved, with Word Study" },
    { id: "authors", label: "Authors", n: counts.authors, hint: "your notes on them" },
    { id: "places", label: "Places", n: savedPlaces, hint: "on your own map" },
  ];
  const go = (id: SectionId) => {
    const q = new URLSearchParams(params.toString());
    if (id === "recent" || id === section) q.delete("s"); else q.set("s", id);
    for (const k of ["tag", "c", "a"]) q.delete(k);
    router.replace(`/treasury${q.size ? `?${q}` : ""}`, { scroll: false });
  };
  const empty = t.ready && !marks.length && !Object.keys(deck).length && !Object.keys(pageNotes).length && !savedPlaces;

  return (
    <div className={`wrap ${styles.treasury}`}>
      <nav className={styles.facade} aria-label="Sections of the Treasury">
        <svg className={styles.pediment} viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 86 L500 6 L996 86" />
          <path className={styles.tympanum} d="M60 80 L500 18 L940 80" />
        </svg>
        <ol className={styles.frieze}>
          {METOPES.map((m, i) => (
            <li key={m.id} style={{ "--i": i } as React.CSSProperties}>
              <button type="button" className={styles.metope} aria-current={section === m.id ? "page" : undefined} onClick={() => go(m.id)}
                data-empty={m.n === 0 || m.n === null ? "" : undefined}>
                <span className={styles.count}>{m.n === null ? "·" : t.ready ? m.n.toLocaleString("en-GB") : "…"}</span>
                <span className={styles.metopeLabel}>{m.label}</span>
                <span className={styles.metopeHint}>{m.hint}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {t.error && <p className={styles.error} role="alert">{t.error}</p>}
      {empty && (
        <div className={styles.welcome}>
          <p className={styles.welcomeGr} lang="grc" aria-hidden="true" data-decorative="">θησαυρός</p>
          <p>Your Treasury is empty so far. Open a text in <Link href="/library" transitionTypes={["page-turn"]}>the Mouseion</Link>, then
            select some Greek words, or click a passage number, to bookmark it, add it to your anthology, highlight it or write a note.
            Click any word to look it up, and press <b>Save word</b> to keep it here.</p>
        </div>
      )}

      <section className={styles.section} key={section} aria-live="polite">
        {section === "recent" && <RecentSection t={t} />}
        {section === "notes" && <NotesSection t={t} />}
        {section === "anthology" && <AnthologySection t={t} />}
        {section === "bookmarks" && <BookmarksSection t={t} />}
        {section === "highlights" && <HighlightsSection t={t} />}
        {section === "xrefs" && <XrefsSection t={t} />}
        {section === "words" && <WordsSection t={t} />}
        {section === "authors" && <AuthorsSection t={t} />}
        {section === "places" && <PlacesSection />}
      </section>

      <KeepSafe t={t} summary={`${plural(marks.length, "mark")}, ${plural(Object.keys(pageNotes).length, "note")} on authors, words and the Painted Stoa, ${plural(Object.keys(deck).length, "word")} in your review deck, ${plural(savedPlaces, "saved place")}`} />
    </div>
  );
}
