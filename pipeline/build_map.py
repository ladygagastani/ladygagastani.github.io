"""
Build the Periplus map's data (web/public/data/map/):

  base.json    the sea, lakes and rivers of the ancient Mediterranean world, simplified for the web,
               from the Ancient World Mapping Center's geodata (github.com/AWMC/geodata, ODbL 1.0,
               derived from the Barrington Atlas of the Greek and Roman World).
  places.json  the places the library mentions: Pleiades places (pleiades.stoa.org, CC BY 3.0)
               matched to the proper names in GLAUx's word analyses, with how often each work
               names them.
and, in pipeline/.cache/map/names.json, every capitalised dictionary word in GLAUx with its count in
each work (what places.json is matched from; the Census builds on it).

How places are matched (stated on the map page):
  A GLAUx dictionary word written with a capital (a name) is matched to Pleiades when it is the same
  word as a Greek name Pleiades records for a located place (accents, breathings and capitals
  ignored). Where several places share the name, the one Pleiades connects most other places to is
  chosen, and the others are counted. Names that belong mainly to a person or a god rather than the
  place of the same name (Κῦρος the king, not the river) are listed in NOT_PLACES and left out.

Needs: web/public/data/words (python pipeline/build_words.py) and network access for the first run
(the downloads are cached in pipeline/.cache/map).

Usage:  python pipeline/build_map.py
"""
import collections
import csv
import gzip
import json
import math
import os
import struct
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "map"
WORDS = ROOT / "web" / "public" / "data" / "words"
OUT = ROOT / "web" / "public" / "data" / "map"

AWMC = "https://raw.githubusercontent.com/AWMC/geodata/master/"
DOWNLOADS = {
    "open_water_base.shp": AWMC + "Physical%20Data/open_water_awmc_work/openwater_base/open_water_base.shp",
    "inland-water-OSM.geojson": AWMC + "Physical%20Data/inland_water/inland-water-OSM.geojson",
    "pleiades-places.csv.gz": "https://atlantides.org/downloads/pleiades/dumps/pleiades-places-latest.csv.gz",
    "pleiades-names.csv.gz": "https://atlantides.org/downloads/pleiades/dumps/pleiades-names-latest.csv.gz",
}

# The map's extent: the Mediterranean, the Black Sea, the Near East as far as Mesopotamia.
WEST, SOUTH, EAST, NORTH = -11.0, 22.0, 50.0, 48.5
TOLERANCE = 0.012   # degrees (about a kilometre) for simplifying outlines
MIN_LAKE = 0.0015   # square degrees: smaller lakes are left out

# Names that GLAUx uses mostly for a person, god or people rather than for the place of the same
# name, or that are too ambiguous to place. Reviewed by hand from the top of the matched list.
NOT_PLACES = {
    "Κῦρος",      # the Persian kings, not the river Kyros
    "Κάδμος",     # the founder of Thebes, not Mount Kadmos
    "Ἰνδός",      # mostly "an Indian"
    "Παῦλος", "Πάτροκλος", "Μάριος", "Καλλιρρόη", "Ἄνθεια", "Λύκος", "Κόρα", "Ξάνθος",   # people (and a horse)
    "Σύρος", "Μάγνης",                 # "a Syrian", "a Magnesian", not the island Syros or the region
    "Ἡράκλεια",   # a dozen places of this name; the texts cannot tell which
    "Εὐρώπη",     # the continent (and the princess), not a place a map can mark
    "Φεραῖος", "Θήβη", "Δάρδανος", "Ἄδωνις", "Ἀσωπός", "Τελαμών", "Βίας", "Ἀρσινόη", "Ἠλέκτρα", "Βερενίκη",
    "Κοίλη", "Πυρήνη", "Εὔα", "Στοά", "Λεία", "Ἀδράστεια", "Ἑσπερίς", "Δάφνη", "Ἀβιά", "Ἴκαρος",   # mostly people, gods or common words
    "Ἀθήνη", "Ἥρα", "Ἑρμῆς", "Ἀπόλλων", "Ἄρης", "Ποσειδῶν", "Ζεύς", "Διόνυσος", "Ἄρτεμις", "Ἀφροδίτη", "Δημήτηρ",
    "Ἡρακλῆς", "Ἀσκληπιός", "Πάν", "Ἥφαιστος", "Ἑστία",
    "Ὄφις", "Κρατήρ",   # mostly the constellations Serpent and Crater (Hipparchus on Aratus), not the river or the bay
    "Ὀδρύσης", "Περραιβοί",   # peoples (the Census), not the river Odryses or the region
    "Ἀμυμώνη", "Πόρος", "Λίμνη", "Γορτύνιος",   # the nymph; Poros "Resource" (Plato, Plotinus); "the Lake"; "of Gortyn"
    "Ἰησοῦς", "Χριστός", "Ἰσραήλ", "Μωϋσῆς", "Δαυίδ", "Ἰούδας",
    "Ἀλέξανδρος", "Φίλιππος", "Καῖσαρ", "Ἀντώνιος", "Πομπήϊος", "Ὅμηρος", "Πλάτων", "Σωκράτης",
}

