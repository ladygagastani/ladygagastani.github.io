import Link from "next/link";
import Page from "@/components/Page";
import Amphora from "@/components/Amphora";
import LetterTiles from "@/components/LetterTiles";
import PassageOfTheDay from "@/components/PassageOfTheDay";
import OfflineActions from "@/components/OfflineActions";
import ForumActivity from "@/components/ForumActivity";
import { ContinueCard } from "@/components/Resume";
import { AREAS, SITE } from "@/config/areas";
import StoaCards, { type StoaCard } from "@/components/StoaCards";
import { ENTRIES, categoryOf } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";
import styles from "./home.module.css";

// From the Painted Stoa: each entry reduced to what a home-page card shows (its first sentences).
const firstSentences = (t: string) => { let out = ""; for (const x of t.split(/(?<=[.!?])\s+/)) { if (out && (out + " " + x).length > 230) break; out = out ? `${out} ${x}` : x; } return out; };
const STOA_CARDS: StoaCard[] = ENTRIES.map((e) => ({ slug: e.slug, title: e.title, cat: categoryOf(e.category).title, catId: e.category, text: firstSentences(plain(inline(e.hook))) }));

export default function Home() {
  return (
    <Page>
      {/* ---------------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`wrap ${styles.heroGrid}`}>
          <div>
            <div className={styles.kicker}><span className="tongues draw" aria-hidden="true" /><span className="label">Ancient Greek for beginners</span></div>
            <h1 id="hero-title" className={styles.title} lang="grc">
              Μάθησις<span>Στοιχείων</span>
            </h1>
            <p className={styles.sub}>{SITE.tagline}</p>
            <div className={styles.cta}>
              <Link className="btn" href={AREAS.study.href} transitionTypes={["page-turn"]}>Start learning Greek <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="btn ghost" href={AREAS.library.href} transitionTypes={["page-turn"]}>Open the library</Link>
            </div>
          </div>
          <Amphora />
        </div>
        <div className="wrap"><div className="meander draw" aria-hidden="true" /></div>
      </section>

      {/* ---------------------------------------------------------------- continue (only when there is something) */}
      <ContinueCard styles={styles} />

      {/* ---------------------------------------------------------------- learn */}
      <section className={`${styles.block} ${styles.learn}`} aria-labelledby="learn-title">
        <div className="wrap">
          <div className={styles.learnGrid}>
            <div className="rv">
              <span className="label">{AREAS.study.name} · {AREAS.study.english}</span>
              <h2 id="learn-title" className={styles.h2}>Start with the letters</h2>
              <p className={styles.lede}>Twenty-four letters, seven of them vowels. Many will look familiar from maths and science; a few will surprise you.</p>
              <ol className={styles.path}>
                <li><Link href="/academy/alphabet" transitionTypes={["page-turn"]}><b>Meet the alphabet</b></Link><span>Shapes, names and sounds, and the order each letter is written in.</span></li>
                <li><Link href="/academy/lesson/marks" transitionTypes={["page-turn"]}><b>Accents and breathings</b></Link><span>What the small marks above the letters do, and how much they matter to a beginner.</span></li>
                <li><Link href="/academy/lesson/letters" transitionTypes={["page-turn"]}><b>Your first real sentence</b></Link><span>A genuine line of Homer by the end of lesson one, linked to the library.</span></li>
              </ol>
            </div>
            <div className="rv">
              <LetterTiles />
              <p className={styles.note}>Hover or tap a letter. Sounds follow the reconstructed pronunciation of Classical Athens; you&apos;ll be able to switch to Erasmian or Modern Greek.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- passage */}
      <section className={styles.block} aria-labelledby="passage-title">
        <div className="wrap">
          <div className={`${styles.secHead} rv`}>
            <div><span className="label">{AREAS.reader.name} · {AREAS.reader.english}</span><h2 id="passage-title" className={styles.h2}>Passage of the day</h2></div>
            <p className="muted">A different famous passage each day, read live from the original files. Every word can be looked up.</p>
          </div>
          <div className="rv"><PassageOfTheDay /></div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- wiki */}
      <section className={styles.block} aria-labelledby="stoa-title">
        <div className="wrap">
          <div className={`${styles.secHead} rv`}>
            <div><span className="label">{AREAS.wiki.name} · {AREAS.wiki.english}</span><h2 id="stoa-title" className={styles.h2}>From the Painted Stoa</h2></div>
            <p className="muted">History, daily life, the strange and the brutal, told from the sources. Every entry says how sure we can be.</p>
          </div>
          <StoaCards cards={STOA_CARDS} styles={styles} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- forum */}
      <section className={styles.block} aria-labelledby="forum-title">
        <div className="wrap">
          <div className={`${styles.secHead} rv`}>
            <div><span className="label">{AREAS.forum.name} · {AREAS.forum.english}</span><h2 id="forum-title" className={styles.h2}>What people are asking</h2></div>
            <p className="muted">Questions from beginners, help with a passage, and a debate each week. Reading is open to everyone; a free account lets you join in.</p>
          </div>
          <div className="rv"><ForumActivity styles={styles} /></div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- offline */}
      <section className={styles.block} aria-labelledby="offline-title">
        <div className="wrap">
          <div className={`${styles.offline} rv`}>
            <div>
              <span className="label">{AREAS.downloads.name} · {AREAS.downloads.english}</span>
              <h2 id="offline-title" className={styles.h2}>Read without a connection</h2>
              <p className={styles.lede}>Download the original text collections once and keep reading on a train, a plane or a remote island. Your notes and saved words stay on this computer.</p>
            </div>
            <OfflineActions />
          </div>
        </div>
      </section>
    </Page>
  );
}
