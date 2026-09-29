/**
 * Reading paths: short sequences of works to read in order, the site's own suggestions (as the
 * library's "Where to begin"). Every work is in the catalogue (checked by paths.test.ts); how
 * familiar each one's vocabulary is comes from the data (difficulty.json), not from this file.
 */
export interface ReadingPath {
  id: string;
  title: string;
  /** what the path is for, and why this order */
  blurb: string;
  /** [work id, a note on this step] */
  steps: [string, string][];
}

export const PATHS: ReadingPath[] = [
  {
    id: "prose", title: "First steps in Greek prose",
    blurb: "Plain, clear prose first, then longer and richer narrative: the usual order of reading after a textbook.",
    steps: [
      ["tlg0540.tlg001", "A short speech for a murder trial: a vivid story in everyday Attic."],
      ["tlg0059.tlg002", "Socrates' defence speech: simple sentences, much repetition of key words."],
      ["tlg0059.tlg003", "A short conversation in prison, on why Socrates will not escape."],
      ["tlg0032.tlg006", "An army's march home from Persia, told in straightforward narrative."],
      ["tlg0016.tlg001", "The first history, in the Ionic dialect: longer sentences and many stories."],
    ],
  },
  {
    id: "epic", title: "Epic from the beginning",
    blurb: "The hexameter tradition: Homer, then Hesiod, then a hymn to a goddess in the same verse.",
    steps: [
      ["tlg0012.tlg001", "The wrath of Achilles in the tenth year of the Trojan War."],
      ["tlg0012.tlg002", "Odysseus' return home, in the same language and metre."],
      ["tlg0020.tlg001", "The birth of the gods and the rise of Zeus."],
      ["tlg0020.tlg002", "Farming, justice and hard work, in a poet's own voice."],
      ["tlg0013.tlg002", "The Homeric Hymn to Demeter: the goddess searches for her daughter Persephone."],
    ],
  },
  {
    id: "stage", title: "The Athenian stage",
    blurb: "One play from each of the great dramatists of fifth-century Athens, tragedy first, then comedy.",
    steps: [
      ["tlg0085.tlg005", "The king's homecoming and murder."],
      ["tlg0011.tlg002", "A sister buries her brother against the king's order."],
      ["tlg0011.tlg004", "A king searches for the killer of his predecessor."],
      ["tlg0006.tlg003", "Medea's revenge on Jason."],
      ["tlg0019.tlg003", "A comedy about Socrates and the new learning."],
    ],
  },
  {
    id: "philosophy", title: "Philosophy in sequence",
    blurb: "From Socrates to the Stoics: the questions Socrates raised, and how later thinkers took them up.",
    steps: [
      ["tlg0059.tlg002", "Socrates on trial, in Plato's telling."],
      ["tlg0059.tlg030", "Plato on justice, the soul and the ideal city."],
      ["tlg0086.tlg010", "Aristotle on happiness, virtue and friendship."],
      ["tlg0557.tlg002", "Epictetus' short handbook of Stoic practice."],
      ["tlg0557.tlg001", "The longer classroom talks that the Handbook was drawn from."],
    ],
  },
  {
    id: "koine", title: "Koine Greek",
    blurb: "The shared Greek of the Hellenistic and Roman world, from the Septuagint to the New Testament.",
    steps: [
      ["tlg0031.tlg004", "The Gospel of John: short sentences and a small vocabulary."],
      ["tlg0527.tlg001", "Genesis in the Septuagint, the Greek translation of the Hebrew Bible."],
      ["tlg0031.tlg005", "Narrative, speeches and voyages: the early church spreads through the Roman world."],
      ["tlg0031.tlg006", "Paul's letter to the Romans: argument rather than story."],
      ["tlg0018.tlg001", "Philo of Alexandria reads the creation story as philosophy."],
    ],
  },
  {
    id: "history", title: "History in Greek",
    blurb: "Five historians over five centuries, each writing in the shadow of the one before.",
    steps: [
      ["tlg0016.tlg001", "The Persian Wars and the peoples around them."],
      ["tlg0003.tlg001", "The war between Athens and Sparta."],
      ["tlg0032.tlg001", "Xenophon continues the story where Thucydides stops."],
      ["tlg0543.tlg001", "How Rome came to rule the Mediterranean."],
      ["tlg0007.tlg012", "Plutarch's life of Pericles, written in the Roman empire."],
    ],
  },
];
