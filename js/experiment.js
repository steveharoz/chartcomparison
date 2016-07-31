/// <reference path="numbers.js" />
/// <reference path="main.js" />
/// <reference path="staircase.js" />

class Experiment {
	constructor() {
		this.staircaseDownRule = 3;
		this.staircaseReversalMax = Infinity;
		this.staircases = [];
		this.stairIndex = -1;
		this.continueUntilAllStaircasesFinish = true; // continue generating trials for each staircase until all others have finished
		this.subjectID = (debug ? "DEBUG" : "") + Math.floor(Math.random() * 100000);
		this.screenResolution = '' + screen.availWidth + 'x' + screen.availHeight;
		this.userAgent = navigator.userAgent;
		this.currentTrial = new Trial();
		this.date = new Date().toISOString().slice(0, 10);
		this.duration = performance.now();
		this.trials = [];
	}

	makeExperiment () {
		var counts = debug ? [[6,10]] : [[6,6], [6,10], [10,10]];
		var styles = debug ? [Styles.extent] : [Styles.position, Styles.extent, Styles.position_extent];
		for (var c in counts) {
			for (var s in styles) {
				var staircase = new ArrayStaircase([1,2,4,6,8,11,14,18,25,34,45,60]);
				staircase.downRule = this.staircaseDownRule;
				staircase.carryOn = true;
				// set the stopping rules
				staircase.reversalMax = this.staircaseReversalMax;
				staircase.trialMax = 50;
				// set the staircase parameters
				this.staircases.push( {
					staircase: staircase, 
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

		// if staircase is complete, go to the next one (but only if setting allow it)
		if (!this.continueUntilAllStaircasesFinish)
			while(this.stairIndex < this.staircases.length && this.getCurrentStaircase().isComplete())
				this.stairIndex++;

		// if finished with this round, restart and shuffle
		if (this.stairIndex >= this.staircases.length) {
			this.stairIndex = 0;
			d3.shuffle(this.staircases);
			// if staircase is complete, go to the next one
			while(this.stairIndex < this.staircases.length && this.getCurrentStaircase().isComplete())
				this.stairIndex++;
		}
		
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
		// whether to show feedback after response
		var roundsOfFeedback = 2;
		trial.feedback = trial.indexStair < roundsOfFeedback;
		if (trial.indexStair < roundsOfFeedback) {
			trial.presentationTime = 60 * 60 * 1000;
			trial.maxValueRequested = 1 - trial.maxMean;
			trial.minValueRequested = trial.maxMean;
			trial.makeSets();
		}
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
		// must be correct AND under the time limit for the staircase to consider it
		var isCorrect = this.currentTrial.correct && this.currentTrial.RT <= this.currentTrial.maxRT;
		this.staircases[this.stairIndex].staircase.answer(isCorrect);
	}
}




class Trial {
	constructor(count1=6, count2=6, diff=90, style=Styles.position) {
		// randomize the count order
		if (Math.random() > 0.5) {
			var temp = count1;
			count1 = count2;
			count2 = temp;
		}

		this.barcount1 = count1;
		this.barcount2 = count2;
		this.baseValue = 200 + Math.round(Math.random() * 100);
		this.colorLeft = Math.random() > 0.5;
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

		// requested (but not guaranteed)
		this.maxMean = Math.random() > 0.5;
		this.maxVariance = Math.random() > 0.5;
		this.maxValueRequested = Math.random() > 0.5;
		this.minValueRequested = Math.random() > 0.5;

		this.presentationTime = debug ? 2000 : 2000;
		this.response;
		this.correct;
		this.RT;
		this.maxRT = this.presentationTime;
		this.feedback = true;
		
		this.makeSets();
	}

	// make the values in the stimulus
	makeSets() {
		var sets = make2Sets(
			[this.barcount1, this.barcount2], 
			[this.baseValue+this.meanDiff, this.baseValue], 
			[this.variance1, this.variance2], 
			this.maxMean, this.maxVariance, this.maxValueRequested, this.minValueRequested);
		this.values1 = sets[0].map( x => d3.round(x,2) );
		this.values2 = sets[1].map( x => d3.round(x,2) );
		this.verticalOffsets1 = this.values1.map(() => Math.floor(Math.random()*151));
		this.verticalOffsets2 = this.values2.map(() => Math.floor(Math.random()*151));
	}

	// record an answer
	answer(setIndex) {
		this.response = setIndex;
		this.correct = setIndex == this.maxMean;
		// record RT
		this.RT += performance.now();
		this.RT = Math.round(this.RT);
	}
}