# Every place mentioned at least this often was looked at by hand (the rest are matched automatically,
# and the map says so).
CHECKED_MIN = 52

# Names checked by hand and tied to one Pleiades place. For regions and rivers whose Pleiades point
# falls outside the map or in an odd spot, a position (longitude, latitude) is given where the map
# writes the name; such places are marked "position approximate".
OVERRIDES = {
    "Ἑλλάς": ("1001896", 22.4, 38.9), "Αἴγυπτος": ("981503", 31.0, 29.2), "Ἀσία": ("837", 31.0, 39.0),
    "Λιβύη": ("716588", 24.0, 29.8), "Συρία": ("981550", 37.2, 34.8), "Μακεδονία": ("668537581",),
    "Θρᾴκη": ("501638",), "Σκυθία": ("1273",), "Νεῖλος": ("727172", 31.1, 28.2), "Ἀλεξάνδρεια": ("727070",),
    "Κύπρος": ("707498",), "Περσίς": ("922698",), "Μηδία": ("903080",), "Βαβυλωνία": ("912816",),
    "Ἀσσυρία": ("29492",), "Θεσσαλία": ("1332",), "Φοινίκη": ("678334",), "Ἀραβία": ("29475", 42.0, 25.5),
    "Ἰταλία": ("1052",), "Σικελία": ("462492",), "Μεσσήνη": ("570479",), "Πόντος": ("1224",),
    "Κολχίς": ("863770",), "Φᾶσις": ("857276",), "Τίγρις": ("912964",), "Ἅλυς": ("857148",),
    "Μαίανδρος": ("599777",), "Σκάμανδρος": ("550871",), "Ἀχελῷος": ("530768",), "Εὐρώτας": ("570248",),
    "Στρυμών": ("501629",), "Πηνειός": ("541022",), "Ἴδη": ("550592",), "Παρνασσός": ("541012",),
    "Ἑλικών": ("540808",), "Κιθαιρών": ("540714",), "Ταΰγετος": ("570706",), "Ἄθως": ("501366",),
    "Οἴτη": ("540968",), "Πίνδος": ("541062",), "Προποντίς": ("511381",), "Μῆλος": ("570475",),
    "Νάξος": ("599822",), "Πάρος": ("599868",), "Σαλαμίς": ("580101",), "Σαμοθρᾴκη": ("501597",),
    "Μυκῆναι": ("570491",), "Ἐλευσίς": ("579920",), "Νεμέα": ("570504",), "Κυρήνη": ("373778",),
    "Καρχηδών": ("314921",), "Μέμφις": ("736963",), "Βυζάντιον": ("520985",), "Ὄλυνθος": ("491678",),
    "Πέλλα": ("491687",), "Σφακτηρία": ("570686",), "Σούνιον": ("580107",), "Καρία": ("599564",),
    "Λυδία": ("550701",), "Φρυγία": ("907036116",), "Λυκία": ("638965",), "Κιλικία": ("658440",),
    "Καππαδοκία": ("628949",), "Παφλαγονία": ("845034",), "Βιθυνία": ("511189",), "Μυσία": ("550759",),
    "Ἀρμενία": ("874350",), "Αἰολίς": ("550406",), "Δωρίς": ("540740",), "Μεσσηνία": ("570480",),
    "Ἦλις": ("570221",), "Ἀργολίς": ("570104",), "Μεγαρίς": ("570470",), "Φωκίς": ("541048",),
    "Χαλκιδική": ("491561",), "Ἰλλυρίς": ("481865",), "Ἰβηρία": ("540456066",), "Καμπανία": ("432742",),
    "Λάτιον": ("432900",), "Νουμιδία": ("305120",), "Χαλκίς": ("540703",), "Ὀρχομενός": ("540987",),
    "Κλείτωρ": ("570359",),   # the Arcadian town (Pausanias, Polybius); Pleiades gives only the river a Greek name
    "Φεραί": ("541044",), "Κάϊκος": ("550491",), "Ἄνδρος": ("589693",),
}

def download():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, url in DOWNLOADS.items():
        f = CACHE / name
        if not f.exists():
            print("downloading", name)
            req = urllib.request.Request(url, headers={"User-Agent": "mathesis-stoicheion (non-commercial; map build)"})
            f.write_bytes(urllib.request.urlopen(req, timeout=300).read())


