var redis = require('redis');
var _ = require("underscore");
var async = require("async");

var redisClient = redis.createClient(6379, '127.0.0.1');
var t1 = function () {
	var key = "count_pv_and_uv";
	var totalFieldList = ["goods_s01_total", "goods_s01_201508050", "goods_s01_2015080511", "goods_s02_total",
		"goods_s02_20150805", "goods_s02_20150805", "goods_s02_2015080511"];


	redisClient.HMGET(key, totalFieldList, function (err, res) {
		console.log("***** err: %j", err);
		console.log("***** res: %j", res);
		for (var index in res) {
			console.log("index: %j, key: %j, val: %j", index, totalFieldList[index], res[index]);
		}
	});

};

var t2 = function () {
	var key = "count_pv_and_uv";
	var field = "goods_55bf249b2f81c97c272244ed_total";
	var val = {
		openIds: ["s01", "s02", "s03", "s04", "s05"],
		count: 123
	};
	redisClient.HSET(key, field, JSON.stringify(val), function (err, res) {
		console.log("err: %j, res: %j", err, res);
	})
};

var t3 = function () {
	var key = "count_pv_and_uv";
	var field = "store_55c188da15951ef80cfd5b71_total";
	var val = {
		openIds: ["s01", "s02", "s03", "s04"],
		count: 1230
	};
	redisClient.HSET(key, field, JSON.stringify(val), function (err, res) {
		console.log("err: %j, res: %j", err, res);
	})
};

var t4 = function () {
	var val = "count_pv_and_uv";
	var key = "store_55c188da15951ef80cfd5b71_total";
	redisClient.sadd(key, val, function (err, res) {
		console.log("err: %j, res: %j", err, res);
	})
};

var t5 = function () {
	var val = "bbb";
	var key = "aaa";
	redisClient.HINCRBY(key, val, 1, function (err, res) {
		console.log("err: %j, res: %j", err, res);
	})
};

var t6 = function () {
	var val = "o2";
	var key = "t2";
	redisClient.SADD(key, val, function (err, res) {
		redisClient.SCARD(key, function (err, res) {
			console.log("err: %j, res: %j", err, res);
		});
	});
};

var t7 = function () {
	var val = ["o1", "o2", "o3", "o4", "o3"];
	var key = "t2";
	redisClient.SADD(key, val, function (err, res) {
		redisClient.SCARD(key, function (err, res) {
			console.log("err: %j, res: %j", err, res);
		});
	});
};

var t8 = function () {
	var doc = "{\"type\":1,\"tvmId\":\"13522414321\",\"yyyappId\":\"wx6fc288e6ddd63347\",\"send_name\":\"\xe6\xad\xa3\xe8\xb0\xb7\xe5\xb7\xa7\xe5\x85\x8b\xe5\x8a\x9b\",\"key\":\"55c1ba1353397dd811f76dee\",\"createTime\":\"2015-08-05 19:11:55\",\"start\":1438773115155,\"length\":\"60000\",\"end\":1438773175155,\"winCount\":101,\"money\":{\"average\":1,\"max\":\"10\",\"send_name\":\"\xe6\xad\xa3\xe8\xb0\xb7\xe5\xb7\xa7\xe5\x85\x8b\xe5\x8a\x9b\",\"info\":[{\"rate\":1,\"name\":\"\xe7\xba\xa2\xe5\x8c\x851\",\"percent\":50,\"count\":1,\"type\":\"c\",\"moneyType\":\"p\",\"oType\":{\"type\":\"p\",\"name\":\"%\"},\"redMax\":\"2\",\"newCount\":1,\"total\":1,\"userMoney\":1},{\"rate\":2,\"name\":\"\xe7\xba\xa2\xe5\x8c\x852\",\"percent\":50,\"count\":1,\"type\":\"c\",\"moneyType\":\"p\",\"oType\":{\"type\":\"p\",\"name\":\"%\"},\"redMax\":\"1\",\"newCount\":1,\"total\":1,\"userMoney\":1}],\"prizes\":[{\"rate\":\"3\",\"count\":\"99999999\",\"name\":\"\xe9\xba\xa6\xe5\xbd\x93\xe5\x8a\xb310\xe5\x85\x83\xe4\xbb\xa3\xe9\x87\x91\xe5\x88\xb8\",\"wx_red_proty\":{\"id\":\"55c05789f14a266533c1bc95\",\"logo_src\":\"http://a.cdn.mtq.tvm.cn/pic/20150804141117-17898-1m3je1m.jpg\",\"award_name\":\"\xe9\xba\xa6\xe5\xbd\x93\xe5\x8a\xb310\xe5\x85\x83\xe4\xbb\xa3\xe9\x87\x91\xe5\x88\xb8\",\"award_type\":\"\xe5\xbe\xae\xe4\xbf\xa1\xe5\x8d\xa1\xe5\x88\xb8\xe4\xbc\x98\xe6\x83\xa0\xe5\x88\xb8\",\"award_grade\":\"3\",\"total_num\":\"99999999\",\"wx_red_proty\":{\"_id\":\"55c05789f14a266533c1bc95\",\"name\":\"\xe9\xba\xa6\xe5\xbd\x93\xe5\x8a\xb310\xe5\x85\x83\xe4\xbb\xa3\xe9\x87\x91\xe5\x88\xb8\",\"count\":4978,\"pic\":\"http://a.cdn.mtq.tvm.cn/pic/20150804141117-17898-1m3je1m.jpg\",\"type\":101,\"card_id\":\"pSllUs6ptU64QNlK0IWr37CkDecM\",\"price\":\"10\",\"gainUrl\":\"\",\"tvmId\":\"13522414321\",\"yyyappId\":\"wx6fc288e6ddd63347\",\"dateTime\":\"2015-08-04T06:11:21.696Z\",\"visible\":false}},\"id\":\"55c05789f14a266533c1bc95\",\"_id\":\"55c05789f14a266533c1bc95\",\"pic\":\"http://a.cdn.mtq.tvm.cn/pic/20150804141117-17898-1m3je1m.jpg\",\"type\":101,\"card_id\":\"pSllUs6ptU64QNlK0IWr37CkDecM\",\"price\":\"10\",\"gainUrl\":\"\",\"tvmId\":\"13522414321\",\"yyyappId\":\"wx6fc288e6ddd63347\",\"dateTime\":\"2015-08-04T06:11:21.696Z\"}],\"total\":2,\"SurplusTotal\":2},\"allUsersLength\":2,\"winsUsersLength\":0}";
	redisClient.lpush("countSysLottery", doc, function (err, res) {
		console.log("err: %j, res: %j", err, res);
	});
};

