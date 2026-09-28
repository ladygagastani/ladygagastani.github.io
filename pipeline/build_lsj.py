"""
Build the LSJ dictionary files from PerseusDL/lexica (CC BY-SA 4.0).

Credit required by Perseus (shown on the site): "Text provided under a CC BY-SA license by Perseus
Digital Library, http://www.perseus.tufts.edu, with funding from The National Endowment for the
Humanities. Data accessed from https://github.com/PerseusDL/lexica/ [date of access]."

Output (sharded by the first two letters of the headword, accents removed):
  web/public/data/lsj/<shard>.json   { headword: [ entry, … ] }   (homographs share a headword)
  entry = { k: original key, s: short gloss, b: [ [level, label, segments], … ] }
  segments: plain strings, {"g": greek}, {"c": citation text, "u": CTS URN}
The dictionary's wording is kept; only Beta Code is turned into Greek letters.

Usage:  python pipeline/build_lsj.py
"""
from __future__ import annotations

import json
import re
import sys
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from betacode import beta_to_unicode  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "pipeline" / ".cache" / "lsj"
OUT = ROOT / "web" / "public" / "data" / "lsj"
REPO = "PerseusDL/lexica"
PATH = "CTS_XML_TEI/perseus/pdllex/grc/lsj/grc.lsj.perseus-eng{}.xml"
UA = {"User-Agent": "mathesis-stoicheion-lsj-builder"}
GREEKISH = {"orth", "foreign", "quote", "gen", "pron", "etym"}   # hold Greek when lang="greek"


def get(url: str) -> bytes:
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
                return r.read()
        except Exception as e:
            if attempt == 3:
                raise RuntimeError(f"{url}: {e}") from e
            time.sleep(2 * (attempt + 1))
    raise AssertionError


def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower().replace("ς", "σ")
    return s


def shard_of(headword: str) -> str:
    f = re.sub(r"[^α-ωϝ]", "", fold(headword))
    return (f[:2] or "_")


def segments(el: ET.Element, greek: bool = False) -> list:
    """Mixed content → plain strings, Greek pieces and linked citations, in order."""
    out: list = []

    def text(t: str | None, g: bool):
        if not t:
            return
        t = re.sub(r"\s+", " ", t)
        if g and t.strip():
            out.append({"g": beta_to_unicode(t)})
        else:
            out.append(t)

    def walk(e: ET.Element, g: bool):
        tag = e.tag.split("}")[-1]
        g2 = g or (e.get("lang") == "greek" and tag in GREEKISH) or (e.get("lang") == "greek")
        if tag == "sense":                      # nested senses are collected separately
            return
        if tag == "bibl":
            label = " ".join("".join(e.itertext()).split())
            urn = e.get("n") or ""
            if label:
                out.append({"c": label, "u": urn} if urn.startswith("urn:cts:") else label)
            return
        text(e.text, g2)
        for c in e:
            walk(c, g2)
            text(c.tail, g2)

    text(el.text, greek)
    for c in el:
        walk(c, greek)
        text(c.tail, greek)
    # merge neighbouring plain strings
    merged: list = []
    for s in out:
        if isinstance(s, str) and merged and isinstance(merged[-1], str):
            merged[-1] += s
        else:
            merged.append(s)
    # layout whitespace only: collapse runs of spaces and the space before punctuation
    tidy = [re.sub(r"\s+([,;:.)])", r"\1", re.sub(r"\s{2,}", " ", s)) if isinstance(s, str) else s for s in merged]
    return [s for s in tidy if not (isinstance(s, str) and not s.strip())]


# Abbreviations LSJ writes before a word of another language; a <tr> right after one glosses that word.
COGNATE_LANGS = {"Skt", "Sanskr", "Lat", "Goth", "Arm", "Lith", "Lett", "OHG", "MHG", "OE", "OIr", "Ir", "Engl", "Germ",
                 "Av", "Zd", "Slav", "OSlav", "Hitt", "Toch", "Pers", "Heb", "Hebr", "Aram", "Syr", "Arab", "Egypt", "Umbr", "Osc"}


