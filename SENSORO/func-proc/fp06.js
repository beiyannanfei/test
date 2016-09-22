//Functor(函子)

var Container = function (x) {
	this.value = x;
};

Container.of = function (x) {
	return new Container(x);
};

var c1 = Container.of(1);
console.log(c1.value);

var c2 = Container.of("abcd");
console.log(c2.value);

Container.prototype.map = function (f) {
	return Container.of(f(this.value))
};

var c3 = Container.of(3).map(x => x + 1).map(x => "Result is " + x);
console.log(c3.value);