"""
Download David Chamberlain's published scansions of Greek verse from hypotactic.com
(CC BY 4.0: "All the data on this site is/are licensed as CC-BY 4.0", hypotactic.com/latin/about.html)
into pipeline/.cache/hypotactic/<id>.html, one file per work or book, skipping files already there.

Each file holds one <div class="line …" data-metre=… data-number=…> per verse line, each word a
<span class="word">, each syllable a <span class="syll long|short …">. Used to check the site's own
scanner (web/src/lib/metre) and, where the lines match, to show the published scansion.

Usage:  python pipeline/fetch_hypotactic.py
"""
from __future__ import annotations

import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "hypotactic"
BASE = "https://hypotactic.com/latin/"
UA = {"User-Agent": "mathesis-stoicheion-metre-check (non-commercial; credits hypotactic.com)"}


def fetch(url: str) -> bytes:
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                return r.read()
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))
    raise AssertionError


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    index = fetch(BASE + "greek.html").decode("utf-8")
    (CACHE / "_greek.html").write_text(index, encoding="utf-8")
    ids = sorted(set(re.findall(r"loadup\('([^']+)'", index)))
    got = 0
    for i in ids:
        f = CACHE / f"{i}.html"
        if f.exists():
            continue
        data = fetch(BASE + f"{i}.html")
        f.write_bytes(data)
        got += 1
        print(f"{i}: {len(data) // 1024} KB")
        time.sleep(0.4)
    print(f"{len(ids)} files listed, {got} downloaded, in {CACHE}")


if __name__ == "__main__":
    main()
