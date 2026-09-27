"""
Write size-and-fingerprint indexes for the generated data packs, so the site can show download
sizes and check each file it saves for offline use.

  web/public/data/words/_index.json   { work: [bytes, sha1] }
  web/public/data/lsj/_index.json     { shard: [bytes, sha1] }
  web/public/data/lexicon/_index.json { shard: [bytes, sha1] }   (the Word Study index, with its _meta)

Run after build_words.py, build_lsj.py and web/scripts/build-lexicon.ts:  python pipeline/build_pack_index.py
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "web" / "public" / "data"

for folder in ("words", "lsj", "lexicon"):
    d = ROOT / folder
    if not d.exists():
        print(f"{folder}: not built, skipped")
        continue
    index = {}
    for f in sorted(d.glob("*.json")):
        if f.name == "_index.json" or (f.name.startswith("_") and folder != "lexicon"):
            continue
        data = f.read_bytes()
        index[f.stem] = [len(data), hashlib.sha1(data).hexdigest()]
    (d / "_index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{folder}: {len(index)} files, {sum(v[0] for v in index.values())/1e6:.0f} MB")
