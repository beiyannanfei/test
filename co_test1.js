/**
 * Created by wyq on 2016/5/5.
 */
var redis = require("redis");
var co = require("co");
var thunkify = require("thunkify");
var rc = redis.createClient();

var mySet = function (key, val, myErr) {
	return new Promise((resolve, reject) => {
		rc.set(key, val, function (err, data) {
			if (myErr) {
				err = "errTest";
			}
			if (!!err) {
				return reject(err);
			}
			return resolve(data);
		});
	})
};

var myDel = function (key) {
	return new Promise((resolve, reject) => {
		rc.del(key, function (err, o) {
			if (!!err) {
				return reject(err);
			}
			return resolve(o);
		})
	})
};

co(function *() {
	var res = yield {
		setA: mySet("aa", 10),
		setB: mySet("bb", 20)
	}
	console.log("res: %j", res);
	try {
		var res1 = yield mySet("cc", JSON.stringify(res), 1);
	}
	catch (e) {
		console.log("e: %j", e);
		yield myDel("aa");
		yield myDel("bb");
	}
	console.log("res1: %j", res1);
	return [res, res1];
}).then(val => {
	console.log("val: %j", val);
	process.exit();
}).catch(function (err) {
	console.log("err: " + err);
	process.exit();
});

/*var fn = co.wrap(function *(k, v, err) {
 return yield mySet(k, v, err);
 });

 fn("cc", 30).then(val => {
 console.log("fn:" + val);
 }).catch(err => {
 console.log("fn err: " + err);
 });*/


co(function *(){
	try {
		yield Promise.reject(new Error('boom'));
	} catch (err) {
		console.error(err.message); // "boom"
		yield Promise.reject(new Error('boom1'));
	}
}).catch(onerror);

function onerror(err) {
	// log any uncaught errors
	// co will not throw any errors you do not handle!!!
	// HANDLE ALL YOUR ERRORS!!!
	console.error("onerror " + err.message);
}





