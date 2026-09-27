"""
Write size-and-fingerprint indexes for the generated data packs, so the site can show download
sizes and check each file it saves for offline use.

  web/public/data/words/_index.json   { work: [bytes, sha1] }
  web/public/data/lsj/_index.json     { shard: [bytes, sha1] }

Run after build_words.py and build_lsj.py:  python pipeline/build_pack_index.py
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "web" / "public" / "data"

for folder in ("words", "lsj"):
    d = ROOT / folder
    index = {}
    for f in sorted(d.glob("*.json")):
        if f.name.startswith("_"):
            continue
        data = f.read_bytes()
        index[f.stem] = [len(data), hashlib.sha1(data).hexdigest()]
    (d / "_index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{folder}: {len(index)} files, {sum(v[0] for v in index.values())/1e6:.0f} MB")
