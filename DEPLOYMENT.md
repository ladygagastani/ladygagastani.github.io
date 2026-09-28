# Hosting on GitHub Pages

The site is live at **https://ladygagastani.github.io/**, from the repository
https://github.com/ladygagastani/ladygagastani.github.io (public).

## How it works
- `web/next.config.ts` has `output: "export"`, so `npm run build` writes a plain static site to `web/out/`.
- Every push to `main` runs `.github/workflows/deploy.yml` on GitHub: it installs, builds and publishes `web/out/`.
  Progress: the repository's **Actions** tab. A run takes about 3–4 minutes.
- In the repository's Settings → Pages, **Source** is set to **GitHub Actions**.

## To publish a change
Commit, then `git push`. That's all.

## Why the repository is named `ladygagastani.github.io`
A repository with that exact name is served at the top of the address (`/`). The code asks for its files
there (`/data/…`, `/sw.js`, `/images/…`). A repository with any other name would be served at
`/<name>/`, and those requests would fail unless the code were changed to use a base path.

## The database (accounts, the Town Hall, the Pnyx)
These live in Supabase (project `mathesis-stoicheion`, https://supabase.com/dashboard/project/kxwppdhbvlamcmgckqpg), not on GitHub.
A push does not change the database: changes to it are SQL files in `supabase/migrations/`, run by hand in the Supabase SQL editor
(see PROGRESS.md, Next steps). The site only holds the public address and publishable key (`web/src/config/supabase.ts`).

## The large data packs: a second site at `/packs/`
The generated data packs are too large for this repository (they are gitignored): `words` (word analyses),
`lsj` (LSJ), `lexicon` (Word Study) and `search` (the Oracle's index), about 780 MB in 5,100 files. They are
published as a second GitHub Pages site from the repository **`ladygagastani/packs`**, which GitHub serves at
https://ladygagastani.github.io/packs/ — the same address as the site, so visitors' browsers contact nobody
else and the offline helper can keep the files. The live site is built with `NEXT_PUBLIC_PACKS=/packs`
(`deploy.yml`), so it fetches them from there; on your own computer they stay in `web/public/data`
(`web/src/config/packs.ts`).

**Setting it up (once):**
1. On github.com, create a new repository named exactly **`packs`**, **public**, with nothing in it (no README, no licence).
2. Run `python pipeline/publish_packs.py --push` (it uploads about 780 MB; this takes a while).
3. In the `packs` repository: Settings → Pages → Source **Deploy from a branch**, branch **main**, folder **/ (root)** → Save.
4. After a few minutes, https://ladygagastani.github.io/packs/lsj/_meta.json should open.

**After rebuilding any pack** (see README.md, "The large data files"), run `python pipeline/publish_packs.py --push`
again. It replaces the whole `packs` repository with one fresh commit, so it never grows with history.
Without `--push` it only checks and prepares the upload.

Limits: GitHub refuses single files over 100 MB (the largest pack file is 11 MB), and a Pages site should stay
under 1 GB; the script stops if the packs come within 5% of that. Past 1 GB, split them over two repositories
(for example `packs` and `packs2`) and point `search` at the second.

The `packs` site has been live since 2026-09-28 (set up as above).
