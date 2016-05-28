﻿/// <reference path="experiment.js" />
/// <reference path="staircase.js" />
/// <reference path="render.js" />
/// <reference path="statemachine.js" />
/// <reference path="../_libraries/js/jquery-2.2.1.js" />

var debug = window.location.href.toLowerCase().indexOf("debug") >= 0;


var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent',
	position_square: 'position square'
}


// show instructions
$('#instructions').show(0);
var experiment = new Experiment();
experiment.makeExperiment();

function answer(setIndex) {
	if (Statemachine.state != States.stimulus && Statemachine.state != States.response)
		return;

	// record the response
	experiment.answer(setIndex);
	// go to 'feedback' state
	Statemachine.goToState(States.feedback);
}