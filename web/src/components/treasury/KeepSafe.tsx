"use client";
/** Export everything to one readable file, and restore from it (merging, never deleting). */
import { useRef, useState } from "react";
import { allMarks, allPageNotes, putAll, useMarks, usePageNotes } from "@/lib/annotations";
import { useAcademy } from "@/lib/academy";
import { allPositions, setAllPositions } from "@/lib/position";
import {
  EXPORT_APP, EXPORT_FORMAT, ImportProblem, exportHtml, mergeAcademy, mergeById, mergePositions, parseExport, type TreasuryData,
} from "@/lib/treasury-io";
import { loadMap, loadSavedPlaces, useSavedPlaces } from "@/lib/map";
import { plural, type TreasuryState } from "./data";
import styles from "./Treasury.module.css";

async function gather(): Promise<TreasuryData> {
  await useAcademy.persist.rehydrate();
  await loadSavedPlaces();
  const { completed, days, deck } = useAcademy.getState();
  return {
    app: EXPORT_APP, format: EXPORT_FORMAT, exported: new Date().toISOString(),
    marks: await allMarks(), notes: await allPageNotes(),
    academy: { completed, days, deck }, positions: allPositions(), places: useSavedPlaces.getState().saved,
  };
}

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
      const mine = await gather();
      const marks = mergeById(mine.marks, incoming.marks);
      const notes = mergeById(mine.notes, incoming.notes);
      await putAll(marks.write, notes.write);
      const { academy, report: deck } = mergeAcademy(mine.academy, incoming.academy);
      useAcademy.setState(academy);
      const pos = mergePositions(mine.positions, incoming.positions);
      setAllPositions(pos.positions);
      await useMarks.getState().loadAll();
      await usePageNotes.getState().load();
      t.setPositions(pos.positions);
      const placesAdded = useSavedPlaces.getState().merge(incoming.places ?? {});
      const line = (what: string, r: { added: number; updated: number; unchanged: number }) =>
        `${what}: ${r.added} added, ${r.updated} updated to a newer copy, ${r.unchanged} already here.`;
      setResult({
        ok: true, lines: [
          `Restored from ${f.name}${incoming.exported ? ` (exported ${new Date(incoming.exported).toLocaleString("en-GB")})` : ""}.`,
          line("Marks and notes on passages", marks.report),
          line("Notes on authors and words", notes.report),
          line("Words in your review deck", deck),
          `Places you stopped reading: ${pos.changed} updated.`,
          `Saved places on the map: ${placesAdded} added.`,
          "Nothing already in this browser was deleted.",
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
        <p>Everything here lives only in this browser: {summary}. Nothing is sent anywhere.
          Download it as one file that reads like a book in any browser, and restore from that file here, on this or another computer.
          Restoring adds what is missing and updates what is older; it never deletes.</p>
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
