"""
Build the site's catalogue of authors, works and text files from the original collections.

Reads only the CTS metadata files (__cts__.xml) and GitHub's file listing. It never changes a text.
Everything is pinned to one exact commit of each repository, so the catalogue, the online reader
and offline downloads all refer to identical files.

Output: web/public/data/catalog.json

Usage:  python pipeline/build_catalog.py
"""
from __future__ import annotations

import concurrent.futures as cf
import json
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

COLLECTIONS = [
    {"id": "perseus", "owner": "PerseusDL", "repo": "canonical-greekLit", "branch": "master"},
    {"id": "first1k", "owner": "OpenGreekAndLatin", "repo": "First1KGreek", "branch": "master"},
]
NS = {"ti": "http://chs.harvard.edu/xmlns/cts", "dc": "http://purl.org/dc/elements/1.1/"}
OUT = Path(__file__).resolve().parent.parent / "web" / "public" / "data" / "catalog.json"
UA = {"User-Agent": "mathesis-stoicheion-catalogue-builder"}


def get(url: str, tries: int = 4) -> bytes:
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as e:  # network hiccup: back off and retry
            if attempt == tries - 1:
                raise RuntimeError(f"{url}: {e}") from e
            time.sleep(1.5 * (attempt + 1))
    raise AssertionError


def text_of(el: ET.Element | None) -> str | None:
    if el is None:
        return None
    t = " ".join("".join(el.itertext()).split())
    return t or None


def pick(parent: ET.Element, tag: str) -> str | None:
    """Prefer the English element, then any."""
    els = parent.findall(tag, NS)
    for e in els:
        if e.get("{http://www.w3.org/XML/1998/namespace}lang") == "eng":
            return text_of(e)
    return text_of(els[0]) if els else None


def main() -> None:
    catalog = {"built": datetime.now(timezone.utc).isoformat(timespec="seconds"), "collections": {}, "authors": []}
    authors: dict[str, dict] = {}

    for col in COLLECTIONS:
        api = f"https://api.github.com/repos/{col['owner']}/{col['repo']}"
        sha = json.loads(get(f"{api}/commits/{col['branch']}"))["sha"]
        tree = json.loads(get(f"{api}/git/trees/{sha}?recursive=1"))
        if tree.get("truncated"):
            sys.exit(f"{col['repo']}: file listing truncated; the catalogue would be incomplete")
        blobs = {t["path"]: t for t in tree["tree"] if t["type"] == "blob"}
        catalog["collections"][col["id"]] = {"owner": col["owner"], "repo": col["repo"], "sha": sha}
        raw = f"https://raw.githubusercontent.com/{col['owner']}/{col['repo']}/{sha}/"

        cts_paths = sorted(p for p in blobs if p.startswith("data/") and p.endswith("__cts__.xml"))
        print(f"{col['repo']} @ {sha[:10]}: {len(cts_paths)} metadata files", flush=True)
        with cf.ThreadPoolExecutor(12) as ex:
            docs = dict(zip(cts_paths, ex.map(lambda p: get(raw + p), cts_paths)))

        for path, data in docs.items():
            try:
                root = ET.fromstring(data)
            except ET.ParseError as e:
                print(f"  skipped unreadable {path}: {e}", file=sys.stderr)
                continue
            parts = path.split("/")
            if root.tag.endswith("textgroup") and len(parts) == 3:
                aid = parts[1]
                a = authors.setdefault(aid, {"id": aid, "works": {}})
                a["name"] = a.get("name") or pick(root, "ti:groupname") or aid
            elif root.tag.endswith("work") and len(parts) == 4:
                aid, wid = parts[1], parts[2]
                a = authors.setdefault(aid, {"id": aid, "works": {}})
                work_id = f"{aid}.{wid}"
                work = a["works"].setdefault(work_id, {"id": work_id, "title": None, "lang": root.get("{http://www.w3.org/XML/1998/namespace}lang"), "texts": []})
                work["title"] = work["title"] or pick(root, "ti:title") or work_id
                for kind in ("edition", "translation", "commentary"):
                    for t in root.findall(f"ti:{kind}", NS):
                        urn = t.get("urn")
                        if not urn:
                            continue
                        file_path = f"data/{aid}/{wid}/{urn.split(':')[-1]}.xml"
                        blob = blobs.get(file_path)
                        if not blob:  # listed in the metadata but the file is not in the repository
                            continue
                        lang = t.get("{http://www.w3.org/XML/1998/namespace}lang") or (work["lang"] if kind == "edition" else None)
                        work["texts"].append({
                            "urn": urn, "kind": kind, "lang": lang,
                            "label": pick(t, "ti:label"), "desc": pick(t, "ti:description"),
                            "col": col["id"], "path": file_path, "size": blob["size"], "sha": blob["sha"],
                        })

    # tidy: drop works without readable files, sort everything
    out = []
    for a in sorted(authors.values(), key=lambda a: (a.get("name") or a["id"]).lower()):
        works = [w for w in a["works"].values() if w["texts"]]
        if not works:
            continue
        for w in works:
            w["texts"].sort(key=lambda t: (["edition", "translation", "commentary"].index(t["kind"]), t["urn"]))
        works.sort(key=lambda w: w["id"])
        out.append({"id": a["id"], "name": a.get("name") or a["id"], "works": works})
    catalog["authors"] = out

    # English titles for works the collections name only in Latin or Greek (pipeline/work_titles.tsv)
    from apply_work_titles import apply, load_titles
    apply(catalog, load_titles())

    n_works = sum(len(a["works"]) for a in out)
    n_texts = sum(len(w["texts"]) for a in out for w in a["works"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT} — {len(out)} authors, {n_works} works, {n_texts} texts, {OUT.stat().st_size/1e6:.1f} MB")


if __name__ == "__main__":
    main()
