import type { Metadata } from "next";
import Page from "@/components/Page";
import { COLLECTIONS, repoUrl } from "@/config/sources";
import { LSJ_CREDIT } from "@/lib/lookup/lsj";
import { IMAGES } from "@/wiki/images";
import { ENTRIES } from "@/wiki/index";
import styles from "../prose.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: "Credits, licences & privacy", description: PAGE_DESCRIPTIONS.credits };

// Only list what the site actually uses today. Add each new source, image or library here when it arrives.
const SOFTWARE = [
  { name: "GFS Didot", by: "Greek Font Society", licence: "SIL Open Font License 1.1", href: "https://fonts.google.com/specimen/GFS+Didot" },
  { name: "Alegreya and Alegreya Sans SC", by: "Juan Pablo del Peral, Huerta Tipográfica", licence: "SIL Open Font License 1.1", href: "https://fonts.google.com/specimen/Alegreya" },
  { name: "three.js", by: "three.js authors", licence: "MIT", href: "https://threejs.org" },
  { name: "saxes", by: "Louis-Dominique Dubeau and contributors", licence: "ISC", href: "https://github.com/lddubeau/saxes" },
  { name: "Next.js and React", by: "Vercel and Meta", licence: "MIT", href: "https://nextjs.org" },
  { name: "Zustand", by: "Poimandres", licence: "MIT", href: "https://github.com/pmndrs/zustand" },
  { name: "supabase-js (accounts, the Town Hall and the Pnyx)", by: "Supabase", licence: "MIT", href: "https://github.com/supabase/supabase-js" },
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
          <li>
            <b>The Census&apos;s sorting</b> of names into people, places and peoples, and of nouns into ships, weapons, animals and other
            groups, uses the class (animacy) and the word sense GLAUx gives each noun, and the groups of meanings in{" "}
            <a href="https://wordnet.princeton.edu/" rel="noopener">Princeton WordNet 3.0</a>. WordNet 3.0 Copyright 2006 by Princeton
            University. All rights reserved. WordNet is provided &ldquo;as is&rdquo;, and Princeton University makes no representations or
            warranties, express or implied (<a href="https://wordnet.princeton.edu/license-and-commercial-use" rel="noopener">the WordNet licence</a>).
          </li>
          <li><b>Liddell–Scott–Jones Greek-English Lexicon (LSJ)</b>: {LSJ_CREDIT}</li>
          <li><b>Short definitions of the commonest words</b> and their frequency ranks: <a href="https://dcc.dickinson.edu/greek-core-list" rel="noopener">Dickinson College Commentaries Greek Core Vocabulary</a>, by Christopher Francese and collaborators, CC BY-SA 3.0.</li>
          <li><b>Scansion of verse</b> (long and short syllables, and the metre of each line) for Homer, Hesiod, Apollonius, Nonnus, Pindar, Theognis, the Greek Anthology, three plays of Aeschylus and other poets: <a href="https://hypotactic.com" rel="noopener">hypotactic.com</a>, by David Chamberlain, CC BY 4.0. The vowel lengths the site&apos;s own scanner uses for other texts were also learned from these scansions.</li>
          <li><b>Authors&apos; dates, birthplaces and descriptions</b> on the Wiki&apos;s Authors and Eras pages and on each author&apos;s page: <a href="https://www.wikidata.org" rel="noopener">Wikidata</a> (property P3576, the TLG author ID, matches its people to the library&apos;s authors), CC0. Built by <code>pipeline/build_authors_meta.py</code>; where Wikidata has no date, the dating of works in GLAUx is used and marked.</li>
          <li><b>Wiktionary</b> entries, fetched live when you look up a word, and each word&apos;s origin, related Greek words and English descendants on its Word Study page: English Wiktionary contributors, CC BY-SA 4.0.</li>
        </ul>

        <h2>Pictures</h2>
        <p>
          Every picture in the Painted Stoa comes from a collection that states its licence, and the licence is copied from that record
          by the script that fetched it (<code>web/scripts/fetch-images.ts</code>). Pictures from The Metropolitan Museum of Art are from its
          Open Access programme (CC0: free for any use). Photographs from Wikimedia Commons keep their photographers&apos; licences.
        </p>
        <ul>
          {Object.entries(IMAGES).map(([id, im]) => {
            const used = ENTRIES.find((e) => e.image === id);
            return (
              <li key={id}>
                <b>{im.title}</b>{im.date && <>, {im.date}</>}. {im.place}. {im.creator !== "Unknown" && <>{im.creator}. </>}
                <a href={im.source} rel="noopener">{im.sourceName}</a>, <a href={im.licenceUrl} rel="noopener">{im.licence}</a>.
                {used && <> Used in <a href={`/stoa/${used.slug}`}>{used.title}</a>.</>}
              </li>
            );
          })}
        </ul>

        <h2>Fonts and software</h2>
        <ul>
          {SOFTWARE.map((s) => (
            <li key={s.name}><a href={s.href} rel="noopener">{s.name}</a>, by {s.by}. {s.licence}.</li>
          ))}
        </ul>

        <h2>Images</h2>
        <p>The amphora on the home page and all ornament are drawn by this site&apos;s own code. Photographs of real objects arrive with the wiki, each with its source, creator and licence listed here.</p>

        <h2 id="privacy">Privacy</h2>
        <ul>
          <li>No adverts, no analytics, no trackers and no cookies.</li>
          <li>Fonts and code are served from this site, so your browser does not contact Google or any other company just to show a page.</li>
          <li>Your settings, reading positions, bookmarks, notes, highlights, saved words, unsent forum drafts and everything else in the Treasury are stored only in this browser, on this computer. “Download my Treasury” saves a copy as a file on your computer; nothing is uploaded.</li>
          <li>When you are online and a text is not in your downloaded library, your browser fetches that text&apos;s file from GitHub (raw.githubusercontent.com).</li>
          <li>When you look up a word or open its Word Study page while online, that word (and nothing else) is sent to Wiktionary (en.wiktionary.org).</li>
          <li>Downloading the library fetches the text files from GitHub. Links to Logeion and Perseus take you to those sites only when you click them.</li>
          <li>
            <b>The Town Hall, the Pnyx and accounts</b> are kept by <a href="https://supabase.com" rel="noopener">Supabase</a>, on servers in the European
            Union (Ireland). Your browser contacts Supabase on those pages and on your account page, when you are signed in, and on the home page, which
            reads the latest forum threads and the motion of the week (a read-only request that carries nothing but your internet address, as
            every request does); reading, study and the wiki never do. An account holds your email address (used only to sign you in and to send the confirmation and
            password-reset letters; never shown to anyone), your password (stored by Supabase in scrambled form, never readable), your
            display name and what you write about yourself.
          </li>
          <li>What you write in the Town Hall and the Pnyx, and your display name, are public. Your upvotes can be seen by others; your
            pebble in a debate cannot: only the totals are shown, once the debate closes. Reports are seen only by the moderator.</li>
          <li>If you choose to keep your Treasury in step between devices, a copy of it is stored in your account, readable only by you.</li>
          <li>You can delete your account at any time from your account page: this removes your account, your profile, everything you
            wrote in the Town Hall and the Pnyx, your votes and your stored Treasury.</li>
        </ul>
      </article>
    </Page>
  );
}
