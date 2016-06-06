var rc = require("redis").createClient();

var start = function () {
	var a = 0;
	if (a) {
		return rc.keys("*", function (err, o) {
			return console.log(arguments);
		});
	}
	console.log("0000000000000");
};

start();