"use client";
/**
 * The Census: what the library mentions most. Pick what to count (names, things, words, phrases),
 * where (the whole library, a kind of writing, a period, an author or one work), and optionally a
 * second place to compare. Rankings are bars; when the choice changes, each bar slides to its new
 * rank, so you can watch the order change. Picking an item shows how its use changes over the
 * periods, who uses it most, and where it clusters inside a work, with links to Word Study, the
 * map, the Painted Stoa and every mention in the Oracle.
 *
 * URL: ?c=<list>&a=&w=&f=&p= (scope) &cmp=1&ba=&bw=&bf=&bp= (compared scope) &i=<item>
 */
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  categories, EMPTY_SCOPE, fmtRate, groupInfo, groupOf, isLemma, isName, lemmaKey, loadCensusMeta, loadGlosses, loadGroup,
  rate, scopeFrom, scopeParams, SHELVES, type Category, type CensusMeta, type Row, type Scope,
} from "@/lib/census";
import { loadPlaces, type Place } from "@/lib/map";
import { transliterate } from "@/lib/translit";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import ItemPanel from "./ItemPanel";
import Facts from "./Facts";
import Method from "./Method";
import { fmt, useLoad, type Links, type Shown } from "./shared";
import styles from "./Census.module.css";

export default function Census({ links }: { links: Links }) {
  const meta = useLoad("meta", loadCensusMeta);
  if (meta.state === "error" || (meta.state === "done" && !meta.value)) {
    return <p className={`wrap ${styles.status}`}>The Census&apos;s counts could not be loaded. Check the connection light at the top of the page, then reload.</p>;
  }
  if (meta.state === "loading") return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Counting…</div>;
  return <CensusView meta={meta.value!} links={links} />;
}

