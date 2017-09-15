/**
 * Created by wyq on 17/5/18.
 */
function o_01() {
	var x = 1;
	console.log(x);
	(function () {
		console.log(x);
		var x = 2;
		console.log(x);
	})();
	//=> 1	undefined	2
}

function o_02() {
	var obj = {
		x: 1
	};
	var x = 1;
	var incre = function (a) {
		"object" == (typeof a) ? a.x++ : a++;
	};
	incre(obj);
	incre(x);
	console.log(x);     //=> 1
	console.log(obj.x); //=> 2
}

function o_03() {
	var remoteGet = function (cb) {
		return cb("ok");
	};

	for (var i = 0; i < 3; i++) {
		remoteGet(function (res) {
			console.log(res + ":" + i);
		});
	}
}

function o_04() {
	var remoteGet = function (cb) {
		setTimeout(() => {
			return cb("ok");
		}, 0);
	};

	for (var i = 0; i < 3; i++) {
		remoteGet(function (res) {
			console.log(res + ":" + i);
		});
	}
}

function o_05() {
	var remoteGet = function (cb) {
		setTimeout(() => {
			return cb("ok");
		}, 0);
	};

	for (let i = 0; i < 3; i++) {
		remoteGet(function (res) {
			console.log(res + ":" + i);
		});
	}
}


function o_06() {
	var start = new Date;
	setTimeout(function () {
		var end = new Date;
		console.log('Time elapsed:', end - start, 'ms');
	}, 500);
	while (new Date - start < 1000) {
	}
}

function o_07() {
	var myObj = {
		foo: "bar",
		func: function () {
			console.log("=====" + this.foo);
			(function () {
				console.log(this.foo);
			}());
		}
	};
	myObj.func();
}

function o_08() {
	for (var i = 0; i < 5; ++i) {
		setTimeout(function () {
			console.log(new Date, i);
		}, 1000);
	}
	console.log("=", new Date, i);
	/*= 2017-09-15T02:13:05.136Z 5
	 2017-09-15T02:13:06.123Z 5
	 2017-09-15T02:13:06.124Z 5
	 2017-09-15T02:13:06.124Z 5
	 2017-09-15T02:13:06.124Z 5
	 2017-09-15T02:13:06.124Z 5*/
}

function o_09() {
	var output = function (i) {
		setTimeout(function () {
			console.log(new Date, i);
		}, 1000);
	};

	for (var i = 0; i < 5; ++i) {
		output(i);
	}
	console.log(new Date, i);
	/*	2017-09-15T02:21:54.037Z 5
	 2017-09-15T02:21:55.028Z 0
	 2017-09-15T02:21:55.029Z 1
	 2017-09-15T02:21:55.029Z 2
	 2017-09-15T02:21:55.029Z 3
	 2017-09-15T02:21:55.029Z 4*/
}

function o_10() {
	for (let i = 0; i < 5; ++i) {
		setTimeout(function () {
			console.log(new Date, i);
		}, 1000);
	}
	try {
		console.log(new Date, i);
	} catch (e) {
		console.log("e: %j", e.message || e);
	}
	/*	e: "i is not defined"
	 2017-09-15T02:24:11.972Z 0
	 2017-09-15T02:24:11.976Z 1
	 2017-09-15T02:24:11.976Z 2
	 2017-09-15T02:24:11.976Z 3
	 2017-09-15T02:24:11.976Z 4*/
}

function o_11() {
	const tasks = [];
	for (var i = 0; i < 5; i++) {   // 这里 i 的声明不能改成 let，如果要改该怎么做？
		((j) => {
			tasks.push(new Promise((resolve) => {
				setTimeout(() => {
					console.log(new Date, j);
					resolve();  // 这里一定要 resolve，否则代码不会按预期 work
				}, 1000 * j);   // 定时器的超时时间逐步增加
			}));
		})(i);
	}

	Promise.all(tasks).then(() => {
		setTimeout(() => {
			console.log(new Date, i);
		}, 1000);   // 注意这里只需要把超时设置为 1 秒
	});
	/*	2017-09-15T02:28:00.546Z 0
	 2017-09-15T02:28:01.536Z 1
	 2017-09-15T02:28:02.534Z 2
	 2017-09-15T02:28:03.534Z 3
	 2017-09-15T02:28:04.531Z 4
	 2017-09-15T02:28:05.536Z 5*/
}

function o_12() {
	const tasks = []; // 这里存放异步操作的 Promise
	const output = (i) => new Promise((resolve) => {
		setTimeout(() => {
			console.log(new Date, i);
			resolve();
		}, 1000 * i);
	});

// 生成全部的异步操作
	for (var i = 0; i < 5; i++) {
		tasks.push(output(i));
	}

// 异步操作完成之后，输出最后的 i
	Promise.all(tasks).then(() => {
		setTimeout(() => {
			console.log(new Date, i);
		}, 1000);
	});
	/*	2017-09-15T02:29:20.655Z 0
	 2017-09-15T02:29:21.640Z 1
	 2017-09-15T02:29:22.643Z 2
	 2017-09-15T02:29:23.642Z 3
	 2017-09-15T02:29:24.644Z 4
	 2017-09-15T02:29:25.649Z 5*/
}

function o_13() {   //注意:需要node8.0+版本才能执行
	// 模拟其他语言中的 sleep，实际上可以是任何异步操作
	const sleep = (timeountMS) => new Promise((resolve) => {
		setTimeout(resolve, timeountMS);
	});

	(async() => {  // 声明即执行的 async 函数表达式
		for (var i = 0; i < 5; i++) {
			await sleep(1000);
			console.log(new Date, i);
		}

		await sleep(1000);
		console.log(new Date, i);
	})();
	/*	2017-09-15T02:33:44.034Z 0
	 2017-09-15T02:33:45.018Z 1
	 2017-09-15T02:33:46.019Z 2
	 2017-09-15T02:33:47.020Z 3
	 2017-09-15T02:33:48.019Z 4
	 2017-09-15T02:33:49.021Z 5*/
}
o_12();
