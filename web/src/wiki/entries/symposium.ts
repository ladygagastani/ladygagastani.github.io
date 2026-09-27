import type { Entry } from "../types";

const entry: Entry = {
  slug: "symposium",
  title: "The symposium",
  greek: "τὸ συμπόσιον",
  category: "daily",
  kicker: "Wine, water, song and argument: the Greek drinking party",
  image: "tomb-of-the-diver",
  hook: `A *symposion* means "drinking together". After dinner, a small group of men reclined on couches around the walls of a room, poured a little wine for the gods, sang a hymn, and settled down to drink wine mixed with water from a great bowl in the middle. There were rules for how strong the wine should be, games, flute-girls and songs, and sometimes serious talk. Much of Greek lyric poetry was written for these evenings, and so were the painted cups they drank from. Plato set his greatest dialogue about love at one.`,
  body: `## The order of the evening

The symposium followed the meal, in the men's dining room, the *andron*. Plato's *Symposium* describes the moment: when dinner was over, the guests [poured libations and sang to the god](cts:tlg0059.tlg011:176), "and so forth, as custom bids", and then turned to the drinking.

The first question was how much to drink. At Agathon's party most of the guests still had hangovers from the night before, so they agreed to drink only as each man pleased, and sent the flute-girl away to play for the women of the house.

{{quote:hangover}}

## Wine and water

Greeks almost always drank their wine mixed with water, in a big mixing bowl called a *krater*, and a host or an elected "master of the drinking" decided the proportions. Drinking wine neat was what barbarians did. Herodotus reports the Spartans' own explanation for the madness of their king Cleomenes: he had spent too much time with Scythian envoys and [learned from them to drink unmixed wine](cts:tlg0016.tlg001:6.84.3). Ever since, a Spartan who wanted a stronger drink would say "Scythian it up".

The comic poet Eubulus has the wine god himself give the rule.

{{quote:kraters}}

!! The poem goes on: the fourth bowl belongs to violence, the fifth to shouting, the sixth to rowdy processions through the streets, the seventh to black eyes, the eighth to the summons-server, the ninth to bile, and the tenth to madness.

## Games and songs

The favourite game was *kottabos*: flicking the last drops of wine from your cup at a target, often a little bronze disc balanced on a stand, which clanged when it was [knocked down onto the plate below](cts:tlg0008.tlg001:15.4). Guests took turns singing, [holding a sprig of myrtle](cts:tlg0019.tlg003:1364) as they sang, and many of the short poems of Archilochus, Anacreon and Theognis were composed to be sung on such evenings.

## Who was there

{well} The guests were men, usually of the richer families. The women present were entertainers, flute-girls, dancers and *hetairai*, the educated courtesans who could keep up with the conversation. A respectable wife did not attend.

Painted cups show all of this: reclining drinkers, lyre-players, kottabos throws, and at the bottom of the cup, revealed as the wine was drunk, a joke or an image to startle the drinker.

## When it got out of hand

A symposium could end with a *komos*, a drunken procession through the streets to another house. In Plato's *Symposium* one arrives at the door: just as Socrates finishes his speech on love, there is loud knocking, a flute is heard, and [Alcibiades bursts in](cts:tlg0059.tlg011:212), very drunk, crowned with ivy and violets, and demands to join the party.

{debated} How typical the philosophical symposium was is doubtful. Plato and Xenophon, whose *Symposium* also survives, were writing about Socrates, not describing an ordinary evening. Most of our other evidence is poetry, comedy and vase painting, each with its own reasons to exaggerate the drinking or the talk.

{{timeline}}`,
  quotes: {
    hangover: {
      work: "tlg0059.tlg011", ref: "176", label: "Plato, Symposium 176a",
      grc: "εἶεν, ἄνδρες, φάναι, τίνα τρόπον ῥᾷστα πιόμεθα; ἐγὼ μὲν οὖν λέγω ὑμῖν ὅτι τῷ ὄντι πάνυ χαλεπῶς ἔχω ὑπὸ τοῦ χθὲς πότου καὶ δέομαι ἀναψυχῆς τινος",
      tr: "Well, gentlemen, what mode of drinking will suit us best? For my part, to tell the truth, I am in very poor form as a result of yesterday’s bout, and I claim a little relief;",
      trFrom: "corpus", trBy: "W. R. M. Lamb (1925)",
    },
    kraters: {
      work: "tlg0008.tlg001", ref: "2.3", label: "Eubulus, quoted by Athenaeus 2.36b–c",
      grc: "τρεῖς γὰρ μόνους κρατῆρας ἐγκεραννύω\nτοῖς εὖ φρονοῦσι· τὸν μὲν ὑγιείας ἕνα,\nὃν πρῶτον ἐκπίνουσι· τὸν δὲ δεύτερον\nἔρωτος ἡδονῆς τε· τὸν τρίτον δ’ ὕπνου,\nὃν ἐκπιόντες οἱ σοφοὶ κεκλημένοι\nοἴκαδε βαδίζουσ᾽.",
      tr: "For sensible people I mix just three bowls: one for health, which they drink first; the second for love and pleasure; the third for sleep, and when they have drunk it, the wise guests go home.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "7th–6th c. BC", what: "Archilochus, Alcaeus, Anacreon and Theognis compose songs for the symposium.", certainty: "well" },
    { when: "6th–5th c. BC", what: "Athenian potters make the great series of painted drinking cups.", certainty: "well" },
    { when: "416 BC", what: "Agathon's victory party, the setting of Plato's Symposium.", certainty: "well" },
    { when: "4th c. BC", what: "Plato and Xenophon write their Symposia; Eubulus writes comedy.", certainty: "well" },
    { when: "c. AD 200", what: "Athenaeus gathers quotations about dining and drinking in the Deipnosophists.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0059.tlg011", ref: "176", to: "178", label: "Plato, Symposium 176a–178a", why: "How the evening's drinking and talking were agreed." },
    { work: "tlg0059.tlg011", ref: "212", to: "214", label: "Plato, Symposium 212c–214e", why: "Alcibiades arrives, drunk." },
    { work: "tlg0032.tlg004", ref: "1.1", to: "2.8", label: "Xenophon, Symposium 1–2", why: "A party with a hired troupe of entertainers." },
  ],
  related: ["black-and-red-figure"],
  primary: [
    { work: "tlg0059.tlg011", ref: "176", to: "212", label: "Plato, Symposium" },
    { work: "tlg0016.tlg001", ref: "6.84.1", to: "6.84.3", label: "Herodotus 6.84" },
    { work: "tlg0008.tlg001", ref: "2.3", label: "Athenaeus 2.36b–c" },
    { work: "tlg0008.tlg001", ref: "15.2", to: "15.4", label: "Athenaeus 15, on kottabos" },
  ],
  secondary: [
    { id: "murray-sympotica", note: "The foundational collection of essays." },
    { id: "lissarrague-banquet", note: "The symposium as the painted cups show it." },
  ],
  written: "2026-09-27",
};
export default entry;
