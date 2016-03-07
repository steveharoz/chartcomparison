/// <reference path="experiment.js" />
/// <reference path="staircase.js" />
/// <reference path="render.js" />

var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent'
}

var staircase = new Staircase();

var stairValue = Math.pow(1.3, staircase.valueIndex);

var trial = new Trial(6, 6);

draw(trial);