const timeSpan = {  //默认最大时间跨度
	months: 3, //按月，最多显示最近一年的数据
	days: 30,   //按天，最多显示最近1个月的数据
	hours: 48,  //按小时，最多显示最近48小时的数据
	realTime: 1 //实时, 最多显示最近1小时的数据
};

const _ = require("underscore");

console.log(_.keys(timeSpan).filter(item => item !== "realTime"));