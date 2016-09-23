var _ = require("lodash");

var add = function (x) {
	return function (y) {
		return x + y;
	};
};

var compose = function (f, g) {
	return function (x) {
		return f(g(x));
	}
};

var Maybe = function (x) {
	this.value = x;
};

Maybe.of = function (x) {
	return new Maybe(x);
};

Maybe.prototype.isNothing = function () {
	return this.value == null;
};

Maybe.prototype.map = function (f) {
	return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.value));
};

var m1 = Maybe.of({name: "Boris"}).map(_.property("age"));
console.log(m1.value);
var m2 = m1.map(add(10));
console.log(m2.value);

var m3 = Maybe.of({name: "Dinah", age: 14}).map(_.property("age")).map(add(10));
console.log(m3.value);




