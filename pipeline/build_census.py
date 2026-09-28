"""
Build the Census (Most Mentioned) data, web/public/data/census/, from GLAUx (Keersmaekers 2021,
CC BY-SA 4.0). Everything is counted from the same GLAUx files as the word packs and the Word Study
index, and the counts per dictionary word are checked against the Word Study index, so every page
of the site gives the same number for the same word.

How things are sorted (stated on the Census page):
  * Names are GLAUx dictionary words written with a capital. GLAUx tags each noun with an animacy
    class (after Zaenen et al. 2004: human, place, ethnonym, animal...; 89.2% accurate by GLAUx's
    own figure). A name is a person, a place or a people by the class GLAUx gives it most often.
    Gods, heroes and the other figures of myth are "human" to GLAUx; they come from the hand-made
    list in census_lists.py. Every name mentioned at least CHECKED_MIN times was looked at by hand,
    and corrections are listed there too.
  * Objects (ships, weapons, animals, food...) are nouns whose most frequent GLAUx word sense
    (WordNet 3.0 synsets; 82.0% accurate by GLAUx's own figure) falls under a WordNet group.
  * Phrases are runs of 2 to 6 words that repeat, inside one sentence with no punctuation between,
    holding at least two nouns, verbs, adjectives or names; a phrase that is nearly always part of
    a longer one is shown as the longer one.

Steps (the scan is cached in pipeline/.cache/census and reused unless --rescan is given):
  1. scan   every GLAUx file of a work in our catalogue: per dictionary word, its counts per work,
            animacy classes, senses and parts of speech; per work, its words in order (for phrases).
  2. build  the lists, per group of works, into web/public/data/census/.

Needs: pipeline/.cache/glaux (python pipeline/build_words.py), web/public/data/words and
web/public/data/lexicon (npx tsx scripts/build-lexicon.ts), and NLTK's WordNet
(pip install nltk; the script downloads the WordNet data on first run).

Usage:  python pipeline/build_census.py [--rescan]
"""
import collections
import html
import json
import multiprocessing
import pickle
import re
import sys
import unicodedata
from pathlib import Path

import regex

ROOT = Path(__file__).resolve().parent.parent
GLAUX = ROOT / "pipeline" / ".cache" / "glaux"
CACHE = ROOT / "pipeline" / ".cache" / "census"
PACKS = ROOT / "web" / "public" / "data" / "words"
LEXICON = ROOT / "web" / "public" / "data" / "lexicon"
OUT = ROOT / "web" / "public" / "data" / "census"


# ------------------------------------------------------------------ the site's own normalisations
# These mirror web/src/lib/lexicon.ts (canonLemma, displayForm) and web/src/lib/search/codec.ts
# (greekKey), so a dictionary word here is the same key as in the Word Study index.

ELISION = str.maketrans({"’": "ʼ", "'": "ʼ", "᾽": "ʼ", "᾿": "ʼ"})   # as build_words.py


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s).translate(ELISION)


def canon_lemma(lemma: str) -> str:
    return regex.sub(r"[^\p{L}\p{M}]", "", nfc(lemma).lower())


_FOLD = re.compile("[̀-ͯ̓̔͂ͅ]")


def greek_key(w: str) -> str:
    f = _FOLD.sub("", unicodedata.normalize("NFD", w)).lower().replace("ς", "σ").replace("ϲ", "σ")
    return re.sub(r"[^α-ωϝ]", "", f)


def display_form(form: str, lemma: str) -> str:
    f = nfc(unicodedata.normalize("NFD", form).replace("̀", "́"))
    f = re.sub("[’'᾽᾿]", "ʼ", f)
    if lemma == lemma.lower():
        f = f.lower()
    return f


# ------------------------------------------------------------------ step 1: scan
WORD = re.compile(r"<word ([^>]*)/?>")
ATTR = re.compile(r'(\w+)="([^"]*)"')


