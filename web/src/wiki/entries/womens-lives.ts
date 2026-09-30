import type { Entry } from "../types";

const entry: Entry = {
  slug: "womens-lives",
  title: "Women's lives",
  greek: "ὁ τῶν γυναικῶν βίος",
  category: "daily",
  kicker: "Unnamed in court, vital at the altar: what Greek women could and could not do",
  image: "fountain-house-hydria",
  hook: `Almost everything we read about Greek women was written by men. At Athens a woman could not vote, speak in the Assembly, or make a contract worth more than a bushel of barley, and a speaker in court would avoid even saying her name. Yet women served the city's greatest goddess as priestesses, sold goods in the market, worked in the fields when times were hard, and at Sparta raced, owned land and answered back. A tragic heroine said she would rather stand in battle three times than give birth once, and a philosopher argued that women could rule. Here is what the sources let us see.`,
  body: `## "Least talk among men"

The most famous words about women in Greek prose come at the end of Pericles' funeral speech for the Athenian dead of 431 BC, as Thucydides reports it. After praising the men, he turns to their widows with a single sentence:

{{quote:pericles}}

Athenian speakers in the law courts seem to have followed the rule. David Schaps showed that orators deliberately avoided naming respectable living women, calling them instead "the wife of" or "the mother of" some man. They named women freely when the women were dead, disreputable, or on the other side of the case.

## A guardian for life

In Athenian law a woman was always in someone's care. Her guardian, her *kyrios*, a word LSJ gives as "guardian of a woman", was her father, then her husband, and acted for her in legal matters. The law also capped what she could do on her own:

{{quote:barley}}

How marriages were arranged, and how a wife could seek a divorce, is told in [Love, sex and marriage](wiki:love-sex-and-marriage).

## "Three times in battle"

Greek tragedy, written by men and performed by men, gives women some of its strongest speeches. In Euripides' *Medea*, staged in 431 BC, Medea tells the women of Corinth that women are "the most hapless creatures" of all: they must [buy a husband with a dowry](cts:tlg0006.tlg003:230-234) and take a master for their body with him. Then she answers the men's claim that women live safely at home:

{{quote:medea}}

Gravestones of women who died in childbirth survive, such as a [painted stele of the early Hellenistic period](https://www.metmuseum.org/art/collection/search/247106) in the Metropolitan Museum.

## Women at work

The ideal of the wife who never left the house was a rich family's ideal. A poor Athenian's mother sold ribbons in the market; when his citizenship was challenged in court, his opponents used it against him, and so did the fact that she had once worked as a wet-nurse. He answered by describing the hard years at the end of the Peloponnesian War:

{{quote:nurses}}

## At the altar

In religion, women had public roles that no man could fill. In Aristophanes' *Lysistrata* the chorus of women recalls the honours of an Athenian girlhood, each a real office in the city's cults:

{{quote:girlhood}}

The priestess of Athena Polias served the city's own goddess on the Acropolis. One of them, Lysimache, held the office for sixty-four years and was honoured with a portrait statue on the Acropolis.

{debated} Joan Breton Connelly has argued that such priestesses show women holding real public power throughout Greek history. Her reviewer Catherine Keesling points out that most of the evidence is late and Athenian, and that the grand public honours for priestesses belong mainly to later centuries, not to the classical period.

## Spartan women

Other Greeks found Spartan women startling. Xenophon explains that Lycurgus, the legendary lawgiver, left the weaving to slave women and trained free girls' bodies instead:

{{quote:sparta}}

Spartan women also owned land. Aristotle, who disapproved, says that [nearly two-fifths of the whole country](cts:tlg0086.tlg035:2.1270a) belonged to women, because so many inherited estates and dowries were large. And Plutarch preserves an answer of Gorgo, wife of King Leonidas:

{{quote:gorgo}}

## Could women rule?

In the fifth book of Plato's *Republic*, Socrates proposes that women should be trained exactly like men and share every task of ruling and guarding the city, on the ground that the difference between the sexes is one of strength, not of kind:

{{quote:plato}}

It was a thought experiment, not a programme, and it came wrapped in proposals for holding wives and children in common. But it was said, and later philosophers argued about it. A few women did take up philosophy, among them [Hipparchia](wiki:hipparchia), and a few, like [Sappho](wiki:love-sex-and-marriage), became poets whom men read for centuries.

{{timeline}}`,
  quotes: {
    pericles: {
      work: "tlg0003.tlg001", ref: "2.45.2", label: "Thucydides 2.45.2",
      grc: "εἰ δέ με δεῖ καὶ γυναικείας τι ἀρετῆς, ὅσαι νῦν ἐν χηρείᾳ ἔσονται, μνησθῆναι, βραχείᾳ παραινέσει ἅπαν σημανῶ. τῆς τε γὰρ ὑπαρχούσης φύσεως μὴ χείροσι γενέσθαι ὑμῖν μεγάλη ἡ δόξα καὶ ἧς ἂν ἐπ’ ἐλάχιστον ἀρετῆς πέρι ἢ ψόγου ἐν τοῖς ἄρσεσι κλέος ᾖ.",
      tr: "If I am to speak also of womanly virtues, referring to those of you who will henceforth be in widowhood, I will sum up all in a brief admonition: Great is your glory if you fall not below the standard which nature has set for your sex, and great also is hers of whom there is least talk among men whether in praise or in blame.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    barley: {
      work: "tlg0017.tlg010", ref: "10", label: "Isaeus 10.10",
      grc: "ὁ γὰρ νόμος διαρρήδην κωλύει παιδὶ μὴ ἐξεῖναι συμβάλλειν μηδὲ γυναικὶ πέρα μεδίμνου κριθῶν.",
      tr: "for the law expressly forbids any child—or woman—to contract for the disposal of more than a bushel of barley.",
      trFrom: "corpus", trBy: "E. S. Forster (1927)",
    },
    medea: {
      work: "tlg0006.tlg003", ref: "248", label: "Euripides, Medea 248–251",
      grc: "λέγουσι δ’ ἡμᾶς ὡς ἀκίνδυνον βίον\nζῶμεν κατ’ οἴκους, οἳ δὲ μάρνανται δορί·\nκακῶς φρονοῦντες· ὡς τρὶς ἂν παρ’ ἀσπίδα\nστῆναι θέλοιμ’ ἂν μᾶλλον ἢ τεκεῖν ἅπαξ.",
      tr: "And yet they say we live secure at home, while they are at the wars, with their sorry reasoning, for I would gladly take my stand in battle array three times o’er, than once give birth.",
      trFrom: "corpus", trBy: "E. P. Coleridge (1906)",
    },
    nurses: {
      work: "tlg0014.tlg057", ref: "45", label: "Demosthenes 57.45, Against Eubulides",
      grc: "ὡς γὰρ ἐγὼ ἀκούω, πολλαὶ καὶ τιτθαὶ καὶ ἔριθοι καὶ τρυγήτριαι γεγόνασιν ὑπὸ τῶν τῆς πόλεως κατʼ ἐκείνους τοὺς χρόνους συμφορῶν ἀσταὶ γυναῖκες, πολλαὶ δʼ ἐκ πενήτων πλούσιαι νῦν.",
      tr: "For, as I am informed, many women have become nurses and laborers at the loom or in the vineyards owing to the misfortunes of the city in those days, women of civic birth, too; and many who were poor then are now rich.",
      trFrom: "corpus", trBy: "A. T. Murray (1939)",
    },
    girlhood: {
      work: "tlg0019.tlg007", ref: "641", label: "Aristophanes, Lysistrata 641–647",
      grc: "ἑπτὰ μὲν ἔτη γεγῶσʼ εὐθὺς ἠρρηφόρουν·\nεἶτʼ ἀλετρὶς ἦ δεκέτις οὖσα τἀρχηγέτι·\nκᾆτʼ ἔχουσα τὸν κροκωτὸν ἄρκτος ἦ Βραυρωνίοις·\nκἀκανηφόρουν ποτʼ οὖσα παῖς καλὴ ʼχουσʼ\nἰσχάδων ὁρμαθόν·",
      tr: "When I was just seven I carried the sacred things for Athena; then at ten I ground the grain for our Lady; then, in the saffron robe, I was a bear at Brauron; and once, a pretty girl, I carried the holy basket, wearing a string of dried figs.",
      trFrom: "site", trBy: "this site",
    },
    sparta: {
      work: "tlg0032.tlg010", ref: "1.4", label: "Xenophon, Constitution of the Lacedaemonians 1.4",
      grc: "ταῖς δʼ ἐλευθέραις μέγιστον νομίσας εἶναι τὴν τεκνοποιίαν πρῶτον μὲν σωμασκεῖν ἔταξεν οὐδὲν ἧττον τὸ θῆλυ τοῦ ἄρρενος φύλου· ἔπειτα δὲ δρόμου καὶ ἰσχύος, ὥσπερ καὶ τοῖς ἀνδράσιν, οὕτω καὶ ταῖς θηλείαις ἀγῶνας πρὸς ἀλλήλας ἐποίησε,",
      tr: "He believed motherhood to be the most important function of freeborn woman. Therefore, in the first place, he insisted on physical training for the female no less than for the male sex: moreover, he instituted races and trials of strength for women competitors as for men,",
      trFrom: "corpus", trBy: "E. C. Marchant (1925)",
    },
    gorgo: {
      work: "tlg0007.tlg004", ref: "14.4", label: "Plutarch, Lycurgus 14.4",
      grc: "εἰπούσης γάρ τινος, ὡς ἔοικε, ξένης πρὸς αὐτὴν ὡς μόναι τῶν ἀνδρῶν ἄρχετε ὑμεῖς αἱ Λάκαιναι, μόναι γάρ, ἔφη, τίκτομεν ἄνδρας.",
      tr: "When some foreign woman, as it would seem, said to her: You Spartan women are the only ones who rule their men, she answered: Yes, we are the only ones that give birth to men.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
    plato: {
      work: "tlg0059.tlg030", ref: "5.456", label: "Plato, Republic 5.456a",
      grc: "καὶ γυναικὸς ἄρα καὶ ἀνδρὸς ἡ αὐτὴ φύσις εἰς φυλακὴν πόλεως, πλὴν ὅσα ἀσθενεστέρα, ἡ δὲ ἰσχυροτέρα ἐστίν.",
      tr: "The women and the men, then, have the same nature in respect to the guardianship of the state, save in so far as the one is weaker, the other stronger.",
      trFrom: "corpus", trBy: "Paul Shorey (1935)",
    },
  },
  timeline: [
    { when: "c. 600 BC", what: "Sappho on Lesbos.", certainty: "well" },
    { when: "431 BC", what: "Euripides' Medea; Pericles' funeral speech.", certainty: "well" },
    { when: "411 BC", what: "Aristophanes' Lysistrata.", certainty: "well" },
    { when: "4th c. BC", what: "Plato's Republic proposes women guardians; Xenophon describes Spartan girls' training.", certainty: "well" },
    { when: "4th c. BC", what: "Speeches in the law courts: the barley law, and a ribbon-seller's son defends his citizenship.", certainty: "well" },
    { when: "later 4th c. BC", what: "Aristotle: two-fifths of Spartan land owned by women.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0006.tlg003", ref: "214", to: "266", label: "Euripides, Medea 214–266", why: "Medea's speech to the women of Corinth." },
    { work: "tlg0014.tlg057", ref: "30", to: "45", label: "Demosthenes 57.30–45", why: "A poor family's women at work, defended in court." },
    { work: "tlg0059.tlg030", ref: "5.451", to: "5.457", label: "Plato, Republic 5.451c–457c", why: "The case for women rulers." },
    { work: "tlg0007.tlg004", ref: "14.1", to: "14.4", label: "Plutarch, Lycurgus 14", why: "How Spartan girls were raised, as later Greeks told it." },
  ],
  related: ["love-sex-and-marriage", "household", "hipparchia", "spartan-upbringing", "pericles"],
  primary: [
    { work: "tlg0003.tlg001", ref: "2.45.2", label: "Thucydides 2.45.2" },
    { work: "tlg0017.tlg010", ref: "10", label: "Isaeus 10.10" },
    { work: "tlg0006.tlg003", ref: "230", to: "251", label: "Euripides, Medea 230–251" },
    { work: "tlg0014.tlg057", ref: "31", to: "45", label: "Demosthenes 57.31–45" },
    { work: "tlg0019.tlg007", ref: "638", to: "647", label: "Aristophanes, Lysistrata 638–647" },
    { work: "tlg0032.tlg010", ref: "1.3", to: "1.4", label: "Xenophon, Constitution of the Lacedaemonians 1.3–4" },
    { work: "tlg0086.tlg035", ref: "2.1270a", label: "Aristotle, Politics 2.1270a" },
    { work: "tlg0007.tlg004", ref: "14.4", label: "Plutarch, Lycurgus 14.4" },
    { work: "tlg0059.tlg030", ref: "5.456", label: "Plato, Republic 5.456a" },
  ],
  secondary: [
    { id: "blundell-women", note: "A clear general account of women in Greece, from Homer to the Hellenistic age." },
    { id: "pomeroy-goddesses", note: "The pioneering study of women in Greece and Rome." },
    { id: "schaps-names", note: "Why Athenian speakers avoided naming respectable women." },
    { id: "connelly-priestess", note: "Priestesses and their public role, a bold and debated thesis." },
  ],
  written: "2026-09-30",
};
export default entry;
