# Paradigm review

`python pipeline/check_paradigms.py` checks every form in `web/src/data/paradigms.ts` against GLAUx
and writes how often each is attested to `web/src/data/paradigms-attested.json`.

Review of the forms not attested with exactly the expected analysis (2026-09-27, 216 of 225 attested):

| Form(s) | Why it is correct |
|---|---|
| δῶρα, χώρα, χῶραι, δόξαι, σώματα, ἀγαθαί, ἀγαθά as **vocatives** | Identical in spelling to the nominative (and for neuters the accusative); vocatives of these words are rare and annotators tag the identical form by its commoner use. The identity of these forms is standard in every reference grammar (e.g. H. W. Smyth, Greek Grammar, on the first, second and third declensions). |
| ἔλυε, ἐλύετε (imperfect of λύω) | Regular forms of the model verb; this particular verb is rare in these forms. The endings are attested on countless other verbs. |

On 2026-09-29 the πόλις table was added (all 11 forms attested, the vocative πόλι included): 227 of 236 attested, and the 9 not attested are the ones above.

Any new form that shows up in the check's list must be reviewed here before it is published.
