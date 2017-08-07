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

function t5() {
	try {
		console.log(typeof x);   //“暂时性死区”也意味着typeof不再是一个百分之百安全的操作
	} catch (e) {
		console.error("err: %j", e.message || e); //err: "x is not defined"
	}
	let x;
	console.log(typeof undeclared_variable); //如果一个变量根本没有被声明，使用typeof反而不会报错, out: undefined
}

function t6() {
	function bar(x = y, y = 2) {//调用bar函数之所以报错（某些实现可能不报错），是因为参数x默认值等于另一个参数y，而此时y还没有声明，属于”死区“。如果y的默认值是x，就不会报错，因为此时x已经声明了
		return [x, y];
	}

	try {
		bar();
	} catch (e) {
		console.error("err: %j", e.message || e);   //err: "y is not defined"
	}
}

function t7() {
	var x = x;
	try {
		let y = y;  //代码报错，也是因为暂时性死区。使用let声明变量时，只要变量在还没有声明完成前使用，就会报错
	} catch (e) {
		console.error("err: %j", e.message || e);   //err: "y is not defined"
	}
}

function t8(arg) {  //let不允许在相同作用域内，重复声明同一个变量
	// let arg;//Identifier 'arg' has already been declared
}

function t9() {
	//代码的原意是，if代码块的外部使用外层的tmp变量，内部使用内层的tmp变量。但是，函数f执行后，输出结果为undefined，原因在于变量提升，导致内层的tmp变量覆盖了外层的tmp变量。
	var tmp = new Date();

	function f() {
		console.log(tmp); //undefined
		if (false) {
			var tmp = 'hello world';
		}
	}

	f();
}

function t10() {//如果两次都使用var定义变量n，最后输出的值才是10
	let n = 5;//外层代码块不受内层代码块的影响。
	var m = 5;//如果两次都使用var定义变量n，最后输出的值才是10
	if (1) {
		let n = 10;
		var m = 10;
	}
	console.log("n = %s, m = %s", n, m);  //n = 5, m = 10
}


//const 命令
function t11() {
	const PI = 3.1415;//const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值
	console.log(PI);
	try {
		PI = 3; //const声明一个只读的常量。一旦声明，常量的值就不能改变
	} catch (e) {
		console.log("e: %s", e.message || e);//e: Assignment to constant variable.
	}
	console.log("==============================================");

	/**
	 * const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。
	 * 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，
	 * 因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，
	 * 保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，
	 * 就完全不能控制了。因此，将一个对象声明为常量必须非常小心
	 */
	const foo = {};
	foo.a = 123;  // 为 foo 添加一个属性，可以成功
	console.log(foo);   // => { a: 123 }
	try {
		foo = {};   //将 foo 指向另一个对象，就会报错
	} catch (e) {
		console.log("e: %s", e.message || e); //e: Assignment to constant variable.
	}
	console.log("==============================================");

	const arr = [];
	arr.push("Hello");  // 可执行
	console.log(arr);   //[ 'Hello' ]
	arr.length = 0;     // 可执行
	console.log(arr);   //[]
	try {
		arr = ["abc"];  //error
	} catch (e) {
		console.log("e: %s", e.message || e);   //e: Assignment to constant variable.
	}
}

function t12() {
	const foo = Object.freeze({a: {}});//常量foo指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。
	console.log(foo); //{ a: {} }
	try {
		foo.b = 123;    //不会报错,但是无效(严格模式时还会报错)
	} catch (e) {
		console.log("e: %s", e.message || e); //严格模式时还会报错
	}
	console.log(foo); //{ a: {} }

	foo.a.bar = 123;  //内部对象冻结效果无效
	console.log(foo); //{ a: { bar: 123 } }
}

t12();








