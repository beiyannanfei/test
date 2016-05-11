/**
 * Created by wyq on 2016/1/21.
 */
var thunkify = require("thunkify");
var fs = require("fs");
var redis = require("redis");
var rc = redis.createClient();
var co = require("co");

/*var read = thunkify(fs.readFile);
read("a.txt")((err, data) => {
	console.log("err: %j, data: %j", err, data.toString());
});*/

/*
 function f(a, b, cb) {
 var sum = a + b;
 cb(sum);
 cb(sum);
 }

 var ft = thunkify(f);
 var print = console.log.bind(console);
 ft(1, 2)(print);
 */

/*
 var readFile = thunkify(fs.readFile);
 var gen = function*() {
 var r1 = yield readFile("a.txt");
 var r2 = yield readFile("b.txt");
 };
 var g = gen();
 var r1 = g.next();
 r1.value(function (err, data) {
 console.log("err: %j, data: %j", err, data.toString());
 if (err) throw err;
 var r2 = g.next(data);
 console.log(r2);
 r2.value(function (err, data) {
 if (err) throw err;
 console.log("err: %j, data: %j", err, data.toString());
 });
 });
 */

/*
 var readFile = thunkify(fs.readFile);
 var gen = function*() {
 var r1 = yield readFile("a.txt");
 var r2 = yield readFile("b.txt");
 };

 function run(fn) {
 var gen = fn();

 function next(err, data) {
 console.log("err: %j, data: %j", err, (data || "").toString());
 var result = gen.next(data);
 console.log(result);
 if (result.done) return;
 result.value(next);
 }

 next();
 }

 run(gen);
 */

/*
 fs.readFile("a.txt", function (err, data) {
 console.log("==err: %j, data: %j", err, data.toString());
 });

 var myfs = thunkify(fs.readFile);
 myfs("a.txt")(function (err, data) {
 console.log("**err: %j, data: %j", err, data.toString());
 });
 */

/*rc.set("a", 10, function (err, data) {
 console.log("==err: %j, data: %j", err, data.toString());
 });*/

/*
 var myset = thunkify(rc.set.bind(rc));
 myset("a", "132")(function (err, data) {
 console.log(err)
 });
 */

var myset = thunkify(rc.set.bind(rc));
myset("a", "132")(function (err, data) {
	console.log(err)
});

var gen = function*() {
	var r1 = yield myset("a", "10");
	var r2 = yield myset("b", "20");
};

function run(fn) {
	var gen = fn();

	function next(err, data) {
		console.log("err: %j, data: %j", err, (data || "").toString());
		var result = gen.next(data);
		console.log(result);
		if (result.done) return;
		result.value(next);
	}

	next();
}

run(gen);


var readFile = thunkify(fs.readFile);
/*
 var gen = function*() {
 var f1 = yield readFile("a.txt");
 var f2 = yield readFile("b.txt");
 console.log("f1: %j", f1.toString());
 console.log("f2: %j", f2.toString());
 };

 co(gen).then(function () {
 console.log(arguments);
 })
 */

/*
 co(function*() {
 var res = yield [
 readFile("a.txt"),
 readFile("b.txt")
 ];
 console.log(res);
 var f1 = yield readFile("a.txt");
 console.log("f1: %j", f1.toString());
 }).catch(function (err) {
 console.log(err);
 });
 */


'use strict';

let saludar = persona => {
	let { nombre, honorifico } = persona;
	let mensaje = `Hola ${honorifico} ${nombre}`;
	return mensaje;
}
console.log(saludar({ nombre: 'Pepito', honorifico: 'Don' }));


