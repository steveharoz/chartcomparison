class CounterBalancer {
	constructor() {
		this._combinations = [];
	}
	
	get	next() {
		
	}
	
	_reset() {
	}
}






function allCombinations(arr) {
	if (arr.length <= 1) {
		return arr.map( x => [x] ); // doesn't work
	} else if (arr.length == 2) {
		var combinations = [];
		for (var i = 0; i < arr[0].length; i++) {
			for (var j = 0; j < arr[1].length; j++) {
				var temp = Array.isArray(arr[1][j]) ? arr[1][j].slice() : [arr[1][j]];
				temp.unshift(arr[0][i]);
				combinations.push(temp);
			}
		}
		return combinations;
	} else {
		return allCombinations([ arr[0], allCombinations(arr.slice(1)) ]);
	}
}
var allArrays = [['a', 'b'], [1, 2], ['red', 'blue', 'green']];
var temp = allCombinations(allArrays);