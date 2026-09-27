import type { Entry } from "../types";

const entry: Entry = {
  slug: "asclepius",
  title: "Asclepius and the healing sleep",
  greek: "Ἀσκληπιός",
  category: "daily",
  kicker: "Where Greeks went when doctors failed: a night in the god's hall",
  hook: `A sick Greek who could afford the journey might go to a sanctuary of Asclepius, the god of healing, wash, make an offering, and lie down for the night in a special hall, hoping the god would come in a dream and cure him. At Epidaurus, the god's greatest sanctuary, the priests set up stone slabs recording the cures: a blind man given sight, a woman who had been pregnant for five years. Doctors swore their oath in his name, and Socrates' last words were about a debt to him.`,
  body: `## From physician to god

In the *Iliad*, Asclepius is a man, the "[blameless physician](cts:tlg0012.tlg001:4.194)" whose sons Machaon and Podalirius are doctors in the Greek army at Troy. Later myth made him a son of Apollo, so skilled that, tempted by gold, he [brought a dead man back to life](cts:tlg0033.tlg002:3.55), and Zeus killed him with a thunderbolt. By the fifth century BC he was worshipped as a god, with his daughters Hygieia, "Health", and Panakeia, "All-Heal".

His cult spread fast. It came to Athens in 420 BC, and there is an old tradition, which Plutarch reports, that the playwright Sophocles [gave the god hospitality](cts:tlg0007.tlg005:4.6) when he arrived.

## Epidaurus

The greatest sanctuary was at Epidaurus in the Peloponnese. Pausanias, who visited in the second century AD, describes its boundary stones (no one was allowed to be born or die inside), its gold and ivory statue of the god [with a staff and a serpent](cts:tlg0525.tlg001:2.27.2), and, opposite the temple, the place where the suppliants of the god slept.

{{quote:stelae}}

{well} Excavations at Epidaurus in the 1880s found large parts of these slabs, inscribed in the fourth century BC. They record dozens of cures. In one, a woman named Cleo, pregnant for five years, slept in the hall and gave birth to a son who at once washed himself at the spring and walked about with his mother. In another, a man who could not move his fingers laughed at the cures on the slabs; the god healed him anyway and named him *Apistos*, "Unbeliever".

## A night in the god's hall

The only first-hand description of what happened at night is a comedy. In Aristophanes' *Wealth* (388 BC), a slave describes taking the blind god Wealth to be cured by Asclepius: first a bath in the cold sea, then offerings at the altar, then lying down on beds of leaves among the other sick people, while the temple servant put out the lamps and told everyone to keep quiet. The slave could not sleep, because an old woman near him had a pot of porridge.

{{quote:priest}}

Then the priest [went round every altar](cts:tlg0019.tlg011:679) looking for leftover honey-cakes, and "consecrated" them into a sack. The god does come, in the play, with his daughter Panakeia, and [two great snakes](cts:tlg0019.tlg011:733) glide out of the temple to lick Wealth's eyelids; he wakes up able to see.

## Gods and doctors

{debated} Temple healing and the medicine of doctors such as Hippocrates are sometimes presented as rivals, religion against science. The ancient evidence suggests they lived side by side: doctors honoured Asclepius as their patron, and the Hippocratic Oath begins with his name.

{{quote:oath}}

Many who slept in the god's hall had already tried the doctors. How many went home cured, and what happened when they did, we cannot know: the slabs record the successes.

!! Socrates' last words, as Plato tells them, were a reminder to his friend: [we owe a cock to Asclepius](cts:tlg0059.tlg004:118), the usual thank-offering after a cure. What cure Socrates meant has been argued over ever since. See [the trial of Socrates](wiki:trial-of-socrates).

{{timeline}}`,
  quotes: {
    stelae: {
      work: "tlg0525.tlg001", ref: "2.27.3", label: "Pausanias 2.27.3",
      grc: "στῆλαι δὲ εἱστήκεσαν ἐντὸς τοῦ περιβόλου τὸ μὲν ἀρχαῖον καὶ πλέονες, ἐπʼ ἐμοῦ δὲ ἓξ λοιπαί· ταύταις ἐγγεγραμμένα καὶ ἀνδρῶν καὶ γυναικῶν ἐστιν ὀνόματα ἀκεσθέντων ὑπὸ τοῦ Ἀσκληπιοῦ, προσέτι δὲ καὶ νόσημα ὅ τι ἕκαστος ἐνόσησε καὶ ὅπως ἰάθη·",
      tr: "Within the enclosure stood slabs; in my time six remained, but of old there were more. On them are inscribed the names of both the men and the women who have been healed by Asclepius, the disease also from which each suffered, and the means of cure.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1918)",
    },
    priest: {
      work: "tlg0019.tlg011", ref: "676", label: "Aristophanes, Wealth 676–678",
      grc: "ἔπειτʼ ἀναβλέψας ὁρῶ τὸν ἱερέα\nτοὺς φθοῖς ἀφαρπάζοντα καὶ τὰς ἰσχάδας\nἀπὸ τῆς τραπέζης τῆς ἱερᾶς·",
      tr: "Then I looked up and saw the priest snatching the cakes and the dried figs from the holy table.",
      trFrom: "site", trBy: "this site",
    },
    oath: {
      work: "tlg0627.tlg013", ref: "oath", label: "The Hippocratic Oath",
      grc: "ὄμνυμι Ἀπόλλωνα ἰητρὸν καὶ Ἀσκληπιὸν καὶ Ὑγείαν καὶ Πανάκειαν καὶ θεοὺς πάντας τε καὶ πάσας,",
      tr: "I SWEAR by Apollo the physician, and Aesculapius, and Health, and All-heal, and all the gods and goddesses,",
      trFrom: "corpus", trBy: "Francis Adams (1886)",
    },
  },
  timeline: [
    { when: "8th–7th c. BC", what: "In the Iliad, Asclepius is a mortal physician.", certainty: "well" },
    { when: "5th c. BC", what: "Asclepius is worshipped as a god; Epidaurus becomes his chief sanctuary.", certainty: "well" },
    { when: "420 BC", what: "The cult reaches Athens.", certainty: "well" },
    { when: "4th c. BC", what: "The great temple, the Tholos and the inscribed cure slabs at Epidaurus.", certainty: "well" },
    { when: "388 BC", what: "Aristophanes' Wealth, with its night in the god's hall.", certainty: "well" },
    { when: "2nd c. AD", what: "Pausanias visits Epidaurus; six slabs are still standing.", certainty: "well" },
    { when: "1880s", what: "Panagiotis Kavvadias excavates the sanctuary and finds the cure slabs.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0019.tlg011", ref: "653", to: "747", label: "Aristophanes, Wealth 653–747", why: "A night in the god's hall, told by a hungry slave." },
    { work: "tlg0525.tlg001", ref: "2.26.1", to: "2.28.1", label: "Pausanias 2.26–27", why: "Epidaurus and the birth of Asclepius, as the locals told it." },
  ],
  related: ["trial-of-socrates", "plague-of-athens", "delphi"],
  primary: [
    { work: "tlg0525.tlg001", ref: "2.27.1", to: "2.27.3", label: "Pausanias 2.27.1–3" },
    { work: "tlg0019.tlg011", ref: "653", to: "747", label: "Aristophanes, Wealth 653–747" },
    { work: "tlg0012.tlg001", ref: "4.193", to: "4.194", label: "Homer, Iliad 4.193–194" },
    { work: "tlg0627.tlg013", ref: "oath", label: "The Hippocratic Oath" },
  ],
  secondary: [
    { id: "edelstein-asclepius", note: "Every ancient text on Asclepius, translated and discussed." },
    { id: "lidonnici-epidaurus", note: "The cure inscriptions of Epidaurus, with translation." },
  ],
  written: "2026-09-27",
};
export default entry;
