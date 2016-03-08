/// <reference path="main.js" />

d3.select("body").on("keydown", function (k) {
	switch (d3.event.keyCode) {
		case 37: // left
			console.log("left");
			answer(0);
			break;
		case 39: // right
			console.log("right");
			answer(1);
			break;
		default:
	}
});