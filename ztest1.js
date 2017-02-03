var moment = require("moment");

function show() {
	var diff_m = moment().set({'hour': 19, minute: 0, second: 0}).diff(moment(), 'm');
	var diff_s = moment().set({'hour': 19, minute: 0, second: 0}).diff(moment(), 's');
	console.log(diff_m, diff_s);
}

setInterval(show, 1000);

