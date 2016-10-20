//压测用
//curl "127.0.0.1:5001/test"
//
var express = require('express');
var app = express();

app.get("/test", function (req, res) {
	return res.send("hello ex4");
});

app.listen(5001, function () {
	console.log("server start...");
});
