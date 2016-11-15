var express = require("../../express_3.X/node_modules/express");
var app = express();

app.get("/", function (req, res) {
	console.log("visit port / 5001 server");
	return res.send("port:5001");
});

app.get("/a", function (req, res) {
	console.log("visit port 5001 server");
	return res.send("port:5001");
});

exports.server = require('http').createServer(app);
exports.server.listen(5001, function () {
	console.log("server start port 5001...");
});