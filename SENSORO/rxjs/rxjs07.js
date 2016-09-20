"use strict";
var Rx = require("rxjs");

var observable = Rx.Observable.create(observer => {
	let over1 = 0;
	let over2 = 0;
	let over3 = 0;

	setTimeout(() => {
		over1 = 1;
		isOver();
		observer.next(1);
	}, 1000);
	setTimeout(() => {
		over2 = 1;
		isOver();
		observer.next(2);
	}, 2000);
	setTimeout(() => {
		over3 = 1;
		observer.next(3);
		isOver();
	}, 3000);

	function isOver() {
		if (over1 && over2 && over3) {
			return observer.complete();
		}
	}
});

observable.subscribe({
	next: x => {
		console.log(x);
	},
	error: err => {
		console.error("err: %j", err);
	},
	complete: () => {
		console.log("done");
	}
});
