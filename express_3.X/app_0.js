//仅用来测试性能
var express = require('express');
var app = express();

	//curl "127.0.0.1:5000/test"
app.get("/test", function (req, res) {  //ab -c 100 -n 10000 "127.0.0.1:5000/test"
	return res.send("hello world");
});

exports.server = require('http').createServer(app);
exports.server.listen(5000, function () {
	console.log("server start...");
});
