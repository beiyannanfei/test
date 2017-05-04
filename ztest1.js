var uuid = require("uuid");

var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};

let id = GetUuid();
console.log(id);
let id2 = id.substr(0, 2);
console.log(id2);
let id3 = parseInt(id2, 16);
console.log(id3);