"""
Find short, real sentences for lessons: hand-annotated (treebank) sentences from GLAUx that
contain a grammatical feature and use only common words (DCC core vocabulary up to a rank),
plus any extra lemmas allowed. Prints candidates with their work and GLAUx location, so they can
be checked and cited. Uses the GLAUx XML cached by build_words.py.

Usage:
  python pipeline/find_sentences.py --tag "n-s---.n-" --max-words 7 --core-rank 150 [--work tlg0031.tlg004] [--allow λόγος,θεός]
The --tag pattern is a regular expression over the 9-character AGDT tag of at least one word.
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "glaux"
CORE = json.loads((ROOT / "web" / "public" / "data" / "core.json").read_text(encoding="utf-8"))["words"]
nfc = lambda s: unicodedata.normalize("NFC", s or "")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", required=True)
    ap.add_argument("--lemma", default=None, help="a lemma that must occur")
    ap.add_argument("--max-words", type=int, default=8)
    ap.add_argument("--core-rank", type=int, default=200)
    ap.add_argument("--allow", default="")
    ap.add_argument("--work", default=None)
    ap.add_argument("--limit", type=int, default=30)
    a = ap.parse_args()
    allowed = {k for k, v in CORE.items() if v[0]["rank"] <= a.core_rank} | {nfc(x) for x in a.allow.split(",") if x}
    pat = re.compile(a.tag)
    files = sorted(CACHE.glob("*.xml"))
    if a.work:
        m = re.match(r"tlg(\d+)\.tlg(\d+)", a.work)
        files = [CACHE / f"{m.group(1)}-{m.group(2)}.xml"]
    found = 0
    for f in files:
        for _, s in ET.iterparse(f):
            if s.tag != "sentence":
                continue
            if s.get("analysis") != "manual":
                s.clear(); continue
            words = [w for w in s.iter("word") if not (w.get("postag") or "").startswith("u") and not w.get("artificial")]
            if 2 <= len(words) <= a.max_words:
                lemmas = [nfc(w.get("lemma")) for w in words]
                if all(l in allowed for l in lemmas) and any(pat.search(w.get("postag") or "") for w in words) \
                        and (not a.lemma or nfc(a.lemma) in lemmas):
                    loc = {k: v for k, v in words[0].attrib.items() if k.startswith("div_") or k == "line"}
                    text = " ".join(nfc(w.get("form")) for w in s.iter("word") if not w.get("artificial"))
                    print(f"{f.stem}\t{json.dumps(loc, ensure_ascii=False)}\t{text}")
                    found += 1
                    if found >= a.limit:
                        return
            s.clear()


if __name__ == "__main__":
    main()
