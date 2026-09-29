/**
 * The Academy's graded lessons. One idea per lesson; each ends with real sentences from the library.
 *
 * Writing conventions:
 *  - In text, «…» marks Greek, **…** bold, *…* italic.
 *  - "made" examples are practice sentences written for teaching and are labelled as such on the page.
 *  - "real" items point to a passage (work + reference). The Greek shown is always read from the
 *    source file itself; `quote` only says which words to highlight, and a test checks that they are there.
 */
import type { TextKind } from "@/lib/metre/text";

export type Section =
  | { kind: "p"; text: string }
  | { kind: "tip"; text: string }
  | { kind: "alphabet" }                       // the 24 letters, tap to hear (components/academy/AlphabetGlance)
  | { kind: "grid"; title: string; head: string[]; rows: string[][]; note?: string }   // a reference table of text (not forms)
  | { kind: "motion"; noun: { from: string; in: string; to: string }; en: string }      // out of / in / into, drawn (Motion.tsx)
  | { kind: "shift"; title: string; items: { a: string; aEn: string; b: string; bEn: string; note: string }[] }  // same words, new order (Shift.tsx)
  | { kind: "voice"; caption: string; items: { voice: "active" | "middle" | "passive"; grc: string; verb: string; en: string; note: string;
      left: { grc: string; role: string }; right: { grc: string; role: string } }[] }   // one scene in three voices, drawn (Voice.tsx)
  | { kind: "timeline"; title: string; items: { work: string; ref: string; label: string; grc: string; ptc: string; verb: string;
      time: "before" | "same" | "after"; en: string; note: string }[] }   // when a participle's action happens, drawn (Timeline.tsx); grc is checked against the source
  | { kind: "table"; paradigm: string; title?: string }
  | { kind: "made"; title?: string; items: { grc: string; en: string; note?: string }[] }
  | { kind: "reveal"; title: string; items: { grc: string; answer: string }[] }
  | { kind: "check"; items: { q: string; options: string[]; answer: number; why: string }[] }
  | { kind: "real"; title?: string; items: { work: string; ref: string; quote: string; label: string; note: string; metre?: TextKind }[] };

export interface Lesson { id: string; title: string; greek: string; summary: string; minutes: number; words: string[]; sections: Section[] }

