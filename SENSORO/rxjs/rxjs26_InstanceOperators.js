"use strict";
var Rx = require("rx");

Rx.Observable.prototype.multiplyByTen = function multiplyByTen() {
	var input = this;
	return Rx.Observable.create(function subscribe(observer) {
		input.subscribe({
			onNext: v => observer.onNext(10 * v),
			onError: err => observer.onError(err),
			onCompleted: () => observer.onCompleted()
		});
	});
};

var observable = Rx.Observable.from([1, 2, 3, 4]).multiplyByTen();

observable.subscribe(x => {
	console.log(x);
});
