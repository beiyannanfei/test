var async = require("async");

var srcList = [
	{status: 10, A: 104},
	{status: 20, A: 103},
	{status: 30, A: 102},
	{status: 40, A: 101}
];
console.log(srcList);

async.eachSeries(srcList, function (item, cb) {
	if (item.status > 20) {
		item.status = 8888;
	}
	return cb(null);
}, function (err) {
	console.log(srcList);
});