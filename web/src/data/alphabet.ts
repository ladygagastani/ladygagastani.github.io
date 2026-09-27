/**
 * The Greek alphabet and its pronunciation in three systems.
 *
 * Reconstructed Classical Attic (Athens, 5th–4th c. BC) follows W. S. Allen, Vox Graeca: The
 * Pronunciation of Classical Greek, 3rd ed. (Cambridge 1987). Erasmian is a typical English-speaking
 * classroom pronunciation (teachers vary). Modern is standard Modern Greek.
 * "say" is a rough English guide; "ipa" is exact.
 */
export type System = "attic" | "erasmian" | "modern";
export interface Sound { ipa: string; say: string }
export interface Letter {
  upper: string; lower: string; final?: string;
  name: string;               // English name
  greekName: string;          // the name as usually printed in Greek
  classicalName?: string;     // what Athenians called it, where different
  vowel: boolean;
  sounds: Record<System, Sound>;
  note?: string;
  certainty?: "debated";
}

const s = (ipa: string, say: string): Sound => ({ ipa, say });

export const LETTERS: Letter[] = [
  { upper: "Α", lower: "α", name: "alpha", greekName: "ἄλφα", vowel: true,
    sounds: { attic: s("a, aː", "short: like the u in \"cup\" but further forward; long: like \"father\""), erasmian: s("a", "as in \"father\""), modern: s("a", "as in \"father\", but short") },
    note: "Alpha can be short or long; the spelling does not show which. Dictionaries mark long ones with a line: ᾱ." },
  { upper: "Β", lower: "β", name: "beta", greekName: "βῆτα", vowel: false,
    sounds: { attic: s("b", "b"), erasmian: s("b", "b"), modern: s("v", "v") } },
  { upper: "Γ", lower: "γ", name: "gamma", greekName: "γάμμα", vowel: false,
    sounds: { attic: s("ɡ; ŋ", "always hard, as in \"go\"; before γ κ ξ χ it is \"ng\", as in \"finger\" (ἄγγελος = angelos)"), erasmian: s("ɡ; ŋ", "as in \"go\"; \"ng\" before γ κ ξ χ"), modern: s("ɣ; ʝ", "a soft throaty g; like \"y\" in \"yes\" before e and i sounds") } },
  { upper: "Δ", lower: "δ", name: "delta", greekName: "δέλτα", vowel: false,
    sounds: { attic: s("d", "d"), erasmian: s("d", "d"), modern: s("ð", "th as in \"this\"") } },
  { upper: "Ε", lower: "ε", name: "epsilon", greekName: "ἒ ψιλόν", classicalName: "εἶ", vowel: true,
    sounds: { attic: s("e", "short e, as in \"pet\" but closer, like French é"), erasmian: s("e", "as in \"pet\""), modern: s("e", "as in \"pet\"") },
    note: "Always short. The name \"e psilon\" (\"plain e\") is Byzantine; Athenians called the letter εἶ." },
  { upper: "Ζ", lower: "ζ", name: "zeta", greekName: "ζῆτα", vowel: false, certainty: "debated",
    sounds: { attic: s("zd", "\"zd\", as in \"wisdom\""), erasmian: s("dz; zd", "\"dz\" as in \"adze\", or \"zd\" (teachers differ)"), modern: s("z", "z") },
    note: "Most scholars reconstruct [zd] for Classical Attic; some argue for [dz]." },
  { upper: "Η", lower: "η", name: "eta", greekName: "ἦτα", vowel: true,
    sounds: { attic: s("ɛː", "long open e, like \"air\" without the r"), erasmian: s("ɛː", "like \"ai\" in \"air\", or \"ay\" in \"hay\""), modern: s("i", "ee, as in \"see\"") },
    note: "Always long." },
  { upper: "Θ", lower: "θ", name: "theta", greekName: "θῆτα", vowel: false,
    sounds: { attic: s("tʰ", "a t with a puff of breath, as in \"top\" said forcefully; not English \"th\""), erasmian: s("θ", "th as in \"thin\""), modern: s("θ", "th as in \"thin\"") } },
  { upper: "Ι", lower: "ι", name: "iota", greekName: "ἰῶτα", vowel: true,
    sounds: { attic: s("i, iː", "short: as in \"sit\" but tenser; long: as in \"see\""), erasmian: s("i", "as in \"machine\""), modern: s("i", "ee, as in \"see\"") } },
  { upper: "Κ", lower: "κ", name: "kappa", greekName: "κάππα", vowel: false,
    sounds: { attic: s("k", "k without a puff of breath, as in \"skin\""), erasmian: s("k", "k"), modern: s("k; c", "k; before e and i sounds, further forward") } },
  { upper: "Λ", lower: "λ", name: "lambda", greekName: "λάμβδα", classicalName: "λάβδα", vowel: false,
    sounds: { attic: s("l", "a clear l, as in \"leaf\""), erasmian: s("l", "l"), modern: s("l", "l") } },
  { upper: "Μ", lower: "μ", name: "mu", greekName: "μῦ", vowel: false,
    sounds: { attic: s("m", "m"), erasmian: s("m", "m"), modern: s("m", "m") } },
  { upper: "Ν", lower: "ν", name: "nu", greekName: "νῦ", vowel: false,
    sounds: { attic: s("n", "n"), erasmian: s("n", "n"), modern: s("n", "n") } },
  { upper: "Ξ", lower: "ξ", name: "xi", greekName: "ξῖ", classicalName: "ξεῖ", vowel: false,
    sounds: { attic: s("ks", "ks, as in \"box\""), erasmian: s("ks", "ks"), modern: s("ks", "ks") } },
  { upper: "Ο", lower: "ο", name: "omicron", greekName: "ὂ μικρόν", classicalName: "οὖ", vowel: true,
    sounds: { attic: s("o", "short o, like French \"eau\" said quickly"), erasmian: s("o", "as in \"pot\""), modern: s("o", "as in \"pot\"") },
    note: "Always short. \"O mikron\" (\"small o\") is a Byzantine name; Athenians called it οὖ." },
  { upper: "Π", lower: "π", name: "pi", greekName: "πῖ", classicalName: "πεῖ", vowel: false,
    sounds: { attic: s("p", "p without a puff of breath, as in \"spin\""), erasmian: s("p", "p"), modern: s("p", "p") } },
  { upper: "Ρ", lower: "ρ", name: "rho", greekName: "ῥῶ", vowel: false,
    sounds: { attic: s("r; r̥", "a rolled r; at the start of a word (ῥ) breathed, without voice"), erasmian: s("r", "r (often rolled)"), modern: s("ɾ", "a tapped r") } },
  { upper: "Σ", lower: "σ", final: "ς", name: "sigma", greekName: "σίγμα", vowel: false,
    sounds: { attic: s("s; z", "s as in \"sun\"; z before β γ δ μ"), erasmian: s("s", "s"), modern: s("s; z", "s; z before voiced consonants") },
    note: "Written ς at the end of a word and σ elsewhere." },
  { upper: "Τ", lower: "τ", name: "tau", greekName: "ταῦ", vowel: false,
    sounds: { attic: s("t", "t without a puff of breath, as in \"stop\""), erasmian: s("t", "t"), modern: s("t", "t") } },
  { upper: "Υ", lower: "υ", name: "upsilon", greekName: "ὖ ψιλόν", classicalName: "ὖ", vowel: true,
    sounds: { attic: s("y, yː", "French u (\"lune\"), German ü: say \"ee\" with rounded lips"), erasmian: s("y", "French u, or \"oo\" (teachers differ)"), modern: s("i", "ee, as in \"see\"") } },
  { upper: "Φ", lower: "φ", name: "phi", greekName: "φῖ", classicalName: "φεῖ", vowel: false,
    sounds: { attic: s("pʰ", "a p with a puff of breath, as in \"pot\" said forcefully; not \"f\""), erasmian: s("f", "f"), modern: s("f", "f") } },
  { upper: "Χ", lower: "χ", name: "chi", greekName: "χῖ", classicalName: "χεῖ", vowel: false,
    sounds: { attic: s("kʰ", "a k with a puff of breath, as in \"cat\" said forcefully"), erasmian: s("x; k", "as in Scottish \"loch\", or k (teachers differ)"), modern: s("x; ç", "as in \"loch\"; before e and i sounds, softer") } },
  { upper: "Ψ", lower: "ψ", name: "psi", greekName: "ψῖ", classicalName: "ψεῖ", vowel: false,
    sounds: { attic: s("ps", "ps, as in \"lapse\""), erasmian: s("ps", "ps"), modern: s("ps", "ps") } },
  { upper: "Ω", lower: "ω", name: "omega", greekName: "ὦ μέγα", classicalName: "ὦ", vowel: true,
    sounds: { attic: s("ɔː", "long open o, as in British \"saw\""), erasmian: s("ɔː", "as in \"saw\" or \"go\""), modern: s("o", "as in \"pot\"") },
    note: "Always long. \"O mega\" (\"big o\") is a Byzantine name; Athenians called it ὦ." },
];

