var _ = require("lodash");

var a = {a: 10, c: 5};
var b = {b: 10, c: 6};

console.log(_.assign({}, a, b));
console.log(a);
console.log(b);