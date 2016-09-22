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
