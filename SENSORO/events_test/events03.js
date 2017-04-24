/**
 * Created by wyq on 17/4/24.
 * 多文件测试
 */
"use strict";
const EventEmiter = require('events');

class SensoroEvent extends EventEmiter {
	constructor() {
		super();
	}

	write(data) {
		this.emit('data', data);
		return true;
	}

	read(data) {
		this.emit("msg", data);
		return true;
	}
}
const myEvent = new SensoroEvent();
module.exports = myEvent;



