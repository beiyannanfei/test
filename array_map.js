var util = require("util");
var _ = require("lodash");

function sortStr(param) {
	var paramArr = _.keys(param);
	paramArr.sort();
	var strArr = paramArr.map(item => {
		return util.format("%s=%s", item, param[item]);
	});
	return strArr.join("&");
}

var obj = {
	d: 40,
	b: 20,
	a: 10,
	c: 30,
	a1:11
};

console.log(sortStr(obj));
