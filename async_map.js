/**
 * Created by wyq on 2015/8/7.
 */
var redis = require('redis');
var _ = require("underscore");
var async = require("async");

var redisClient = redis.createClient(6379, '127.0.0.1');

/*
var testArr = ["aaa", "bbb", "ccc", "ddd"];

async.mapSeries(testArr, function (item, cb) {
	redisClient.HGET("test", item, function (err, data) {
		return cb(err, data);
	});
}, function (err, result) {
	console.log("****err: %j", err);
	console.log("****result: %j", result);
	testArr.push("eee");
	var idMap = {};
	for (var index in testArr) {
		var key = testArr[index];
		var value = result[index];
		idMap[key] = value;
	}
	console.log(idMap);
});
*/

var testArr = ["a", "b", "c", "d", "e", "f", "g"];
async.mapLimit(testArr, 20,
	function (item, cb) {
		redisClient.HGET("test", item, function (err, data) {
			console.log("[%j] item: %j, data: %j", new Date().toLocaleString(), item, data);
			setTimeout(function () {
				return cb(err, data);
			}, 1000);
		});
	},
	function (err, results) {
		console.log("********* err: %j, results: %j", err, results);
	}
);

