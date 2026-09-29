# Paradigm review

`python pipeline/check_paradigms.py` checks every form in `web/src/data/paradigms.ts` against GLAUx
and writes how often each is attested to `web/src/data/paradigms-attested.json`.

Review of the forms not attested with exactly the expected analysis (2026-09-27, 216 of 225 attested):

| Form(s) | Why it is correct |
|---|---|
| δῶρα, χώρα, χῶραι, δόξαι, σώματα, ἀγαθαί, ἀγαθά as **vocatives** | Identical in spelling to the nominative (and for neuters the accusative); vocatives of these words are rare and annotators tag the identical form by its commoner use. The identity of these forms is standard in every reference grammar (e.g. H. W. Smyth, Greek Grammar, on the first, second and third declensions). |
| ἔλυε, ἐλύετε (imperfect of λύω) | Regular forms of the model verb; this particular verb is rare in these forms. The endings are attested on countless other verbs. |

On 2026-09-29 the πόλις table was added (all 11 forms attested, the vocative πόλι included): 227 of 236 attested, and the 9 not attested are the ones above.

On 2026-09-29 the middle and passive of λύω were added (tables `luomai` and `luo-mp-aorist`, 36 forms): 241 of 268 attested. λύω is rare outside the 3rd person in these voices, so 18 new forms are not attested for λύω itself. Each was checked instead on verbs built the same way (GLAUx counts with the same analysis):

| λύω form(s) not attested | The same ending on another verb |
|---|---|
| ἐλυόμην, ἐλύου | ἐπαυόμην 3, ἐπαύου 1 (παύω) |
| ἐλυόμεθα, ἐλύεσθε, λύεσθε | ἐβουλόμεθα 20, ἐβούλεσθε 21 (βούλομαι); ἐγιγνόμεθα 3, ἐγίγνεσθε 2; παύεσθε 4 |
| λύει, λύῃ (2nd sg. middle/passive) | Identical in spelling to the active λύει and the subjunctive λύῃ, and tagged by those uses; παύῃ as 2nd sg. middle 4; Attic -ει and older -ῃ are both standard (Smyth, Greek Grammar §628) |
| λύσει, λύσῃ (2nd sg. future middle) | παύσει 10, παύσῃ 48 |
| λύσεται, λυσόμεθα, λύσεσθε, λύσονται | παύσεται 102, παυσόμεθα 15, παύσεσθε 17, παύσονται 38 |
| ἐλυσάμεθα, ἐλύσασθε | ἐπαυσάμεθα 8, ἐπαύσασθε 3 |
| ἐλύθης, ἐλύθημεν, ἐλύθητε | ἐπείσθης 8, ἐπείσθημεν 8, ἐπείσθητε 15 (πείθω); ἐσώθης 11, ἐσώθημεν 10, ἐσώθητε 4 (σῴζω) |

The imperfect active ἐλύετε (above) is likewise found as ἐλέγετε 17 and ἐπέμπετε 3.

Any new form that shows up in the check's list must be reviewed here before it is published.
