/**
 * Created by wyq on 16/12/19.
 */
"use strict";
var redis = require("ioredis");
var redisClient = redis.createClient();
var async = require("async");

var index = 0;

async.whilst(function () {
	return index < 1000;
}, function (cb) {
	redisClient.time(function (err, response) {
		console.log(response[0] + response[1]);
		++index;
		return cb();
	});
}, function (err) {
	console.log("============== finish ==============");
});


