var Promise = require("bluebird");

Promise.resolve().then(val => {
	console.log("val: %j", val);
}).catch(err => {
	console.log("err: %j", err);
});