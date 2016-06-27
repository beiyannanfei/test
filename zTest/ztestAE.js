var rc = require("redis").createClient();

var a = function () {
	rc.LRANGE("test", 0, -1, function (err, dList) {
		console.log(dList);
		var newList = [];
		dList.forEach(function (item) {
			newList.push(item);
		});
		console.log(newList);
		rc.RPUSH("n-test", newList, function (err, o) {
			console.log(arguments);
		});
	});
};
a();

