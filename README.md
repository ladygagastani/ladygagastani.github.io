# Mathesis Stoicheion · Μάθησις Στοιχείων

A free website for learning to read Ancient Greek and exploring the Greek world. It has no adverts and no trackers.

- **Brief:** `greek-reader-website-prompt.md` describes what the site should be.
- **Plan:** `PLAN.md` describes how it is built.
- **State:** `PROGRESS.md` records what is done, the decisions log, known problems and next steps. Read it first.
- **Instructions for AI sessions:** `CLAUDE.md`.

## Folders

| Folder | What it is |
|---|---|
| `web/` | The website (Next.js 16, React 19, TypeScript). |
| `design-study/` | The Phase 0 prototype of three visual directions. Kept for reference; not used by the site. |
| `pipeline/` | *(Phase 2)* Python scripts that build the catalogue, word pack and search indexes from the original collections. |

## Running the site

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000.

| Command (in `web/`) | What it does |
|---|---|
| `npm run build` | Production build, which also type-checks. |
| `npm test` | Unit tests (Vitest). |
| `npm run e2e` | Click-through tests in Microsoft Edge (Playwright). The command builds and starts the site itself. |
| `npx eslint` | Lint. |

## Where things live in `web/src`

- `config/areas.ts` holds **every area's Greek name**, English subtitle and explanation. Change names only here.
- `config/sources.ts` holds the original text collections (Perseus, First1KGreek).
- `app/globals.css` is the design system: tokens for both themes, ornament bands and the page-turn transition.
- `components/Page.tsx` wraps every page so the page-turn transition plays.
- `lib/settings.ts` stores the reader's settings, together with the boot script that applies them before first paint.
- `lib/ui.ts` holds site-wide UI state that survives page changes.

## Content rules

Texts and translations are shown exactly as the source files give them, and are never edited. Every fact needs a
source. Every image, font and data set is listed with its licence on the Credits page (`app/credits/page.tsx`).
