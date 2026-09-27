/**
 * Passages of the day: famous openings and moments, read live from the source files.
 * References use each file's own citation scheme. `about` is a one-line orientation for beginners.
 */
export interface DailyPassage { work: string; from: string; to: string; label: string; about: string }

export const PASSAGES: DailyPassage[] = [
  { work: "tlg0012.tlg001", from: "1.1", to: "1.7", label: "Homer, Iliad 1.1–7", about: "The opening of the Iliad: the poet asks the goddess to sing of the wrath of Achilles." },
  { work: "tlg0012.tlg002", from: "1.1", to: "1.10", label: "Homer, Odyssey 1.1–10", about: "The opening of the Odyssey: the man \"of many turns\" who wandered after the fall of Troy." },
  { work: "tlg0031.tlg004", from: "1.1", to: "1.5", label: "Gospel of John 1.1–5", about: "\"In the beginning was the Word\": a good first text, with short sentences and common words." },
  { work: "tlg0016.tlg001", from: "1.1.0", to: "1.1.0", label: "Herodotus, Histories 1.0", about: "Herodotus sets out the purpose of his inquiry, his historiē." },
  { work: "tlg0011.tlg002", from: "333", to: "340", label: "Sophocles, Antigone 333–340", about: "The chorus sings of humankind. The first word of praise, δεινός, can mean both \"wondrous\" and \"terrible\"." },
  { work: "tlg0003.tlg001", from: "1.1.1", to: "1.1.1", label: "Thucydides, History 1.1.1", about: "Thucydides introduces the war between the Peloponnesians and the Athenians, which he expected to be the greatest yet." },
  { work: "tlg0032.tlg006", from: "1.1.1", to: "1.1.2", label: "Xenophon, Anabasis 1.1.1–2", about: "The Anabasis begins with the two sons of Darius and Parysatis, Artaxerxes and Cyrus." },
  { work: "tlg0085.tlg005", from: "1", to: "7", label: "Aeschylus, Agamemnon 1–7", about: "A watchman on the palace roof at Argos waits, night after night, for the beacon announcing Troy's fall." },
  { work: "tlg0031.tlg002", from: "1.1", to: "1.3", label: "Gospel of Mark 1.1–3", about: "The opening of Mark's Gospel, quoting the prophet Isaiah." },
  { work: "tlg0020.tlg001", from: "1", to: "8", label: "Hesiod, Theogony 1–8", about: "Hesiod begins his poem on the birth of the gods with the Muses of Mount Helicon." },
];

/** Today's passage, the same for everyone on a given day (UTC). */
export const todaysIndex = (now = Date.now()) => Math.floor(now / 864e5) % PASSAGES.length;
