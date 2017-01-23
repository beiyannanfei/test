/**
 * Created by wyq on 17/1/23.
 */
"use strict";
const request = require('superagent');

var getHttp = exports.getHttp = function () { //=>curl "127.0.0.1:9900/test/123?a=456&b=789"
	let url = "127.0.0.1:9900/test/123";
	request.get(url)
		.type("application/x-www-form-urlencoded")
		.query({a: 456, b: 789})
		.accept('text/json')
		.end((err, res) => {
			if (!!err) {
				return console.log("getHttp err: %j", err);
			}
			console.log("res.text: %j", res.text);
			console.log("res.body: %j", res.body);
		});
};

var postHttp = exports.postHttp = function () {//=> curl "127.0.0.1:9900/test/123?a=456&b=789" -d "c=147&d=258"
	let url = "127.0.0.1:9900/test/123";
	request.post(url)
		.type("application/x-www-form-urlencoded")
		.query({a: 456, b: 789})
		.send({c: 147, d: 258})
		.accept("text/json")
		.end((err, res) => {
			if (!!err) {
				return console.log("postHttp err: %j", err);
			}
			console.log("res.text: %j", res.text);
			console.log("res.body: %j", res.body);
		});
};

var delHttp = exports.delHttp = function () {//=> curl -X DELETE "127.0.0.1:9900/test/1230?a=4560&b=7890" -d "c=1470&d=2580"
	let url = "127.0.0.1:9900/test/1230";
	request.del(url)
		.type("application/x-www-form-urlencoded")
		.query({a: 4560, b: 7890})
		.send({c: 1470, d: 2580})
		.accept("text/json")
		.end((err, res) => {
			if (!!err) {
				return console.log("delHttp err: %j", err);
			}
			console.log("res.text: %j", res.text);
			console.log("res.body: %j", res.body);
		});
};

var putHttp = exports.putHttp = function () {//=> curl -X PUT "127.0.0.1:9900/test/1?a=2&b=3" -d "c=4&d=5"
	let url = "127.0.0.1:9900/test/1";
	request.put(url)
		.type("application/x-www-form-urlencoded")
		.query({a: 2, b: 3})
		.send({c: 4, d: 5})
		.accept("text/json")
		.end((err, res) => {
			if (!!err) {
				return console.log("putHttp err: %j", err);
			}
			console.log("res.text: %j", res.text);
			console.log("res.body: %j", res.body);
		});
};
