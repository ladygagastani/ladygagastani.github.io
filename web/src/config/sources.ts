/**
 * The original text collections. Texts and translations are read from these files exactly as
 * published and are never altered (owner's decision, 2026-09-26; see PROGRESS.md).
 */
export interface Collection {
  id: "perseus" | "first1k";
  name: string;
  owner: string;
  repo: string;
  branch: string;
  licence: string;
  description: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "perseus",
    name: "Perseus Digital Library",
    owner: "PerseusDL",
    repo: "canonical-greekLit",
    branch: "master",
    licence: "CC BY-SA 4.0",
    description: "The classic canon, from Homer to the Church Fathers, with many English translations.",
  },
  {
    id: "first1k",
    name: "First Thousand Years of Greek",
    owner: "OpenGreekAndLatin",
    repo: "First1KGreek",
    branch: "master",
    licence: "CC BY-SA 4.0",
    description: "Hundreds more Greek authors, especially later and less-read ones.",
  },
];

export const repoUrl = (c: Collection) => `https://github.com/${c.owner}/${c.repo}`;
export const zipUrl = (c: Collection) => `https://github.com/${c.owner}/${c.repo}/archive/refs/heads/${c.branch}.zip`;
export const rawUrl = (c: Collection, path: string) =>
  `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.branch}/${path}`;
