import type { Entry } from "../types";

const entry: Entry = {
  slug: "helots",
  title: "The helots and the krypteia",
  greek: "εἵλωτες",
  category: "dark",
  kicker: "The people who fed Sparta, and how Sparta kept them down",
  hook: `Sparta's citizens could spend their lives training for war because someone else grew their food. That someone was the helots: a whole conquered population, bound to the land, handing over half of every harvest. They far outnumbered their masters, and the Spartans never forgot it. Each year, according to Aristotle, Sparta's magistrates formally declared war on them, so that killing a helot would not stain a Spartan with blood-guilt.`,
  body: `## Half of every harvest

The helots were not bought and sold like slaves elsewhere in Greece. The Spartans treated them as a kind of public property: they lived in their own families on the land of Laconia and Messenia, and worked it for Spartan masters. Most of them, Thucydides says, were [descendants of the Messenians enslaved of old](cts:tlg0003.tlg001:1.101.2), a neighbouring people conquered in the eighth and seventh centuries BC. The poet Tyrtaeus, who composed songs for Sparta during the second of those wars, described what conquest meant for them.

{{quote:asses}}

## How many?

{debated} Herodotus says that at Plataea in 479 BC the five thousand Spartans in the army were attended by [thirty-five thousand light-armed helots, seven to each man](cts:tlg0016.tlg001:9.28.2). Whether that ratio held at home is unknown, but ancient writers assume that the helots greatly outnumbered the citizens, and modern estimates agree that they did.

## Fear

Thucydides, writing of 424 BC, makes an observation that explains much of Spartan life.

{{quote:guard}}

He follows it with the worst story he tells about Sparta. The Spartans announced that helots who had served them best in war should come forward to be freed. About two thousand did.

{{quote:vanish}}

{debated} Thucydides gives no date for the massacre, only that it happened before 424. How the two thousand died, as he says himself, no one ever knew.

## The krypteia

The *krypteia*, the "secret service", is described very differently by different ancient writers.

{legend} Plutarch, drawing on Aristotle, says that the magistrates sent out the most promising young men with daggers and a little food. By day they hid; by night they came down to the roads and killed any helot they caught, and they sometimes walked through the fields killing the strongest workers.

{{quote:krypteia}}

In Plato's *Laws*, by contrast, a Spartan describes the krypteia only as a hard training in endurance, going barefoot in winter, sleeping without blankets, roaming the countryside by night and day. Plato says nothing about killing.

{{quote:plato}}

{debated} Modern historians still argue over what the krypteia was: a rite of passage for young Spartans, a form of terror against the helots, or something that changed from one to the other over time. Plutarch himself doubted that it went back to Sparta's lawgiver Lycurgus.

!! Aristotle, as quoted by Plutarch, gives the legal fiction behind the killing: [the ephors, on entering office, declared war on the helots](cts:tlg0007.tlg004:28.4), so that a Spartan who killed one committed no sacrilege.

## The hatred went both ways

In 399 BC a Spartan called Cinadon plotted a revolution. An informer told the magistrates how Cinadon had described the mood of Sparta's underclasses, helots among them.

{{quote:raw}}

## Revolt and freedom

After a great earthquake in the 460s BC the helots of Messenia rose and held out for years on Mount Ithome. They were finally freed in 369 BC, when the Theban general Epaminondas invaded the Peloponnese and refounded Messene as a free city. Sparta never recovered its old power.

{{timeline}}`,
  quotes: {
    asses: {
      work: "tlg0525.tlg001", ref: "4.14.5", label: "Tyrtaeus, quoted by Pausanias 4.14.5",
      grc: "ὥσπερ ὄνοι μεγάλοις ἄχθεσι τειρόμενοι,\nδεσποσύνοισι φέροντες ἀναγκαίης ὑπὸ λυγρῆς\nἥμισυ πᾶν ὅσσων καρπὸν ἄρουρα φέρει.",
      tr: "Like asses worn by their great burdens, bringing of dire necessity to their masters the half of all the fruits the corn-land bears.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1926)",
    },
    guard: {
      work: "tlg0003.tlg001", ref: "4.80.3", label: "Thucydides 4.80",
      grc: "αἰεὶ γὰρ τὰ πολλὰ Λακεδαιμονίοις πρὸς τοὺς Εἵλωτας τῆς φυλακῆς πέρι μάλιστα καθειστήκει",
      tr: "for in fact most of their measures have always been adopted by the Lacedaemonians with a view to guarding against the Helots",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    vanish: {
      work: "tlg0003.tlg001", ref: "4.80.4", label: "Thucydides 4.80",
      grc: "καὶ προκρίναντες ἐς δισχιλίους, οἱ μὲν ἐστεφανώσαντό τε καὶ τὰ ἱερὰ περιῆλθον ὡς ἠλευθερωμένοι, οἱ δὲ οὐ πολλῷ ὕστερον ἠφάνισάν τε αὐτοὺς καὶ οὐδεὶς ᾔσθετο ὅτῳ τρόπῳ ἕκαστος διεφθάρη.",
      tr: "About two thousand of them were selected and these put crowns on their heads and made the rounds of the temples, as though they were already free, but the Spartans not long afterwards made away with them, and nobody ever knew in what way each one perished.",
      trFrom: "corpus", trBy: "C. F. Smith (1920)",
    },
    krypteia: {
      work: "tlg0007.tlg004", ref: "28.2", label: "Plutarch, Lycurgus 28",
      grc: "νύκτωρ δὲ κατιόντες εἰς τὰς ὁδοὺς τῶν εἱλώτων τὸν ἁλισκόμενον ἀπέσφαττον.",
      tr: "but in the night they came down into the highways and killed every Helot whom they caught.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
    plato: {
      work: "tlg0059.tlg034", ref: "1.633", label: "Plato, Laws 633b–c",
      grc: "ἔτι δὲ καὶ κρυπτεία τις ὀνομάζεται θαυμαστῶς πολύπονος πρὸς τὰς καρτερήσεις",
      tr: "the Crypteia, as it is called, affords a wonderfully severe training in hardihood",
      trFrom: "corpus", trBy: "R. G. Bury (1926)",
    },
    raw: {
      work: "tlg0032.tlg001", ref: "3.3.6", label: "Xenophon, Hellenica 3.3.6",
      grc: "ὅπου γὰρ ἐν τούτοις τις λόγος γένοιτο περὶ Σπαρτιατῶν, οὐδένα δύνασθαι κρύπτειν τὸ μὴ οὐχ ἡδέως ἂν καὶ ὠμῶν ἐσθίειν αὐτῶν.",
      tr: "for whenever among these classes any mention was made of Spartiatae, no one was able to conceal the fact that he would be glad to eat them raw.",
      trFrom: "corpus", trBy: "C. L. Brownson (1918)",
    },
  },
  timeline: [
    { when: "8th–7th c. BC", what: "Sparta conquers Messenia; its people become helots.", certainty: "well" },
    { when: "479 BC", what: "At Plataea, Herodotus counts seven helots for every Spartan.", certainty: "debated" },
    { when: "460s BC", what: "After an earthquake the Messenian helots revolt and hold Mount Ithome.", certainty: "well" },
    { when: "Before 424 BC", what: "Two thousand helots, promised freedom, disappear.", certainty: "well" },
    { when: "399 BC", what: "The conspiracy of Cinadon.", certainty: "well" },
    { when: "369 BC", what: "Epaminondas frees Messenia and refounds Messene.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0007.tlg004", ref: "28.1", to: "28.6", label: "Plutarch, Lycurgus 28", why: "The krypteia, and Plutarch's doubts about it." },
    { work: "tlg0003.tlg001", ref: "4.80.2", to: "4.80.5", label: "Thucydides 4.80", why: "Sparta's fear of the helots, and the two thousand." },
    { work: "tlg0032.tlg001", ref: "3.3.4", to: "3.3.11", label: "Xenophon, Hellenica 3.3", why: "The conspiracy of Cinadon." },
    { work: "tlg0525.tlg001", ref: "4.14.4", to: "4.14.5", label: "Pausanias 4.14", why: "Tyrtaeus on the conquered Messenians." },
  ],
  related: ["laurion"],
  primary: [
    { work: "tlg0525.tlg001", ref: "4.14.4", to: "4.14.5", label: "Pausanias 4.14.4–5 (quoting Tyrtaeus)" },
    { work: "tlg0003.tlg001", ref: "1.101.2", label: "Thucydides 1.101" },
    { work: "tlg0003.tlg001", ref: "4.80.2", to: "4.80.5", label: "Thucydides 4.80" },
    { work: "tlg0016.tlg001", ref: "9.28.2", label: "Herodotus 9.28" },
    { work: "tlg0007.tlg004", ref: "28.1", to: "28.6", label: "Plutarch, Lycurgus 28" },
    { work: "tlg0059.tlg034", ref: "1.633", label: "Plato, Laws 633b–c" },
    { work: "tlg0032.tlg001", ref: "3.3.4", to: "3.3.11", label: "Xenophon, Hellenica 3.3.4–11" },
  ],
  secondary: [
    { id: "luraghi-alcock-helots", note: "Current scholarship on the helots, including the krypteia." },
    { id: "cartledge-sparta-lakonia", note: "Sparta, its land and its subject peoples." },
    { id: "hornblower-thuc-2", note: "On the two thousand." },
  ],
  written: "2026-09-27",
};
export default entry;
