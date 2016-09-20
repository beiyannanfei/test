"use strict";
var Rx = require("rxjs");

var source = Rx.Observable.interval(500);
var subject = new Rx.Subject();
var refCounted = source.multicast(subject).refCount();
var subscription1, subscription2, subscriptionConnect;

console.log("observerA subscribed");
subscription1 = refCounted.subscribe({
	next: v => {
		console.log("observerA: %j", v);
	}
});

setTimeout(() => {
	console.log("observerB subscribed");
	subscription2 = refCounted.subscribe({
		next: v => {
			console.log("observerB: %j", v);
		}
	});
}, 600);

setTimeout(() => {
	console.log("observerA unsubscribed");
	subscription1.unsubscribe();
}, 1200);

setTimeout(() => {
	console.log("observerB unsubscribed");
	subscription2.unsubscribe();
}, 2000);