"""
Download every text file in the catalogue (at the catalogue's pinned versions) into
pipeline/.cache/corpus/<collection>/<path>, checking each against its git blob SHA-1.
Used by the corpus health check (web/src/lib/tei/corpus.test.ts, run with CORPUS=1).

Usage:  python pipeline/fetch_corpus.py
"""
from __future__ import annotations

import concurrent.futures as cf
import hashlib
import json
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "corpus"
CATALOG = ROOT / "web" / "public" / "data" / "catalog.json"
UA = {"User-Agent": "mathesis-stoicheion-corpus-fetch"}


def blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


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
    cat = json.loads(CATALOG.read_text(encoding="utf-8"))
    jobs = []
    for a in cat["authors"]:
        for w in a["works"]:
            for t in w["texts"]:
                dest = CACHE / t["col"] / t["path"]
                if dest.exists() and blob_sha(dest.read_bytes()) == t["sha"]:
                    continue
                c = cat["collections"][t["col"]]
                jobs.append((f"https://raw.githubusercontent.com/{c['owner']}/{c['repo']}/{c['sha']}/{t['path']}", dest, t["sha"]))
    print(f"{len(jobs)} files to fetch", flush=True)

    def one(job):
        url, dest, sha = job
        data = fetch(url)
        if blob_sha(data) != sha:
            raise RuntimeError(f"fingerprint mismatch: {url}")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)

    done = failed = 0
    with cf.ThreadPoolExecutor(16) as ex:
        for f in cf.as_completed([ex.submit(one, j) for j in jobs]):
            try:
                f.result(); done += 1
            except Exception as e:
                failed += 1; print("  failed:", e, flush=True)
            if (done + failed) % 250 == 0:
                print(f"  {done + failed}/{len(jobs)}", flush=True)
    print(f"done: {done} fetched, {failed} failed")


if __name__ == "__main__":
    main()
