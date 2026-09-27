import type { Entry } from "../types";

const entry: Entry = {
  slug: "mycenae",
  title: "Mycenae, rich in gold",
  greek: "Μυκῆναι",
  category: "archaeology",
  kicker: "Homer's city of Agamemnon, and the graves Schliemann opened in 1876",
  image: "mask-of-agamemnon",
  hook: `Homer called Mycenae "rich in gold". By the time Greek travellers came looking, it was a hilltop of ruins: a gate crowned with lions, walls of enormous stones, and graves that the local guides named after Agamemnon and his murdered companions. In 1876 a self-made millionaire, Heinrich Schliemann, dug inside the walls because a guidebook written seventeen centuries earlier told him Agamemnon lay there. He found graves full of gold, and gold masks over the faces of the dead. He had found kings, but not Agamemnon: the graves are centuries older than any Trojan War.`,
  body: `## Rich in gold

In the *Iliad*, Mycenae is Agamemnon's city, and its fixed epithet is *polychrysos*, "of much gold". When he arms for battle the goddesses thunder in his honour:

{{quote:gold}}

The historian Thucydides, writing in the fifth century BC, already had to explain why the leader of all the Greeks came from such a small place. His answer is still the first lesson of archaeology: ruins are a poor measure of power.

{{quote:small}}

{debated} Whether any real war lies behind Homer's Trojan War, and whether a king of Mycenae ever led it, is still argued. What archaeology can say is that Mycenae was, for several centuries of the Late Bronze Age, one of the richest places in Greece.

## What the Greeks saw

Mycenae did not end with the Bronze Age. It was still an independent town in 480 BC, when it sent [eighty men to Thermopylae](cts:tlg0016.tlg001:7.202.1). The historian Diodorus tells what followed: the Argives, who had stayed out of the war and resented their neighbour's old pride, [besieged Mycenae, took it, enslaved its people and razed the town](cts:tlg0060.tlg001:11.65.1-11.65.5), in the archon year 468/7 BC.

The geographer Strabo, writing under Augustus, believed nothing was left at all:

{{quote:trace}}

{well} He was wrong. The travel writer Pausanias, who actually went there in the second century AD, found much of the circuit wall still standing, and its gate:

{{quote:lions}}

{legend} The walls, he adds, were said to be the work of the Cyclopes, the giants who built the walls of Tiryns: stones that big seemed beyond human strength. Archaeologists still call such masonry "Cyclopean". Pausanias was also shown the graves of Atreus, of Agamemnon, of his charioteer, of Cassandra's twin sons, all murdered by Aegisthus at the homecoming feast, and he notes where the murderers themselves were buried:

{{quote:graves}}

## Schliemann digs inside the walls

{well} Heinrich Schliemann, a German businessman who had made a fortune in trade and had already dug at Troy, came to Mycenae in 1876 convinced that Homer's heroes were real. He took Pausanias' "within the wall" to mean the wall of the citadel, and dug just inside the Lion Gate. Between August and December he uncovered a circle of upright stone slabs enclosing deep, rock-cut shaft graves: the burial ground now called **Grave Circle A**. The graves held astonishingly rich burials: gold cups and jewellery, bronze daggers inlaid with gold and silver, and, over the faces of some of the dead, masks of beaten gold.

{well} Schliemann was not alone. The Greek state sent an official, the ephor of antiquities Panagiotis Stamatakis, to supervise him. Stamatakis recorded each of the six graves, the condition of the bones and the objects one by one where they lay, took the finds to Athens, and in 1877 finished the sixth grave himself. His diary has since corrected several of Schliemann's more colourful claims, and his careful work, long overshadowed by Schliemann's fame and hostility, is now recognised as pioneering.

!! The mask on this page, found in Grave V, has been called the "Mask of Agamemnon" ever since. Schliemann is often said to have telegraphed "I have gazed on the face of Agamemnon", but the story is not reliably attested, and he himself never identified this mask as Agamemnon's.

## Too early for Agamemnon

{well} The shaft graves were soon shown to be far older than Schliemann hoped. They belong to the sixteenth century BC, at least three hundred years before any date that ancient or modern writers have proposed for a Trojan War. In 1951 a second, still older circle of graves, **Grave Circle B**, was found by chance outside the walls, while work was going on at the great beehive-shaped tomb that local tradition called the "Tomb of Clytemnestra"; its burials go back to the late seventeenth century BC.

{well} The walls and the Lion Gate that Pausanias saw, and that stand today, came later, in the palace's last great age in the thirteenth century BC. When the wall was built, the old grave circle was brought inside it and kept as a monument, which is why Schliemann found royal graves "within the wall". Pausanias' guides were right that great men lay there; they were wrong about who.

{well} Around 1200 BC the palace on the summit was destroyed by fire, like other Mycenaean palaces. Mycenae has also yielded clay tablets in [Linear B](wiki:linear-b), the earliest written Greek: records kept by its administrators, which survive, as at Pylos and Knossos, because fire baked the clay hard. People went on living at Mycenae, on a smaller scale, until the Argives ended it.

## Can we trust Schliemann?

{debated} Schliemann rewrote his own life in his books and diaries, and historians, above all David Traill, have shown how freely he did so. That has raised doubts about his finds too. In 1999 the classicist William M. Calder III argued in *Archaeology* magazine that Schliemann could have had the famous mask made; in the same issue Katie Demakopoulou set out the case for its authenticity, and Kenneth Lapatin suggested that it might have been reworked rather than forged. The mask is still studied and shown as a genuine find from Grave V, but the debate shows how much the careful records of men like Stamatakis matter.

{{timeline}}`,
  quotes: {
    gold: {
      work: "tlg0012.tlg001", ref: "11.46", label: "Homer, Iliad 11.45–46",
      grc: "τιμῶσαι βασιλῆα πολυχρύσοιο Μυκήνης.",
      tr: "doing honour to the king of Mycenae, rich in gold.",
      trFrom: "corpus", trBy: "A. T. Murray (1924)",
    },
    small: {
      work: "tlg0003.tlg001", ref: "1.10.2", label: "Thucydides 1.10.2",
      grc: "Λακεδαιμονίων γὰρ εἰ ἡ πόλις ἐρημωθείη, λειφθείη δὲ τά τε ἱερὰ καὶ τῆς κατασκευῆς τὰ ἐδάφη, πολλὴν ἂν οἶμαι ἀπιστίαν τῆς δυνάμεως προελθόντος πολλοῦ χρόνου τοῖς ἔπειτα πρὸς τὸ κλέος αὐτῶν εἶναι",
      tr: "For if the city of the Lacedaemonians should be deserted, and nothing should be left of it but its temples and the foundations of its other buildings, posterity would, I think, after a long lapse of time, be very loath to believe that their power was as great as their renown.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    trace: {
      work: "tlg0099.tlg001", ref: "8.6.10", label: "Strabo 8.6.10",
      grc: "χρόνοις δʼ ὕστερον κατεσκάφησαν ὑπʼ Ἀργείων ὥστε νῦν μηδʼ ἴχνος εὑρίσκεσθαι τῆς Μυκηναίων πόλεως.",
      tr: "But in later times Mycenae was razed to the ground by the Argives, so that today not even a trace of the city of the Mycenaeans is to be found.",
      trFrom: "corpus", trBy: "H. L. Jones (1927)",
    },
    lions: {
      work: "tlg0525.tlg001", ref: "2.16.5", label: "Pausanias 2.16.5",
      grc: "λείπεται δὲ ὅμως ἔτι καὶ ἄλλα τοῦ περιβόλου καὶ ἡ πύλη, λέοντες δὲ ἐφεστήκασιν αὐτῇ·",
      tr: "There still remain, however, parts of the city wall, including the gate, upon which stand lions.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1918)",
    },
    graves: {
      work: "tlg0525.tlg001", ref: "2.16.7", label: "Pausanias 2.16.7",
      grc: "Κλυταιμνήστρα δὲ ἐτάφη καὶ Αἴγισθος ὀλίγον ἀπωτέρω τοῦ τείχους· ἐντὸς δὲ ἀπηξιώθησαν, ἔνθα Ἀγαμέμνων τε αὐτὸς ἔκειτο καὶ οἱ σὺν ἐκείνῳ φονευθέντες.",
      tr: "Clytemnestra and Aegisthus were buried at some little distance from the wall. They were thought unworthy of a place within it, where lay Agamemnon himself and those who were murdered with him.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1918)",
    },
  },
  timeline: [
    { when: "late 17th c. BC", what: "The first burials in Grave Circle B.", certainty: "well" },
    { when: "16th c. BC", what: "The shaft graves of Grave Circle A, with their gold masks.", certainty: "well" },
    { when: "13th c. BC", what: "The Lion Gate and the great walls; the old grave circle is brought inside them.", certainty: "well" },
    { when: "c. 1200 BC", what: "The palace is destroyed by fire.", certainty: "well" },
    { when: "480 BC", what: "Eighty Mycenaeans fight at Thermopylae.", certainty: "well" },
    { when: "468/7 BC", what: "Argos takes Mycenae, enslaves its people and razes the town (Diodorus).", certainty: "well" },
    { when: "2nd c. AD", what: "Pausanias sees the walls, the Lion Gate and the graves.", certainty: "well" },
    { when: "1876", what: "Schliemann excavates Grave Circle A, supervised by Panagiotis Stamatakis.", certainty: "well" },
    { when: "1877", what: "Stamatakis completes the sixth shaft grave.", certainty: "well" },
    { when: "1951", what: "Grave Circle B is found by chance.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0525.tlg001", ref: "2.15.4", to: "2.16.7", label: "Pausanias 2.15–16", why: "The road to Mycenae, its founding legends, and the ruins as a visitor saw them." },
    { work: "tlg0003.tlg001", ref: "1.9.1", to: "1.11.2", label: "Thucydides 1.9–11", why: "Agamemnon's power, and why ruins mislead." },
    { work: "tlg0060.tlg001", ref: "11.65.1", to: "11.65.5", label: "Diodorus 11.65", why: "How Argos destroyed Mycenae." },
  ],
  related: ["linear-b", "kerameikos"],
  places: ["570491"],
  primary: [
    { work: "tlg0012.tlg001", ref: "11.45", to: "11.46", label: "Homer, Iliad 11.45–46" },
    { work: "tlg0003.tlg001", ref: "1.10.1", to: "1.10.2", label: "Thucydides 1.10" },
    { work: "tlg0016.tlg001", ref: "7.202.1", label: "Herodotus 7.202" },
    { work: "tlg0060.tlg001", ref: "11.65.1", to: "11.65.5", label: "Diodorus 11.65" },
    { work: "tlg0099.tlg001", ref: "8.6.10", label: "Strabo 8.6.10" },
    { work: "tlg0525.tlg001", ref: "2.16.5", to: "2.16.7", label: "Pausanias 2.16.5–7" },
  ],
  secondary: [
    { id: "french-mycenae", note: "The site and its history, by one of its excavators." },
    { id: "dickinson-aegean", note: "The Bronze Age world Mycenae belonged to." },
    { id: "gere-tomb-agamemnon", note: "Schliemann's dig and what the modern world made of it." },
    { id: "traill-schliemann", note: "How far Schliemann can be trusted." },
    { id: "papazoglou-2009", note: "Stamatakis' records and the people of Shaft Grave VI." },
    { id: "harrington-1999", note: "The debate over the mask's authenticity." },
  ],
  written: "2026-09-27",
};
export default entry;