def works_of_packs() -> dict[str, str]:
    """GLAUx text id -> our work id, from the head of each word pack."""
    out = {}
    for p in sorted(PACKS.glob("*.json")):
        if p.name.startswith("_"):
            continue
        with p.open(encoding="utf-8") as f:
            head = f.read(600)
        m = re.search(r'"work":"([^"]+)","glaux":"([^"]+)"', head)
        if not m:
            raise SystemExit(f"cannot read the head of {p}")
        out[m.group(2)] = m.group(1)
    return out


def scan_one(job: tuple[str, str]) -> tuple[str, dict]:
    """
    One GLAUx file. Words are taken exactly as build_words.py takes them (no punctuation, no
    artificial words), and passages ("units") are numbered the same way, so a unit number here is
    the same unit in the word pack.
    Returns per dictionary word: [count, raw spellings, animacy, senses, parts of speech], and
    writes the work's words in order to the cache: forms, dictionary words, part of speech, unit,
    and whether a sentence or a punctuation mark comes before the word.
    """
    text_id, wid = job
    stats: dict[str, list] = {}
    forms: list[str] = []
    lemmas: list[str] = []
    pos: list[str] = []
    units: list[int] = []
    breaks = bytearray()
    attrs: list[str] = []
    cur_key = None
    unit = -1
    manual = 0
    brk = 1
    with (GLAUX / f"{text_id}.xml").open(encoding="utf-8") as f:
        for line in f:
            if "<sentence" in line:
                m = re.search(r'analysis="(\w+)"', line)
                manual = 1 if m and m.group(1) == "manual" else 0
                brk = 1
                continue
            m = WORD.search(line)
            if not m:
                continue
            a = {k: html.unescape(v) for k, v in ATTR.findall(m.group(1))}
            tag = a.get("postag", "")
            form = a.get("form", "")
            if tag.startswith("u"):
                brk = 1
                continue
            if a.get("artificial") or not form:
                continue
            for k in a:
                if (k.startswith("div_") or k == "line") and k not in attrs:
                    attrs.append(k)
            loc = tuple(a.get(k, "") for k in attrs)
            key = (loc, manual)
            if key != cur_key:
                unit += 1
                cur_key = key
                brk = 1
            raw = nfc(a.get("lemma", ""))
            lemma = canon_lemma(raw)
            if greek_key(lemma):
                s = stats.get(lemma)
                if s is None:
                    s = stats[lemma] = [0, collections.Counter(), collections.Counter(), collections.Counter(), collections.Counter()]
                s[0] += 1
                s[1][raw] += 1
                if "animacy" in a:
                    s[2][a["animacy"]] += 1
                if "sense" in a:
                    s[3][a["sense"]] += 1
                s[4][tag[:1] or "-"] += 1
            forms.append(display_form(nfc(form), raw))
            lemmas.append(lemma)
            pos.append((tag[:1] or "-") if greek_key(lemma) else "-")
            units.append(unit)
            breaks.append(brk)
            brk = 0
    (CACHE / "tokens").mkdir(parents=True, exist_ok=True)
    with (CACHE / "tokens" / f"{wid}.pkl").open("wb") as f:
        pickle.dump({"forms": forms, "lemmas": lemmas, "pos": "".join(pos), "units": units, "breaks": bytes(breaks)}, f, protocol=pickle.HIGHEST_PROTOCOL)
    return wid, stats


