/// <reference path="experiment.js" />
/// <reference path="staircase.js" />
/// <reference path="render.js" />
/// <reference path="bootstrap/js/jquery-1.9.1.js" />

var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent'
}

var experiment = new Experiment();
experiment.makeExperiment();
var trial;
nextTrial();

function answer(setIndex) {
	// prevent double click
	$('#response').hide(0);
	// record the response
	experiment.answer(setIndex);

	// feedback
	var correct = experiment.currentTrial.correct;
	var symbol = correct ? '✓' : setIndex ? 'Incorrect ✘' : '✘ Incorrect';
	$('#feedback' + setIndex).text(symbol)

	setTimeout(nextTrial, correct ? 500 : 2000);
}

function nextTrial() {
	trial = experiment.nextTrial();
	draw(trial);
	$('#feedback0, #feedback1').text('');
	$('#response').show(0);
}