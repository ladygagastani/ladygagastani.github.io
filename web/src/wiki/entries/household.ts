import type { Entry } from "../types";

const entry: Entry = {
  slug: "household",
  title: "The household",
  greek: "ὁ οἶκος",
  category: "daily",
  kicker: "House, family, slaves and storerooms: the oikos, and the town where it survives",
  image: "olynthos-houses",
  hook: `A Greek *oikos* was more than a house. It was the building, the family, the slaves, the animals, the stores and the land, run as one small economy, and the Greek word for running it, *oikonomia*, gave us "economy". Hesiod told a farmer to get a house, a woman and an ox, in that order. Xenophon wrote a whole dialogue on how to train a wife to run the stores. At Olynthos in northern Greece, a town sacked in 348 BC, archaeologists uncovered more than a hundred houses, and could walk from room to room of the homes the texts describe.`,
  body: `## A house, a woman and an ox

The oldest advice on setting up a household is Hesiod's, in a poem addressed to a farmer:

{{quote:hesiod}}

Aristotle quoted this line centuries later, remarking that [for the poor the ox takes the place of a slave](cts:tlg0086.tlg035:1.1252b). For him the household was the building block of the city, and he divided it into its human parts:

{{quote:aristotle}}

That is the *oikos*: not a couple with children, but a unit that included its slaves, and whose purpose was to feed and continue itself.

## A town left standing

Olynthos, in the Chalcidice in northern Greece, is exceptional. It was sacked by Philip II of Macedon in 348 BC, and in the 1920s and 1930s an American team led by David M. Robinson excavated some hundred houses there. They are still our fullest evidence for how Greeks lived at home.

{well} The typical Olynthian house, as the University of Michigan's [Olynthos Project](https://sites.lsa.umich.edu/olynthos-project/olynthian-houses/) describes it, was built around an open courtyard at its centre or on its south side, with a roofed colonnade, the *pastas*, along one or more sides. Most rooms opened off the courtyard, and a stone base for a wooden staircase shows that many had an upper floor. One room stands out: the *andron*, the "men's room", square, with its door off-centre so that couches fitted round the walls for dinners and [drinking parties](wiki:symposium), often with a red floor or a mosaic of river pebbles. Some houses had a clay bathtub, filled and emptied by hand.

Xenophon's model householder describes the same principle, a house built to face the sun:

{{quote:south}}

{debated} What the other rooms were for is harder to say. They have few fixed fittings, and much of what the first excavators found was not kept. The town was also not destroyed in a single day: Nicholas Cahill has argued that it was abandoned, looted and salvaged over a period of years, before and after 348, so the objects left behind are only part of what the houses held. Houses along the main avenues often had shops on their street fronts; some families grew and stored their own food, others lived by a trade.

## Running the house

Xenophon's *Oeconomicus*, "The Householder", is a dialogue in which Socrates questions a rich Athenian, Ischomachus, about how he manages his estate. Ischomachus tells how he taught his young wife her work: she was to stay indoors and act as the manager of the stores and the slaves.

{{quote:duties}}

He shows her the house room by room: the secure [storeroom](cts:tlg0032.tlg003:9.3) for the best blankets and vessels, the dry rooms for grain, the cool ones for wine. And he adds a duty he expects her to find thankless, [nursing any slave who falls ill](cts:tlg0032.tlg003:7.37); she answers that it will be a pleasure, if it makes them more loyal.

## His rooms and her rooms

Ischomachus also shows his wife "the women's quarters", and explains why they are locked off:

{{quote:bolted}}

The slaves' families, in other words, were the master's to allow or forbid. In a speech of Lysias, a husband describes his own two-storey house with [the women's rooms upstairs](wiki:love-sex-and-marriage).

{debated} The archaeology is less tidy than the texts. When Cahill mapped where the objects of women's work and men's entertaining were found at Olynthos, looms, cooking gear and wine-mixing bowls, no clear division between men's and women's space appeared.

## The family business

A rich household was also a business. When Demosthenes came of age he sued the guardians who had managed his father's estate since he was [seven years old](cts:tlg0014.tlg027:4), and he told the jury what the estate had been:

{{quote:estate}}

Besides these, he lists the ivory, iron and wood for the workshops, a house worth three thousand drachmas, and [his mother's jewellery and clothes](cts:tlg0014.tlg027:10). The workers in both workshops were the household's slaves.

!! The Greek word for a burglar, *toichorychos*, means "wall-digger": LSJ explains it as "one who digs through the wall". A house was valuable down to its woodwork. When the Athenians abandoned the countryside at the start of the war with Sparta in 431 BC, Thucydides says, they brought in their families and furniture, [pulling down even the woodwork of their houses](cts:tlg0003.tlg001:2.14.1) to take with them.

{{timeline}}`,
  quotes: {
    hesiod: {
      work: "tlg0020.tlg002", ref: "405", label: "Hesiod, Works and Days 405",
      grc: "οἶκον μὲν πρώτιστα γυναῖκά τε βοῦν τʼ ἀροτῆρα,",
      tr: "First of all, get a house, and a woman and an ox for the plough",
      trFrom: "corpus", trBy: "H. G. Evelyn-White (1914)",
    },
    aristotle: {
      work: "tlg0086.tlg035", ref: "1.1253b", label: "Aristotle, Politics 1.1253b",
      grc: "οἰκία δὲ τέλειος ἐκ δούλων καὶ ἐλευθέρων. ἐπεὶ δʼ ἐν τοῖς ἐλαχίστοις πρῶτον ἕκαστον ζητητέον, πρῶτα δὲ καὶ ἐλάχιστα μέρη οἰκίας δεσπότης καὶ δοῦλος, καὶ πόσις καὶ ἄλοχος, καὶ πατὴρ καὶ τέκνα,",
      tr: "the household in its perfect form consists of slaves and freemen. The investigation of everything should begin with its smallest parts, and the primary and smallest parts of the household are master and slave, husband and wife, father and children;",
      trFrom: "corpus", trBy: "H. Rackham (1944)",
    },
    south: {
      work: "tlg0032.tlg003", ref: "9.4", label: "Xenophon, Oeconomicus 9.4",
      grc: "καὶ σύμπασαν δὲ τὴν οἰκίαν ἐπέδειξα αὐτῇ ὅτι πρὸς μεσημβρίαν ἀναπέπταται, ὥστε εὔδηλον εἶναι ὅτι χειμῶνος μὲν εὐήλιός ἐστι, τοῦ δὲ θέρους εὔσκιος.",
      tr: "I showed her that the whole house fronts south, so that it was obvious that it is sunny in winter and shady in summer.",
      trFrom: "corpus", trBy: "E. C. Marchant (1923)",
    },
    duties: {
      work: "tlg0032.tlg003", ref: "7.35", label: "Xenophon, Oeconomicus 7.35–36",
      grc: "δεήσει μέντοι σε, ἔφην ἐγώ, ἔνδον τε μένειν καὶ οἷς μὲν ἂν ἔξω τὸ ἔργον ᾖ τῶν οἰκετῶν, τούτους συνεκπέμπειν, οἷς δʼ ἂν ἔνδον ἔργον ἐργαστέον, τούτων σοι ἐπιστατητέον, καὶ τά τε εἰσφερόμενα ἀποδεκτέον καὶ ἃ μὲν ἂν αὐτῶν δέῃ δαπανᾶν σοὶ διανεμητέον, ἃ δʼ ἂν περιττεύειν δέῃ, προνοητέον καὶ φυλακτέον ὅπως μὴ ἡ εἰς τὸν ἐνιαυτὸν κειμένη δαπάνη εἰς τὸν μῆνα δαπανᾶται.",
      tr: "Indeed you will, said I; your duty will be to remain indoors and send out those servants whose work is outside, and superintend those who are to work indoors, and to receive the incomings, and distribute so much of them as must be spent, and watch over so much as is to be kept in store, and take care that the sum laid by for a year be not spent in a month.",
      trFrom: "corpus", trBy: "E. C. Marchant (1923)",
    },
    bolted: {
      work: "tlg0032.tlg003", ref: "9.5", label: "Xenophon, Oeconomicus 9.5",
      grc: "ἔδειξα δὲ καὶ τὴν γυναικωνῖτιν αὐτῇ, θύρᾳ βαλανωτῇ ὡρισμένην ἀπὸ τῆς ἀνδρωνίτιδος, ἵνα μήτε ἐκφέρηται ἔνδοθεν ὅ τι μὴ δεῖ μήτε τεκνοποιῶνται οἱ οἰκέται ἄνευ τῆς ἡμετέρας γνώμης.",
      tr: "I showed her the women’s quarters too, separated by a bolted door from the men’s, so that nothing which ought not to be moved may be taken out, and that the servants may not breed without our leave.",
      trFrom: "corpus", trBy: "E. C. Marchant (1923)",
    },
    estate: {
      work: "tlg0014.tlg027", ref: "9", label: "Demosthenes 27.9, Against Aphobus",
      grc: "ὁ γὰρ πατήρ, ὦ ἄνδρες δικασταί, κατέλιπεν δύʼ ἐργαστήρια, τέχνης οὐ μικρᾶς ἑκάτερον, μαχαιροποιοὺς μὲν τριάκοντα καὶ δύʼ ἢ τρεῖς, ἀνὰ πέντε μνᾶς καὶ ἕξ, τοὺς δʼ οὐκ ἐλάττονος ἢ τριῶν μνῶν ἀξίους, ἀφʼ ὧν τριάκοντα μνᾶς ἀτελεῖς ἐλάμβανεν τοῦ ἐνιαυτοῦ τὴν πρόσοδον, κλινοποιοὺς δʼ εἴκοσι τὸν ἀριθμόν,",
      tr: "My father, men of the jury, left two factories, both doing a large business. One was a sword-manufactory, employing thirty-two or thirty-three slaves, most of them worth five or six minae each and none worth less than three minae. From these my father received a clear income of thirty minae each year. The other was a sofa-manufactory, employing twenty slaves,",
      trFrom: "corpus", trBy: "A. T. Murray (1936)",
    },
  },
  timeline: [
    { when: "c. 700 BC", what: "Hesiod's Works and Days: first a house, a woman and an ox.", certainty: "debated" },
    { when: "431 BC", what: "The Athenians move in from the countryside, taking even the woodwork of their houses.", certainty: "well" },
    { when: "4th c. BC", what: "Xenophon writes the Oeconomicus.", certainty: "well" },
    { when: "360s BC", what: "Demosthenes sues his guardians for his father's estate.", certainty: "well" },
    { when: "348 BC", what: "Philip II of Macedon sacks Olynthos.", certainty: "well" },
    { when: "later 4th c. BC", what: "Aristotle's Politics begins with the household.", certainty: "well" },
    { when: "1920s–1930s", what: "David M. Robinson's excavations uncover about a hundred houses at Olynthos.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0032.tlg003", ref: "7.1", to: "10.13", label: "Xenophon, Oeconomicus 7–10", why: "Ischomachus trains his wife to run the house." },
    { work: "tlg0086.tlg035", ref: "1.1252a", to: "1.1253b", label: "Aristotle, Politics 1.1252a–1253b", why: "From household to village to city." },
    { work: "tlg0014.tlg027", ref: "4", to: "11", label: "Demosthenes 27.4–11", why: "An inventory of a rich Athenian estate." },
  ],
  related: ["love-sex-and-marriage", "symposium", "laurion"],
  primary: [
    { work: "tlg0020.tlg002", ref: "405", to: "406", label: "Hesiod, Works and Days 405–406" },
    { work: "tlg0086.tlg035", ref: "1.1252b", to: "1.1253b", label: "Aristotle, Politics 1.1252b–1253b" },
    { work: "tlg0032.tlg003", ref: "7.35", to: "7.37", label: "Xenophon, Oeconomicus 7.35–37" },
    { work: "tlg0032.tlg003", ref: "9.2", to: "9.5", label: "Xenophon, Oeconomicus 9.2–5" },
    { work: "tlg0014.tlg027", ref: "4", to: "10", label: "Demosthenes 27.4–10" },
    { work: "tlg0003.tlg001", ref: "2.14.1", label: "Thucydides 2.14.1" },
  ],
  secondary: [
    { id: "cahill-olynthus", note: "The houses of Olynthos and what was found in them, room by room." },
    { id: "nevett-house-society", note: "Greek house types, and what archaeology says about family life." },
    { id: "pomeroy-oeconomicus", note: "Xenophon's dialogue as evidence for the household, marriage and slavery." },
  ],
  places: ["491678"],
  written: "2026-09-30",
};
export default entry;
