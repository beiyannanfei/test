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

	cf(v1, v2) {
		this.emit("dAtA", v1, v2);
		return true;
	}
}

var m1 = new myEvent();
m1.on("dAtA", (v1, v2) => {
	console.log("========== v1: %j, v2: %j", v1, v2);
});
m1.cf("aaa", "bbb");



