/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="experiment.js" />

var STAIR_MIN = 0;
var STAIR_MAX = 200;

class Staircase {
	constructor() {
		// staircase properties:
		this.upRule = 1;
		this.downRule = 3;
		this.levelMax = Infinity; // only matters for carryOn == false
		this.levelMin = -Infinity; // only matters for carryOn == false
		this.carryOn = true; // when level hits the min/max, carry on or truncate?
		this.reversalMax = Infinity; // How man reversals until the staircase stops
		this.trialMax = Infinity; // How man trials until the staircase stops
		// state variables:
		this.directionHistory = [];
		this.trials = []; // past trials
		this.level = 14; // the current stair level
		// private properties:
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
		return this._reversalCount >= this.reversalMax ||
			   this.trials.length >= Math.floor(this.trialMax);
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

	// (private) update level, state, reversals
	updateValue(diff) {
		// reset step's internal state (matters when the up/down rules > 1)
		this._corrects = 0;
		this._incorrects = 0;
		// move the level up or down
		this.level += diff;
		// constrain level to bounds
		if (!this.carryOn)
			this.level = Math.min(Math.max(this.levelMin, this.level), this.levelMax);
		// check reversal
		if (diff == -this._previousDirection)
			this._reversalCount++;
		this._previousDirection = diff;
		this.directionHistory.push(diff);
	};
}

// The stair value grows/shrinks exponentially
class ExponentialStaircase extends Staircase {
	constructor(exponentBase = 1.3) {
		// call base class's constructor
		super();
		// variables specific to this class
		this.exponentBase = exponentBase;
	}
	
	// convert the level of the staircase to a value
	stairLevel2Value() {
		var value = Math.pow(this.exponentBase, this.level);
		value = Math.min(Math.max(STAIR_MIN, value), STAIR_MAX);
		console.log(value);
		return value;
	};
}

// The stair value is indexed from a sorted array
class ArrayStaircase extends Staircase {
	constructor(values = [0, 5, 10, 20, 30]) {
		// call base class's constructor
		super();
		this.level = values.length - 1; // the current stair level
		this.carryOn = false; //truncate
		this.levelMax = values.length - 1;
		this.levelMin = 0;
		// variables specific to this class
		this.values = values;
	}
	
	// convert the level of the staircase to a value
	stairLevel2Value() {
		console.log('value index: ' + this.level);
		var level = this.level; 
		// check that level is within bounds of the array
		// allow negative levels but limit value to 0
		if (this.carryOn) 
			level = Math.min(this.level, this.values.length-1); 
		var value = level < 0 ? 0 : this.values[level];
		console.log('value: ' + value);
		return value;
	};
}