/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="experiment.js" />

var STAIR_BASE = 1.3;
var STAIR_MIN = 0;
var STAIR_MAX = 200;

class Staircase {
	constructor() {
		this.upRule = 1;
		this.downRule = 1;
		this.valueIndex = 14;
		this.valueIndexMax = Infinity;
		this.valueIndexMin = -Infinity;
		this.carryOn = true; // when valueIndex hits the min/max, carry on or truncate?
		this.reversalMax = 15; // How man reversals until the staircase stops
		this.directionHistory = [];
		this.trials = [];
		this.trialCount = 0; // # of trials already run
		// private properties
		this._corrects = 0;
		this._incorrects = 0;
		this._previousDirection = 0;
		this._reversalCount = 0;
	}

	// convert the level of the staircase to a value
	stairLevel2Value() {
		throw new Error("this class doesn't work on its own");
	};

	// check if complete
	isComplete() {
		return this._reversalCount >= this.reversalMax;
	}

	// subject responds either correctly or incorrectly
	answer(isCorrect) {
		if (isCorrect) {
			this._corrects++;
			this._incorrects = 0;
			console.log('correct ' + this._corrects);
		} else {
			this._corrects = 0;
			this._incorrects++;
			console.log('nope ' + this._incorrects);
		}

		if (this._corrects >= this.downRule)
			this.updateValue(-1);
		else if (this._incorrects >= this.upRule)
			this.updateValue(+1);
	};

	// (private) update valueIndex, state, reversals
	updateValue(diff) {
		// reset step's internal state (matters when the up/down rules > 1)
		this._corrects = 0;
		this._incorrects = 0;
		// move the valueIndex up or down
		this.valueIndex += diff;
		// constrain valueIndex to bounds
		if (!this.carryOn)
			this.valueIndex = Math.min(Math.max(this.valueIndexMin, this.valueIndex), this.valueIndexMax);
		// check reversal
		if (diff == -this._previousDirection)
			this._reversalCount++;
		this._previousDirection = diff;
		this.directionHistory.push(diff);
	};
}

class ExponentialStaircase extends Staircase {
	constructor(exponentBase = 1.3) {
		// call base class's constructor
		super();
		// variables specific to this class
		this.exponentBase = exponentBase;
	}
	
	// convert the level of the staircase to a value
	stairLevel2Value() {
		var value = Math.pow(this.exponentBase, this.valueIndex);
		value = Math.min(Math.max(STAIR_MIN, value), STAIR_MAX);
		console.log(value);
		return value;
	};
	
}