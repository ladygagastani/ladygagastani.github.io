"""
Every work's titles as its collection's CTS metadata gives them (__cts__.xml, at the commit the catalogue is
pinned to), with their languages, and the English labels of the work's translations. Written to
pipeline/.cache/work-titles.json, the raw material for web/src/data/work-titles.ts (English titles for works
the catalogue names only in Latin or Greek). Reads metadata only; never changes a text.

Usage:  python pipeline/fetch_work_titles.py        (needs a connection to raw.githubusercontent.com)
"""
import json
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
OUT = ROOT / "pipeline" / ".cache" / "work-titles.json"
NS = {"ti": "http://chs.harvard.edu/xmlns/cts"}
LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def fetch(url: str) -> bytes | None:
    for _ in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "MathesisStoicheion/0.1"}), timeout=60) as r:
                return r.read()
        except Exception:  # noqa: BLE001 - retried, then reported as missing
            continue
    return None


def main() -> None:
    cat = json.loads(CATALOG.read_text(encoding="utf-8"))
    cols = cat["collections"]
    jobs = []
    for a in cat["authors"]:
        for w in a["works"]:
            col = w["texts"][0]["col"] if w["texts"] else None
            if not col:
                continue
            c = cols[col]
            group, work = w["id"].split(".")[:2]
            url = f"https://raw.githubusercontent.com/{c['owner']}/{c['repo']}/{c['sha']}/data/{group}/{work}/__cts__.xml"
            jobs.append((w["id"], a["name"], w["title"], url))

    def one(job):
        wid, author, title, url = job
        raw = fetch(url)
        rec = {"id": wid, "author": author, "catalogue": title, "titles": [], "translations": []}
        if raw is None:
            rec["error"] = "not fetched"
            return rec
        root = ET.fromstring(raw)
        rec["titles"] = [{"lang": t.get(LANG), "text": " ".join("".join(t.itertext()).split())} for t in root.findall("ti:title", NS)]
        for tr in root.findall("ti:translation", NS):
            if tr.get(LANG) != "eng":
                continue
            lab = tr.find("ti:label", NS)
            if lab is not None:
                rec["translations"].append(" ".join("".join(lab.itertext()).split()))
        return rec

    with ThreadPoolExecutor(12) as ex:
        recs = list(ex.map(one, jobs))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(recs, ensure_ascii=False, indent=1), encoding="utf-8")
    missing = sum(1 for r in recs if "error" in r)
    print(f"{len(recs)} works, {missing} not fetched -> {OUT}")


if __name__ == "__main__":
    main()
