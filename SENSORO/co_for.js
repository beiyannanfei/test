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

co(function *() {
	for (let i = 0; i < 10; ++i) {
		yield show(i);
	}
}).then(val => {
}).catch(err => {
});
