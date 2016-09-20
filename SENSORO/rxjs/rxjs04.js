var Rx = require("rxjs");

var observable1 = Rx.Observable.interval(400);
var observable2 = Rx.Observable.interval(300);

var subscription = observable1.subscribe(x => {
	console.log("first: " + x);
});

var childSubscription = observable2.subscribe(x => {
	console.log("second: " + x);
});

subscription.add(childSubscription);
setTimeout(() => {
	subscription.unsubscribe();
}, 2000);

