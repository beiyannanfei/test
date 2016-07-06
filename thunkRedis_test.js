var redis = require("thunk-redis");
var redisClient = redis.createClient();
var pro = require('bluebird');
var Q = require('q');
var rc = require("redis").createClient();


var f0 = function () {      //正常流程测试
	redisClient.HSET("test", "aaa", 100)(function (err, data) {
		console.log("err: %j, data: %j", err, data);
	});
};

var f1 = function () {  //报错
	redisClient.LLEN("test")(function (err, data) {
		console.log("err: %j, data: %j", err, data);
	});
};

var f2 = function () {  //promise  操作集群
	redisClient = redis.createClient({usePromise: pro});
	redisClient.HSET("test", "aaa", 100)
		.then(function (data) {
			console.log("data: %j", data);
		})
		.catch(function (err) {
			console.log("err: %j", err);
		})
		.done(function () {
			console.log("finish");
		});
};

var f3 = function () {      //报错情况
	redisClient = redis.createClient({usePromise: pro});
	redisClient.LLEN("test")
		.then(function (data) {
			console.log("data: %j", data);
		})
		.catch(function (err) {
			console.log("err: %j", err);
		})
		.done(function () {
			console.log("finish");
		});
};

var f4 = function () {      //批量并行
	redisClient = redis.createClient({usePromise: Promise});
	pro.all([redisClient.HSET("test", "a", 10), redisClient.HSET("test", "b", 20), redisClient.HSET("test", "c", 30)])
		.then(function (data) {
			console.log("data: %j", data);
		})
		.catch(function (err) {
			console.log("err: %j", err);
		})
		.done(function () {
			console.log("finish");
		});
};

var f5 = function () {
	pro.all([Q.ninvoke(rc, "hset", "test", "a", 10), Q.ninvoke(rc, "hset", "test", "b", 20), Q.ninvoke(rc, "hset", "test", "c", 30)])
		.then(function (data) {
			console.log("data: %j", data);
		})
		.catch(function (err) {
			console.log("err: %j", err);
		})
		.done(function () {
			console.log("finish");
		});
};

f5();



