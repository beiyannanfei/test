/**
 * Created by wyq on 17/4/24.
 * 事件练习
 */
"use strict";
const EventEmiter = require("events").EventEmitter;

class myEvent extends EventEmiter {
	constructor() {
		super();
	}

	write(v) {
		console.log("[%j] ================write: %j", new Date().toLocaleString(), v);
		return true;
	}

	read(v) {
		console.log("[%j] ================read: %j", new Date().toLocaleString(), v);
		return true;
	}

	w2u(v) {
		this.emit("w2u", v);
		return true
	}
}

var m1 = new myEvent();
m1.write("aaaaaaaa");
m1.read("bbbbbbbbbbb");
m1.on("w2u", data => {
	console.log("[%j] ========== m1 w2u data: %j", new Date().toLocaleString(), data);
});
var m2 = new myEvent();
m2.on("w2u", data => {
	console.log("[%j] ========== m2 w2u data: %j", new Date().toLocaleString(), data);
});
setTimeout(function () {
	m1.w2u("user1");
}, 1000);