def scan() -> None:
    jobs = sorted(works_of_packs().items())
    missing = [t for t, _ in jobs if not (GLAUX / f"{t}.xml").exists()]
    if missing:
        raise SystemExit(f"{len(missing)} GLAUx files missing (run pipeline/build_words.py): {missing[:5]}")
    print(f"scanning {len(jobs)} GLAUx files...", flush=True)
    lemmas: dict[str, list] = {}
    works: dict[str, int] = {}
    with multiprocessing.Pool() as pool:
        for i, (wid, stats) in enumerate(pool.imap_unordered(scan_one, jobs, chunksize=4)):
            works[wid] = sum(s[0] for s in stats.values())
            for lemma, s in stats.items():
                e = lemmas.get(lemma)
                if e is None:
                    e = lemmas[lemma] = [{}, collections.Counter(), collections.Counter(), collections.Counter(), collections.Counter()]
                e[0][wid] = s[0]
                for j in (1, 2, 3, 4):
                    e[j].update(s[j])
            if (i + 1) % 100 == 0:
                print(f"  {i + 1} / {len(jobs)}", flush=True)
    with (CACHE / "lemmas.pkl").open("wb") as f:
        pickle.dump({"works": works, "lemmas": lemmas}, f, protocol=pickle.HIGHEST_PROTOCOL)
    print(f"{len(lemmas):,} dictionary words in {len(works)} works, {sum(works.values()):,} words", flush=True)


def load_scan() -> dict:
    with (CACHE / "lemmas.pkl").open("rb") as f:
        return pickle.load(f)


def check_against_lexicon(data: dict) -> None:
    """Every dictionary word's total must equal the Word Study index's, or the site would disagree with itself."""
    bad = 0
    n = 0
    for p in LEXICON.glob("*.json"):
        if p.name.startswith("_"):
            continue
        for lemma, e in json.loads(p.read_text(encoding="utf-8")).items():
            n += 1
            ours = data["lemmas"].get(lemma)
            total = sum(ours[0].values()) if ours else 0
            if total != e["n"]:
                bad += 1
                if bad <= 10:
                    print(f"  mismatch {lemma}: census {total}, Word Study {e['n']}")
    if bad or n != len(data["lemmas"]):
        raise SystemExit(f"{bad} counts differ from the Word Study index ({n:,} words there, {len(data['lemmas']):,} here)")
    print(f"all {n:,} dictionary words agree with the Word Study index", flush=True)


# ------------------------------------------------------------------ step 2: sorting
from census_lists import (GODS_HEROES, LEFT_OUT, NAMES_CHECKED_MIN, OBJECT_OVERRIDES,   # noqa: E402
                          OBJECTS_CHECKED_MIN, OVERRIDES)

NAME_CLASS = {"human": "person", "place": "place", "natobj": "place", "ethnonym": "people", "group": "people"}

# Object groups: WordNet 3.0 synsets whose hyponyms belong to the group, in order of precedence
# (a word goes to the first group its sense falls under).
OBJECT_GROUPS = [
    ("ships", "Ships and boats", ["vessel.n.02", "boat.n.01", "ship.n.01"]),
    ("vehicles", "Chariots and wagons", ["wheeled_vehicle.n.01"]),
    ("weapons", "Weapons and armour", ["weapon.n.01", "weaponry.n.01", "armor.n.01", "body_armor.n.01", "helmet.n.02", "shield.n.02", "arrow.n.01"]),
    ("animals", "Animals", ["animal.n.01"]),
    ("money", "Money", ["coin.n.01", "currency.n.01", "monetary_unit.n.01", "money.n.01"]),
    ("music", "Musical instruments", ["musical_instrument.n.01"]),
    ("food", "Food and drink", ["food.n.01", "food.n.02", "beverage.n.01", "foodstuff.n.02", "nutriment.n.01"]),
    ("plants", "Plants and trees", ["plant.n.02", "tree.n.01", "flower.n.01", "vegetable.n.01", "fruit.n.01"]),
    ("clothing", "Clothing and jewellery", ["clothing.n.01", "jewelry.n.01", "garment.n.01", "footwear.n.02", "headdress.n.01", "adornment.n.01"]),
    ("containers", "Cups, jars and other vessels", ["container.n.01", "vessel.n.03"]),
    ("tools", "Tools", ["tool.n.01", "implement.n.01"]),
    ("buildings", "Buildings", ["building.n.01", "structure.n.01"]),
    ("materials", "Metals, stones and other materials", ["metal.n.01", "metallic_element.n.01", "stone.n.02", "rock.n.01", "gem.n.02", "material.n.01"]),
    ("body", "Parts of the body", ["body_part.n.01", "organ.n.01"]),
    ("sky", "Sun, moon and stars", ["celestial_body.n.01"]),
]
OBJECT_MIN = 20          # object words used fewer times are not sorted
SENSE_SHARE = 0.4        # the leading sense must cover this share of the word's sense-tagged uses


