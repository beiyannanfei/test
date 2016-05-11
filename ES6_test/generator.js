"use strict"
/*
 function * helloWorldGenerator() {
 yield "hello";
 yield "world";
 return "ending";
 }
 var hw = helloWorldGenerator();

 for (var i of hw) {
 console.log(i);
 }
 */

/*
 function *f() {
 console.log("执行了");
 }
 var generator = f();
 setTimeout(function () {
 console.log("延时函数执行");
 generator.next();
 }, 2000);
 */

/*
 var arr = [1, [[2, 3], 4], [5, 6]];
 var flat = function*(a) {
 var length = a.length;
 for (var i = 0; i < length; ++i) {
 var item = a[i];
 if (typeof item !== "number") {
 yield* flat(item);
 }
 else {
 yield item;
 }
 }
 };
 for (var f of flat(arr)) {
 console.log(f);
 }
 */

/*
 function *f() {
 for (var i = 0; 1; i++) {
 var reset = yield i;
 if (reset) {
 --i;
 }
 }
 }
 var g = f();
 console.log(g.next());
 console.log(g.next());
 console.log(g.next(true));
 console.log(g.next(true));
 */

/*
 function* f() {
 for (var i = 0; true; i++) {
 var reset = yield i;
 if (reset) {
 i = -1;
 }
 }
 }

 var g = f();

 console.log(g.next());
 console.log(g.next());
 console.log(g.next(true));
 console.log(g.next(true));
 */

/*
 function* foo(x) {
 console.log("x=" + x);
 var y = 2 * (yield (x + 1));
 console.log("y=" + y);
 var z = yield (y / 3);
 console.log("z=" + z);
 return (x + y + z);
 }

 var a = foo(5);
 console.log("begin1");
 console.log(a.next());
 console.log("begin2");
 console.log(a.next());
 */

/*
 function *foo() {
 yield 'a';
 yield 'b';
 }
 function *bar() {
 yield 'x';
 yield* foo();
 yield 'y';
 }
 for (let v of bar()) {
 console.log(v);
 }
 */

/*
 let read = (function*() {
 yield 'hello';
 yield* 'hello';
 })();

 for (let v of read) {
 console.log(v);
 }
 */

/*
 function *foo() {
 yield 2;
 yield 3;
 return "foo";
 }

 function *bar() {
 yield 1;
 var v = yield *foo();
 console.log("v: " + v);
 yield 4;
 }
 var it = bar();
 for (var v of it) {
 console.log(v);
 }
 */

/*
 function* F(){
 yield this.x = 2;
 yield this.y = 3;
 }
 var obj = {};
 var f = F.bind(obj)();

 console.log(obj);
 console.log(f.next());
 console.log(f.next());
 console.log(f.next());
 console.log(obj);
 */

var clock = function*(_) {
	while (true) {
		yield _;
		console.log('Tick!');
		yield _;
		console.log('Tock!');
	}
};
var it = clock();
console.log(it.next());
for (var v of it) {
	console.log(v);
}
















