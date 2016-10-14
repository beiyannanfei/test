/**
 * Created by wyq on 16/9/21.
 * 初探函数式编程
 */
"use strict";
var _ = require("lodash");

//纯函数的定义是，对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。
function f1() {
	let arr = [1, 2, 3, 4, 5];
	// Array.slice是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的 纯函数
	console.log(arr.slice(0, 3));//=> [1,2,3]
	console.log(arr.slice(0, 3));//=> [1,2,3]

	// Array.splice是不纯的，它有副作用，对于固定的输入，输出不是固定的
	console.log(arr.splice(0, 3));//=> [1,2,3]
	console.log(arr.splice(0, 3));//=> [4,5]
	console.log(arr.splice(0, 3));//=> []
}

function f2() {
	let min = 18;
	let checkage = function (age) {   //不纯 依赖外部变量min
		return age > min;
	};

	let checkage1 = function (age) {  //纯函数
		return age > 18;
	}
}

function f3() {
	let sin = _.memoize(function (x) {
		return Math.sin(x);
	});
	console.time("first sin");
	let a = sin(1);     //无缓存比较慢
	console.log(a);
	console.timeEnd("first sin");

	console.time("second sin");
	let b = sin(10);  //有缓存了,非常快
	console.log(b);
	console.timeEnd("second sin");
}

// f3();








