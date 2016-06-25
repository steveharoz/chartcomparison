function send() {
	$('#sending').fadeIn();
	sendJSON(experiment, showFinished);
}
function showFinished() {
	$('#sending').fadeOut().promise().done(() => $('#finished').fadeIn());
	$('#resultCode').text(experiment.subjectID);
}

function sendJSON(exp, callback) {
    // shallow copy
    exp = jQuery.extend({}, exp);
    // drop unneeded properties
    delete exp.staircases;
    delete exp.stairIndex;
    delete exp.currentTrial;
    
	// compute duration
	exp.duration = performance.now() - exp.duration;

    // get early accuracy estimate
    var accuracy = exp.trials.slice(0, 18).map( trial => trial.correct );
    accuracy = d3.sum(accuracy) / accuracy.length;
    accuracy = Math.round(accuracy * 100);
    
	// show size of block data
	console.log("block size (bytes): " + encodeURIComponent(JSON.stringify(exp, null, " ")).length);

	// send
	var studyName = "chartcomp";
	d3.xhr('server/submit.php', 'application/x-www-form-urlencoded', callback)
		.header('content-type', 'application/x-www-form-urlencoded')
		.post('study=' + encodeURIComponent(studyName) + '&' +
			'subjectID=' + encodeURIComponent(exp.subjectID) + '&' +
			'date=' + encodeURIComponent(exp.date) + '&' +
			'accuracy=' + encodeURIComponent(accuracy) + '&' +
			'data=' + encodeURIComponent(JSON.stringify(exp, null, " ")))
		.on('error', function (error) {
			console.log('ERROR: ' + error);
			if (typeof callback != "undefined")
				callback();
		});
}