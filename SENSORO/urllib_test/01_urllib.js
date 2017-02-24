/**
 * Created by wyq on 17/2/24.
 */
"use strict";
var urllib = require("urllib");
var Promise = require("bluebird");
var co = require("co");

var url = "127.0.0.1:9001/ajax/urllib";
var options = {
	contentType: "json",
	method: "POST",
	data: {c: 33, d: 44}
};

co(function *() {
	var res = yield test(url, options);
	console.log(res.toString());
	var res1 = yield testSync(url, options);
	console.log(res1.toString());
});


function test(url, options) {   //该方法也可以返回promise
	return function (cb) {
		urllib.request(url, options, function (err, response, body) {
			return cb(err, response);
		});
	};
}

function testSync(url, options) {
	return new Promise((resolve, reject) => {
		urllib.request(url, options, function (err, response, body) {
			if (!!err) {
				return reject(err);
			}
			return resolve(response);
		});
	});
}

