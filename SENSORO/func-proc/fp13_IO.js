var _ = require("lodash");
var compose = _.flowRight;

var IO = function (f) {
	this.value = f;
};

IO.of = function (x) {
	return new IO(function () {
		return x;
	});
};

IO.prototype.map = function (f) {
	return new IO(compose(f, this.value));
};

var io_docu = new IO(function () {
	var doc = {
		title: "ABC"
	};
	return doc
});

var i1 = io_docu.map(function (doc) {
	return doc.title
});

console.log(i1.value());
