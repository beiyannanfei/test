function a() {
	console.log("AAAAAAAAAA");
}

function b() {
	console.log("BBBBBBBBBB");
}

exports.c = function () {
	console.log("CCCCCCCCCCCCC");
};

module.exports = a;
module.exports.b = b;