var Rx = require("rxjs");

var observable = Rx.Observable.create(function (observer) {
	observer.next(1);
	observer.next(2);
	observer.next(3);
	// observer.error("test");
	setTimeout(() => {
		observer.next(4);
		observer.complete();
	}, 1000);
});

observable.subscribe(
	x => {
		console.log("Observer got a next value: " + x);
	},
	err => {
		console.error("Observer got an error: " + err);
	},
	() => {
		console.log('Observer got a complete notification');
	}
);