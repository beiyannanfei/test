/**
 * Created by wyq on 2015/11/4.
 */
var _ = require("underscore");
var uuid = require("uuid");
var fs = require("fs");

var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};
var idList = [];
console.time("GetUuid:");
for (var i = 0; i < 1000; ++i) {
	var id = GetUuid();
	idList.push(id);
	//console.log(id);
}
console.timeEnd("GetUuid:");
console.log(idList.length);

console.time("sort:");
idList = _.sortBy(idList);    //先排序
console.timeEnd("sort:");

console.time("uniq:");
idList = _.uniq(idList, true);
console.timeEnd("uniq:");

console.log(idList.length);


