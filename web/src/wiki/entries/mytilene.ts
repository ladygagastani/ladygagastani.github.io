import type { Entry } from "../types";

const entry: Entry = {
  slug: "mytilene-debate",
  title: "The Mytilene debate",
  greek: "Μυτιληναῖοι",
  category: "democracy",
  kicker: "427 BC: the Assembly votes to kill a city, then changes its mind",
  image: "mytilene-theatre",
  hook: `In 427 BC the Athenian Assembly voted, in anger, to put to death every grown man of Mytilene and enslave the women and children. A ship left that day with the order. Overnight the Athenians began to feel what they had done. The next morning they argued it all again, voted by the narrowest of margins to spare the city, and sent a second ship after the first. Its crew rowed without stopping for a day and a night, eating as they rowed.`,
  body: `## A rebellious ally

Mytilene, the chief city of the island of Lesbos, was one of Athens' most privileged allies: it kept its own fleet and paid no tribute. In 428 BC it revolted anyway, counting on Spartan help. The help came late and timidly, and in 427 the city surrendered to the Athenian general Paches, who sent the leaders of the revolt to Athens.

## The first vote

{{quote:anger}}

What angered the Athenians most was that Mytilene had revolted without being oppressed like the other allies, and that a Peloponnesian fleet had dared to cross to Ionia to help. A trireme was sent to Paches [telling him to kill the Mytilenaeans with all haste](cts:tlg0003.tlg001:3.36.3).

{{quote:repent}}

## The second debate

A new Assembly was called at once. Thucydides gives two of the speeches. The first is by Cleon, the man who had carried the first motion, [the most violent of the citizens and by far the most persuasive to the people](cts:tlg0003.tlg001:3.36.6). He opens by attacking the Assembly itself.

{{quote:cleon}}

Cleon argues that justice and self-interest agree: the Mytilenaeans deserve death, and killing them will teach every other ally what rebellion costs. His opponent, Diodotus, of whom nothing else is known, answers on Cleon's own ground. He will not ask for mercy.

{{quote:diodotus}}

Diodotus argues that the death penalty has never stopped crime; that a city which knows it will be destroyed anyway will fight to the last man; and that in Mytilene it was the ruling few, not the people, who had revolted. Kill the people, and Athens loses its friends in every allied city.

## The race

The vote was [almost a tie](cts:tlg0003.tlg001:3.49.1), but Diodotus won. The first ship had a start of about a day and a night. The Mytilenaean envoys in Athens loaded the second ship with wine and barley and promised the crew a great reward.

{{quote:race}}

No contrary wind blew, and the first ship, on its horrible errand, was in no hurry. It arrived first all the same. Paches had just read out the decree and was about to carry it out when the second ship put in. [By so little did Mytilene escape](cts:tlg0003.tlg001:3.49.4).

!! The second crew ate barley kneaded with wine and olive oil as they rowed, and slept in shifts. It is one of the few moments in Thucydides where ordinary rowers, the men who powered Athens' empire, act on their own account.

## What mercy meant

{well} Mercy was relative. On Cleon's motion the Athenians executed the men Paches had sent to Athens as the leaders of the revolt: [somewhat more than a thousand](cts:tlg0003.tlg001:3.50.1). They pulled down Mytilene's walls, took its fleet, and divided most of the island's land among Athenian settlers.

{debated} "More than a thousand" is a large number of ringleaders to have been shipped to Athens, and some historians suspect a copying error in the numeral. The manuscripts give the number as printed here.

{{timeline}}`,
  quotes: {
    anger: {
      work: "tlg0003.tlg001", ref: "3.36.2", label: "Thucydides 3.36",
      grc: "καὶ ὑπὸ ὀργῆς ἔδοξεν αὐτοῖς οὐ τοὺς παρόντας μόνον ἀποκτεῖναι, ἀλλὰ καὶ τοὺς ἅπαντας Μυτιληναίους ὅσοι ἡβῶσι, παῖδας δὲ καὶ γυναῖκας ἀνδραποδίσαι",
      tr: "under the impulse of anger finally determined to put to death, not only the Mytilenaeans who were there in Athens, but also all who were of adult age, and to enslave their women and children.",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    repent: {
      work: "tlg0003.tlg001", ref: "3.36.4", label: "Thucydides 3.36",
      grc: "καὶ τῇ ὑστεραίᾳ μετάνοιά τις εὐθὺς ἦν αὐτοῖς καὶ ἀναλογισμὸς ὠμὸν τὸ βούλευμα καὶ μέγα ἐγνῶσθαι, πόλιν ὅλην διαφθεῖραι μᾶλλον ἢ οὐ τοὺς αἰτίους.",
      tr: "but on the very next day a feeling of repentance came over them and they began to reflect that the design which they had formed was cruel and monstrous, to destroy a whole city instead of merely those who were guilty.",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    cleon: {
      work: "tlg0003.tlg001", ref: "3.37.1", label: "Thucydides 3.37",
      grc: "πολλάκις μὲν ἤδη ἔγωγε καὶ ἄλλοτε ἔγνων δημοκρατίαν ὅτι ἀδύνατόν ἐστιν ἑτέρων ἄρχειν",
      tr: "On many other occasions in the past I have realized that a democracy is incompetent to govern others",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    diodotus: {
      work: "tlg0003.tlg001", ref: "3.44.1", label: "Thucydides 3.44",
      grc: "οὐ γὰρ περὶ τῆς ἐκείνων ἀδικίας ἡμῖν ὁ ἀγών, εἰ σωφρονοῦμεν, ἀλλὰ περὶ τῆς ἡμετέρας εὐβουλίας.",
      tr: "For the question for us to consider, if we are sensible, is not what wrong they have done, but what is the wise course for us.",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    race: {
      work: "tlg0003.tlg001", ref: "3.49.3", label: "Thucydides 3.49",
      grc: "ἐγένετο σπουδὴ τοῦ πλοῦ τοιαύτη ὥστε ἤσθιόν τε ἅμα ἐλαύνοντες οἴνῳ καὶ ἐλαίῳ ἄλφιτα πεφυραμένα, καὶ οἱ μὲν ὕπνον ᾑροῦντο κατὰ μέρος, οἱ δὲ ἤλαυνον.",
      tr: "such was their haste on the voyage that they kept on rowing as they ate their barley-cakes, kneaded with wine and oil, and took turns at sleeping and rowing.",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
  },
  timeline: [
    { when: "428 BC", what: "Mytilene and most of Lesbos revolt from Athens.", certainty: "well" },
    { when: "Summer 427 BC", what: "Mytilene surrenders to Paches; the Assembly votes to kill all its men.", certainty: "well" },
    { when: "The next day", what: "Second debate: Cleon against Diodotus. Diodotus wins by a hair; the second ship catches the first.", certainty: "well" },
    { when: "427 BC", what: "Over a thousand men executed; walls destroyed; land given to Athenian settlers.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "3.36.1", to: "3.50.3", label: "Thucydides 3.36–50", why: "The two votes, both speeches, and the race." },
    { work: "tlg0003.tlg001", ref: "3.37.1", to: "3.40.7", label: "Thucydides 3.37–40", why: "Cleon's speech: why democracy cannot rule an empire." },
    { work: "tlg0003.tlg001", ref: "3.42.1", to: "3.48.2", label: "Thucydides 3.42–48", why: "Diodotus' speech: the case for sparing the city." },
  ],
  related: ["melos", "ostracism"],
  places: ["550763"],
  primary: [{ work: "tlg0003.tlg001", ref: "3.36.1", to: "3.50.3", label: "Thucydides 3.36–50" }],
  secondary: [
    { id: "hornblower-thuc-1", note: "On the speeches and the number of the executed." },
    { id: "hct-2" },
    { id: "kagan-archidamian", note: "The revolt of Mytilene in the history of the war." },
  ],
  written: "2026-09-27",
};
export default entry;
