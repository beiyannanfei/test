"use strict";
var Rx = require("rxjs");

let observable1 = Rx.Observable.interval(400);
let observalbe2 = Rx.Observable.interval(300);

let subscription = observable1.subscribe(x => console.log("first: " + x));
let childSubscription = observalbe2.subscribe(x => console.log("second: " + x));
let subscription2 = observable1.subscribe(x => console.log("first2: " + x));

subscription.add(childSubscription);
subscription.add(subscription2);

setTimeout(() => {
	console.log("------------- subscription unsubscribe");
	subscription.unsubscribe();
}, 2000);

setTimeout(() => {
	console.log("============== remove childSubscription from subscription");
	subscription.remove(childSubscription);
}, 1000);
