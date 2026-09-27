import type { Entry } from "../types";

const entry: Entry = {
  slug: "trial-of-socrates",
  title: "The trial of Socrates",
  greek: "ἡ Σωκράτους δίκη",
  category: "democracy",
  kicker: "The democracy that put a philosopher to death",
  image: "socrates-louvre",
  hook: `In the spring of 399 BC, a jury of about five hundred Athenian citizens found the philosopher Socrates, aged about seventy, guilty of not believing in the city's gods, of bringing in new divine beings, and of corrupting the young. They sentenced him to death, and a month later he drank the poison in prison, surrounded by his friends. No trial in history has been argued over longer. Was it a democracy murdering free speech, a city settling political scores after a civil war, or something else?`,
  body: `## The charge

Diogenes Laertius copies the indictment, which he says, following an earlier scholar, was still kept in the Athenian archives in the second century AD.

{{quote:charge}}

The prosecutors were Meletus, a young poet, Anytus, a leading democratic politician, and Lycon, an orator. In Plato's account Socrates names them and says each [spoke for a group he had offended](cts:tlg0059.tlg002:23) by showing that its members did not know what they claimed to know: Meletus for the poets, Anytus for the craftsmen and politicians, Lycon for the orators.

## The old slanders

Socrates tells the jury that his real accusers are older ones: a reputation built up over many years, of a man who studied the heavens and made the weaker argument the stronger. He points to [a comedy of Aristophanes](cts:tlg0059.tlg002:19), the *Clouds* of 423 BC, in which a character called Socrates swings about in a basket "walking on air" and talking nonsense.

## The defence

Plato's *Apology*, "defence speech", is not a transcript: it was written afterwards by a devoted follower, and Xenophon's shorter *Apology* gives a different emphasis. But both show a man who would not beg. In Plato, Socrates tells the jury that he will never stop questioning people, because the god at Delphi had set him that task.

{{quote:unexamined}}

## The verdict and the penalty

He was found guilty, and Socrates himself says he was surprised how close it was: if only [thirty votes had gone the other way](cts:tlg0059.tlg002:36), he would have been acquitted. Under Athenian law the prosecution proposed a penalty and the defendant proposed another, and the jury chose between them. Meletus proposed death. Socrates first suggested that, as a benefactor of the city, he deserved free meals in the town hall for life, like an Olympic victor. Then, at his friends' urging, he offered a fine of [thirty minas](cts:tlg0059.tlg002:38), which Plato and others would guarantee. The jury voted for death.

## The death

The execution had to wait: while the sacred ship Athens sent to Delos every year was away, no one could be put to death, and Socrates lived [thirty days](cts:tlg0032.tlg002:4.8.2) in prison. Plato's *Phaedo* describes the last day: the talk about the soul, the cup of poison, the coldness climbing from his feet, and his last words.

{{quote:cock}}

!! Plato never names the poison; he calls it simply *to pharmakon*, "the drug". It is traditionally identified as hemlock, and Plato's description of numbness rising from the feet fits poison hemlock, though doctors have argued over the details.

## Why?

{debated} Religion was a real charge in Athens, and Socrates' claim to be guided by a private divine sign could sound like a new god. But many historians think politics mattered more. Athens had lost the Peloponnesian War in 404 BC and been ruled for a year by the Thirty Tyrants, whose leader Critias had been one of Socrates' companions, as had the traitor Alcibiades. An amnesty in 403 BC forbade prosecutions for what had happened under the Thirty, so, the argument goes, the anger took the form of a religious charge. Others reply that the ancient sources hardly mention this, and that the charge should be taken at its word.

{{timeline}}`,
  quotes: {
    charge: {
      work: "tlg0004.tlg001", ref: "2.5.40", label: "Diogenes Laertius 2.40",
      grc: "ἀδικεῖ Σωκράτης, οὓς μὲν ἡ πόλις νομίζει θεοὺς οὐ νομίζων, ἕτερα δὲ καινὰ δαιμόνια εἰσηγούμενος· ἀδικεῖ δὲ καὶ τοὺς νέους διαφθείρων. τίμημα θάνατος.",
      tr: "Socrates is guilty of refusing to recognize the gods recognized by the state, and of introducing other new divinities. He is also guilty of corrupting the youth. The penalty demanded is death.",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
    unexamined: {
      work: "tlg0059.tlg002", ref: "38", label: "Plato, Apology 38a",
      grc: "ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ",
      tr: "the unexamined life is not worth living",
      trFrom: "corpus", trBy: "H. N. Fowler (1914)",
    },
    cock: {
      work: "tlg0059.tlg004", ref: "118", label: "Plato, Phaedo 118a",
      grc: "ὦ Κρίτων, ἔφη, τῷ Ἀσκληπιῷ ὀφείλομεν ἀλεκτρυόνα· ἀλλὰ ἀπόδοτε καὶ μὴ ἀμελήσητε.",
      tr: "Crito, we owe a cock to Aesculapius. Pay it and do not neglect it.",
      trFrom: "corpus", trBy: "H. N. Fowler (1914)",
    },
  },
  timeline: [
    { when: "c. 470 BC", what: "Socrates is born in Athens, son of Sophroniscus.", certainty: "well" },
    { when: "423 BC", what: "Aristophanes mocks him in the Clouds.", certainty: "well" },
    { when: "404–403 BC", what: "Athens loses the war; the rule of the Thirty; the amnesty.", certainty: "well" },
    { when: "399 BC", what: "Trial, conviction and death of Socrates.", certainty: "well" },
    { when: "early 4th c. BC", what: "Plato and Xenophon write their accounts of the trial.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0059.tlg002", ref: "17", to: "42", label: "Plato, Apology", why: "The defence speech as Plato wrote it." },
    { work: "tlg0032.tlg005", ref: "1", to: "34", label: "Xenophon, Apology", why: "Another pupil's account, with a different Socrates." },
    { work: "tlg0059.tlg004", ref: "115", to: "118", label: "Plato, Phaedo 115b–118a", why: "The last hour." },
  ],
  related: ["diogenes", "delphi", "school"],
  primary: [
    { work: "tlg0059.tlg002", ref: "17", to: "42", label: "Plato, Apology" },
    { work: "tlg0059.tlg004", ref: "115", to: "118", label: "Plato, Phaedo 115–118" },
    { work: "tlg0032.tlg002", ref: "4.8.2", label: "Xenophon, Memorabilia 4.8.2" },
    { work: "tlg0004.tlg001", ref: "2.5.40", to: "2.5.42", label: "Diogenes Laertius 2.40–42" },
  ],
  secondary: [
    { id: "brickhouse-smith-trial", note: "The Apology read closely, as a real defence." },
    { id: "wilson-death-socrates", note: "The death, and what later ages made of it." },
  ],
  written: "2026-09-27",
};
export default entry;