function CensusView({ meta, links }: { meta: CensusMeta; links: Links }) {
  const router = useRouter();
  const params = useSearchParams();
  const cats = useMemo(() => categories(meta), [meta]);
  const cat: Category = cats.find((c) => c.id === params.get("c")) ?? cats.find((c) => c.id === "god")!;
  const scope = scopeFrom((k) => params.get(k));
  const scopeB = scopeFrom((k) => params.get(k), "b");
  const comparing = params.get("cmp") === "1";
  const item = params.get("i");

  const go = useCallback((changes: [string, string | null][]) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of changes) { if (v === null || v === "") sp.delete(k); else sp.set(k, v); }
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [params, router]);

  const groupA = groupOf(scope);
  const groupB = groupOf(scopeB);
  const listsA = useLoad(`g|${groupA}`, () => loadGroup(groupA));
  const listsB = useLoad(`g|${groupB}`, () => loadGroup(groupB), comparing);
  const glosses = useLoad("glosses", loadGlosses, !isName(cat.id) && cat.id !== "phrase");
  const places = useLoad("places", () => loadPlaces().then((d) => {
    const m = new Map<string, Place>();
    for (const p of d.places) for (const n of [p.grc, ...(p.also ?? [])]) if (!m.has(n)) m.set(n, p);
    return m;
  }), cat.id === "place");

  const shownRows = (rows: Row[] | undefined): Shown[] => (rows ?? []).map((r) => {
    const key = cat.id === "phrase" ? r[0] : lemmaKey(r[0]);
    let sub: string | null = null;
    if (cat.id === "place") sub = places.state === "done" ? places.value.get(r[0])?.en ?? transliterate(r[0]) : transliterate(r[0]);
    else if (isName(cat.id) || cat.id === "phrase") sub = transliterate(r[0]);
    else if (glosses.state === "done") sub = glosses.value?.[key] ?? null;
    return { key, text: r[0], n: r[1], auto: r.length === 3, sub };
  });

  const rowsA = listsA.state === "done" ? shownRows(listsA.value?.[cat.id]) : null;
  const rowsB = comparing && listsB.state === "done" ? shownRows(listsB.value?.[cat.id]) : null;
  const infoA = groupInfo(meta, groupA);
  const infoB = groupInfo(meta, groupB);
  const picked = item ? (rowsA?.find((r) => r.text === item) ?? rowsB?.find((r) => r.text === item) ?? { key: isLemma(cat.id) ? lemmaKey(item) : item, text: item, n: 0, auto: false, sub: isName(cat.id) || cat.id === "phrase" ? transliterate(item) : null }) : null;

  // the same item in both columns is joined by a thread
  const [regA] = useState(() => new Map<string, HTMLElement>());
  const [regB] = useState(() => new Map<string, HTMLElement>());

  const setScope = (s: Scope, prefix = "") => go([...scopeParams(s, prefix)]);
  const shelf = cat.shelf;

  return (
    <div className={`wrap ${styles.census}`}>
      <Tally meta={meta} />

      <nav className={styles.shelves} aria-label="What to count">
        {SHELVES.map((s) => {
          const first = cats.find((c) => c.shelf === s.id)!;
          return (
            <button key={s.id} type="button" className={styles.shelf} aria-pressed={shelf === s.id}
              onClick={() => shelf !== s.id && go([["c", s.id === "names" ? "god" : first.id], ["i", null]])}>
              <b>{s.label}</b><span>{s.blurb}</span>
            </button>
          );
        })}
      </nav>
      {shelf !== "phrases" && (
        <div className={styles.cats} role="group" aria-label={SHELVES.find((s) => s.id === shelf)!.label}>
          {cats.filter((c) => c.shelf === shelf).map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={c.id === cat.id} onClick={() => go([["c", c.id], ["i", null]])}>
              {c.label}{meta.sizes[c.id] !== undefined && <small className={styles.size}>{fmt(meta.sizes[c.id])}</small>}
            </button>
          ))}
        </div>
      )}
      <p className={styles.blurb}>{cat.blurb}</p>

      <div className={styles.scopes}>
        <ScopePicker meta={meta} scope={scope} onChange={(s) => setScope(s)} title={comparing ? "Left" : "Where"} />
        {comparing
          ? <ScopePicker meta={meta} scope={scopeB} onChange={(s) => setScope(s, "b")} title="Right" onClose={() => go([["cmp", null], ...scopeParams(EMPTY_SCOPE, "b")])} />
          : <button type="button" className={`btn ghost ${styles.compareBtn}`} onClick={() => go([["cmp", "1"], ...scopeParams({ ...EMPTY_SCOPE, a: scope.a === "tlg0012" ? "tlg0020" : "tlg0012" }, "b")])}>
              Compare side by side <span className="arr">→</span>
            </button>}
      </div>

      <div className={`${styles.layout} ${comparing ? styles.comparing : ""}`}>
        <div className={styles.columns}>
          <Ranking side="a" cat={cat} label={infoA.label} words={infoA.words} rows={rowsA} state={listsA.state} selected={picked?.key ?? null}
            onPick={(r) => go([["i", r.text === item ? null : r.text]])} register={regA} comparing={comparing} />
          {comparing && <Threads a={regA} b={regB} selected={picked?.key ?? null} deps={`${cat.id}|${groupA}|${groupB}|${rowsA?.length}|${rowsB?.length}`} />}
          {comparing && <Ranking side="b" cat={cat} label={infoB.label} words={infoB.words} rows={rowsB} state={listsB.state} selected={picked?.key ?? null}
            onPick={(r) => go([["i", r.text === item ? null : r.text]])} register={regB} comparing={comparing} />}
        </div>
        <aside className={styles.side} aria-live="polite">
          {picked
            ? <ItemPanel key={`${cat.id}|${picked.text}`} meta={meta} cat={cat} item={picked} listed={rowsA?.find((r) => r.text === picked.text)?.n ?? null} scope={scope} links={links} onClose={() => go([["i", null]])} />
            : <PanelHint cat={cat} />}
        </aside>
      </div>

      <Facts meta={meta} cats={cats} onOpen={(c, s) => { go([["c", c], ["i", null], ...scopeParams(s)]); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      <Method meta={meta} />
    </div>
  );
}

