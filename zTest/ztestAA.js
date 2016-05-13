var a = "hello";
var show = function () {
	console.log(a);
	var a = "world";
	console.log(a);
};
show();