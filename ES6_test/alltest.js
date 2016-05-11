/**
 * Created by wyq on 2015/11/20.
 */
"use strict";
{
	let a = 10;
	var b = 1;
}

//console.log(a);//ReferenceError: a is not defined
console.log(b + "\n=======================================");

var arr = [1, 2, 3];
for (let i = 0; i < arr.length; ++i) {
}
//console.log(i); ReferenceError: i is not defined

var a = [];
for (var i = 0; i < 10; i++) {
	a[i] = function () {
		console.log(i);
	};
}
a[6](); // 10
console.log("=======================================");

var a = [];
for (let i = 0; i < 10; i++) {
	a[i] = function () {
		console.log(i);
	};
}
a[6](); // 6
console.log("=======================================");


