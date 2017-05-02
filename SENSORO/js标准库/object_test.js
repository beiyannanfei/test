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

