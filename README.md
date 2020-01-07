# SpellingBee

Program to solve for the 2020-1-3 Riddler Classic found at https://fivethirtyeight.com/features/can-you-solve-the-vexing-vexillology/.

Runnable preview [here](https://htmlpreview.github.io/?https://github.com/nasderidaq/spellingBee/blob/master/spellingBee.html).

Results from the various configurations:

| Word Filter | Letters | Score |
|-------------|---------|-------|
| WITHOUT_S   | Raegint |  3898 |
| ALL_WORDS   | Eainrst |  8681 |

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
| aer     |     25 | area areae arrear rare rarer rear rearer
| agr     |      2 | agar raga
| egr     |     15 | eger egger gree greegree
| aegr    |     84 | ager agger agree arrearage eager eagerer eagre eggar gager gagger garage gear rage ragee raggee regear reggae
| air     |      2 | aria raia
| eir     |     11 | eerie eerier
| aeir    |     22 | aerie aerier airer airier
| gir     |      7 | grig grigri
| agir    |      6 | agria ragi
| egir    |     17 | greige rerig rigger
| enr     |      1 | erne
| aenr    |     40 | anear arena earn earner near nearer ranee reearn reran
| agnr    |     13 | gnar gnarr gran grana rang
| egnr    |     37 | genre green greener regreen renege reneger
| aegnr   |    120 | anger arrange arranger engager enrage ganger gangrene garner genera grange granger greengage nagger range ranger rearrange reengage regna
| ainr    |      8 | airn naira rain rani
| einr    |     17 | inner rein renin rennin
| aeinr   |     19 | inaner narine rainier
| ginr    |     44 | girn girning grin grinning iring rigging ring ringing rinning
| aginr   |    138 | agrarian airing angaria arraign arraigning arranging garaging garni garring gnarring grain graining ingrain ingraining ragging raging raining ranging raring
| eginr   |    186 | engineer engineering erring ginger gingering ginner ginnier greeing greenie greenier greening grinner nigger reengineer reengineering regreening reign reigning reining reneging renig renigging rerigging ringer
| aeginr  |    270 | aginner agreeing anearing anergia angering angrier arginine earing earning earring engrain engraining enraging gainer gangrening garnering gearing grainer grainier grannie gregarine naggier nearing rangier reagin rearing rearranging reearning reengaging regain regainer regaining regearing regina reginae
| art     |     24 | attar ratatat tart tartar tatar
| ert     |     27 | rete teeter terete terret tetter tree tret
| aert    |    127 | aerate arete eater errata rate rater ratter reata retear retreat retreater tare tarre tarter tartrate tater tatter tear tearer terra terrae tetra treat treater
| agrt    |     13 | grat ragtag tagrag
| egrt    |     45 | egret getter greet greeter regreet regret regretter
| aegrt   |    123 | aggregate ergate etagere garget garret garter grate grater great greater reaggregate regatta regrate retag retarget tagger targe target terga
| airt    |     21 | airt atria riata tiara trait
| eirt    |     87 | retie retire retiree retirer rite ritter terrier territ tier tire titer titre titter titterer trier trite triter
| aeirt   |    135 | arietta ariette artier attire attrite irate irater irritate iterate ratite rattier reiterate retia retiarii tarrier tattier tearier terai terraria titrate
| girt    |      3 | girt grit trig
| agirt   |      5 | tragi
| egirt   |     27 | grittier tergite tiger trigger
| aegirt  |     34 | aigret aigrette gaiter irrigate triage
| anrt    |     50 | antra arrant rant ratan rattan tantara tantra tarn tartan tartana
| enrt    |    104 | enter enterer entree eterne netter reenter rennet rent rente renter retene teener tenner tenter tern terne terreen terrene treen
| aenrt   |    132 | anteater antre entera entrant entreat errant narrate narrater natter neater ranter ratteen ratten rattener reentrant retreatant tanner ternate terrane
| agnrt   |      5 | grant
| egnrt   |     12 | gerent regent
| aegnrt  |     94 | argent garnet generate grantee granter greaten negater reagent regenerate regnant regrant tanager teenager
| ainrt   |     64 | antiair antiar antiarin intrant irritant riant titrant train trinitarian
| einrt   |    190 | entire inert inter intern interne internee intertie nettier niter niterie nitre nitrite nittier reinter renitent rentier retine retinene retinite retint teenier tentier terrine tinier tinner tinnier tinter triene trine
| aeinrt  |    232 | arenite attainer entertain entertainer entrain entrainer inerrant inertia inertiae intenerate intreat iterant itinerant itinerate nattier nitrate ratine reattain reinitiate retain retainer retina retinae retirant retrain terrain tertian trainee trainer triennia
| ginrt   |     43 | girting gritting ringgit tiring trigging trining
| aginrt  |    167 | airting attiring granita granting gratin grating ingratiating intrigant irrigating irritating narrating nitrating ranting rating ratting taring tarring tarting titrating training triaging
| eginrt  |    218 | engirt entering gettering gittern greeting igniter integer interning interring reentering regreeting regretting reignite reigniting reinterring renting retinting retiring retting ringent teetering tentering tiering tittering treeing triggering
| aeginrt |    832 | aerating aggregating argentine argentite entertaining entraining entreating garnierite gartering generating gnattier granite gratine gratinee gratineeing greatening ingrate ingratiate integrate integrating intenerating interage intergang interregna intreating iterating itinerating nattering rattening reaggregating reattaining regenerating regranting regrating reinitiating reintegrate reintegrating reiterating retagging retaining retargeting retearing retraining retreating tangerine tangier targeting tattering tearing treating
