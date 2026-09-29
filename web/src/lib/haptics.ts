import { useSettings } from "./settings";

/**
 * A short vibration to confirm something worked: a save, a bookmark, a right answer (Phase 10, owner's
 * choice). Only phones that let websites vibrate will feel it (Android; iPhones do not allow it), only
 * after the reader has touched the page (browsers require that), and never when "Short vibrations" is
 * off in Settings.
 */
export type Buzz = "done" | "right" | "wrong";
const PATTERN: Record<Buzz, number | number[]> = { done: 12, right: [10, 40, 14], wrong: 30 };

export const canVibrate = () => typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

export function buzz(kind: Buzz = "done") {
  if (!canVibrate() || !useSettings.getState().vibrate) return;
  try { navigator.vibrate(PATTERN[kind]); } catch { /* not allowed here */ }
}
