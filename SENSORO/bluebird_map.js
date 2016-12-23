/**
 * Created by wyq on 16/12/23.
 */
var Promise = require("bluebird");

function getList() {
	var list = [1, 2, 3, 4];
	return new Promise((resolve, reject) => {
		return resolve(list)
	});
}

function execTimeOut(num) {
	console.log("[%j] ====== execTimeOut begin ====== num: %j", new Date().toLocaleString(), num);
	return new Promise((resolve, reject) => {
		setTimeout(function () {
			console.log("[%j] ====== execTimeOut finish ====== num: %j", new Date().toLocaleString(), num);
			return resolve(num);
		}, (num || 0) * 1000);
	});
}

getList().map(function (item) {
	console.log("[%j] ====== item: %j", new Date().toLocaleString(), item);
	return execTimeOut(item)
}, {concurrency: 1}).then(val => {  //并行函数数量
	console.log("[%j] ======finish val: %j", new Date().toLocaleString(), val);
});