def is_capital(raw: str) -> bool:
    return raw[:1] != raw[:1].lower()


def all_caps(raw: str) -> bool:
    letters = regex.sub(r"[^\p{L}]", "", raw)
    return letters == letters.upper()


def sort_names(lemmas: dict) -> tuple[dict, dict]:
    """canon lemma -> (category, display, checked) for names; and the names left out, with reasons."""
    by_display = {}
    for k, e in lemmas.items():
        raw = e[1].most_common(1)[0][0]
        if is_capital(raw):
            by_display[raw] = k
    for name in [*GODS_HEROES, *OVERRIDES, *LEFT_OUT]:
        if name not in by_display:
            raise SystemExit(f"census_lists.py names {name}, which is not a GLAUx dictionary word written with a capital")
    out = {}
    left = {}
    for raw, k in by_display.items():
        e = lemmas[k]
        total = sum(e[0].values())
        pos = e[4].most_common(1)[0][0]
        if raw in LEFT_OUT:
            left[k] = (raw, LEFT_OUT[raw], total)
            continue
        if raw in GODS_HEROES:
            cat = "god"
        elif raw in OVERRIDES:
            cat = OVERRIDES[raw]
        elif all_caps(raw):
            cat = None                                   # letters of geometry figures (ΑΒΓ)
        elif pos == "a":
            cat = None if raw.endswith("κός") else "people"   # "Athenian" is a people; "Attic" (-κός) describes things
        elif pos == "n" and e[2]:
            cat = NAME_CLASS.get(e[2].most_common(1)[0][0])
        else:
            cat = None
        if cat:
            out[k] = (cat, raw, total >= NAMES_CHECKED_MIN)
    return out, left


def sort_objects(lemmas: dict, names: dict) -> dict:
    """canon lemma -> (group, display, checked) for common nouns whose GLAUx sense falls in a group."""
    import nltk
    try:
        from nltk.corpus import wordnet as wn
        wn.ensure_loaded()
    except LookupError:
        nltk.download("wordnet", quiet=True)
        from nltk.corpus import wordnet as wn
    roots = [(g, {wn.synset(s) for s in ss}) for g, _, ss in OBJECT_GROUPS]
    memo: dict[str, str | None] = {}

    def group_of(sense: str) -> str | None:
        if sense not in memo:
            try:
                s = wn.synset(sense)
            except Exception:
                memo[sense] = None
                return None
            anc = set(s.closure(lambda x: x.hypernyms() + x.instance_hypernyms())) | {s}
            memo[sense] = next((g for g, rs in roots if anc & rs), None)
        return memo[sense]

    for k in OBJECT_OVERRIDES:
        if k not in lemmas:
            raise SystemExit(f"census_lists.py names {k}, which is not a GLAUx dictionary word")
    out = {}
    for k, e in lemmas.items():
        raw = e[1].most_common(1)[0][0]
        if k in names or is_capital(raw) or e[4].most_common(1)[0][0] != "n":
            continue
        total = sum(e[0].values())
        if total < OBJECT_MIN:
            continue
        g = None
        tagged = sum(e[3].values())
        if tagged:
            sense, c = e[3].most_common(1)[0]
            if c >= SENSE_SHARE * tagged:
                g = group_of(sense)
        if k in OBJECT_OVERRIDES:
            g = OBJECT_OVERRIDES[k]
        if g:
            out[k] = (g, raw, total >= OBJECTS_CHECKED_MIN)
    return out


