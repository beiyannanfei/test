"use strict";
var Rx = require("rxjs");

var subject = new Rx.ReplaySubject(3);  //回放数量

subject.subscribe({
	next: v => {
		console.log("observerA: %j", v);
	}
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
	next: v => {
		console.log("observerB: %j", v);
	}
});

subject.next(5);