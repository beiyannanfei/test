/**
 * Created by sensoro on 16/8/17.
 */

var superagent = require('superagent');

var t1 = function () {
	superagent.post("127.0.0.1:4000/wxpay/test?a=10&b=20")
		.type('application/x-www-form-urlencoded')
		.send({c: 30, d: 40})
		.timeout(20000)
		.accept('text/json')
		.end(function (err, xhr) {
			console.log(err, JSON.parse(xhr.text));
		});
};

var request = require("request");
var t2 = function () {
	request.post({url: "http://127.0.0.1:4000/wxpay/test?a=10&b=20", method: 'POST', form: {c: 30, d: 40}},
		function (err, response, body) {
			console.log(err);
			console.log("=============================");
			console.log(response);
			console.log("=============================");
			console.log(body);
		});
	/*request({
	 url: url,
	 method: 'POST',
	 body: data
	 }, function (err, response, body) {
	 if (err) {
	 return callback(err);
	 }

	 callback(null, body);
	 });*/
};

superagent("http://www.baidu.com/search")
	.end(function (err,res) {
		console.log(arguments);
	});

