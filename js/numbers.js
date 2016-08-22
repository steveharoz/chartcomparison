/// <reference path="../_libraries/js/d3.js" />

var randNormal = d3.random.normal();

function makeSet(count, mu, sigma) {
	var set = d3.range(count).map(() => randNormal());
	var mean = d3.mean(set);
	var sd = d3.deviation(set);
	set = set.map(x => (x-mean) / sd * sigma + mu);
	return set;
}

function makeBoundSet(count, mu, sigma, min, max) {
	mu = mu ? mu : 200;
	sigma = sigma ? sigma : 120;
	min = min ? min : 20;
	max = max ? max : height;

	// special case for set size 1
	if (count <= 1)
		return [mu];

	var set = [];
	var i = 0;
	var outOfBounds = true;
	for (var i = 0; outOfBounds && i < 1000; i++) {
		set = makeSet(count, mu, sigma);
		outOfBounds = set.some(x => x<min || x > max);
	}
	//console.log('  ' + i);

	return set;
}

function makeSetMax(count1, mu1, sigma1, count2, mu2, sigma2, maxInSet2, minInSet2) {
	var set1, set2;
	var isMaxInSet2;
	var maxInCorrectSet = false;
	var minInCorrectSet = false;
	var bigDiff = Math.abs(mu1-mu2) > 60.1; // when diff is large, simplify criteria

	// keep trying?
	var keepTrying = true;
	var MaxTries = 19999; 
	if (count1 <= 2) 
		MaxTries = 1999;
	// for big diffs either maxInCorrectSet or minInCorrectSet. Both for smaller diffs
	for (var i = 0; keepTrying && i < MaxTries; i++) {
		set1 = makeBoundSet(count1, mu1, sigma1);
		set2 = makeBoundSet(count2, mu2, sigma2);

		var max1 = d3.max(set1);
		var max2 = d3.max(set2);
		isMaxInSet2 = max2 > max1;
		maxInCorrectSet = isMaxInSet2 == maxInSet2;

		var min1 = d3.min(set1);
		var min2 = d3.min(set2);
		isMinInSet2 = min2 < min1;
		minInCorrectSet = isMinInSet2 == minInSet2;

		// keep trying?
		keepTrying = !(maxInCorrectSet && minInCorrectSet) 
		if (MaxTries > 9999 && bigDiff) 
			keepTrying = !(maxInCorrectSet || minInCorrectSet);

	}
	if (i > 4999)
		console.log('reps:' + i);
	return [set1, set2, i];
}

function make2Sets(counts, means, variances, maxMean, maxVariance, maxValue, minValue) {
	if (maxMean === undefined) maxMean = Math.random() > 0.5;
	if (maxVariance === undefined) maxVariance = Math.random() > 0.5;
	if (maxValue === undefined) maxValue = Math.random() > 0.5;
	if (minValue === undefined) minValue = Math.random() > 0.5;
	if(maxMean) 
		means.reverse();
	if(maxVariance) 
		variances.reverse();
	var sets = makeSetMax(counts[0], means[0], variances[0], counts[1], means[1], variances[1], maxValue, minValue);
	if (sets[2] > 10000)
		console.log('mean: ' + maxMean + ' var: ' + maxVariance + ' max: ' + maxValue  + ' min: ' + minValue);
	//console.log(d3.min(sets[0]) < d3.min(sets[1]) ? 'min in 1st' : 'min in 2nd');
	return sets;
}

function testMake2Sets() {
	var total = 0;
	var count = 1000;
	var starttime = window.performance.now();
	var maxIterations = 0;
	var hiIterationCount = 0;
	for (var i = 0; i < count; i++) {
		var iterations = make2Sets([6,10], [220,200], [120,90])[2];
		hiIterationCount += iterations > 1000;
		maxIterations = Math.max(maxIterations, iterations);
		total += iterations;
	}
	console.log('avg duration: ' + Math.round((window.performance.now() - starttime) / count) + ' ms');
	console.log('avg iterations: ' + total / count);
	console.log('max iterations: ' + maxIterations);
}