var t9 = function () {
	for (var i = 0; i < 10; ++i) {
		redisClient.lpush("aaaa", i, function (err, res) {
			console.log("err: %j, res: %j", err, res);
		});
	}
};

var t10 = function () {
	redisClient.llen("aaaa", function (err, res) {
		console.log("err: %j, res: %j", err, res);
	});
};

var t11 = function () {
	var key = "redPagerEventId";
	redisClient.hgetall(key, function (err, res) {
		console.log("err: %j, res: %j", err, res);
		var idList = _.keys(res);
		console.log("idList: %j", idList);
		redisClient.hmget(key, idList, function (err, data) {
			console.log("err: %j, data: %j", err, data);
		});
	});
};

var MD5 = require("MD5");
var t12 = function () {
	var key = {
		name: /111/
	};
	key.name = new Buffer(JSON.stringify(a)).toString('base64');
	key = JSON.stringify(key);
	console.log(key);
	redisClient.set(key, "asdf", function (err, res) {
		console.log("err: %j, res: %j", err, res);
	});
};

var t13 = function () {
	var list = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
	redisClient.sadd("test", list, function (err, res) {
		console.log("err: %j, res: %j", err, res)
	});
};

var t14 = function () {
	var list = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
	redisClient.rpush("test", list, function (err, res) {
		console.log("err: %j, res: %j", err, res)
	});
};

var t15 = function () {
	var key = "test";
	var list = ['aaa', 'bbb'];
	var map = {};
	redisClient.HMGET("test", list, function (err, res) {
		console.log("err: %j, res: %j", err, res)
		for (var index in list) {
			map[list[index]] = res[index];
		}
		console.log("**** map: %j", map);
	});
};

var t16 = function () {
	var key = "test";
	redisClient.INCR(key, function (err, value) {
		console.log("err: %j, value: %j", err, value);
		redisClient.EXPIRE(key, 10, function (err, result) {
			console.log("err: %j, result: %j", err, result);
		});
	});
};

var t17 = function () {
	var key = "test";
	var fields = ["aaa", "bbb", "ccc", "ddd"];
	redisClient.hmget(key, fields, function (err, results) {
		console.log("err: %j, results: %j", err, results);
	});
};

var t18 = function () {
	var key = "test";
	redisClient.hgetall(key, function (err, results) {
		console.log("err: %j, results: %j", err, results);
	});
};

var t19 = function () {
	var key = "tesat";
	redisClient.hgetall(key, function (err, results) {
		console.log("err: %j, results: %j", err, results);
	});
};

var t20 = function () {
	var key = "codes_" + 123 + "_" + "AABBCC";
	var codes = [];
	for (var i = 0; i < 20; ++i) {
		codes.push("TEST_" + i);
	}
	console.log("codes len: %j", codes.length);
	console.time("time:");
	async.each(codes, function (item, cb) {
		redisClient.LPUSH(key, item, function (err, data) {
			return cb(err);
		});
	}, function (err) {
		console.timeEnd("time:");
	});
};


var t21 = function () {
	var key = "codes_" + 123 + "_" + "AABBCC";
	var codes = [];
	for (var i = 0; i < 100000; ++i) {
		codes.push("TEST_" + i);
	}
	console.log("codes len: %j", codes.length);
	console.time("time:");
	async.each(codes, function (item, cb) {
		redisClient.LPOP(key, function (err, data) {
			return cb(err);
		});
	}, function (err) {
		console.timeEnd("time:");
	});
};

var t22 = function () {
	redisClient.HGETALL("test", function (err, datas) {
		console.log("************ err: %j, datas: %j", err, datas);
	});
};

var t23 = function () {
	var keys = ["aaa", "bbb", "ddd", "ccc"];
	redisClient.MGET(keys, function (err, data) {
		console.log("************ err: %j, data: %j", err, data);
	});

	redisClient.HMGET("test", keys, function (err, data) {
		console.log("*******a***** err: %j, data: %j", err, data);
	});

	redisClient.HLEN("testa", function (err, data) {
		console.log("*******b***** err: %j, data: %j", err, data);
	});
};

var t24 = function () {
	redisClient.HVALS("test", function (err, data) {
		console.log("********* err: %j, data: %j", err, data);
	});
};

t24();
