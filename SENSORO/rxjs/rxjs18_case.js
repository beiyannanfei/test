"use strict";
var Rx = require("rx");

var sources = {
	hello: Rx.Observable.just('clx'),
	world: Rx.Observable.just('wxq')
};
var subscription = Rx.Observable.case(function () {
	return "hello";
}, sources, Rx.Observable.empty());

subscription.subscribe(function (x) {
	console.log(x)
});
