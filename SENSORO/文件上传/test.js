/**
 * Created by wyq on 17/7/3.
 */
var http = require("superagent");

http.post("127.0.0.1:3000/upload")
	.type('multipart/form-data')
	.attach("file", "../1.jpeg")
	.accept("text/json")
	.end(function (err, res) {
		console.log(arguments)
	});