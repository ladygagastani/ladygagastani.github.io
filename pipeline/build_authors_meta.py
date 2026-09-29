"""
Build web/public/data/authors-meta.json from Wikidata (CC0): for every catalogue author that has a
"TLG author ID" (property P3576), the dates (birth, death, floruit), a one-line description, the place
of birth, occupations and the English Wikipedia page. Nothing is written by hand.

Keyed by the catalogue's author id ("tlg0012"). Wikidata stores the TLG number without the "tlg".
Years are historical years (negative = BC, no year 0); "prec" is Wikidata's precision (9 year, 8 decade, 7 century,
6 millennium), so the site can say "approximately" where the source does.

Usage:  python pipeline/build_authors_meta.py        (needs a connection to query.wikidata.org)
"""
import json
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
OUT = ROOT / "web" / "public" / "data" / "authors-meta.json"
UA = {"User-Agent": "MathesisStoicheion/0.1 (learning site; mathesis.stoicheion@gmail.com)", "Accept": "application/sparql-results+json"}


def sparql(query: str) -> list[dict]:
    url = "https://query.wikidata.org/sparql?format=json&query=" + urllib.parse.quote(query)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
        return json.load(r)["results"]["bindings"]


def year(v: str, prec: int) -> int:
    """Wikidata's query service counts BC years astronomically (year 0 = 1 BC), so 496 BC arrives as -495
    (checked against Sophocles, Aristotle, Euripides). For exact years, return the historical year
    (-496); decade and century values are approximate anyway and are kept as given."""
    m = re.match(r"(-?)(\d+)-", v)
    y = int(m.group(2))
    if not m.group(1):
        return y
    return -(y + 1) if prec >= 9 else -y


# birth, death and floruit each with the precision Wikidata records for them
def dates_query(pid: str) -> str:
    return f"""SELECT ?item ?tlg ?t ?prec WHERE {{
  ?item wdt:P3576 ?tlg .
  ?item p:{pid}/psv:{pid} ?v . ?v wikibase:timeValue ?t ; wikibase:timePrecision ?prec .
}}"""


INFO = """SELECT ?item ?tlg ?desc ?placeLabel ?occLabel ?wp WHERE {
  ?item wdt:P3576 ?tlg .
  OPTIONAL { ?item schema:description ?desc . FILTER(LANG(?desc) = "en") }
  OPTIONAL { ?item wdt:P19 ?place }
  OPTIONAL { ?item wdt:P106 ?occ }
  OPTIONAL { ?wp schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}"""


def main() -> None:
    ids = {a["id"] for a in json.loads(CATALOG.read_text(encoding="utf-8"))["authors"]}
    out: dict[str, dict] = {}

    def entry(row) -> dict | None:
        tlg = "tlg" + row["tlg"]["value"] if re.fullmatch(r"\d{4}", row["tlg"]["value"]) else row["tlg"]["value"]
        if tlg not in ids:
            return None
        e = out.setdefault(tlg, {"q": row["item"]["value"].rsplit("/", 1)[1]})
        return e

    for key, pid in (("birth", "P569"), ("death", "P570"), ("flor", "P1317")):
        vals: dict[str, list[tuple[int, int]]] = defaultdict(list)
        for row in sparql(dates_query(pid)):
            e = entry(row)
            if e is not None:
                prec = int(row["prec"]["value"])
                vals[row["tlg"]["value"]].append((year(row["t"]["value"], prec), prec))
        for tlg, vs in vals.items():
            t = "tlg" + tlg if re.fullmatch(r"\d{4}", tlg) else tlg
            # several values: keep the most precise, then the earliest
            y, p = sorted(vs, key=lambda v: (-v[1], v[0]))[0]
            out[t][key] = [y, p]

    occs: dict[str, set[str]] = defaultdict(set)
    for row in sparql(INFO):
        e = entry(row)
        if e is None:
            continue
        if "desc" in row:
            e["desc"] = row["desc"]["value"]
        if "placeLabel" in row and not row["placeLabel"]["value"].startswith(("Q", "http")):
            e.setdefault("place", row["placeLabel"]["value"])
        if "occLabel" in row and not row["occLabel"]["value"].startswith("Q"):
            occs[e["q"]].add(row["occLabel"]["value"])
        if "wp" in row:
            e["wp"] = row["wp"]["value"]
    for e in out.values():
        if occs.get(e["q"]):
            e["occ"] = sorted(occs[e["q"]])

    payload = {"source": "Wikidata, property P3576 (TLG author ID)", "licence": "CC0", "accessed": date.today().isoformat(),
               "authors": dict(sorted(out.items()))}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    dated = sum(1 for e in out.values() if any(k in e for k in ("birth", "death", "flor")))
    print(f"wrote {len(out)} of {len(ids)} authors ({dated} with a date) to {OUT}")


if __name__ == "__main__":
    main()
