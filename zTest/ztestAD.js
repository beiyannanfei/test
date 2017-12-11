let body = {
	a: undefined
};

if (body.hasOwnProperty("a")) {
	console.log("=====aaa");
}
const _ = require("underscore");
let str = "a";
_.isUndefined(body.a) ? (str = true) : (str = false);
console.log(str);
