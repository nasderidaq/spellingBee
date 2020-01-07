# SpellingBee

Program to solve for the 2020-1-3 Riddler Classic found at https://fivethirtyeight.com/features/can-you-solve-the-vexing-vexillology/.

Runnable preview [here](https://htmlpreview.github.io/?https://github.com/nasderidaq/spellingBee/blob/master/spellingBee.html).

Results from the various configurations:

| Word Filter              | Letters     | Score     |
|--------------------------|-------------|-----------|
| ALL_WORDS                |   Eainrst   |    8681   |
| **WITHOUT_S**            | **Raegint** |  **3898** |
| MAX_TWO_VOWELS           |   Edinrst   |    6795   |
| WITHOUT_S_MAX_TWO_VOWELS |   Eadnprt   |    3060   |

## Approach

The code takes a fairly simple approach. It preprocesses the word list checking for validity (minimum length 4, max 7 unique letters, and optionally no 's'), and then scores the word. All words with the same set of unique letters are combined together into a single entry with their point values added together for easy lookup later.

Since there is a restriction that the honeycomb letters must contain a pangram, the program them iterates over every pangram found in the preprocessing step (sets of 7 unique letters - of which there are 7986 total), and turns them into the 7 possible honeycombs (1 for each possible center letter). ~~It then iterates through every combination of remaining unique letters (2^6, or 64 combinations), and simply adds up how many points were found for those sets of unique letters in the preprocessing step. The complete search takes 2-3 seconds.~~

An optimization has been applied where partial point lookups are cached for later, which results in a total speedup of 2x. The complete search over non-s words takes 1.5 seconds, and the complete search over all words takes 2.5 seconds.

The solution "Raegint" makes quite a bit of sense. It allows for "ing" and "er" suffixes, as well as "re" prefixes. It is a bit interesting to me that the consonant "R" outperformed the vowels for the mandatory central spot, but I guess vowels are more likely to replace each other when forming words. (The next best is "Naegirt" for 3782 points, also a consonant from the same set of letters.)

Possibly of interest, when running without the "no S" restriction, the results aren't *too* much higher-scoring. The best answer is "Eainrst", with a score of 8681 - only about twice the value!

## Full score breakdowns

### Raegint (3898)

| Uniques | Points | Word list
|---------|--------|----------
| AER     |     25 | area areae arrear rare rarer rear rearer
| AGR     |      2 | agar raga
| EGR     |     15 | eger egger gree greegree
| AEGR    |     84 | ager agger agree arrearage eager eagerer eagre eggar gager gagger garage gear rage ragee raggee regear reggae
| AIR     |      2 | aria raia
| EIR     |     11 | eerie eerier
| AEIR    |     22 | aerie aerier airer airier
| GIR     |      7 | grig grigri
| AGIR    |      6 | agria ragi
| EGIR    |     17 | greige rerig rigger
| ENR     |      1 | erne
| AENR    |     40 | anear arena earn earner near nearer ranee reearn reran
| AGNR    |     13 | gnar gnarr gran grana rang
| EGNR    |     37 | genre green greener regreen renege reneger
| AEGNR   |    120 | anger arrange arranger engager enrage ganger gangrene garner genera grange granger greengage nagger range ranger rearrange reengage regna
| AINR    |      8 | airn naira rain rani
| EINR    |     17 | inner rein renin rennin
| AEINR   |     19 | inaner narine rainier
| GINR    |     44 | girn girning grin grinning iring rigging ring ringing rinning
| AGINR   |    138 | agrarian airing angaria arraign arraigning arranging garaging garni garring gnarring grain graining ingrain ingraining ragging raging raining ranging raring
| EGINR   |    186 | engineer engineering erring ginger gingering ginner ginnier greeing greenie greenier greening grinner nigger reengineer reengineering regreening reign reigning reining reneging renig renigging rerigging ringer
| AEGINR  |    270 | aginner agreeing anearing anergia angering angrier arginine earing earning earring engrain engraining enraging gainer gangrening garnering gearing grainer grainier grannie gregarine naggier nearing rangier reagin rearing rearranging reearning reengaging regain regainer regaining regearing regina reginae
| ART     |     24 | attar ratatat tart tartar tatar
| ERT     |     27 | rete teeter terete terret tetter tree tret
| AERT    |    127 | aerate arete eater errata rate rater ratter reata retear retreat retreater tare tarre tarter tartrate tater tatter tear tearer terra terrae tetra treat treater
| AGRT    |     13 | grat ragtag tagrag
| EGRT    |     45 | egret getter greet greeter regreet regret regretter
| AEGRT   |    123 | aggregate ergate etagere garget garret garter grate grater great greater reaggregate regatta regrate retag retarget tagger targe target terga
| AIRT    |     21 | airt atria riata tiara trait
| EIRT    |     87 | retie retire retiree retirer rite ritter terrier territ tier tire titer titre titter titterer trier trite triter
| AEIRT   |    135 | arietta ariette artier attire attrite irate irater irritate iterate ratite rattier reiterate retia retiarii tarrier tattier tearier terai terraria titrate
| GIRT    |      3 | girt grit trig
| AGIRT   |      5 | tragi
| EGIRT   |     27 | grittier tergite tiger trigger
| AEGIRT  |     34 | aigret aigrette gaiter irrigate triage
| ANRT    |     50 | antra arrant rant ratan rattan tantara tantra tarn tartan tartana
| ENRT    |    104 | enter enterer entree eterne netter reenter rennet rent rente renter retene teener tenner tenter tern terne terreen terrene treen
| AENRT   |    132 | anteater antre entera entrant entreat errant narrate narrater natter neater ranter ratteen ratten rattener reentrant retreatant tanner ternate terrane
| AGNRT   |      5 | grant
| EGNRT   |     12 | gerent regent
| AEGNRT  |     94 | argent garnet generate grantee granter greaten negater reagent regenerate regnant regrant tanager teenager
| AINRT   |     64 | antiair antiar antiarin intrant irritant riant titrant train trinitarian
| EINRT   |    190 | entire inert inter intern interne internee intertie nettier niter niterie nitre nitrite nittier reinter renitent rentier retine retinene retinite retint teenier tentier terrine tinier tinner tinnier tinter triene trine
| AEINRT  |    232 | arenite attainer entertain entertainer entrain entrainer inerrant inertia inertiae intenerate intreat iterant itinerant itinerate nattier nitrate ratine reattain reinitiate retain retainer retina retinae retirant retrain terrain tertian trainee trainer triennia
| GINRT   |     43 | girting gritting ringgit tiring trigging trining
| AGINRT  |    167 | airting attiring granita granting gratin grating ingratiating intrigant irrigating irritating narrating nitrating ranting rating ratting taring tarring tarting titrating training triaging
| EGINRT  |    218 | engirt entering gettering gittern greeting igniter integer interning interring reentering regreeting regretting reignite reigniting reinterring renting retinting retiring retting ringent teetering tentering tiering tittering treeing triggering
| AEGINRT |    832 | aerating aggregating argentine argentite entertaining entraining entreating garnierite gartering generating gnattier granite gratine gratinee gratineeing greatening ingrate ingratiate integrate integrating intenerating interage intergang interregna intreating iterating itinerating nattering rattening reaggregating reattaining regenerating regranting regrating reinitiating reintegrate reintegrating reiterating retagging retaining retargeting retearing retraining retreating tangerine tangier targeting tattering tearing treating

## Worst score

The worst score in every category is Xcinopr, generating the minimum possible 14 points (Single pangram of length 7 (princox), and no other words can be formed). There isn't even a tie for worst in any category!
