import Link from "next/link";
import styles from "./Stoa.module.css";

/** The head of a Wiki reference page (Authors, Eras, Editions): where it sits, its title and what it is for. */
export default function RefHead({ title, greek, children }: { title: string; greek?: string; children: React.ReactNode }) {
  return (
    <header className={`wrap ${styles.entryHead}`}>
      <p className={styles.crumbs}><Link href="/stoa" transitionTypes={["page-turn"]}>The Painted Stoa</Link> › {title}</p>
      <h1 className={styles.title}>{title}{greek && <span className={styles.titleGr} lang="grc">{greek}</span>}</h1>
      <p className={styles.kicker}>{children}</p>
    </header>
  );
}
