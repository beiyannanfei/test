var rc = require("redis").createClient();
var async = require("async");
var _ = require("underscore");

var dzpInfo = {
	"_id": "577e1ecf49c2b3490d9b0b05",
	"name": "压测大转盘",
	"limit": 100,
	"startTime": 1467882963000,
	"endTime": 1469875852000,
	"desc": "压测大转盘",
	"bgImg": "http://q.cdn.mtq.tvm.cn/adsmall/pic/20160707171611-3401-1gnpkth.jpg",
	"bgColor": "#000000",
	"turnplateImg": "http://tmall.mtq.tvm.cn/images/turntable/thanks-3.png",
	"followLimit": "1",
	"prizes": [
		{
			"isDefault": 0,
			"prizeName": "500余额",
			"limitCount": 1410065407,
			"id": "964bc09fc2a84b9c97303f8de0e66837",
			"rate": 1,
			"prizeType": 201,
			"value": 500,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 8,
			"enterRank": "1",
			"writeSpeech": "1"
		},
		{
			"isDefault": 0,
			"prizeName": "400余额",
			"limitCount": 1410065407,
			"id": "4fba23a62c6a4646849eb3d846839aad",
			"rate": 2,
			"prizeType": 201,
			"value": 400,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 7,
			"enterRank": "1",
			"writeSpeech": "1"
		},
		{
			"isDefault": 0,
			"prizeName": "300余额",
			"limitCount": 1410065407,
			"id": "0171b210d86d467798429025eaeeb25f",
			"rate": 3,
			"prizeType": 201,
			"value": 300,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 6,
			"enterRank": "0",
			"writeSpeech": "0"
		},
		{
			"isDefault": 0,
			"prizeName": "200余额",
			"limitCount": 1410065407,
			"id": "bf243f8e543d46f2aec5a951cbf5b486",
			"rate": 4,
			"prizeType": 201,
			"value": 200,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 5,
			"enterRank": "0",
			"writeSpeech": "0"
		},
		{
			"isDefault": 0,
			"prizeName": "100余额",
			"limitCount": 1410065407,
			"id": "cbd63db87a6d463297e8495f69bb2f91",
			"rate": 5,
			"prizeType": 201,
			"value": 100,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 4,
			"enterRank": "0",
			"writeSpeech": "0"
		},
		{
			"isDefault": 0,
			"prizeName": "50余额",
			"limitCount": 1410065407,
			"id": "4c63202a1f764a3c9639aaa46c028919",
			"rate": 6,
			"prizeType": 201,
			"value": 50,
			"rule": 2,
			"day": 1,
			"count": 1410065407,
			"perTimes": 3,
			"enterRank": "0",
			"writeSpeech": "0"
		},
		{
			"isDefault": 1,
			"prizeName": "5余额",
			"id": "19db1eebc5b341da8bebbc65d3c87605",
			"rate": 7,
			"prizeType": 201,
			"value": 5
		}
	],
	"defaultSpeech": "哇哦~ 太开心了，中大奖了，非常感谢天天电视宝，以后天天来。",
	"dateTime": "2016-07-07T09:20:15.675Z",
	"dateTimeStr": "2016-07-07 17:20:15",
	"deleted": 0
};

var key = "dzp_config_info";
var field = dzpInfo._id;

rc.HSET(key, field, JSON.stringify(dzpInfo), function (err, o) {
});