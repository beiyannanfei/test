/**
 * Created by wyq on 2016/3/3.
 */

var redis = require("redis-stream");
var client = new redis(6379, "127.0.0.1");

var comm_set = function () {
	var stream = client.stream();
	for (var index = 0; index < 10000; ++index) {
		var command = ['set', 'key_' + index, 'value_' + index];
		stream.redis.write(redis.parse(command));
	}
	stream.on("close", function () {
		console.log("finish");
	});
	stream.on("end", function () {
		console.log("end");
	});
	stream.on("data", function () {
		console.log("data arguments: %j", arguments);
	});
	stream.end();
};

var comm_rpush = function () {
	var rpush = client.stream('rpush', 'mylist');
	rpush.write('val1');
	rpush.write('val2');
	//rpush.pipe(process.stdout);
	rpush.on("close", function () {
		console.log("close arguments: %j", arguments);
	});
	rpush.on("end", function () {
		console.log("end arguments: %j", arguments);
	});
	rpush.on("data", function () {
		console.log("data arguments: %j", arguments);
	});
	rpush.end();
};

var comm_info = function () {
	var stream = client.stream();
	stream.redis.write(redis.parse(['info']));
	stream.redis.write(redis.parse(['lpush', 'mylist', 'val1', "val2"]));
	stream.redis.write(redis.parse(["keys", "*"]));
	/*stream.on("data", function () {
		console.log("data arguments: %j", arguments);
	});*/
	var buf = "";
	stream.on("data", function (chunk) {
		buf += chunk + "\n";
	});
	stream.on("end", function(){
		console.log(buf);
	});
	stream.end();
};

comm_info();