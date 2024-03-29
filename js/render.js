﻿/// <reference path="experiment.js" />

var margin = {top: 5, right: 5, bottom: 35, left: 5},
	width = 970 - margin.left - margin.right,
	height = 610 - margin.top - margin.bottom;

var maxSetCount = 2;
var maxBarCount = 10;
var xMargin = 0.05; // space at the edges of the x axis
var xCenterSpace = 0.1; // space between sets
var xSpaceBtwBars = 0.66; // proportion of bar width

var svg;

function getSetWidth() {
	var innerWidth = width * (1 - 2 * xMargin);
	innerWidth += width * xCenterSpace;
	var setWidth = innerWidth / maxSetCount;
	setWidth -= width * xCenterSpace;
	return setWidth;

}
function getBarRegionWidth() {
	var setWidth = getSetWidth();
	setWidth *= (maxBarCount + xSpaceBtwBars) / maxBarCount;
	var barWidth = setWidth / maxBarCount;
	return barWidth;
}
function getBarWidth() {
	return getBarRegionWidth() * (1-xSpaceBtwBars)
}
function getXPosition(index, setIndex) {
	return xMargin * width +
		(getSetWidth() + width * xCenterSpace) * setIndex +
		getBarRegionWidth() * index;
}

function initializeSVG() {
	svg = d3.select("#chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	drawAxes();
	drawFixation();
	drawPressToContinue();
}
initializeSVG();

// render and hide the bars
function draw(trial) {
	svg.selectAll(".bar, .cheat, .guides").remove();
	
	var styles = trial.colorLeft ?
		["bar1", "bar2"] :
		["bar2", "bar1"];

	switch (trial.style) {
		case Styles.position_extent:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[0])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[1])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(v, 1))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.position_extent_line:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[0])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", 2)
					.attr("y", height - trial.values1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[1])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(v, 1))
					.attr("width", 2)
					.attr("y", height - trial.values2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.extent:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[0])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values1[v] - trial.verticalOffsets1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[1])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(v, 1))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values2[v] - trial.verticalOffsets2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.extent_line:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[0])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", 2)
					.attr("y", height - trial.values1[v] - trial.verticalOffsets1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar " + styles[1])
					.classed("outline", OUTLINE_MODE)
					.attr("x", getXPosition(v, 1))
					.attr("width", 2)
					.attr("y", height - trial.values2[v] - trial.verticalOffsets2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.position:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("circle")
					.attr("class", "bar " + styles[0])
					.classed("outline", OUTLINE_MODE)
					.attr("cx", getXPosition(maxBarCount - v - 1, 0) + getBarWidth() / 2)
					.attr("cy", height - trial.values1[v])
					.attr("r", LINES_MODE ? 12.6 : (getBarWidth() / 2));
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("circle")
					.attr("class", "bar " + styles[1])
					.classed("outline", OUTLINE_MODE)
					.attr("cx", getXPosition(v, 1) + getBarWidth() / 2)
					.attr("cy", height - trial.values2[v])
					.attr("r", LINES_MODE ? 12.6 : (getBarWidth() / 2));
			}
			break;
		default:
	}
	hideStimulus();
	if (debug)
		drawGuidesAndCheats(trial);
}


// hide the bars
function hideStimulus() {
	d3.selectAll('.bar')
		.style("opacity", 0);
}
// show the bars for a specified duration
function showStimulus(duration_ms, callback) {
	// show the bars
	d3.selectAll('.bar')
		.style("opacity", 1);
	// return if unlimitted duration
	if (duration_ms <= 0)
		return;
	// after duration, hide bars
	Statemachine.stimulusThread = setTimeout(function () {
		hideStimulus();
		clearTimeout(Statemachine.stimulusThread);
		if( typeof(callback) == 'function' )
			callback();
	}, duration_ms);
}


