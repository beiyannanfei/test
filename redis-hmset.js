/**
 * Created by wyq on 17/5/11.
 */
var redis = require('redis');
var redisClient = redis.createClient(6379, '127.0.0.1');

let data = ["a", 10, "b", 20, "c", 30];
redisClient.HMSET("test", data, function (err, response) {
	console.log(arguments);
});