var rc = require("redis").createClient();

var fileds = ['aa', 'bb', 'cc'];
rc.HDEL("test", fileds, function (err, o) {
	console.log(arguments);
});