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
      { kind: "p", text: "Before you learn a single word, you can already learn to **read aloud**. Greek spelling is regular: each letter keeps its sound, so once you know the letters you can say any word you see. Open **The alphabet** in the Academy whenever you want to check a letter." },
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
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
