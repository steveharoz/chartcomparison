function send() {
	$('#sending').fadeIn();
	sendJSON(experiment, showFinished);
}
function showFinished() {
	$('#finished').fadeIn();
	$('#resultCode').text(experiment.subjectID);
}

function sendJSON(exp, callback) {
    exp = jQuery.extend({}, exp);
    delete exp.staircases;
    delete exp.stairIndex;
    delete exp.currentTrial;
    
	// show size of block data
	console.log("block size (bytes): " + encodeURIComponent(JSON.stringify(exp, null, " ")).length);

	// send
	var studyName = "chartcomp";
	d3.xhr('server/submit.php', 'application/x-www-form-urlencoded', callback)
		.header('content-type', 'application/x-www-form-urlencoded')
		.post('study=' + encodeURIComponent(studyName) + '&' +
			'subjectID=' + encodeURIComponent(exp.subjectID) + '&' +
			'date=' + encodeURIComponent(exp.date) + '&' +
			'data=' + encodeURIComponent(JSON.stringify(exp, null, " ")))
		.on('error', function (error) {
			console.log('ERROR: ' + error);
			if (typeof callback != "undefined")
				callback();
		});
}