# ------------------------------------------------------------------ geometry
def read_shp_polygons(path):
    """The rings of every polygon in an ESRI shapefile (shape types 5 and 15)."""
    data = path.read_bytes()
    pos, rings = 100, []
    while pos < len(data):
        _, length = struct.unpack(">ii", data[pos:pos + 8])
        rec = data[pos + 8: pos + 8 + length * 2]
        pos += 8 + length * 2
        stype = struct.unpack("<i", rec[:4])[0]
        if stype not in (5, 15):
            continue
        nparts, npoints = struct.unpack("<ii", rec[36:44])
        parts = list(struct.unpack(f"<{nparts}i", rec[44:44 + 4 * nparts]))
        pts_at = 44 + 4 * nparts
        pts = [struct.unpack("<dd", rec[pts_at + 16 * i: pts_at + 16 * i + 16]) for i in range(npoints)]
        for k, start in enumerate(parts):
            end = parts[k + 1] if k + 1 < nparts else npoints
            rings.append(pts[start:end])
    return rings


def simplify(pts, tol):
    """Douglas-Peucker, iterative."""
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        norm = math.hypot(dx, dy) or 1e-12
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            x, y = pts[i]
            d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm if (dx or dy) else math.hypot(x - x1, y - y1)
            if d > best:
                best, idx = d, i
        if best > tol and idx > 0:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]


def in_view(ring):
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    return max(xs) > WEST and min(xs) < EAST and max(ys) > SOUTH and min(ys) < NORTH


def area(ring):
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]))) / 2


def pack(ring):
    """A ring as a flat list of rounded coordinates (3 decimals ≈ 100 m)."""
    out = []
    for x, y in ring:
        out += [round(x, 3), round(y, 3)]
    return out


def build_base():
    water = []
    for ring in read_shp_polygons(CACHE / "open_water_base.shp"):
        if not in_view(ring):
            continue
        s = simplify(ring, TOLERANCE)
        if len(s) >= 4 and area(s) > 0.0004:
            water.append(pack(s))
    lakes = []
    for ft in json.load(open(CACHE / "inland-water-OSM.geojson", encoding="utf-8"))["features"]:
        g = ft.get("geometry") or {}
        if (ft.get("properties") or {}).get("TYPE") not in ("lake", "lagoon", "reservoir", None):
            continue
        polys = g.get("coordinates") or []
        for poly in polys if g.get("type") == "MultiPolygon" else [polys]:
            ring = [tuple(p[:2]) for p in poly[0]] if poly else []
            if len(ring) < 4 or not in_view(ring) or area(ring) < MIN_LAKE:
                continue
            s = simplify(ring, TOLERANCE)
            if len(s) >= 4:
                lakes.append(pack(s))
    return {"bbox": [WEST, SOUTH, EAST, NORTH], "water": water, "lakes": lakes,
            "source": "Ancient World Mapping Center, geodata (github.com/AWMC/geodata), ODbL 1.0; derived from the Barrington Atlas"}


# ------------------------------------------------------------------ names in the texts
def count_names():
    counts = collections.defaultdict(collections.Counter)
    for f in sorted(WORDS.glob("*.json")):
        if f.name.startswith("_"):
            continue
        p = json.load(open(f, encoding="utf-8"))
        lem = p["lemmas"]
        c = collections.Counter(i for u in p["units"] for i in u[3])
        for i, n in c.items():
            if lem[i][:1].isupper() and len(lem[i]) > 1 and any(ch.islower() for ch in lem[i]):
                counts[unicodedata.normalize("NFC", lem[i])][p["work"]] += n
    return counts


