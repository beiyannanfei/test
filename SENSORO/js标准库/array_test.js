/**
 * Created by wyq on 17/4/28.
 * js array内置方法练习
 */
"use strict";

function _length() {
	let arr = [1, 2, 3, 4, 5];
	console.log(arr.length);
}
_length();

function _prototype() {
	Array.prototype.first = function () {   //给数组添加一个自定义方法
		return this[0];
	};
	let arr = [0, 1, 2, 3, 4];
	console.log(arr.first());
}
_prototype();

function _from() {
	let arr1 = Array.from([1, 2, 3]);
	console.log(arr1);

	let arr2 = Array.from("abc");
	console.log(arr2);

	let arr3 = Array.from(new Set(["foo", "bar"]));
	console.log(arr3);

	let arr4 = Array.from(new Set([1, 2, 2, 3, 3, 4, 5]));  //借助from set实现数组去重
	console.log(arr4);

	let arr5 = Array.from(new Map([[1, 2], [2, 3], [3, 4]]));
	console.log(arr5);

	let arr6 = function () {
		return Array.from(arguments)
	};
	console.log(arr6("a", "b", "c", "d"));

	let arr7 = (...args) => {
		return Array.from(args)
	};
	console.log(arr7(1, 2, 3, 4, "a"));

	let arr8 = Array.from([1, 2, 3, 4], x => x * 3);
	console.log(arr8);

	let arr9 = Array.from({length: 5}, (v, i) => i);
	console.log(arr9);
}
_from();

function _isArray() {
	console.log(Array.isArray([]));
	console.log(Array.isArray({}));
	console.log(Array.isArray(new Array()));
	console.log(Array.isArray(Array.prototype));
}
_isArray();

function _of() {
	let arr1 = Array.of(7);
	console.log(arr1);

	let arr2 = Array.of(1, 2, 3);
	console.log(arr2);

	let arr3 = Array(7);
	console.log(arr3);

	let arr4 = Array(1, 2, 3);
	console.log(arr4);

	let arr5 = Array.of(undefined);
	console.log(arr5);
}
_of();

function _concat() {
	let arr1 = [1, 2, 3], arr2 = [4, 5, 6];
	let arr3 = arr1.concat(arr2); //不会修改原数组
	console.log(arr1, arr2, arr3);

	let arr4 = [1], arr5 = ["a"], arr6 = ["+"];
	let arr7 = arr4.concat(arr5, arr6);
	console.log(arr7);

	let arr8 = [1, 2, 3];
	let arr9 = arr8.concat("a", "b", [9, 8]);
	console.log(arr9);
}
_concat();

function _entries() {
	let arr1 = [1, 2, 3];
	let iterator1 = arr1.entries();
	console.log(iterator1.next());
	console.log(iterator1.next());
	console.log(iterator1.next());

	let arr2 = [4, 5, 6];
	let iterator2 = arr2.entries();
	for (let e of iterator2) {
		console.log(e);
	}
}
_entries();

function _every() {
	let arr1 = [5, 6, 7, 8, 9, 10];
	let le10 = arr1.every((e, i, a) => {
		console.log(e, i, a);
		return e <= 10;
	});
	console.log(le10);
	let lt10 = arr1.every(item => item < 10);
	console.log(lt10);
}
_every();

function _fill() {
	let arr1 = [1, 2, 3];
	arr1.fill(1);
	console.log(arr1);

	let arr2 = [1, 2, 3, 4];
	arr2.fill("a", 2);
	console.log(arr2);

	let arr3 = [1, 2, 3, 4, 5];
	arr3.fill("b", 2, 4);
	console.log(arr3);
}
_fill();

function _filter() {
	let arr1 = [1, 2, 3, 10, 20, 30];
	let arr2 = arr1.filter(item => item < 10);
	console.log(arr2);
}
_filter();

function _find() {
	let arr1 = [1, 2, 3, 40, 5, 6];
	let f = arr1.find(item => item > 10);
	console.log(f);
}
_find();

function _findIndex() {
	let arr = [85, 48, 98, 62, 458, 965, -485, 2, 576, 542, 96];
	let i = arr.findIndex(item => item === 458);
	console.log(i);
}
_findIndex();

