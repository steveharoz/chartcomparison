/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="staircase.js" />

class Experiment {
	constructor() {
		this.staircases = [];
		this.stairIndex = -1;
		this.currentTrial = new Trial();
		this.trials = [];
	}

	makeExperiment () {
		var counts = [[1,1], [2,2], [6,6]];
		var styles = [Styles.position, Styles.extent, Styles.position_extent];
		for (var c in counts) {
			for (var s in styles) {
				this.staircases.push( {
					staircase: new ArrayStaircase([1,2,4,6,8,11,14,18,25,34,45,60]), 
					count1:counts[c][0], 
					count2:counts[c][1], 
					style: styles[s]
				});
			}
		}
		d3.shuffle(this.staircases);
	}

	// get the current staircase
	getCurrentStaircase() {
		return this.staircases[this.stairIndex].staircase;
	}

	// determine if all staircases are finished
	isFinished() {
		return this.staircases.every(function(s) {return s.staircase.isComplete();});
	}

	// get the next trial
	nextTrial() {
		// go to next staircase
		this.stairIndex++;

		// if finished with this round, restart and shuffle
		if (this.stairIndex >= this.staircases.length) {
			this.stairIndex = 0;
			d3.shuffle(this.staircases);
		}

		// if staircase is complete, go to the next one
		while(this.stairIndex < this.staircases.length && this.getCurrentStaircase().isComplete())
			this.stairIndex++;
		// if all done, finished
		if (this.isFinished()) {
			return null; // signifiy that it's finished
		}

		// get the params for this trial
		var stairparams = this.staircases[this.stairIndex];
		// calculate the diff value from the stair 
		var stairValue = this.getCurrentStaircase().stairLevel2Value();
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
	}

	// input an answer
	answer(setIndex) {
		this.currentTrial.answer(setIndex);
		this.staircases[this.stairIndex].staircase.answer(this.currentTrial.correct);
	}
}




class Trial {
	constructor(count1=6, count2=6, diff=90, style=Styles.position) {
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

		this.presentationTime = debug ? 1500 : 5000;
		this.response;
		this.correct;
		this.RT;
		this.maxRT = 2000;
		
		this.makeSets();
	}

	// make the values in the stimulus
	makeSets() {
		var sets = make2Sets(
			[this.barcount1, this.barcount2], 
			[this.baseValue+this.meanDiff, this.baseValue], 
			[this.variance1, this.variance2], 
			this.maxMean, this.maxVariance, this.maxValue, this.minValue);
		this.values1 = sets[0];
		this.values2 = sets[1];
		this.verticalOffsets1 = this.values1.map(() => Math.floor(Math.random()*151));
		this.verticalOffsets2 = this.values2.map(() => Math.floor(Math.random()*151));
	}

	// record an answer
	answer(setIndex) {
		this.response = setIndex;
		this.correct = setIndex == this.maxMean;
		// record RT
		this.RT += performance.now();
	}
}