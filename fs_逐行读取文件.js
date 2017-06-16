/**
 * Created by wyq on 2016/7/4.
 */
var fs = require('fs');
var path = require("path");
var util = require("util");

function readLines(input, func) {
	var remaining = '';
	input.on('data', function (data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		while (index > -1) {
			var line = remaining.substring(0, index);
			remaining = remaining.substring(index + 1);
			func(line);
			index = remaining.indexOf('\n');
		}
	});

	input.on('end', function () {
		if (remaining.length > 0) {
			console.error(remaining);
		}
	});
}

function func(data) {
	console.log(data);
}

var input = fs.createReadStream(__filename);

readLines(input, func);

