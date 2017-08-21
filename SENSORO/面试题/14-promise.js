/**
 * Created by wyq on 17/8/18.
 */
function t1() {
	let doSth = new Promise((resolve, reject) => {
		console.log("hello");
		return resolve();
	});
	doSth.then(() => {
		console.log("over");    //hello   over
	});
}

function t2() {
	let doSth = new Promise((resolve, reject) => {
		console.log("hello");
		return resolve();
	});

	setTimeout(() => {
		doSth.then(() => {
			console.log("over");  //hello  1秒后 over
		});
	}, 1000);
}

function t3() {
	setTimeout(function () {
		console.log(1)
	}, 0);
	new Promise(function executor(resolve) {
		console.log(2);
		for (var i = 0; i < 10000; i++) {
			i == 9999 && resolve();
		}
		console.log(3);
	}).then(function () {
		console.log(4);
	});
	console.log(5);   //顺序  23541
}
t3();


