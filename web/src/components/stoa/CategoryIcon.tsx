/**
 * A small line drawing for each Painted Stoa category, drawn for this site (24 × 24, in the current
 * colour), shown in a black-glaze roundel wherever a category needs a sign of its own.
 */
const PATHS: Record<string, React.ReactNode> = {
  // a Corinthian helmet, side on, with its crest
  people: <><path d="M5.5 21c-.6-7.2 2-12.6 7.5-12.6 3.6 0 6 2.6 6 6.6v1.6h-4.6L13.4 21" /><path d="M13.6 12.6h4.2" /><path d="M4.4 9.6C6 5 10 3 15 3.4c2.6.3 4.6 1.3 5.6 3.1" /><path d="M7.5 6.5l-1-2M11 4.6l-.4-2M15 4l.2-2" /></>,
  // an Athenian juror's ballot: a bronze disc on an axle
  democracy: <><circle cx="12" cy="12" r="6" /><path d="M2.5 12h19" /><circle cx="12" cy="12" r="1.2" /></>,
  // a wax writing tablet and its stylus
  education: <><rect x="3" y="6" width="13" height="15" rx="1" /><path d="M6 10h7M6 13h7M6 16h4" /><path d="M14 12l7-9" /></>,
  // a kylix, the wine cup of the symposium
  daily: <><path d="M4 9h16" /><path d="M5 9c0 4 3 6 7 6s7-2 7-6" /><path d="M12 15v4M8.5 20h7" /><path d="M5 10.5C2.5 10.5 2.5 7 4.5 7M19 10.5c2.5 0 2.5-3.5.5-3.5" /></>,
  // a temple front
  religion: <><path d="M3 9l9-5 9 5z" /><path d="M5.5 11v7M9.5 11v7M14.5 11v7M18.5 11v7" /><path d="M3 20.5h18" /></>,
  // a lyre
  beautiful: <><path d="M7 3c-2.5 4-1.5 9 1.5 13M17 3c2.5 4 1.5 9-1.5 13" /><path d="M6.5 6h11" /><path d="M8.5 16h7a3.5 3.5 0 0 1-7 0z" /><path d="M10.5 6v10M13.5 6v10" /></>,
  // the painted eye on a drinking cup, which kept bad luck away
  weird: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="0.8" /></>,
  // a gearwheel, as in the Antikythera mechanism
  strange: <><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="1.8" /><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8" /></>,
  // links of a chain
  dark: <><rect x="2" y="8.5" width="11" height="7" rx="3.5" /><rect x="11" y="8.5" width="11" height="7" rx="3.5" /></>,
  // an excavator's trowel
  archaeology: <><path d="M3 21l3.5-8.5 5 5z" /><path d="M9 15l4.5-4.5" /><path d="M13 11l7-7" strokeWidth="2.6" /></>,
  // letters
  language: <><path d="M4 19l4.5-13L13 19M5.8 14.5h5.4" /><path d="M16 19V9.5a3 3 0 0 1 6 0c0 2-1.5 3-3.5 3 2.5 0 3.8 1.2 3.8 3.2A3.3 3.3 0 0 1 16 16" /></>,
};

export default function CategoryIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[id] ?? <circle cx="12" cy="12" r="6" />}
    </svg>
  );
}
