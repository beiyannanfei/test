var rc = require("redis").createClient();

var bl1 = 123;

var getKeys = exports.getKeys = function (cb) {
	rc.keys("*", function (err, o) {
		return cb(err, o);
	});
};


