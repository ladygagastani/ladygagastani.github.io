import type { Entry } from "../types";

const entry: Entry = {
  slug: "parthenon-marbles",
  title: "The Parthenon Marbles",
  greek: "Παρθενών",
  category: "archaeology",
  kicker: "Carved for Athena, shattered in 1687, divided between Athens and London: the history, and both sides of the argument",
  image: "parthenon-frieze-cast",
  hook: `The sculptures carved for the Parthenon in the fifth century BC now live in two museums. Roughly half of what survives is in the Acropolis Museum in Athens, in sight of the building they were made for; most of the rest is in the British Museum in London, where Lord Elgin's agents sent them in the early 1800s. The white figures on this page are a plaster cast in Athens; the marble they copy is in London. Whether the sculptures should be reunited, and where, is one of the longest-running arguments in the museum world. This entry sets out the history first, then each side in its own words.`,
  body: `## Carved for Athena

The Parthenon was built in the 440s and 430s BC, in the building programme that Pericles paid for, as his critics complained, [with the tribute of Athens' allies](wiki:pericles). Plutarch names the men in charge:

{{quote:pheidias}}

{well} Its sculpture ran all round the building: ninety-two carved panels (metopes) above the outer columns, a continuous frieze about 160 metres long around the inner building, showing a great procession, and in the two triangular gables (pediments) groups of figures larger than life. Pausanias, visiting in the second century AD, tells us what the gables showed:

{{quote:pediments}}

## Twenty-three centuries

{well} The Parthenon survived antiquity largely intact. It became a Christian church and later, under Ottoman rule, a mosque. On 26 September 1687, during a Venetian siege of the Acropolis, a Venetian shell set off the gunpowder that the Ottoman garrison had stored inside it. The explosion blew out the long sides of the building and destroyed much of its sculpture. By 1800, about half of the sculpture that had once decorated the temple was lost.

## Lord Elgin

{well} In 1799 Thomas Bruce, Earl of Elgin, became British ambassador to the Ottoman Sultan in Constantinople. Athens was then an Ottoman town. In 1800 he sent a team of artists there to draw the monuments and make casts. From 1801 his agents went much further: over the next few years they took down and shipped to Britain about half of the Parthenon sculpture that remained, with other pieces from the Acropolis, damaging both sculptures and building as they cut them free. In 1816, deep in debt, Elgin sold the collection to the British government after a parliamentary select committee had examined his conduct, and it passed to the British Museum. Lord Byron was among the loudest critics at the time.

{debated} Everything turns on what Elgin was allowed to do. His authority was a letter from a senior Ottoman official in Constantinople, the deputy of the Grand Vizier, which survives only in an Italian translation. The British Museum's Trustees say that Elgin acted with the knowledge and permission of the lawful authorities in both Athens and London, as the select committee of 1816 concluded. The Greek government says that the letter was never a permit from the Sultan, who alone could have given one, and allowed only drawing, casting and digging for fragments around the foundations, and that the removals relied on bribery.

## Where they are now

{well} According to the Greek Ministry of Culture, of the 97 surviving blocks of the frieze, 56 are in Britain and 40 in Athens; of the 64 surviving metopes, 48 are in Athens and 15 in London; of 28 surviving pediment figures, 19 are in London and 9 in Athens. Other pieces are in museums in several other countries, among them the Louvre and the National Museum of Denmark. No sculpture remains on the building itself: everything still on it has been moved into the Acropolis Museum, which opened in 2009, and replaced with copies. In the museum's glass-walled Parthenon Gallery the originals in Athens are shown together with casts of the pieces elsewhere.

!! Some pieces have already gone back. In 2022 a fragment of the east frieze held in Palermo, once owned by the British consul Robert Fagan, was returned to Athens, first on loan and then permanently; in 2023 Pope Francis gave the Archbishop of Athens three fragments from the Vatican Museums, which went on display in the Acropolis Museum.

## The case for reunion

{debated} The Greek government and the campaigns for return argue that the sculptures belong to a single monument, and should be seen together, in Athens, within sight of the Parthenon; that they were removed without lawful permission; and that the Acropolis Museum was built to show them. Greece has refused any arrangement in which Athens would borrow the sculptures from London, since that would mean accepting the British Museum's ownership. In September 2026 Prime Minister Kyriakos Mitsotakis put it simply: "We cannot borrow parts of our own monument."

## The case for London

{debated} The British Museum's Trustees argue that Elgin acquired the sculptures legally; that in London they are seen free of charge by millions of visitors, beside the other civilisations that ancient Greece knew; that about half the sculpture is lost in any case and none of it could safely go back onto the building; and that two great museums, each showing the sculptures in its own setting, together tell their story more fully than one could. They will consider lending any object, but only to a borrower who acknowledges the Museum's ownership. By law, too, the Trustees may give away objects from the collection only in narrow cases, set out in the [British Museum Act 1963](https://www.britishmuseum.org/sites/default/files/2019-10/British-Museum-Act-1963.pdf), so a permanent return would need Parliament to change the law.

## Where things stand

As of late September 2026, talks between the Greek government and the British Museum, revived in recent years, have stalled over ownership and the idea of a loan; Greece has called for them to resume, and the Museum has said its openness to a deal is unchanged.

{{timeline}}`,
  quotes: {
    pheidias: {
      work: "tlg0007.tlg012", ref: "13.4", label: "Plutarch, Pericles 13.4",
      grc: "πάντα δὲ διεῖπε καὶ πάντων ἐπίσκοπος ἦν αὐτῷ Φειδίας, καίτοι μεγάλους ἀρχιτέκτονας ἐχόντων καὶ τεχνίτας τῶν ἔργων. τὸν μὲν γὰρ ἑκατόμπεδον Παρθενῶνα Καλλικράτης εἰργάζετο καὶ Ἰκτῖνος,",
      tr: "His general manager and general overseer was Pheidias, although the several works had great architects and artists besides. Of the Parthenon, for instance, with its cella of a hundred feet in length, Callicrates and Ictinus were the architects;",
      trFrom: "corpus", trBy: "B. Perrin (1916)",
    },
    pediments: {
      work: "tlg0525.tlg001", ref: "1.24.5", label: "Pausanias 1.24.5",
      grc: "ἐς δὲ τὸν ναὸν ὃν Παρθενῶνα ὀνομάζουσιν, ἐς τοῦτον ἐσιοῦσιν ὁπόσα ἐν τοῖς καλουμένοις ἀετοῖς κεῖται, πάντα ἐς τὴν Ἀθηνᾶς ἔχει γένεσιν, τὰ δὲ ὄπισθεν ἡ Ποσειδῶνος πρὸς Ἀθηνᾶν ἐστιν ἔρις ὑπὲρ τῆς γῆς·",
      tr: "As you enter the temple that they name the Parthenon, all the sculptures you see on what is called the pediment refer to the birth of Athena, those on the rear pediment represent the contest for the land between Athena and Poseidon.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1918)",
    },
  },
  timeline: [
    { when: "440s–430s BC", what: "The Parthenon and its sculptures are made, under Pheidias' direction.", certainty: "well" },
    { when: "2nd c. AD", what: "Pausanias describes the pediments.", certainty: "well" },
    { when: "26 Sept. 1687", what: "A Venetian shell ignites Ottoman gunpowder stored in the Parthenon.", certainty: "well" },
    { when: "1801 onwards", what: "Elgin's agents remove about half the surviving sculpture.", certainty: "well" },
    { when: "1816", what: "After a parliamentary select committee, the collection is bought for the British Museum.", certainty: "well" },
    { when: "1963", what: "The British Museum Act limits when the Trustees may dispose of objects.", certainty: "well" },
    { when: "2009", what: "The Acropolis Museum opens, with its Parthenon Gallery.", certainty: "well" },
    { when: "2022–2023", what: "Fragments from Palermo and the Vatican return to Athens.", certainty: "well" },
    { when: "Sept. 2026", what: "Talks between Greece and the British Museum stall; Greece calls for them to resume.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0007.tlg012", ref: "12.1", to: "13.9", label: "Plutarch, Pericles 12–13", why: "Pericles' building programme, how it was paid for, and who built it." },
    { work: "tlg0525.tlg001", ref: "1.24.5", to: "1.24.7", label: "Pausanias 1.24.5–7", why: "The Parthenon and Pheidias' statue of Athena, as a visitor saw them." },
  ],
  related: ["pericles", "painted-statues", "reading-the-layers"],
  places: ["579885"],
  primary: [
    { work: "tlg0007.tlg012", ref: "12.1", to: "13.9", label: "Plutarch, Pericles 12–13" },
    { work: "tlg0525.tlg001", ref: "1.24.5", to: "1.24.7", label: "Pausanias 1.24.5–7" },
  ],
  secondary: [
    { id: "stclair-elgin", note: "The full history of the removal, from the archives." },
    { id: "beard-parthenon", note: "The building's whole history, and the debate, with the new museum." },
  ],
  written: "2026-09-28",
};
export default entry;
