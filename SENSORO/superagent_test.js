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

/*superagent("http://www.baidu.com/search")
 .end(function (err,res) {
 console.log(arguments);
 });*/

function test(url, param, cb) {
	superagent.post(url)
		.type("application/x-www-form-urlencoded")
		.send(param)
		.timeout(10000)
		.accept("text/json")
		.end(function (err, xhr) {
			if (!!err) {
				return cb(err);
			}
			if (xhr.statusCode != 200) {
				return cb(xhr.statusCode);
			}
			if (!xhr.body) {
				return cb("response has not content");
			}
			let body;
			try {
				body = JSON.parse(xhr.text);
			}
			catch (e) {
				console.log(e.message);
				body = xhr.text;
			}
			return cb(null, body);
		});
}

/*test("http://127.0.0.1:5000/admin/test", {a: 10, b: 20}, function (err, response) {
 console.log(arguments);
 });*/

/*test("http://127.0.0.1:3000/geofence/add",
	{
		name: "TEST",
		applyType: ["all"],
		multiPoint: [
			{lat: 0, lon: 0},
			{lat: 0, lon: 10},
			{lat: 10, lon: 10},
			{lat: 10, lon: 0}
		]
	},
	function (err, response) {
		console.log(arguments);
	});*/


superagent.post("http://127.0.0.1:3000/tools/images/upload1")
	.type('multipart/form-data')
	.attach("file", "./1.jpeg")
	.end(function (err, xhr) {
		console.log(xhr.body);
	});

