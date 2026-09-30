/**
 * Where the large generated data packs are served from: word analyses (words), LSJ (lsj), the Word
 * Study index (lexicon) and the Oracle's index (search). They are too big for the site's own
 * repository. On a development computer they sit in public/data like everything else; the live
 * site is built with NEXT_PUBLIC_PACKS=/packs and gets them from a second GitHub Pages site at the
 * same address (https://mathesisstoicheion.com/packs/), published by pipeline/publish_packs.py.
 * Same address means no third party is contacted, and the offline helper can keep the files.
 */
export const PACKS = process.env.NEXT_PUBLIC_PACKS || "/data";
