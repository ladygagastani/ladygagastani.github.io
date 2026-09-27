import type { Entry } from "../types";

const entry: Entry = {
  slug: "antikythera-mechanism",
  title: "The Antikythera mechanism",
  category: "strange",
  kicker: "A bronze calculator of the heavens, from a shipwreck of about 60 BC",
  hook: `In 1901, divers working a shipwreck off the small island of Antikythera brought up bronze and marble statues, glass and pottery, and a shapeless lump of corroded bronze and wood. A year later someone noticed a gearwheel inside it. More than a century of study, lately with X-ray scanning, has shown that it was a hand-cranked machine that modelled the movements of the sun and moon, predicted eclipses and counted the years to the next Olympic Games. Nothing remotely like it survives from the ancient world.`,
  body: `## A wreck full of treasure

The wreck was found in 1900 by sponge divers sheltering from a storm, and salvaged in 1900–1901 in one of the first large underwater recoveries. The ship, which went down around 70–60 BC, was carrying luxury goods, probably towards Italy. Among the finds was a wooden box about the size of a large book, which broke into fragments as it dried. On 17 May 1902 the archaeologist Valerios Stais saw a gearwheel in one of them.

{well} Today there are 82 fragments, holding about thirty bronze gearwheels. Perhaps a third of the original machine survives.

## What it did

Turning a handle on the side moved everything at once. On the front, pointers showed the position of the sun and moon in the zodiac and the date in a 365-day calendar; a small half-silvered ball turned to show the phase of the moon. On the back were two great spiral dials.

- The upper spiral counted a cycle of 235 lunar months, which equal nineteen solar years almost exactly, so that a calendar of months could be kept in step with the seasons.
- The lower spiral covered 223 lunar months, the cycle after which eclipses repeat, and marked the months in which eclipses of the sun and moon could be expected.
- Smaller dials counted the four-year cycle of the great games: Olympia, Nemea, the Isthmus and Delphi.

{well} The gearing even reproduced the moon's changing speed across the sky, using two gears on slightly different axes linked by a pin in a slot: a mechanical model of an astronomical theory.

## The astronomy behind it

The cycles were not invented for the machine. Greek astronomers had worked them out and wrote them down. The astronomer Geminus, probably of the first century BC, explains the nineteen-year cycle, and credits it to Euctemon, Philip and Callippus.

{{quote:cycle}}

He also defines the *exeligmos*, three eclipse cycles long, which appears on the mechanism's eclipse dial too.

{{quote:exeligmos}}

## Who made it, and when?

{debated} The month names on the calendar dial are those of Corinth or one of its colonies, which has led some researchers to suggest Syracuse, the Corinthian colony where Archimedes had built a famous model of the heavens in the third century BC, and others the Corinthian colonies of north-western Greece. The date of manufacture is also argued: the inscriptions look like second-century BC lettering, and some calculations based on the eclipse dial point to a starting date in the late third century BC.

{debated} The front of the machine is badly damaged, and whether it also showed the five planets known in antiquity is reconstructed rather than seen. The inscriptions name planets, and the most detailed modern reconstruction, published in 2021, includes them.

!! Thousands of letters of Greek text survive on the fragments: labels on the dials and a kind of user's guide, much of it readable only with modern scanning. Tiny inscriptions in the cells of the eclipse spiral give details of each eclipse the machine predicted.

## Why it matters

Before the mechanism, historians assumed that geared machines of this complexity were a late medieval invention. The mechanism shows that the Hellenistic world had the mathematical astronomy and the craftsmanship to build a working model of the heavens. It is also a warning: it survived by the accident of a shipwreck, and there may have been others like it that were melted down for their bronze.

{{timeline}}`,
  quotes: {
    cycle: {
      work: "tlg1383.tlg001", ref: "8.50", label: "Geminus, Introduction to the Phenomena 8.50",
      grc: "ἑτέραν περίοδον συνεστήσαντο τὴν τῆς ἐννεακαιδεκαετηρίδος οἱ περὶ Εὐκτήμονα καὶ Φίλιππον καὶ Κάλλιππον ἀστρολόγοι.",
      tr: "the astronomers Euctemon, Philip and Callippus established another period, the nineteen-year cycle.",
      trFrom: "site", trBy: "this site",
    },
    exeligmos: {
      work: "tlg1383.tlg001", ref: "18.1", label: "Geminus, Introduction to the Phenomena 18.1",
      grc: "Ἐξελιγμός ἐστι χρόνος ἐλάχιστος περιέχων ὅλους μῆνας καὶ ὅλας ἡμέρας καὶ ὅλας ἀποκαταστάσεις τῆς σελήνης.",
      tr: "The exeligmos is the shortest period that contains a whole number of months, a whole number of days and a whole number of returns of the moon.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "c. 205–100 BC", what: "The mechanism is made; the exact date is disputed.", certainty: "debated" },
    { when: "c. 70–60 BC", what: "The ship carrying it sinks off Antikythera.", certainty: "well" },
    { when: "1900–1901", what: "Sponge divers find the wreck; the cargo is salvaged.", certainty: "well" },
    { when: "17 May 1902", what: "Valerios Stais notices a gearwheel in one fragment.", certainty: "well" },
    { when: "1974", what: "Derek de Solla Price publishes Gears from the Greeks, from X-ray images.", certainty: "well" },
    { when: "2005–2006", what: "New X-ray scans and surface imaging reveal far more gears and text.", certainty: "well" },
    { when: "2021", what: "A reconstruction of the front, with the planets, matching all the evidence then known.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg1383.tlg001", ref: "8.1", to: "8.60", label: "Geminus 8", why: "Months, years and the cycles that reconcile them." },
    { work: "tlg1383.tlg001", ref: "18.1", to: "18.19", label: "Geminus 18", why: "The exeligmos, the triple eclipse cycle." },
  ],
  related: [],
  primary: [
    { work: "tlg1383.tlg001", ref: "8.1", to: "8.60", label: "Geminus, Introduction to the Phenomena 8" },
    { work: "tlg1383.tlg001", ref: "18.1", to: "18.19", label: "Geminus, Introduction to the Phenomena 18" },
  ],
  secondary: [
    { id: "jones-portable-cosmos", note: "The whole story, from the wreck to the latest research." },
    { id: "price-gears", note: "The first detailed study." },
    { id: "freeth-2006", note: "The scans that transformed the subject." },
    { id: "freeth-2008", note: "The Corinthian calendar and the games dial." },
    { id: "freeth-2021", note: "A reconstruction of the whole front." },
  ],
  written: "2026-09-27",
};
export default entry;
