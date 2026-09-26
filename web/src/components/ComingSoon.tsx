import Link from "next/link";
import { AREAS, type AreaId } from "@/config/areas";

/** Placeholder body for areas that later phases will build. Says plainly what is coming and when. */
export default function ComingSoon({ id, items }: { id: AreaId; items: string[] }) {
  const a = AREAS[id];
  return (
    <section className="wrap soon">
      <div className="soon-card">
        <span className="label">Being built in Phase {a.phase}</span>
        <h2>What you&apos;ll find here</h2>
        <ul>
          {items.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <Link className="btn ghost" href="/" transitionTypes={["page-turn"]}>Back to {AREAS.home.name}</Link>
      </div>
    </section>
  );
}
