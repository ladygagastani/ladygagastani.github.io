/**
 * Passage of the day for Phase 1: Homer, Iliad 1.1–7.
 * Greek: Monro & Allen (Oxford 1908–1920), file tlg0012.tlg001.perseus-grc2.xml.
 * English: A. T. Murray (Loeb 1924), file tlg0012.tlg001.perseus-eng3.xml.
 * Both copied unchanged from PerseusDL/canonical-greekLit (CC BY-SA 4.0); the only change is
 * collapsing one double space in the English. From Phase 2 this is loaded live from the files.
 *
 * The word entries were checked by hand. From Phase 2 they come from the word pack
 * (LSJ / Middle Liddell / Autenrieth + Morpheus) and live sources.
 */
export interface WordEntry {
  lemma: string;     // headword used for dictionary links
  head: string;      // headword as printed in a dictionary, with genitive and article
  parse: string;
  gloss: string;
}

export const PASSAGE = {
  author: "Homer",
  work: "Iliad",
  ref: "1.1–7",
  urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.7",
  edition: "D. B. Monro and T. W. Allen, Oxford 1908–1920",
  translator: "A. T. Murray, 1924",
  lines: [
    [1, "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"],
    [2, "οὐλομένην, ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε,"],
    [3, "πολλὰς δʼ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν"],
    [4, "ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν"],
    [5, "οἰωνοῖσί τε πᾶσι, Διὸς δʼ ἐτελείετο βουλή,"],
    [6, "ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε"],
    [7, "Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς."],
  ] as [number, string][],
  english:
    "The wrath sing, goddess, of Peleus' son, Achilles, that destructive wrath which brought countless woes upon the Achaeans, and sent forth to Hades many valiant souls of heroes, and made them themselves spoil for dogs and every bird; thus the plan of Zeus came to fulfillment, from the time when first they parted in strife Atreus' son, king of men, and brilliant Achilles.",
  notes: [
    { line: 1, greek: "μῆνιν", text: "The poem's first word, \"wrath\". Achilles' anger is the subject of the whole Iliad." },
    { line: 1, greek: "θεά", text: "The poet calls on a goddess, the Muse, to sing the story through him." },
    { line: 5, greek: "Διὸς βουλή", text: "\"The plan of Zeus\". What exactly this plan was has been argued over by ancient and modern readers alike.", certainty: "debated" as const },
  ],
};

const e = (lemma: string, head: string, parse: string, gloss: string): WordEntry => ({ lemma, head, parse, gloss });

export const LEXICON: Record<string, WordEntry> = {
  "μῆνιν": e("μῆνις", "μῆνις, -ιος, ἡ", "noun · accusative singular feminine", "wrath, especially lasting anger"),
  "ἄειδε": e("ἀείδω", "ἀείδω", "present active imperative · 2nd person singular", "sing"),
  "θεὰ": e("θεά", "θεά, -ᾶς, ἡ", "noun · vocative singular feminine", "goddess"),
  "Πηληϊάδεω": e("Πηληϊάδης", "Πηληϊάδης", "noun · genitive singular masculine (Homeric form)", "son of Peleus"),
  "Ἀχιλῆος": e("Ἀχιλλεύς", "Ἀχιλλεύς", "proper noun · genitive singular (Homeric form)", "Achilles"),
  "οὐλομένην": e("ὄλλυμι", "ὄλλυμι", "aorist middle participle · accusative singular feminine", "accursed, destructive"),
  "μυρίʼ": e("μυρίος", "μυρίος, -α, -ον", "adjective · accusative plural neuter (elided μυρία)", "countless"),
  "Ἀχαιοῖς": e("Ἀχαιός", "Ἀχαιοί, -ῶν, οἱ", "noun · dative plural masculine", "the Achaeans, Homer's Greeks"),
  "ἄλγεʼ": e("ἄλγος", "ἄλγος, -εος, τό", "noun · accusative plural neuter (elided ἄλγεα)", "pain, grief, woe"),
  "ἔθηκε": e("τίθημι", "τίθημι", "aorist active indicative · 3rd person singular", "put, set; cause"),
  "ψυχὰς": e("ψυχή", "ψυχή, -ῆς, ἡ", "noun · accusative plural feminine", "life, soul, spirit"),
  "Ἄϊδι": e("ᾍδης", "ᾍδης (Homeric Ἄϊς)", "proper noun · dative singular (Homeric form)", "Hades, god of the dead"),
  "προΐαψεν": e("προϊάπτω", "προϊάπτω", "aorist active indicative · 3rd person singular", "send forth, hurl on ahead"),
  "ἡρώων": e("ἥρως", "ἥρως, -ωος, ὁ", "noun · genitive plural masculine", "hero, warrior"),
  "κύνεσσιν": e("κύων", "κύων, κυνός, ὁ/ἡ", "noun · dative plural (Homeric form)", "dog"),
  "οἰωνοῖσί": e("οἰωνός", "οἰωνός, -οῦ, ὁ", "noun · dative plural masculine (Homeric form)", "bird of prey"),
  "Διὸς": e("Ζεύς", "Ζεύς, Διός, ὁ", "proper noun · genitive singular", "Zeus"),
  "ἐτελείετο": e("τελέω", "τελείω (= τελέω)", "imperfect passive indicative · 3rd person singular", "accomplish, fulfil"),
  "βουλή": e("βουλή", "βουλή, -ῆς, ἡ", "noun · nominative singular feminine", "plan, will, counsel"),
  "διαστήτην": e("διΐστημι", "διΐστημι", "aorist active indicative · 3rd person dual", "stand apart, part in hostility"),
  "ἐρίσαντε": e("ἐρίζω", "ἐρίζω", "aorist active participle · nominative dual masculine", "quarrel, strive"),
  "Ἀτρεΐδης": e("Ἀτρεΐδης", "Ἀτρεΐδης", "noun · nominative singular masculine", "son of Atreus (Agamemnon)"),
  "ἄναξ": e("ἄναξ", "ἄναξ, -ακτος, ὁ", "noun · nominative singular masculine", "lord, king"),
  "ἀνδρῶν": e("ἀνήρ", "ἀνήρ, ἀνδρός, ὁ", "noun · genitive plural masculine", "man"),
  "δῖος": e("δῖος", "δῖος, -α, -ον", "adjective · nominative singular masculine", "brilliant, noble, godlike"),
  "Ἀχιλλεύς": e("Ἀχιλλεύς", "Ἀχιλλεύς", "proper noun · nominative singular", "Achilles"),
};

/** Links to the most respected reference works for a headword and form. */
export function referenceLinks(lemma: string, form: string) {
  const f = form.replace(/ʼ/g, "");
  return [
    { name: "Logeion", note: "LSJ and other lexica", href: `https://logeion.uchicago.edu/${encodeURIComponent(lemma)}` },
    { name: "Perseus", note: "word study and parsing", href: `https://www.perseus.tufts.edu/hopper/morph?l=${encodeURIComponent(f)}&la=greek` },
    { name: "Wiktionary", note: "entry and forms", href: `https://en.wiktionary.org/wiki/${encodeURIComponent(lemma)}#Ancient_Greek` },
  ];
}
