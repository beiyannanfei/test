function foo(x) {
	var a = 1;
	return function bar(y) {
		console.log(x + y + (++a));
	}
}

var closure = foo(2);
var closure2 = foo(2);

closure(10);
closure2(10);
closure(12);
