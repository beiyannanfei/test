global.Promise = require('bluebird');
var Redis = require("ioredis");
var rc = new Redis(6379, "127.0.0.1");

function py() {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000, 10);
	});
}

function test1() {
	Promise.all([1, 2, py()]).spread((val1, val2, val3) => {
		console.log(val1, val2, val3);
	});
}

function getKeys() {
	return rc.hlen("test").catch(err => {
		console.log("============= " + err.message);
		return Promise.reject(err);
	}).then(val => {
		console.log("--------- val " + val);
		return rc.llen("test");
	});

	/*return rc.keys("*").then(val => {
	 if (val.length > 1) {
	 return "asdf";
	 }
	 return rc.llen(val[0]);
	 }).catch(err => {
	 console.log("******AAAAA******" + err.message);
	 return Promise.reject(new Error("******AAAAA******" + err.message));
	 });*/
}

function test2() {
	Promise.all([getKeys()]).spread((val1) => {
		console.log("val1: %j", val1);
	}).catch(err => {
		console.log("===== err: %j", err.message);
	});
}


function test3() {
	Promise.all([rc.hset("test", "aa", "bb"), rc.expire("test", 20)]).spread((v1, v2) => {
		console.log(v1, v2);
	}).catch(err => {
		console.log(err.message);
	});
}

test3();