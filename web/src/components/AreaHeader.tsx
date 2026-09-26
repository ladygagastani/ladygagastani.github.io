import { AREAS, type AreaId } from "@/config/areas";

/** The header every area opens with: its Greek name, what the name means, and why it fits. */
export default function AreaHeader({ id, children }: { id: AreaId; children?: React.ReactNode }) {
  const a = AREAS[id];
  return (
    <header className="area-head">
      <div className="wrap">
        <div className="area-kicker"><span className="tongues draw" aria-hidden="true" /><span className="label">{a.english}</span></div>
        <h1>
          {a.name}
          {a.greek && <span className="area-greek" lang="grc">{a.greek}</span>}
        </h1>
        <p className="area-origin">{a.origin} {a.fit}</p>
        {children}
      </div>
      <div className="wrap"><div className="meander draw" aria-hidden="true" /></div>
    </header>
  );
}
