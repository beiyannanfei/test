/**
 * Created by wyq on 17/8/7.
 * let 和 const 命令 采坑
 */
function t1() {
	{
		let a = 10; //let声明的变量只在它所在的代码块有效
		var b = 1;
	}
	console.log("b = %j", b);
	try {
		console.log("a = %j", a);
	} catch (e) {
		console.error("err: %j", e.message || e);//err: "a is not defined"
	}
}

function t2() {
	for (let i = 0; i < 3; ++i) {
		let i = "abc";  //for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域
		console.log(i); //abc   abc    abc
	}
}

function t3() {
	console.log(foo);//undefined
	var foo = 2;  //var命令会发生”变量提升“现象，即变量可以在声明之前使用，值为undefined

	try {
		console.log(bar);
	} catch (e) {
		console.error("err: %j", e.message || e);//err: "bar is not defined"
	}
	let bar = 2;  //let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错
}

//在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。
function t4() {
	var tmp = 123;

	if (true) {
		//ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错
		try {
			tmp = 'abc';
		} catch (e) {
			console.error("err: %j", e.message || e); //err: "tmp is not defined"
		}
		let tmp;
	}
}









