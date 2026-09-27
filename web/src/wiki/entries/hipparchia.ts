import type { Entry } from "../types";

const entry: Entry = {
  slug: "hipparchia",
  title: "Hipparchia the Cynic",
  greek: "Ἱππαρχία",
  category: "people",
  kicker: "The woman who left the loom for philosophy",
  image: "crates-hipparchia",
  hook: `Around 300 BC a young woman from Thrace threatened to kill herself unless she was allowed to marry a penniless philosopher. She got her way, put on the Cynic's rough cloak, and went everywhere her husband went, including the drinking parties that respectable Greek women never attended. Hipparchia is the only woman to whom Diogenes Laertius, the ancient historian of philosophy, gives a life of her own.`,
  body: `## A choice of husband

Hipparchia came from Maroneia on the north coast of the Aegean, and her brother Metrocles was already a follower of the Cynic Crates in Athens. Crates had been rich: he [sold his property and gave the money away](cts:tlg0004.tlg001:6.5.87) to live as a Cynic, owning nothing, in the manner of [Diogenes](wiki:diogenes).

Hipparchia, Diogenes Laertius says, [fell in love with his teaching and his way of life](cts:tlg0004.tlg001:6.7.96), and turned down every other suitor: their wealth, their birth, their looks. Her parents begged Crates to talk her out of it. He tried everything, and then made his last argument.

{{quote:bridegroom}}

She chose him.

## A life in public

A respectable Greek wife lived mostly indoors, and did not dine with men who were not her relatives. Hipparchia [dressed as Crates did](cts:tlg0004.tlg001:6.7.97), walked about the city with him and went with him to dinners. The Cynics' rule was that nothing natural is shameful, and they lived by it: the sceptic philosopher Sextus Empiricus, writing centuries later, still used [Crates and Hipparchia making love in public](cts:tlg0544.tlg001:1.14.153) as his standard example of a way of life opposed to ordinary custom.

{legend} Whether this happened as told, or grew in the retelling, cannot be known. The stories about the Cynics were told because they shocked, and each teller had reasons to sharpen them.

## Dinner with a king

Diogenes Laertius tells one scene in detail. At a banquet given by Lysimachus, one of Alexander's generals who became a king, Hipparchia met the philosopher Theodorus, nicknamed "the Atheist", and beat him with a piece of logic. Whatever would not be called wrong if Theodorus did it, would not be called wrong if Hipparchia did it; Theodorus does no wrong when he hits himself; so Hipparchia does no wrong when she hits Theodorus.

Theodorus had no answer, so he tried to pull off her cloak. She was not upset. Then he quoted a line of Euripides at her: in the *Bacchae*, Queen Agave boasts that she has [left her shuttles at the loom](cts:tlg0006.tlg017:1236) for greater things, hunting beasts with her bare hands. It was a sneer at a woman out of her place.

{{quote:loom}}

## What she stands for

!! Weaving was the work that defined a good Greek wife, from Penelope in the *Odyssey* onwards. Hipparchia's answer turns the insult round: she had not abandoned a woman's work, she had chosen a better use of her time.

{debated} Hipparchia's own writings, if she wrote any, are lost, and we know her almost entirely from Diogenes Laertius, who wrote some five centuries after her. Historians read her life both as evidence that at least one Greek woman lived openly as a philosopher among men, and as a set of anecdotes shaped by the Cynics' love of provocation.

{{timeline}}`,
  quotes: {
    bridegroom: {
      work: "tlg0004.tlg001", ref: "6.7.96", label: "Diogenes Laertius 6.96",
      grc: "ὁ μὲν νυμφίος οὗτος, ἡ δὲ κτῆσις αὕτη, πρὸς ταῦτα βουλεύου·",
      tr: "This is the bridegroom, here are his possessions; make your choice accordingly;",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
    loom: {
      work: "tlg0004.tlg001", ref: "6.7.98", label: "Diogenes Laertius 6.98",
      grc: "αὕτη ʼστὶν ἡ τὰς παρʼ ἱστοῖς ἐκλιποῦσα κερκίδας; ἐγώ, φησίν, εἰμί, Θεόδωρε· ἀλλὰ μὴ κακῶς σοι δοκῶ βεβουλεῦσθαι περὶ αὑτῆς, εἰ, τὸν χρόνον ὃν ἔμελλον ἱστοῖς προσαναλώσειν, τοῦτον εἰς παιδείαν κατεχρησάμην;",
      tr: "Is this she\nWho quitting woof and warp and comb and loom? she replied, It is I, Theodorus,—but do you suppose that I have been ill advised about myself, if instead of wasting further time upon the loom I spent it in education?",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
  },
  timeline: [
    { when: "c. 405 BC", what: "Euripides' Bacchae is first staged, after his death.", certainty: "well" },
    { when: "328–325 BC", what: "The 113th Olympiad, when Crates \"flourished\" according to Diogenes Laertius.", certainty: "debated" },
    { when: "c. 300 BC", what: "Hipparchia marries Crates and lives as a Cynic.", certainty: "debated" },
    { when: "3rd c. AD", what: "Diogenes Laertius gives her a life in his Lives of the Philosophers.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0004.tlg001", ref: "6.7.96", to: "6.7.98", label: "Diogenes Laertius 6.96–98", why: "Her whole life: three short sections." },
    { work: "tlg0004.tlg001", ref: "6.5.85", to: "6.5.93", label: "Diogenes Laertius 6.85–93", why: "The life of Crates, her husband." },
  ],
  related: ["diogenes"],
  primary: [
    { work: "tlg0004.tlg001", ref: "6.7.96", to: "6.7.98", label: "Diogenes Laertius 6.96–98" },
    { work: "tlg0544.tlg001", ref: "1.14.153", label: "Sextus Empiricus, Outlines of Pyrrhonism 1.153" },
    { work: "tlg0006.tlg017", ref: "1236", to: "1237", label: "Euripides, Bacchae 1236–1237" },
  ],
  secondary: [
    { id: "branham-cynics", note: "Essays on the Cynics and what later ages made of them." },
    { id: "desmond-cynics", note: "A clear introduction." },
  ],
  written: "2026-09-27",
};
export default entry;
