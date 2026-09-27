import type { Entry } from "../types";

const entry: Entry = {
  slug: "pericles",
  title: "Pericles",
  greek: "Περικλῆς",
  category: "people",
  kicker: "The aristocrat who led the Athenian democracy for a generation",
  hook: `For about thirty years in the middle of the fifth century BC, the most powerful man in Athens held only an office the Assembly filled by vote every year: general. Pericles was re-elected again and again, persuaded the Assembly to build the Parthenon, and led the city into the war with Sparta that would end its empire. His admirers called him "the Olympian"; the comic poets called him "squill-head". Thucydides, who lived through those years, thought he was the only thing holding Athens together.`,
  body: `## A family at the top

Pericles was born into the Athenian upper class on both sides, as Plutarch puts it. His father [Xanthippus](cts:tlg0007.tlg012:3.1) commanded the Greeks who beat the Persians at Mycale in 479 BC; his mother Agariste belonged to the Alcmaeonids, the family of Cleisthenes, who had founded the democracy in 508/7 BC.

{debated} His birth year is not recorded. It is usually put about 495 BC, because he was already prominent in the 460s.

## A leader of the people

He made his name in the 460s on the popular side. The *Constitution of the Athenians*, written in Aristotle's school, credits him with [taking powers from the Areopagus](cts:tlg0086.tlg003:27.1), the old council of former magistrates (Plutarch says the reform was [carried through by Ephialtes](cts:tlg0007.tlg012:9.4), with Pericles behind it), and with being the first to [pay citizens for sitting on juries](cts:tlg0086.tlg003:27.3), so that poor men could afford to serve. The same work says he did it to outbid his rich rival Cimon, who fed his fellow villagers from his own estate.

In 451/0 BC, on his proposal, the Assembly decided that only a man [born of two Athenian parents](cts:tlg0086.tlg003:26.3) could be a citizen. The law would come back to trouble him: his long companion Aspasia came from Miletus, so their son could not be a citizen. Near the end of Pericles' life, after his two legitimate sons had died, the Assembly [let him enrol the boy](cts:tlg0007.tlg012:37.5) as an exception. That son, Pericles the younger, was one of the generals executed after the battle of Arginusae in 406 BC.

## The Olympian

{{quote:olympian}}

Aristophanes' joke points at his speaking. Plutarch lists the explanations for the nickname: his lofty style, which he was said to have learned from the philosopher Anaxagoras, or the buildings with which he [adorned the city](cts:tlg0007.tlg012:8.2), or simply his power. He also records the less flattering names. Pericles' head was unusually long, so [the comic poets called him *schinokephalos*](cts:tlg0007.tlg012:3.2), "squill-head", after the sea squill, a plant with a big bulb. Plutarch explains that this is why almost all his portraits show him in a helmet: the sculptors did not want to mock him.

After his last serious rival, Thucydides son of Melesias (not the historian), was ostracised about 443 BC, Pericles was elected general [every year for fifteen years](cts:tlg0007.tlg012:16.3) in a row.

## The building programme

In 454 BC the treasury of the Delian League, the alliance of Greek cities against Persia, was moved from the island of Delos to Athens. Over the next decades the Athenians rebuilt the Acropolis, which the Persians had burned in 480 BC: the Parthenon, begun in 447 BC, the gateway called the Propylaia, and more. Pericles' opponents protested that the allies' money was paying for it.

{{quote:critics}}

{well} The buildings and their dates are known from the building accounts the Athenians inscribed on stone, many of which survive. How far Pericles personally directed the work is less clear: Plutarch's account was written more than five hundred years later.

## The Funeral Oration

In the winter of 431/0 BC, after the first year of war with Sparta, Pericles was chosen to speak at the public funeral for the dead. The speech Thucydides gives him is the most famous description of Athenian democracy ever written.

{{quote:democracy}}

{debated} Thucydides says plainly that he could not recall speeches word for word, and wrote what each speaker [would most likely have said](cts:tlg0003.tlg001:1.22.1), keeping as close as he could to the general sense. The Funeral Oration is Pericles' thought in Thucydides' words, and how much of each is in it is argued.

## Plague, and a verdict

Pericles' strategy was to bring the people of Attica inside the city walls, let the Spartans ravage the countryside, and fight at sea. In 430 BC [plague](wiki:plague-of-athens) broke out in the crowded city. The Athenians turned on him and [fined him](cts:tlg0003.tlg001:2.65.3), then soon elected him general again. He caught the plague himself and died in 429 BC. Plutarch tells how, as he lay dying, his friends listed his victories, thinking he could no longer hear them.

{{quote:mourning}}

Thucydides' judgement, written after Athens had lost the war, is that Pericles was the one leader strong enough to tell the Assembly what it did not want to hear, and that his successors, competing for the people's favour, threw away what he had built.

{{quote:firstman}}

{debated} Modern historians are divided on Pericles. Some follow Thucydides; others point out that the historian was an admirer writing with hindsight, that the war strategy he praises was a gamble, and that the empire Pericles strengthened was the thing its subjects most resented. Plato, a generation later, has Socrates repeat the charge that Pericles, by bringing in public pay, [made the Athenians idle, cowardly, talkative and greedy](cts:tlg0059.tlg023:515).

{{timeline}}`,
  quotes: {
    olympian: {
      work: "tlg0019.tlg001", ref: "530", label: "Aristophanes, Acharnians 530–531",
      grc: "ἐντεῦθεν ὀργῇ Περικλέης οὑλύμπιος\nἤστραπτʼ ἐβρόντα ξυνεκύκα τὴν Ἑλλάδα,",
      tr: "Then in his anger Pericles the Olympian lightened and thundered and stirred all Greece into confusion,",
      trFrom: "site", trBy: "this site",
    },
    critics: {
      work: "tlg0007.tlg012", ref: "12.2", label: "Plutarch, Pericles 12.2",
      grc: "ὁρῶσα τοῖς εἰσφερομένοις ὑπʼ αὐτῆς ἀναγκαίως πρὸς τὸν πόλεμον ἡμᾶς τὴν πόλιν καταχρυσοῦντας καὶ καλλωπίζοντας ὥσπερ ἀλαζόνα γυναῖκα, περιαπτομένην λίθους πολυτελεῖς καὶ ἀγάλματα καὶ ναοὺς χιλιοταλάντους.",
      tr: "when she sees that, with her own enforced contributions for the war, we are gilding and bedizening our city, which, for all the world like a wanton woman, adds to her wardrobe precious stones and costly statues and temples worth their millions.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1916)",
    },
    democracy: {
      work: "tlg0003.tlg001", ref: "2.37.1", label: "Thucydides 2.37.1",
      grc: "καὶ ὄνομα μὲν διὰ τὸ μὴ ἐς ὀλίγους ἀλλ’ ἐς πλείονας οἰκεῖν δημοκρατία κέκληται·",
      tr: "It is true that our government is called a democracy, because its administration is in the hands, not of the few, but of the many;",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    mourning: {
      work: "tlg0007.tlg012", ref: "38.4", label: "Plutarch, Pericles 38.4",
      grc: "οὐδεὶς γάρ, ἔφη, διʼ ἐμὲ τῶν ὄντων Ἀθηναίων μέλαν ἱμάτιον περιεβάλετο.",
      tr: "for, said he, no living Athenian ever put on mourning because of me.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1916)",
    },
    firstman: {
      work: "tlg0003.tlg001", ref: "2.65.9", label: "Thucydides 2.65.9",
      grc: "ἐγίγνετό τε λόγῳ μὲν δημοκρατία, ἔργῳ δὲ ὑπὸ τοῦ πρώτου ἀνδρὸς ἀρχή.",
      tr: "And so Athens, though in name a democracy, gradually became in fact a government ruled by its foremost citizen.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
  },
  timeline: [
    { when: "c. 495 BC", what: "Pericles is born, son of Xanthippus and Agariste.", certainty: "debated" },
    { when: "479 BC", what: "His father Xanthippus commands at the victory of Mycale.", certainty: "well" },
    { when: "462/1 BC", what: "Ephialtes strips the Areopagus of most of its powers, with Pericles' support.", certainty: "well" },
    { when: "454 BC", what: "The Delian League treasury is moved to Athens.", certainty: "well" },
    { when: "451/0 BC", what: "His law: citizens must have an Athenian mother and father.", certainty: "well" },
    { when: "447 BC", what: "Work begins on the Parthenon.", certainty: "well" },
    { when: "c. 443 BC", what: "His rival Thucydides son of Melesias is ostracised.", certainty: "well" },
    { when: "431 BC", what: "War with Sparta; the Funeral Oration that winter.", certainty: "well" },
    { when: "430 BC", what: "Plague in Athens; Pericles is fined, then re-elected.", certainty: "well" },
    { when: "429 BC", what: "Pericles dies of the plague.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "2.35.1", to: "2.46.2", label: "Thucydides 2.35–46", why: "The Funeral Oration, as Thucydides wrote it." },
    { work: "tlg0003.tlg001", ref: "2.65.1", to: "2.65.13", label: "Thucydides 2.65", why: "Thucydides' verdict on Pericles and his successors." },
    { work: "tlg0007.tlg012", ref: "1.1", to: "39.5", label: "Plutarch, Pericles", why: "The only ancient biography, full of anecdotes, some reliable." },
  ],
  related: ["ostracism", "plague-of-athens", "mytilene-debate"],
  primary: [
    { work: "tlg0003.tlg001", ref: "2.35.1", to: "2.65.13", label: "Thucydides 2.35–65" },
    { work: "tlg0007.tlg012", ref: "1.1", to: "39.5", label: "Plutarch, Pericles" },
    { work: "tlg0086.tlg003", ref: "26.3", to: "27.4", label: "Constitution of the Athenians 26–27" },
    { work: "tlg0019.tlg001", ref: "530", to: "531", label: "Aristophanes, Acharnians 530–531" },
  ],
  secondary: [
    { id: "azoulay-pericles", note: "A modern biography, and how Pericles was remembered." },
    { id: "stadter-pericles", note: "A line-by-line commentary on Plutarch's life." },
    { id: "rhodes-ath-pol", note: "On the Constitution of the Athenians." },
  ],
  written: "2026-09-27",
};
export default entry;
