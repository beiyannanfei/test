var rc = require("redis").createClient();
var async = require("async");
var _ = require("underscore");

var start = function () {
	console.time("HMGET");
	var fields = ['a', 'b', 'c', 'd', undefined, 'e', 'f', 'g'];
	rc.HMGET("test", fields, function (err, datas) {
		console.timeEnd("HMGET");   //12ms
		console.log(datas);
	});
};

var start1 = function () {
	console.time("HGET");
	var fields = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
	async.mapSeries(fields, function (field, cb) {
		rc.HGET("test", field, function (err, o) {
			return cb(null, o);
		});
	}, function (err, results) {
		console.timeEnd("HGET");    //18ms
		console.log(results);
	});
};


setTimeout(start1, 1000);   //延时保证连接创建完成
