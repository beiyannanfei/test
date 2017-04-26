/**
 * Created by wyq on 17/4/26.
 * 最新用法
 */
"use strict";

function _set() {  //利用set去重
	let arr = [1, 2, 2, 3];
	let set = new Set(arr);
	let newArr = Array.from(set);
	console.log("arr: %j, newArr: %j", arr, newArr);
	let arr1 = [1, 1, 2, 2, 3, 3, "1", "1", "2", "2", "3", "3", "4"];
	let newArr1 = Array.from(new Set(arr1));
	console.log(newArr1);
}

function _assign() {  //extend
	let obj1 = {a: 1};
	let obj2 = {b: 2};
	let obj3 = Object.assign({}, obj1, obj2);
	console.log("obj1: %j, obj2: %j, obj3: %j", obj1, obj2, obj3);
}

function _map() { //迭代处理
	let arr = [1, 2, 3, 4, 5];
	let newArr = arr.map((e, i) => {
		console.log("e: %j, i: %j", e, i);
		return e * 10;
	});
	console.log("newArr: %j", newArr);
}

function _filter() {  //过滤
	let arr = [1, 2, 3, 4, 5];
	let newArr = arr.filter((e, i) =>e % 2 === 0);
	console.log("newArr: %j", newArr);
}

function _some() {  //相当于数组||操作
	let arr = [{result: true}, {result: false}];
	let newArr = arr.some((e, i) => e.result);
	console.log("newArr: %j", newArr);
}

function _every() { //相当于&&操作
	let arr = [{result: true}, {result: false}];
	let newArr = arr.every((e, i) => e.result);
	console.log("newArr: %j", newArr);
}

function _arrFrom() {
	let arr = Array.from(arguments);
	console.log("arr: %j", arr);
}

function _arrOf() {
	let arr = Array.of(1, 2, 3, "a", "b");
	console.log("arr: %j", arr);
}



