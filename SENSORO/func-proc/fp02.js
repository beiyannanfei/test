//函数柯里化（curry）的定义很简单：传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数
"use strict";
var add = function (x) {  // <=> var addEs6 = x =>	(y => x + y);
	return function (y) {
		return x + y;
	};
};

function f1() {
	let add2 = add(2);
	let add200 = add(200);

	console.log(add2(3)); //5
	console.log(add200(12));  //212
}

// f1();

var checkAge = min => (age => age > min);

function f2() {
	var ch18 = checkAge(18);
	console.log(ch18(20));
}

f2();







