/**
 * Created by wyq on 2016/7/18.
 */

var mkdirp = require("mkdirp");

mkdirp("e:/testAAAA", function (err) {
	if (!!err) {
		return console.log("err: %j", err);
	}
	console.log("success");
});