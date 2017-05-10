var co = require("co");

var asyncOperation = function () {
	return function (callback) {
		setTimeout(function () {
			callback(null, 'this was loaded asynchronously and it took 2 seconds to complete')
		}, 100);
	}
};

let f1 = asyncOperation();
f1(function (err, response) {
	console.log(arguments);
});
/*
 co(function *() {
 let result = yield asyncOperation();
 console.log(result);
 return result;
 }).then(val=> {
 console.log("val: %j", val);
 }).catch(err=> {
 console.log("err: %j", err);
 });
 */