export const LESSONS: Lesson[] = [
  {
    id: "letters", title: "Letters into sounds", greek: "γράμματα", minutes: 15,
    summary: "Read Greek words aloud, and meet your first line of Homer.",
    words: ["λόγος", "ψυχή", "θεός", "κόσμος", "ἄνθρωπος"],
    sections: [
      { kind: "p", text: "Greek has 24 letters. Many look familiar, because our own alphabet grew from a Greek one (it reached the Romans by way of the Etruscans), and mathematics and science still use Greek letters. A few are traps: «ρ» is an r, «η» is a long e, «ν» is an n, and «χ» is not an x." },
      { kind: "alphabet" },
      { kind: "p", text: "Before you learn a single word, you can already learn to **read aloud**. Greek spelling is regular: each letter keeps its sound, so once you know the letters you can say any word you see. Tap the letters above as often as you like; **The alphabet** page in the Academy also shows how to write each one." },
      { kind: "tip", text: "Two letters stand for two sounds each: «ξ» is ks and «ψ» is ps. And «θ φ χ» are single letters, even though we spell them with two in English (th, ph, ch)." },
      { kind: "reveal", title: "Say these words, then check", items: [
        { grc: "λόγος", answer: "logos: word, speech, reason (English \"logic\")" },
        { grc: "ψυχή", answer: "psychē: life, soul (English \"psychology\")" },
        { grc: "θεός", answer: "theos: god (English \"theology\")" },
        { grc: "κόσμος", answer: "kosmos: order, the world (English \"cosmos\")" },
        { grc: "ἄνθρωπος", answer: "anthrōpos: human being (English \"anthropology\")" },
        { grc: "φιλοσοφία", answer: "philosophia: love of wisdom" },
      ] },
      { kind: "check", items: [
        { q: "Which letter is a long e?", options: ["ε", "η", "ι", "ν"], answer: 1, why: "«η» (eta) is a long e; «ε» (epsilon) is short." },
        { q: "How do you say «ξ»?", options: ["x as in \"box\" (ks)", "z", "ch", "sh"], answer: 0, why: "«ξ» is ks, as in \"box\"." },
        { q: "Which letter is an r?", options: ["π", "ρ", "γ", "τ"], answer: 1, why: "«ρ» (rho) looks like a p but is an r." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "1.1", quote: "ἦν ὁ λόγος", label: "Gospel of John 1.1",
          note: "Read it aloud slowly. This edition prints the first two words in capitals. «λόγος» is the word you met above." },
        { work: "tlg0012.tlg001", ref: "1.1", quote: "μῆνιν ἄειδε θεὰ", label: "Homer, Iliad 1.1",
          note: "The opening line of the Iliad, probably composed in the 8th or 7th century BC. Say it aloud: you have just read Homer. The small marks above the letters come in the next lesson." },
      ] },
    ],
  },
  {
    id: "marks", title: "Breathings, accents and punctuation", greek: "τόνοι καὶ πνεύματα", minutes: 15,
    summary: "The little marks above the letters: which matter now and which can wait.",
    words: ["ἤ", "εἰ", "δέ"],
    sections: [
      { kind: "p", text: "Look again at «μῆνιν ἄειδε θεὰ». Above the letters are small marks. They were not written in Classical times: they were added by scholars in Hellenistic Alexandria (tradition credits Aristophanes of Byzantium, around 200 BC) to help readers, and they became standard in medieval manuscripts." },
      { kind: "p", text: "**Breathings** sit on a vowel that begins a word. The *rough breathing* «ἁ» means an h-sound before the vowel: «ἡ» is hē. The *smooth breathing* «ἀ» means no h: «ἀρχή» is archē. Every word that starts with a vowel has one, and a word-initial «ῥ» always takes the rough breathing." },
      { kind: "p", text: "**Accents** come in three shapes: acute «ά», grave «ὰ» and circumflex «ᾶ». In Classical Attic they marked *pitch*: the voice rose on the accented syllable (acute) or rose and fell on a long one (circumflex). What the grave marked is debated. Today most people read them as stress." },
      { kind: "tip", text: "How much should a beginner worry about accents? Recognise them, and learn them with each word, but don't let them stop you reading. They matter most where they tell two words apart: «ἤ» \"or\" and «ἡ» \"the\"; «εἰ» \"if\" and «εἶ» \"you are\"." },
      { kind: "p", text: "**Punctuation.** Greek «;» is a question mark. A raised dot «·» works like our colon or semicolon. Commas and full stops look as they do in English." },
      { kind: "p", text: "Three more marks: a small iota under a vowel («ᾳ ῃ ῳ», *iota subscript*) was pronounced in Classical Attic; two dots «ϊ» (*diaeresis*) mean the vowel is said separately (Πηληϊάδεω: Pē-lē-i-a-deō); and an apostrophe «ʼ» shows a vowel has been dropped before the next word (*elision*): «μυρίʼ» for «μυρία»." },
      { kind: "check", items: [
        { q: "How does «ἡ» begin?", options: ["with an h-sound", "with no h-sound", "with a pause", "with a k-sound"], answer: 0, why: "The rough breathing «῾» means an h-sound: «ἡ» is hē." },
        { q: "What does «;» mean at the end of a Greek sentence?", options: ["A pause", "A question", "A list follows", "The end of a paragraph"], answer: 1, why: "«;» is the Greek question mark." },
        { q: "In «δʼ», what does the apostrophe show?", options: ["A missing vowel", "A long vowel", "An h-sound", "A stressed syllable"], answer: 0, why: "Elision: «δʼ» is «δέ» with its vowel dropped before a vowel." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0012.tlg001", ref: "1.2", quote: "ἣ μυρίʼ", label: "Homer, Iliad 1.2",
          note: "Find the rough breathing on «ἣ» (hē, \"which\"), the elision in «μυρίʼ» and «ἄλγεʼ», and three kinds of accent." },
        { work: "tlg0031.tlg003", ref: "18.19", quote: "Τί με λέγεις ἀγαθόν;", label: "Gospel of Luke 18.19",
          note: "A question, with the Greek question mark. The square brackets show a word the editors were unsure of." },
      ] },
    ],
  },
  {
    id: "case", title: "Who does what: the idea of case", greek: "πτώσεις", minutes: 20,
    summary: "Greek shows each word's job with its ending, not its position.",
    words: ["πατήρ", "υἱός", "φιλέω", "ἀγαπάω"],
    sections: [
      { kind: "p", text: "In English, word order tells you who does what: *the father loves the son* is not *the son loves the father*. Greek works differently. The **ending** of a noun shows its job in the sentence, so the words can come in almost any order." },
      { kind: "p", text: "English still has a trace of this: *he* sees *him*, *she* sees *her*. The form changes with the job. Greek does this with every noun, adjective and article. These different forms are called **cases**." },
      { kind: "p", text: "The two cases to meet first: the **nominative** is the *subject* (who does it), and the **accusative** is the *direct object* (who or what it is done to). The little word for \"the\" changes too: «ὁ» is nominative, «τόν» accusative." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "ὁ πατὴρ φιλεῖ τὸν υἱόν.", en: "The father loves the son." },
        { grc: "τὸν υἱὸν φιλεῖ ὁ πατήρ.", en: "The father loves the son.", note: "Same meaning: the endings, not the order, tell you who loves whom." },
      ] },
      { kind: "check", items: [
        { q: "In «τὸν υἱὸν φιλεῖ ὁ πατήρ», who does the loving?", options: ["the son (τὸν υἱόν)", "the father (ὁ πατήρ)"], answer: 1, why: "«ὁ πατήρ» is nominative, so it is the subject; «τὸν υἱόν» is accusative, the object." },
        { q: "Which case is the direct object?", options: ["nominative", "accusative"], answer: 1, why: "The accusative marks the direct object." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "3.35", quote: "ὁ πατὴρ ἀγαπᾷ τὸν υἱόν", label: "Gospel of John 3.35",
          note: "«ὁ πατὴρ» (nominative) is the subject; «ἀγαπᾷ» means \"loves\"; «τὸν υἱόν» (accusative) is the object: \"The father loves the son.\" Click any word to see its analysis." },
      ] },
    ],
  },
  {
    id: "article", title: "The article: ὁ, ἡ, τό", greek: "τὸ ἄρθρον", minutes: 20,
    summary: "The commonest word in Greek, and your best guide to every noun's case.",
    words: ["ὁ", "σῶμα", "οὗτος"],
    sections: [
      { kind: "p", text: "«ὁ, ἡ, τό» means \"the\". It is the commonest word in Greek, and it is your best friend: it usually agrees with its noun, so the article tells you the noun's **gender**, **number** and **case** even before you know the noun." },
      { kind: "p", text: "Greek nouns have three **genders**: masculine, feminine and neuter. Gender is grammatical: «λόγος» \"word\" is masculine, «ψυχή» \"soul\" feminine, «δῶρον» \"gift\" neuter. Learn each noun with its article: «ὁ λόγος», «ἡ ψυχή», «τὸ δῶρον»." },
      { kind: "p", text: "There are four cases to learn now. Besides the nominative (subject) and accusative (object): the **genitive** is roughly English *of* (\"the word *of the god*\"), and the **dative** roughly *to* or *for* (\"he gave it *to the man*\")." },
      { kind: "table", paradigm: "article" },
      { kind: "tip", text: "Look for the patterns: the neuter nominative and accusative are always the same (τό, τά); genitive plural «τῶν» is the same for all genders; and every dative singular has an iota subscript (τῷ, τῇ, τῷ)." },
      { kind: "check", items: [
        { q: "Which form is genitive singular feminine?", options: ["τῆς", "τήν", "τῇ", "ταῖς"], answer: 0, why: "«τῆς»: \"of the\" (feminine singular)." },
        { q: "«τοῖς» is…", options: ["accusative plural", "dative plural, masculine or neuter", "genitive plural", "nominative plural"], answer: 1, why: "«τοῖς» is the dative plural of the masculine and neuter article." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg002", ref: "14.22", quote: "τοῦτό ἐστιν τὸ σῶμά μου", label: "Gospel of Mark 14.22",
          note: "«τὸ σῶμα» \"the body\": «τό» shows the noun is neuter, and here it is nominative. «τοῦτό ἐστιν» is \"this is\"; «μου» \"of me, my\"." },
      ] },
    ],
  },
  {
    id: "second-declension", title: "Second declension: λόγος, δῶρον", greek: "ἡ δευτέρα κλίσις", minutes: 20,
    summary: "The -ος and -ον nouns: one set of endings for thousands of words.",
    words: ["δῶρον", "ἀγαθός", "πρός"],
    sections: [
      { kind: "p", text: "Greek nouns fall into three families, called **declensions**. Each has its own set of endings. The second declension is the easiest place to start, because its endings look like the article's." },
      { kind: "table", paradigm: "logos" },
      { kind: "table", paradigm: "doron" },
      { kind: "tip", text: "Compare «λόγου λόγῳ λόγον» with «τοῦ τῷ τόν». Learn the article and you have most of the second declension already." },
      { kind: "check", items: [
        { q: "«λόγους» is…", options: ["nominative plural", "accusative plural", "genitive singular", "dative plural"], answer: 1, why: "-ους is the accusative plural, like «τούς»." },
        { q: "Which is the dative singular of δῶρον?", options: ["δώρου", "δώρῳ", "δῶρα", "δώροις"], answer: 1, why: "-ῳ is the dative singular, with iota subscript." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "1.1", quote: "ὁ λόγος ἦν πρὸς τὸν θεόν", label: "Gospel of John 1.1",
          note: "«ὁ λόγος» is nominative (the subject); «τὸν θεόν» is accusative, here after «πρός» \"with, towards\". «ἦν» means \"was\"." },
        { work: "tlg0031.tlg003", ref: "18.19", quote: "οὐδεὶς ἀγαθὸς", label: "Gospel of Luke 18.19",
          note: "«ἀγαθός» \"good\" and «θεός» \"god\" are both second-declension nominatives: \"No one is good except one, God.\"" },
      ] },
    ],
  },
  {
    id: "first-declension", title: "First declension: ψυχή, χώρα, δόξα", greek: "ἡ πρώτη κλίσις", minutes: 20,
    summary: "The -η and -α nouns, nearly all feminine.",
    words: ["χώρα", "δόξα", "ἀλήθεια"],
    sections: [
      { kind: "p", text: "The first declension holds nouns ending in -η or -α. Almost all are feminine, so their endings look like the feminine article «ἡ τῆς τῇ τήν»." },
      { kind: "table", paradigm: "psyche" },
      { kind: "p", text: "After ε, ι or ρ the singular keeps α instead of η (χώρα \"land\"). Some nouns have a short α in the nominative and accusative singular (δόξα \"opinion, glory\"). The plural is the same for all of them." },
      { kind: "table", paradigm: "chora" },
      { kind: "table", paradigm: "doxa" },
      { kind: "check", items: [
        { q: "«ψυχάς» is…", options: ["accusative plural", "genitive singular", "nominative plural", "dative plural"], answer: 0, why: "-ας in the plural is the accusative, like «τάς»." },
        { q: "Why does χώρα keep α in the singular?", options: ["Because it is masculine", "Because the letter before it is ρ", "Because it is plural", "No reason"], answer: 1, why: "After ε, ι or ρ, the first declension keeps α." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0012.tlg001", ref: "1.3", quote: "ψυχὰς", label: "Homer, Iliad 1.3",
          note: "«ψυχάς» is accusative plural of «ψυχή»: the wrath of Achilles sent many \"souls\" down to Hades. (Homer's Greek differs from Classical Attic in many ways, but this ending is the same.)" },
      ] },
    ],
  },
  {
    id: "to-be", title: "The verb \"to be\": εἰμί", greek: "εἰμί", minutes: 15,
    summary: "I am, you are, it is: the commonest verb, and a first taste of verb endings.",
    words: ["εἰμί", "ἐγώ", "φῶς", "ὁδός", "ζωή"],
    sections: [
      { kind: "p", text: "Greek verbs show **who** is doing the action with their ending, so the pronoun (\"I\", \"you\") is often left out: «εἰμί» alone means \"I am\"." },
      { kind: "table", paradigm: "eimi" },
      { kind: "tip", text: "With «εἰμί», the noun on each side is in the **nominative**: \"the word was God\" has no object, only two things said to be the same." },
      { kind: "check", items: [
        { q: "«ἐσμέν» means…", options: ["I am", "we are", "they are", "you are"], answer: 1, why: "-μεν is the ending for \"we\"." },
        { q: "«ἦν» most often means…", options: ["he/she/it was", "they are", "we were", "you are"], answer: 0, why: "«ἦν» is the imperfect: \"was\" (and sometimes \"I was\")." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "8.12", quote: "Ἐγώ εἰμι τὸ φῶς τοῦ κόσμου", label: "Gospel of John 8.12",
          note: "«ἐγώ εἰμι» \"I am\" (the pronoun is added for emphasis); «τὸ φῶς» \"the light\"; «τοῦ κόσμου» genitive, \"of the world\"." },
        { work: "tlg0031.tlg004", ref: "14.6", quote: "Ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή", label: "Gospel of John 14.6",
          note: "Three feminine nouns, each with «ἡ»: \"the way and the truth and the life\"." },
      ] },
    ],
  },
  {
    id: "present-tense", title: "Verbs: the present tense", greek: "ὁ ἐνεστὼς χρόνος", minutes: 20,
    summary: "λύω, λύεις, λύει: six endings you will meet on thousands of verbs.",
    words: ["λύω", "ἔχω", "λέγω", "ἀνήρ", "οὐ"],
    sections: [
      { kind: "p", text: "Most Greek verbs end in -ω in the dictionary: «λύω» \"I loosen, I free\", «ἔχω» \"I have\", «λέγω» \"I say\". Take off the -ω and add these endings to say who is acting." },
      { kind: "table", paradigm: "luo" },
      { kind: "tip", text: "For now, learn the **present** column. The others (imperfect, future, aorist) come in later lessons, but notice already how the aorist and imperfect add ἐ- at the front for past time." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "λέγομεν.", en: "We are speaking." },
        { grc: "ὁ ἄνθρωπος ἔχει δῶρον.", en: "The person has a gift." },
      ] },
      { kind: "check", items: [
        { q: "«ἔχουσι» means…", options: ["I have", "they have", "we have", "you have"], answer: 1, why: "-ουσι(ν) is the ending for \"they\"." },
        { q: "Which ending means \"you (one person)\"?", options: ["-ω", "-εις", "-ει", "-ετε"], answer: 1, why: "-εις is \"you\" (singular); -ετε is \"you\" (plural)." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "4.17", quote: "Οὐκ ἔχω ἄνδρα", label: "Gospel of John 4.17",
          note: "«ἔχω» \"I have\", «οὐκ» \"not\", «ἄνδρα» \"husband, man\" (accusative): \"I have no husband.\" The phrase comes back later in the verse, in a different order." },
      ] },
    ],
  },
  {
    id: "metre", title: "Hearing Homer's rhythm: the hexameter", greek: "ἑξάμετρος", minutes: 20,
    summary: "Long and short syllables, six feet to a line, and the pause in the middle.",
    words: ["μέτρον", "πούς", "ἔπος"],
    sections: [
      { kind: "p", text: "Greek poetry does not rhyme, and its rhythm is not a pattern of stressed and unstressed syllables, as in English verse. It is a pattern of **long** and **short** syllables. Ancient writers on metre counted a long syllable as two units of time and a short one as one." },
      { kind: "p", text: "**Which syllables are long?** A syllable is long *by nature* if its vowel is long: «η» and «ω», any diphthong («αι», «ει», «οι», «ου», «αυ», «ευ»…), and any vowel with a circumflex «ῆ» or an iota subscript «ῳ». It is long *by position* if its vowel is followed by two consonants, even when one of them begins the next word; «ζ», «ξ» and «ψ» count as two. Every other syllable is short: «ε» and «ο» always, and «α», «ι», «υ» when they are short vowels." },
      { kind: "tip", text: "«α», «ι» and «υ» can be long or short, and the spelling usually does not say which. The accent can help: a circumflex on the next-to-last syllable («Μοῦσα») means the last vowel is short. Often the metre itself decides." },
      { kind: "reveal", title: "Scan these words (– long, ˘ short)", items: [
        { grc: "μῆνιν", answer: "– ˘ : «ῆ» has a circumflex, so it is long; «ι» is followed by only one consonant before the next vowel, so it is short." },
        { grc: "Ἀχαιοῖς", answer: "˘ – – : the first «α» is short; «αι» and «οῖ» are diphthongs, so long." },
        { grc: "ἄνδρα", answer: "– ˘ : «ἄ» is followed by three consonants (ν, δ, ρ), so the syllable is long; the final «α» is short." },
        { grc: "Μοῦσα", answer: "– ˘ : «οῦ» is a diphthong; the circumflex on it shows that the final «α» is short." },
      ] },
      { kind: "p", text: "**The hexameter** (\"six-measure\") is the metre of Homer, Hesiod and all Greek epic, and of oracles too. A line has six **feet**. Each of the first five is a *dactyl* (– ˘ ˘) or a *spondee* (– –); the fifth is nearly always a dactyl. The sixth foot has two syllables, and the last may be long or short. Say a long for two beats and a short for one: DUM-da-da DUM-da-da… and the rhythm appears." },
      { kind: "p", text: "Most lines have a pause, the **caesura** (‖), where a word ends inside the third foot: after its long syllable, or after its first short. Poets also bend the rules in regular ways. A long vowel or diphthong at the end of a word can count as short before a vowel (*correption*), and two vowels can run together as one syllable (*synizesis*)." },
      { kind: "check", items: [
        { q: "How many feet does a hexameter have?", options: ["four", "five", "six", "seven"], answer: 2, why: "Hex- is \"six\": six feet to a line." },
        { q: "A dactyl is…", options: ["– ˘ ˘", "– –", "˘ –", "˘ ˘ –"], answer: 0, why: "A dactyl is one long and two shorts, like the joints of a finger (δάκτυλος)." },
        { q: "Why is the first syllable of «ἄνδρα» long, although «α» can be short?", options: ["Two or more consonants follow its vowel", "It has an accent", "It begins the word", "It has a breathing"], answer: 0, why: "Long by position: ν, δ, ρ follow the vowel." },
        { q: "In «ἄνδρα μοι ἔννεπε», «μοι» counts as short. Why?", options: ["A diphthong at the end of a word can be shortened before a vowel", "«οι» is always short", "«μ» is a weak consonant", "Pronouns are always short"], answer: 0, why: "This is correption: «μοι» stands before «ἔννεπε», which begins with a vowel." },
      ] },
      { kind: "real", title: "Read it yourself, with the metre marked", items: [
        { work: "tlg0012.tlg001", ref: "1.1", quote: "μῆνιν ἄειδε θεὰ", label: "Homer, Iliad 1.1", metre: "hexameter",
          note: "Five dactyls and a final two-syllable foot. The caesura (‖) falls after «θεὰ», just after the long syllable of the third foot. The «-εω» of «Πηληϊάδεω» is one syllable (synizesis). Press ▸ to hear the beat." },
        { work: "tlg0012.tlg002", ref: "1.1", quote: "ἄνδρα μοι ἔννεπε", label: "Homer, Odyssey 1.1", metre: "hexameter",
          note: "Here «μοι» is shortened before «ἔννεπε» (correption), so the first foot is a dactyl: «ἄν-δρα-μοι»." },
        { work: "tlg0016.tlg001", ref: "1.47.3", quote: "οἶδα δʼ ἐγὼ ψάμμου", label: "Herodotus 1.47.3: an oracle in hexameters", metre: "hexameter",
          note: "Herodotus writes prose, but he says the Pythia at Delphi gave this answer «ἐν ἑξαμέτρῳ τόνῳ», \"in hexameter verse\" (1.47.2). The lines scan just like Homer's." },
      ] },
    ],
  },
  {
    id: "prepositions", title: "Prepositions: from, in, to", greek: "προθέσεις", minutes: 20,
    summary: "Small words of place and direction, and the case each one takes.",
    words: ["ἐν", "εἰς", "ἐκ", "ἀπό", "πρός", "παρά"],
    sections: [
      { kind: "p", text: "English shows place and direction with small words: *in* the house, *into* the house, *out of* the house. Greek has these words too, called **prepositions**, and each one is followed by a noun in a particular case: genitive, dative or accusative. We say the preposition *takes* that case." },
      { kind: "p", text: "Behind many of them is one simple pattern. The **genitive** goes with movement *away from* a place, the **dative** with being *at rest in* it, and the **accusative** with movement *towards* or *into* it." },
      { kind: "motion", noun: { from: "ἐκ τῆς οἰκίας", in: "ἐν τῇ οἰκίᾳ", to: "εἰς τὴν οἰκίαν" }, en: "the house" },
      { kind: "tip", text: "«ἐκ», «ἐν» and «εἰς» are the clearest case: each always takes the same case. Learn them as a set: «ἐκ» + genitive \"out of\", «ἐν» + dative \"in\", «εἰς» + accusative \"into\"." },
      { kind: "grid", title: "The commonest prepositions", head: ["", "with the genitive", "with the dative", "with the accusative"], rows: [
        ["«ἐκ» (before a vowel «ἐξ»)", "out of, from", "", ""],
        ["«ἀπό»", "away from", "", ""],
        ["«ἐν»", "", "in, on, among", ""],
        ["«εἰς» (also spelled «ἐς»)", "", "", "into, to"],
        ["«διά»", "through", "", "because of"],
        ["«μετά»", "with", "", "after"],
        ["«ὑπό»", "by (the person who does it); under", "under", "under (with movement)"],
        ["«πρός»", "from the side of (rare)", "at, near", "to, towards; against"],
        ["«παρά»", "from (a person)", "beside, at the house of", "to (a person); along, beside"],
        ["«ἐπί»", "on, upon", "on, at; for", "onto, to, against"],
      ], note: "Many prepositions take more than one case, and the case changes the meaning. The pattern still helps: with «παρά», the genitive is \"from\" a person, the dative \"beside\" them, the accusative \"to\" them." },
      { kind: "p", text: "Two changes of spelling to expect. A preposition ending in a vowel usually drops it before a word beginning with a vowel: «διά» becomes «διʼ», «ἀπό» becomes «ἀπʼ». And before a rough breathing, «π», «τ» and «κ» turn into «φ», «θ» and «χ»: «ἀφʼ», «καθʼ», «ὑφʼ»." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "ὁ ἄνθρωπος μένει ἐν τῇ οἰκίᾳ.", en: "The person stays in the house." },
        { grc: "οἱ ἄνθρωποι φεύγουσιν ἐκ τῆς χώρας.", en: "The people flee out of the land." },
        { grc: "ὁ υἱὸς λέγει πρὸς τὸν πατέρα.", en: "The son speaks to his father.", note: "Greek often uses the article where English says \"his\" or \"her\"." },
        { grc: "ἔχω δῶρον παρὰ τοῦ πατρός.", en: "I have a gift from my father." },
      ] },
      { kind: "check", items: [
        { q: "In «ἐν ἀρχῇ», why is «ἀρχῇ» in the dative?", options: ["Because «ἐν» always takes the dative", "Because it is the subject", "Because it is plural", "Because it follows a verb"], answer: 0, why: "«ἐν» \"in\" always takes the dative: «ἐν ἀρχῇ», \"in the beginning\"." },
        { q: "«εἰς τὸν κόσμον» means…", options: ["out of the world", "in the world", "into the world", "of the world"], answer: 2, why: "«εἰς» + accusative: movement into." },
        { q: "«παρὰ θεοῦ», with the genitive, means…", options: ["from God", "beside God", "to God", "against God"], answer: 0, why: "«παρά» with the genitive is \"from\" (a person)." },
        { q: "Which case follows «ἐκ»?", options: ["genitive", "dative", "accusative", "nominative"], answer: 0, why: "«ἐκ» \"out of\" always takes the genitive: movement away." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg001", ref: "2.1", quote: "ἀπὸ ἀνατολῶν παρεγένοντο εἰς Ἰεροσόλυμα", label: "Gospel of Matthew 2.1",
          note: "All three directions in one verse: «ἐν Βηθλεὲμ» \"in Bethlehem\" (where), «ἀπὸ ἀνατολῶν» \"from the east\" (genitive: where from) and «εἰς Ἰεροσόλυμα» \"to Jerusalem\" (accusative: where to). «ἐν ἡμέραις» is \"in the days\"." },
        { work: "tlg0031.tlg004", ref: "1.6", quote: "ἀπεσταλμένος παρὰ θεοῦ", label: "Gospel of John 1.6",
          note: "«παρὰ θεοῦ» with the genitive: \"sent from God\"." },
        { work: "tlg0032.tlg006", ref: "1.1.2", quote: "μεταπέμπεται ἀπὸ τῆς ἀρχῆς", label: "Xenophon, Anabasis 1.1.2",
          note: "Classical prose: King Darius \"sends for\" his son Cyrus «ἀπὸ τῆς ἀρχῆς», \"from the province\" he governed. Later in the sentence the edition prints «ἐς», the other spelling of «εἰς»: «ἐς Καστωλοῦ πεδίον», \"to the plain of Castolus\"." },
      ] },
    ],
  },
  {
    id: "adjectives", title: "Adjectives: agreement and position", greek: "τὰ ἐπίθετα", minutes: 20,
    summary: "ἀγαθός, ἀγαθή, ἀγαθόν, and why \"the good man\" and \"the man is good\" differ only in word order.",
    words: ["ἀγαθός", "καλός", "κακός", "δίκαιος", "ἀληθινός"],
    sections: [
      { kind: "p", text: "An adjective describes a noun, and it **agrees** with it: it takes the same gender, number and case. So an adjective has a full set of forms for each gender." },
      { kind: "p", text: "Good news: you know these endings already. The commonest adjectives use the second declension for the masculine and neuter (like «λόγος» and «δῶρον») and the first declension for the feminine (like «ψυχή»). Dictionaries list all three: «ἀγαθός, ἀγαθή, ἀγαθόν»." },
      { kind: "table", paradigm: "agathos" },
      { kind: "tip", text: "After ε, ι or ρ the feminine keeps α, just as «χώρα» does: «δίκαιος, δικαία, δίκαιον» \"just\"." },
      { kind: "p", text: "**Position.** With the article, *where* the adjective stands matters. Inside the article's phrase (between the article and the noun, or after the noun with the article repeated) it simply describes: this is the **attributive** position, \"the good man\". Outside it, the adjective makes a statement: this is the **predicate** position, \"the man is good\". Greek can leave out «ἐστί» \"is\" in a statement like this." },
      { kind: "shift", title: "Move the adjective and watch the meaning change", items: [
        { a: "ὁ ἀγαθὸς ἄνθρωπος", aEn: "the good person", b: "ἀγαθὸς ὁ ἄνθρωπος", bEn: "the person is good", note: "Before the article, the adjective is outside the phrase: a statement." },
        { a: "ὁ ἄνθρωπος ὁ ἀγαθός", aEn: "the good person", b: "ὁ ἄνθρωπος ἀγαθός", bEn: "the person is good", note: "After the noun, the repeated article keeps the adjective inside the phrase; without it, it becomes a statement." },
        { a: "ἡ καλὴ χώρα", aEn: "the beautiful land", b: "καλὴ ἡ χώρα", bEn: "the land is beautiful", note: "Feminine: the adjective agrees with «χώρα»." },
      ] },
      { kind: "tip", text: "Without an article there is no position to read: «καλὸν δῶρον ἔχω» is \"I have a beautiful gift\". Context decides." },
      { kind: "check", items: [
        { q: "«ὁ ποιμὴν ὁ καλός» means…", options: ["the good shepherd", "the shepherd is good"], answer: 0, why: "The article is repeated before the adjective, so it is attributive: \"the good shepherd\"." },
        { q: "«ἀγαθὸς ὁ πατήρ» means…", options: ["the good father", "the father is good"], answer: 1, why: "The adjective stands outside the article's phrase: predicate, \"the father is good\"." },
        { q: "Which form agrees with «τὴν ψυχήν»?", options: ["ἀγαθόν", "ἀγαθήν", "ἀγαθῆς", "ἀγαθούς"], answer: 1, why: "«ψυχήν» is feminine accusative singular, so «ἀγαθήν»." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "10.11", quote: "ὁ ποιμὴν ὁ καλός", label: "Gospel of John 10.11",
          note: "Noun, then the article repeated with the adjective: attributive, \"the good shepherd\". «καλός» means \"beautiful\" and also \"good, noble\". In «τὴν ψυχὴν αὐτοῦ», «ψυχή» means \"life\"." },
        { work: "tlg0032.tlg006", ref: "1.1.1", quote: "πρεσβύτερος μὲν Ἀρταξέρξης, νεώτερος δὲ Κῦρος", label: "Xenophon, Anabasis 1.1.1",
          note: "The opening of the Anabasis. Darius and Parysatis have two sons: \"the elder (was) Artaxerxes, the younger Cyrus\". There is no article and no verb: the context shows that the adjectives «πρεσβύτερος» \"older\" and «νεώτερος» \"younger\" say something about each son. «μέν… δέ…» sets them side by side: \"on the one hand… on the other…\"." },
      ] },
    ],
  },
  {
    id: "third-declension", title: "Third declension: φύλαξ, σῶμα, πόλις", greek: "ἡ τρίτη κλίσις", minutes: 25,
    summary: "The biggest family of nouns: find the stem in the genitive.",
    words: ["σάρξ", "πνεῦμα", "ὄνομα", "πόλις", "χάρις"],
    sections: [
      { kind: "p", text: "The third declension holds nouns of every gender and many shapes. Its secret is that the nominative often hides the **stem**. The genitive singular shows it: take off «-ος» and what is left is the stem. «φύλαξ» \"guard\" has the genitive «φύλακος», so its stem is «φυλακ-»." },
      { kind: "p", text: "That is why dictionaries give two forms and the article: «φύλαξ, φύλακος, ὁ». Always learn a third-declension noun with its genitive." },
      { kind: "table", paradigm: "phylax" },
      { kind: "tip", text: "The endings, added to the stem: singular «-ος», «-ι», «-α» (genitive, dative, accusative); plural «-ες», «-ων», «-σι(ν)», «-ας». In the dative plural the stem meets «σ»: «κ» + «σ» is written «ξ» (φύλαξι), and «τ» drops out (σώμασι)." },
      { kind: "table", paradigm: "soma" },
      { kind: "p", text: "Every neuter in «-μα» declines like «σῶμα» \"body\", with a stem in «-ματ-»: «ὄνομα» \"name\", «πνεῦμα» \"breath, spirit\", «πρᾶγμα» \"thing, affair\"." },
      { kind: "table", paradigm: "polis" },
      { kind: "p", text: "«πόλις» \"city, city-state\" is a different type, with a stem that ends in ι or ε. It is one of the words you will meet most often in Classical prose, so learn it as it stands." },
      { kind: "reveal", title: "Find the stem from the genitive", items: [
        { grc: "σάρξ, σαρκός", answer: "σαρκ-: \"flesh\" (κ + ς is written ξ)" },
        { grc: "ὄνομα, ὀνόματος", answer: "ὀνοματ-: \"name\", like σῶμα" },
        { grc: "χάρις, χάριτος", answer: "χαριτ-: \"grace, favour\" (the τ drops before ς)" },
        { grc: "ἐλπίς, ἐλπίδος", answer: "ἐλπιδ-: \"hope\" (the δ drops before ς)" },
      ] },
      { kind: "check", items: [
        { q: "«σώματι» is…", options: ["dative singular", "genitive singular", "nominative plural", "accusative singular"], answer: 0, why: "«-ι» on the stem σωματ- is the dative singular." },
        { q: "Where do you find a third-declension noun's stem?", options: ["In the genitive singular", "In the nominative singular", "In the dative plural", "In the article"], answer: 0, why: "Take «-ος» off the genitive singular: φύλακ-ος." },
        { q: "The genitive plural of «πόλις» is…", options: ["πόλεως", "πόλεων", "πόλεσι", "πόλεις"], answer: 1, why: "«-ων» is the genitive plural in every declension." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "3.6", quote: "ἐκ τῆς σαρκὸς σάρξ ἐστιν", label: "Gospel of John 3.6",
          note: "«σαρκός» (genitive, after «ἐκ») and «σάρξ» (nominative) side by side: the genitive shows the stem σαρκ-. In the second half, «πνεύματος» and «πνεῦμα» decline like «σῶμα»." },
        { work: "tlg0031.tlg001", ref: "5.14", quote: "οὐ δύναται πόλις κρυβῆναι ἐπάνω ὄρους κειμένη", label: "Gospel of Matthew 5.14",
          note: "«πόλις» is nominative: \"a city cannot be hidden\". «ὄρους» is the genitive of «ὄρος» \"mountain\", a third-declension neuter of yet another type, after «ἐπάνω» \"on top of\"." },
      ] },
    ],
  },
  {
    id: "past-tenses", title: "The past: imperfect and aorist", greek: "παρατατικὸς καὶ ἀόριστος", minutes: 25,
    summary: "The augment ἐ- marks the past; the imperfect paints a scene, the aorist tells what happened.",
    words: ["γίγνομαι", "βούλομαι", "ἄγω", "γράφω", "πέμπω"],
    sections: [
      { kind: "p", text: "Greek has two common past tenses. The **imperfect** shows an action going on, or repeated, in the past: \"I was loosening\", \"I used to loosen\". The **aorist** tells the action simply as an event: \"I loosened\". Stories are told in the aorist; scenes and circumstances in the imperfect." },
      { kind: "p", text: "Both mark past time the same way: with the **augment**, an addition at the front of the verb. Look at the imperfect and aorist columns." },
      { kind: "table", paradigm: "luo" },
      { kind: "p", text: "**Two kinds of augment.** A verb that begins with a consonant adds «ἐ-»: «λύω», «ἔλυον»; «γράφω» \"write\", «ἔγραψα». A verb that begins with a vowel lengthens it instead: «α» and «ε» become «η», «ο» becomes «ω». So «ἄγω» \"lead\" has the imperfect «ἦγον», and «ὀνομάζω» \"name\" has «ὠνόμαζον»." },
      { kind: "tip", text: "Verbs with a preposition in front (compound verbs) put the augment *after* the preposition: «ὑποπτεύω» \"suspect\" has the imperfect «ὑπώπτευον», and «συγγράφω» \"write down\" has the aorist «συνέγραψα»." },
      { kind: "p", text: "**The aorist.** Most verbs form it with «σ» and the endings «-σα, -σας, -σε(ν), -σαμεν, -σατε, -σαν»; the «σ» combines with a consonant before it, as «φ» + «σ» makes «ψ» in «ἔγραψα». Many common verbs have a different stem in the aorist instead, which has to be learned with the verb: «λέγω» \"say\", aorist «εἶπον»; «ἔρχομαι» \"come, go\", aorist «ἦλθον»." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "ἐλέγομεν.", en: "We were speaking.", note: "Imperfect: an action going on." },
        { grc: "ἔγραψα τὸν λόγον.", en: "I wrote the speech.", note: "Aorist: an event." },
        { grc: "ὁ πατὴρ ἔπεμψε δῶρον.", en: "The father sent a gift.", note: "«ἔπεμψε», aorist of «πέμπω»: π + σ makes ψ." },
      ] },
      { kind: "reveal", title: "Take off the augment: which verb is it?", items: [
        { grc: "ἔλυσαν", answer: "λύω: \"they loosened\" (aorist)" },
        { grc: "ἦγον", answer: "ἄγω: \"I was leading\" or \"they were leading\" (imperfect; α lengthened to η)" },
        { grc: "ἐβούλετο", answer: "βούλομαι \"want\": \"he wanted\" (imperfect)" },
        { grc: "ὑπώπτευε", answer: "ὑποπτεύω \"suspect\": \"he suspected\" (imperfect; the augment follows ὑπ-)" },
      ] },
      { kind: "check", items: [
        { q: "What marks a past tense at the front of the verb?", options: ["The augment", "The article", "A breathing", "The accent"], answer: 0, why: "The augment: «ἐ-», or a lengthened first vowel." },
        { q: "The imperfect of «ἄγω» (I) is…", options: ["ἔαγον", "ἦγον", "ἄγον", "ἤγαγον"], answer: 1, why: "A first vowel «α» lengthens to «η»: «ἦγον»." },
        { q: "Where does a compound verb take its augment?", options: ["After the preposition", "Before the preposition", "At the end", "It takes none"], answer: 0, why: "«ὑπο-πτεύω», «ὑπ-ώπτευον»: after the preposition." },
        { q: "\"They loosened\" (aorist) is…", options: ["ἔλυον", "λύσουσι", "ἔλυσαν", "λύουσι"], answer: 2, why: "Augment, «σ» and «-αν»: «ἔλυσαν». «ἔλυον» is the imperfect." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "11.35", quote: "ἐδάκρυσεν ὁ Ἰησοῦς", label: "Gospel of John 11.35",
          note: "A whole verse in three words: «ἐδάκρυσεν» \"wept\", the aorist of «δακρύω»: augment «ἐ-», the «σ», and the ending «-σε(ν)»." },
        { work: "tlg0032.tlg006", ref: "1.1.1", quote: "ἠσθένει Δαρεῖος καὶ ὑπώπτευε τελευτὴν τοῦ βίου, ἐβούλετο", label: "Xenophon, Anabasis 1.1.1",
          note: "Three imperfects set the scene: «ἠσθένει» \"was ill\" (from «ἀσθενέω»: α becomes η), «ὑπώπτευε» \"suspected\" (the augment after ὑπ-) and «ἐβούλετο» \"wanted\" (ἐ-). Darius \"was ill and suspected the end of his life\"; he \"wanted\" both sons with him." },
        { work: "tlg0003.tlg001", ref: "1.1.1", quote: "Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον", label: "Thucydides 1.1.1",
          note: "The opening words of Thucydides' history of the Peloponnesian War. «ξυνέγραψε» \"wrote (the history of)\" is the aorist of «ξυγγράφω», the old Attic spelling of «συγγράφω»: the augment sits after «ξυν-». In the same sentence, «ἐπολέμησαν» \"they fought\" is another aorist." },
      ] },
    ],
  },
  {
    id: "middle-passive", title: "Middle and passive: λύομαι", greek: "μέση καὶ παθητικὴ φωνή", minutes: 25,
    summary: "Being freed, and freeing for yourself: the two other voices of the Greek verb.",
    words: ["πείθω", "γίγνομαι", "ἔρχομαι", "θυγάτηρ", "ὑπό"],
    sections: [
      { kind: "p", text: "So far every verb has been **active**: the subject does the action, «ὁ πατὴρ λύει» \"the father frees\". Greek has two more **voices**. In the **passive**, the subject has the action done to it: \"the daughter *is freed*\". In the **middle**, which English does not have, the subject acts *for itself*, *on itself* or in its own interest." },
      { kind: "voice", caption: "Sentences made up for this lesson. «λύεται» appears twice: the same form can be middle or passive, and the rest of the sentence decides.", items: [
        { voice: "active", grc: "ὁ πατὴρ λύει τὴν θυγατέρα.", verb: "λύει", en: "The father frees his daughter.",
          left: { grc: "ὁ πατήρ", role: "subject" }, right: { grc: "τὴν θυγατέρα", role: "object" },
          note: "Active: the subject does the action." },
        { voice: "middle", grc: "ὁ πατὴρ λύεται τὴν θυγατέρα.", verb: "λύεται", en: "The father ransoms his daughter.",
          left: { grc: "ὁ πατήρ", role: "subject" }, right: { grc: "τὴν θυγατέρα", role: "object" },
          note: "Middle: the subject acts for itself. He has her freed for himself, by paying for her: in the middle, «λύομαι» means \"ransom\"." },
        { voice: "passive", grc: "ἡ θυγάτηρ λύεται ὑπὸ τοῦ πατρός.", verb: "λύεται", en: "The daughter is freed by her father.",
          left: { grc: "ὑπὸ τοῦ πατρός", role: "doer" }, right: { grc: "ἡ θυγάτηρ", role: "subject" },
          note: "Passive: the subject has the action done to it. «ὑπό» with the genitive names who does it." },
      ] },
      { kind: "p", text: "**One set of forms, two voices.** In the present and the imperfect, the middle and the passive are spelled the same. So «λύεται» can mean \"he ransoms\" (middle) or \"he is freed\" (passive). Look at the rest of the sentence: a direct object points to the middle; «ὑπό» with the genitive, naming who does it (the \"by\" of lesson 10), points to the passive." },
      { kind: "table", paradigm: "luomai" },
      { kind: "tip", text: "Listen for the ends. In the present, \"he, she, it\" ends in «-ται» and \"they\" in «-νται»; in the imperfect (with its augment) they end in «-το» and «-ντο». Almost every middle or passive verb you meet will show one of these four." },
      { kind: "p", text: "**The future and the aorist tell the voices apart.** The middle keeps the «σ» of the active and adds middle endings: «λύσομαι» \"I shall ransom\", «ἐλυσάμην» \"I ransomed\". The passive has its own mark, «θη»: «ἐλύθην» \"I was freed\", «ἐλύθη» \"he, she, it was freed\"." },
      { kind: "table", paradigm: "luo-mp-aorist" },
      { kind: "p", text: "**Middle in form, active in meaning.** Some very common verbs have no active forms at all: «βούλομαι» \"I want\", «γίγνομαι» \"I become, happen, am born\", «ἔρχομαι» \"I come, go\". Grammars call them *deponent* verbs. Dictionaries list them under the «-ομαι» form, and you translate them as ordinary active verbs: «ἐγένετο» is simply \"it happened\" or \"it came into being\"." },
      { kind: "tip", text: "In John's Gospel you will meet «ἀπεκρίθη» \"he answered\" 56 times. It is an aorist passive in form (see the «θη») of «ἀποκρίνομαι» \"I answer\", with an active meaning." },
      { kind: "p", text: "Some verbs change their meaning in the middle. «πείθω» is \"I persuade\", but «πείθομαι» is \"I am persuaded, I believe\", and with the dative \"I obey\"." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "ὁ δοῦλος λύεται ὑπὸ τοῦ δεσπότου.", en: "The slave is freed by his master.", note: "Passive: «ὑπό» with the genitive names the doer." },
        { grc: "οἱ στρατιῶται πείθονται τῷ στρατηγῷ.", en: "The soldiers obey the general.", note: "«πείθομαι» with the dative." },
        { grc: "ἐλύθησαν οἱ ἵπποι.", en: "The horses were untied.", note: "Aorist passive: the «θη»." },
      ] },
      { kind: "reveal", title: "Name the tense and voice", items: [
        { grc: "λύονται", answer: "present, middle or passive: \"they ransom\" or \"they are freed\"" },
        { grc: "ἐλυόμεθα", answer: "imperfect, middle or passive: \"we were ransoming\" or \"we were being freed\"" },
        { grc: "ἐλύθη", answer: "aorist passive: \"he, she or it was freed\" (the «θη»)" },
        { grc: "λύσονται", answer: "future middle: \"they will ransom\" (the «σ» and a middle ending)" },
        { grc: "ἐλύσατο", answer: "aorist middle: \"he or she ransomed\"" },
      ] },
      { kind: "check", items: [
        { q: "In «ἡ θυγάτηρ λύεται ὑπὸ τοῦ πατρός», «λύεται» is…", options: ["active", "middle", "passive"], answer: 2, why: "«ὑπὸ τοῦ πατρός», \"by her father\", names who does it: passive, \"is freed\"." },
        { q: "Which form can only be passive?", options: ["λύεται", "ἐλύετο", "ἐλύθη", "λύσεται"], answer: 2, why: "The «θη» of the aorist passive. «λύεται» and «ἐλύετο» may be middle or passive; «λύσεται» is future middle." },
        { q: "«ἐγένετο» means…", options: ["he was freed", "it happened, came into being", "he wanted", "they came"], answer: 1, why: "«γίγνομαι» is middle in form but active in meaning: «ἐγένετο» \"it happened, came to be\"." },
        { q: "«πείθονται τῷ στρατηγῷ» means…", options: ["they persuade the general", "they obey the general", "the general persuades them", "they are freed by the general"], answer: 1, why: "«πείθομαι» with the dative means \"obey\"." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0012.tlg001", ref: "1.13", quote: "λυσόμενός τε θύγατρα", label: "Homer, Iliad 1.12–13",
          note: "Chryses, a priest of Apollo, comes to the Greek ships «λυσόμενός τε θύγατρα», \"to ransom his daughter\": a middle form of «λύω» (a future participle, a form for a later lesson). He wants her freed for himself, and he brings \"boundless ransom\", «ἀπερείσιʼ ἄποινα»." },
        { work: "tlg0012.tlg001", ref: "1.29", quote: "τὴν δʼ ἐγὼ οὐ λύσω", label: "Homer, Iliad 1.29",
          note: "Agamemnon answers in the active: «τὴν δʼ ἐγὼ οὐ λύσω», \"but her I will not free\". One verb, two voices: active for the man who would set her free, middle for the father who wants her back." },
        { work: "tlg0032.tlg006", ref: "1.1.3", quote: "ὁ δὲ πείθεται καὶ συλλαμβάνει Κῦρον", label: "Xenophon, Anabasis 1.1.3",
          note: "Tissaphernes slanders Cyrus to his brother, the new king Artaxerxes, «ὁ δὲ πείθεται», \"and he is persuaded\" (he believes it) and arrests Cyrus. Xenophon tells the story in the present tense here, as English storytellers sometimes do." },
        { work: "tlg0031.tlg001", ref: "4.1", quote: "ἀνήχθη εἰς τὴν ἔρημον ὑπὸ τοῦ πνεύματος", label: "Gospel of Matthew 4.1",
          note: "«ἀνήχθη» \"was led up\" is an aorist passive of «ἀνάγω» (augment after «ἀν-»; γ becomes χ before the θ), and «ὑπὸ τοῦ πνεύματος» \"by the Spirit\" names who led. «πειρασθῆναι ὑπὸ τοῦ διαβόλου», \"to be tempted by the devil\", is passive too (an infinitive, met in a later lesson). The square brackets show a word the editors were unsure of." },
        { work: "tlg0031.tlg004", ref: "1.3", quote: "πάντα διʼ αὐτοῦ ἐγένετο", label: "Gospel of John 1.3",
          note: "«ἐγένετο», from «γίγνομαι», is middle in form, active in meaning: \"all things came into being through him\"." },
      ] },
    ],
  },
  {
    id: "participles", title: "Participles: verbs that work as adjectives", greek: "μετοχή", minutes: 25,
    summary: "λύων \"freeing\", λύσας \"having freed\": how Greek packs a whole clause into one word.",
    words: ["πιστεύω", "λαμβάνω", "φέρω", "μήτηρ", "ἀποκτείνω"],
    sections: [
      { kind: "p", text: "A **participle** is a verb that works as an adjective: \"the *believing* man\", \"Cyrus, *having taken* a friend along\". Like an adjective, it **agrees** with a noun in gender, number and case. Like a verb, it has a **tense** and a **voice**, and it can take an object." },
      { kind: "p", text: "The Greek grammarians called it «μετοχή», \"sharing\", because it shares in the nature of both the verb and the noun. The Latin *participium*, and so our *participle*, translates that name." },
      { kind: "table", paradigm: "luon" },
      { kind: "tip", text: "As with third-declension nouns (lesson 12), the genitive shows the stem: «λύων», «λύοντος», stem «λυοντ-». Look for «-οντ-» and «-ουσ-»: that is a present active participle." },
      { kind: "table", paradigm: "lusas" },
      { kind: "p", text: "**The other voices** are easier still. Middle and passive participles end in «-μενος, -μένη, -μενον» and decline like «ἀγαθός»: «λυόμενος» \"ransoming\" or \"being freed\", «λυσάμενος» \"having ransomed\" (aorist middle). The aorist passive is «λυθείς, λυθεῖσα, λυθέν» \"having been freed\". The future adds «σ»: «λύσων» \"about to free\", «λυσόμενος» \"about to ransom\"." },
      { kind: "p", text: "**A participle's tense is about time compared with the main verb**, not with now. A present participle happens *at the same time* as the main verb, an aorist participle usually *before* it, and a future participle *after* it, often as a purpose: what someone means to do." },
      { kind: "timeline", title: "Before, during, after: three participles from the same page of Xenophon", items: [
        { work: "tlg0032.tlg006", ref: "1.1.2", label: "Anabasis 1.1.2", time: "before",
          grc: "ἀναβαίνει οὖν ὁ Κῦρος λαβὼν Τισσαφέρνην ὡς φίλον", ptc: "λαβὼν", verb: "ἀναβαίνει",
          en: "So Cyrus goes up, having taken Tissaphernes along as a friend.",
          note: "Aorist participle: the taking comes first. «λαβών» is from «λαμβάνω» \"take\", whose aorist stem is «λαβ-». There is no augment: that belongs only to the indicative." },
        { work: "tlg0032.tlg006", ref: "1.1.2", label: "Anabasis 1.1.2", time: "same",
          grc: "τῶν Ἑλλήνων ἔχων ὁπλίτας ἀνέβη τριακοσίους", ptc: "ἔχων", verb: "ἀνέβη",
          en: "And he went up with three hundred Greek hoplites (literally \"having\").",
          note: "Present participle: he has them all the while he goes. «τριακοσίους» \"three hundred\" stands far from «ὁπλίτας» \"hoplites\"; the matching endings show that they belong together." },
        { work: "tlg0032.tlg006", ref: "1.1.3", label: "Anabasis 1.1.3", time: "after",
          grc: "συλλαμβάνει Κῦρον ὡς ἀποκτενῶν", ptc: "ἀποκτενῶν", verb: "συλλαμβάνει",
          en: "He arrests Cyrus, meaning to kill him.",
          note: "Future participle with «ὡς»: what the king intends to do next. It never happened: their mother pleaded for Cyrus and sent him back to his province." },
      ] },
      { kind: "p", text: "**Three ways to use a participle.** With the article, it becomes a noun: «ὁ πιστεύων» \"the one who believes, whoever believes\". With the article and a noun, it describes like an adjective: «ὁ ἀμνὸς ὁ αἴρων τὴν ἁμαρτίαν» \"the lamb who takes away the sin\". Without an article, it adds the circumstances of the main action: when, while, because or although. «λαβὼν Τισσαφέρνην» can be \"having taken Tissaphernes\", \"after taking\" or \"when he had taken\"." },
      { kind: "tip", text: "Translate first with \"-ing\" or \"having …-ed\"; then choose the English that fits best: \"who…\", \"when…\", \"because…\", \"although…\". Greek leaves the link to the context." },
      { kind: "made", title: "Practice sentences (made up for this lesson)", items: [
        { grc: "ὁ λύων τὸν δοῦλον", en: "the one who frees the slave", note: "Article + participle: a noun. The participle takes an object like any verb." },
        { grc: "λύσας τὸν ἵππον, ὁ ἀνὴρ ἀπῆλθεν.", en: "Having untied the horse, the man went away.", note: "Aorist: the untying comes first." },
        { grc: "ἡ μήτηρ λέγουσα τὸν λόγον δακρύει.", en: "The mother weeps as she tells the story.", note: "Present: at the same time. «λέγουσα» is feminine, agreeing with «ἡ μήτηρ»." },
      ] },
      { kind: "reveal", title: "Name the participle", items: [
        { grc: "λύοντες", answer: "present active, masculine nominative plural: \"freeing\"" },
        { grc: "λύσασα", answer: "aorist active, feminine nominative singular: \"having freed\"" },
        { grc: "λυομένου", answer: "present middle or passive, masculine or neuter genitive singular: \"ransoming\" or \"being freed\"" },
        { grc: "λυθέντες", answer: "aorist passive, masculine nominative plural: \"having been freed\"" },
      ] },
      { kind: "check", items: [
        { q: "«ὁ πιστεύων» means…", options: ["he believed", "the one who believes", "they believe", "to believe"], answer: 1, why: "Article + participle: \"the one who believes\"." },
        { q: "An aorist participle usually shows an action…", options: ["before the main verb", "at the same time as the main verb", "after the main verb"], answer: 0, why: "The aorist looks back: \"having done\". The present is at the same time; the future looks ahead." },
        { q: "Which participle agrees with «τὴν μητέρα»?", options: ["λύουσα", "λύουσαν", "λύοντα", "λυούσης"], answer: 1, why: "«τὴν μητέρα» is feminine accusative singular, so «λύουσαν»." },
        { q: "Why does «λαβών» have no augment?", options: ["The augment belongs only to the indicative", "It is a present participle", "It begins with a consonant", "It is plural"], answer: 0, why: "Participles never take the augment, even in the aorist." },
      ] },
      { kind: "real", title: "Read it yourself", items: [
        { work: "tlg0031.tlg004", ref: "3.36", quote: "ὁ πιστεύων εἰς τὸν υἱὸν ἔχει ζωὴν αἰώνιον", label: "Gospel of John 3.36",
          note: "«ὁ πιστεύων», article + present participle: \"the one who believes\". Later in the verse, «ὁ δὲ ἀπειθῶν» \"but the one who disobeys\" has the same shape." },
        { work: "tlg0031.tlg004", ref: "1.29", quote: "βλέπει τὸν Ἰησοῦν ἐρχόμενον πρὸς αὐτόν", label: "Gospel of John 1.29",
          note: "«ἐρχόμενον» \"coming\", from «ἔρχομαι», agrees with «τὸν Ἰησοῦν» (masculine accusative singular). Then «ὁ ἀμνὸς τοῦ θεοῦ ὁ αἴρων τὴν ἁμαρτίαν τοῦ κόσμου», \"the lamb of God who takes away the sin of the world\": the participle «αἴρων» takes an object, like any verb." },
        { work: "tlg0012.tlg001", ref: "1.13", quote: "λυσόμενός τε θύγατρα φέρων τʼ ἀπερείσιʼ ἄποινα", label: "Homer, Iliad 1.12–13",
          note: "Back to Chryses (lesson 14). Two participles tell why and how he came: «λυσόμενος» (future middle) \"to ransom\" and «φέρων» (present) \"bringing\". Both are masculine nominative singular, agreeing with Chryses, the subject of «ἦλθε» \"he came\"." },
        { work: "tlg0032.tlg006", ref: "1.1.3", quote: "ἡ δὲ μήτηρ ἐξαιτησαμένη αὐτὸν ἀποπέμπει", label: "Xenophon, Anabasis 1.1.3",
          note: "«ἐξαιτησαμένη», an aorist middle participle, is feminine nominative, agreeing with «ἡ μήτηρ»: \"the mother, having begged for him, sends him back\". First she pleads, then she sends him: the aorist shows the order." },
      ] },
    ],
  },
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
