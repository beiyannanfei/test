//函数组合 h(g(f(x)));

var compose = function (f, g) {
	return function (x) {
		return f(g(x));
	}
};

function f1() {
	var add1 = function (x) {
		return x + 1;
	};
	var mul5 = function (x) {
		return x * 5;
	};
	var c = compose(mul5, add1);
	console.log(c(2));  //(2+1)*5=15

	var d = compose(add1, mul5);
	console.log(d(2));  //(2*5)+1=11
}

// f1();


/*var myCom = function (f) {
 return function (g) {
 return function (x) {
 return f(g(x));
 }
 }
 };*/
var myCom = f => (g => (x => (f(g(x)))));

function f2() {
	var add1 = x => x + 1;
	var mul5 = x => x * 5;

	var f = myCom(mul5);
	var a = f(add1);
	console.log(a(2));  //2+1 *5 = 15
}

// f2();

var rc = require("redis").createClient();
/*
 function get(key, cb) {
 rc.get(key, function (err, val) {
 return cb(err, val);
 });
 }

 function hget(key, cb) {
 rc.hgetall(key, function (err, val) {
 return cb(err, val);
 });
 }

 function f3(key, cb) {
 get(key, function (err, val) {
 hget(val, function (err, val) {
 return cb(err, val);
 });
 });
 }

 f3("aaa", function (err, o) {
 console.log(arguments);
 });*/

function redisCom(hget) {
	return function (get) {
		return function (key, cb) {
			get(key, function (val) {
				return hget(val, cb);
			});
		}
	}
}

var rGet = function (key, cb) {
	console.log("======== rGet: %j", key);
	rc.get(key, function (err, o) {
		return cb(o);
	});
};

var rGetall = function (key, cb) {
	console.log("======== rGetall: %j", key);
	rc.hgetall(key, function (err, o) {
		return cb(o);
	});
};

var a = redisCom(rGetall);
var b = a(rGet);
b("aaa", function (o) {
	console.log(o);
});



