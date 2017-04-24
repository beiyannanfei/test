/**
 * Created by wyq on 17/4/24.
 */
"use strict";
var EventEmitter = require("events").EventEmitter;
var util = require("util");

function GoodEmitter() {
	EventEmitter.call(this);
}
util.inherits(GoodEmitter, EventEmitter);

var g1 = new GoodEmitter();
g1.on("ev", function (data) {
	console.log("g1 instance: %j", data);
});
var g2 = new GoodEmitter();
g2.on("ev", function (data) {
	console.log("g1 instance: %j", data);
});
g1.emit("ev", "g1 emit data");
console.log("==================================");

function BadEmitter() {
	EventEmitter.call(this);
}
BadEmitter.prototype = new EventEmitter();
var b1 = new BadEmitter();
b1.on("ev", function (data) {
	console.log("b1 Instance: %j", data);
});
var b2 = new BadEmitter();
b2.on("ev", function (data) {
	console.log("b2 Instance: %j", data);
});
b1.emit("ev", "b1 emit data");