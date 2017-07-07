/**
 * Created by wyq on 17/7/7.
 */
var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.get("/", function (req, res) {
	console.log(a);
	return res.send("api success...");
});

app.use(function (err, req, res, next) {
	res.send("----- " + err.message);
});

server.listen(3000, function () {
	console.log('Express server listening on port 3000');
});
