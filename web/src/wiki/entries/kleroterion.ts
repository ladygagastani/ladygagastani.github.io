import type { Entry } from "../types";

const entry: Entry = {
  slug: "kleroterion",
  title: "Chosen by lot: the allotment machine",
  greek: "κληρωτήριον",
  category: "democracy",
  kicker: "How Athens trusted chance, and built a machine to make sure nobody cheated it",
  image: "kleroterion",
  hook: `Modern democracies choose their officials by election. The Athenians thought elections favoured the rich, the famous and the well-connected, and chose most of their officials, their Council and every jury by lot. To stop anyone rigging the draw, they built a machine: a stone slab full of slots for citizens' name-tickets, with a tube down the side into which black and white balls were dropped. Pieces of these machines, and the bronze tickets, have been found in the Agora of Athens.`,
  body: `## Why chance?

In Herodotus, a Persian noble arguing for rule by the many sums up what it means: the people [fill offices by lot](cts:tlg0016.tlg001:3.80.6), hold them to account, and decide everything in common. A century later Aristotle stated the principle plainly.

{{quote:aristotle}}

{well} Athens had [some seven hundred officials](cts:tlg0086.tlg003:24.3) at home, and by the fourth century BC most of them were chosen by lot, for one year. The Council of Five Hundred, which prepared the Assembly's business, was drawn by lot, and a man could [serve on it only twice](cts:tlg0086.tlg003:62.3) in his life. The great exception was the generals, and other military posts, which were elected, because nobody wanted a general chosen by chance.

The chief magistrates, the nine archons, were first chosen by lot, from men nominated by the villages, in [487/6 BC](cts:tlg0086.tlg003:22.5). From then on the archonship, once the highest office in Athens, lost its power to the elected generals.

## The critics

Not everyone liked it. Xenophon records the charge made against Socrates by his accuser: that he taught young men to despise the laws, by saying it was foolish to choose the city's officials by bean.

{{quote:bean}}

!! The Athenians often drew lots with beans, and "chosen by the bean", *kyameutos*, meant chosen by lot.

## How the machine worked

The *Constitution of the Athenians* describes, in minute detail, how jurors were chosen each morning for the day's courts. Every juror had a ticket, a *pinakion*, with his [name, his father's name, his village and a letter](cts:tlg0086.tlg003:63.4) from Α to Κ, which placed him in one of ten sections of his tribe.

- The tickets of the men who turned up were dropped into ten boxes, one for each letter.
- An official drew tickets and slotted them, in columns by letter, into the *kleroterion*, the allotment machine. Even the man who slotted them was [chosen by lot](cts:tlg0086.tlg003:64.2), so that the same man could not always do it and cheat.
- Into a tube down the side went [bronze dice, black and white](cts:tlg0086.tlg003:64.3). They came out one at a time, and each decided a whole row: white, and every man whose ticket was in that row served that day; black, and they all went home.
- Each man chosen drew an acorn-shaped token with a letter on it, which sent him to a court he could not have chosen in advance.

{{quote:court}}

The chosen jurors were given a staff painted [the colour of their court](cts:tlg0086.tlg003:65.1), so that anyone who went to the wrong one would be caught.

{well} Fragments of stone *kleroteria* were found in the American excavations of the Athenian Agora, which began in 1931, with rows of narrow slots exactly as the text describes, and bronze *pinakia* stamped with names survive too. Sterling Dow's study of 1939 matched them to Aristotle's account.

## Did it work?

{debated} Chance kept any one group from capturing the courts and the Council, and made bribery very hard: with thousands of jurors and a draw on the morning of the trial, there was no one to bribe in advance. Critics then and now answer that it put amateurs in charge. The Athenians' reply was that most offices needed honesty more than expertise, that officials were checked when their year ended, and that the jobs needing skill were elected.

{{timeline}}`,
  quotes: {
    aristotle: {
      work: "tlg0086.tlg035", ref: "4.1294b", label: "Aristotle, Politics 4.1294b",
      grc: "δοκεῖ δημοκρατικὸν μὲν εἶναι τὸ κληρωτὰς εἶναι τὰς ἀρχάς, τὸ δʼ αἱρετὰς ὀλιγαρχικόν,",
      tr: "it is thought to be democratic for the offices to be assigned by lot, for them to be elected oligarchic,",
      trFrom: "corpus", trBy: "H. Rackham (1944)",
    },
    bean: {
      work: "tlg0032.tlg002", ref: "1.2.9", label: "Xenophon, Memorabilia 1.2.9",
      grc: "λέγων ὡς μῶρον εἴη τοὺς μὲν τῆς πόλεως ἄρχοντας ἀπὸ κυάμου καθιστάναι, κυβερνήτῃ δὲ μηδένα θέλειν χρῆσθαι κυαμευτῷ μηδὲ τέκτονι μηδʼ αὐλητῇ",
      tr: "by insisting on the folly of appointing public officials by lot, when none would choose a pilot or builder or flautist by lot,",
      trFrom: "corpus", trBy: "E. C. Marchant (1923)",
    },
    court: {
      work: "tlg0086.tlg003", ref: "64.4", label: "Constitution of the Athenians 64.4",
      grc: "ἵνʼ εἰς οἷον ἂν λάχῃ εἰσίῃ καὶ μὴ εἰς οἷον ἂν βούληται, μηδὲ ᾖ συναγαγεῖν εἰς δικαστήριον οὓς ἂν βούληταί τις.",
      tr: "so that each man goes into the court the lot gives him and not the one he wants, and nobody can gather into a court the jurors he wants.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "487/6 BC", what: "The archons are first chosen by lot from nominated candidates.", certainty: "well" },
    { when: "5th c. BC", what: "Council, juries and most magistrates are chosen by lot.", certainty: "well" },
    { when: "4th c. BC", what: "Stone allotment machines are in use for the courts.", certainty: "well" },
    { when: "c. 330–320 BC", what: "The Constitution of the Athenians describes the procedure.", certainty: "well" },
    { when: "1930s", what: "Fragments of kleroteria are found in the Agora excavations.", certainty: "well" },
    { when: "1939", what: "Sterling Dow publishes his study of the machines.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0086.tlg003", ref: "63.1", to: "66.3", label: "Constitution of the Athenians 63–66", why: "The whole procedure for choosing juries, step by step." },
    { work: "tlg0016.tlg001", ref: "3.80.1", to: "3.82.5", label: "Herodotus 3.80–82", why: "Three Persians debate democracy, oligarchy and monarchy." },
  ],
  related: ["ostracism", "pericles"],
  primary: [
    { work: "tlg0086.tlg003", ref: "63.1", to: "66.3", label: "Constitution of the Athenians 63–66" },
    { work: "tlg0086.tlg003", ref: "22.5", label: "Constitution of the Athenians 22.5" },
    { work: "tlg0086.tlg035", ref: "4.1294b", label: "Aristotle, Politics 4.1294b" },
    { work: "tlg0032.tlg002", ref: "1.2.9", label: "Xenophon, Memorabilia 1.2.9" },
  ],
  secondary: [
    { id: "dow-kleroteria", note: "The machines found in the Agora, matched to the text." },
    { id: "hansen-demosthenes", note: "How the democracy worked, office by office." },
    { id: "rhodes-ath-pol", note: "On the Constitution of the Athenians." },
  ],
  written: "2026-09-27",
};
export default entry;
