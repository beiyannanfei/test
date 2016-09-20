"use strict";
var Rx = require("rxjs");

var subject = new Rx.Subject();

subject.subscribe({
	next: v => {
		console.log("observerA: %j", v);
	},
	error: err => {
		console.error("errorA: %j", err);
	},
	complete: () => {
		console.log("doneA");
	}
});

subject.subscribe({
	next: v => {
		console.log("observerB: %j", v);
	},
	error: err => {
		console.error("errorB: %j", err);
	},
	complete: () => {
		console.log("doneB");
	}
});

subject.next({a: 10});
subject.next(2);
// subject.error("test");
subject.complete();