# ------------------------------------------------------------------ phrases
CONTENT = set("nva")
NO_START = set("bcg")         # conjunctions (GLAUx: b coordinating, c subordinating), particles
NO_END = set("lrbcg")         # articles, prepositions, conjunctions, particles
BE = "εἰμί"                   # "to be" does not count as a content word
MAX_N = 6


def grams(t: dict):
    """Every candidate phrase in a work, with the index of its first word."""
    forms, pos, lem, br = t["forms"], t["pos"], t["lemmas"], t["breaks"]
    n = len(forms)
    for i in range(n):
        if pos[i] in NO_START or pos[i] == "-":
            continue
        content = 0
        for j in range(i + 1, min(i + MAX_N, n) + 1):
            if j - 1 > i and br[j - 1]:
                break
            p = pos[j - 1]
            if p == "-":
                break
            if p in CONTENT and lem[j - 1] != BE:
                content += 1
            if j - i >= 2 and content >= 2 and p not in NO_END:
                yield " ".join(forms[i:j]), i


def load_tokens(wid: str) -> dict:
    with (CACHE / "tokens" / f"{wid}.pkl").open("rb") as f:
        return pickle.load(f)


def phrase_pass1(wid: str) -> tuple[str, dict]:
    c = collections.Counter(g for g, _ in grams(load_tokens(wid)))
    return wid, {k: v for k, v in c.items() if v >= 2}


_CANDIDATES: set[str] = set()


def _init_candidates(cands: set[str]) -> None:
    global _CANDIDATES
    _CANDIDATES = cands


def phrase_pass2(wid: str) -> tuple[str, dict]:
    """Exact counts of the candidate phrases in one work, with the passage (unit) of each."""
    t = load_tokens(wid)
    units = t["units"]
    out: dict[str, list[int]] = {}
    for g, i in grams(t):
        if g in _CANDIDATES:
            out.setdefault(g, []).append(units[i])
    return wid, out


def top(counts: dict, n: int) -> list[tuple[str, int]]:
    """The n largest counts; ties in alphabetical order, so every build gives the same lists."""
    return sorted(counts.items(), key=lambda x: (-x[1], x[0]))[:n]


def build_phrases(works: list[str]) -> dict[str, dict[str, list[int]]]:
    """phrase -> {work: [unit of each occurrence]} for the phrases worth listing."""
    approx: collections.Counter = collections.Counter()
    per_work_top: set[str] = set()
    with multiprocessing.Pool() as pool:
        for wid, c in pool.imap_unordered(phrase_pass1, works, chunksize=2):
            approx.update(c)
            per_work_top.update(k for k, v in top(c, 25) if v >= 3)
    cands = {k for k, _ in top(approx, 6000)} | per_work_top
    print(f"phrases: {len(approx):,} repeated within a work; {len(cands):,} candidates", flush=True)
    occ: dict[str, dict[str, list[int]]] = {}
    with multiprocessing.Pool(initializer=_init_candidates, initargs=(cands,)) as pool:
        for wid, found in pool.imap_unordered(phrase_pass2, works, chunksize=2):
            for g, us in found.items():
                occ.setdefault(g, {})[wid] = us
    # a phrase nearly always found inside a longer one is shown as the longer one
    count = {g: sum(len(u) for u in w.values()) for g, w in occ.items()}
    drop = set()
    for g, c in count.items():
        words = g.split(" ")
        if len(words) < 3:
            continue
        for sub in (" ".join(words[1:]), " ".join(words[:-1])):
            if sub in count and c >= 0.8 * count[sub]:
                drop.add(sub)
    return {g: w for g, w in occ.items() if g not in drop and count[g] >= 2}


