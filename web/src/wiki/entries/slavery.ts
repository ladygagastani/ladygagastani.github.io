import type { Entry } from "../types";

const entry: Entry = {
  slug: "slavery",
  title: "Slavery",
  greek: "ἡ δουλεία",
  category: "dark",
  kicker: "Bought, captured, born or kidnapped: the people Greek freedom rested on",
  image: "stele-woman-and-servant",
  hook: `Greek cities had slaves, and classical Athens, the city that invented democracy, had a great many. They worked in houses, fields, workshops and mines; they were bought at market, taken in war or born to slave mothers; by law their evidence in court had to be taken under torture. Aristotle called a slave "a live article of property", and yet he also recorded that some Greeks thought slavery unjust. A few slaves won their freedom and even citizenship; one runaway on Chios became a hero to whom masters sacrificed. This is what the sources say, told plainly.`,
  body: `## "A live article of property"

Aristotle's *Politics* begins with the household, and so with its slaves. A household needs tools, he argues, some lifeless and some living, and the slave is one of the living ones.

{{quote:tool}}

He then imagines a world where slavery would be unnecessary: if tools could work on their own, like the self-moving tripods of the god Hephaestus in Homer, "if thus shuttles wove and quills played harps of themselves, master-craftsmen would have no need of assistants and masters no need of slaves".

Aristotle knew that his view was not the only one. In the same passage he reports the opposite opinion:

{{quote:against}}

He answered it with his theory of the "natural slave", a person made by nature to be ruled, [which he sets out a little later](cts:tlg0086.tlg035:1.1254b-1.1255a). The argument has troubled readers ever since, not least because Aristotle himself concedes that [some who were slaves were not slaves by nature](cts:tlg0086.tlg035:1.1255b).

## Half a man

The oldest Greek poetry already knows what slavery does. In the *Odyssey*, the swineherd Eumaeus, himself a slave, says it as he watches the old dog Argos lying neglected:

{{quote:half}}

Eumaeus was a king's son, kidnapped as a small child by a slave-woman of his father's and [sold by Phoenician traders](cts:tlg0012.tlg002:15.403-15.484) to Odysseus' father. Capture in war, piracy and sale were how most slaves were made. When Athens took the island of Melos in 416 BC it [killed the men and sold the women and children](wiki:melos).

## Bought for silver

The historian Theopompus, quoted by Athenaeus, drew a line between two kinds of slavery. The Spartans and Thessalians had enslaved the Greeks whose land they had taken (at Sparta these were the [helots](wiki:helots)); the people of Chios, he said, were the first Greeks to buy foreigners.

{{quote:chios}}

A slave had a price like any property: Demosthenes' father owned [a workshop of sword-makers](wiki:household), most of them valued at five or six minas each.

## How many?

Nobody knows how many slaves there were. The best-known ancient figure for Athens comes from a lost chronicle by Ctesicles, again quoted by Athenaeus, reporting a count of the inhabitants of Attica made under Demetrius of Phalerum, who governed Athens at the end of the 4th century BC:

{{quote:census}}

{debated} Twenty-one thousand citizens and four hundred thousand slaves cannot both be right as a head count. Jean Andreau and Raymond Descat have suggested that the census counted everyone in the households, which later writers misread as slaves; even that, as their reviewer Peter Hunt remarks, would imply 200,000 to 250,000 slaves, "a suspiciously high number even for the peak of Athens' fifth-century empire". Modern estimates differ widely, and every one of them is a reconstruction.

## Everywhere at work

Slaves did almost every kind of work. They kept house, as on the gravestone at the top of this page, where a maid carved at half her mistress's size holds out a box; they farmed, made swords and furniture, and dug the silver mines of [Laurion](wiki:laurion). When the Spartans fortified Decelea in Attica in 413 BC, [more than twenty thousand Athenian slaves ran away](cts:tlg0003.tlg001:7.27.5) to them. The city itself owned slaves: the man who ground the hemlock for condemned prisoners was [a public slave](wiki:drugs-and-poisons).

## Evidence under torture

In an Athenian court a slave could not simply testify. The evidence of a slave was taken under torture, *basanos*, and litigants loved to claim that this was the surest proof of all.

{{quote:torture}}

{debated} How often it actually happened is another question. Speakers constantly challenge their opponents to hand over their slaves for torture, and the challenges are nearly always refused. Michael Gagarin has argued that the challenge was mainly a courtroom tactic, and that torture for evidence was rarely if ever carried out.

## Freedom

Slaves could be freed, and a few rose high. Pasion began as the slave of [two bankers, Antisthenes and Archestratus](cts:tlg0014.tlg036:43), became a rich banker himself, and was made an Athenian citizen. His own slave Phormio was freed in turn, [leased the bank and a shield workshop](cts:tlg0014.tlg036:4) from him, and under the terms of Pasion's will [married his widow](cts:tlg0014.tlg036:8). When Pasion's son sued Phormio, Phormio's advocate reminded the jury that [Pasion too had once belonged to someone](cts:tlg0014.tlg036:48).

## The kindly hero

The strangest story comes from Chios, told by Nymphodorus of Syracuse and preserved by Athenaeus. Runaway slaves lived in the island's rugged hills, raiding their masters' farms. One of them, Drimakos, took command of the rest like a king. He made a treaty with the Chians: he would take from their storehouses only what he needed, by his own weights and measures, and would send back any runaway who had no good reason to flee. When he grew old, with a price on his head, he persuaded a young friend to cut it off and claim the reward. After his death the raids began again.

{{quote:hero}}

{legend} Sara Forsdyke reads the story as a tale told among slaves themselves, about a just leader who could make even masters bargain. Whether Drimakos ever lived, we cannot say; that the slaves of Chios were many, harshly punished and quick to run away when they could, [Thucydides also reports](cts:tlg0003.tlg001:8.40.2).

{{timeline}}`,
  quotes: {
    tool: {
      work: "tlg0086.tlg035", ref: "1.1253b", label: "Aristotle, Politics 1.1253b",
      grc: "οὕτω καὶ τὸ κτῆμα ὄργανον πρὸς ζωήν ἐστι, καὶ ἡ κτῆσις πλῆθος ὀργάνων ἐστί, καὶ ὁ δοῦλος κτῆμά τι ἔμψυχον,",
      tr: "so also an article of property is a tool for the purpose of life, and property generally is a collection of tools, and a slave is a live article of property.",
      trFrom: "corpus", trBy: "H. Rackham (1944)",
    },
    against: {
      work: "tlg0086.tlg035", ref: "1.1253b", label: "Aristotle, Politics 1.1253b",
      grc: "τοῖς δὲ παρὰ φύσιν τὸ δεσπόζειν (νόμῳ γὰρ τὸν μὲν δοῦλον εἶναι τὸν δʼ ἐλεύθερον, φύσει δʼ οὐθὲν διαφέρειν)· διόπερ οὐδὲ δίκαιον· βίαιον γάρ.",
      tr: "others however maintain that for one man to be another man’s master is contrary to nature, because it is only convention that makes the one a slave and the other a freeman and there is no difference between them by nature, and that therefore it is unjust, for it is based on force.",
      trFrom: "corpus", trBy: "H. Rackham (1944)",
    },
    half: {
      work: "tlg0012.tlg002", ref: "17.322", label: "Homer, Odyssey 17.322–323",
      grc: "ἥμισυ γάρ τʼ ἀρετῆς ἀποαίνυται εὐρύοπα Ζεὺς\nἀνέρος, εὖτʼ ἄν μιν κατὰ δούλιον ἦμαρ ἕλῃσιν.",
      tr: "for Zeus, whose voice is borne afar, takes away half his worth from a man, when the day of slavery comes upon him.",
      trFrom: "corpus", trBy: "A. T. Murray (1919)",
    },
    chios: {
      work: "tlg0008.tlg001", ref: "6.88", label: "Theopompus, quoted by Athenaeus 6.265b–c",
      grc: "Λακεδαιμόνιοι μὲν γὰρ καὶ Θετταλοὶ φανήσονται κατασκευασάμενοι τὴν δουλείαν ἐκ τῶν Ἑλλήνων τῶν οἰκούντων πρότερον τὴν χώραν ἣν ἐκεῖνοι νῦν ἔχουσιν, οἱ μὲν Ἀχαιῶν, Θετταλοὶ δὲ Περραιβῶν καὶ Μαγνήτων, καὶ προσηγόρευσαν τοὺς καταδουλωθέντας οἳ μὲν εἵλωτας, οἳ δὲ πενέστας. Χῖοι δὲ βαρβάρους κέκτηνται τοὺς οἰκέτας καὶ τιμὴν αὐτῶν καταβάλλοντες.",
      tr: "for the Lacedæmonians and the Thessalians will be found to have derived their slaves from Greek tribes, who formerly inhabited the country which they now possess: the one having Achean slaves, but the Thessalians having Perrhæbian and Magnesian slaves; and the one nation called their slaves Helots, and the others called them Penestæ. But the Chians have barbarian slaves, and they have bought them at a price.",
      trFrom: "corpus", trBy: "C. D. Yonge (1854)",
    },
    census: {
      work: "tlg0008.tlg001", ref: "6.103", label: "Ctesicles, quoted by Athenaeus 6.272c",
      grc: "Ἀθήνησιν ἐξετασμὸν γενέσθαι ὑπὸ Δημητρίου τοῦ Φαληρέως τῶν κατοικούντων τὴν Ἀττικὴν καὶ εὑρεθῆναι Ἀθηναίους μὲν δισμυρίους πρὸς τοῖς χιλίοις, μετοίκους δὲ μυρίους, οἰκετῶν δὲ μυριάδας μʹ.",
      tr: "there was an investigation at Athens conducted by Demetrius Phalereus into the number of the inhabitants of Attica, and the Athenians were found to amount, to twenty-one thousand, and the Metics to ten thousand, and the slaves to four hundred thousand.",
      trFrom: "corpus", trBy: "C. D. Yonge (1854)",
    },
    torture: {
      work: "tlg0017.tlg008", ref: "12", label: "Isaeus 8.12",
      grc: "ὑμεῖς μὲν τοίνυν καὶ ἰδίᾳ καὶ δημοσίᾳ βάσανον ἀκριβέστατον ἔλεγχον νομίζετε· καὶ ὁπόταν δοῦλοι καὶ ἐλεύθεροι παραγένωνται καὶ δέῃ εὑρεθῆναί τι τῶν ζητουμένων, οὐ χρῆσθε ταῖς τῶν ἐλευθέρων μαρτυρίαις, ἀλλὰ τοὺς δούλους βασανίζοντες, οὕτω ζητεῖτε εὑρεῖν τὴν ἀλήθειαν τῶν γεγενημένων.",
      tr: "You Athenians hold the opinion that both in public and in private matters examination under torture is the most searching test; and so, when you have slaves and free men before you and it is necessary that some contested point should be cleared up, you do not employ the evidence of free men but seek to establish the truth about the facts by putting the slaves to torture.",
      trFrom: "corpus", trBy: "E. S. Forster (1927)",
    },
    hero: {
      work: "tlg0008.tlg001", ref: "6.90", label: "Nymphodorus, quoted by Athenaeus 6.265d–266e",
      grc: "καὶ οἱ Χῖοι πάλιν ὑπὸ τῶν οἰκετῶν ἀδικούμενοι καὶ διαρπαζόμενοι μνησθέντες τῆς τοῦ τετελευτηκότος ἐπιεικείας ἡρῷον ἱδρύσαντο κατὰ τὴν χώραν καὶ ἐπωνόμασαν ἥρωος εὐμενοῦς· καὶ αὐτῷ ἔτι καὶ νῦν οἱ δραπέται ἀποφέρουσιν ἀπαρχὰς πάντων ὧν ἂν ἕλωνται.",
      tr: "And the Chians, being again injured and plundered by their slaves, remembering the moderation of him who was dead, erected a Heroum in their country, and called it the shrine of the GENTLE HERO. And even now the runaway slaves bring to that shrine the first-fruits of all the plunder they get;",
      trFrom: "corpus", trBy: "C. D. Yonge (1854)",
    },
  },
  timeline: [
    { when: "c. 700 BC", what: "The Odyssey: Eumaeus, a king's son sold into slavery.", certainty: "legend" },
    { when: "416 BC", what: "Athens enslaves the women and children of Melos.", certainty: "well" },
    { when: "413 BC", what: "More than twenty thousand slaves flee Attica to the Spartans at Decelea.", certainty: "well" },
    { when: "412–411 BC", what: "The slaves of Chios desert to the Athenians in large numbers.", certainty: "well" },
    { when: "4th c. BC", what: "Pasion, a former slave, becomes Athens' richest banker and a citizen.", certainty: "well" },
    { when: "later 4th c. BC", what: "Aristotle's Politics: the slave as 'a live article of property'.", certainty: "well" },
    { when: "late 4th c. BC", what: "The count under Demetrius of Phalerum, with its impossible 400,000 slaves.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0086.tlg035", ref: "1.1253b", to: "1.1255b", label: "Aristotle, Politics 1.1253b–1255b", why: "The case for 'natural' slavery, and the case against it." },
    { work: "tlg0012.tlg002", ref: "15.403", to: "15.484", label: "Homer, Odyssey 15.403–484", why: "Eumaeus tells how he was kidnapped and sold." },
    { work: "tlg0008.tlg001", ref: "6.88", to: "6.90", label: "Athenaeus 6.265b–266e", why: "The Chians, their bought slaves, and Drimakos." },
    { work: "tlg0014.tlg036", ref: "43", to: "48", label: "Demosthenes 36.43–48", why: "Two freed slaves who became rich men, and a son who would not forget it." },
  ],
  related: ["helots", "laurion", "melos", "household"],
  primary: [
    { work: "tlg0086.tlg035", ref: "1.1253b", to: "1.1255a", label: "Aristotle, Politics 1.1253b–1255a" },
    { work: "tlg0012.tlg002", ref: "17.320", to: "17.323", label: "Homer, Odyssey 17.320–323" },
    { work: "tlg0012.tlg002", ref: "15.403", to: "15.484", label: "Homer, Odyssey 15.403–484" },
    { work: "tlg0008.tlg001", ref: "6.88", to: "6.90", label: "Athenaeus 6.265b–266e" },
    { work: "tlg0008.tlg001", ref: "6.103", label: "Athenaeus 6.272c–d" },
    { work: "tlg0017.tlg008", ref: "12", label: "Isaeus 8.12" },
    { work: "tlg0014.tlg036", ref: "4", to: "8", label: "Demosthenes 36.4–8" },
    { work: "tlg0014.tlg036", ref: "43", label: "Demosthenes 36.43" },
    { work: "tlg0014.tlg036", ref: "48", label: "Demosthenes 36.48" },
    { work: "tlg0003.tlg001", ref: "7.27.5", label: "Thucydides 7.27.5" },
    { work: "tlg0003.tlg001", ref: "8.40.2", label: "Thucydides 8.40.2" },
  ],
  secondary: [
    { id: "hunt-slavery", note: "A clear modern introduction to Greek and Roman slavery." },
    { id: "andreau-descat-slave", note: "Slavery in Greece and Rome, with a high reading of the Athenian numbers." },
    { id: "gagarin-torture", note: "The case that the torture of slaves for evidence was mostly a courtroom tactic." },
    { id: "forsdyke-slaves-tell-tales", note: "The Drimakos story, read as a tale told by slaves." },
  ],
  written: "2026-09-30",
};
export default entry;
