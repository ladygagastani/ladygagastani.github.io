"use client";
/**
 * Gather everything the reader has made in this browser, and merge in a copy from elsewhere (a
 * restored file, or the account's copy when syncing). Merging adds what is missing and replaces a
 * record only with a newer copy of itself; deletions travel with the data and win over older copies.
 */
import { allMarks, allPageNotes, deleteAll, putAll, useMarks, usePageNotes } from "./annotations";
import { useAcademy } from "./academy";
import { allPositions, setAllPositions, type Position } from "./position";
import { loadSavedPlaces, useSavedPlaces } from "./map";
import { deletions, mergeDeletions, setDeletions } from "./tombstones";
import { EXPORT_APP, EXPORT_FORMAT, mergeAcademy, mergeById, mergePositions, type MergeReport, type TreasuryData } from "./treasury-io";

export async function gather(): Promise<TreasuryData> {
  await useAcademy.persist.rehydrate();
  await loadSavedPlaces();
  const { completed, days, deck } = useAcademy.getState();
  return {
    app: EXPORT_APP, format: EXPORT_FORMAT, exported: new Date().toISOString(),
    marks: await allMarks(), notes: await allPageNotes(),
    academy: { completed, days, deck }, positions: allPositions(), places: useSavedPlaces.getState().saved,
    deleted: deletions(),
  };
}

export interface ApplyReport { marks: MergeReport; notes: MergeReport; deck: MergeReport; positions: number; places: number; removed: number }

export async function applyIncoming(incoming: TreasuryData, onPositions?: (p: Record<string, Position>) => void): Promise<ApplyReport> {
  const mine = await gather();
  const dead = mergeDeletions(mine.deleted ?? {}, incoming.deleted ?? {});
  const alive = <T extends { id: string; updated: number }>(xs: T[]) => xs.filter((x) => !(x.id in dead) || x.updated > dead[x.id]);
  const marks = mergeById(alive(mine.marks), alive(incoming.marks));
  const notes = mergeById(alive(mine.notes), alive(incoming.notes));
  // records here that were deleted elsewhere (after their last change)
  const gone = [...mine.marks, ...mine.notes].filter((x) => x.id in dead && x.updated <= dead[x.id]).map((x) => x.id);
  await putAll(marks.write, notes.write);
  if (gone.length) await deleteAll(gone);
  setDeletions(dead);
  const { academy, report: deck } = mergeAcademy(mine.academy, incoming.academy);
  useAcademy.setState(academy);
  const pos = mergePositions(mine.positions, incoming.positions);
  setAllPositions(pos.positions);
  onPositions?.(pos.positions);
  await useMarks.getState().loadAll();
  await usePageNotes.getState().load();
  const places = useSavedPlaces.getState().merge(incoming.places ?? {});
  return { marks: marks.report, notes: notes.report, deck, positions: pos.changed, places, removed: gone.length };
}
