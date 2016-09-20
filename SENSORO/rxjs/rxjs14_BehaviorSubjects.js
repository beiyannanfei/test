"use strict";
var Rx = require("rxjs");

var subject = new Rx.BehaviorSubject(0);  //用0初始化BehaviorSubject

subject.subscribe({
	next: (v) => {
		console.log("observerA: " + v);
	}
});

subject.next(1);
subject.next(2);

subject.subscribe({
	next: v => {
		console.log("observerB: " + v);
	}
});

subject.next(3);
