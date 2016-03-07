/// <reference path="experiment.js" />

var margin = {top: 5, right: 5, bottom: 35, left: 5},
	width = 970 - margin.left - margin.right,
	height = 610 - margin.top - margin.bottom;

var maxSetCount = 2;
var maxBarCount = 6;
var xMargin = 0.1; // space at the edges of the x axis
var xCenterSpace = 0.1; // space between sets
var xSpaceBtwBars = 0.33; // proportion of bar width

var svg = d3.select("#chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function draw(trial) {
	svg.selectAll("*").remove();

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

	switch (trial.style) {
		case Styles.position_extent:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar bar1")
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar bar2")
					.attr("x", getXPosition(v, 1))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.extent:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("rect")
					.attr("class", "bar bar1")
					.attr("x", getXPosition(maxBarCount - v - 1, 0))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values1[v] - trial.verticalOffsets1[v])
					.attr("height", trial.values1[v]);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("rect")
					.attr("class", "bar bar2")
					.attr("x", getXPosition(v, 1))
					.attr("width", getBarWidth())
					.attr("y", height - trial.values2[v] - trial.verticalOffsets2[v])
					.attr("height", trial.values2[v]);
			}
			break;
		case Styles.position:
			for (var v = 0; v < trial.values1.length; v++) {
				svg.append("circle")
					.attr("class", "bar bar1")
					.attr("cx", getXPosition(maxBarCount - v - 1, 0) + getBarWidth() / 2)
					.attr("cy", height - trial.values1[v])
					.attr("r", getBarWidth() / 2);
			}
			for (var v = 0; v < trial.values2.length; v++) {
				svg.append("circle")
					.attr("class", "bar bar2")
					.attr("cx", getXPosition(v, 1) + getBarWidth() / 2)
					.attr("cy", height - trial.values2[v])
					.attr("r", getBarWidth() / 2);
			}
			break;
		default:

	}

	drawGuidesAndCheats(trial);
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
		.attr("x1", width * xCenterSpace)
		.attr("x2", width * xCenterSpace)
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
		.attr("x1", width * (1-xCenterSpace))
		.attr("x2", width * (1-xCenterSpace))
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
		.text("Max variance: set " + (trial.maxVariance+1) + " \u00A0\u00A0\u00A0\u00A0 Max single value: set " + (trial.maxValue+1) + " \u00A0\u00A0\u00A0\u00A0 Min single value: set " + (trial.minValue+1))

}