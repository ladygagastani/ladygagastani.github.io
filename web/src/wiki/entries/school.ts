import type { Entry } from "../types";

const entry: Entry = {
  slug: "school",
  title: "Going to school in Athens",
  greek: "εἰς διδασκάλου",
  category: "education",
  kicker: "Three teachers, a slave to walk you there, and Homer by heart",
  hook: `There were no state schools in classical Athens. A boy whose father could pay was walked each morning by a slave to three different teachers: one for reading and writing, one for the lyre and the poets, and one for wrestling and exercise. He learned his letters by tracing them on a wax tablet, and then learned Homer by heart. Much of what he learned was meant to make him not clever but good, and the teachers were expected to beat him when he was not.`,
  body: `## The slave at your side

The *paidagogos*, the "boy-leader", was a household slave whose job was to take a boy to school, carry his things and keep him in order. In Plato's *Lysis*, Socrates teases a boy from a rich family about how little he is allowed to do. Who controls you? he asks.

{{quote:tutor}}

!! Our word "pedagogue", a teacher, comes from *paidagogos*, but the ancient *paidagogos* was not a teacher at all. He was the slave who walked you to one.

## Three teachers

Plato's *Protagoras* gives the fullest description of an Athenian education, in the mouth of the famous teacher Protagoras himself. At home, the nurse, the mother, the *paidagogos* and the father all [correct the child at every turn](cts:tlg0059.tlg022:325), "like a bent and twisted piece of wood", with threats and blows. Then he is sent to school.

- The **grammatistes** taught letters. Children learned to write by following lines the teacher had [drawn for them on the tablet](cts:tlg0059.tlg022:326): Athenian children wrote with a stylus on a wooden tablet coated with wax, which could be smoothed and used again.
- Once a boy could read, he was given the poets, above all Homer, to learn by heart.
- The **kitharistes** taught the lyre, and with it the songs of the lyric poets.
- The **paidotribes**, the trainer, taught wrestling and exercise in the palaestra, so that the body would not let the mind down in war.

{{quote:poets}}

{well} Painted cups of the early fifth century BC show these lessons: a boy reciting to a seated master holding a scroll, another tuning a lyre, a teacher correcting a writing tablet. They agree closely with Plato's description.

## Homer by heart

Learning poetry was learning to be a man. In Xenophon's *Symposium*, a young Athenian named Niceratus boasts of what his father made him do.

{{quote:homer}}

Socrates' friends are not impressed: the professional reciters of Homer, the rhapsodes, knew it all too, and nobody thought them wise.

## Good old days

Every generation thinks school was stricter in its day. In Aristophanes' *Clouds* (423 BC), the Stronger Argument recalls the old education: the boys of each district marched in silence and good order to the music master, lightly clad, [even if it was snowing](cts:tlg0019.tlg003:964), learned the old songs without any modern twiddles, and were thrashed if they sang them badly.

## Who went, and for how long

The Protagoras says what we would expect: those who can afford it most send their sons earliest and take them away latest. A poor boy might learn his letters and little more; a rich one went on to the sophists and, later, to schools of rhetoric and philosophy like Plato's Academy.

{debated} How many Athenians could read is one of the great open questions. Ostracism, in which each citizen wrote a name on a potsherd, assumes that most citizens could at least write a name, and the thousands of surviving *ostraka* show many different hands. But being able to write a name is not the same as reading a book, and estimates of literacy range widely.

{debated} Girls are almost absent from these descriptions. Most were taught at home, by their mothers, to spin and weave; some certainly learned to read, since vase paintings show women with scrolls, but we cannot say how many.

## Schools in the histories

Schools appear in the historians mostly when disaster struck them. On Chios, shortly before the sea battle of Lade in 494 BC, Herodotus records that [the roof of a school fell in](cts:tlg0016.tlg001:6.27.2) on 120 boys learning their letters, and only one escaped. In 413 BC Thracian mercenaries sacked the small Boeotian town of Mycalessus.

{{quote:mycalessus}}

These two passages are among the earliest mentions of schools in Greek, and they show that by the fifth century even small towns had them.

{{timeline}}`,
  quotes: {
    tutor: {
      work: "tlg0059.tlg020", ref: "208", label: "Plato, Lysis 208c",
      grc: "ἀλλʼ ἄρχει τίς σου;—ὅδε, παιδαγωγός, ἔφη.—μῶν δοῦλος ὤν;—ἀλλὰ τί μήν; ἡμέτερός γε, ἔφη.—ἦ δεινόν, ἦν δʼ ἐγώ, ἐλεύθερον ὄντα ὑπὸ δούλου ἄρχεσθαι. τί δὲ ποιῶν αὖ οὗτος ὁ παιδαγωγός σου ἄρχει;—ἄγων δήπου, ἔφη, εἰς διδασκάλου.",
      tr: "But some one controls you? Yes, he said, my tutor here. Is he a slave? Why, certainly; he belongs to us, he said. What a strange thing, I exclaimed; a free man controlled by a slave! But how does this tutor actually exert his control over you? By taking me to school, I suppose, he replied.",
      trFrom: "corpus", trBy: "W. R. M. Lamb (1925)",
    },
    poets: {
      work: "tlg0059.tlg022", ref: "326", label: "Plato, Protagoras 325e–326a",
      grc: "παρατιθέασιν αὐτοῖς ἐπὶ τῶν βάθρων ἀναγιγνώσκειν ποιητῶν ἀγαθῶν ποιήματα καὶ ἐκμανθάνειν ἀναγκάζουσιν, ἐν οἷς πολλαὶ μὲν νουθετήσεις ἔνεισιν πολλαὶ δὲ διέξοδοι καὶ ἔπαινοι καὶ ἐγκώμια παλαιῶν ἀνδρῶν ἀγαθῶν, ἵνα ὁ παῖς ζηλῶν μιμῆται καὶ ὀρέγηται τοιοῦτος γενέσθαι.",
      tr: "are furnished with works of good poets to read as they sit in class, and are made to learn them off by heart: here they meet with many admonitions, many descriptions and praises and eulogies of good men in times past, that the boy in envy may imitate them and yearn to become even as they.",
      trFrom: "corpus", trBy: "W. R. M. Lamb (1924)",
    },
    homer: {
      work: "tlg0032.tlg004", ref: "3.5", label: "Xenophon, Symposium 3.5",
      grc: "ὁ πατὴρ ὁ ἐπιμελούμενος ὅπως ἀνὴρ ἀγαθὸς γενοίμην ἠνάγκασέ με πάντα τὰ Ὁμήρου ἔπη μαθεῖν· καὶ νῦν δυναίμην ἂν Ἰλιάδα ὅλην καὶ Ὀδύσσειαν ἀπὸ στόματος εἰπεῖν.",
      tr: "My father was anxious to see me develop into a good man, said Niceratus, and as a means to this end he compelled me to memorize all of Homer; and so even now I can repeat the whole Iliad and the Odyssey by heart.",
      trFrom: "corpus", trBy: "O. J. Todd (1923)",
    },
    mycalessus: {
      work: "tlg0003.tlg001", ref: "7.29.5", label: "Thucydides 7.29.5",
      grc: "καὶ ἐπιπεσόντες διδασκαλείῳ παίδων, ὅπερ μέγιστον ἦν αὐτόθι καὶ ἄρτι ἔτυχον οἱ παῖδες ἐσεληλυθότες, κατέκοψαν πάντας·",
      tr: "and in particular they fell upon a boys' school, the largest in the town, which the children had just entered, and cut down all of them.",
      trFrom: "corpus", trBy: "C. F. Smith (1921)",
    },
  },
  timeline: [
    { when: "494 BC", what: "A school roof collapses on Chios; one boy of 120 escapes.", certainty: "well" },
    { when: "c. 500–470 BC", what: "Athenian cups show school lessons: letters, lyre, recitation.", certainty: "well" },
    { when: "423 BC", what: "Aristophanes' Clouds mocks the \"old education\" and the new.", certainty: "well" },
    { when: "413 BC", what: "Thracian mercenaries kill the boys in the school at Mycalessus.", certainty: "well" },
    { when: "4th c. BC", what: "Plato's Protagoras and Lysis, and Xenophon's Symposium, describe schooling.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0059.tlg022", ref: "325", to: "326", label: "Plato, Protagoras 325c–326e", why: "Protagoras on how Athenians bring up their sons." },
    { work: "tlg0019.tlg003", ref: "961", to: "983", label: "Aristophanes, Clouds 961–983", why: "The \"old education\", remembered with comic nostalgia." },
    { work: "tlg0059.tlg020", ref: "207", to: "210", label: "Plato, Lysis 207d–210d", why: "Socrates and a boy who is not allowed to do anything." },
  ],
  related: ["ostracism"],
  primary: [
    { work: "tlg0059.tlg022", ref: "325", to: "326", label: "Plato, Protagoras 325c–326e" },
    { work: "tlg0059.tlg020", ref: "208", label: "Plato, Lysis 208" },
    { work: "tlg0019.tlg003", ref: "961", to: "983", label: "Aristophanes, Clouds 961–983" },
    { work: "tlg0032.tlg004", ref: "3.5", to: "3.6", label: "Xenophon, Symposium 3.5–6" },
    { work: "tlg0016.tlg001", ref: "6.27.2", label: "Herodotus 6.27.2" },
    { work: "tlg0003.tlg001", ref: "7.29.5", label: "Thucydides 7.29.5" },
  ],
  secondary: [
    { id: "marrou-education", note: "The classic history of ancient education." },
    { id: "beck-greek-education", note: "Education at Athens, with the vase paintings." },
  ],
  written: "2026-09-27",
};
export default entry;