# ------------------------------------------------------------------ groups of works
# The same families and periods as the library's filters (web/src/lib/works-meta.ts); a test in
# web/src/lib/census.test.ts checks that the labels still agree.
FAMILIES = [
    ("Epic", ["Epic poetry"]),
    ("Lyric and elegy", ["Lyric poetry"]),
    ("Drama", ["Tragedy", "Comedy"]),
    ("History and biography", ["History", "Biography", "Military", "Geography"]),
    ("Philosophy", ["Philosophy", "Philosophic Dialogue", "Dialogue"]),
    ("Oratory and rhetoric", ["Oratory", "Rhetoric"]),
    ("Letters", ["Epistolography"]),
    ("Medicine", ["Medicine", "Biology"]),
    ("Science and mathematics", ["Mathematics", "Astronomy/Astrology", "Physics", "Engineering", "Scientific Poetry", "Music", "Alchemy"]),
    ("Novels, myths and marvels", ["Narrative", "Mythography", "Paradoxography"]),
    ("Religion", ["Theology", "Religious Epistle", "Religious History", "Religious Prophecy", "Religious Narrative", "Religious Poetry", "Religious Wisdom"]),
    ("Scholarship", ["Commentary", "Language", "Polyhistory", "Art", "Oneirocritic"]),
]
PERIODS = [
    ("Archaic · 8th–6th c. BC", lambda y: y <= -600),
    ("Classical · 5th–4th c. BC", lambda y: -600 < y <= -400),
    ("Hellenistic · 3rd–1st c. BC", lambda y: -400 < y <= -100),
    ("Roman · 1st–3rd c. AD", lambda y: -100 < y <= 201),
    ("Late Antique · 4th c. AD and later", lambda y: y > 201),
]
TOP = {"core": 100, "author": 50, "work": 20}


def work_groups(wid: str, meta: dict) -> list[str]:
    m = meta.get(wid, {})
    gs = ["all", f"a:{wid.split('.')[0]}", f"w:{wid}"]
    fam = next((i for i, (_, genres) in enumerate(FAMILIES) if m.get("genre") in genres), None)
    per = next((i for i, (_, f) in enumerate(PERIODS) if m.get("from") is not None and f(m["from"])), None)
    if fam is not None:
        gs.append(f"f{fam}")
    if per is not None:
        gs.append(f"p{per}")
    if fam is not None and per is not None:
        gs.append(f"f{fam}p{per}")
    return gs


# ------------------------------------------------------------------ glosses
def short(s: str, limit: int = 70) -> str:
    s = re.sub(r"\s+", " ", s).strip(" ,;:.")
    if len(s) <= limit:
        return s
    cut = max(s.rfind(sep, 0, limit) for sep in (",", ";"))
    return (s[:cut] if cut > 20 else s[:limit].rsplit(" ", 1)[0]) + "…"


def glosses(keys: dict[str, str], senses: dict[str, str]) -> dict[str, str]:
    """
    canon lemma -> a short English meaning: the DCC core list's, else one sense from LSJ's short
    definition: the one that names GLAUx's own sense of the word (WordNet), else the first plain one.
    """
    from nltk.corpus import wordnet as wn
    core = json.loads((ROOT / "web" / "public" / "data" / "core.json").read_text(encoding="utf-8"))["words"]
    out = {}
    lsj_dir = ROOT / "web" / "public" / "data" / "lsj"
    lsj: dict[str, dict] = {}

    def fold(s: str) -> str:
        return _FOLD.sub("", unicodedata.normalize("NFD", s)).lower().replace("ς", "σ").replace("ϲ", "σ")

    for k, display in keys.items():
        c = core.get(display) or core.get(k)
        if c and c[0].get("def"):
            out[k] = short(c[0]["def"])
            continue
        shard = re.sub(r"[^α-ωϝ]", "", fold(display))[:2] or "_"
        if shard not in lsj:
            p = lsj_dir / f"{shard}.json"
            lsj[shard] = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
        data = lsj[shard]
        # the exact spelling only: an accent-free match can land on a different word
        entries = data.get(display) or data.get(k)
        s = next((e["s"] for e in entries or [] if e.get("s")), None)
        # LSJ's short definition lists every sense of the entry; keep the first plain English one
        # (not a Latin plant name, a reference or a French phrase, which carry capitals)
        parts = [p for p in (x.strip(" -'‘’“”.…") for x in re.split(r"[,;]", s or "")) if p and not re.search(r"[A-Z]", p)]
        names: list[str] = []
        if k in senses:
            try:
                names = [n.replace("_", " ").lower() for n in wn.synset(senses[k]).lemma_names()]
            except Exception:
                names = []
        first = next((p for p in parts if any(re.search(rf"\b{re.escape(n)}\b", p) for n in names)), parts[0] if parts else None)
        if first:
            out[k] = short(first, 40)
    return out


