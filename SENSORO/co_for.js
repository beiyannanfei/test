/**
 * Created by wyq on 16/10/12.
 * 在co中使用for
 */
"use strict";
const co = require("co");

function show(a) {
	return new Promise((resolve, reject) => {
		console.log("================= " + a);
		setTimeout(resolve, 1000, a);
	});
}

show(1).then(v1 => {
	console.log("v1: " + v1);
	return show(2);
}).then(v2 => {
	console.log("v2: " + v2);
	return show(3);
}).then(v3 => {
	console.log("v3: " + v3);
});

/*co(function *() {
 for (let i = 0; i < 10; ++i) {
 yield show(i);
 }
 }).then(val => {
 console.log("val: %j", val);
 }).catch(err => {
 });*/
