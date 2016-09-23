var Task = require("data.task");
var _ = require("lodash");
var rc = require("redis").createClient();


var t1 = Task.of(3).map(t => t + 1);
t1.fork(err=> {
	console.log("t1 err: %j", err);
}, data=> {
	console.log("t1 data: %j", data);
});

var getKeys = function (kStr) {
	return new Task((reject, result) => {
		rc.HLEN(kStr, (err, val) => {
			err ? reject(err) : result(val);
		});
	});
};

getKeys("test").fork(function (err) {
	console.log("err: %j", err.message);
}, function (data) {
	console.log("data: %j", data);
});


