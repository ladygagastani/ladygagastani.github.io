import type { Entry } from "../types";

const entry: Entry = {
  slug: "laurion",
  title: "The silver of Laurion",
  greek: "Λαύρειον",
  category: "dark",
  kicker: "The mines that paid for Athens' fleet, and the slaves who worked them",
  image: "athenian-owl",
  hook: `The fleet that beat the Persians at Salamis in 480 BC was paid for with silver dug out of the hills of southern Attica. So were the owl coins that carried Athens' name across the Mediterranean, and much of the wealth of its richest men. The digging was done by enslaved people, rented out by the hundred at an obol a day, in shafts and galleries that can still be walked into today.`,
  body: `## A strike of silver

The hills of Laurion, at the south-eastern tip of Attica, had been mined so long that Xenophon, writing in the fourth century BC, says that [no one even tries to say when mining began](cts:tlg0032.tlg011:4.2). In the 480s BC the miners struck a richer vein, at a place called Maroneia, and the city suddenly had a surplus.

{{quote:athpol}}

Herodotus tells the same story, with different numbers. Each citizen was about to receive ten drachmas when Themistocles persuaded the Athenians to spend the money on ships instead.

{{quote:hdt}}

{debated} The two accounts disagree on the size of the fleet: a hundred ships in the *Constitution of the Athenians*, two hundred in Herodotus. Both agree that the new ships were built for a war with the neighbouring island of Aegina, and that they fought at Salamis in 480 BC.

## Who dug it

Almost everything we know about the labour force comes from a pamphlet Xenophon wrote in the 350s BC, *Ways and Means*, proposing ways for Athens to raise money. He takes the facts of mine slavery for granted, and that is what makes them chilling.

{{quote:nicias}}

The general Nicias rented his thousand slaves to a Thracian contractor. The contractor paid Nicias an obol a day for each man and had to [keep the number always the same](cts:tlg0032.tlg011:4.14): whoever died or ran away was replaced at the contractor's cost. Hipponicus rented out [six hundred on the same terms, and Philemonides three hundred](cts:tlg0032.tlg011:4.15).

!! Xenophon's plan for the mines was for the city to do what the rich were doing: buy slaves with public money and rent them out, [until there were three for every citizen](cts:tlg0032.tlg011:4.17).

{well} Mining at Laurion was slave labour on an industrial scale. The owners, the contractors and the men who profited are named in the sources; the miners themselves are not.

## Escape

In 413 BC the Spartans fortified Decelea, in the hills north of Athens, and held it for the rest of the war. Thucydides counts one of the consequences: [more than twenty thousand slaves deserted](cts:tlg0003.tlg001:7.27.5), most of them skilled workers.

{debated} Thucydides does not say where these slaves came from. Many historians think that a large share were miners from Laurion; others point out that he calls most of them craftsmen, and that the figure is the kind of round number ancient historians used.

## What the ground still shows

The Laurion district is still scarred by ancient mining: vertical shafts, galleries following the veins, and the workshops where the ore was crushed and washed before smelting. The washeries, with their channels, settling basins and cisterns, recycled the scarce water of this dry corner of Attica. Several can be seen at Thorikos and in the valleys around it.

{{timeline}}`,
  quotes: {
    athpol: {
      work: "tlg0086.tlg003", ref: "22.7", label: "Constitution of the Athenians 22.7",
      grc: "ὡς ἐφάνη τὰ μέταλλα τὰ ἐν Μαρωνείᾳ, καὶ περιεγένετο τῇ πόλει τάλαντα ἑκατὸν ἐκ τῶν ἔργων, συμβουλευόντων τινῶν τῷ δήμῳ διανείμασθαι τὸ ἀργύριον, Θεμιστοκλῆς ἐκώλυσεν",
      tr: "when the mines at Maroneia came to light and the city had a hundred talents left over from the workings, and some were advising the people to share out the silver, Themistocles stopped it",
      trFrom: "site", trBy: "this site",
    },
    hdt: {
      work: "tlg0016.tlg001", ref: "7.144.1", label: "Herodotus 7.144",
      grc: "τότε Θεμιστοκλέης ἀνέγνωσε Ἀθηναίους τῆς διαιρέσιος ταύτης παυσαμένους νέας τούτων τῶν χρημάτων ποιήσασθαι διηκοσίας ἐς τὸν πόλεμον, τὸν πρὸς Αἰγινήτας λέγων.",
      tr: "Themistocles persuaded the Athenians to make no such division but to use the money to build two hundred ships for the war, that is, for the war with Aegina.",
      trFrom: "corpus", trBy: "A. D. Godley (1922)",
    },
    nicias: {
      work: "tlg0032.tlg011", ref: "4.14", label: "Xenophon, Ways and Means 4.14",
      grc: "Νικίας ποτὲ ὁ Νικηράτου ἐκτήσατο ἐν τοῖς ἀργυρείοις χιλίους ἀνθρώπους",
      tr: "Nicias son of Niceratus, once owned a thousand men in the mines",
      trFrom: "corpus", trBy: "E. C. Marchant (1925)",
    },
  },
  timeline: [
    { when: "483/2 BC", what: "The strike at Maroneia; Themistocles persuades Athens to build a fleet with the silver.", certainty: "well" },
    { when: "480 BC", what: "The new fleet fights at Salamis.", certainty: "well" },
    { when: "413 BC", what: "The Spartans fortify Decelea; more than twenty thousand slaves desert.", certainty: "well" },
    { when: "c. 355 BC", what: "Xenophon's Ways and Means proposes that the city itself buy and rent out mine slaves.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0032.tlg011", ref: "4.1", to: "4.52", label: "Xenophon, Ways and Means 4", why: "The mines, the slave-rental business, and a plan to grow it." },
    { work: "tlg0016.tlg001", ref: "7.144.1", to: "7.144.3", label: "Herodotus 7.144", why: "The silver fleet, as Herodotus heard it." },
    { work: "tlg0086.tlg003", ref: "22.7", label: "Constitution of the Athenians 22.7", why: "The same story, with a hundred ships." },
  ],
  related: ["ostracism", "melos"],
  primary: [
    { work: "tlg0086.tlg003", ref: "22.7", label: "Constitution of the Athenians 22.7" },
    { work: "tlg0016.tlg001", ref: "7.144.1", to: "7.144.3", label: "Herodotus 7.144" },
    { work: "tlg0032.tlg011", ref: "4.1", to: "4.52", label: "Xenophon, Ways and Means 4" },
    { work: "tlg0003.tlg001", ref: "7.27.5", label: "Thucydides 7.27.5" },
  ],
  secondary: [
    { id: "lauffer-bergwerkssklaven", note: "The fundamental study of the mine slaves." },
    { id: "conophagos-laurium", note: "The mines, the washeries and the technology, by a mining engineer." },
    { id: "rhodes-ath-pol" },
  ],
  written: "2026-09-27",
};
export default entry;
