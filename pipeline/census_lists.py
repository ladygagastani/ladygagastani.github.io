"""
The hand-made lists behind the Census (read by build_census.py). Every name mentioned at least
NAMES_CHECKED_MIN times, and every object word at least OBJECTS_CHECKED_MIN times, was looked at by
hand; what GLAUx's own tags got wrong is corrected here. Names are GLAUx dictionary words exactly as
GLAUx spells them; the builder stops if one of them is not a GLAUx dictionary word.

A dictionary word can stand for several people (Ἀλέξανδρος is Alexander the Great and also Paris of
Troy). The Census counts words, so such a name is sorted by what it mostly means across the library,
and the page says so.
"""

NAMES_CHECKED_MIN = 100
OBJECTS_CHECKED_MIN = 100

# Gods, heroes and the other figures of Greek myth and legend (GLAUx tags them all "human").
GODS_HEROES = set("""
Ζεύς Ἡρακλῆς Ἡρακλέης Ἀπόλλων Φοῖβος Ἀθήνη Παλλάς Ἑρμῆς Ἀφροδίτη Κύπρις Ἄρης Ἥρα Ποσειδῶν Διόνυσος
Ἄρτεμις Δημήτηρ Κόρα Κρόνος Κρονίδης Κρονίων Ῥέα Λητώ Θέτις Ἥφαιστος ᾍδης Πλούτων Μοῦσα Ἀσκληπιός
Πάν Ἑκάτη Σεμέλη Μήνη Τιτάν Ἄτλας Προμηθεύς Τυφῶν Ἐρινύς Νηρηΐς Σειρήν Σφίγξ Κύκλωψ Κένταυρος
Χείρων Πρωτεύς Αἴολος Ἀχελῷος Ἄδωνις Διόσκοροι Κάστωρ Πολυδεύκης Χάρων Μαρσύας Ὠρίων
Ἶσις Ὄσιρις Ἄμμων Ἆπις Σατανᾶς
Ὀδυσσεύς Ἀχιλλεύς Αἰακίδης Ἕκτωρ Ἀγαμέμνων Μενέλαος Ἀτρείδης Ἀτρεύς Αἴας Ἑλένη Πρίαμος Πάρις
Νέστωρ Πάτροκλος Αἰνείας Διομήδης Τυδεΐδης Τυδεύς Ὀρέστης Τηλέμαχος Πηνελόπεια Ἀλκίνοος Πηλεύς
Νεοπτόλεμος Ἰδομενεύς Σαρπηδών Ἀντίλοχος Εὐρύπυλος Παλαμήδης Φιλοκτήτης Τεῦκρος Τελαμών
Πρωτεσίλαος Ἐπειός Δάρδανος Αἴγισθος Αἰακός Τήλεφος Κίρκη
Θησεύς Πειρίθοος Αἰγεύς Ἐρεχθεύς Μίνως Ῥαδάμανθυς Δαίδαλος Περσεύς Πέλοψ Τάνταλος Οἰνόμαος
Οἰδίπους Πολυνείκης Κρέων Ἄδραστος Ἀμφιάραος Θέρσανδρος Κάδμος Ἀγήνωρ Ἀμφίων Ἀμφιτρύων Ἀλκμήνη
Εὐρυσθεύς Ἡρακλείδαι Ἰάσων Μήδεια Αἰήτης Μελέαγρος Οἰνεύς Νηλεύς Ἄδμητος Λυγκεύς Δαναός Φαέθων
Δευκαλίων Λυκάων Μίδας Ὀρφεύς Ῥωμύλος
""".split())
GODS_HEROES.discard("Περσεύς")   # mostly Perseus, the last king of Macedon (Polybius, Plutarch, Appian)

# Corrections to the class GLAUx gives most often.
OVERRIDES = {
    # a people, not one person
    "Ἰσραήλ": "people",      # mostly the people of Israel
    "Ἴων": "people",         # mostly "the Ionians" (Herodotus, Pausanias, Strabo)
    "Δωριεύς": "people",     # mostly "the Dorians"
    "Σπαρτιάτης": "people", "Μεγαρεύς": "people", "Λάκων": "people", "Μαντινεύς": "people",
    "Αἰολεύς": "people", "Αἰγινήτης": "people", "Χαλκιδεύς": "people", "Πλαταιεύς": "people",
    "Σικελιώτης": "people", "Ἰταλιώτης": "people", "Μεγαλοπολίτης": "people", "Λεοντῖνος": "people",
    "Ῥηγῖνος": "people", "Ἡρακλεώτης": "people", "Ἰσραηλίτης": "people", "Σαμαρείτης": "people",
    "Λευίτης": "people",     # the tribe of Levi
    "Εἵλως": "people",       # the helots of Sparta
    "Ἀμαζών": "people", "Φαίαξ": "people",   # peoples of legend
    # a place
    "Ἴλιος": "place", "Καρχηδών": "place", "Σαρδώ": "place", "Περσίς": "place", "Τρῳάς": "place",
    "Κολχίς": "place", "Πυθώ": "place", "Πελλήνη": "place", "Χαναάν": "place", "Καπετώλιον": "place",
    # a person
    "Ποσειδώνιος": "person",   # the philosopher Posidonius
    "Ἰσαῖος": "person",        # the orator Isaeus
    "Ἀδριανός": "person",      # the emperor Hadrian
    "Μαρδοχαῖος": "person",    # Mordecai
}

