/**
 * Created by sensoro on 16/8/22.
 */

var Redis = require("ioredis");
var rc = new Redis(6379, "127.0.0.1");
var rc1 = new Redis(6379, "127.0.0.1");
var co = require("co");
var Promise = require("bluebird");
/*
 var t1 = function () {
 rc.set("t1", "aaa", function (err, o) {
 console.log("err: %j, o: %j", err, o);
 rc.get("t1", function (err, res) {
 console.log("err: %j, res: %j", err, res);
 });
 });
 };


 var t2 = function () {
 rc.hset("hash", "a1", "1111")
 .then(function (result) {
 console.log("result: %j", result);
 return rc.llen("hash");
 })
 .then(function (r1) {
 console.log("r1: %j", r1);
 })
 .catch(function (err) {
 console.log("err: %j", err);
 });
 };

 var t3 = function () {
 co(function *() {
 var r1 = yield rc.set("t3", "333");
 console.log("r1: %j", r1);
 var res = yield  rc.get("t3");
 console.log("res: %j", res);
 var r2 = yield rc.hlen("t3");
 console.log("r2: %j", r2);
 }).catch(function (err) {
 console.log("err: %j", err);
 });
 };

 var t4 = function () {
 rc.brpop("l1", 0, function (err, res1) {
 console.log("err: %j, res1: %j", err, res1);
 });
 rc.keys("*", function (err, res2) {   //上一个阻塞函数没有执行的情况下该函数不会执行
 console.log("err: %j, res2: %j", err, res2);
 });
 };*/

/*
 function test1() {
 console.log("=========begin test1");
 rc.brpop("test1", 0, function (err, val) {
 console.log("test1: %j", arguments);
 });
 }

 function test2() {
 console.log("=========begin test2");
 rc1.keys("*", function (err, val) {
 console.log("test2: %j", arguments);
 });
 }

 test1();
 setTimeout(test2, 5000);
 */


/*rc.hkeys("test").then(val => {
 console.log("hkeys val: %j", val);
 var keys = val;
 keys.push("test");
 console.log("all keys: %j", keys);
 return rc.del(keys);
 }).then(val => {
 console.log("del val: %j", val);
 }).catch(err => {
 console.log("err: %j", err);
 });*/





