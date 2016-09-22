var rewire = require("rewire"); //用法详见文档

var myModules = rewire("./myModules.js");


console.log(myModules.__get__("bl1"));
myModules.__set__("bl1", "abc");
console.log(myModules.__get__("bl1"));

myModules.__with__({
	bl1: "AAA"
})(function () {
	console.log("new: " + myModules.__get__("bl1"));
	return Promise.resolve("ok");
}).then(function (val) {
	console.log("val: %j", val);
	console.log("after: " + myModules.__get__("bl1"));
});


myModules.getKeys(function (err, o) {
	console.log(o);
});


