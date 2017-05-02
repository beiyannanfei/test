/**
 * Created by wyq on 17/4/28.
 * js object 内置方法练习
 */
"use strict";

function _assign() {
	let obj1 = {a: 10};
	let obj2 = {b: 20};
	let obj3 = Object.assign(obj1, obj2);
	console.log(obj1, obj2, obj3);
}
_assign();

function _freeze() {
	let obj = {
		a: 10,
		b: [1, 2],
		c: {
			c1: 1, c2: 2
		}
	};
	Object.freeze(obj);
	try {
		delete obj.a;
	} catch (e) {
		console.log("e: %j", e.message || e);
	}
	obj.b.push(10);   //只对第一级元素生效
	delete obj.c.c1;
	console.log(obj);
}
_freeze();

function _is() {
	let obj = {a: 10};
	console.log(Object.is(obj, obj));
	console.log(Object.is([], []));
}
_is();

function _keys() {
	let arr = ["a", "b", "c"];
	console.log(Object.keys(arr));

	let obj = {a: 10, b: 20, c: 30};
	console.log(Object.keys(obj));

	let str = "foo";
	console.log(Object.keys(str));  //ES6: [ '0', '1', '2' ], ES5: Object.keys called on non-object
}
_keys();

function _hasOwnProperty() {
	let o = {};
	o.prop = "exists";
	console.log(o.hasOwnProperty("prop"));
	delete o.prop;
	console.log(o.hasOwnProperty("prop"));
}
_hasOwnProperty();





