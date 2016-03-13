/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="staircase.js" />

var STAIR_BASE = 1.3;

function Experiment() {
	this.staircases = [];
	this.stairIndex = -1;
	this.currentTrial = new Trial();
	this.trials = [];

	this.makeExperiment = function () {
		var counts = [[1,1]];
		var styles = [Object.keys(Styles)[2]];
		for (var c in counts) {
			for (var s in styles) {
				this.staircases.push( {
					staircase: new Staircase(), 
					count1:counts[c][0], 
					count2:counts[c][1], 
					style: Styles[styles[s]]
				});
			}
		}
	};

	// get the current staircase
	this.getCurrentStaircase = function() {
		return this.staircases[this.stairIndex].staircase;
	}

	// convert the level of the staircase to a value
	this.stairLevel2Value = function(index) {
		return Math.pow(STAIR_BASE, index);
	}

	// get the next trial
	this.nextTrial = function() {
		// go to next staircase
		this.stairIndex++;

		// if finished with this round, restart and shuffle
		if (this.stairIndex >= this.staircases.length) {
			this.stairIndex = 0;
			d3.shuffle(this.staircases);
		}
		// get the params for this trial
		var stairparams = this.staircases[this.stairIndex];
		// calculate the diff value from the stair 
		var stairValue = this.stairLevel2Value(this.getCurrentStaircase().valueIndex);
		// make a trial from the this staircase
		var trial = new Trial(
			stairparams.count1, 
			stairparams.count2,
			stairValue,
			stairparams.style);
		// set trial indices
		trial.index = this.trials.length;
		trial.indexStair = this.getCurrentStaircase().trials.length;
		// add trial to staircase and experiment history
		this.trials.push(trial);
		this.getCurrentStaircase().trials.push(trial);
		// set it as the current trial
		this.currentTrial = trial;
		return trial;
	};

	// input an answer
	this.answer = function(setIndex) {
		this.currentTrial.answer(setIndex);
		this.staircases[this.stairIndex].staircase.answer(this.currentTrial.correct);
	};
}




function Trial(count1=6, count2=6, diff=90, style=Styles.position) {
	this.barcount1 = count1;
	this.barcount2 = count2;
	this.baseValue = 200 + Math.random() * 100;
	this.meanDiff = diff;
	this.values1 = [];
	this.values2 = [];
	this.variance1 = 120;
	this.variance2 = 90;
	this.verticalOffsets1 = [];
	this.verticalOffsets2 = [];
	this.index = -1; // global trial index
	this.indexStair = -1; // trial indix only within its staircase
	this.style = style;

	this.maxMean = Math.random() > 0.5;
	this.maxVariance = Math.random() > 0.5;
	this.maxValue = Math.random() > 0.5;
	this.minValue = Math.random() > 0.5;

	this.presentationTime = 1500;
	this.presentationTimeActual = 0;
	this.response;
	this.correct;

	// make the values in the stimulus
	this.makeSets = function() {
		var sets = make2Sets(
			[this.barcount1, this.barcount2], 
			[this.baseValue+this.meanDiff, this.baseValue], 
			[this.variance1, this.variance2], 
			this.maxMean, this.maxVariance, this.maxValue, this.minValue);
		this.values1 = sets[0];
		this.values2 = sets[1];
		this.verticalOffsets1 = this.values1.map(() => Math.floor(Math.random()*151));
		this.verticalOffsets2 = this.values2.map(() => Math.floor(Math.random()*151));
	};
	this.makeSets();

	// record an answer
	this.answer = function(setIndex) {
		this.response = setIndex;
		this.correct = setIndex == this.maxMean;
		// TODO: record RT
	};
}