# ------------------------------------------------------------------ build
def build(data: dict) -> None:
    lemmas = data["lemmas"]
    work_words = data["works"]
    works = sorted(work_words)
    meta = json.loads((ROOT / "web" / "public" / "data" / "works-meta.json").read_text(encoding="utf-8"))["works"]
    catalog = json.loads((ROOT / "web" / "public" / "data" / "catalog.json").read_text(encoding="utf-8"))

    names, left = sort_names(lemmas)
    objects = sort_objects(lemmas, names)
    phrases = build_phrases(works)

    # every list: category -> {item: {work: count}}
    lists: dict[str, dict[str, dict[str, int]]] = collections.defaultdict(dict)
    for k, (cat, _, _) in names.items():
        lists[cat][k] = lemmas[k][0]
    for k, (g, _, _) in objects.items():
        lists[f"obj:{g}"][k] = lemmas[k][0]
    for k, e in lemmas.items():
        lists["words"][k] = e[0]
        raw = e[1].most_common(1)[0][0]
        pos = e[4].most_common(1)[0][0]
        if not is_capital(raw) and pos in ("n", "v", "a"):
            lists[{"n": "noun", "v": "verb", "a": "adj"}[pos]][k] = e[0]
    for g, w in phrases.items():
        lists["phrase"][g] = {wid: len(us) for wid, us in w.items()}

    groups_of = {wid: work_groups(wid, meta) for wid in works}
    group_words: collections.Counter = collections.Counter()
    for wid in works:
        for g in groups_of[wid]:
            group_words[g] += work_words[wid]

    def top_n(g: str) -> int:
        return TOP["work"] if g.startswith("w:") else TOP["author"] if g.startswith("a:") else TOP["core"]

    ranked: dict[str, dict[str, list]] = collections.defaultdict(dict)
    for cat, items in lists.items():
        sums: dict[str, collections.Counter] = collections.defaultdict(collections.Counter)
        for item, per_work in items.items():
            for wid, n in per_work.items():
                for g in groups_of.get(wid, ()):
                    sums[g][item] += n
        for g, c in sums.items():
            ranked[g][cat] = [[k, n] for k, n in top(c, top_n(g))]
        print(f"  {cat}: {len(items):,} items", flush=True)

    # A row is [the word as GLAUx spells it, count], plus a 0 when a name or object was sorted
    # automatically (not looked at by hand). The site's canonLemma() of the spelling is the Word
    # Study key. Meanings are given for words and objects; names get theirs from the map.
    display = {k: lemmas[k][1].most_common(1)[0][0] for k in lemmas}
    shown = set()
    for g in ranked.values():
        for cat, rows in g.items():
            for row in rows:
                k = row[0]
                if cat != "phrase":
                    sorted_as = names.get(k) or objects.get(k)
                    row[0] = display[k]
                    if sorted_as and not sorted_as[2]:
                        row.append(0)
                    if cat not in ("person", "god", "place", "people"):
                        shown.add(k)
    gl = glosses({k: display[k] for k in sorted(shown)}, {k: lemmas[k][3].most_common(1)[0][0] for k in shown if lemmas[k][3]})

    # write
    import shutil
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "a").mkdir(parents=True)
    (OUT / "ph").mkdir(parents=True)

    def dump(path: Path, obj) -> int:
        body = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
        path.write_text(body, encoding="utf-8")
        return len(body.encode("utf-8"))

    size = 0
    core_groups = ["all", *[f"f{i}" for i in range(len(FAMILIES))], *[f"p{i}" for i in range(len(PERIODS))],
                   *[f"f{i}p{j}" for i in range(len(FAMILIES)) for j in range(len(PERIODS))]]
    size += dump(OUT / "core.json", {g: ranked[g] for g in core_groups if g in ranked})
    authors = {a["id"]: a for a in catalog["authors"]}
    author_rows = []
    for aid in sorted({w.split(".")[0] for w in works}):
        a = authors.get(aid)
        aw = [w for w in works if w.startswith(aid + ".")]
        titles = {w["id"]: w["title"] for w in (a or {}).get("works", [])}
        size += dump(OUT / "a" / f"{aid}.json", {g: ranked[g] for g in [f"a:{aid}", *[f"w:{w}" for w in aw]] if g in ranked})
        author_rows.append([aid, a["name"] if a else aid, group_words[f"a:{aid}"], [[w, titles.get(w, w), work_words[w]] for w in aw]])
    size += dump(OUT / "glosses.json", gl)
    # where each listed phrase occurs: [work, [unit of each occurrence]], sharded like the search index
    shards: dict[str, dict] = collections.defaultdict(dict)
    listed = {row[0] for g in ranked.values() for row in g.get("phrase", [])}
    for g in sorted(listed):
        shards[greek_key(g)[:2] or "_"][g] = [[wid, us] for wid, us in sorted(phrases[g].items(), key=lambda x: (-len(x[1]), x[0]))]
    for s, body in shards.items():
        size += dump(OUT / "ph" / f"{s}.json", body)

    left_rows = sorted(([raw, why, n] for raw, why, n in left.values()), key=lambda r: -r[2])
    counts = collections.Counter(c for c, _, _ in names.values())
    size += dump(OUT / "_meta.json", {
        "source": "GLAUx (Keersmaekers 2021), CC BY-SA 4.0; senses: Princeton WordNet 3.0",
        "words": sum(work_words.values()),
        "works": len(works),
        "groups": {"all": ["The whole library", group_words["all"]],
                   **{f"f{i}": [f, group_words[f"f{i}"]] for i, (f, _) in enumerate(FAMILIES)},
                   **{f"p{i}": [p, group_words[f"p{i}"]] for i, (p, _) in enumerate(PERIODS)},
                   **{f"f{i}p{j}": [f"{f} · {p.split(' · ')[0]}", group_words[f"f{i}p{j}"]]
                      for i, (f, _) in enumerate(FAMILIES) for j, (p, _) in enumerate(PERIODS) if group_words[f"f{i}p{j}"]}},
        "authors": author_rows,
        "objects": [[g, label] for g, label, _ in OBJECT_GROUPS],
        "sizes": {**counts, **{f"obj:{g}": sum(1 for v in objects.values() if v[0] == g) for g, _, _ in OBJECT_GROUPS},
                  "phrase": len(phrases), "words": len(lemmas)},
        "checked": {"names": NAMES_CHECKED_MIN, "objects": OBJECTS_CHECKED_MIN},
        "leftOut": left_rows,
    })
    print(f"census: {len(gl):,} meanings, {len(author_rows)} authors, {size / 1e6:.1f} MB in {OUT}", flush=True)


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    if "--rescan" in sys.argv or not (CACHE / "lemmas.pkl").exists():
        scan()
    data = load_scan()
    check_against_lexicon(data)
    build(data)


if __name__ == "__main__":
    main()
