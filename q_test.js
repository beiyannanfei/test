/**
 * Created by wyq on 2015/8/24.
 */
var Q = require('q');
require('q-flow');  // extends q
Q.longStackSupport = true;
var redis = require("redis");
var rc = redis.createClient();

/*
 Q.ninvoke(this, "test", "Q.ninvoke")
 .then(function (res) {
 console.log("****** res: %j", res);
 return Q.resolve(res);  //将res传递给下一个then
 })
 .then(function (res) {
 console.log("******0 res: %j", res);
 return Q.reject(res);   //直接抛出错误，被catch捕获到
 })
 .then(function (res) {
 console.log("******1 res: %j", res);
 })
 .catch(function (err) {
 console.log("****** err: %j", err);
 })
 .done(function () {
 console.log("******done******");
 });

 exports.test = function (txt, callback) {
 console.log("Q.ninvoke****** %j ******", txt);
 return callback(null, {state: "success"});
 };*/

/*
 Q.nfcall(test, "asdf")
 .then(function (res) {
 console.log("****** res: %j", res);
 })
 .catch(function (err) {
 console.log("****** err: %j", err);
 })
 .done(function () {
 console.log("******* done *******");
 });

 function test(txt, cb) {
 console.log("Q.nfcall******** %j ********", txt);
 return cb(null, {state: "success"});
 };
 */

/*
 var jobs = [Q.ninvoke(this, 'test1', "aaa"), Q.ninvoke(this, 'test2', "bbb"), Q.ninvoke(this, 'test3', "ccc")];
 Q.all(jobs)
 .then(function (res) {
 console.log("******** res: %j", res);
 })
 .catch(function (err) {
 console.log("******** err: %j", err);
 })
 .done(function () {
 console.log("******** done ********");
 });


 exports.test1 = function (txt, cb) {
 console.log("test1*******%j", txt);
 return cb(null, txt);
 };

 exports.test2 = function (txt, cb) {
 console.log("test2*******%j", txt);
 return cb(null, txt);
 };

 exports.test3 = function (txt, cb) {
 console.log("test3*******%j", txt);
 return cb(null, txt);
 };
 */

/*
 var fun = Q.nbind(function (a, b, c, cb) {
 console.log("******this: %j, a: %j, b: %j, c: %j", this, a, b, c);
 return cb(null, this + a + b + c);
 }, 1, 2, 3);

 Q.fcall(fun, 4)
 .then(function (res) {
 console.log("************* res: %j", res);
 })
 .catch(function (err) {
 console.log("************* err: %j", err);
 })
 .done(function () {
 console.log("******* done *******");
 });
 */

/*var jobs = [Q.ninvoke(this, 'test1', "aaa"), Q.ninvoke(this, 'test2', "bbb"), Q.ninvoke(this, 'test3', "ccc")];
 Q.all(jobs)
 .spread(function (res0, res1, res2) {
 console.log("******** res0: %j, res1: %j, res2: %j", res0, res1, res2);
 })
 .catch(function (err) {
 console.log("******** err: %j", err);
 })
 .done(function () {
 console.log("******** done ********");
 });


 exports.test1 = function (txt, cb) {
 setTimeout(function () {
 console.log("[%j] test1*******%j", new Date().toLocaleString(), txt);
 return cb(null, txt);
 }, 1000);
 };

 exports.test2 = function (txt, cb) {
 setTimeout(function () {
 console.log("[%j] test2*******%j", new Date().toLocaleString(), txt);
 return cb(null, txt);
 }, 2000);
 };

 exports.test3 = function (txt, cb) {
 setTimeout(function () {
 console.log("[%j] test3*******%j", new Date().toLocaleString(), txt);
 return cb(null, txt);
 }, 3000);
 };*/

var Q_All = function () {
	var job = [Q.ninvoke(rc, "set", "aa", "bb"), Q.ninvoke(rc, "set", "bb", "cc")];
	Q.all(job)
		.then(res => {
			console.log("res: %j", res);    //res: ["OK","OK"]
		})
		.catch(e => {
			console.log("e: %j", e.message);
		});
};

var Q_All_ERR = function () {
	var job = [Q.ninvoke(rc, "set", "aa", "bb"), Q.ninvoke(rc, "set", "bb", "cc"), Q.ninvoke(rc, "lpush", "aa", "bb")];
	Q.all(job)
		.then(res => {
			console.log("res: %j", res);
		})
		.catch(e => {
			console.log("e: %j", e.message);    //e: "WRONGTYPE Operation against a key holding the wrong kind of value"
		});
};

var Q_spread_1 = function () {
	var job = [Q.ninvoke(rc, "set", "aa", "bb"), Q.ninvoke(rc, "set", "bb", "cc")];
	Q.all(job)
		.spread((r1, r2) => {
			console.log("r1: %j, r2: %j", r1, r2);  //r1: "OK", r2: "OK"
		});
};

var Q_allSettled = function () {
	var job = [Q.ninvoke(rc, "set", "aa", "bb"), Q.ninvoke(rc, "set", "bb", "cc"), Q.ninvoke(rc, "lpush", "aa", "bb"), Q.ninvoke(rc, "set", "cc", "dd")];
	Q.allSettled(job)
		.then(v => {
			console.log("v: %j", v);//v: [{"state":"fulfilled","value":"OK"},{"state":"fulfilled","value":"OK"},{"state":"rejected","reason":{"command":"LPUSH","code":"WRONGTYPE"}},{"state":"fulfilled","value":"OK"}]
		})
		.catch(e => {
			console.log("e: %j", e);
		});
};

Q_spread_1();