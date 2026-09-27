import type { Entry } from "../types";

const entry: Entry = {
  slug: "troy",
  title: "Troy at Hisarlik",
  greek: "Ἴλιος",
  category: "archaeology",
  kicker: "Homer's sacred Ilios, the Greek town that claimed to be it, and the mound of many cities",
  image: "troy-schliemann-trench",
  hook: `For Homer, Troy was "sacred Ilios", the city whose fall everyone in the *Iliad* knows is coming. In historical times a small Greek town called Ilion stood on a mound near the mouth of the Dardanelles and claimed to be that city; Xerxes and Alexander both climbed it to sacrifice. Ancient scholars already doubted the claim. In the 1860s and 1870s Frank Calvert and Heinrich Schliemann dug into the mound, now called Hisarlik, and found not one city but many, one on top of another, over more than three thousand years. Which of them, if any, is Homer's Troy is still argued.`,
  body: `## Sacred Ilios

In the *Iliad*, Hector, leaving his wife Andromache and their baby son to go back to the fighting, says what the whole poem knows:

{{quote:ilios}}

## The town that claimed to be Troy

{well} A Greek town called Ilion flourished on the site through the Classical, Hellenistic and Roman periods, with a temple of Athena of Ilion, and it traded on the name. When the Persian king Xerxes marched to invade Greece in 480 BC, he went out of his way to see it:

{{quote:xerxes}}

{legend} A century and a half later Alexander the Great, crossing into Asia, did the same. Arrian tells that he [sacrificed to Athena of Ilion, dedicated his own armour in her temple, and took down in exchange some of the sacred arms said to survive from the Trojan War](cts:tlg0074.tlg001:1.11.7-1.11.8), which his shield-bearers afterwards carried before him into battle.

## Ancient doubts

{debated} Not everyone believed the Ilians. The scholar Demetrius of Scepsis, from the hills above the Trojan plain, remembered [visiting Ilion as a boy](cts:tlg0099.tlg001:13.1.27), when it was so neglected that its houses had no tiled roofs, and argued that Homer's city had stood elsewhere. Strabo, who follows him, reports the rival site:

{{quote:village}}

Strabo also cites [Hestiaea of Alexandria](cts:tlg0099.tlg001:13.1.36), a woman who wrote a book on the *Iliad* and asked whether the war could really have been fought around the Ilion of her own day. Modern archaeology has come down on the side of Ilion's own claim: Hisarlik was a great Bronze Age citadel.

## Calvert and Schliemann

{well} The mound's first excavator was Frank Calvert, from a British family settled in the Dardanelles, who bought part of the hill in 1864 and dug trial trenches there. When Heinrich Schliemann came looking for Troy in August 1868, Calvert convinced him that Hisarlik was the place. Schliemann had the money that Calvert lacked. He began digging in 1870 and later took most of the credit, treating Calvert badly in his books.

{well} Schliemann believed Homer's Troy must be the oldest city, at the bottom. He cut a vast trench across the middle of the mound, the one in the photograph, down through the layers, and in doing so destroyed much of the later levels, including remains from the Late Bronze Age, the period that the story of the Trojan War is usually thought to remember.

## Priam's Treasure

{well} In 1873 Schliemann found a hoard of gold and silver jewellery, cups and bronze, which he at once named "Priam's Treasure" and took out of the Ottoman Empire. It came from the level now called Troy II, of the Early Bronze Age, around 2550–2300 BC: some thousand years too early for any Priam. In 1881 the finds went to the Royal Museums of Berlin. In 1945, at the end of the Second World War, they were taken to Moscow; for decades their whereabouts were officially unknown, until in 1993 they were identified in the Pushkin Museum, where they remain.

## A mound of nine cities

{well} After Schliemann, his architect Wilhelm Dörpfeld, the American Carl Blegen and, from 1988, the German archaeologist Manfred Korfmann dug the site with better methods. They distinguished nine main settlements, Troy I (the earliest, around 3000 BC) to Troy IX (Roman), each built on the ruins of the last; most of the walls and gates visible today belong to Troy II and Troy VI. Korfmann's excavations revealed that a large lower town, about 30 hectares in the Late Bronze Age, spread south of the citadel. Troy has been a UNESCO World Heritage Site since 1998.

## Was there a Trojan War?

{debated} Homer composed his poems centuries after the Bronze Age, and almost no writing has been found at Troy itself. The candidates for his Troy are the Late Bronze Age cities, Troy VI and Troy VIIa, both of which ended in destruction. Hittite archives in Anatolia mention a western kingdom called Wilusa, which many scholars, among them Joachim Latacz, identify with (W)ilios. Eric Cline, weighing the evidence, concludes that a war or wars probably were fought around Troy in the Late Bronze Age; others think the *Iliad* tells us more about Homer's own time than about any real war. The mound can show that a great, fortified city stood here and burned; it cannot tell us about Helen.

{{timeline}}`,
  quotes: {
    ilios: {
      work: "tlg0012.tlg001", ref: "6.447", label: "Homer, Iliad 6.447–449",
      grc: "εὖ γὰρ ἐγὼ τόδε οἶδα κατὰ φρένα καὶ κατὰ θυμόν· ἔσσεται ἦμαρ ὅτʼ ἄν ποτʼ ὀλώλῃ Ἴλιος ἱρὴ καὶ Πρίαμος καὶ λαὸς ἐϋμμελίω Πριάμοιο.",
      tr: "For of a surety know I this in heart and soul: the day shall come when sacred Ilios shall be laid low, and Priam, and the people of Priam with goodly spear of ash.",
      trFrom: "corpus", trBy: "A. T. Murray (1924)",
    },
    xerxes: {
      work: "tlg0016.tlg001", ref: "7.43.2", label: "Herodotus 7.43",
      grc: "θεησάμενος δὲ καὶ πυθόμενος ἐκείνων ἕκαστα τῇ Ἀθηναίῃ τῇ Ἰλιάδι ἔθυσε βοῦς χιλίας, χοὰς δὲ οἱ Μάγοι τοῖσι ἥρωσι ἐχέαντο.",
      tr: "After he saw it and asked about everything there, he sacrificed a thousand cattle to Athena of Ilium, and the Magi offered libations to the heroes.",
      trFrom: "corpus", trBy: "A. D. Godley (1922)",
    },
    village: {
      work: "tlg0099.tlg001", ref: "13.1.35", label: "Strabo 13.1.35",
      grc: "ὑπὲρ δὲ τούτου μικρὸν ἡ τῶν Ἰλιέων κώμη ἐστίν, ἐν ᾗ νομίζεται τὸ παλαιὸν Ἴλιον ἱδρῦσθαι πρότερον, τριάκοντα σταδίους διέχον ἀπὸ τῆς νῦν πόλεως.",
      tr: "A little above this is the Village of the Ilians, where the ancient Ilium is thought to have been situated in earlier times, at a distance of thirty stadia from the present city.",
      trFrom: "corpus", trBy: "H. L. Jones (1929)",
    },
  },
  timeline: [
    { when: "c. 3000 BC", what: "Troy I, the first settlement on the mound.", certainty: "well" },
    { when: "c. 2550–2300 BC", what: "Troy II, the level of \"Priam's Treasure\".", certainty: "well" },
    { when: "Late Bronze Age", what: "Troy VI and VIIa, with a large lower town; the candidates for Homer's Troy.", certainty: "debated" },
    { when: "480 BC", what: "Xerxes sacrifices a thousand cattle to Athena of Ilion.", certainty: "well" },
    { when: "334 BC", what: "Alexander sacrifices at Ilion on his way into Asia.", certainty: "well" },
    { when: "1864", what: "Frank Calvert buys part of the mound and digs trial trenches.", certainty: "well" },
    { when: "1870", what: "Schliemann begins excavating.", certainty: "well" },
    { when: "1873", what: "Schliemann finds \"Priam's Treasure\".", certainty: "well" },
    { when: "1945", what: "The treasure is taken from Berlin to Moscow.", certainty: "well" },
    { when: "1988", what: "Manfred Korfmann's excavations begin.", certainty: "well" },
    { when: "1993", what: "The treasure is identified in the Pushkin Museum.", certainty: "well" },
    { when: "1998", what: "Troy becomes a UNESCO World Heritage Site.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0012.tlg001", ref: "6.390", to: "6.502", label: "Iliad 6.390–502", why: "Hector and Andromache at the Scaean Gate." },
    { work: "tlg0016.tlg001", ref: "7.42.1", to: "7.43.2", label: "Herodotus 7.42–43", why: "Xerxes at Troy." },
    { work: "tlg0099.tlg001", ref: "13.1.34", to: "13.1.36", label: "Strabo 13.1.34–36", why: "The ancient argument over where Homer's Troy stood." },
  ],
  related: ["mycenae", "homeric-similes", "reading-the-layers"],
  places: ["550595"],
  primary: [
    { work: "tlg0012.tlg001", ref: "6.447", to: "6.449", label: "Homer, Iliad 6.447–449" },
    { work: "tlg0016.tlg001", ref: "7.43.1", to: "7.43.2", label: "Herodotus 7.43" },
    { work: "tlg0074.tlg001", ref: "1.11.7", to: "1.11.8", label: "Arrian, Anabasis 1.11.7–8" },
    { work: "tlg0099.tlg001", ref: "13.1.27", label: "Strabo 13.1.27" },
    { work: "tlg0099.tlg001", ref: "13.1.35", to: "13.1.36", label: "Strabo 13.1.35–36" },
  ],
  secondary: [
    { id: "cline-trojan-war", note: "The evidence for and against a real war, briefly and fairly." },
    { id: "latacz-troy", note: "The case from the Hittite texts and Korfmann's excavations." },
    { id: "robinson-calvert", note: "Frank Calvert, Schliemann's overlooked partner." },
    { id: "traill-schliemann", note: "Schliemann at Troy, and the treasure." },
  ],
  written: "2026-09-28",
};
export default entry;
