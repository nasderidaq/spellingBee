'use strict';

/*
 * https://fivethirtyeight.com/features/can-you-solve-the-vexing-vexillology/
 *
 * Word Filter  Letters  Score
 *
 * WITHOUT_S    Raegint  3898
 * ALL_WORDS    Eainrst  8681
 */

{
	/* Parameters */

	const LETTER_COUNT = 7;
	const PANGRAM_BONUS = LETTER_COUNT;
	const MIN_LENGTH = 4;
	const WORD_SCORE = (word, letters) => {
		const length = word.length;
		return (length === MIN_LENGTH ? 1 : length) + (letters.length === LETTER_COUNT ? PANGRAM_BONUS : 0);
	};

	const ALL_WORDS = (word) => true;
	const WITHOUT_S = (word) => !/s/.test(word);
	const FILTER_OPTIONS = [
		[ALL_WORDS, 'all words'],
		[WITHOUT_S, 'without \'s\'', true],
	];

	const EXPECTED_MAX_LETTERS_POINTS_DIGITS = 4;

	/* Imports */

	const win = window;
	const {
		Math,
		console,
		document,
	} = win;
	const {max} = Math;

	/* Helpers */

	const Uniques = {
		/* "Uniques" is the term used for the set of unique letters that are used to form words.
		 * It is represented by a single sorted string. All capital letters in the string are "required", while all lowercase letters are "optional".
		 * A unique can be decomposed into versions of itself where optional letters are either dropped or become (uppercase) required letters.
		 *
		 * e.g. "ESat"
		 *
		 * composed of: AEST + AES + EST + ES
		 * subcomponents can also include: AESt, ESTa, ESa, ESt
		 *
		 * NOT composed of: AET, AST, AE, AS, AT, ET, A, E, S, T
		 * also NOT subcomponents: East, Saet, aest
		 *
		 * valid word examples:
		 * AEST: asset assets east easts eats estate estates seat seats state states taste tastes teas tease teases...
		 * AES:  ease eases seas...
		 * EST:  sets tees test tests...
		 * ES:   sees...
		 */

		split(uniques) {
			const [, required, optional] = /^([A-Z]*)([a-z]*)$/.exec(uniques);
			return [required, optional];
		},

		addToRequired(required, newRequired) {
			return [...required, ...newRequired.toUpperCase()].sort().join('');
		},

		decompose(uniques) {
			const [required, optional] = Uniques.split(uniques);
			if (optional.length === 0) {
				return [];
			}
			const requiredAndOneOptional = Uniques.addToRequired(required, optional.charAt(0));
			const remainingOptional = optional.substr(1);
			return [
				requiredAndOneOptional + remainingOptional,
				required + remainingOptional,
			];
		},
	};

	/* Data structures */

	const BeeScore = class {
		constructor(uniques, points) {
			this.uniques = uniques;
			this.points = points;
		}

		toString(collection) {
			return `${this.uniques} (${this.points}):\n\t${this.getUniques(collection).join('\n\t')}`;
		}

		getUniques(collection) {
			const lines = [];

			const [required, optional] = Uniques.split(this.uniques);
			const maxMask = 1 << (LETTER_COUNT - 1);
			for (let mask = 0; mask < maxMask; mask++) {
				const subUniques = Uniques.addToRequired(required, optional.split('').filter((letter, j) => {
					return ((mask >> j) & 1) === 1;
				}).join(''));
				const words = collection.uniquesToWords.get(subUniques);
				if (words) {
					const points = collection.uniquesToPoints.get(subUniques).toString();
					lines.push(
						`${subUniques}${' '.repeat(LETTER_COUNT - subUniques.length)} ` +
						`(${' '.repeat(max(EXPECTED_MAX_LETTERS_POINTS_DIGITS - points.length, 0))}${points}):` +
						` ${words.join(' ')}`);
				}
			}
			return lines;
		}
	};

	const BeeScoreCollection = class {
		constructor() {
			this.uniquesToWords = new Map();
			this.uniquesToPoints = new Map();
			this.pangrams = new Set();
			this.scores = [];
		}

		getUniquesPoints(uniques) {
			let score = this.uniquesToPoints.get(uniques);
			if (score === undefined) {
				const childUniques = Uniques.decompose(uniques);
				if (childUniques.length === 0) {
					return 0;
				}
				score = 0;
				for (const childUnique of childUniques) {
					score += this.getUniquesPoints(childUnique);
				}
				this.uniquesToPoints.set(uniques, score);
			}
			return score;
		}

		processWords(words, filter = ALL_WORDS) {
			words.forEach((word) => {
				const length = word.length;
				if (length >= MIN_LENGTH && filter(word)) {
					const letters = word.match(/(.)(?!.*\1)/g).sort().join('');
					if (letters.length <= LETTER_COUNT) {
						const uniques = letters.toUpperCase();
						let words = this.uniquesToWords.get(uniques);
						if (words === undefined) {
							words = [];
							this.uniquesToWords.set(uniques, words);
						}
						words.push(word);
						const previousScore = this.uniquesToPoints.get(uniques) || 0;
						this.uniquesToPoints.set(uniques, previousScore + WORD_SCORE(word, letters));

						if (letters.length === LETTER_COUNT) {
							this.pangrams.add(uniques);
						}
					}
				}
			});
		}

		enumerateBeePossibilities() {
			for (const letters of this.pangrams) {
				letters.split('').forEach((required, i, splitLetters) => {
					const remaining = splitLetters.filter((letter, j) => i !== j);
					const uniques = required + remaining.join('').toLowerCase();
					this.scores.push(new BeeScore(uniques, this.getUniquesPoints(uniques)));
				});
			}
			this.scores.sort((a, b) => b.points - a.points);

		}

		getBestBeeScore() {
			return this.scores[0];
		}

		compute(words, filter) {
			this.processWords(words, filter);
			this.enumerateBeePossibilities();
			return this.getBestBeeScore();
		}
	};

	/* UI */

	{
		const wordFilterSelectContainer = document.createElement('div');
		document.body.appendChild(wordFilterSelectContainer);
		const wordFilterSelect = document.createElement('select');
		wordFilterSelectContainer.appendChild(wordFilterSelect);
		const optionMap = new Array(FILTER_OPTIONS.length);
		FILTER_OPTIONS.forEach(([filter, name, defaultSelected], i) => {
			optionMap[i] = filter;
			const option = document.createElement('option');
			option.value = i;
			if (defaultSelected) {
				option.selected = true;
			}
			option.appendChild(document.createTextNode(name));
			wordFilterSelect.appendChild(option);
		});

		const startButtonContainer = document.createElement('div');
		document.body.appendChild(startButtonContainer);
		const startButton = document.createElement('button');
		startButton.appendChild(document.createTextNode('start'));
		startButton.addEventListener('click', (event) => {
			const filter = optionMap[wordFilterSelect.value];
			clearLog();

			const beeScores = new BeeScoreCollection();
			const start = Date.now();
			const bestBeeScore = beeScores.compute(words, filter);
			const end = Date.now();

			/* Exports */
			win.beeScores = beeScores;
			win.bestBeeScore = bestBeeScore;
			win.words = words;

			/* Output */
			appendLog(bestBeeScore ? bestBeeScore.toString(beeScores) : 'no valid scores found');

			console.log(bestBeeScore);
			console.log(beeScores);
			console.log('Elapsed time (s)', (end - start) / 1000);
		});
		startButtonContainer.appendChild(startButton);

		const pre = document.createElement('pre');
		document.body.appendChild(pre);
		const output = document.createTextNode('');
		pre.appendChild(output);

		const clearLog = () => {
			output.nodeValue = '';
		};
		const appendLog = (data) => {
			output.nodeValue += `${data}\n`;
		};
	}

	// Must be updated: see words.js.
	const words = [];
}
