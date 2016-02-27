

d3.select("body").on("keydown", function (k) {
	switch (d3.event.keyCode) {
		case 37: // left
			console.log("left");
			break;
		case 39: // right
			console.log("right");
			break;
		default:
	}
});