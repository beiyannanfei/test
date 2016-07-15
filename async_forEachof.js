var rc = require("redis").createClient();
var async = require("async");

var map = {a: 10, b: 20, c: 30, d: 40};

var f1 = function () {
	async.forEachOf(map, function (value, key, cb) {        //同each
		console.log("value: %j, key: %j", value, key);
		rc.HSET("test", key, value, cb);
	}, function (err) {
		console.log("finish");
	});
};

var f2 = function () {
	async.forEachOfSeries(map, function (value, key, cb) {        //同eachSeries
		console.log("value: %j, key: %j", value, key);
		rc.HSET("test", key, value, function (err, o) {
			setTimeout(cb, 1000);
		});
	}, function (err) {
		console.log("finish");
	});
};

var f3 = function () {
	async.forEachOfLimit(map, 2, function (value, key, cb) {        //同eachLimit
		console.log("value: %j, key: %j", value, key);
		rc.HSET("test", key, value, function (err, o) {
			setTimeout(cb, 1000);
		});
	}, function (err) {
		console.log("finish");
	});
};

f3();
