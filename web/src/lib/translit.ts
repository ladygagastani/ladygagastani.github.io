/**
 * A simple transliteration of polytonic Greek into Latin letters, for beginners.
 * This is the site's own scheme (shown to the reader), close to common classroom practice:
 *   η → ē, ω → ō, rough breathing → h, υ → y (u in the diphthongs αυ ευ ηυ ου υι… as "u"),
 *   θ th, φ ph, χ ch, ψ ps, ξ x, ρ at the start of a word → rh,
 *   γ before γ κ ξ χ → n, iota subscript → i. Accents are left out.
 */
const BASE: Record<string, string> = {
  α: "a", β: "b", γ: "g", δ: "d", ε: "e", ζ: "z", η: "ē", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m", ν: "n",
  ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", ς: "s", ϲ: "s", τ: "t", υ: "y", φ: "ph", χ: "ch", ψ: "ps", ω: "ō", ϝ: "w",
};
const ROUGH = "̔", DIAERESIS = "̈", SUBSCRIPT = "ͅ";

function word(w: string): string {
  // split into letters with their marks
  const letters: { ch: string; marks: string; upper: boolean }[] = [];
  for (const c of w.normalize("NFD")) {
    if (/\p{M}/u.test(c)) { if (letters.length) letters[letters.length - 1].marks += c; continue; }
    const lower = c.toLowerCase();
    letters.push({ ch: lower, marks: "", upper: c !== lower });
  }
  let out = "";
  let rough = false;
  for (let i = 0; i < letters.length; i++) {
    const { ch, marks } = letters[i];
    const next = letters[i + 1];
    if (!(ch in BASE)) { out += ch; continue; }
    if (marks.includes(ROUGH)) rough = true;
    let t = BASE[ch];
    if (ch === "υ" && i > 0 && "αεηο".includes(letters[i - 1].ch) && !marks.includes(DIAERESIS)) t = "u";
    if (ch === "γ" && next && "γκξχ".includes(next.ch)) t = "n";
    if (ch === "ρ" && i === 0) { t = "rh"; rough = false; }
    if (marks.includes(SUBSCRIPT)) t += "i";
    // a rough breathing sits on the first vowel (or on the second of a diphthong): the h goes before the word
    if (rough && (i === 0 || (i === 1 && letters[1].marks.includes(ROUGH)))) { out = "h" + out; rough = false; }
    out += t;
  }
  if (rough && !out.startsWith("h") && !out.startsWith("rh")) out = "h" + out;
  // capitals: keep the first letter's case
  if (letters[0]?.upper) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

export function transliterate(text: string): string {
  return text
    .replace(/[Ͱ-Ͽἀ-῿][Ͱ-Ͽἀ-῿̀-ͯ]*/gu, word)
    .replace(/[ʼ᾽’]/g, "’")
    .replace(/[;;]/g, "?")      // the Greek question mark
    .replace(/[··]/g, ";");     // the raised dot, a pause like our semicolon
}
