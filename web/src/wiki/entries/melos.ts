import type { Entry } from "../types";

const entry: Entry = {
  slug: "melos",
  title: "The Melian Dialogue",
  greek: "Μήλιοι",
  category: "dark",
  kicker: "416 BC: an island asks for justice, and an empire answers",
  image: "melian-relief",
  hook: `In the summer of 416 BC an Athenian fleet of thirty-eight ships anchored off Melos, a small island that wanted no part in the war between Athens and Sparta. Before a spear was thrown, Athenian envoys sat down with the island's leaders and argued. Thucydides wrote the conversation down as a play-script, the only dialogue in his whole *History*, and it has been read ever since as the purest statement of what power says when it stops pretending.`,
  body: `## An island that wanted to stay out

Melos lies in the southern Aegean. Its people were, in Thucydides' words, [colonists of the Lacedaemonians](cts:tlg0003.tlg001:5.84.2), and unlike the other islanders they would not take orders from Athens. They stayed neutral until the Athenians ravaged their land, and then they were at war.

This was not the first attack. Ten years earlier, in 426 BC, Nicias had landed on the island with [sixty ships and two thousand hoplites](cts:tlg0003.tlg001:3.91.1-3.91.3), laid waste the fields, and sailed away when the Melians still would not submit.

{well} In 416 the Athenians came back with [thirty ships of their own, six from Chios and two from Lesbos](cts:tlg0003.tlg001:5.84.1), twelve hundred Athenian hoplites, three hundred archers, twenty mounted archers and about fifteen hundred hoplites from their allies.

## A conversation behind closed doors

The Melian leaders refused to let the envoys speak to the people. They [heard them before the magistrates and the few](cts:tlg0003.tlg001:5.84.3), and the Athenians remarked on it: the leaders did not want the crowd swayed by a single persuasive speech. So the two sides talked point by point.

The Athenians began by ruling out the usual language of right and wrong. They would not claim they ruled by right because they had defeated the Persians, and they did not want to hear that Melos had done Athens no harm.

{{quote:strong}}

The Melians answered that they trusted in the gods, because they were [god-fearing men standing against men who are unjust](cts:tlg0003.tlg001:5.104.1), and in their kin, the Spartans, who would surely help them out of shame if nothing else. The Athenians replied that the gods themselves obey the same law.

{{quote:gods}}

To the end the Melians would not give up the freedom of [a city which has been inhabited already seven hundred years](cts:tlg0003.tlg001:5.112.2). No Spartan help came.

## The siege

The Athenian generals built a wall round the city, [dividing the work among the allied contingents](cts:tlg0003.tlg001:5.114.1). The Melians broke out twice and took part of the wall. Then, in the winter, a second force arrived from Athens under Philocrates, and with treachery inside the walls the Melians surrendered and left their fate to the Athenians.

{{quote:end}}

## Did anyone really say these words?

{debated} Thucydides is open about his method. Of the speeches in his work he says that exact recall was impossible, so each speaker says what the occasion demanded, while he kept as close as he could to the general sense of what was actually said. How far the Melian Dialogue records a real conversation, and how far it is Thucydides' own reflection on power, is one of the oldest arguments about his book.

{{quote:method}}

!! The Melian famine became a joke within two years. In Aristophanes' *Birds*, staged in 414 BC, the birds are told they can starve the gods "with a Melian famine", λιμῷ Μηλίῳ ([Birds 186](cts:tlg0019.tlg006:186)).

## What Athens remembered

When news of the final defeat at Aegospotami reached Athens in 405 BC, Xenophon says no one slept that night. The Athenians mourned the dead, but far more themselves, [thinking that they would suffer such treatment as they had visited upon the Melians](cts:tlg0032.tlg001:2.2.3). They were spared. The Spartan commander Lysander [restored the Melians](cts:tlg0032.tlg001:2.2.9) to their island, as he did the other peoples Athens had driven out.

{{timeline}}`,
  quotes: {
    strong: {
      work: "tlg0003.tlg001", ref: "5.89.1", label: "Thucydides 5.89",
      grc: "δίκαια μὲν ἐν τῷ ἀνθρωπείῳ λόγῳ ἀπὸ τῆς ἴσης ἀνάγκης κρίνεται, δυνατὰ δὲ οἱ προύχοντες πράσσουσι καὶ οἱ ἀσθενεῖς ξυγχωροῦσιν.",
      tr: "what is just is arrived at in human arguments only when the necessity on both sides is equal, and that the powerful exact what they can, while the weak yield what they must.",
      trFrom: "corpus", trBy: "C. F. Smith (1921)",
    },
    gods: {
      work: "tlg0003.tlg001", ref: "5.105.2", label: "Thucydides 5.105",
      grc: "ἡγούμεθα γὰρ τό τε θεῖον δόξῃ τὸ ἀνθρώπειόν τε σαφῶς διὰ παντὸς ὑπὸ φύσεως ἀναγκαίας, οὗ ἂν κρατῇ, ἄρχειν·",
      tr: "For of the gods we hold the belief, and of men we know, that by a necessity of their nature wherever they have power they always rule.",
      trFrom: "corpus", trBy: "C. F. Smith (1921)",
    },
    end: {
      work: "tlg0003.tlg001", ref: "5.116.4", label: "Thucydides 5.116",
      grc: "οἱ δὲ ἀπέκτειναν Μηλίων ὅσους ἡβῶντας ἔλαβον, παῖδας δὲ καὶ γυναῖκας ἠνδραπόδισαν· τὸ δὲ χωρίον αὐτοὶ ᾤκισαν, ἀποίκους ὕστερον πεντακοσίους πέμψαντες.",
      tr: "The Athenians thereupon slew all the adult males whom they had taken and made slaves of the children and women. But the place they then peopled with new settlers from Athens, sending thither at a later time five hundred colonists.",
      trFrom: "corpus", trBy: "C. F. Smith (1921)",
    },
    method: {
      work: "tlg0003.tlg001", ref: "1.22.1", label: "Thucydides 1.22",
      grc: "ὡς δ’ ἂν ἐδόκουν ἐμοὶ ἕκαστοι περὶ τῶν αἰεὶ παρόντων τὰ δέοντα μάλιστ’ εἰπεῖν, ἐχομένῳ ὅτι ἐγγύτατα τῆς ξυμπάσης γνώμης τῶν ἀληθῶς λεχθέντων, οὕτως εἴρηται.",
      tr: "Therefore the speeches are given in the language in which, as it seemed to me, the several speakers would express, on the subjects under consideration, the sentiments most befitting the occasion, though at the same time I have adhered as closely as possible to the general sense of what was actually said.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
  },
  timeline: [
    { when: "426 BC", what: "Nicias ravages Melos with sixty ships; the Melians do not submit.", certainty: "well" },
    { when: "Summer 416 BC", what: "The Athenian expedition arrives; the dialogue; the siege wall.", certainty: "well" },
    { when: "Winter 416/415 BC", what: "Melos surrenders. The men are killed, the women and children enslaved; five hundred Athenian settlers follow.", certainty: "well" },
    { when: "414 BC", what: "Aristophanes' Birds jokes about \"a Melian famine\".", certainty: "well" },
    { when: "405 BC", what: "After Aegospotami the Athenians fear the fate of Melos; Lysander restores the surviving Melians.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "5.84.1", to: "5.116.4", label: "Thucydides 5.84–116", why: "The whole episode: the expedition, the dialogue and the end." },
    { work: "tlg0003.tlg001", ref: "1.22.1", label: "Thucydides 1.22", why: "How Thucydides says he wrote his speeches." },
    { work: "tlg0032.tlg001", ref: "2.2.3", label: "Xenophon, Hellenica 2.2.3", why: "The night Athens feared the same fate." },
  ],
  related: [],
  places: ["570475"],
  primary: [
    { work: "tlg0003.tlg001", ref: "3.91.1", label: "Thucydides 3.91" },
    { work: "tlg0003.tlg001", ref: "5.84.1", to: "5.116.4", label: "Thucydides 5.84–116" },
    { work: "tlg0019.tlg006", ref: "186", label: "Aristophanes, Birds 186" },
    { work: "tlg0032.tlg001", ref: "2.2.3", label: "Xenophon, Hellenica 2.2.3" },
    { work: "tlg0032.tlg001", ref: "2.2.9", label: "Xenophon, Hellenica 2.2.9" },
  ],
  secondary: [
    { id: "hornblower-thuc-3", note: "The fullest modern commentary on the dialogue." },
    { id: "hct-4" },
    { id: "kagan-nicias", note: "The expedition in the history of the war." },
  ],
  written: "2026-09-27",
};
export default entry;
