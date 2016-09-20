"use strict";
var Rx = require("rx");

var obs1 = Rx.Observable.throw(new Error("error"));
var obs2 = Rx.Observable.return(42);

var source = Rx.Observable.catch(obs1, obs2);

var subscription = source.subscribe({
		onNext: x => {
			console.log("onNext: : %j", x);
		},
		onError: e => {
			console.log("onError: %j", e);
		},
		onCompleted: () => {
			console.log('onCompleted');
		}
	}
	/*x => console.log(`onNext: ${x}`),
	 e => console.log(`onError: ${e}`),
	 () => console.log('onCompleted')*/
);
