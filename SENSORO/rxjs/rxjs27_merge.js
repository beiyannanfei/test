"use strict";
var Rx = require("rx");

var observable1 = Rx.Observable.interval(1000);
var observable2 = Rx.Observable.interval(500);

var merged = Rx.Observable.merge(observable1, observable2);

merged.subscribe(x => {
	console.log(x);
});

