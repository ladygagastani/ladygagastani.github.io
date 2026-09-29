"use client";
/**
 * The home page's three cards from the Painted Stoa, changing each day (the same for everyone:
 * chosen by date, not at random). As the brief asks, one is always from "The dark side" and one from
 * archaeology; the third comes from any other category. The entries are passed in already reduced
 * to what a card shows, so the home page does not carry the whole wiki. Each card shows the entry's
 * own picture, or its category's sign when the entry has none.
 */
import Link from "next/link";
import { useSyncExternalStore } from "react";
import CategoryIcon from "./stoa/CategoryIcon";

export interface StoaCard {
  slug: string; title: string; cat: string; catId: string; text: string;
  pic?: { src: string; srcSet: string; alt: string; credit: string; width: number; height: number };
}

const noSubscribe = () => () => {};
const pick = <T,>(xs: T[], day: number, step: number) => (xs.length ? xs[(day * step) % xs.length] : undefined);

export default function StoaCards({ cards, styles }: { cards: StoaCard[]; styles: Record<string, string> }) {
  // the built page shows day 0; the visitor's browser then shows today's three
  const day = useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 864e5), () => 0);
  const dark = pick(cards.filter((c) => c.catId === "dark"), day, 1);
  const arch = pick(cards.filter((c) => c.catId === "archaeology"), day, 1);
  const other = pick(cards.filter((c) => c.catId !== "dark" && c.catId !== "archaeology"), day, 7);
  return (
    <div className={`${styles.cards} snap-row`}>
      {[dark, other, arch].filter((c): c is StoaCard => !!c).map((c) => (
        <Link key={c.slug} href={`/stoa/${c.slug}`} className={`${styles.card} ${styles.cardLink} rv`} transitionTypes={["page-turn"]}>
          <span className={styles.cardPic}>
            {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service */}
            {c.pic ? <img data-whole={c.pic.height > c.pic.width * 0.9 ? "" : undefined} src={c.pic.src} srcSet={c.pic.srcSet} sizes="(max-width: 760px) 85vw, 400px" alt={c.pic.alt} title={c.pic.credit} width={c.pic.width} height={c.pic.height} loading="lazy" decoding="async" />
              : <span className={styles.cardIcon}><CategoryIcon id={c.catId} /></span>}
          </span>
          <span className="label">{c.cat}</span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          <span className={styles.cardGo}>Read the entry →</span>
        </Link>
      ))}
    </div>
  );
}
