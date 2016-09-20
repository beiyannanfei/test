var Rx = require("rxjs");

var foo = Rx.Observable.create(observer => {
	console.log("Hello ");
	observer.next(42);
});

foo.subscribe(x => {
	console.log("========= x: " + x);
});
console.log("--------------------");
foo.subscribe(y => {
	console.log("========= y: " + y);
});