function drawAxes() {
	svg.append("g")
		.attr("class", "x axis")
		.append("line")
			.attr("x1", 0).attr("x2", width)
			.attr("y1", height+1).attr("y2", height+1);

	svg.append("g")
		.attr("class", "y axis")
		.append("line")
			.attr("x1", 0).attr("x2", 0)
			.attr("y1", 0).attr("y2", height);
}
function drawFixation() {
	var fixation = svg.append("g").attr("id", "fixation");
	var fixationSize = 10;
	fixation.append("line")
		.attr("x1", width/2 - fixationSize)
		.attr("x2", width/2 + fixationSize)
		.attr("y1", height/2)
		.attr("y2", height/2);
	fixation.append("line")
		.attr("x1", width/2)
		.attr("x2", width/2)
		.attr("y1", height/2 - fixationSize)
		.attr("y2", height/2 + fixationSize);
	// hide fixation
	d3.select('#fixation').style("opacity", 0);
}
function drawPressToContinue() {
	var pressToContinue = svg.append("text")
		.attr("id", "pressToContinue")
		.attr("x", "50%")
		.attr("y", "50%")
		.attr("text-anchor", "middle")
		.attr("dy", "-.5em")
		.attr("font-size", 30);
	pressToContinue.append("tspan")
		.attr("id", "percentComplete")
		.attr("x", "50%")
		.text();
	pressToContinue.append("tspan")
		.attr("x", "50%")
		.attr("dy", "1.4em")
		.text("Press left or right for the next round");
	$('#pressToContinue').hide(0);
}

function drawGuidesAndCheats(trial) {
	var guides = svg.append("g").attr("class", "guides");
	guides.append("line")
		.attr("x1", 0)
		.attr("x2", xMargin * width)
		.attr("y1", height - 10)
		.attr("y2", height - 10);
	guides.append("line")
		.attr("x1", width * (1-xMargin))
		.attr("x2", width)
		.attr("y1", height - 10)
		.attr("y2", height - 10);
	guides.append("line")
		.attr("x1", width/2 - width * xCenterSpace/2)
		.attr("x2", width/2 + width * xCenterSpace/2)
		.attr("y1", height - 10)
		.attr("y2", height - 10);
	guides.append("line")
		.attr("x1", width * xMargin)
		.attr("x2", width * xMargin)
		.attr("y1", 0)
		.attr("y2", height);
	guides.append("line")
		.attr("x1", width/2 - width * xCenterSpace/2)
		.attr("x2", width/2 - width * xCenterSpace/2)
		.attr("y1", 0)
		.attr("y2", height);
	guides.append("line")
		.attr("x1", width/2 + width * xCenterSpace/2)
		.attr("x2", width/2 + width * xCenterSpace/2)
		.attr("y1", 0)
		.attr("y2", height);
	guides.append("line")
		.attr("x1", width * (1-xMargin))
		.attr("x2", width * (1-xMargin))
		.attr("y1", 0)
		.attr("y2", height);

	svg.selectAll(".cheat")
		.data([trial.values1, trial.values2]).enter().append("line")
			.attr("class", "cheat")
			.attr("y1", function (d, i) { return height - d3.mean(d); })
			.attr("y2", function (d, i) { return height - d3.mean(d); })
			.attr("x1", function (d, i) { return getXPosition(0, i); })
			.attr("x2", function (d, i) { return getXPosition(maxBarCount-xSpaceBtwBars, i); });

	svg.append("text")
		.attr("class", "cheat")
		.attr("y", height + 20)
		.style("font-size", 20)
		.text("Max mean: set " + (trial.maxMean+1) + " \u00A0\u00A0\u00A0\u00A0 Max variance: set " + (trial.maxVariance+1) + " \u00A0\u00A0\u00A0\u00A0 Max single value: set " + (trial.maxValueRequested+1) + " \u00A0\u00A0\u00A0\u00A0 Min single value: set " + (trial.minValueRequested+1))

}