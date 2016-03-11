/// <reference path="experiment.js" />
/// <reference path="staircase.js" />
/// <reference path="render.js" />
/// <reference path="statemachine.js" />
/// <reference path="_libraries/js/jquery-2.2.1.js" />

var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent'
}

var experiment = new Experiment();
experiment.makeExperiment();
Statemachine.goToNextState();

function answer(setIndex) {
	if (Statemachine.state != States.stimulus && Statemachine.state != States.response)
		return;

	// record the response
	experiment.answer(setIndex);

	Statemachine.goToState(States.feedback);
}