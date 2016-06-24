var _ = require("underscore");
var rc = require("redis").createClient();

var list = [
	{a: 0, b: 0, c: 0},
	{a: 1, b: 1, c: 1},
	{a: 2, b: 2, c: 2},
	{a: 3, b: 3, c: 3},
	{a: 4, b: 4, c: 4},
	{a: 5, b: 5, c: 5},
	{a: 6, b: 6, c: 6}
];
console.log(list);
var newList = _.shuffle(list);
console.log(newList);

var a = {
	name: "活动名字",
	limit: " 2  一天能抽多少次",
	startTime: "活动开始时间  毫秒",
	endTime: "活动结束时间  毫秒",
	bgImg: "背景图片",
	turnplateImg: "转盘图片",
	followLimit: "未关注是否能中奖  1:  能中,  2: 不能中",
	perTimes: "10  每个多少个人中奖    必须大于0",
	prizes: [{
		id: "奖品id", //定值不可变
		rate: "1   奖品等级",
		prizeType: "奖品类型   201:余额  202: 金币",
		prizeName: "奖品名称",
		value: "100,    余额数或者金币数, 如果是余额的话单位为分, 不能小于等于0",
		rule: " 中奖规则    1: 按时间段,  2: 按天",
		times: [{   //按时段才有的参数
			count: "10    数量, 必须大于等于0,",
			startTime: "'00:00'  小时分钟",
			endTime: '10:00'
		}],
		day: "1      //按天才有的参数",
		count: "10   //按天才有的参数",
		isDefault: " 1   		是否为默认奖品   1： 是   如果是默认将就不会有中奖规则限制",
		limitCount: " 10,    	单品分顶数量"
	}]
};

rc.get("aa", function (err, o) {
	console.log(arguments);
});

a.prizes.forEach