// ------------------------------------------------------------ the tally at the top
function Tally({ meta }: { meta: CensusMeta }) {
  const names = ["person", "god", "place", "people"].reduce((s, k) => s + (meta.sizes[k] ?? 0), 0);
  const figures: [number, string][] = [[meta.words, "words read"], [meta.works, "works"], [names, "names sorted"], [meta.sizes.phrase ?? 0, "repeated phrases"]];
  return (
    <dl className={styles.tally}>
      {figures.map(([n, label], i) => (
        <div key={label} style={{ "--i": i } as React.CSSProperties}>
          <dt>{label}</dt>
          <dd><CountUp value={n} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** A number that counts up once when it first appears (not with reduced motion). */
function CountUp({ value }: { value: number }) {
  const motion = useSettings((s) => s.motion);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion(motion)) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = fmt(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); el.textContent = fmt(value); };
  }, [value, motion]);
  return <span ref={ref}>{fmt(value)}</span>;
}

// ------------------------------------------------------------ choosing where to count
function ScopePicker({ meta, scope, onChange, title, onClose }: { meta: CensusMeta; scope: Scope; onChange: (s: Scope) => void; title: string; onClose?: () => void }) {
  const authors = useMemo(() => [...meta.authors].sort((x, y) => x[1].localeCompare(y[1], "en")), [meta]);
  const author = scope.a ? meta.authors.find((a) => a[0] === scope.a) : undefined;
  const families = Object.entries(meta.groups).filter(([id]) => /^f\d+$/.test(id));
  const periods = Object.entries(meta.groups).filter(([id]) => /^p\d+$/.test(id));
  const isAll = groupOf(scope) === "all";
  return (
    <fieldset className={styles.scope}>
      <legend className="label">{title}</legend>
      <label>
        <span>Author</span>
        <select value={scope.a ?? ""} onChange={(e) => onChange({ ...EMPTY_SCOPE, a: e.target.value || null, f: e.target.value ? null : scope.f, p: e.target.value ? null : scope.p })}>
          <option value="">Any author</option>
          {authors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      {author && author[3].length > 1 && (
        <label>
          <span>Work</span>
          <select value={scope.w ?? ""} onChange={(e) => onChange({ ...scope, w: e.target.value || null })}>
            <option value="">All {author[3].length} works</option>
            {author[3].map(([id, t]) => <option key={id} value={id}>{t}</option>)}
          </select>
        </label>
      )}
      {!author && (
        <>
          <label>
            <span>Kind of writing</span>
            <select value={scope.f ?? ""} onChange={(e) => onChange({ ...scope, f: e.target.value === "" ? null : +e.target.value })}>
              <option value="">Any kind</option>
              {families.map(([id, [label]]) => <option key={id} value={id.slice(1)}>{label}</option>)}
            </select>
          </label>
          <label>
            <span>Period</span>
            <select value={scope.p ?? ""} onChange={(e) => onChange({ ...scope, p: e.target.value === "" ? null : +e.target.value })}>
              <option value="">Any period</option>
              {periods.map(([id, [label]]) => <option key={id} value={id.slice(1)}>{label}</option>)}
            </select>
          </label>
        </>
      )}
      <div className={styles.scopeBtns}>
        {!isAll && <button type="button" className="chip" onClick={() => onChange(EMPTY_SCOPE)}>Whole library</button>}
        {onClose && <button type="button" className="chip" onClick={onClose} aria-label="Stop comparing">✕ Stop comparing</button>}
      </div>
    </fieldset>
  );
}

// ------------------------------------------------------------ a ranking
const FIRST = 20;

function Ranking({ side, cat, label, words, rows, state, selected, onPick, register, comparing }: {
  side: "a" | "b"; cat: Category; label: string; words: number; rows: Shown[] | null; state: string;
  selected: string | null; onPick: (r: Shown) => void; register: Map<string, HTMLElement>; comparing: boolean;
}) {
  const [all, setAll] = useState(false);
  const motion = useSettings((s) => s.motion);
  const listRef = useRef<HTMLOListElement>(null);
  const prev = useRef(new Map<string, number>());
  const visible = rows ? (all ? rows : rows.slice(0, FIRST)) : [];
  const max = rows?.[0]?.n ?? 1;
  const signature = visible.map((r) => `${r.key}:${r.n}`).join("|");

  // FLIP: each row that was already shown slides from its old rank to its new one; new rows fade in
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top;
    const now = new Map<string, number>();
    const reduce = prefersReducedMotion(motion);
    let fresh = 0;
    for (const [k, el] of register) {
      if (!list.contains(el)) { register.delete(k); continue; }
      const y = el.getBoundingClientRect().top - top;
      now.set(k, y);
      if (reduce) continue;
      const was = prev.current.get(k);
      if (was === undefined) {
        el.animate([{ opacity: 0, transform: "translateX(-14px)" }, { opacity: 1, transform: "none" }],
          { duration: 420, delay: Math.min(fresh++ * 22, 440), easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "backwards" });
      } else if (Math.abs(was - y) > 1) {
        el.animate([{ transform: `translateY(${was - y}px)` }, { transform: "none" }], { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
      }
    }
    prev.current = now;
  }, [signature, register, motion]);

  const head = (
    <header className={styles.rankHead}>
      <p className="label">{cat.label} · {comparing ? (side === "a" ? "left" : "right") : "most mentioned"}</p>
      <h2>{label}</h2>
      <p className={styles.rankSub}>{fmt(words)} words{rows && rows.length > 0 && <> · top {fmt(rows.length)}</>}{comparing && <> · small figures per 10,000 words, to compare across</>}</p>
    </header>
  );
  if (state === "error") return <section className={styles.rank}>{head}<p className={styles.warn}>This list could not be loaded. Check the connection, then try again.</p></section>;
  if (!rows) return <section className={styles.rank} aria-busy="true">{head}<p className="muted"><span className={styles.spinner} aria-hidden="true" /> Counting…</p></section>;
  return (
    <section className={styles.rank} aria-label={`${cat.label} in ${label}`}>
      {head}
      {rows.length === 0 ? <p className={styles.empty}>No {cat.label.toLowerCase()} are counted here.</p> : (
        <ol ref={listRef} className={styles.rows}>
          {visible.map((r, i) => (
            <li key={r.key} ref={(el) => { if (el) register.set(r.key, el); }} data-key={r.key}>
              <button type="button" className={styles.row} aria-pressed={selected === r.key} onClick={() => onPick(r)}
                title={r.auto ? "Sorted automatically from GLAUx's tags, not checked by hand" : undefined}>
                <span className={styles.rankN}>{i + 1}</span>
                <span className={styles.word}>
                  <b lang="grc">{r.text}{r.auto && <span className={styles.auto} aria-label="(sorted automatically)">°</span>}</b>
                  {r.sub && <small>{r.sub}</small>}
                </span>
                <span className={styles.barCell}>
                  <span className={styles.bar} style={{ "--w": `${Math.max(0.6, (r.n / max) * 100)}%` } as React.CSSProperties} />
                  <span className={styles.count}>{fmt(r.n)}{comparing && <small>{fmtRate(rate(r.n, words))}/10k</small>}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {rows.length > FIRST && (
        <button type="button" className={`chip ${styles.more}`} onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? `Show the top ${FIRST}` : `Show all ${rows.length}`}
        </button>
      )}
    </section>
  );
}

// ------------------------------------------------------------ threads between the two columns
function Threads({ a, b, selected, deps }: { a: Map<string, HTMLElement>; b: Map<string, HTMLElement>; selected: string | null; deps: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ key: string; d: string }[]>([]);
  const [h, setH] = useState(0);
  useEffect(() => {
    const draw = () => {
      const svg = ref.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const out: { key: string; d: string }[] = [];
      for (const [k, ea] of a) {
        const eb = b.get(k);
        if (!eb || !ea.isConnected || !eb.isConnected) continue;
        const ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect();
        const ya = ra.top + ra.height / 2 - box.top, yb = rb.top + rb.height / 2 - box.top;
        const w = box.width;
        out.push({ key: k, d: `M0 ${ya.toFixed(1)} C${(w / 2).toFixed(1)} ${ya.toFixed(1)} ${(w / 2).toFixed(1)} ${yb.toFixed(1)} ${w} ${yb.toFixed(1)}` });
      }
      setH(box.height);
      setPaths(out);
    };
    // after the rows have slid into place
    const t = setTimeout(draw, 700);
    draw();
    const ro = new ResizeObserver(draw);
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [a, b, deps]);
  return (
    <svg ref={ref} className={styles.threads} aria-hidden="true" preserveAspectRatio="none" viewBox={`0 0 48 ${Math.max(1, h)}`}>
      {paths.map((p) => <path key={p.key} d={p.d} data-on={p.key === selected ? "" : undefined} pathLength={1} />)}
    </svg>
  );
}

function PanelHint({ cat }: { cat: Category }) {
  return (
    <div className={styles.hint}>
      <p className="label">Pick a {cat.one}</p>
      <p>Choose any row to see how its use changes over the periods, who mentions it most, and where it clusters in a work, with links to read every mention.</p>
      {(isName(cat.id) || cat.shelf === "things") && <p className={styles.fine}><span className={styles.auto}>°</span> marks a {cat.shelf === "things" ? "word" : "name"} sorted automatically from GLAUx&apos;s tags and not checked by hand.</p>}
    </div>
  );
}
