/**
 * How the counting was done, in plain words, with the figures from the Census's own data. The
 * brief asks for exactly this: the method, and how complete the data is.
 */
import Link from "next/link";
import type { CensusMeta } from "@/lib/census";
import { fmt } from "./shared";
import styles from "./Census.module.css";

export default function Method({ meta }: { meta: CensusMeta }) {
  return (
    <section className={styles.method} aria-labelledby="method-h">
      <h2 id="method-h">How the counting was done</h2>
      <div className={styles.methodCols}>
        <div>
          <h3>What was read</h3>
          <p>
            {fmt(meta.words)} words in {fmt(meta.works)} works, as analysed by GLAUx (Alek Keersmaekers, 2021), an open corpus that
            gives every word of these texts its dictionary form and grammar. These are the library&apos;s works that GLAUx covers;
            the others have no analyses yet and are not counted. GLAUx gives its own accuracy: 98.8% for dictionary forms.
          </p>
          <h3>Counted by dictionary word</h3>
          <p>
            Every form counts for its dictionary word: λόγου and λόγοις both count as λόγος, and Διός counts as Ζεύς. The numbers are
            the same as on each word&apos;s <Link href="/treasury/word?l=λόγος">Word Study</Link> page.
          </p>
          <h3>Names</h3>
          <p>
            A name is a dictionary word GLAUx writes with a capital. GLAUx also tags nouns with a class such as person, place or
            people (following a scheme by Zaenen and others, 2004; 89.2% accurate by GLAUx&apos;s own figure), and each name is sorted
            by the class it is given most often. GLAUx calls gods and heroes persons too, so they were picked out by hand. Every name
            mentioned at least {fmt(meta.checked.names)} times was looked at by hand and corrected where needed; rarer names are
            sorted automatically and marked <span className={styles.auto}>°</span>.
          </p>
          <p>
            Names are words, not people: one word can name several people. Ἀλέξανδρος is Alexander the Great, but also Paris of Troy
            and many others; each name is sorted by what it mostly means across the library. A people is counted by the word for one
            of them (Ἀθηναῖος, “an Athenian”), which also counts when it describes something (“Athenian ships”).
          </p>
        </div>
        <div>
          <h3>Things</h3>
          <p>
            GLAUx also gives nouns a meaning from Princeton&apos;s WordNet 3.0, an English dictionary that groups meanings under wider
            ones (82.0% accurate by GLAUx&apos;s own figure). A noun used at least 20 times goes into a group when the meaning it is
            given most often (and at least two times in five) falls under that group in WordNet: τριήρης is a trireme, so a ship. Each noun is in one group only. Every
            word mentioned at least {fmt(meta.checked.objects)} times was checked by hand; the rest are marked <span className={styles.auto}>°</span>.
          </p>
          <h3>Phrases</h3>
          <p>
            Two to six words that recur in exactly the same form (only a grave accent is read as an acute, and a capital at the start
            of a sentence as small), inside one sentence and one passage, with no punctuation between. A phrase must hold at least two
            nouns, verbs, adjectives or names (“to be” does not count), may not begin with a conjunction (“and”, “but”) or a particle,
            and may not end with one, or with an article or a preposition. A phrase that is nearly always part of a longer one (four times in five) is shown as the longer one.
            The lists hold the phrases repeated most across the library and inside each work.
          </p>
          <h3>Kinds of writing and periods</h3>
          <p>
            As in the library&apos;s filters: GLAUx&apos;s own description of each work, and its date by century of the author&apos;s life.
            Lists show up to 100 items, 50 for an author and 20 for a single work.
          </p>
          <h3>Meanings</h3>
          <p>
            Words show the meaning from the Dickinson College Commentaries core vocabulary, or else one meaning from
            Liddell–Scott–Jones: the one that matches GLAUx&apos;s reading of the word, or the first. Places show their English name
            from Pleiades; other names are transliterated in the site&apos;s simple scheme.
          </p>
        </div>
      </div>
      {meta.leftOut.length > 0 && (
        <details className={styles.leftOut}>
          <summary>Words with a capital that are left out on purpose ({meta.leftOut.length})</summary>
          <p>Letters that name the points of a figure in geometry (ΑΒΓ), adjectives such as Ἀττικός “Attic” that describe things rather than name them, adverbs such as Ἀθήνησι “at Athens”, and these:</p>
          <ul>
            {meta.leftOut.map(([name, why, n]) => <li key={name}><b lang="grc">{name}</b> <span>{why}</span> <small>{fmt(n)}</small></li>)}
          </ul>
        </details>
      )}
      <p className={styles.fine}>
        Sources: GLAUx, CC BY-SA 4.0; Princeton WordNet 3.0 (WordNet licence); Pleiades, CC BY 3.0; DCC Greek Core Vocabulary,
        CC BY-SA 3.0; Liddell–Scott–Jones from the Perseus Digital Library, CC BY-SA 4.0. See <Link href="/credits">Credits</Link>.
      </p>
    </section>
  );
}