export interface Diphthong { spelling: string; sounds: Record<System, Sound>; note?: string }
export const DIPHTHONGS: Diphthong[] = [
  { spelling: "αι", sounds: { attic: s("ai̯", "as in \"aisle\""), erasmian: s("ai̯", "as in \"aisle\""), modern: s("e", "e, as in \"pet\"") } },
  { spelling: "ει", sounds: { attic: s("eː", "a long close e, like French é held"), erasmian: s("ei̯", "as in \"eight\""), modern: s("i", "ee") },
    note: "By Classical times ει was a single long vowel, not a glide." },
  { spelling: "οι", sounds: { attic: s("oi̯", "as in \"oil\""), erasmian: s("oi̯", "as in \"oil\""), modern: s("i", "ee") } },
  { spelling: "ου", sounds: { attic: s("uː", "as in \"food\""), erasmian: s("uː", "as in \"food\""), modern: s("u", "as in \"food\", short") },
    note: "Earlier [oː]; it had become [uː] by the fourth century BC." },
  { spelling: "υι", sounds: { attic: s("yi̯", "French u gliding to \"ee\""), erasmian: s("yi̯", "\"wee\""), modern: s("i", "ee") } },
  { spelling: "αυ", sounds: { attic: s("au̯", "as in \"how\""), erasmian: s("au̯", "as in \"how\""), modern: s("av; af", "\"av\"; \"af\" before voiceless consonants") } },
  { spelling: "ευ", sounds: { attic: s("eu̯", "e gliding to \"oo\""), erasmian: s("eu̯", "e gliding to \"oo\""), modern: s("ev; ef", "\"ev\"; \"ef\" before voiceless consonants") } },
  { spelling: "ηυ", sounds: { attic: s("ɛːu̯", "long open e gliding to \"oo\""), erasmian: s("ɛːu̯", "\"ay-oo\""), modern: s("iv; if", "\"iv\"; \"if\"") } },
  { spelling: "ᾳ ῃ ῳ", sounds: { attic: s("aːi̯, ɛːi̯, ɔːi̯", "a long vowel gliding to a short \"ee\""), erasmian: s("aː, ɛː, ɔː", "the iota is usually silent"), modern: s("a, i, o", "the iota is silent") },
    note: "The small iota written under the vowel (iota subscript) was a real, pronounced iota in Classical Attic." },
];

export const SYSTEMS: Record<System, { name: string; about: string }> = {
  attic: {
    name: "Reconstructed Classical Attic",
    about: "How Athenians of the 5th and 4th centuries BC most probably spoke, reconstructed from ancient grammarians' descriptions, spelling mistakes in inscriptions, transcriptions into other languages, and the rhythm of verse. It has a pitch accent: the accent marks show rising and falling pitch, not stress.",
  },
  erasmian: {
    name: "Erasmian",
    about: "The pronunciation traditionally used in Western schools since the 16th century, named after Erasmus. It keeps each letter distinct, which helps with spelling, but it is a convention rather than a reconstruction, and teachers differ in the details. The accent is usually read as a stress.",
  },
  modern: {
    name: "Modern Greek",
    about: "Ancient Greek read with the sounds of the modern language, as in Greek schools. Several ancient vowels and diphthongs merge (η, ι, υ, ει, οι all sound like \"ee\"), so it is less helpful for spelling and for the rhythm of ancient verse, but it connects the ancient language to the living one.",
  },
};

export const ALLEN = "W. S. Allen, Vox Graeca: The Pronunciation of Classical Greek, 3rd ed. (Cambridge University Press, 1987)";
