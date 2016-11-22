/**
 * Created by wyq on 16/11/22.
 * promise递归练习
 */
"use strict";
const Promise = require("bluebird");

function test1() {
	Promise.resolve(test2()).then(val => {
		console.log("test1 val: %j", val);
	}).catch(err => {
		console.log("test1 err: %j", err);
	});
}

function test2() {
	return new Promise((resolve, reject) => {
		console.log("========= test2 ========= begin");
		setTimeout(() => {
			console.log("========= test2 ========= end");
			return resolve(test3());
		}, 1000);
	});
}

function test3(tryTime) {
	if (!tryTime) {
		tryTime = 0;
	}
	return new Promise((resolve, reject) => {
		console.log("========= test3 ========= begin tryTime: %j", tryTime);
		setTimeout(() => {
			console.log("========= test3 ========= end tryTime: %j", tryTime);
			if (++tryTime < 3) {
				return resolve(test3(tryTime));
			}
			return resolve("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		}, 1000);
	});
}

test1();
