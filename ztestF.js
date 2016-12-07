var _ = require("lodash");
var a = {a: 10, b: 20, c: 30, d: 40};
console.log(_.pick(a, ["a", "b"]));
