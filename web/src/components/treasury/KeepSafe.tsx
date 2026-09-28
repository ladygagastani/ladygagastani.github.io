"use client";
/** Export everything to one readable file, and restore from it (merging, never deleting). */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ImportProblem, exportHtml, parseExport } from "@/lib/treasury-io";
import { applyIncoming, gather, type ApplyReport } from "@/lib/treasury-apply";
import { loadMap } from "@/lib/map";
import { hasSavedSession, problem, useAccount } from "@/lib/community/client";
import { lastSynced, syncTreasury } from "@/lib/community/sync";
import { useLoad } from "@/lib/use-load";
import { plural, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";

const reportLines = (r: ApplyReport) => {
  const line = (what: string, x: { added: number; updated: number; unchanged: number }) =>
    `${what}: ${x.added} added, ${x.updated} updated to a newer copy, ${x.unchanged} already here.`;
  return [
    line("Marks and notes on passages", r.marks),
    line("Notes on authors and words", r.notes),
    line("Words in your review deck", r.deck),
    `Places you stopped reading: ${r.positions} updated.`,
    `Saved places on the map: ${r.places} added.`,
    ...(r.removed ? [`Deleted here because you deleted them on another device: ${r.removed}.`] : []),
  ];
};

export default function KeepSafe({ t, summary }: { t: TreasuryState; summary: string }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; lines: string[] } | null>(null);

  const download = async () => {
    setBusy(true);
    try {
      const d = await gather();
      const names = await loadMap().then((m) => new Map(m.places.map((p) => [p.id, `${p.grc} (${p.en.split("/")[0]})`])), () => new Map<string, string>());
      const html = exportHtml(d, t.idx, location.origin, (id) => names.get(id) ?? `Pleiades place ${id}`);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = `my-treasury-${d.exported.slice(0, 10)}.html`;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      setResult({ ok: true, lines: [`Saved ${a.download}. Open it in any browser to read it; keep it to restore from later.`] });
    } catch (e) {
      setResult({ ok: false, lines: [`The export failed: ${(e as Error).message}`] });
    } finally { setBusy(false); }
  };

  const restore = async (f: File) => {
    setBusy(true);
    try {
      const incoming = parseExport(await f.text());
      const r = await applyIncoming(incoming, t.setPositions);
      setResult({
        ok: true, lines: [
          `Restored from ${f.name}${incoming.exported ? ` (exported ${new Date(incoming.exported).toLocaleString("en-GB")})` : ""}.`,
          ...reportLines(r),
          ...(r.removed ? [] : ["Nothing already in this browser was deleted."]),
        ],
      });
    } catch (e) {
      setResult({ ok: false, lines: [e instanceof ImportProblem ? e.message : `The file could not be restored: ${(e as Error).message}`] });
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  };

  return (
    <aside className={styles.keep} aria-labelledby="keep-h">
      <div>
        <h2 id="keep-h">Keep your Treasury safe</h2>
        <p>Everything here lives in this browser: {summary}. Download it as one file that reads like a book in any browser,
          and restore from that file here, on this or another computer. Restoring adds what is missing and updates what is older.</p>
        <Sync t={t} onResult={setResult} lines={reportLines} />
      </div>
      <div className={styles.keepActs}>
        <button type="button" className="btn" onClick={download} disabled={busy}>Download my Treasury</button>
        <button type="button" className="btn ghost" onClick={() => file.current?.click()} disabled={busy}>Restore from a file</button>
        <input ref={file} type="file" accept=".html,.htm,.json,text/html,application/json" hidden aria-label="Choose a Treasury file to restore"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) restore(f); }} />
      </div>
      {result && (
        <div className={styles.keepResult} role="status" data-ok={result.ok}>
          {result.lines.map((l, i) => <p key={i}>{l}</p>)}
          {result.ok && result.lines.length > 1 && <p className="muted">{plural(t.marks.length, "mark")} in your Treasury now.</p>}
        </div>
      )}
    </aside>
  );
}

/** Keep in step with the account (only for members; Supabase is contacted only when signed in). */
function Sync({ t, onResult, lines }: { t: TreasuryState; onResult: (r: { ok: boolean; lines: string[] }) => void; lines: (r: ApplyReport) => string[] }) {
  const { session, start } = useAccount();
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => { if (hasSavedSession()) start(); }, [start]);
  const uid = session?.user.id;
  // once, when the Treasury opens for a signed-in member
  const auto = useLoad(`treasury-sync|${uid}`, () => syncTreasury(uid!, t.setPositions), !!uid);
  const run = async () => {
    if (!uid) return;
    setBusy(true);
    try {
      const { report, at } = await syncTreasury(uid, t.setPositions);
      setLast(at);
      onResult({ ok: true, lines: [`In step with your account (${new Date(at).toLocaleString("en-GB")}).`, ...(report ? lines(report) : ["Your account had no copy yet; this browser's Treasury is now saved there."])] });
    } catch (e) { onResult({ ok: false, lines: [`Could not keep in step: ${problem(e)}`] }); } finally { setBusy(false); }
  };
  if (!session) return <p className={styles.small}><Link href="/account?next=/treasury">Sign in</Link> to keep your Treasury in step between your devices.</p>;
  const shown = last ?? (auto.state === "done" ? auto.value.at : lastSynced());
  const brought = auto.state === "done" && auto.value.report ? auto.value.report : null;
  const changes = brought ? brought.marks.added + brought.marks.updated + brought.notes.added + brought.notes.updated + brought.removed : 0;
  return (
    <p className={styles.small}>
      <button type="button" className="chip" onClick={run} disabled={busy || auto.state === "loading"}>{busy || auto.state === "loading" ? "Keeping in step…" : "Keep in step now"}</button>{" "}
      {auto.state === "error" ? `Could not keep in step: ${problem(auto.message)}. ` : ""}
      Kept in step with your account{shown ? `, last on ${new Date(shown).toLocaleString("en-GB")}` : ""}{changes ? ` (${changes} changes from your other devices)` : ""}.
      A deletion here is deleted on your other devices too.
    </p>
  );
}
