/**
 * Created by wyq on 2015/12/14.
 */

var readFile = require('fs-readfile-promise');

readFile("tes1t.txt")
	.then(function (data) {
		console.log("data1");
	})
	.catch(function (err) {
		console.log("err1");
	})
	.then(function () {
		return readFile("test.txt");
	})
	.then(function (data) {
		console.log("data2");
	})
	.catch(function (err) {
		console.log("err2");
	});
