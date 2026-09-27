/** Small, well-defined helpers for Greek text. */

/** A Greek word: Greek letters and combining marks, with an elision mark allowed at the end. */
export const GREEK_WORD = /([Ͱ-Ͽἀ-῿][Ͱ-Ͽἀ-῿̀-ͯ]*(?:[ʼ’'᾽])?)/u;
export const isGreekWord = (s: string) => /^[Ͱ-Ͽἀ-῿]/u.test(s);

const GRAVE_TO_ACUTE: Record<string, string> = {
  "ὰ": "ά", "ὲ": "έ", "ὴ": "ή", "ὶ": "ί", "ὸ": "ό", "ὺ": "ύ", "ὼ": "ώ",
  "ἂ": "ἄ", "ἃ": "ἅ", "ἒ": "ἔ", "ἓ": "ἕ", "ἢ": "ἤ", "ἣ": "ἥ", "ἲ": "ἴ", "ἳ": "ἵ", "ὂ": "ὄ", "ὃ": "ὅ", "ὒ": "ὔ", "ὓ": "ὕ", "ὢ": "ὤ", "ὣ": "ὥ",
  "ᾲ": "ᾴ", "ῂ": "ῄ", "ῲ": "ῴ", "ᾂ": "ᾄ", "ᾃ": "ᾅ", "ᾒ": "ᾔ", "ᾓ": "ᾕ", "ᾢ": "ᾤ", "ᾣ": "ᾥ", "ῒ": "ΐ", "ῢ": "ΰ",
};

/**
 * The form a dictionary would look up: a grave accent (which only appears because another word
 * follows) becomes acute, and a trailing elision mark is dropped.
 */
export function lookupForm(word: string): string {
  let w = word.normalize("NFC").replace(/[ʼ’'᾽]$/, "");
  const last = [...w];
  for (let i = last.length - 1; i >= 0; i--) {
    if (GRAVE_TO_ACUTE[last[i]]) { last[i] = GRAVE_TO_ACUTE[last[i]]; break; }
  }
  w = last.join("");
  return w;
}

export const isElided = (word: string) => /[ʼ’'᾽]$/.test(word);

/** Lower-case the first letter, for words capitalised only because they begin a sentence. */
export const decapitalise = (w: string) => w.charAt(0).toLocaleLowerCase("el") + w.slice(1);

const ACCENT = /[́͂]/g;

/**
 * The "exact form" of a word, as Echoes compares it. Letters, breathings and accents count;
 * these differences do not, because they depend only on the neighbouring words:
 * capitals, a grave accent (written for an acute before another word), a second accent thrown
 * back by a following enclitic (ἄνθρωπός τις), final sigma, and the elision mark.
 */
export function formKey(w: string): string {
  let s = w.normalize("NFD").toLowerCase().replace(/[ʼ’'᾽]$/u, "").replace(/̀/g, "́").replace(/̀/g, "́").replace(/́/g, "́");
  const accents = [...s.matchAll(ACCENT)];
  if (accents.length > 1) { const last = accents[accents.length - 1].index!; s = s.slice(0, last) + s.slice(last + 1); }
  return s.replace(/[ςϲ]/g, "σ").normalize("NFC");
}
