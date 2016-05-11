/**
 * Created by wyq on 2016/4/15.
 */

var async = require("async");

var i = 0;
async.whilst(function () {
	return i < 100;
}, function (cb) {
	console.log("进程 " + process.argv[2] + " 执行 " + i++);
	setTimeout(function () {
		return cb(null);
	}, 100);
}, function (err) {
	console.log("spawn finish");
});
