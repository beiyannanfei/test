var async = require("async");

var maps = {a: 10, b: 20, c: 30};

async.eachOfSeries(maps, function (val, key, cb) {
	console.log(val, key);
	return cb(null);
}, function (err) {
	console.log(err);
});

