/**
 * Created by wyq on 2015/11/26.
 * 优惠券统计信息
 */
var async = require("async");
var _ = require("underscore");
var tools = require('../tools');
var redisClient = tools.couponRedis();
var typeConfig = require('./typeConfig.js');
var mError = require("./error.js");

exports.setCouponStatistics = function (prizeId, openId, num, cb) {     //设置优惠券统计
	if (!prizeId || !openId || !num) {
		mError.pushError({function: "setCouponStatistics-checkParam", prizeId: prizeId, openId: openId, openId: openId, num: num});
		return cb ? cb("param is null") : "";
	}

	var uvKey = "coupon_getuv_" + prizeId;      //领取人数
	var pvKey = "coupon_getpv_" + prizeId;      //领取次数

	async.parallel({
		setUv: function (cb) {      //设置领取人数
			redisClient.HINCRBY(uvKey, openId, +num, function (err, data) {
				if (!!err) {
					console.error("[%j] setCouponStatistics-setUv err: %j, uvKey: %j, openId: %j, num: %j",
						new Date().toLocaleString(), err, uvKey, openId, num);
					mError.pushError({function: "setCouponStatistics-setUv", err: err, uvKey: uvKey, openId: openId, num: num});
				}
				if (0 == +data) {   //如果这个人的领取次数为0，删除这个这个openId
					redisClient.HDEL(uvKey, openId);
				}
				return cb(err, +data);
			});
		},
		setPv: function (cb) {      //设置领取次数
			redisClient.INCRBY(pvKey, +num, function (err, data) {
				if (!!err) {
					console.error("[%j] setCouponStatistics-setPv err: %j, pvKey: %j, num: %j", new Date().toLocaleString(), err, pvKey, num);
					mError.pushError({function: "setCouponStatistics-setPv", err: err, pvKey: pvKey, num: num});
				}
				return cb(err, data);
			});
		}
	}, function (err, results) {
		if (!!err) {
			return cb ? cb(err) : "";
		}
		return cb ? cb(null, results.setUv || 0) : "";
	});
};

exports.useCouponStatistics = function (prizeId, num, cb) {     //设置优惠券的使用次数
	if (!prizeId || !num) {
		return cb ? cb("param is null") : "";
	}
	if (+num <= 0) {
		return cb ? cb("num must a positive number") : "";
	}

	var key = "coupon_useNum_" + prizeId;
	redisClient.INCRBY(key, +num, function (err, data) {
		if (!!err) {
			console.error("[%j] useCouponStatistics err: %j, key: %j, num: %j", new Date().toLocaleString(), err, key, num);
			mError.pushError({function: "useCouponStatistics", err: err, key: key, num: num});
		}
		return cb ? cb(err, data) : "";
	});
};

exports.getCouponStatistics = function (prizeIds, cb) {     //获取优惠券的统计数据
	if (!prizeIds || prizeIds.length <= 0) {
		return cb ? cb("prizeIds is null") : "";
	}
	var uvKeys = [];    //领取人数keys
	var pvKeys = [];    //领取次数keys
	var useKeys = [];   //使用次数keys

	prizeIds.forEach(function (item) {
		uvKeys.push("coupon_getuv_" + item);
		pvKeys.push("coupon_getpv_" + item);
		useKeys.push("coupon_useNum_" + item);
	});

	async.parallel({
		getUvCount: function (cb) {     //获取uv数量
			async.mapLimit(uvKeys, 100, function (item, cb) {
				redisClient.HLEN(item, function (err, count) {
					return cb(err, count);
				});
			}, function (err, datas) {
				if (!!err) {
					console.error("[%j] getCouponStatistics-getUvCount err: %j, uvKeys: %j, datas: %j", new Date().toLocaleString(), err, uvKeys, datas);
					mError.pushError({function: "getCouponStatistics-getUvCount", err: err, uvKeys: uvKeys, datas: datas});
				}
				return cb(err, datas);
			});
		},
		getPvCount: function (cb) {     //获取pv数量
			redisClient.MGET(pvKeys, function (err, datas) {
				if (!!err) {
					console.error("[%j] getCouponStatistics-getPvCount err: %j, pvKeys: %j", new Date().toLocaleString(), err, pvKeys);
					mError.pushError({function: "getCouponStatistics-getPvCount", err: err, pvKeys: pvKeys});
				}
				return cb(err, datas);
			});
		},
		getUseCount: function (cb) {    //获取使用数量
			redisClient.MGET(useKeys, function (err, datas) {
				if (!!err) {
					console.error("[%j] getCouponStatistics-getUseCount err: %j, useKeys: %j", new Date().toLocaleString(), err, useKeys);
					mError.pushError({function: "getCouponStatistics-getUseCount", err: err, useKeys: useKeys});
				}
				return cb(err, datas);
			});
		}
	}, function (err, results) {
		if (!!err) {
			return cb(err);
		}
		var uvDatas = results.getUvCount || [];
		var pvDatas = results.getPvCount || [];
		var useDatas = results.getUseCount || [];

		var resMap = {};
		for (var index in prizeIds) {
			var id = prizeIds[index];
			var uv = uvDatas[index] || 0;
			var pv = pvDatas[index] || 0;
			var use = useDatas[index] || 0;
			resMap[id] = {
				uv: uv,
				pv: pv,
				use: use
			};
		}
		return cb(null, resMap);
	});
};


