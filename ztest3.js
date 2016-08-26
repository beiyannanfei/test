var co = require("co");
const _ = require("lodash");

function test(cb) {
	co(function *() {
		return yield new Promise((resolve, reject) => {
			// return reject("err");
			return resolve("ok");
		});
	}).then(val => {
		setTimeout(function () {
			return cb(null, val);
		}, 1000);
	}).catch(err=> {
		return cb(err);
	});
}

/*
 test(function (err, o) {
 console.log("err: %j, o: %j", err, o);
 });*/

/*var error = new Error("test0");
 error.a = 10;
 error.b = 20;
 console.log("err: " + error);*/


function a(id, updoc, tryTime, cb) {
	if (_.isFunction(tryTime)) {
		console.log("tryTime func");
		cb = tryTime;
		tryTime = 0;
	}
	if (!tryTime) {
		console.log("tryTime: %j", tryTime);
		tryTime = 0;
	}
	console.log(id, updoc, tryTime);
	if (tryTime < 5) {
		return setTimeout(a, 1000, id, updoc, ++tryTime, cb)
	}
	return cb ? cb("ok") : "";
}

/*a(1, 2, function (r) {
	console.log(r);
});*/

var tradeStateMap = exports.tradeStateMap = {
	SUCCESS: 2,
	REFUND: 5,
	NOTPAY: 1,
	CLOSED: 4,
	REVOKED: 10,
	USERPAYING: 7,
	PAYERROR: 8
};

console.log(_.extend({}, {a:10}, {b: 20}));






