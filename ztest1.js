var co = require("co");
var Promise = require("bluebird");

co(function *() {
	var res = yield test("AAAA");
	console.log(res);
});

function test(args) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000, args);
	});
	// return function (cb) {
	// 	setTimeout(cb, 1000, args);
	// };
}