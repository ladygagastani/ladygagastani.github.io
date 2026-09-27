/**
 * The Periplus map's data and geometry. Built by pipeline/build_map.py into public/data/map/:
 * base.json (sea and lakes, from the Ancient World Mapping Center's geodata) and places.json
 * (Pleiades places matched to the names in GLAUx's word analyses, with counts per work).
 *
 * The projection is a simple equirectangular one, squeezed east–west by the cosine of 38°N (the
 * middle of the Greek world), which keeps shapes right across the Mediterranean.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export interface Base { bbox: [number, number, number, number]; water: number[][]; lakes: number[][]; source: string }
export interface Place {
  id: string;             // Pleiades id
  grc: string;            // the dictionary word in GLAUx
  en: string;             // Pleiades' title
  lat: number; lon: number;
  type: string;           // settlement, island, region, river…
  n: number;              // mentions in the library (GLAUx)
  works: number;          // in how many works
  w: [string, number][];  // the works that name it most, with counts
  alt: number;            // other Pleiades places with the same name
  checked?: boolean;      // looked at by hand
  approx?: boolean;       // the position is where the map writes a region's or river's name
  also?: string[];        // other dictionary words matched to the same place
}
export interface PlacesMeta { source: string; names: number; matched: number; checked: number; checkedMin: number; not_places: string[] }

const COS = Math.cos((38 * Math.PI) / 180);
export const SCALE = 100;   // map units per degree of latitude

export function project(base: Base, lon: number, lat: number): [number, number] {
  const [west, , , north] = base.bbox;
  return [(lon - west) * COS * SCALE, (north - lat) * SCALE];
}
export function mapSize(base: Base): [number, number] {
  const [west, south, east, north] = base.bbox;
  return [(east - west) * COS * SCALE, (north - south) * SCALE];
}

/** An SVG path for a list of flat [lon, lat, lon, lat…] rings. */
export function ringsPath(base: Base, rings: number[][]): string {
  let d = "";
  for (const r of rings) {
    for (let i = 0; i < r.length; i += 2) {
      const [x, y] = project(base, r[i], r[i + 1]);
      d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += "Z";
  }
  return d;
}

let placesCache: Promise<{ meta: PlacesMeta; places: Place[] }> | null = null;
/** The places alone (for the word look-up, which does not need the sea). */
export function loadPlaces() {
  placesCache ??= fetch("/data/map/places.json")
    .then((r) => { if (!r.ok) throw new Error(`places ${r.status}`); return r.json() as Promise<{ meta: PlacesMeta; places: Place[] }>; })
    .catch((e) => { placesCache = null; throw e; });
  return placesCache;
}

let cache: Promise<{ base: Base; places: Place[]; meta: PlacesMeta }> | null = null;
export function loadMap() {
  cache ??= Promise.all([
    fetch("/data/map/base.json").then((r) => { if (!r.ok) throw new Error(`base ${r.status}`); return r.json() as Promise<Base>; }),
    loadPlaces(),
  ]).then(([base, p]) => ({ base, places: p.places, meta: p.meta })).catch((e) => { cache = null; throw e; });
  return cache;
}

let byName: Promise<Map<string, Place>> | null = null;
/** The place a dictionary word names, if it is on the map (Σπάρτη → Sparta). */
export function placeNamed(lemma: string): Promise<Place | null> {
  byName ??= loadPlaces().then(({ places }) => {
    const m = new Map<string, Place>();
    for (const p of places) for (const n of [p.grc, ...(p.also ?? [])]) if (!m.has(n)) m.set(n, p);
    return m;
  });
  return byName.then((m) => m.get(lemma.normalize("NFC")) ?? null, () => null);
}

export const TYPE_LABEL: Record<string, string> = {
  settlement: "City or town", urban: "City", island: "Island", region: "Region", river: "River", mountain: "Mountain",
  sanctuary: "Sanctuary", peninsula: "Peninsula", "water-open": "Sea or strait", state: "Kingdom", province: "Province",
  "province-2": "Province", cape: "Cape", bay: "Bay", lake: "Lake", fort: "Fort", "fort-2": "Fort", valley: "Valley",
};
export const typeLabel = (t: string) => TYPE_LABEL[t] ?? t.replace(/-\d$/, "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** The kinds a reader can filter by, and the place types in each. */
export const KINDS: { id: string; label: string; types: string[] }[] = [
  { id: "city", label: "Cities", types: ["settlement", "urban", "fort", "fort-2", "port"] },
  { id: "island", label: "Islands", types: ["island"] },
  { id: "region", label: "Regions", types: ["region", "state", "province", "province-2", "peninsula", "label"] },
  { id: "water", label: "Rivers and seas", types: ["river", "water-open", "lake", "bay", "strait"] },
  { id: "mountain", label: "Mountains", types: ["mountain", "hill", "cape", "pass", "valley"] },
  { id: "sacred", label: "Sanctuaries", types: ["sanctuary", "temple", "temple-2", "shrine", "oracle"] },
];
export const kindOf = (t: string) => KINDS.find((k) => k.types.includes(t))?.id ?? "other";

// localStorage that never throws (private windows, blocked storage)
const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* not saved */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

/** The reader's saved places (the Treasury's Places), kept in this browser. */
interface SavedPlaces { saved: Record<string, number>; toggle: (id: string) => void; merge: (ids: Record<string, number>) => number }
export const useSavedPlaces = create<SavedPlaces>()(persist((set, get) => ({
  saved: {},
  toggle(id) {
    const saved = { ...get().saved };
    if (saved[id]) delete saved[id]; else saved[id] = Date.now();
    set({ saved });
  },
  merge(ids) {
    const saved = { ...get().saved };
    let added = 0;
    for (const [id, t] of Object.entries(ids)) if (!saved[id]) { saved[id] = t; added++; }
    set({ saved });
    return added;
  },
}), { name: "mathesis:places", storage: createJSONStorage(() => safe), partialize: (s) => ({ saved: s.saved }), skipHydration: true }));

/** Read the saved places from this browser (call once, from an effect, on pages that show them). */
export const loadSavedPlaces = () => useSavedPlaces.persist.rehydrate();
