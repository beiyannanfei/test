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
o_07();

