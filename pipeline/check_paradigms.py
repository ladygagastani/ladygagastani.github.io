"""
Check every form in web/src/data/paradigms.ts against GLAUx: is it attested with that lemma and
that grammatical analysis somewhere in 16 million analysed words? Prints a report; forms that are
not attested are listed for a person to review (rare forms such as some vocatives can be genuinely
unattested; a wrong form will also show up here).

Usage:  python pipeline/check_paradigms.py        (reads web/public/data/words/*.json)
"""
from __future__ import annotations

import json
import re
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORDS = ROOT / "web" / "public" / "data" / "words"
GRAVE = str.maketrans({"̀": "́"})


def norm(s: str) -> str:
    """Compare ignoring grave-for-acute (a final accent turns grave before another word)."""
    return unicodedata.normalize("NFC", unicodedata.normalize("NFD", s).translate(GRAVE))


def load_paradigms() -> list[dict]:
    # evaluate the TypeScript data with node, so there is one source of truth
    js = (ROOT / "web" / "src" / "data" / "paradigms.ts").read_text(encoding="utf-8")
    js = re.sub(r"^export (interface|type) [\s\S]*?^}\n", "", js, flags=re.M)
    js = re.sub(r":\s*(Paradigm\[\]|string\[\]|string)(?=\s*[=)])", "", js)
    js = js.replace("export const", "const").replace("export function", "function")
    js = re.sub(r"\((\w+): \w+(\[\])?, (\w+): \w+(\[\])?(?:, (\w+) = (C))?\)", lambda m: f"({m.group(1)}, {m.group(3)}{', ' + m.group(5) + ' = ' + m.group(6) if m.group(5) else ''})", js)
    js = re.sub(r"\(cell: string\): string\[\]", "(cell)", js)
    js += "\nconsole.log(JSON.stringify(PARADIGMS));"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, encoding="utf-8")
    if out.returncode:
        raise SystemExit(out.stderr)
    return json.loads(out.stdout)


def forms_of(cell: str) -> list[str]:
    out = []
    for f in re.split(r",\s*", cell):
        out += [f.replace("(ν)", ""), f.replace("(ν)", "ν")] if "(ν)" in f else [f]
    return out


def main() -> None:
    paradigms = load_paradigms()
    wanted: dict[tuple[str, str], set[str]] = {}   # (form, lemma) -> tags wanted
    for p in paradigms:
        for r, row in enumerate(p["cells"]):
            for c, cell in enumerate(row):
                lemma = (p.get("colLemmas") or [p["lemma"]] * len(row))[c]
                for f in forms_of(cell):
                    wanted.setdefault((norm(f), norm(lemma)), set()).add(p["tags"][r][c])
    seen: dict[tuple[str, str], dict[str, int]] = {}
    forms = {k[0] for k in wanted}
    for f in WORDS.glob("*.json"):
        if f.name.startswith("_"):
            continue
        pack = json.loads(f.read_text(encoding="utf-8"))
        lem, tags = pack["lemmas"], pack["tags"]
        for _, _, text, lids, tids in pack["units"]:
            for form, l, t in zip(text.split(" "), lids, tids):
                nf = norm(form)
                if nf in forms:
                    key = (nf, norm(lem[l]))
                    if key in wanted:
                        d = seen.setdefault(key, {})
                        d[tags[t]] = d.get(tags[t], 0) + 1
    missing = []
    counts: dict[str, list[list[int]]] = {}
    for p in paradigms:
        counts[p["id"]] = [[0] * len(row) for row in p["cells"]]
        for r, row in enumerate(p["cells"]):
            for c, cell in enumerate(row):
                lemma = (p.get("colLemmas") or [p["lemma"]] * len(row))[c]
                for f in forms_of(cell):
                    tag = p["tags"][r][c]
                    got = seen.get((norm(f), norm(lemma)), {})
                    # compare the parts that matter (ignore gender on 1st/2nd person pronouns, which GLAUx may mark differently)
                    def same(a: str, b: str) -> bool:
                        return all(x == y or x == "-" or (p["group"] == "pronoun" and i == 6) for i, (x, y) in enumerate(zip(b, a)))
                    n = sum(v for k, v in got.items() if same(k, tag))
                    counts[p["id"]][r][c] += n
                    if not n:
                        missing.append(f"{p['id']:10} {p['rows'][r]:12} {p['cols'][c]:10} {f:12} tag {tag}  seen as: {dict(sorted(got.items(), key=lambda x: -x[1])[:3])}")
    out = ROOT / "web" / "src" / "data" / "paradigms-attested.json"
    out.write_text(json.dumps(counts, separators=(",", ":")), encoding="utf-8")
    total = sum(len(forms_of(cell)) for p in paradigms for row in p["cells"] for cell in row)
    print(f"{total} forms checked; {total - len(missing)} attested with the expected analysis; {len(missing)} to review:")
    for m in missing:
        print("  " + m)


if __name__ == "__main__":
    main()
