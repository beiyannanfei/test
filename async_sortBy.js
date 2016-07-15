/**
 * Created by wyq on 2016/7/13.
 */

var rc = require("redis").createClient();
var async = require("async");

//redis test: {a: 5, b: 4, c: -5, d: 6, e: 3, f: 2}
var list = ["a", "b", "c", "d", "e", "f"];
var f1 = function () {
	async.sortBy(list, function (key, cb) {
		rc.HGET("test", key, function (err, value) {
			return cb(err, +value); //升序
			//return cb(err, +value * -1); //降序
		});
	}, function (err, results) {
		console.log("results: %j", results);
	});
};

f1();
