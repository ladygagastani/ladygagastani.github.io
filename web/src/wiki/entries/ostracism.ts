import type { Entry } from "../types";

const entry: Entry = {
  slug: "ostracism",
  title: "Ostracism",
  greek: "ὀστρακισμός",
  category: "democracy",
  kicker: "Voting a man out of Athens for ten years, on a broken pot",
  image: "themistocles-ostraka",
  hook: `Once a year the citizens of Athens could decide to hold a strange election. No one was charged and no one was tried. Each voter scratched a name on a broken piece of pottery, an *ostrakon*, and the man named most often had to leave the city for ten years. Thousands of those sherds have come out of the ground, and some of them still show who wrote them in a hurry, and who wrote them in bulk.`,
  body: `## A law against tyrants

The *Constitution of the Athenians*, written in Aristotle's school in the fourth century BC, credits the law to Cleisthenes, the reformer who reshaped Athens after the fall of the tyrants: among his new laws [was the law about ostracism](cts:tlg0086.tlg003:22.1). It was not used at once.

{{quote:first}}

{well} The first man sent away, in 488/7 BC, was [Hipparchus son of Charmus](cts:tlg0086.tlg003:22.4), a relative of the old tyrant Peisistratus. Megacles followed the next year, and for three years the votes fell on the tyrants' friends. Then the target changed: in the fourth year [Xanthippus](cts:tlg0086.tlg003:22.6), [the father of Pericles](cts:tlg0016.tlg001:6.131.2), became the first man with no link to the tyranny to be ostracised.

{debated} Whether Cleisthenes really passed the law in 508/7, twenty years before it was first used, is questioned. The ancient evidence is not unanimous, and some modern historians prefer a later date, close to the first ostracism.

## How the vote worked

In the sixth of the ten periods of the Athenian year, the Assembly [voted by show of hands on whether to hold an ostracism at all](cts:tlg0086.tlg003:43.5). If it did, the vote itself took place later in the Agora. Plutarch describes it.

- Each voter took a sherd, wrote the name of the citizen he wished to remove, and brought it to [a space in the Agora fenced off with railings](cts:tlg0007.tlg024:7.4).
- The archons counted all the sherds first. [If there were fewer than six thousand](cts:tlg0007.tlg024:7.5), the vote was void.
- The man with the most votes was proclaimed banished for ten years, keeping the income from his property.

{debated} Plutarch makes six thousand the number of votes that had to be cast in all. Another ancient account makes it the number needed against one man. Modern scholars are divided.

!! Ostracism was not a punishment for a crime. The exile kept his property, and his return after ten years carried no disgrace. When Xerxes' invasion loomed in 481/0 BC, the Athenians [recalled everyone they had ostracised](cts:tlg0086.tlg003:22.8).

## Aristides the Just

The most famous story about ostracism is the one Plutarch tells of Aristides, nicknamed "the Just", who was ostracised in 483/2 BC.

{legend} An illiterate countryman, not recognising him, handed Aristides his sherd and asked him to write "Aristides" on it. Asked what Aristides had done to him, the man answered:

{{quote:just}}

Aristides wrote his own name, handed the sherd back, and, leaving the city, prayed that Athens would never face a crisis that made the people remember him. Plutarch introduces the story with "it is said", and it cannot be checked. It has survived because it says something true about the institution: a man could be voted out simply for being too prominent.

## The sherds themselves

Ostracism is one of the few ancient votes whose ballots survive. About 9,000 ostraka have been excavated in the Kerameikos, the potters' quarter of Athens, and more than a thousand from the Agora. The names on them match the men the literary sources say were candidates: Themistocles, Megacles, Aristides, Xanthippus and many more.

{debated} In 1937 excavators on the north slope of the Acropolis found 190 sherds with the name of Themistocles, written by only a few hands. They look prepared in advance, either to help voters who could not write, or as part of an organised campaign against him. Which it was cannot be proved.

## The last ostracism

The institution died of ridicule. According to Plutarch, Alcibiades and Nicias, each expecting to be the victim, joined forces and [turned the vote against Hyperbolus](cts:tlg0007.tlg024:7.3), a demagogue neither of them needed. The people felt the institution had been abused and did not use it again. Thucydides, no admirer of Hyperbolus, calls him a man ostracised [not for fear of his power but for his wickedness](cts:tlg0003.tlg001:8.73.3).

{debated} Hyperbolus' ostracism is dated between 417 and 415 BC; the sources do not settle the year.

{{timeline}}`,
  quotes: {
    first: {
      work: "tlg0086.tlg003", ref: "22.3", label: "Constitution of the Athenians 22.3",
      grc: "τότε πρῶτον ἐχρήσαντο τῷ νόμῳ τῷ περὶ τὸν ὀστρακισμόν, ὃς ἐτέθη διὰ τὴν ὑποψίαν τῶν ἐν ταῖς δυνάμεσιν, ὅτι Πεισίστρατος δημαγωγὸς καὶ στρατηγὸς ὢν τύραννος κατέστη.",
      tr: "Then for the first time they used the law about ostracism, which had been passed out of suspicion of men in power, because Peisistratus, a leader of the people and a general, had made himself tyrant.",
      trFrom: "site", trBy: "this site",
    },
    just: {
      work: "tlg0007.tlg024", ref: "7.6", label: "Plutarch, Aristides 7.6",
      grc: "οὐδέν, εἶπεν, οὐδὲ γιγνώσκω τὸν ἄνθρωπον, ἀλλʼ ἐνοχλοῦμαι πανταχοῦ τὸν Δίκαιον ἀκούων.",
      tr: "None whatever, was the answer, I don’t even know the fellow, but I am tired of hearing him everywhere called The Just.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
  },
  timeline: [
    { when: "508/7 BC", what: "Cleisthenes' reforms, which the Constitution of the Athenians says included the law.", certainty: "debated" },
    { when: "488/7 BC", what: "First ostracism: Hipparchus son of Charmus.", certainty: "well" },
    { when: "487/6 BC", what: "Megacles son of Hippocrates is ostracised.", certainty: "well" },
    { when: "485/4 BC", what: "Xanthippus, the first victim with no link to the tyrants.", certainty: "well" },
    { when: "483/2 BC", what: "Aristides is ostracised; Themistocles persuades Athens to build a fleet with the new silver.", certainty: "well" },
    { when: "481/0 BC", what: "All the ostracised are recalled before Xerxes' invasion.", certainty: "well" },
    { when: "c. 417–415 BC", what: "Hyperbolus is ostracised, the last known ostracism.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0086.tlg003", ref: "22.1", to: "22.8", label: "Constitution of the Athenians 22", why: "The first ostracisms, year by year." },
    { work: "tlg0007.tlg024", ref: "7.1", to: "7.6", label: "Plutarch, Aristides 7", why: "How the vote worked, and the story of Aristides." },
    { work: "tlg0003.tlg001", ref: "8.73.3", label: "Thucydides 8.73", why: "Thucydides' verdict on Hyperbolus." },
  ],
  related: ["melos"],
  primary: [
    { work: "tlg0086.tlg003", ref: "22.1", to: "22.8", label: "Constitution of the Athenians 22" },
    { work: "tlg0086.tlg003", ref: "43.5", label: "Constitution of the Athenians 43.5" },
    { work: "tlg0007.tlg024", ref: "7.1", to: "7.6", label: "Plutarch, Aristides 7" },
    { work: "tlg0003.tlg001", ref: "8.73.3", label: "Thucydides 8.73.3" },
    { work: "tlg0016.tlg001", ref: "6.131.2", label: "Herodotus 6.131.2" },
  ],
  secondary: [
    { id: "rhodes-ath-pol", note: "The standard commentary; on the date of the law and the six thousand votes." },
    { id: "forsdyke-exile", note: "What ostracism meant to the Athenians." },
    { id: "brenne-kerameikos", note: "The Kerameikos ostraka, all of them." },
    { id: "lang-ostraka", note: "The ostraka from the Agora." },
    { id: "broneer-1938", note: "The first report of the Themistocles sherds from the north slope." },
  ],
  written: "2026-09-27",
};
export default entry;
