var _ = require("lodash");
var co = require

/*
 var a = {a:10};
 var b = {b: 20};

 var error = new Error("test");
 error.name = "my Test";
 _.assign(error, a, b);
 console.log(error);*/

var a = {
	b: {c: 10}
};

console.log(a);
a = a.b;
console.log(a);

