/**
 * Created by wyq on 17/6/21.
 */
"use strict";
const async = require("async");
const moment = require("moment");

function error() {
	async.retry({
		times: 3,
		interval: 1000
	}, function (cb) {
		console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
		setTimeout(cb, 1000, "err_test");
	}, function (err, results) {
		if (!!err) {
			console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
	});
}

function success() {
	async.retry({
		times: 3,
		interval: 1000
	}, function (cb) {
		console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
		setTimeout(cb, 1000, null, "ok-test");
	}, function (err, results) {
		if (!!err) {
			console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
	});
}

success();
