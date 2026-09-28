/**
 * What the reader deleted, and when (localStorage "mathesis:deleted": id → time). Syncing between
 * devices carries this list, so a note deleted on one device is deleted on the others instead of
 * coming back from their copy. A record written again after its deletion (a newer "updated") wins.
 */
const KEY = "mathesis:deleted";

export function deletions(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number>; } catch { return {}; }
}
export function setDeletions(d: Record<string, number>) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage full or blocked: deletions just won't travel */ }
}
export function recordDeletion(id: string) {
  setDeletions({ ...deletions(), [id]: Date.now() });
}
/** Both lists together, keeping the later time for each id. */
export function mergeDeletions(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [id, t] of Object.entries(b)) if (!(id in out) || out[id] < t) out[id] = t;
  return out;
}
