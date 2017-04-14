var rc = require("redis").createClient();

rc.hkeys("test", function (err, response) {
	console.log(arguments);
});