var hotrequire = require("hotrequire");
var ztest5 = hotrequire("../../hotrequire_need.js", function (newModule) {
	console.log("********** file change **********");
	ztest5 = newModule;
});

var show = function (o) {
	console.log("=============" + o);
};

setInterval(function () {
	show(ztest5.a);
}, 1000);
