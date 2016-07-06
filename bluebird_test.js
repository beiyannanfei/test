var Promise = require('bluebird');      //http://bluebirdjs.com/docs/api-reference.html
var rc = require("redis").createClient();
var fs = require("fs");
var co = require("co");

var newRc = Promise.promisifyAll(rc);
var f0 = function () {      //promisifyAll  封装后的函数会在放在最后增加Async  eg. HSET => HSETAsync
	newRc.HSETAsync("test", "aa", 100)
		.then(function (data) {
			console.log("data: %j", data);
		})
		.done(function () {
			console.log("finish");
		});
};

var f1 = function () {      //co支持
	co(function *() {
		var aDoc = yield newRc.HSETAsync("test", "aa", 100);
		console.log(aDoc);
		var bDoc = yield newRc.HGETAsync("test", "aa");
		console.log(bDoc);
	});
};

var f2 = function () {  //修改后缀  默认 HSET => HSETAsync
	newRc = Promise.promisifyAll(rc, {suffix: "Pro"});        //修改 HSET => HSETPro
	newRc.KEYSPro("*")
		.then(function (data) {
			console.log("data: %j", data);
		})
		.done(function () {
			console.log("finish");
		});
};

var f3 = function () {      //链式报错
	newRc.HSETAsync("test", "aa", 100)
		.then(function (data1) {
			console.log("data1: %j", data1);
			return newRc.LLENAsync("test");
		})
		.then(function (data2) {
			console.log("data2: %j", data2);
		})
		.catch(function (err) {
			console.log("err: %j", err);
			return newRc.HLENAsync("test");
		})
		.then(function (data3) {
			console.log("data3: %j", data3);
		})
		.done(function () {
			console.log("finish");
		});
};
