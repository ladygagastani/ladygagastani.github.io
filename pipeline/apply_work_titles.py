"""
Put English titles (pipeline/work_titles.tsv) into web/public/data/catalog.json, for works that the collections
name only in Latin or Greek. The collection's own title is kept as `orig` (shown beside the English one and
searchable), and `titleFrom` says where the English comes from: "tr" (the library's own English translation of
the work) or "site" (translated by this site). Safe to run again: the collection's title is never lost.
build_catalog.py runs this at its end, so a rebuilt catalogue keeps the English titles.

Usage:  python pipeline/apply_work_titles.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
TITLES = ROOT / "pipeline" / "work_titles.tsv"


def load_titles() -> dict[str, tuple[str, str]]:
    out = {}
    for n, line in enumerate(TITLES.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) != 3 or parts[2] not in ("tr", "site") or not parts[1].strip():
            raise SystemExit(f"{TITLES.name}:{n}: expected id, English title, tr|site")
        if parts[0] in out:
            raise SystemExit(f"{TITLES.name}:{n}: {parts[0]} given twice")
        out[parts[0]] = (parts[1].strip(), parts[2])
    return out


def apply(catalog: dict, titles: dict[str, tuple[str, str]]) -> int:
    works = {w["id"]: w for a in catalog["authors"] for w in a["works"]}
    missing = sorted(set(titles) - set(works))
    if missing:
        raise SystemExit(f"not in the catalogue: {', '.join(missing[:10])}")
    for wid, (en, src) in titles.items():
        w = works[wid]
        orig = w.get("orig") or w["title"]
        if en == orig:
            continue
        w["orig"], w["title"], w["titleFrom"] = orig, en, src
    return len(titles)


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    n = apply(catalog, load_titles())
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{n} English titles in {CATALOG}")


if __name__ == "__main__":
    main()
