var express = require("../../express_3.X/node_modules/express");
var app = express();

app.get("/", function (req, res) {
	console.log("visit port / 5002 server");
	return res.send("port:5002");
});

app.get("/a", function (req, res) {
	console.log("visit port 5002 server");
	return res.send("port:5002");
});

exports.server = require('http').createServer(app);
exports.server.listen(5002, function () {
	console.log("server start port 5002...");
});