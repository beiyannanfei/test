/**
 * Created by wyq on 17/6/29.
 */
var sleep = function (time) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, time);
	})
};

var start = async function () {
	let arr = [1, 2, 3, 4, 5];
	for (let i = 0; i < arr.length; ++i) {
		console.log(`${new Date().toLocaleString()}当前是第${i}次等待..`);
		await sleep(i * 1000);
	}
};

start();