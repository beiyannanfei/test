"use strict";
var Rx = require("rx");

var subject = new Rx.AsyncSubject();

subject.subscribe(v => {
	console.log("observerA: %j", v);
});

subject.onNext(1);
subject.onNext(2);
subject.onNext(3);
subject.onNext(4);

subject.subscribe(v => {
	console.log("observerB: %j", v);
});

subject.onNext(5);
subject.onCompleted();   //只会在这里想所有订阅者广播最后一个值(5)


