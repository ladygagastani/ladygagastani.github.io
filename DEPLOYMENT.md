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

## What does not work online yet
These generated data packs are not in the repository (they are too large and gitignored), so they are not on the site:
`public/data/words` (word analyses), `public/data/lsj` (LSJ), `public/data/search` (the Oracle's index) and
`public/data/lexicon` (Word Study). Online, the Oracle search, Word Study and the detailed word look-ups
need them; see "Hosting the generated data packs" in `PROGRESS.md`. Note that GitHub refuses single files
over 100 MB and a Pages site should stay under 1 GB.
