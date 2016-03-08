/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="exoeriment.js" />

function Staircase() {
	this.upRule = 1;
	this.downRule = 3;
	this.incorrects = 0;
	this.corrects = 0;
	this.valueIndex = 16;
	this.reversalCount = 0;
	this.previousDirection = 0;
	this.directionHistory = [];

	// subject responds either correctly or incorrectly
	this.answer = function (isCorrect) {

		if (isCorrect) {
			this.corrects++;
			this.incorrects = 0;
		} else {
			this.corrects = 0;
			this.incorrects++;
		}

		if (this.corrects >= this.downRule)
			this.updateValue(-1);
		else if (this.incorrects >= this.upRule)
			this.updateValue(+1);
	};

	// (private) update valueIndex, state, reversals
	this.updateValue = function (diff) {
		// reset step's internal state
		this.corrects = 0;
		this.incorrects = 0;
		// move the valueIndex up or down
		this.valueIndex += diff;
		// check reversal
		if (diff == -this.previousDirection)
			this.reversalCount++;
		this.previousDirection = diff;
		this.directionHistory.push(diff);
	};
}