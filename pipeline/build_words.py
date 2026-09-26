"""
Build the word-analysis pack from GLAUx (Keersmaekers 2021, CC BY-SA 4.0; see README credits).

For every work that is both in GLAUx and in our catalogue, write
  web/public/data/words/<work>.json
holding, passage by passage, each word's dictionary form (lemma) and its grammar (an AGDT
"postag"), as analysed in context. Sentences annotated by hand in the treebank projects are
flagged, so the site can say which analyses were checked by a person.

Also writes web/public/data/works-meta.json: genre, dialect and dates per work, from GLAUx's
metadata, for the library's filters.

The texts themselves are not touched: this only adds information about them.

Usage:  python pipeline/build_words.py            (downloads ~3.3 GB of XML into pipeline/.cache)
"""
from __future__ import annotations

import concurrent.futures as cf
import csv
import io
import json
import sys
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "glaux"
OUT = ROOT / "web" / "public" / "data" / "words"
META_OUT = ROOT / "web" / "public" / "data" / "works-meta.json"
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
REPO = "alekkeersmaekers/glaux"
UA = {"User-Agent": "mathesis-stoicheion-word-pack-builder"}
ELISION = str.maketrans({"’": "ʼ", "'": "ʼ", "᾽": "ʼ", "᾿": "ʼ"})


def get(url: str, tries: int = 4) -> bytes:
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
                return r.read()
        except Exception as e:
            if attempt == tries - 1:
                raise RuntimeError(f"{url}: {e}") from e
            time.sleep(2 * (attempt + 1))
    raise AssertionError


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s).translate(ELISION)


def work_id(tlg: str) -> str:
    a, w = tlg.split("-")
    return f"tlg{a}.tlg{w}"


def build_one(sha: str, text_id: str, wid: str, meta: dict) -> tuple[str, int]:
    src = CACHE / f"{text_id}.xml"
    if not src.exists():
        src.parent.mkdir(parents=True, exist_ok=True)
        src.write_bytes(get(f"https://raw.githubusercontent.com/{REPO}/{sha}/xml/{text_id}.xml"))

    attrs: list[str] = []
    lemmas: dict[str, int] = {}
    tags: dict[str, int] = {}
    units: list[list] = []           # [loc values, manual(0/1), forms, lemma ids, tag ids]
    cur_key = None
    manual = 0
    count = 0
    for event, el in ET.iterparse(src, events=("start", "end")):
        if event == "start" and el.tag == "sentence":
            manual = 1 if el.get("analysis") == "manual" else 0
            continue
        if event != "end":
            continue
        if el.tag == "word":
            tag = el.get("postag") or ""
            form = el.get("form") or ""
            if el.get("artificial") or not form or tag.startswith("u"):
                el.clear()
                continue
            for k in el.attrib:
                if (k.startswith("div_") or k == "line") and k not in attrs:
                    attrs.append(k)
            loc = tuple(el.get(k, "") for k in attrs)
            key = (loc, manual)
            if key != cur_key:
                units.append([list(loc), manual, [], [], []])
                cur_key = key
            lemma = nfc(el.get("lemma") or "")
            u = units[-1]
            u[2].append(nfc(form))
            u[3].append(lemmas.setdefault(lemma, len(lemmas)))
            u[4].append(tags.setdefault(tag, len(tags)))
            count += 1
            el.clear()
        elif el.tag == "sentence":
            el.clear()

    # loc tuples grow as new attributes appear; pad early ones to the final width
    for u in units:
        u[0] = u[0] + [""] * (len(attrs) - len(u[0]))
        u[2] = " ".join(u[2])
    pack = {
        "v": 1, "work": wid, "glaux": text_id, "sha": sha,
        "licence": meta.get("SOURCE_LICENSE") or "", "treebank": meta.get("TREEBANK_ANNOTATIONS") or "",
        "attrs": attrs, "lemmas": list(lemmas), "tags": list(tags), "units": units,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{wid}.json").write_text(json.dumps(pack, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return wid, count


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    ours = {w["id"] for a in catalog["authors"] for w in a["works"]}
    sha = json.loads(get(f"https://api.github.com/repos/{REPO}/commits/main"))["sha"]
    meta_rows = list(csv.DictReader(io.StringIO(get(f"https://raw.githubusercontent.com/{REPO}/{sha}/metadata.txt").decode("utf-8")), delimiter="\t"))

    jobs, meta_out = [], {}
    for r in meta_rows:
        if not r.get("TLG") or "-" not in r["TLG"]:
            continue
        wid = work_id(r["TLG"])
        if wid not in ours:
            continue
        meta_out[wid] = {
            "genre": r.get("GENRE_STANDARD") or None, "dialect": r.get("DIALECT") or None,
            "from": int(r["STARTDATE"]) if r.get("STARTDATE", "").lstrip("-").isdigit() else None,
            "to": int(r["ENDDATE"]) if r.get("ENDDATE", "").lstrip("-").isdigit() else None,
            "tokens": int(r["TOKENS"]) if (r.get("TOKENS") or "").isdigit() else None,
        }
        jobs.append((r["GLAUX_TEXT_ID"] if "GLAUX_TEXT_ID" in r else r["TLG"], r["TLG"], wid, r))

    META_OUT.write_text(json.dumps({"source": f"GLAUx metadata @ {sha[:10]}", "works": meta_out}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"GLAUx @ {sha[:10]}: {len(jobs)} works to build; metadata written", flush=True)

    only = set(sys.argv[1:])        # optional: build just these work ids
    done = total = 0
    with cf.ThreadPoolExecutor(6) as ex:
        futs = [ex.submit(build_one, sha, tlg, wid, r) for _, tlg, wid, r in jobs if not only or wid in only]
        for f in cf.as_completed(futs):
            try:
                wid, n = f.result()
                done += 1
                total += n
                if done % 50 == 0:
                    print(f"  {done}/{len(futs)} works, {total:,} words", flush=True)
            except Exception as e:
                print(f"  failed: {e}", file=sys.stderr, flush=True)
    size = sum(p.stat().st_size for p in OUT.glob("*.json"))
    print(f"done: {done} works, {total:,} words, {size/1e6:.0f} MB in {OUT}")


if __name__ == "__main__":
    main()
