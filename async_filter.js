var rc = require("redis").createClient();
var async = require("async");

//redis中的数据 test:{a:10,b:20,c:30,d:40}

var list = ["a", "b", "c", "d"];
var f1 = function () {
	async.filter(list, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {    //只能返回false和true
			if (!!err) {
				return cb(false);
			}
			if (value < 25) {
				return cb(false);
			}
			return cb(true);
		});
	}, function (results) {
		console.log("results: %j", results);    //results: ["c","d"]
	});
};

var f2 = function () {
	async.filterSeries(list, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {
			setTimeout(function () {
				if (value < 25) {
					return cb(false);
				}
				return cb(true);
			}, 1000);
		});
	}, function (results) {
		console.log("results: %j", results);    //results: ["c","d"]
	});
};

var f3 = function () {
	async.filterLimit(list, 2, function (key, cb) {
		console.log("key: " + key);
		rc.HGET("test", key, function (err, value) {
			setTimeout(function () {
				if (value < 25) {
					return cb(false);
				}
				return cb(true);
			}, 1000);
		});
	}, function (results) {
		console.log("results: %j", results);    //results: ["c","d"]
	});
};

