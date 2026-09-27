/** Where the reader stopped in each work, kept on this device (localStorage). */
export interface Position { ed: string; tr: string | null; at: string; t: number }
const KEY = "mathesis:positions";

function all(): Record<string, Position> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export const getPosition = (work: string): Position | null => all()[work] ?? null;
export function savePosition(work: string, p: Omit<Position, "t">) {
  try {
    const a = all();
    a[work] = { ...p, t: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch { /* storage unavailable: nothing to remember */ }
}
/** Most recently read works, newest first (for "Continue reading"). */
export const recentPositions = (n = 6) => Object.entries(all()).sort((a, b) => b[1].t - a[1].t).slice(0, n);
/** Every remembered position (for export). */
export const allPositions = (): Record<string, Position> => all();
/** Replace every remembered position (restoring an export, after merging). */
export function setAllPositions(p: Record<string, Position>) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
}
