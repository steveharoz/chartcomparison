/// <reference path="experiment.js" />
/// <reference path="staircase.js" />
/// <reference path="render.js" />

var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent'
}

var experiment = new Experiment();
experiment.makeExperiment();
var trial = experiment.nextTrial();
draw(trial);

function answer(setIndex) {
	experiment.answer(setIndex);
	trial = experiment.nextTrial();
	draw(trial);
}