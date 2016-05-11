"use strict";
/*
 function makeIterator(array) {
 var nextIndex = 0;
 return {
 next: function () {
 return nextIndex < array.length ?
 {value: array[nextIndex++], done: false} :
 {value: undefined, doen: true};
 }
 }
 }

 var it = makeIterator(['a', 'b']);

 console.log(it.next());
 console.log(it.next());
 console.log(it.next());
 */


/*
 function makeIterator(array) {
 var nextIndex = 0;
 return {
 next: function () {
 return nextIndex < array.length ?
 {value: array[nextIndex++]} :
 {done: true}
 }
 }
 }

 var it = makeIterator(['a', 'b']);

 console.log(it.next());
 console.log(it.next());
 console.log(it.next());
 */


/*
 function idMaker() {
 var index = 0;
 return {
 next: function () {
 return {value: index++, done: false};
 }
 }
 }

 var it = idMaker();

 for (; ;) {
 console.log(it.next());
 }
 */


/*
 let arr = ['a', 'b', 'c'];
 let iter = arr[Symbol.iterator]();

 console.log(iter.next());
 console.log(iter.next());
 console.log(iter.next());
 console.log(iter.next());
 */

/*
 class RangeIterator {
 constructor(start, stop) {
 this.value = start;
 this.stop = stop;
 }

 [Symbol.iterator]() {
 return this;
 }

 next() {
 var value = this.value;
 if (value < this.stop) {
 this.value++;
 return {done: false, value: value};
 }
 else {
 return {done: true, value: undefined};
 }
 }
 }

 function range(start, stop) {
 return new RangeIterator(start, stop);
 }

 for (var value of range(0, 3)) {
 console.log(value);
 }
 */


/*
 let generator = function*() {
 yield 1;
 yield *[2, 3, 4];
 yield 5;
 };

 var iterator = generator();

 console.log(iterator.next());
 console.log(iterator.next());
 console.log(iterator.next());
 console.log(iterator.next());
 console.log(iterator.next());
 console.log(iterator.next());
 */


/*
 var someString = "hi";
 console.log(typeof someString[Symbol.iterator]);

 var iterator = someString[Symbol.iterator]();
 console.log(iterator.next());
 console.log(iterator.next());
 console.log(iterator.next());
 */


/*
 const arr = ["red", "green", "blue"];
 let iterator = arr[Symbol.iterator]();
 for (let v of arr) {
 console.log(v);
 }
 console.log("=================");
 for (let v of iterator) {
 console.log(v);
 }
 */


/*
 const arr = ["red", "green", "blue"];
 arr.forEach(function (element, index) {
 console.log(element);
 console.log(index);
 });
 */


/*
 var arr = ['a', 'b', 'c', 'd'];
 for (let a in arr) {
 console.log(a);
 }
 console.log("============");
 for (let a of arr) {
 console.log(a);
 }
 */


/*
 var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
 for (let e of engines) {
 console.log(e);
 }
 console.log("============");
 var es6 = new Map();
 es6.set("edition", 6);
 es6.set("committee", "TC39");
 es6.set("standard", "ECMA-262");
 console.log(es6);
 for (var value of es6) {
 console.log(value);
 }
 console.log("============");
 for (var index in es6) {
 console.log(index + ": " + es6[index]);
 }
 */

/*
 let arr = ['a', 'b', 'c'];
 for (let pair of arr.entries()) {
 console.log(pair);
 }
 */

/*
 let str = "hello";
 for (let s of str) {
 console.log(s);
 }

 function printArgs() {
 for (let x of arguments) {
 console.log(x);
 }
 }
 printArgs('a', 'b');
 */

/*
let arrayLike = {length: 2, 0: 'a', 1: 'b'};
for (let x of Array.from(arrayLike)) {
	console.log(x); //out a, b
}
*/






















