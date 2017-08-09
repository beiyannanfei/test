/**
 * Created by wyq on 17/8/8.
 */
function t1() {
	console.log(Math.trunc(123.456)); //123 去除一个数的小数部分，返回整数部分
}

function t2() {
	let x = 99;
//参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的
	function foo(p = x + 1) {
		console.log(p);
	}

	foo();    //100
	x = 100;
	foo();    //101
}

function t3() {
	let add = function (...values) {//ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中
		console.log("values = %j", values); //values = [1,2,3,4]
		let sum = 0;
		for (let val of values) {
			sum += val;
		}
		console.log("sum = %j", sum); //sum = 10
	};
	add(1, 2, 3, 4);
}

function t4() {
	function foo() {
	}

	console.log(foo.name);  //函数的name属性，返回该函数的函数名

	console.log((new Function).name); //anonymous   Function构造函数返回的函数实例，name属性的值为anonymous
}

function t5() {
	var getTempItem = id => ({id: id, name: "Temp"}); //由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号
	console.log(getTempItem(10)); //{ id: 10, name: 'Temp' }

	const full = ({f, l}) => `${f} ${l}`;     //箭头函数可以与变量解构结合使用
	console.log(full({f: "hello", l: "world"}));  //hello world
}

function t6() {
	var id = 21;

	function foo() {  //setTimeout的参数是一个箭头函数，这个箭头函数的定义生效是在foo函数生成时，而它的真正执行要等到100毫秒后
		setTimeout(() => {
			console.log("foo id: ", this.id);
		}, 100);
	}

	function bar() {
		setTimeout(function () {
			console.log("bar id: ", this.id);
		}, 100);
	}

	foo.call({id: 42}); //foo id:  42 //箭头函数导致this总是指向函数定义生效时所在的对象（本例是{id: 42}），所以输出的是42
	bar.call({id: 42}); //bar id:  undefined  //普通函数，执行时this应该指向全局对象

}

function t7() {
	function Fibonacci(n) { //递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误
		if (n <= 1) {
			return 1;
		}
		return Fibonacci(n - 1) + Fibonacci(n - 2);
	}

	// console.log(Fibonacci(50));

	function Fibonacci2(n, ac1 = 1, ac2 = 1) {  //对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误
		if (n <= 1) {
			return ac2;
		}
		return Fibonacci2(n - 1, ac2, ac1 + ac2);
	}

	console.log(Fibonacci2(1000));
}

function t8() {
	function restricted() {
		console.log(restricted.caller);     //[Function: t8]   返回调用当前函数的那个函数
		console.log(restricted.arguments);  //{}  返回调用时函数的参数。
	}

	restricted();
}







