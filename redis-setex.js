/**
 * Created by wyq on 16/11/24.
 */
var rc = require("redis").createClient();

function test() {
	rc.set("aa", 100, "EX", 100, function (err, response) {
		console.log(arguments);
	})
}

test();

