import type { Entry } from "../types";

const entry: Entry = {
  slug: "spartan-upbringing",
  title: "Growing up Spartan",
  greek: "ἡ Λακωνικὴ ἀγωγή",
  category: "education",
  kicker: "Barefoot, hungry and encouraged to steal: the most famous education in history",
  hook: `Everywhere else in Greece a father decided how to bring up his son. In Sparta the state took the boys at seven, put them into packs, and raised them together: barefoot, in one cloak a year, never quite fed, and expected to steal the rest and be beaten if caught. Admirers from Xenophon onwards held it up as a school of courage and obedience. But the fullest accounts were written long after classical Sparta was gone, and historians still argue over how much of the famous picture is true.`,
  body: `## Not like other Greeks

Xenophon, an Athenian who admired Sparta and, Plutarch says, [had his own sons brought up there](cts:tlg0007.tlg044:20.2), begins with the contrast. In other Greek cities, fathers who want the best for their sons hire a slave to watch them, [send them to teachers](cts:tlg0032.tlg010:2.1) of letters, music and wrestling, give them sandals and changes of clothes, and let them eat as much as they want. Lycurgus, Sparta's legendary lawgiver, did the opposite.

{{quote:warden}}

The boys went [barefoot](cts:tlg0032.tlg010:2.3), to harden their feet for climbing and running; they wore [one cloak all year](cts:tlg0032.tlg010:2.4), to face heat and cold; and they were given [too little food](cts:tlg0032.tlg010:2.5), so that they would learn to go hungry.

## Steal, but don't get caught

{{quote:stealing}}

Xenophon's explanation is simple: stealing food takes sleepless nights, ambushes and scouts, so it trains a soldier. The punishment was not for stealing but for [stealing badly](cts:tlg0032.tlg010:2.8).

!! Plutarch tells of a boy who hid a stolen fox cub under his cloak and let it tear at his belly [rather than be found out](cts:tlg0007.tlg004:18.1), until he died. The story is famous, and there is no way to know whether it happened.

## Taken at seven

Plutarch, writing about AD 100, adds much more. At birth, he says, a Spartan baby was not the father's to keep: elders of the tribe [examined it](cts:tlg0007.tlg004:16.1), and a sickly or deformed child was taken to a place called the Apothetae, "the Deposits", at the foot of Mount Taygetus.

{legend} Plutarch is the only ancient writer to describe this inspection, many centuries after the time of which he writes. Infants were abandoned in many Greek cities; whether Sparta had a formal public test is doubted.

At seven, the boys were [enrolled in "herds"](cts:tlg0007.tlg004:16.4), *agelai*, under the bravest and most sensible boy as leader, while older men watched them fight and set them against each other to see who would not run.

{{quote:letters}}

At twelve they gave up tunics altogether and lived dirty, with one cloak a year and almost no baths.

## The altar of Orthia

Xenophon describes a ritual at the sanctuary of Artemis Orthia: boys tried to [snatch as many cheeses as possible](cts:tlg0032.tlg010:2.9) from the altar while others whipped them. By Plutarch's day it had become a test of endurance and a public show.

{{quote:orthia}}

{well} The British School at Athens excavated the sanctuary between 1906 and 1910. Its most visible building is a theatre of the third century AD, built around the old altar so that crowds could watch the whipping.

## How much is true?

{debated} Almost everything we know about the Spartan upbringing comes from outsiders: Xenophon in the fourth century BC, and Plutarch and others under the Roman Empire, when Sparta was a small provincial city proud of its past. The training had lapsed by the third century BC, when King Cleomenes III [restored the *agoge*](cts:tlg0007.tlg051:Cleomenes.11.2), with a Stoic philosopher's help. Some historians, among them Nigel Kennell, argue that the system Plutarch saw had been reformed and revived more than once since then, and that later details have been read back into classical times. Others think the core of the picture is old. What is certain is that the classical Spartans themselves wrote almost nothing about it.

{{timeline}}`,
  quotes: {
    warden: {
      work: "tlg0032.tlg010", ref: "2.2", label: "Xenophon, Constitution of the Spartans 2.2",
      grc: "ὁ δὲ Λυκοῦργος, ἀντὶ μὲν τοῦ ἰδίᾳ ἕκαστον παιδαγωγοὺς δούλους ἐφιστάναι, ἄνδρα ἐπέστησε κρατεῖν αὐτῶν ἐξ ὧνπερ αἱ μέγισται ἀρχαὶ καθίστανται, ὃς δὴ καὶ παιδονόμος καλεῖται,",
      tr: "Lycurgus, on the contrary, instead of leaving each father to appoint a slave to act as tutor, gave the duty of controlling the boys to a member of the class from which the highest offices are filled, in fact to the Warden as he is called.",
      trFrom: "corpus", trBy: "E. C. Marchant (1925)",
    },
    stealing: {
      work: "tlg0032.tlg010", ref: "2.6", label: "Xenophon, Constitution of the Spartans 2.6",
      grc: "ὡς δὲ μὴ ὑπὸ λιμοῦ ἄγαν αὖ πιέζοιντο, ἀπραγμόνως μὲν αὐτοῖς οὐκ ἔδωκε λαμβάνειν ὧν ἂν προσδέωνται, κλέπτειν δʼ ἐφῆκεν ἔστιν ἃ τῷ λιμῷ ἐπικουροῦντας.",
      tr: "On the other hand, lest they should feel too much the pinch of hunger, while not giving them the opportunity of taking what they wanted without trouble he allowed them to alleviate their hunger by stealing something.",
      trFrom: "corpus", trBy: "E. C. Marchant (1925)",
    },
    letters: {
      work: "tlg0007.tlg004", ref: "16.6", label: "Plutarch, Lycurgus 16.6",
      grc: "γράμματα μὲν οὖν ἕνεκα τῆς χρείας ἐμάνθανον ἡ δ’ ἄλλη πᾶσα παιδεία πρὸς τὸ ἄρχεσθαι καλῶς ἐγίνετο καὶ καρτερεῖν πονοῦντα καὶ νικᾶν μαχόμενον.",
      tr: "Of reading and writing, they learned only enough to serve their turn; all the rest of their training was calculated to make them obey commands well, endure hardships, and conquer in battle.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
    orthia: {
      work: "tlg0007.tlg004", ref: "18.1", label: "Plutarch, Lycurgus 18.1",
      grc: "καὶ τοῦτο μὲν οὐδὲ ἀπὸ τῶν νῦν ἐφήβων ἄπιστόν ἐστιν, ὧν πολλοὺς ἐπὶ τοῦ βωμοῦ τῆς Ὀρθίας ἑωράκαμεν ἐναποθνήσκοντας ταῖς πληγαῖς.",
      tr: "And even this story gains credence from what their youths now endure, many of whom I have seen expiring under the lash at the altar of Artemis Orthia.",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
  },
  timeline: [
    { when: "Before c. 600 BC?", what: "Lycurgus gives Sparta its laws, according to Spartan tradition.", certainty: "legend" },
    { when: "c. 380s BC", what: "Xenophon writes the Constitution of the Spartans.", certainty: "debated" },
    { when: "3rd c. BC", what: "King Cleomenes III restores the old Spartan training after it had lapsed.", certainty: "well" },
    { when: "c. AD 100", what: "Plutarch writes the Life of Lycurgus, and sees boys whipped at the altar of Orthia.", certainty: "well" },
    { when: "3rd c. AD", what: "A theatre is built around the altar of Orthia for spectators.", certainty: "well" },
    { when: "1906–1910", what: "The British School at Athens excavates the sanctuary.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0032.tlg010", ref: "2.1", to: "2.14", label: "Xenophon, Constitution of the Spartans 2", why: "The upbringing, by an admirer who knew Sparta." },
    { work: "tlg0007.tlg004", ref: "16.1", to: "18.4", label: "Plutarch, Lycurgus 16–18", why: "The fullest account, from the Roman period." },
  ],
  related: ["helots", "school"],
  primary: [
    { work: "tlg0032.tlg010", ref: "2.1", to: "2.14", label: "Xenophon, Constitution of the Spartans 2" },
    { work: "tlg0007.tlg004", ref: "16.1", to: "18.4", label: "Plutarch, Lycurgus 16–18" },
    { work: "tlg0007.tlg051", ref: "Cleomenes.11.2", label: "Plutarch, Cleomenes 11.2" },
  ],
  secondary: [
    { id: "kennell-gymnasium", note: "Argues that much of the system Plutarch describes is a later revival." },
    { id: "ducat-spartan-education", note: "Collects and weighs every source." },
    { id: "dawkins-orthia", note: "The excavation of the sanctuary of Orthia." },
  ],
  written: "2026-09-27",
};
export default entry;
