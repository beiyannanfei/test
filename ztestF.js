"use strict";
const should = require("should");

try {
	[1, 2, 3].should.containDeepOrdered([2, 1]);
} catch (e) {
	console.log(e.message || e);//expected Array [ 1, 2, 3 ] to contain Array [ 2, 1 ]
}