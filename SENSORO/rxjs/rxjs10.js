"use strict";
var Rx = require("rxjs");

var subject = new Rx.Subject();

subject.subscribe({
	next: v => {
		console.log("observerA: %j", v);
	}
});

subject.subscribe({
	next: v => {
		console.log("observerB: %j", v);
	}
});

var observable = Rx.Observable.from([1, 2, {a: 3}]);
observable.subscribe(subject);