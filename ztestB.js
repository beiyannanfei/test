var async = require("async");
let arr = [];
for (let i = 1; i < 100000; ++i) {
	arr.push(i);
}

async.eachSeries(arr, function (item, cb) {
	console.log("item: %j", item);
	return setTimeout(cb, 10);
}, function (err) {
	console.log("=======");
});