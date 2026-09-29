/**
 * Standard Attic paradigms (tables of forms). Each form carries its AGDT tag so that
 * pipeline/check_paradigms.py can confirm it is attested with that analysis in GLAUx.
 * Where two forms are given ("ἐμοῦ, μου"), both are standard.
 */
export interface Paradigm {
  id: string;
  title: string;          // "Second declension: λόγος"
  lemma: string;
  colLemmas?: string[];   // when columns belong to different dictionary words (ἐγώ / σύ)
  group: "article" | "noun" | "adjective" | "pronoun" | "verb";
  note?: string;
  rows: string[];         // row labels, e.g. cases or persons
  cols: string[];         // column labels, e.g. singular / plural, or genders
  cells: string[][];      // [row][col] forms
  tags: string[][];       // [row][col] AGDT tags, same shape
  lesson?: string;        // lesson that introduces it
}

const CASES = ["nominative", "genitive", "dative", "accusative", "vocative"];
const C = ["n", "g", "d", "a", "v"];
/** tags for a noun-like table: rows = cases, cols = [sg, pl] */
const nounTags = (pos: string, gender: string, rows = C) => rows.map((c) => ["s", "p"].map((n) => `${pos}-${n}---${gender}${c}-`));

export const PARADIGMS: Paradigm[] = [
  {
    id: "article", title: "The article", lemma: "ὁ", group: "article", lesson: "article",
    note: "The article has no vocative; ὦ is often used before a name when addressing someone.",
    rows: CASES.slice(0, 4), cols: ["masc. sg", "fem. sg", "neut. sg", "masc. pl", "fem. pl", "neut. pl"],
    cells: [
      ["ὁ", "ἡ", "τό", "οἱ", "αἱ", "τά"],
      ["τοῦ", "τῆς", "τοῦ", "τῶν", "τῶν", "τῶν"],
      ["τῷ", "τῇ", "τῷ", "τοῖς", "ταῖς", "τοῖς"],
      ["τόν", "τήν", "τό", "τούς", "τάς", "τά"],
    ],
    tags: C.slice(0, 4).map((c) => ["s", "s", "s", "p", "p", "p"].map((n, i) => `l-${n}---${"mfnmfn"[i]}${c}-`)),
  },
  {
    id: "logos", title: "Second declension, masculine: λόγος", lemma: "λόγος", group: "noun", lesson: "second-declension",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["λόγος", "λόγοι"], ["λόγου", "λόγων"], ["λόγῳ", "λόγοις"], ["λόγον", "λόγους"], ["λόγε", "λόγοι"]],
    tags: nounTags("n", "m"),
  },
  {
    id: "doron", title: "Second declension, neuter: δῶρον", lemma: "δῶρον", group: "noun", lesson: "second-declension",
    note: "Neuters have the same form in nominative, accusative and vocative, and end in -α in the plural.",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["δῶρον", "δῶρα"], ["δώρου", "δώρων"], ["δώρῳ", "δώροις"], ["δῶρον", "δῶρα"], ["δῶρον", "δῶρα"]],
    tags: nounTags("n", "n"),
  },
  {
    id: "psyche", title: "First declension: ψυχή", lemma: "ψυχή", group: "noun", lesson: "first-declension",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["ψυχή", "ψυχαί"], ["ψυχῆς", "ψυχῶν"], ["ψυχῇ", "ψυχαῖς"], ["ψυχήν", "ψυχάς"], ["ψυχή", "ψυχαί"]],
    tags: nounTags("n", "f"),
  },
  {
    id: "chora", title: "First declension, long α: χώρα", lemma: "χώρα", group: "noun", lesson: "first-declension",
    note: "After ε, ι or ρ the singular keeps α instead of η.",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["χώρα", "χῶραι"], ["χώρας", "χωρῶν"], ["χώρᾳ", "χώραις"], ["χώραν", "χώρας"], ["χώρα", "χῶραι"]],
    tags: nounTags("n", "f"),
  },
  {
    id: "doxa", title: "First declension, short α: δόξα", lemma: "δόξα", group: "noun", lesson: "first-declension",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["δόξα", "δόξαι"], ["δόξης", "δοξῶν"], ["δόξῃ", "δόξαις"], ["δόξαν", "δόξας"], ["δόξα", "δόξαι"]],
    tags: nounTags("n", "f"),
  },
  {
    id: "polites", title: "First declension, masculine: πολίτης", lemma: "πολίτης", group: "noun",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["πολίτης", "πολῖται"], ["πολίτου", "πολιτῶν"], ["πολίτῃ", "πολίταις"], ["πολίτην", "πολίτας"], ["πολῖτα", "πολῖται"]],
    tags: nounTags("n", "m"),
  },
  {
    id: "phylax", title: "Third declension: φύλαξ", lemma: "φύλαξ", group: "noun", lesson: "third-declension",
    note: "The stem (φυλακ-) shows in the genitive; the nominative hides it (κ + ς = ξ).",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["φύλαξ", "φύλακες"], ["φύλακος", "φυλάκων"], ["φύλακι", "φύλαξι(ν)"], ["φύλακα", "φύλακας"], ["φύλαξ", "φύλακες"]],
    tags: nounTags("n", "m"),
  },
  {
    id: "soma", title: "Third declension, neuter: σῶμα", lemma: "σῶμα", group: "noun", lesson: "third-declension",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["σῶμα", "σώματα"], ["σώματος", "σωμάτων"], ["σώματι", "σώμασι(ν)"], ["σῶμα", "σώματα"], ["σῶμα", "σώματα"]],
    tags: nounTags("n", "n"),
  },
  {
    id: "polis", title: "Third declension, stems in ι/ε: πόλις", lemma: "πόλις", group: "noun", lesson: "third-declension",
    note: "The genitive πόλεως comes from an older πόληος: the two vowels exchanged their lengths, and the accent stayed where it was.",
    rows: CASES, cols: ["singular", "plural"],
    cells: [["πόλις", "πόλεις"], ["πόλεως", "πόλεων"], ["πόλει", "πόλεσι(ν)"], ["πόλιν", "πόλεις"], ["πόλι", "πόλεις"]],
    tags: nounTags("n", "f"),
  },
  {
    id: "agathos", title: "Adjective: ἀγαθός, ἀγαθή, ἀγαθόν", lemma: "ἀγαθός", group: "adjective", lesson: "adjectives",
    rows: CASES, cols: ["masc. sg", "fem. sg", "neut. sg", "masc. pl", "fem. pl", "neut. pl"],
    cells: [
      ["ἀγαθός", "ἀγαθή", "ἀγαθόν", "ἀγαθοί", "ἀγαθαί", "ἀγαθά"],
      ["ἀγαθοῦ", "ἀγαθῆς", "ἀγαθοῦ", "ἀγαθῶν", "ἀγαθῶν", "ἀγαθῶν"],
      ["ἀγαθῷ", "ἀγαθῇ", "ἀγαθῷ", "ἀγαθοῖς", "ἀγαθαῖς", "ἀγαθοῖς"],
      ["ἀγαθόν", "ἀγαθήν", "ἀγαθόν", "ἀγαθούς", "ἀγαθάς", "ἀγαθά"],
      ["ἀγαθέ", "ἀγαθή", "ἀγαθόν", "ἀγαθοί", "ἀγαθαί", "ἀγαθά"],
    ],
    tags: C.map((c) => ["s", "s", "s", "p", "p", "p"].map((n, i) => `a-${n}---${"mfnmfn"[i]}${c}-`)),
  },
  {
    id: "ego-sy", title: "Pronouns: ἐγώ (I), σύ (you)", lemma: "ἐγώ", colLemmas: ["ἐγώ", "ἐγώ", "σύ", "σύ"], group: "pronoun",
    note: "The shorter forms (μου, σου…) are unemphatic and lean on the word before them.",
    rows: CASES.slice(0, 4), cols: ["I", "we", "you (one)", "you (all)"],
    cells: [
      ["ἐγώ", "ἡμεῖς", "σύ", "ὑμεῖς"],
      ["ἐμοῦ, μου", "ἡμῶν", "σοῦ, σου", "ὑμῶν"],
      ["ἐμοί, μοι", "ἡμῖν", "σοί, σοι", "ὑμῖν"],
      ["ἐμέ, με", "ἡμᾶς", "σέ, σε", "ὑμᾶς"],
    ],
    tags: C.slice(0, 4).map((c) => [`p1s---m${c}-`, `p1p---m${c}-`, `p2s---m${c}-`, `p2p---m${c}-`]),
  },
  {
    id: "autos", title: "Pronoun: αὐτός, αὐτή, αὐτό", lemma: "αὐτός", group: "pronoun",
    note: "Alone in the genitive, dative or accusative it means him, her, it, them; with the article it means \"the same\".",
    rows: CASES.slice(0, 4), cols: ["masc. sg", "fem. sg", "neut. sg", "masc. pl", "fem. pl", "neut. pl"],
    cells: [
      ["αὐτός", "αὐτή", "αὐτό", "αὐτοί", "αὐταί", "αὐτά"],
      ["αὐτοῦ", "αὐτῆς", "αὐτοῦ", "αὐτῶν", "αὐτῶν", "αὐτῶν"],
      ["αὐτῷ", "αὐτῇ", "αὐτῷ", "αὐτοῖς", "αὐταῖς", "αὐτοῖς"],
      ["αὐτόν", "αὐτήν", "αὐτό", "αὐτούς", "αὐτάς", "αὐτά"],
    ],
    tags: C.slice(0, 4).map((c) => ["s", "s", "s", "p", "p", "p"].map((n, i) => `p-${n}---${"mfnmfn"[i]}${c}-`)),
  },
  {
    id: "eimi", title: "εἰμί (be): present and imperfect", lemma: "εἰμί", group: "verb", lesson: "to-be",
    note: "In the imperfect, the older Attic 1st person singular is ἦ; ἦν is also found.",
    rows: ["I", "you (one)", "he, she, it", "we", "you (all)", "they"], cols: ["present", "imperfect"],
    cells: [["εἰμί", "ἦ, ἦν"], ["εἶ", "ἦσθα"], ["ἐστί(ν)", "ἦν"], ["ἐσμέν", "ἦμεν"], ["ἐστέ", "ἦτε"], ["εἰσί(ν)", "ἦσαν"]],
    tags: ["1s", "2s", "3s", "1p", "2p", "3p"].map((pn) => [`v${pn[0]}${pn[1]}pia---`, `v${pn[0]}${pn[1]}iia---`]),
  },
  {
    id: "luo", title: "λύω (loosen, free): active indicative", lemma: "λύω", group: "verb", lesson: "present-tense",
    note: "λύω is the classic model verb. Its endings are what matter: they appear on thousands of verbs.",
    rows: ["I", "you (one)", "he, she, it", "we", "you (all)", "they"], cols: ["present", "imperfect", "future", "aorist"],
    cells: [
      ["λύω", "ἔλυον", "λύσω", "ἔλυσα"],
      ["λύεις", "ἔλυες", "λύσεις", "ἔλυσας"],
      ["λύει", "ἔλυε(ν)", "λύσει", "ἔλυσε(ν)"],
      ["λύομεν", "ἐλύομεν", "λύσομεν", "ἐλύσαμεν"],
      ["λύετε", "ἐλύετε", "λύσετε", "ἐλύσατε"],
      ["λύουσι(ν)", "ἔλυον", "λύσουσι(ν)", "ἔλυσαν"],
    ],
    tags: ["1s", "2s", "3s", "1p", "2p", "3p"].map((pn) => ["p", "i", "f", "a"].map((t) => `v${pn[0]}${pn[1]}${t}ia---`)),
  },
  {
    id: "luomai", title: "λύομαι: middle and passive, present and imperfect", lemma: "λύω", group: "verb", lesson: "middle-passive",
    note: "In these two tenses the middle and the passive share every form. In the 2nd person singular Attic writers spell -ει (λύει), others -ῃ (λύῃ).",
    rows: ["I", "you (one)", "he, she, it", "we", "you (all)", "they"], cols: ["present", "imperfect"],
    cells: [
      ["λύομαι", "ἐλυόμην"],
      ["λύει, λύῃ", "ἐλύου"],
      ["λύεται", "ἐλύετο"],
      ["λυόμεθα", "ἐλυόμεθα"],
      ["λύεσθε", "ἐλύεσθε"],
      ["λύονται", "ἐλύοντο"],
    ],
    tags: ["1s", "2s", "3s", "1p", "2p", "3p"].map((pn) => ["p", "i"].map((t) => `v${pn[0]}${pn[1]}${t}im---`)),
  },
  {
    id: "luo-mp-aorist", title: "λύω: future middle, aorist middle, aorist passive", lemma: "λύω", group: "verb", lesson: "middle-passive",
    note: "Here the voices part: the middle keeps the σ, the passive has θη. The future passive, λυθήσομαι \"I shall be freed\", is built on the same θη.",
    rows: ["I", "you (one)", "he, she, it", "we", "you (all)", "they"], cols: ["future middle", "aorist middle", "aorist passive"],
    cells: [
      ["λύσομαι", "ἐλυσάμην", "ἐλύθην"],
      ["λύσει, λύσῃ", "ἐλύσω", "ἐλύθης"],
      ["λύσεται", "ἐλύσατο", "ἐλύθη"],
      ["λυσόμεθα", "ἐλυσάμεθα", "ἐλύθημεν"],
      ["λύσεσθε", "ἐλύσασθε", "ἐλύθητε"],
      ["λύσονται", "ἐλύσαντο", "ἐλύθησαν"],
    ],
    tags: ["1s", "2s", "3s", "1p", "2p", "3p"].map((pn) => [["f", "m"], ["a", "m"], ["a", "p"]].map(([t, v]) => `v${pn[0]}${pn[1]}${t}i${v}---`)),
  },
  {
    id: "luon", title: "Participle, present active: λύων, λύουσα, λῦον", lemma: "λύω", group: "verb", lesson: "participles",
    note: "The masculine and neuter decline like third-declension nouns (stem λυοντ-), the feminine like δόξα. Every present active participle of an -ω verb has these endings.",
    rows: CASES.slice(0, 4), cols: ["masc. sg", "fem. sg", "neut. sg", "masc. pl", "fem. pl", "neut. pl"],
    cells: [
      ["λύων", "λύουσα", "λῦον", "λύοντες", "λύουσαι", "λύοντα"],
      ["λύοντος", "λυούσης", "λύοντος", "λυόντων", "λυουσῶν", "λυόντων"],
      ["λύοντι", "λυούσῃ", "λύοντι", "λύουσι(ν)", "λυούσαις", "λύουσι(ν)"],
      ["λύοντα", "λύουσαν", "λῦον", "λύοντας", "λυούσας", "λύοντα"],
    ],
    tags: C.slice(0, 4).map((c) => ["s", "s", "s", "p", "p", "p"].map((n, i) => `v-${n}ppa${"mfnmfn"[i]}${c}-`)),
  },
  {
    id: "lusas", title: "Participle, aorist active: λύσας, λύσασα, λῦσαν", lemma: "λύω", group: "verb", lesson: "participles",
    note: "The same pattern with the aorist's σα: stem λυσαντ-, feminine λυσασ-. No augment: that belongs only to the indicative.",
    rows: CASES.slice(0, 4), cols: ["masc. sg", "fem. sg", "neut. sg", "masc. pl", "fem. pl", "neut. pl"],
    cells: [
      ["λύσας", "λύσασα", "λῦσαν", "λύσαντες", "λύσασαι", "λύσαντα"],
      ["λύσαντος", "λυσάσης", "λύσαντος", "λυσάντων", "λυσασῶν", "λυσάντων"],
      ["λύσαντι", "λυσάσῃ", "λύσαντι", "λύσασι(ν)", "λυσάσαις", "λύσασι(ν)"],
      ["λύσαντα", "λύσασαν", "λῦσαν", "λύσαντας", "λυσάσας", "λύσαντα"],
    ],
    tags: C.slice(0, 4).map((c) => ["s", "s", "s", "p", "p", "p"].map((n, i) => `v-${n}apa${"mfnmfn"[i]}${c}-`)),
  },
];

/** Split a cell into its forms, expanding "(ν)" (movable nu) to both spellings. */
export function formsOf(cell: string): string[] {
  return cell.split(/,\s*/).flatMap((f) => (f.includes("(ν)") ? [f.replace("(ν)", ""), f.replace("(ν)", "ν")] : [f]));
}
