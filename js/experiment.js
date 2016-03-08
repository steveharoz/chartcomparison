﻿/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="staircase.js" />

function Experiment() {
	this.staircases = [];
	this.stairIndex = -1;
	this.currentTrial;
	this.makeExperiment = function () {
		var counts = [[6,6]];
		var styles = Object.keys(Styles);
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
		var stairValue = stairparams.staircase.valueIndex;
		stairValue = Math.pow(1.3, stairValue);
		// make a trial from the this staircase
		var trial = new Trial(
			stairparams.count1, 
			stairparams.count2,
			stairValue,
			stairparams.style);
		// set it as the current trial
		this.currentTrial = trial;
		return trial;
	};

	// input an answer
	this.answer = function(setIndex) {
		trial.answer(setIndex);
		this.staircases[this.stairIndex].staircase.answer(trial.correct);
	};
}




function Trial(count1=6, count2=6, diff=90, style=Styles.position) {
	this.barcount1 = count1;
	this.barcount2 = count2;
	this.meanDiff = diff;
	this.values1 = [];
	this.values2 = [];
	this.variance1 = 120;
	this.variance2 = 90;
	this.verticalOffsets1 = [];
	this.verticalOffsets2 = [];
	this.index = -1;
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
			[200+this.meanDiff, 200], 
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
	};
}