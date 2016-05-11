/**
 * Created by wyq on 2015/11/26.
 * node执行系统命令
 */

var exec = require('child_process').exec;

/*
 var cmd = "pwd";
 exec(cmd, function (err, stdout, stderr) {
 console.log(err);
 console.log(stdout);
 console.log(stderr);

 cmd = "cd " + stdout.substr(0, 10) + "/liudan \npwd";
 console.log(cmd);
 exec(cmd, function (err, stdout, stderr) {
 console.log("===================" + err);
 console.log(stdout);
 console.log(stderr);
 });
 });
 */


/*
 var fs = require("fs");
 var cmd = "dir";
 exec(cmd, function (err, stdout, stderr) {
 console.log("***************err: %j", err);
 console.log(stdout);
 console.log("***************stderr: %j", stderr);
 fs.writeFile("dir.txt",
 stdout,
 {encoding: 'utf8', mode: 438, flag: 'a+' },
 function (err, results) {
 console.log("err: %j, results: %j", err, results);
 });
 });
 */

var cmd = "ls";

var workerProcess = exec(cmd, function (err, stdout, stderr) {
	console.log(err);
	console.log(stdout);
	console.log(stderr);
});

workerProcess.on("exit", function (code) {
	console.log("子进程已退出，退出码 " + code);
});
