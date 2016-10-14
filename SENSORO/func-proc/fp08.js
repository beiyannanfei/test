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

var r1 = Right.of("Hello").map(str => str + " World!");
console.log(r1.value);
var l1 = Left.of("Hello").map(str => str + " World!");
console.log(l1.value);

var r2 = Right.of({host: "localhost", port: 80}).map(_.property("host"));
console.log(r2.value);
var l2 = Left.of("rolls eyes...").map(_.property("host"));
console.log(l2.value);

var getAge = _.curry(function (now, user) {
	var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
	if(!birthdate.isValid())
		return Left.of("Birth date could not be parsed");
	return Right.of(now.diff(birthdate, 'y'));
});

var g1 = getAge(moment(), {birthdate: "2005-12-12"});
console.log(g1.value);

var g2 = getAge(moment(), {birthdate: "02001070"});
console.log(g2.value);











