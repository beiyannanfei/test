"use strict";
var Rx = require("rxjs");

var observable = Rx.Observable.interval(1000);

var subscription = observable.subscribe(x => {
	console.log(x);
});

setTimeout(() => {
	subscription.unsubscribe();
}, 3100);

