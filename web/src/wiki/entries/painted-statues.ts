import type { Entry } from "../types";

const entry: Entry = {
  slug: "painted-statues",
  title: "Greek statues were painted",
  category: "beautiful",
  kicker: "The white marble we admire is what time left behind",
  image: "peplos-kore-colour",
  hook: `The gleaming white marble of Greek sculpture, admired for centuries as the image of classical purity, is a modern accident. Greek statues and temples were painted: skin tinted, eyes coloured, clothes patterned in red, blue, green and gold. The paint has mostly worn away, but traces survive, the Greeks themselves mention it, and scientists can now make invisible pigments glow.`,
  body: `## What the Greeks said

The ancient texts take painted sculpture for granted. In Plato's *Republic*, Socrates compares his ideal city to a statue being painted, and imagines a critic who complains about the colours.

{{quote:plato}}

In Euripides' *Helen*, the heroine, whose beauty has caused a war, wishes she could have it removed like the paint of a statue.

{{quote:helen}}

The Greek word she uses, *agalma*, means a statue or image, especially one of a god; the verb is the one for wiping or rubbing something off.

## What the stones show

{well} Traces of paint survive on many Greek sculptures, from the Archaic period onwards, often visible to the naked eye in the folds of drapery, in the hair and in the eyes. The *korai*, the statues of young women dedicated on the Athenian Acropolis in the sixth century BC and buried after the Persian sack of 480 BC, still show bands of colour and painted patterns on their dresses. Temple sculpture was painted too, its figures picked out against coloured backgrounds.

Today conservators trace colours with raking light, ultraviolet photography and chemical analysis. One pigment, Egyptian blue, the most common blue of antiquity, gives off infrared light when lit with ordinary visible light: photographed with a modified camera, the faintest invisible traces of it glow white.

!! Egyptian blue is the oldest known artificial pigment. A special imaging technique developed in the 2000s made it possible to find it in places where no colour could be seen at all.

## How the statues turned white

The paint was fragile. Most of it faded, flaked or was washed off during two thousand years in the ground and in collections. When Renaissance and later collectors found ancient marbles, they found them mostly white, and imitated them white. In the eighteenth century the German scholar Johann Joachim Winckelmann made white marble the very ideal of Greek beauty, and neoclassical art followed him.

## Colour restored, and argued about

{debated} Since the exhibition *Gods in Color*, first shown in Munich in 2003, archaeologists have made full-colour replicas of Greek sculptures based on the traces they can detect. The replicas are startling, and they are hypotheses. Critics argue that surviving traces show where colour was, not how it looked: how bright, how blended, how finely shaded. The reconstructions use flat areas of pigment because that is what can be proved, and ancient painters may well have been subtler.

What is not in doubt is the main point: to the Greeks, a finished statue was a painted one.

{{timeline}}`,
  quotes: {
    plato: {
      work: "tlg0059.tlg030", ref: "4.420", label: "Plato, Republic 420c–d",
      grc: "ὥσπερ οὖν ἂν εἰ ἡμᾶς ἀνδριάντα γράφοντας προσελθών τις ἔψεγε λέγων ὅτι οὐ τοῖς καλλίστοις τοῦ ζῴου τὰ κάλλιστα φάρμακα προστίθεμεν—οἱ γὰρ ὀφθαλμοὶ κάλλιστον ὂν οὐκ ὀστρείῳ ἐναληλιμμένοι εἶεν ἀλλὰ μέλανι",
      tr: "It is as if we were coloring a statue and someone approached and censured us, saying that we did not apply the most beautiful pigments to the most beautiful parts of the image, since the eyes, which are the most beautiful part, have not been painted with purple but with black",
      trFrom: "corpus", trBy: "Paul Shorey (1930)",
    },
    helen: {
      work: "tlg0006.tlg014", ref: "262", label: "Euripides, Helen 262–263",
      grc: "εἴθʼ ἐξαλειφθεῖσʼ ὡς ἄγαλμʼ αὖθις πάλιν\nαἴσχιον εἶδος ἔλαβον ἀντὶ τοῦ καλοῦ,",
      tr: "If only I could be wiped clean like a statue, and take a plainer form in place of my beauty",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "6th c. BC", what: "Painted korai are dedicated on the Athenian Acropolis.", certainty: "well" },
    { when: "480 BC", what: "The Persians sack the Acropolis; the korai are later buried, preserving much of their paint.", certainty: "well" },
    { when: "412 BC", what: "Euripides' Helen wishes her beauty could be wiped off like a statue's.", certainty: "well" },
    { when: "1764", what: "Winckelmann's History of the Art of Antiquity makes white marble the ideal of Greek beauty.", certainty: "well" },
    { when: "2003", what: "Gods in Color opens in Munich, with full-colour reconstructions.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0059.tlg030", ref: "4.420", label: "Plato, Republic 420c–d", why: "Socrates and the critic of painted eyes." },
    { work: "tlg0006.tlg014", ref: "255", to: "305", label: "Euripides, Helen 255–305", why: "Helen's lament about her own beauty." },
  ],
  related: [],
  places: ["579885"],
  primary: [
    { work: "tlg0059.tlg030", ref: "4.420", label: "Plato, Republic 420c–d" },
    { work: "tlg0006.tlg014", ref: "262", to: "263", label: "Euripides, Helen 262–263" },
  ],
  secondary: [
    { id: "brinkmann-gods-in-color", note: "The exhibition catalogue, with the reconstructions and the evidence." },
    { id: "chroma-2025", note: "Current research, including new finds of colour and the debate over reconstruction." },
    { id: "verri-2009", note: "How Egyptian blue is made to glow." },
  ],
  written: "2026-09-27",
};
export default entry;
