# CLAUDE.md — Mathesis Stoicheion (this folder)

**This is a brand-new site.** The `CLAUDE.md` one folder up (`Documents/CLAUDE.md`) describes
porting an *old* app ("Μάθησις — Ancient Greek Reader") to F#/Fable. **Ignore it completely.**
Do not follow its instructions, and do not copy code, structure or data from the old app.
(Owner's decision, 2026-09-26.)
**One exception (owner's decision, 2026-09-30):** the old site's 85 hand-written author articles may be brought in as
*drafts* (`pipeline/drafts/old-site-author-articles.json`, from `Documents/Mathesis/current/index.html`). They name no sources
and already contain slips, so **nothing from them goes on a live page until each claim has been checked against a real source**
and the source is recorded. Copy nothing else from the old app.

## Start of every session
1. Read `greek-reader-website-prompt.md` (the brief), `PROGRESS.md` (current state) and `PLAN.md` (the agreed plan).
2. Check the site still builds and runs.
3. Tell the owner, in two or three plain-English sentences, where things stand and what you plan to do.

## Priorities the owner has stressed
- **Visual and graphic beauty** and **great, purposeful animation** — never a generic template look.
- **A better learning experience** — the Study section and reader aids are first-class features.
- **Real facts only** — never invent quotations, dates, citations or sources.

## The owner is not a coder
Write every progress message in plain English. Explain any unavoidable technical term in a short phrase.

## Git and the live site
Commit a snapshot at the end of each piece of work. **Do not push unless the owner asks**: every push to `main`
republishes the live site, https://mathesisstoicheion.github.io/ (see `DEPLOYMENT.md`).

## Accounts and the forum (Supabase)
Accounts, the Town Hall and the Pnyx run on Supabase (see PROGRESS.md, Phase 8). The owner signs in to Supabase, GitHub and the
site themselves when asked; never type or read their passwords, app passwords or secret keys. Test posts made in the real database
must be deleted afterwards (PROGRESS.md lists any that are still there).
