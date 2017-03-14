var _ = require("underscore");

var a = {
	a: 10, b: 20, c: 30, d: 40, e: 50
};

console.log(_.pick(a, "a", "c", "e"));