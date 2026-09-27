"""
Build web/public/data/core.json from the Dickinson College Commentaries Greek Core Vocabulary
(Christopher Francese et al., CC BY-SA 3.0): the ~500 most common words of Ancient Greek, with
short definitions, part of speech, semantic group and frequency rank.

Keyed by the dictionary form (the first word of the DCC headword, e.g. "ὁ" for "ὁ ἡ τό").
Definitions are kept exactly as DCC gives them.

Usage:  python pipeline/build_core.py
"""
import csv
import io
import json
import unicodedata
import urllib.request
from datetime import date
from pathlib import Path

URL = "https://dcc.dickinson.edu/greek-core-list.csv"
OUT = Path(__file__).resolve().parent.parent / "web" / "public" / "data" / "core.json"

raw = urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "mathesis-stoicheion"}), timeout=60).read().decode("utf-8")
rows = list(csv.DictReader(io.StringIO(raw)))
words = {}
for r in rows:
    head = unicodedata.normalize("NFC", r["Headword"].strip())
    # the dictionary form is the first word; paired words are written "μέν...δέ"
    lemma = head.replace(",", " ").replace("...", " ").replace("…", " ").split()[0]
    entry = {"head": head, "def": r["DEFINITION"].strip(), "pos": r["Part of Speech"].strip(),
             "group": r["SEMANTIC GROUP"].strip(), "rank": int(r["FREQUENCY RANK"])}
    # a few lemmas appear twice (homographs); keep the more frequent first
    words.setdefault(lemma, []).append(entry)
OUT.write_text(json.dumps({"source": URL, "accessed": date.today().isoformat(), "licence": "CC BY-SA 3.0",
                           "credit": "Dickinson College Commentaries Greek Core Vocabulary, Christopher Francese et al.",
                           "words": words}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"wrote {len(rows)} entries ({len(words)} headwords) to {OUT}")