def fold(s):
    s = unicodedata.normalize("NFD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch)).lower().replace("ς", "σ")
    return "".join(ch for ch in s if ch.isalpha())


# ------------------------------------------------------------------ Pleiades
def read_pleiades():
    """Located Pleiades places: those on the map (matched by name) and every one (for OVERRIDES)."""
    places, every = {}, {}
    for r in csv.DictReader(gzip.open(CACHE / "pleiades-places.csv.gz", "rt", encoding="utf-8")):
        try:
            lat, lon = float(r["reprLat"]), float(r["reprLong"])
        except ValueError:
            continue
        conn = len([x for x in (r["hasConnectionsWith"] or "").split(",") if x.strip()])
        every[r["id"]] = {"id": r["id"], "en": r["title"], "lat": round(lat, 4), "lon": round(lon, 4),
                          "types": [t.strip() for t in r["featureTypes"].split(",") if t.strip()], "conn": conn,
                          "precision": r["locationPrecision"]}
        if WEST <= lon <= EAST and SOUTH <= lat <= NORTH:
            places[r["id"]] = every[r["id"]]
    by_name = collections.defaultdict(set)
    for r in csv.DictReader(gzip.open(CACHE / "pleiades-names.csv.gz", "rt", encoding="utf-8")):
        pid = r["pid"].rsplit("/", 1)[-1]
        if pid not in places or r["nameLanguage"] not in ("grc", "grc-latn", "el"):
            continue
        for n in r["nameAttested"].replace(";", ",").split(","):
            k = fold(n.strip())
            if len(k) > 2 and any("Ͱ" <= ch <= "Ͽ" or "ἀ" <= ch <= "῿" for ch in n):
                by_name[k].add(pid)
    return places, by_name, every


WEIGHT = {"settlement": 6, "urban": 6, "island": 6, "region": 5, "river": 5, "mountain": 4, "sanctuary": 4,
          "peninsula": 4, "water-open": 4, "state": 3, "province": 2, "province-2": 2}


def rank(p):
    """Which of several places with the same name the texts most likely mean."""
    w = max([WEIGHT.get(t.strip(), 0) for t in p["types"]] + [0])
    return (w, p["precision"] in ("precise", "related"), p["conn"])


TYPE_RANK = ["settlement", "island", "region", "river", "mountain", "sanctuary", "temple", "cape", "bay", "lake",
             "people", "province", "port", "fort", "sea", "plain", "strait", "pass"]


def type_of(p):
    for t in TYPE_RANK:
        if t in p["types"]:
            return t
    return p["types"][0] if p["types"] else "place"


def main():
    download()
    OUT.mkdir(parents=True, exist_ok=True)

    base = build_base()
    (OUT / "base.json").write_text(json.dumps(base, separators=(",", ":")), encoding="utf-8")
    print("base:", len(base["water"]), "water rings,", len(base["lakes"]), "lakes,", round((OUT / "base.json").stat().st_size / 1e6, 2), "MB")

    names = count_names()
    (CACHE / "names.json").write_text(json.dumps({k: dict(v.most_common()) for k, v in names.items()}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    places, by_name, all_places = read_pleiades()
    out = []
    for lemma, works in names.items():
        if lemma in NOT_PLACES:
            continue
        cands = [places[i] for i in by_name.get(fold(lemma), ())]
        ov = OVERRIDES.get(lemma)
        if ov:
            best = places.get(ov[0]) or all_places[ov[0]]
            pos = (ov[1], ov[2]) if len(ov) == 3 else (best["lon"], best["lat"])
        elif cands:
            cands.sort(key=rank, reverse=True)
            best, pos = cands[0], (cands[0]["lon"], cands[0]["lat"])
        else:
            continue
        total = sum(works.values())
        p = {"id": best["id"], "grc": lemma, "en": best["en"], "lat": round(pos[1], 4), "lon": round(pos[0], 4),
             "type": type_of(best), "n": total, "w": [[w, c] for w, c in works.most_common(12)],
             "works": len(works), "alt": len([c for c in cands if c["id"] != best["id"]])}
        if ov or total >= CHECKED_MIN:
            p["checked"] = True
        if ov:
            if len(ov) == 3:
                p["approx"] = True
        if p["type"] == "people":
            continue          # peoples belong to the Census, not the map
        out.append(p)
    # one entry per Pleiades place: if two dictionary words land on the same place, keep both counts
    merged = {}
    for p in sorted(out, key=lambda p: -p["n"]):
        m = merged.get(p["id"])
        if m:
            m["n"] += p["n"]
            m["also"] = m.get("also", []) + [p["grc"]]
        else:
            merged[p["id"]] = p
    final = sorted(merged.values(), key=lambda p: -p["n"])
    for p in final:
        if p["n"] >= CHECKED_MIN and not p.get("checked"):
            print("NOT CHECKED YET (over the cut-off after merging names):", p["grc"], p["en"], p["n"])
    meta = {"source": "Pleiades (pleiades.stoa.org), CC BY 3.0; counts from GLAUx (CC BY-SA 4.0)",
            "names": len(names), "matched": len(final), "checked": sum(1 for p in final if p.get("checked")),
            "checkedMin": CHECKED_MIN, "not_places": sorted(NOT_PLACES)}
    (OUT / "places.json").write_text(json.dumps({"meta": meta, "places": final}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("places:", len(final), "matched;", round((OUT / "places.json").stat().st_size / 1e6, 2), "MB")
    for p in final[:80]:
        print(f'{p["n"]:6} {p["grc"]:14} {p["en"][:30]:30} {p["type"]:10} alt={p["alt"]}')


if __name__ == "__main__":
    main()
