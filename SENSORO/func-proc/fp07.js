var _ = require("lodash");

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

var getPro = function (pro) {
	return function (obj) {
		return obj[pro];
	}
};

var add = function (x) {
	return function (y) {
		return x + y;
	}
};
var m1 = Maybe.of({name: "Toney"}).map(getPro("age")).map(add(10));
console.log(m1.value);
var m2 = Maybe.of({name: "Toney", age: 21}).map(getPro("age")).map(add(10));
console.log(m2.value);

console.log("=======================");
//lodash 举例
console.log(_.property("age")({age: 10}));
var add = _.curry(_.add);
console.log(add(1)(2));

console.log("=======================");
var compose = function (f, g) {
	return function (x) {
		return f(g(x));
	}
};

var map = _.curry(function (f, functor) {
	return functor.map(f);
});

var doEverything = map(compose(add(10), getPro("age")));
//compose(add(10), getPro("age")) => add(10)(getPro("age"))
//map(compose(add(10), getPro("age"))) => map(add10_getPro_age)

var functor = Maybe.of({name: "stark", age: 101});

var m3 = doEverything(functor);
//=> map(add10_getPro_age)(functor); => functor.map(add10_getPro_age)  => Maybe.of(add10_getPro_age(this.value))

console.log(m3.value);