function _forEach() {
	let arr = [9, 8, 7, 6];
	arr.forEach(item => {
		console.log(item);
	});
}
_forEach();

function _includes() {
	let arr = [1, 2, 3, 4, 5];
	let f1 = arr.includes(2);
	let f2 = arr.includes(10);
	console.log(f1, f2);
}
_includes();

function _indexOf() {
	let arr = [1, 2, 3, 4];
	let i1 = arr.indexOf(3);
	let i2 = arr.indexOf(5);
	console.log(i1, i2);
}
_indexOf();

function _join() {
	let arr = [1, 2, 3, 4];
	let str = arr.join(",");
	console.log(str);
}
_join();

function _keys() {
	let arr = ["a", "b", "c"];
	let iterator = arr.keys();
	for (let e of iterator) {
		console.log(e);
	}
}
_keys();

function _lastIndexOf() {
	let arr = [2, 5, 9, 2];
	let i = arr.lastIndexOf(2);
	console.log(i);
}
_lastIndexOf();

function _map() {
	let arr1 = [1, 2, 3];
	let arr2 = arr1.map(item => item * 10);
	console.log(arr2);
}
_map();

function _pop() {
	let arr1 = [1, 2, 3];
	let p = arr1.pop();
	console.log(p, arr1);
}
_pop();

function _push() {
	let arr = [1, 2, 3];
	arr.push(4);
	console.log(arr);
	arr.push("A", "B");
	console.log(arr);
}
_push();

function _reduce() {
	let arr1 = [1, 2, 3];
	let sum1 = arr1.reduce((acc, val) => {
		console.log(acc, val);
		return acc + val;
	}, 0);
	console.log(sum1);
	let sum2 = arr1.reduce((acc, val) => {
		console.log(acc, val);
		return acc + val;
	}, 10);
	console.log(sum2);
}
_reduce();

function _reduceRight() {
	let arr = [[0, 1], [2, 3], [4, 5]];
	let flattened = arr.reduceRight((a, b)=> {
		console.log(a, b);
		return a.concat(b);
	});
	console.log(flattened);
}
_reduceRight();

function _reverse() {
	let arr = [1, 2, 3, 4];
	let arr1 = arr.reverse();
	console.log(arr1);
}
_reverse();

function _shift() {
	let arr1 = [1, 2, 3, 4];
	let s = arr1.shift();
	console.log(s, arr1);
}
_shift();

function _slice() {
	let arr1 = [1, 2, 3, 4, 5];
	let arr2 = arr1.slice(2, 4);
	console.log(arr2);
}
_slice();

function _some() {
	let arr = [1, 2, 3, 10, 4, 5, 6];
	let f = arr.some(item => item >= 10);
	console.log(f);
}
_some();

function _sort() {
	var a = [5, 7, 95, 48, -25, 488, 4896, -25, 4, 358, 59];
	a.sort(); //字典序(数字不会按照字典方式排序,会按照字符串排序)
	console.log(a);
	a.sort((a, b) => {
		return a - b;
	});
	console.log(a);
}
_sort();

function _splice() {
	let arr1 = ["a", "b", "c", "d", "e"];
	let rmd1 = arr1.splice(2, 1);
	console.log(rmd1, arr1);

	let arr2 = ["a", "b", "c", "d", "e"];
	let rmd2 = arr2.splice(2, 0, "Z");
	console.log(rmd2, arr2);

	let arr3 = ["a", "b", "c", "d", "e"];
	let rmd3 = arr3.splice(2, 1, "ZZ", "XX");
	console.log(rmd3, arr3);
}
_splice();

function _toLocaleString() {
	let arr1 = [1337, new Date(), "foo"];
	let arrStr = arr1.toLocaleString();
	console.log(arrStr);
}
_toLocaleString();

function _toString() {
	let arr1 = ["Jan", "Feb", "Mar", "Apr"];
	let myArr = arr1.toString();
	console.log(myArr);
}
_toString();

function _unshift() {
	let a = [1, 2, 3];
	a.unshift("a", "b");
	console.log(a);
}
_unshift();