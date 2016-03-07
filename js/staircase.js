/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="exoeriment.js" />

function Staircase() {
	this.upRule = 1;
	this.downRule = 3;
	this.state = 0;
	this.valueIndex = 16;
	this.reversalCount = 0;
	this.previousDirection = 0;
	this.directionHistory = [];

	// subject responds either correctly or incorrectly
	this.answer = function (isCorrect) {
		var diff = -(isCorrect * 2 - 1); // -1 for correct
		this.state += diff;
		if (this.state <= this.downRule)
			this.updateValue(-1);
		else if (this.state >= this.upRule)
			this.updateValue(+1);
	};

	// (private) update valueIndex, state, reversals
	this.updateValue = function (diff) {
		this.state = 0;
		this.valueIndex += diff;
		if (diff == -this.previousDirection)
			this.reversalCount++;
		this.previousDirection = diff;
		this.directionHistory.push(diff);
	};
}