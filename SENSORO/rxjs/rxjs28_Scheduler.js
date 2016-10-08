"use strict";
var Rx = require("rx");

var observable = Rx.Observable.create(function (observer) {
	observer.onNext(1);
	observer.onNext(2);
	observer.onNext(3);
	observer.onCompleted();
}).observeOn(Rx.Scheduler.async);

console.log('just before subscribe');
observable.subscribe({
	onNext: x => console.log('got value ' + x),
	onError: err => console.error('something wrong occurred: ' + err),
	onCompleted: () => console.log('done'),
});
console.log('just after subscribe');
