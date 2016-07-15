/**
 * Created by wyq on 2016/7/13.
 */
var redis = require("redis");
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();

client.setAsync("foo", "bar").then(function (res) {
	console.log(res);
});

client.getAsync("foo")
	.then(res => {
		console.log(res);
	});



