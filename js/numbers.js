﻿/// <reference path="d3.js" />

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

function makeSetMax(count1, count2, mu1, sigma1, mu2, sigma2, maxInSet2, minInSet2) {
	var set1, set2;
	var isMaxInSet2;
	var maxInCorrectSet = false;
	var minInCorrectSet = false;
	for (var i = 0; !(maxInCorrectSet && minInCorrectSet) && i < 100000; i++) {
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
	}
	if (i > 10000)
		console.log('reps:' + i);
	return [set1, set2, i];
}

function make2Sets(count1, count2, maxMean, maxVariance, maxValue, minValue) {
	maxMean = maxMean || Math.random() > 0.5;
	maxVariance = maxVariance || Math.random() > 0.5;
	maxValue = maxValue || Math.random() > 0.5;
	minValue = minValue || Math.random() > 0.5;
	var means = [240, 200]; if(maxMean) means.reverse();
	var variances = [120, 90]; if(maxVariance) variances.reverse();
	var sets = makeSetMax(count1, count2, means[0], variances[0], means[1], variances[1], maxValue, minValue);
	if (sets[2] > 10000)
		console.log('mean: ' + maxMean + ' var: ' + maxVariance + ' max: ' + maxValue  + ' min: ' + minValue);
	//console.log(d3.min(sets[0]) < d3.min(sets[1]) ? 'min in 1st' : 'min in 2nd');
	return sets;
}

function testMake2Sets() {
	var total = 0;
	var count = 1000;
	var starttime = window.performance.now();
	for (var i = 0; i < count; i++) {
		total += make2Sets(6, 6)[2];
	}
	console.log('duration: ' + (window.performance.now() - starttime));
	return 'avg iterations: ' + total / count;
}