class CounterBalancer {
	constructor() {
		this._combinations = [];
	}
	
	get	next() {
		
	}
	
	_reset() {
	}
}

function allCombinations(variables) {
	// get all of the variable names
	var keys = Object.keys(variables);

	// if empty
	if (keys.length == 0)
		return [];
	// extract the first set
	var combinations = variables[keys[0]].map( v => { 
		var o = new Object(); 
		o[keys[0]]=v; return o; 
	} );
	delete variables[keys[0]];
	// go through each remaining variable
	while (Object.keys(variables).length > 0) {
		var key = Object.keys(variables)[0];
		var values = variables[key];
		delete variables[key];
		// merge each value with existing combinations
		var oldCombos = combinations;
		combinations = [];
		for (var i = 0; i < values.length; i++) {
			for (var j = 0; j < oldCombos.length; j++) {
				var o = new $.extend({}, oldCombos[j]);
				o[key] = values[i];
				combinations.push(o);
			}
		}
	}
	return combinations;
}


var allVariables = {
	letter: ['a', 'b'], 
	number: [1, 2], 
	color: ['red', 'blue', 'green']
};

var temp = allCombinations(allVariables);
console.log(JSON.stringify(temp));