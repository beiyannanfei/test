"use strict";
var Rx = require("rxjs");

var subject = new Rx.ReplaySubject(100/*回放数量*/, 500/*回放窗口时间*/);

subject.subscribe({
	next: v => {
		console.log("observerA: %j", v);
	}
});

var i = 1;
var timer = setInterval(() => {
	subject.next(i++);
}, 200);

setTimeout(() => {
	subject.subscribe({
		next: v => {
			console.log("observerB: %j", v);
		}
	});
}, 1000);

setTimeout(() => {
	clearInterval(timer);
	subject.unsubscribe();
}, 2000);