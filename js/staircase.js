/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="experiment.js" />

var STAIR_BASE = 1.3;
var STAIR_MIN = 0;
var STAIR_MAX = 200;

function Staircase() {
	this.upRule = 1;
	this.downRule = 3;
	this.incorrects = 0;
	this.corrects = 0;
	this.valueIndex = 13;
	this.reversalCount = 0;
	this.reversalMax = 15; // How man reversals until the staircase stops
	this.previousDirection = 0;
	this.directionHistory = [];
	this.trials = [];
	this.trialCount = 0; // # of trials already run

	// convert the level of the staircase to a value
	this.stairLevel2Value = function () {
		var value = Math.pow(STAIR_BASE, this.valueIndex);
		value = Math.min(Math.max(STAIR_MIN, value), STAIR_MAX);
		console.log(value);
		return value;
	};

	// check if complete
	this.isComplete = function () {
		return this.reversalCount >= this.reversalMax;
	}

	// subject responds either correctly or incorrectly
	this.answer = function (isCorrect) {
		if (isCorrect) {
			this.corrects++;
			this.incorrects = 0;
			console.log('correct ' + this.corrects);
		} else {
			this.corrects = 0;
			this.incorrects++;
			console.log('nope ' + this.incorrects);
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