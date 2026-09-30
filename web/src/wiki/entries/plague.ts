import type { Entry } from "../types";

const entry: Entry = {
  slug: "plague-of-athens",
  title: "The Plague of Athens",
  greek: "ὁ λοιμός",
  category: "dark",
  kicker: "430 BC: a city under siege meets a disease no one could name",
  image: "sweerts-plague",
  hook: `In the summer of 430 BC, with the Spartan army burning the fields of Attica and the whole population crowded inside the city walls, a disease broke out in the port of Piraeus. Within weeks bodies lay in the streets and in the temples. Thucydides caught it himself and survived, and he wrote down its symptoms so that anyone could recognise it if it ever came again. Twenty-four centuries later, no one is sure what it was.`,
  body: `## Into a crowded city

Athens' strategy in the war with Sparta was to abandon the countryside and live behind its walls, supplied by sea. So when the Spartans invaded Attica for the second time in 430 BC, the city was full of refugees. The plague arrived [before they had been many days in Attica](cts:tlg0003.tlg001:2.47.3).

Thucydides reports what he was told of its origin: it began [in Ethiopia beyond Egypt](cts:tlg0003.tlg001:2.48.1) and spread through the Persian empire. It struck Piraeus first, so suddenly that people there said the Spartans had [poisoned the cisterns](cts:tlg0003.tlg001:2.48.2).

## A historian's case notes

Thucydides refuses to guess at causes. Let doctors and laymen say what they like, he writes; he will describe what happened.

{{quote:myself}}

The account that follows is precise and horrible: fever in the head, red and inflamed eyes, a throat and tongue [the colour of blood](cts:tlg0003.tlg001:2.49.2), then sneezing, hoarseness, a cough, vomiting, spasms, a body covered in small blisters and sores, a burning so intense that the sick threw themselves into water tanks. Survivors could lose fingers, toes, eyes or their memory.

## When the rules broke

The refugees had no houses. They lived in stifling huts, and the dying [lay one upon another](cts:tlg0003.tlg001:2.52.2) in the streets and around the fountains. The temples where people camped filled with corpses. Burial customs collapsed: families laid their dead on other people's pyres and walked away.

{{quote:nofear}}

!! Doctors died fastest of all, Thucydides says, because they went nearest the sick. Prayers at the temples and questions to the oracles [were all futile](cts:tlg0003.tlg001:2.47.4), and people gave them up.

## A verse, remembered two ways

In their distress the older Athenians recalled a prophecy: "A Dorian war shall come, and *loimos* with it." The trouble was that *loimos*, plague, differs by one letter from *limos*, famine.

{{quote:verse}}

Thucydides' dry comment is that people remember a prophecy to fit what they are suffering. If a later war brought famine, he expected, [they would recite the verse that way](cts:tlg0003.tlg001:2.54.3).

## The toll

{well} The disease returned in 427/6 BC. By then Athens had lost [no fewer than four thousand four hundred hoplites and three hundred cavalry](cts:tlg0003.tlg001:3.87.3), and of the rest of the population a number no one could discover. Pericles, who had devised the strategy of living behind the walls, died of it in 429 BC; Plutarch says the disease took him [slowly, wearing down his body and his spirit](cts:tlg0007.tlg012:38.1).

## What was it?

{debated} Smallpox, typhus, measles, typhoid and even an Ebola-like fever have all been proposed from Thucydides' description; none fits every symptom. In 2006 a team of Greek researchers reported DNA of the typhoid bacterium in teeth from a mass burial pit in the Kerameikos cemetery dated to the time of the plague. Other specialists in ancient DNA replied at once that this was not proof: the sequences might be modern contamination, and they did not clearly belong to typhoid rather than a related bacterium. The question is still open.

{{timeline}}`,
  quotes: {
    myself: {
      work: "tlg0003.tlg001", ref: "2.48.3", label: "Thucydides 2.48",
      grc: "ταῦτα δηλώσω αὐτός τε νοσήσας καὶ αὐτὸς ἰδὼν ἄλλους πάσχοντας.",
      tr: "For I had the disease myself and saw others sick of it.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    nofear: {
      work: "tlg0003.tlg001", ref: "2.53.4", label: "Thucydides 2.53",
      grc: "θεῶν δὲ φόβος ἢ ἀνθρώπων νόμος οὐδεὶς ἀπεῖργε",
      tr: "No fear of gods or law of men restrained",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    verse: {
      work: "tlg0003.tlg001", ref: "2.54.2", label: "Thucydides 2.54",
      grc: "ἥξει Δωριακὸς πόλεμος καὶ λοιμὸς ἅμ’ αὐτῷ.",
      tr: "A Dorian war shall come and pestilence with it.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
  },
  timeline: [
    { when: "431 BC", what: "War with Sparta; Athens abandons the countryside for the walls.", certainty: "well" },
    { when: "Summer 430 BC", what: "The plague breaks out in Piraeus during the second Spartan invasion.", certainty: "well" },
    { when: "429 BC", what: "Pericles dies of the disease.", certainty: "well" },
    { when: "427/6 BC", what: "The plague returns; the hoplite and cavalry dead are counted.", certainty: "well" },
    { when: "2006", what: "Ancient DNA from a Kerameikos burial pit is claimed as typhoid, and the claim is at once disputed.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "2.47.3", to: "2.54.5", label: "Thucydides 2.47–54", why: "The whole account, symptoms, despair and the prophecy." },
    { work: "tlg0003.tlg001", ref: "3.87.1", to: "3.87.4", label: "Thucydides 3.87", why: "The second outbreak and the count of the dead." },
    { work: "tlg0007.tlg012", ref: "38.1", to: "38.4", label: "Plutarch, Pericles 38", why: "Pericles' last illness." },
  ],
  related: ["melos"],
  places: ["579885", "580062"],
  primary: [
    { work: "tlg0003.tlg001", ref: "2.47.3", to: "2.54.5", label: "Thucydides 2.47–54" },
    { work: "tlg0003.tlg001", ref: "3.87.1", to: "3.87.4", label: "Thucydides 3.87" },
    { work: "tlg0007.tlg012", ref: "38.1", to: "38.4", label: "Plutarch, Pericles 38" },
  ],
  secondary: [
    { id: "hornblower-thuc-1", note: "On Thucydides' account, line by line." },
    { id: "papagrigorakis-2006", note: "The typhoid claim." },
    { id: "shapiro-2006", note: "The reply: no proof." },
  ],
  written: "2026-09-27",
};
export default entry;
