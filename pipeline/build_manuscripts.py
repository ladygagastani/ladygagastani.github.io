"""
Build web/public/data/manuscripts/venetus-a-iliad.json: for every line of the Iliad, the page of the Venetus A
(Venice, Biblioteca Nazionale Marciana, Marc. gr. Z. 454 = 822) it is written on, and where on the photograph.

Source: the Homer Multitext project's published archive (github.com/homermultitext/hmt-archive), its "hmtdse"
index: each Iliad line of the manuscript with the photograph and the region of it (x, y, width, height, as
fractions of the image) and the page. Licence of the data: CC BY-NC 4.0 (stated in the release itself). The
photographs stay on the project's own image server and are shown from there; nothing of them is copied.

Pinned to the archive's commit at build time (recorded in the output), so the file can be rebuilt exactly.

Also web/public/data/manuscripts/<id>.json for manuscripts published by their library as a IIIF manifest
(Florence, Paris): the list of folios and the address of each page's photograph on the library's image
server, read from the manifest, so the browser does not have to fetch the whole manifest.

Usage:  python pipeline/build_manuscripts.py          (needs a connection to github.com and the libraries)
"""
import json
import re
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "web" / "public" / "data" / "manuscripts" / "venetus-a-iliad.json"
UA = {"User-Agent": "MathesisStoicheion/0.1 (learning site; mathesis.stoicheion@gmail.com)"}
REPO = "homermultitext/hmt-archive"
IMAGES = "https://www.homermultitext.org/iipsrv?IIIF=/project/homer/pyramidal/deepzoom/hmt/{coll}/{ver}/{id}.tif"


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
        return r.read()


# id -> (manifest, the pattern that reads a folio from a page label)
MANIFESTS = {
    "laur-32-9": ("https://cdm21059.contentdm.oclc.org/iiif/plutei:711140/manifest.json", r"^Carta: (\d+[rv])$"),
    "paris-gr-1807": ("https://gallica.bnf.fr/iiif/ark:/12148/btv1b8419248n/manifest.json", r"^(\d+[rv])$"),
}


def manifest_pages(ms: str, url: str, pattern: str) -> None:
    m = json.loads(get(url))
    pages = []
    for c in m["sequences"][0]["canvases"]:
        f = re.match(pattern, str(c["label"]).strip())
        if not f:
            continue
        res = c["images"][0]["resource"]
        pages.append([f.group(1), res["service"]["@id"]])
    out = OUT.parent / f"{ms}.json"
    out.write_text(json.dumps({"manuscript": ms, "source": url, "built": date.today().isoformat(), "pages": pages},
                              ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{ms}: {len(pages)} folios, {pages[0][0]} to {pages[-1][0]} -> {out.name} ({out.stat().st_size // 1024} KB)")


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    for ms, (url, pattern) in MANIFESTS.items():
        manifest_pages(ms, url, pattern)

    sha = json.loads(get(f"https://api.github.com/repos/{REPO}/commits/master"))["sha"]
    cex = get(f"https://raw.githubusercontent.com/{REPO}/{sha}/releases-cex/hmt-current.cex").decode("utf-8")
    release = re.search(r"^name\|(.+)$", cex, re.M).group(1)
    licence = re.search(r"^license\|(.+)$", cex, re.M).group(1)

    # passage | image@x,y,w,h | page, for the Venetus A's Iliad ("msA"); titles and the like are not lines
    row = re.compile(r"^urn:cts:greekLit:tlg0012\.tlg001\.msA:(\d+\.\d+[a-z]?)\|urn:cite2:hmt:(\w+)\.(\w+):(\w+)@([\d.]+),([\d.]+),([\d.]+),([\d.]+)\|urn:cite2:hmt:msA\.v1:(\w+)$", re.M)
    pages: list[list[str]] = []
    page_ix: dict[tuple[str, str], int] = {}
    lines: dict[str, list] = {}
    colls = set()
    for m in row.finditer(cex):
        ref, coll, ver, img, x, y, w, h, folio = m.groups()
        colls.add((coll, ver))
        key = (folio, img)
        if key not in page_ix:
            page_ix[key] = len(pages)
            pages.append([folio, img])
        if ref not in lines:   # a line indexed twice keeps its first place
            lines[ref] = [page_ix[key], *(round(float(v), 4) for v in (x, y, w, h))]

    if len(colls) != 1:
        raise SystemExit(f"expected one image collection, found {colls}")
    coll, ver = colls.pop()
    # pages in the order of the book: folio number, then recto before verso
    order = sorted(range(len(pages)), key=lambda i: (int(re.match(r"\d+", pages[i][0]).group()), pages[i][0][-1] != "r", pages[i][0]))
    remap = {old: new for new, old in enumerate(order)}
    pages = [pages[i] for i in order]
    for v in lines.values():
        v[0] = remap[v[0]]

    out = {
        "manuscript": "venetus-a",
        "source": f"Homer Multitext project, {release} (github.com/{REPO}, commit {sha[:12]})",
        "licence": licence,
        "built": date.today().isoformat(),
        "images": IMAGES.replace("{coll}", coll).replace("{ver}", ver),
        "pages": pages,
        "lines": lines,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    books = {r.split(".")[0] for r in lines}
    print(f"{len(lines)} lines in {len(books)} books on {len(pages)} pages -> {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
