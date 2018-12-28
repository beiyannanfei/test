const childProcess = require('child_process');

let word = "111 all Time";
childProcess.exec(`grep '${word}' /Users/wyq/bynf/test/ztestE.js | awk -F "${word}:" '{print $2}'`, function (err, response) {
	if (!!err) {
		return console.log("err: ", err.message || err)
	}
	console.log(response, typeof response);
	console.log("===============================");
	let data = response.split('\n');
	let max = 0;
	let min = 0;
	let count = 0;
	let total = 0;
	for (let item of data) {
		item = +item;
		if (item <= 0) {
			continue;
		}

		total += item;
		count++;
		if (item > max) {
			max = item;
		}
		if (min === 0 || min > item) {
			min = item;
		}
	}
	let avg = total / count;
	console.log("max: %j min: %j count: %j avg: %j", max, min, count, avg);
});

