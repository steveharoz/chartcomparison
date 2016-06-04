/// <reference path="main.js" />
/// <reference path="experiment.js" />

var ISI = 500;

var States = {
	instructions: 'instructions',
	blockIntro:	  'blockIntro', // not used yet
	trialSetup:	  'trialSetup',
	pause:		  'pause',
	isi:		  'isi',
	stimulus:	  'stimulus',
	response:	  'response',
	feedback:     'feeback',
	finished:     'finished'
}

var Statemachine = new function () {
	this.state = States.instructions;
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
				nextState = States.pause;
				break;
			case States.pause:
				nextState = States.isi;
				break;
			case States.isi:
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
				// hide instructions
				$('#instructions').hide(0);
				break;
			case States.trialSetup:
				// TODO: clean up delay thing
				// reset feedback
				$('#feedback0, #feedback1').text('');
				$('#feedbackSlow').css('visibility', 'hidden');
				break;
			case States.pause:
				// hide presstocontinue message
				$('#pressToContinue').hide(0);
				break;
			case States.isi:
				break;
			case States.stimulus:
				clearTimeout(Statemachine.stimulusThread);
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
				// check if there are any trials left
				if (experiment.isFinished()) {
					Statemachine.goToState(States.finished);
					return;
				}
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
			case States.pause:
				// press a key to start trial
				$('#pressToContinue').show(0);
				break;
			case States.isi:
				// show the fixation
				d3.select('#fixation').style("opacity", 1);
				// pause before stimulus
				setTimeout(function () {
					Statemachine.goToNextState();
				}, ISI);
				break;
			case States.stimulus:
				// show stimulus+response
				// hide fixation
				d3.select('#fixation').style("opacity", 0);
				// start RT timer
				experiment.currentTrial.RT = -performance.now();
				// Show stimulus and response
				showStimulus( experiment.currentTrial.presentationTime, Statemachine.goToNextState);
				$('#response').show(0);
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
				if (experiment.currentTrial.feedback)
					$('#feedback' + experiment.currentTrial.response).text(symbol);
				// RT feedback
				if (experiment.currentTrial.RT > experiment.currentTrial.maxRT)
					$('#feedbackSlow').css('visibility', 'visible');
				// show feedback
				$('#feedback').show(0);
				// wait, then continue
				// TODO: stopping criteria
				var continueToNextTrial = function () { Statemachine.goToState(States.trialSetup); };
				var feedbackShown = 
					(!correct && experiment.currentTrial.feedback) || 
					experiment.currentTrial.RT > experiment.currentTrial.maxRT;
				setTimeout(continueToNextTrial, feedbackShown ? 2000 : 500);
				break;
			case States.finished:
				// hide everything
				$('.row').hide();
				// upload and show message
				send();
				break;
			default:
		}
	};

}
