"use strict";
var Rx = require("rxjs");

var source = Rx.Observable.from([1, 2, 3]);
var subject = new Rx.Subject();
var multicased = source.multicast(subject);

multicased.subscribe({
	next: v => {
		console.log('observerA: %j', v)
	}
});
multicased.subscribe({
	next: v => {
		console.log('observerB: %j', v)
	}
});

multicased.connect();
