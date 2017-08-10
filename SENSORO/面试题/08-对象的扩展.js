/**
 * Created by wyq on 17/8/10.
 */
function t1() {
	let foo = "bar";
	let baz = {foo};  //baz = {"foo":"bar"}
	console.log("baz = %j", baz); //baz = {"foo":"bar"}
}

function t2() {
	var f = function (x, y) {
		return {x, y};
	};
	console.log("f(1,2) = %j", f(1, 2));  //f(1,2) = {"x":1,"y":2}
}

function t3() {
	const person = {
		sayName(){
			console.log("hello!");
		}
	};
	person.sayName(); //hello!
	console.log(person.sayName.name); //sayName   函数的name属性，返回函数名。对象方法也是函数，因此也有name属性
}

function t4() {
	//Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
	console.log(Object.is('foo', 'foo')); //true
	console.log(Object.is(NaN, NaN), (NaN === NaN)); //true false
	console.log(Object.is(+0, -0), (+0 === -0));    //false true
}

function t5() {
	let target = {a: 1};
	let source1 = {b: 2};
	let source2 = {c: 3};
	Object.assign(target, source1, source2);
	console.log("target = %j, source1 = %j, source2 = %j", target, source1, source2);
	//target = {"a":1,"b":2,"c":3}, source1 = {"b":2}, source2 = {"c":3}
}

function t6() {
	var obj1 = {a: {b: 1}};
	var obj2 = Object.assign({}, obj1);   //Object.assign方法实行的是浅拷贝，而不是深拷贝

	obj1.a.b = 2;
	console.log("obj2.a.b = %j", obj2.a.b); //obj2.a.b = 2
}

function t7() {
	let arr1 = [1, 2, 3];
	let arr2 = [4, 5];
	Object.assign(arr1, arr2);  //Object.assign可以用来处理数组，但是会把数组视为对象
	console.log("arr1 = %j", arr1); //arr1 = [4,5,3]
}

function t8() {
	let proto = {};
	let obj = {x: 10};
	Object.setPrototypeOf(obj, proto);

	proto.y = 20;
	proto.z = 40;
	console.log("obj = %j", obj);       //obj = {"x":10}
	console.log("obj.y = %j", obj.y);   //obj.y = 20
	console.log("obj.z = %j", obj.z);   //obj.z = 40
}

function t9() {
	let obj = {a: 10, b: 20, c: 30};
	console.log("Object.keys = %j", Object.keys(obj));    //Object.keys = ["a","b","c"]
	for (let key of Object.keys(obj)) {
		console.log("key = %j", key);   //key = "a"		key = "b"		key = "c"
	}
	for (let value of Object.values(obj)) {
		console.log("value = %j", value);
	}
}

