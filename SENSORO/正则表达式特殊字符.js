RegExp.quote = function (str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

let search = "\\";
let r = new RegExp(RegExp.quote(search));
console.log(r);