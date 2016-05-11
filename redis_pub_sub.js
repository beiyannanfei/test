/**
 * Created by wyq on 2016/1/11.
 */
var redis = require("redis");
var redisClient = redis.createClient();

redisClient.SUBSCRIBE("redisChat", function (err, data) {
	console.log("err: %j, data: %j", err, data);
});

redisClient.on("message", function (a, b) {
	console.log("a: %j, b: %j", a, b)
});