def glossing_trs(entry: ET.Element, anywhere: bool = False) -> list[str]:
    """
    The <tr> elements that translate the headword, in reading order: inside a sense, and not inside
    a note on cognates. LSJ's source sometimes marks the meaning of a related word in another language
    with <tr> too ("(Cf. ὄρνεον, Goth. ara, gen. arins 'eagle')" in ὄρνις), so a <tr> is skipped when
    it stands in a parenthesis that opens with "Cf." or right after a language's name ("Goth."); when
    such a <tr> holds the foreign word and then the English ("Lat. diaetarius, house-steward"), the
    English after the comma is kept. With anywhere=True, <tr>s outside the senses count too.
    """
    out: list[str] = []
    parens: list[bool] = []          # one flag per open parenthesis: is it a note on cognates?
    last_text = ""

    def text(t: str | None) -> None:
        nonlocal last_text
        if not t:
            return
        for i, ch in enumerate(t):
            if ch == "(":
                parens.append(t[i + 1:i + 5].lstrip().lower().startswith("cf"))
            elif ch == ")" and parens:
                parens.pop()
        last_text = t

    def walk(el: ET.Element, in_sense: bool) -> None:
        text(el.text)
        for c in el:
            if c.tag == "tr":
                before = last_text.rstrip()
                lang = re.search(r"([A-Z][A-Za-z]*)\.$", before)
                t = " ".join("".join(c.itertext()).split())
                if in_sense and not any(parens):
                    if not (lang and lang.group(1) in COGNATE_LANGS):
                        out.append(t)
                    elif "," in t:
                        out.append(t.split(",", 1)[1])
                elif in_sense and parens and not any(parens[:-1]) and ")" in t:
                    out.append(t.rsplit(")", 1)[1])      # "(cf. Lat. mappa), towel": the English is after the note
                text(t)
            elif c.get("lang") == "greek":
                pass                     # Beta Code writes breathings as ( and ), which are not brackets
            else:
                walk(c, in_sense or c.tag == "sense")
            text(c.tail)

    walk(entry, anywhere or entry.tag == "sense")
    return out


def short_gloss(entry: ET.Element) -> str:
    """The first few translations LSJ marks with <tr>, taken from its numbered senses only
    (the part before them holds forms and etymology, where <tr> can mark cognates)."""
    seen: list[str] = []
    for t in glossing_trs(entry) or glossing_trs(entry, anywhere=True):
        t = t.strip(" ,;:")
        # a few <tr> elements in the source hold abbreviations ("Il.Parv..", "Smp.."), not translations
        if ".." in t or re.fullmatch(r"[A-Z][\w.]*\.", t):
            continue
        # cognates from other languages (Sanskrit "ahám", "sā") are not English glosses
        if re.search(r"[^\x00-\x7F’‘–—]", t):
            continue
        if t and t not in seen:
            seen.append(t)
        if len(seen) >= 4:
            break
    return ", ".join(seen)


def main() -> None:
    sha = json.loads(get(f"https://api.github.com/repos/{REPO}/commits/master"))["sha"]
    CACHE.mkdir(parents=True, exist_ok=True)
    shards: dict[str, dict[str, list]] = {}
    n = 0
    for i in range(1, 28):
        f = CACHE / f"lsj{i}.xml"
        if not f.exists():
            f.write_bytes(get(f"https://raw.githubusercontent.com/{REPO}/{sha}/{PATH.format(i)}"))
        for _, e in ET.iterparse(f, events=("end",)):
            if e.tag != "entryFree":
                continue
            key = e.get("key") or ""
            head = beta_to_unicode(re.sub(r"\d+$", "", key))
            senses = []
            # the part before the first sense: headword, forms, grammar
            pre = ET.Element("x"); pre.text = e.text
            for c in e:
                if c.tag == "sense":
                    break
                pre.append(c)
            senses.append([0, "", segments(pre)])
            for s in e.iter("sense"):
                senses.append([int(s.get("level") or 1), s.get("n") or "", segments(s)])
            entry = {"k": key, "s": short_gloss(e), "b": senses}
            shards.setdefault(shard_of(head), {}).setdefault(head, []).append(entry)
            n += 1
            e.clear()
        print(f"  file {i}/27: {n:,} entries", flush=True)

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.json"):
        old.unlink()
    for shard, entries in shards.items():
        (OUT / f"{shard}.json").write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (OUT / "_meta.json").write_text(json.dumps({
        "source": f"PerseusDL/lexica @ {sha}", "accessed": date.today().isoformat(), "entries": n, "shards": sorted(shards),
    }), encoding="utf-8")
    size = sum(p.stat().st_size for p in OUT.glob("*.json"))
    print(f"wrote {n:,} entries in {len(shards)} shards, {size/1e6:.0f} MB")


if __name__ == "__main__":
    main()
