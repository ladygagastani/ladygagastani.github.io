/**
 * The searches made here, newest first, for Quick search's empty state and the Oracle. Kept only in this
 * browser (localStorage), never sent anywhere; listed on the Privacy page.
 */
const KEY = "mathesis:searches";
export const MAX_RECENT = 8;

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}
function write(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
}

export const recentSearches = (): string[] => read();

/** Remember a search; the same words (ignoring case and spaces at the ends) move to the top instead of repeating. */
export function addRecentSearch(q: string): string[] {
  const t = q.trim().replace(/\s+/g, " ");
  if (!t) return read();
  const same = (x: string) => x.toLocaleLowerCase() === t.toLocaleLowerCase();
  const list = [t, ...read().filter((x) => !same(x))].slice(0, MAX_RECENT);
  write(list);
  return list;
}

export function removeRecentSearch(q: string): string[] {
  const list = read().filter((x) => x !== q);
  write(list);
  return list;
}

export function clearRecentSearches(): string[] {
  write([]);
  return [];
}
