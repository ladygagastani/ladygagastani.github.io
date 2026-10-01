"use client";
/** The Treasury's Places: the places you saved on the Periplus, on a small map of your own. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadMap, loadSavedPlaces, project, ringsPath, shortName, typeLabel, useSavedPlaces, type Base, type Place } from "@/lib/map";
import { ago } from "./data";
import styles from "./Treasury.module.css";

export default function PlacesSection() {
  const saved = useSavedPlaces((s) => s.saved);
  const toggle = useSavedPlaces((s) => s.toggle);
  const [data, setData] = useState<{ base: Base; places: Place[] } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { loadSavedPlaces(); loadMap().then(setData, () => setFailed(true)); }, []);

  const mine = useMemo(() => {
    if (!data) return [];
    const byId = new Map(data.places.map((p) => [p.id, p]));
    return Object.entries(saved).map(([id, t]) => ({ p: byId.get(id), id, t })).filter((x): x is { p: Place; id: string; t: number } => !!x.p).sort((a, b) => b.t - a.t);
  }, [data, saved]);

  if (failed) return <p className={styles.soon}>The map could not be loaded, so your places cannot be shown just now.</p>;
  if (!data) return <p className={styles.soon}>Unrolling your map…</p>;
  if (!mine.length) {
    return (
      <div className={styles.soon}>
        <h2>Places</h2>
        <p>No places saved yet. Open <Link href="/stoa/periplus" transitionTypes={["page-turn"]}>the Periplus</Link>, the map of the Greek
          world, choose a place and press <b>Save this place</b>. It will appear here, on a map of your own.</p>
      </div>
    );
  }
  return (
    <div className={styles.places}>
      <h2>Your places <span className={styles.n}>{mine.length}</span></h2>
      <MiniMap base={data.base} places={mine.map((m) => m.p)} />
      <ul className={styles.placeList}>
        {mine.map(({ p, t }) => (
          <li key={p.id}>
            <Link href={`/stoa/periplus?p=${p.id}`} transitionTypes={["page-turn"]}><b>{shortName(p)}</b> <span lang="grc">{p.grc}</span></Link>
            <small>{typeLabel(p.type)} · named {p.n.toLocaleString("en-GB")} times · saved {ago(t)}</small>
            <button type="button" className="chip" onClick={() => toggle(p.id)} aria-label={`Remove ${shortName(p)} from your places`}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A still map framed around the saved places. */
function MiniMap({ base, places }: { base: Base; places: Place[] }) {
  const sea = useMemo(() => ringsPath(base, base.water), [base]);
  const pts = places.map((p) => ({ p, xy: project(base, p.lon, p.lat) }));
  const xs = pts.map((q) => q.xy[0]), ys = pts.map((q) => q.xy[1]);
  const pad = 140;
  let [x0, x1, y0, y1] = [Math.min(...xs) - pad, Math.max(...xs) + pad, Math.min(...ys) - pad, Math.max(...ys) + pad];
  // at least a region's width, and a pleasant shape
  const minW = 900;
  if (x1 - x0 < minW) { const c = (x0 + x1) / 2; x0 = c - minW / 2; x1 = c + minW / 2; }
  const wantH = (x1 - x0) * 0.55;
  if (y1 - y0 < wantH) { const c = (y0 + y1) / 2; y0 = c - wantH / 2; y1 = c + wantH / 2; }
  const s = (x1 - x0) / 1000;
  return (
    <svg className={styles.miniMap} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} role="img" aria-label={places.length === 1 ? "A map of your saved place" : `A map of your ${places.length} saved places`}>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} className={styles.mmLand} />
      <path d={sea} className={styles.mmSea} />
      {pts.map(({ p, xy }, i) => (
        <g key={p.id} style={{ "--i": i } as React.CSSProperties} className={styles.mmPlace}>
          <circle cx={xy[0]} cy={xy[1]} r={7 * s} />
          <text x={xy[0] + 11 * s} y={xy[1] + 5 * s} style={{ fontSize: 15 * s, strokeWidth: 4 * s }} lang="grc">{p.grc}</text>
        </g>
      ))}
    </svg>
  );
}
