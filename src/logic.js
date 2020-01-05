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

	const EXPECTED_MAX_LETTERS_POINTS_DIGITS = 3;

	/* Imports */
	const win = window;
	const {
		Math,
		console,
		document,
	} = win;
	const {max} = Math;

	/* Data structures */
	const LettersScore = class {
		constructor(letters) {
			this.letters = letters;
			this.points = 0;
			this.words = [];
		}

		add(word) {
			this.points += WORD_SCORE(word, this.letters);
			this.words.push(word);
		}

		toString() {
			const points = this.points.toString();
			return (
				`${this.letters}${' '.repeat(LETTER_COUNT - this.letters.length)} ` +
				`(${' '.repeat(max(EXPECTED_MAX_LETTERS_POINTS_DIGITS - points.length, 0))}${points}):` +
				` ${this.words.join(' ')}`);
		}
	};

	const BeeScore = class {
		constructor(beeLetters) {
			this.beeLetters = beeLetters;
			this.points = 0;
			this.letters = [];
		}

		add(lettersScore) {
			if (lettersScore) {
				this.points += lettersScore.points;
				this.letters.push(lettersScore);
			}
		}

		toString() {
			return `${this.beeLetters} (${this.points}):\n\t${this.letters.join('\n\t')}`;
		}
	};

	const BeeScoreCollection = class {
		constructor() {
			this.lettersScoreByLength = new Array(LETTER_COUNT + 1);
			for (let i = 0; i <= LETTER_COUNT; i++) {
				this.lettersScoreByLength[i] = new Map();
			}

			this.scores = [];
		}

		getLettersScore(letters) {
			return this.lettersScoreByLength[letters.length].get(letters);
		}

		getOrCreateLettersScore(letters) {
			const letterScoreAtLength = this.lettersScoreByLength[letters.length];
			let lettersScore = letterScoreAtLength.get(letters);
			if (!lettersScore) {
				lettersScore = new LettersScore(letters);
				letterScoreAtLength.set(letters, lettersScore);
			}
			return lettersScore;
		}

		createBeeScore(beeLetters) {
			const beeScore = new BeeScore(beeLetters);
			this.scores.push(beeScore);
			return beeScore;
		}

		processWords(words, filter = ALL_WORDS) {
			words.forEach((word) => {
				const length = word.length;
				if (length >= MIN_LENGTH && filter(word)) {
					const letters = word.match(/(.)(?!.*\1)/g).sort().join('');
					if (letters.length <= LETTER_COUNT) {
						this.getOrCreateLettersScore(letters).add(word);
					}
				}
			});
		}

		enumerateBeePossibilities() {
			this.lettersScoreByLength[LETTER_COUNT].forEach((lettersScore, letters) => {
				letters.split('').forEach((required, i, splitLetters) => {
					const remaining = splitLetters.filter((letter, j) => i !== j);
					const score = this.createBeeScore(required.toUpperCase() + remaining.join(''));

					const maxMask = 1 << (LETTER_COUNT - 1);
					for (let mask = 0; mask < maxMask; mask++) {
						const subLetters = [
							required,
							...remaining.filter((letter, j) => {
								return ((mask >> j) & 1) === 1;
							}),
						].sort().join('');
						score.add(this.getLettersScore(subLetters));
					}
				});
			});
		}

		getBestBeeScore() {
			this.scores.sort((a, b) => b.points - a.points);
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
			appendLog(bestBeeScore ? bestBeeScore.toString() : 'no valid scores found');

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
