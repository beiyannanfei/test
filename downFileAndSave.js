var request = require('superagent');
var url = "http://58.215.39.44/tvmad/mp4/BTV4/1bed510450d828868c41932cef4f46e4.mp4";
var fs = require("fs");
var async = require("async");


/*
var req = request(url);
req.pipe(fs.createWriteStream("test.mp4"));
req.on("end", function (err, data) {
	console.log("[%j]**********end", new Date().toLocaleString());
	console.log(err);
	console.log(data)
});

req.on("error", function (err, data) {
	console.log("**********error");
	console.log(err);
	console.log(data)
});
*/

exports.downUrlFile = function (url, fileName, cb) {
	console.log("[%j] downUrlFile url: %j, fileName: %j", new Date().toLocaleString(), url, fileName);
	var req = request(url);
	req.pipe(fs.createWriteStream(fileName));
	req.on("end", function () {
		cb ? cb(null) : "";
	});
	req.on("error", function (err) {
		cb ? cb(err) : "";
	});
};