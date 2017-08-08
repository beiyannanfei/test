/**
 * Created by wyq on 17/8/7.
 * 变量的解构赋值
 */

function t1() {
	let [a,b,c]=[1, 2, 3];
	console.log(a, b, c);   //1 2 3

	let [ , , third] = ["foo", "bar", "baz"];
	console.log(third);     //baz

	let [head, ...tail] = [1, 2, 3, 4];
	console.log(head, tail);  //1 [ 2, 3, 4 ]

	let [x, y, ...z] = ['a'];
	console.log(x, y, z);     //a undefined []
}

function t2() {
	let [foo = true] =[];   //解构赋值允许指定默认值
	console.log("foo = %j", foo); //foo = true

	let [x, y = "b"] = ["a", undefined];
	console.log("x = %j, y = %j", x, y);  //x = "a", y = "b"

	let [z = 1] = [null]; //ES6 内部使用严格相等运算符（===），判断一个位置是否有值,所以，如果一个数组成员不严格等于undefined，默认值是不会生效的。
	console.log("z = %j", z); //z = null

	var a = function () {
		console.log("aaaa");
	};
	let [k = a()] = [1];    //因为k能取到值，所以函数f根本不会执行
	console.log("k = %j", k);   //k = 1

	let [l = a()] = [];         //aaaa    l不能取到值所以会执行函数
	console.log("l = %j", l);   //l = undefined
}

function t3() {
	let {foo, bar, baz} = {foo: "aaa", bar: "bbb"};//变量必须与属性同名，才能取到正确的值,与顺序无关
	console.log("foo = %j, bar = %j, baz = %j", foo, bar, baz); //foo = "aaa", bar = "bbb", baz = undefined

	let {first:f, last:l} = {first: "hello", last: "world"};  //如果变量名与属性名不一致，必须写成下面这样
	console.log("f = %j, l = %j", f, l);  //f = "hello", l = "world"
}

function t4() {
	let map = new Map();
	map.set("first", "hello");
	map.set("second", "world");

	for (let [key, value] of map) {
		console.log(`${key} is ${value}`);
	}

	for (let [key] of map) {
		console.log(`key is ${key}`);
	}

	for (let [,value] of map) {
		console.log(`value is ${value}`);
	}
}


