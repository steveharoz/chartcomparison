/// <reference path="main.js" />
/// <reference path="experiment.js" />

var ISI = 500;

var States = {
	instructions: 'instructions',
	blockIntro:	  'blockIntro', // not used yet
	trialSetup:	  'trialSetup',
	isi:		  'isi', // not used yet
	stimulus:	  'stimulus',
	response:	  'response',
	feedback:     'feeback',
	finished:     'finished'
}

var Statemachine = new function () {
	this.state = null;
	this.stimulusThread = null;

	// choose the next state based on the current state
	this.goToNextState = function () {
		var nextState;
		switch (Statemachine.state) {
			case null:
				nextState = States.instructions;
				break;
			case States.instructions:
				nextState = States.trialSetup;
				break;
			case States.trialSetup:
				nextState = States.stimulus;
				break;
			case States.stimulus:
				nextState = States.response;
				break;
			case States.response:
				// check of done with block or exp
				nextState = States.feedback;
				break;
			default: console.log('Scheiße! ' + Statemachine.state);
		}
		Statemachine.goToState(nextState);
	};

	// go to a specific state
	this.goToState = function (_state) {
		// set new state
		var previousState = Statemachine.state;
		this.state = _state;
		console.log('from ' + previousState + ' to ' + Statemachine.state);

		// cleanup
		switch (previousState) {
			case States.instructions:
				// TODO: hide instructions
				break;
			case States.trialSetup:
				// TODO: clean up delay thing
				// reset feedback
				$('#feedback0, #feedback1').text('');
				break;
			case States.stimulus:
				break;
			case States.response:
				// prevent double click
				$('#response').hide(0);
				break;
			case States.feedback:
				// hide stimulus
				d3.selectAll('.bar')
					.style("opacity", 0);
				// TODO: reset feedback and hide
				break;
			default:
		}

		// proceed to next state
		switch (Statemachine.state) {
			case States.instructions:
				// TODO: show instructions
				// For now, skip and jump to next step 
				Statemachine.goToState(States.trialSetup);
				break;
			case States.trialSetup:
				// show the container for the stimulus (not the bars yet)
				$('#stimulus').show(0);
				// TODO: do something in case of delay
				// generate next trial
				experiment.nextTrial();
				// render (but don't show) stimulus
				draw(experiment.currentTrial);
				// TODO: make this async
				Statemachine.goToNextState();
				break;
			case States.stimulus:
				// ISI, then show stimulus+response
				setTimeout(function () {
					// Show stimulus and response
					showStimulus( experiment.currentTrial.presentationTime, Statemachine.goToNextState);
					$('#response').show(0);
				}, ISI);
				break;
			case States.response:
				// hide stimulus
				d3.selectAll('.bar')
					.style("opacity", 0);
				break;
			case States.feedback:
				// hide response
				$('#response').hide(0);
				// set feedback
				var correct = experiment.currentTrial.correct;
				var symbol = correct ? '✓' : experiment.currentTrial.response ? 'Incorrect ✘' : '✘ Incorrect';
				$('#feedback' + experiment.currentTrial.response).text(symbol);
				// show feedback
				$('#feedback').show(0);
				// wait, then continue
				setTimeout(Statemachine.goToNextState, correct ? 500 : 2000);
				break;
			default:
		}
	};

}
