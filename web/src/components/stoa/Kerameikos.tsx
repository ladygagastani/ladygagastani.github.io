/**
 * The Kerameikos, the Painted Stoa's archaeology section: a section drawing, then the page itself as
 * a trench, dug from the topsoil down, one layer per theme, with a ranging pole beside it that marks
 * how deep you have read. Ends with the excavated sites, each opening on the Periplus.
 */
import Link from "next/link";
import { entryBySlug, categoryOf } from "@/wiki/index";
import { IMAGES } from "@/wiki/images";
import { LAYERS, DIG_SITES } from "@/wiki/kerameikos";
import SectionDrawing from "./SectionDrawing";
import DepthPole from "./DepthPole";
import mapData from "../../../public/data/map/places.json";
import styles from "./Kerameikos.module.css";

// how often the library names each site (read at build time; the page ships only the numbers it shows)
const MENTIONS = new Map((mapData as { places: { id: string; n: number }[] }).places.map((p) => [p.id, p.n]));

export default function Kerameikos() {
  return (
    <div className={styles.page}>
      <div className="wrap">
        <SectionDrawing layers={LAYERS} />
      </div>

      <div className={styles.trench} data-trench>
        <DepthPole />
        {LAYERS.map((l, i) => {
          const es = l.slugs.map((s) => entryBySlug.get(s)!);
          return (
            <section key={l.id} id={l.id} className={styles.layer} style={{ "--d": i } as React.CSSProperties} aria-labelledby={`${l.id}-h`}>
              <div className={`wrap ${styles.layerIn}`}>
                <header className={styles.layerHead}>
                  <span className={styles.ctxLabel} aria-hidden="true">{i + 1}</span>
                  <div>
                    <p className="label">Layer {i + 1} · {l.deposit}</p>
                    <h2 id={`${l.id}-h`}>{l.title}</h2>
                    <p className={styles.blurb}>{l.blurb}</p>
                  </div>
                </header>
                {es.length > 0 ? (
                  <ul className={styles.finds}>
                    {es.map((e, j) => {
                      const im = e.image ? IMAGES[e.image] : undefined;
                      const other = e.category !== "archaeology" ? categoryOf(e.category).title : null;
                      return (
                        <li key={e.slug} className="rv" style={{ "--j": j } as React.CSSProperties}>
                          <Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]} className={styles.card}>
                            <span className={styles.thumb} aria-hidden="true">
                              {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service */}
                              {im ? <img src={`/images/${im.file}`} alt="" width={im.width} height={im.height} loading="lazy" decoding="async" className={im.height > im.width * 0.9 ? styles.tallImg : undefined} />
                                : <span className={styles.noImg} />}
                            </span>
                            <span className={styles.cardText}>
                              <b>{e.title}</b>
                              <span>{e.kicker}</span>
                              {other && <small>also in {other}</small>}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className={styles.soon}>Entries for this layer are being written.</p>}
              </div>
            </section>
          );
        })}
        <section className={`${styles.layer} ${styles.natural}`} aria-labelledby="sites-h">
          <div className={`wrap ${styles.layerIn}`}>
            <header className={styles.layerHead}>
              <span className={`${styles.ctxLabel} ${styles.ctxNatural}`} aria-hidden="true">·</span>
              <div>
                <p className="label">The natural subsoil</p>
                <h2 id="sites-h">Where the digging happens</h2>
                <p className={styles.blurb}>Excavated sites of the Greek world, and how often the library&apos;s texts name them. Each opens on the Periplus, the site&apos;s map.</p>
              </div>
            </header>
            <ul className={styles.sites}>
              {DIG_SITES.map((s) => (
                <li key={s.id}>
                  <Link href={`/stoa/periplus?p=${s.id}`} transitionTypes={["page-turn"]}>
                    <b lang="grc">{s.grc}</b> <span>{s.en}</span>
                    {MENTIONS.has(s.id) && <small>named {MENTIONS.get(s.id)!.toLocaleString("en-GB")} times</small>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
