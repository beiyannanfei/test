var _ = require("lodash");
var moment = require('moment');

var Left = function (x) {
	this.value = x;
};

var Right = function (x) {
	this.value = x;
};

Left.of = function (x) {
	return new Left(x);
};

Right.of = function (x) {
	return new Right(x);
};

Left.prototype.map = function (f) {
	return this;
};

Right.prototype.map = function (f) {
	return Right.of(f(this.value));
};

var getAge = user =>user.age ? Right.of(user.age) : Left.of("Error");

var g1 = getAge({name: "stark", age: 21}).map(age => "Age is " + age);
console.log(g1.value);

var g2 = getAge({name: "stark"}).map(age => "age is " + age);
console.log(g2.value);