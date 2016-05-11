/**
 * Created by wyq on 2016/5/5.
 *
 * 请首先执行  set aa b   set bb c
 */
var _ = require('underscore');
var Q = require('q');
var redis = require("redis");
var co = require("co");

var Client = function (redis) {
	this.redis = redis;
	this.redis.on("error", function (err) {
		console.log("redis client Error %j", err);
	});
	this.bindAll();
};

Client.prototype.bindAll = function () {
	var self = this;
	[
		"keys",
		"set",
		"get"
	].forEach(function (key) {
		self[key] = Q.nbind(self.redis[key], self.redis);
	});
};

var rc = new Client(redis.createClient());

var keys = co.wrap(function *(args) {
	return rc.keys(args);
});

var myGet = co.wrap(function *(args) {
	return rc.get(args);
});

/*exports.getKeys("*").then(function (v) {
 console.log(v)
 });*/

var val = co(function *() {
	//var ress = yield keys("*");
	var v1 = myGet("aa");
	var v2 = myGet("bb");
	var ress = yield [v1, v2];
	return ress;
})

val.then(v => {
	console.log(v)
})
