"use strict";
var Rx = require("rx");

function multiplyByTen(input) {
	let output = Rx.Observable.create(function subscribe(observer) {
		input.subscribe({
			onNext: v => observer.onNext(10 * v),
			onError: err => observer.onError(err),
			onCompleted: () => observer.onCompleted()
		});
	});
	return output;
}

var input = Rx.Observable.from([1, 2, 3, 4]);
var output = multiplyByTen(input);
output.subscribe({
	onNext: x => {
		console.log("onNext: : %j", x);
	},
	onError: e => {
		console.log("onError: %j", e);
	},
	onCompleted: () => {
		console.log('onCompleted');
	}
});