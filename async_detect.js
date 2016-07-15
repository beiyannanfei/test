/**
 * Created by wyq on 2016/7/13.
 * 从数组中找出符合条件的第一个元素
 */

var rc = require("redis").createClient();
var async = require("async");

//redis中数据 test: {a: 10, b: 20, c: 30, d: 20, e: 25, f: 20}

var list = ["a", "b", "c", "d", "e", "f"];
var f1 = function () {
	async.detect(list, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {
			setTimeout(function () {
				return cb(value == 25);
			}, 1000);
		});
	}, function (results) {
		console.log("results: %j", results);
	});
};

var f2 = function () {
	async.detectSeries(list, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {
			setTimeout(function () {
				return cb(value == 25);
			}, 1000);
		});
	}, function (results) {
		console.log("results: %j", results);
	});
};

var f3 = function () {
	async.detectLimit(list, 2, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {
			setTimeout(function () {
				return cb(value == 25);
			}, 1000);
		});
	}, function (results) {
		console.log("results: %j", results);
	});
};

f3();