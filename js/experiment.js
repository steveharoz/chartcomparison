/// <reference path="numbers.js" />
/// <reference path="main.js" />

function Trial(count1=6, count2=6) {
	this.barcount1 = count1;
	this.barcount2 = count2;
	this.values1 = [];
	this.values2 = [];
	this.verticalOffsets1 = [];
	this.verticalOffsets2 = [];
	this.index = -1;
	this.style = Styles[Object.keys(Styles)[Math.floor(Math.random() * Object.keys(Styles).length)]];

	this.maxMean = Math.random() > 0.5;
	this.maxVariance = Math.random() > 0.5;
	this.maxValue = Math.random() > 0.5;
	this.minValue = Math.random() > 0.5;

	this.presentationTime = 1500;
	this.presentationTimeActual = 0;
	this.responseOrder = [];
	this.response = [];
	this.useAspectRatio = false;

	var sets = make2Sets(this.barcount1, this.barcount2, this.maxMean, this.maxVariance, this.maxValue, this.minValue);
	this.values1 = sets[0];
	this.values2 = sets[1];
	this.verticalOffsets1 = this.values1.map(() => Math.floor(Math.random()*101));
	this.verticalOffsets2 = this.values2.map(() => Math.floor(Math.random()*101));
}