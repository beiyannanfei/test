// 2017-3-22 上午开发地理围栏相关  下午开发经销商个性化logo存储
// 2017-3-23 经销商个性化后端接口开发
// 2017-3-24 与前端对接调试经销商个性化,讨论地理围栏需求


var _ = require("underscore");
var isRole = function () {
	var roles = _.flatten([].splice.call(arguments, 0), true);
	console.log(roles);
};

isRole("a", "b");