# Capitalised dictionary words that are not names of a person, god, place or people, or that
# GLAUx's dictionary form gets wrong. They are left out, and the Census page lists them.
LEFT_OUT = {
    "Ὀλύμπιος": "an epithet (“Olympian”), mostly of Zeus",
    "Πύθιος": "an epithet (“Pythian”), mostly of Apollo",
    "Ἄρειος": "an adjective (“of Ares”), as in the Areopagus",
    "Ἡράκλειος": "an adjective (“of Heracles”)",
    "Στωϊκός": "a school of philosophy (“Stoic”)",
    "Πυθαγόρειος": "a school of philosophy (“Pythagorean”)",
    "Ἐπικούρειος": "a school of philosophy (“Epicurean”)",
    "Χριστιανός": "a religious group (“Christian”), not a people",
    "Φαρισαῖος": "a religious group (“Pharisee”), not a people",
    "Ἑλληνίς": "an adjective (“Greek”), mostly of cities and the language",
    "Τρωϊκός": "an adjective (“Trojan”), mostly of the war",
    "Ἰόνιος": "an adjective, mostly of the Ionian Sea",
    "Αἰγαῖος": "an adjective, mostly of the Aegean Sea",
    "Κάσπιος": "an adjective, mostly of the Caspian Sea",
    "Ἀράβιος": "an adjective, mostly of the Arabian Gulf",
    "Ἰδαῖος": "shared by Mount Ida and the herald Idaeus",
    "Ἰκάριος": "shared by Icarius and the Icarian Sea",
    "Δώριος": "an adjective, mostly of the Doric dialect",
    "Ἐλευσίνιος": "an adjective, mostly of the Mysteries",
    "Φαλερῖνος": "an adjective, mostly of Falernian wine",
    "Ἀτθίς": "shared by Attica, histories of Attica and Sappho's Atthis",
    "Παναθήναια": "a festival",
    "Ἀμφικτύονες": "a league of peoples, not one people",
    "Βάκχη": "the worshippers of Dionysus, not a people",
    "Ἰλιάς": "a poem, the Iliad",
    "Ἀργώ": "a ship, the Argo",
    "Ἰχθύς": "the constellation Pisces",
    "Ἀρκτοῦρος": "a star, Arcturus",
    "Αἰγόκερως": "the constellation Capricorn",
    "Μεγάλη": "“great”, part of longer names",
    "Περι": "not a name: the word “On…” in book titles (Diogenes Laertius)",
    "Ἀπολλώνιον": "not a separate name: a form of Ἀπολλώνιος",
}

# Object words: corrections to the group the WordNet sense gives (None = left out).
OBJECT_OVERRIDES = {
    "μνᾶ": "money",             # the mina, not the myna bird
    "χαλκῖτις": "materials",    # copper ore, not a plant
    "ἰγνύα": "body",            # the back of the knee, not ham
    "ἔμβρυον": None, "ἄγρα": None, "τριηραρχία": None, "ἀπαρχή": None, "εἰσφορά": None,
    "σμῆνος": None, "δράγμα": None, "μετρητής": None, "ἀρτάβη": None, "συμμετρία": None,
    "διάπλασις": None, "κηρίον": None, "στάδιον": None, "ὄργανον": None, "οἰκουμένη": None,
    "πόρος": None, "χιτών": None, "τρόχισκος": None, "πλινθίον": None, "κανών": None,
    "εἰρεσία": None, "ὕδωρ": None, "οὖρον": None, "οὖρος": None, "διαχώρημα": None, "κόπρος": None,
    "ἀκοντιστής": None,
    "κτίσμα": None,            # "creation, creature", not an animal
    "κύημα": None,             # an embryo
    "ἴς": None,                # "sinew, strength"
    "χοῦς": None,              # earth heaped up, and a liquid measure
    "σίδιον": None,            # pomegranate rind, as a drug
    "χοιράς": None,            # a reef, and in medicine a swollen gland
    "καταφυγή": None,          # "refuge", an idea more than a building
    "καταγωγή": None,          # "lodging" and "putting in to shore"
    "σκόλοψ": None,            # a stake or thorn, not the spine
    "ὄψ": None,                # "voice" (Homer), not juice
    "χρηματισμός": None,       # "business", and an oracle's answer
    "πάναξ": "plants",         # the healing plant all-heal, not the beaver
    "ἀφρόνιτρον": "materials", # "foam of soda", not anise
    "κιβωτός": "containers",   # a chest; mostly the Ark of the Covenant
}
