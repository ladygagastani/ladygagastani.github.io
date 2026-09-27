import type { Entry } from "../types";

const entry: Entry = {
  slug: "pythagoras",
  title: "Pythagoras and the beans",
  greek: "Πυθαγόρας",
  category: "weird",
  kicker: "The mathematician who would not eat beans, and who remembered his past lives",
  image: "pythagoras-capitoline",
  hook: `Every schoolchild knows Pythagoras' theorem. Fewer know that the Greeks remembered Pythagoras less as a mathematician than as a holy man: a teacher who said the soul is reborn in other bodies, recognised a dead friend in the yelp of a beaten puppy, founded a secretive brotherhood in southern Italy, and forbade his followers to eat beans. One story says he died rather than run through a bean field.`,
  body: `## A man who wrote nothing

Pythagoras was born on the island of Samos and, around 530 BC, moved to Croton in the south of Italy, where he gathered followers who lived by strict rules and shared their property. He left no writings, and his followers attributed their own discoveries to him, so almost everything about him is disputed. Our fullest accounts were written some seven or eight centuries later.

{debated} Historians separate the Pythagoras of legend from what can be traced to his own time. The earliest witnesses, writing within a lifetime of him, mention his learning (Heraclitus sneered that [much learning does not teach sense](cts:tlg0004.tlg001:9.1.1), or it would have taught Pythagoras) and his teaching about the soul; the mathematics comes later.

## A friend in a puppy

The oldest surviving mention of Pythagoras is a joke. The poet Xenophanes, a younger contemporary, mocked his belief that souls pass from body to body, humans and animals alike.

{{quote:puppy}}

Pythagoras was said to remember his own earlier lives: among others, he had been Euphorbus, a Trojan [wounded by Menelaus](cts:tlg0004.tlg001:8.1.4) in the *Iliad*.

## Why not beans?

The Pythagoreans lived by a list of rules, some sensible and some very strange: [do not stir the fire with a knife](cts:tlg0004.tlg001:8.1.17), do not pick up crumbs that fall from the table, do not eat the heart. Above all, Diogenes Laertius says, Pythagoras [forbade beans](cts:tlg0004.tlg001:8.1.19). Nobody was sure why, not even Aristotle, who gave a list of possible reasons.

{{quote:beans}}

!! The last reason is a puzzle. Beans were used to [choose officials by lot](wiki:kleroterion), which Greeks normally thought democratic, not oligarchic. The text may be damaged here, or the reason may be a political jibe from a hostile source.

## Death in a bean field

The Pythagoreans became powerful in the cities of southern Italy, and hated. At some point in the late sixth or fifth century BC their meeting houses were attacked and burned. Diogenes Laertius collects several versions of how Pythagoras died.

{{quote:field}}

Other writers said he [starved himself to death](cts:tlg0004.tlg001:8.1.40) in a temple of the Muses at Metapontum, or was killed fighting for Acragas, again while trying to go round a bean field.

{legend} The bean-field death is almost certainly a story built on the bean rule. What seems solid is that the Pythagorean societies were violently suppressed, and that some members escaped to carry on the tradition.

## And the theorem?

{debated} A late writer in Diogenes Laertius says Pythagoras [sacrificed oxen](cts:tlg0004.tlg001:8.1.12) to celebrate discovering that the square on the hypotenuse equals the squares on the other two sides, an odd act for a man said to forbid killing animals. The rule itself was known centuries earlier in Babylonia, where scribes used it in calculations, and no early source says Pythagoras proved it. Whether he did any mathematics at all is argued; that his followers did, and linked numbers to music and the order of the universe, is certain.

{{timeline}}`,
  quotes: {
    puppy: {
      work: "tlg0004.tlg001", ref: "8.1.36", label: "Xenophanes, quoted by Diogenes Laertius 8.36",
      grc: "καί ποτέ μιν στυφελιζομένου σκύλακος παριόντα\nφασὶν ἐποικτῖραι καὶ τόδε φάσθαι ἔπος·\nπαῦσαι μηδὲ ῥάπιζʼ, ἐπεὶ ἦ φίλου ἀνέρος ἐστὶ\nψυχή, τὴν ἔγνων φθεγξαμένης ἀΐων.",
      tr: "Once, they say, as he passed a puppy being beaten, he took pity on it and spoke these words: \"Stop, do not strike it, for it is the soul of a friend; I knew him when I heard its voice.\"",
      trFrom: "site", trBy: "this site",
    },
    beans: {
      work: "tlg0004.tlg001", ref: "8.1.34", label: "Diogenes Laertius 8.34",
      grc: "φησὶ δʼ Ἀριστοτέλης ἐν τῷ Περὶ τῶν Πυθαγορείων παραγγέλλειν αὐτὸν ἀπέχεσθαι τῶν κυάμων ἤτοι ὅτι αἰδοίοις εἰσὶν ὅμοιοι ἢ ὅτι ᾍδου πύλαις. * * ἀγόνατον γὰρ μόνον· ἢ ὅτι φθείρει ἢ ὅτι τῇ τοῦ ὅλου φύσει ὅμοιον ἢ ὅτι ὀλιγαρχικόν· κληροῦνται γοῦν αὐτοῖς.",
      tr: "According to Aristotle in his work On the Pythagoreans, Pythagoras counselled abstinence from beans either because they are like the genitals, or because they are like the gates of Hades . . . as being alone unjointed, or because they are injurious, or because they are like the form of the universe, or because they belong to oligarchy, since they are used in election by lot.",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
    field: {
      work: "tlg0004.tlg001", ref: "8.1.39", label: "Diogenes Laertius 8.39",
      grc: "τὸν δὴ Πυθαγόραν καταληφθῆναι διεξιόντα· καὶ πρός τινι χωρίῳ γενόμενος πλήρει κυάμων, ἵνα [αὐτόθι] ἔστη, εἰπὼν ἁλῶναι ἂν μᾶλλον ἢ πατῆσαι",
      tr: "Pythagoras was caught as he tried to escape; he got as far as a certain field of beans, where he stopped, saying he would be captured rather than cross it,",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
  },
  timeline: [
    { when: "c. 570 BC", what: "Pythagoras is born on Samos.", certainty: "debated" },
    { when: "c. 530 BC", what: "He moves to Croton in southern Italy and founds his community.", certainty: "well" },
    { when: "late 6th c. BC", what: "Xenophanes mocks his teaching that souls are reborn.", certainty: "well" },
    { when: "c. 500 BC?", what: "Death of Pythagoras, by one of several reported means.", certainty: "legend" },
    { when: "5th c. BC", what: "Attacks on the Pythagorean societies in southern Italy.", certainty: "well" },
    { when: "3rd c. AD", what: "Diogenes Laertius, Porphyry and Iamblichus write lives of Pythagoras.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0004.tlg001", ref: "8.1.1", to: "8.1.50", label: "Diogenes Laertius 8.1–50", why: "The life, with the rules, the theorem and the deaths." },
  ],
  related: ["diogenes", "kleroterion"],
  places: ["452317", "599926"],
  primary: [
    { work: "tlg0004.tlg001", ref: "8.1.1", to: "8.1.50", label: "Diogenes Laertius 8.1–50" },
  ],
  secondary: [
    { id: "burkert-lore-science", note: "The classic study: Pythagoras as a sage more than a scientist." },
    { id: "kahn-pythagoras", note: "A short history of Pythagoreanism down to Kepler." },
  ],
  written: "2026-09-27",
};
export default entry;
