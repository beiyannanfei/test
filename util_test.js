/**
 * Created by wyq on 2016/1/21.
 */
var util = require('util');

var a = "AAA";

var str = util.format("test: %j", a);

console.log(str);

var exec = require('child_process').exec;

var cmdStr = "ls -lh";
cmdStr = "lt --port 3000";
exec(cmdStr, function (err, stdout, stderr) {
	console.log(err);
	console.log(stdout);
	console.log(stderr);
});

