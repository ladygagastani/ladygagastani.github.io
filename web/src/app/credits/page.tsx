import type { Metadata } from "next";
import Page from "@/components/Page";
import { COLLECTIONS, repoUrl } from "@/config/sources";
import { LSJ_CREDIT } from "@/lib/lookup/lsj";
import styles from "../prose.module.css";

export const metadata: Metadata = { title: "Credits, licences & privacy" };

// Only list what the site actually uses today. Add each new source, image or library here when it arrives.
const SOFTWARE = [
  { name: "GFS Didot", by: "Greek Font Society", licence: "SIL Open Font License 1.1", href: "https://fonts.google.com/specimen/GFS+Didot" },
  { name: "Alegreya and Alegreya Sans SC", by: "Juan Pablo del Peral, Huerta Tipográfica", licence: "SIL Open Font License 1.1", href: "https://fonts.google.com/specimen/Alegreya" },
  { name: "three.js", by: "three.js authors", licence: "MIT", href: "https://threejs.org" },
  { name: "saxes", by: "Louis-Dominique Dubeau and contributors", licence: "ISC", href: "https://github.com/lddubeau/saxes" },
  { name: "Next.js and React", by: "Vercel and Meta", licence: "MIT", href: "https://nextjs.org" },
  { name: "Zustand", by: "Poimandres", licence: "MIT", href: "https://github.com/pmndrs/zustand" },
];

export default function CreditsPage() {
  return (
    <Page>
      <article className={`wrap ${styles.prose}`}>
        <span className="label">Credits, licences &amp; privacy</span>
        <h1>Credits, licences &amp; privacy</h1>

        <h2>Texts and translations</h2>
        <p>
          All Greek texts and English translations come from the collections below and are shown exactly as published.
          We never edit them. If we find an error, we report it to the collection rather than changing our copy.
        </p>
        <ul>
          {COLLECTIONS.map((c) => (
            <li key={c.id}>
              <a href={repoUrl(c)} rel="noopener">{c.name}</a> ({c.owner}/{c.repo}), licensed under {c.licence}.
            </li>
          ))}
        </ul>
        <p className="muted">
          CC BY-SA 4.0 means anyone may share and adapt this material, as long as they credit the source and share
          what they make under the same licence.
        </p>

        <h2>Words and dictionaries</h2>
        <ul>
          <li>
            <b>Word analyses</b> (dictionary form and grammar of each word, in context), and the genre, dialect and date of each work:{" "}
            <a href="https://github.com/alekkeersmaekers/glaux" rel="noopener">GLAUx</a>, by Alek Keersmaekers, CC BY-SA 4.0
            (some source texts and hand annotations carry other licences, listed in GLAUx&apos;s metadata). Hand-checked analyses come from the
            Ancient Greek Dependency Treebanks, PROIEL, the Pedalion, Gorman and Harrington treebanks and others, credited in GLAUx.
            Keersmaekers, A. (2021), &ldquo;The GLAUx corpus: methodological issues in designing a long-term, diverse, multi-layered corpus of
            Ancient Greek&rdquo;, <i>Proceedings of the 2nd International Workshop on Computational Approaches to Historical Language Change</i>, 39–50.
          </li>
          <li><b>Liddell–Scott–Jones Greek-English Lexicon (LSJ)</b>: {LSJ_CREDIT}</li>
          <li><b>Wiktionary</b> entries, fetched live when you look up a word: English Wiktionary contributors, CC BY-SA 4.0.</li>
        </ul>

        <h2>Fonts and software</h2>
        <ul>
          {SOFTWARE.map((s) => (
            <li key={s.name}><a href={s.href} rel="noopener">{s.name}</a>, by {s.by}. {s.licence}.</li>
          ))}
        </ul>

        <h2>Images</h2>
        <p>The amphora on the home page and all ornament are drawn by this site&apos;s own code. Photographs of real objects arrive with the wiki, each with its source, creator and licence listed here.</p>

        <h2>Privacy</h2>
        <ul>
          <li>No adverts, no analytics, no trackers and no cookies.</li>
          <li>Fonts and code are served from this site, so your browser does not contact Google or any other company just to show a page.</li>
          <li>Your settings, reading positions, bookmarks, notes and highlights are stored only in this browser, on this computer.</li>
          <li>When you are online and a text is not in your downloaded library, your browser fetches that text&apos;s file from GitHub (raw.githubusercontent.com).</li>
          <li>When you look up a word while online, the word you clicked (and nothing else) is sent to Wiktionary (en.wiktionary.org).</li>
          <li>Downloading the library fetches the text files from GitHub. Links to Logeion and Perseus take you to those sites only when you click them.</li>
        </ul>
      </article>
    </Page>
  );
}
