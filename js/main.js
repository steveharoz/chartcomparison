var Styles = {
	position:        'position',
	extent:			 'extent',
	position_extent: 'position + extent'
}


var data = [];
var DATACOUNT = 12;
var sets = make2Sets(DATACOUNT / 2);
for (var i = 0; i < DATACOUNT; i++) {
  data.push( {
	color: i >= DATACOUNT/2,
	index: i,
	frequency: sets[Math.floor(i / (DATACOUNT/2))][i % (DATACOUNT/2)],
	verticalOffset: Math.floor(Math.random() * 100)
  });
}

var groupSpacing = 100;

var margin = {top: 5, right: 5, bottom: 5, left: 5},
	width = 970 - margin.left - margin.right,
	height = 610 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var xPadding = 0.05;
var xCenterSpace = 0.1;
var xSpacing = 34/64; // percent of bar width
var xWidth = width * (1 - 2*xPadding - xCenterSpace) / DATACOUNT;
var xBarWidth = xWidth * (1 - xSpacing);

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function getXPosition(d) {
	return (width * xPadding) + // left margin
		   (xWidth * xSpacing/2) + //spacing between bars
		   (d.index >= DATACOUNT/2 ? width*xCenterSpace : 0) +
		   (d.index * xWidth);
}

function draw(data, style) {
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
			.attr("y1", 0).attr("y2", height+3);

	switch (style) {
		case Styles.position_extent:
			svg.selectAll(".bar")
				.data(data)
				.enter().append("rect")
					.attr("class", "bar")
					.attr("x", getXPosition)
					.attr("width", xBarWidth)
					.attr("y", function (d) { return height - d.frequency; })
					.attr("height", function (d) { return d.frequency; })
					.style("fill", function (d) { return d.color ? 'rgb(55, 126, 184)' : 'rgb(228, 26, 28)'; });
			break;
		case Styles.extent:
			svg.selectAll(".bar")
				.data(data)
				.enter().append("rect")
					.attr("class", "bar")
					.attr("x", getXPosition)
					.attr("width", xBarWidth)
					.attr("y", function (d) { return height - d.frequency - d.verticalOffset; })
					.attr("height", function (d) { return d.frequency; })
					.style("fill", function (d) { return d.color ? 'rgb(55, 126, 184)' : 'rgb(228, 26, 28)'; });
			break;
		case Styles.position:
			svg.selectAll(".dot")
				.data(data)
				.enter().append("circle")
					.attr("class", "dot")
					.attr("cx", function (d) { return getXPosition(d) + xBarWidth / 2; } )
					.attr("cy", function (d) { return height - d.frequency; })
					.attr("r", xBarWidth / 2)
					.style("fill", function (d) { return d.color ? 'rgb(55, 126, 184)' : 'rgb(228, 26, 28)'; });
			break;
		default:

	}



  svg.selectAll(".cheat")
	.data(sets.slice(0,2)).enter().append("line")
		.attr("class", "cheat")
		.attr("y1", function (d, i) { return height - d3.mean(sets[i]); })
		.attr("y2", function (d, i) { return height - d3.mean(sets[i]); })
		.attr("x1", function (d, i) { return i * width/2; })
		.attr("x2", function (d, i) { return (i+1) * width/2; });

}