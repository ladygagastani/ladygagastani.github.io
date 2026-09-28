"""
Publish the large generated data packs to their own GitHub Pages site, so the live site can use them:
  https://mathesisstoicheion.github.io/packs/words/…   word analyses   (pipeline/build_words.py)
                                     /lsj/…     LSJ              (pipeline/build_lsj.py)
                                     /lexicon/… Word Study index (web/scripts/build-lexicon.ts)
                                     /search/…  Oracle index     (web/scripts/build-search.ts)
The live site is built with NEXT_PUBLIC_PACKS=/packs (.github/workflows/deploy.yml, web/src/config/packs.ts).
Same address as the site: visitors' browsers contact no one else, and the offline helper can keep the files.

Each run replaces the whole repository with one fresh commit (the files are rebuilt, not edited, so no
history is kept and the repository stays the size of the data, about 760 MB; GitHub Pages allows 1 GB).

Needs, once: an empty public repository github.com/mathesisstoicheion/packs, with Settings → Pages →
"Deploy from a branch", branch main, folder / (root). See DEPLOYMENT.md.

Usage:  python pipeline/publish_packs.py            check and stage only (prints what would be sent)
        python pipeline/publish_packs.py --push     also push (replaces what is online)
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "web" / "public" / "data"
STAGE = ROOT / "pipeline" / ".cache" / "packs-publish"
REMOTE = "https://github.com/mathesisstoicheion/packs.git"
KINDS = ["words", "lsj", "lexicon", "search"]
PAGES_LIMIT = 1_000_000_000
FILE_LIMIT = 100_000_000

README = """# Data packs for Mathesis Stoicheion

Generated files used by https://mathesisstoicheion.github.io/ (the Greek reader): word analyses (`words/`),
the Liddell–Scott–Jones dictionary (`lsj/`), the Word Study index (`lexicon/`) and the search index
(`search/`). They are rebuilt by the site's pipeline and replaced here as a whole; do not edit them by hand.

Sources and licences:
- Word analyses: GLAUx, by Alek Keersmaekers, CC BY-SA 4.0 (some source texts and hand annotations carry
  other licences, listed in GLAUx's metadata). https://github.com/alekkeersmaekers/glaux
- LSJ: Text provided under a CC BY-SA license by Perseus Digital Library, http://www.perseus.tufts.edu, with
  funding from The National Endowment for the Humanities. Data accessed from https://github.com/PerseusDL/lexica/.
- Search index: built from the Perseus Digital Library (canonical-greekLit) and First1KGreek texts,
  CC BY-SA 4.0, and from GLAUx.

These derived files are shared under CC BY-SA 4.0. Full credits: https://mathesisstoicheion.github.io/credits
"""


def run(*args: str, cwd: Path = STAGE) -> str:
    return subprocess.run(args, cwd=cwd, check=True, capture_output=True, text=True).stdout.strip()


def main() -> None:
    push = "--push" in sys.argv
    missing = [k for k in KINDS if not (DATA / k / "_index.json").exists() and not (DATA / k / "texts.json").exists()]
    if missing:
        raise SystemExit(f"not built yet: {missing} (see README.md, 'The large data files')")

    files = [p for k in KINDS for p in (DATA / k).rglob("*") if p.is_file()]
    total = sum(p.stat().st_size for p in files)
    big = [p for p in files if p.stat().st_size >= FILE_LIMIT]
    print(f"{len(files):,} files, {total / 1e6:.0f} MB")
    if big:
        raise SystemExit(f"GitHub refuses files of 100 MB or more: {big}")
    if total >= PAGES_LIMIT * 0.95:
        raise SystemExit("too close to GitHub Pages' 1 GB limit: split the packs over two repositories first")

    # a fresh copy of the packs, as one commit
    if STAGE.exists():
        shutil.rmtree(STAGE, onexc=lambda f, p, e: (os.chmod(p, 0o700), f(p)))
    STAGE.mkdir(parents=True)
    for k in KINDS:
        shutil.copytree(DATA / k, STAGE / k)
    (STAGE / ".nojekyll").write_text("")          # serve files whose names start with _ (_index.json)
    (STAGE / "README.md").write_text(README, encoding="utf-8")
    run("git", "init", "-q", "-b", "main")
    run("git", "config", "core.autocrlf", "false")
    run("git", "config", "http.postBuffer", "524288000")   # large pushes over HTTPS
    run("git", "add", "-A")
    run("git", "commit", "-q", "-m", "Data packs for Mathesis Stoicheion (generated; replaced as a whole on each publish)")
    print(f"staged in {STAGE}: {run('git', 'log', '--oneline', '-1')}")
    if not push:
        print("not pushed (add --push to publish)")
        return
    print(f"pushing to {REMOTE} (replaces what is there)...", flush=True)
    subprocess.run(["git", "push", "--force", REMOTE, "main"], cwd=STAGE, check=True)
    print("done. GitHub Pages publishes it in a few minutes: https://mathesisstoicheion.github.io/packs/lsj/_meta.json")


if __name__ == "__main__":
    main()
