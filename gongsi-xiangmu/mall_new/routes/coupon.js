/**
 * Created by chenjie on 2015/11/26.
 */

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');
var fs = require('fs');
var tools       = require('../tools');
var redisClient = tools.redisClient();

var dbUtils = require('../mongoSkin/mongoUtils.js')
var couponCollection = new dbUtils('coupon')
var couponCollectionSlave = new dbUtils('coupon', true)
var couponRecordsCollection = new dbUtils('couponRecords')
var couponRecordsCollectionSlave = new dbUtils('couponRecords', true)

var mShoppingCard = require('./shoppingCard.js');
var mCouponStatistics = require('./couponStatistics.js');
var mError = require("./error.js");
var config =  require("../config.js");

function checkParams(req, cb){
    var body = req.body
    if (!body.name){
        return cb('名字不存在')
    }
    if (!body.pic){
        return cb('图片不存在')
    }
    if ((body.count = ut.checkPositiveInt(body.count)) == null){
        return cb('发放数量错误')
    }
    if ((body.value = ut.checkPositiveFloat(body.value)) == null){
        return cb('面值错误')
    }
    body.limit = ut.checkPositiveInt(body.limit)
    if (body.limit == null){
        body.limit = 0
    }
    if ((body.beginDate = ut.checkPositiveInt(body.beginDate)) == null){
        return cb('无效的生效时间')
    }
    body.beginDateStr = moment(body.beginDate).format('YYYY-MM-DD')

    if ((body.endDate = ut.checkPositiveInt(body.endDate)) == null){
        return cb('无效的过期时间')
    }
    body.endDateStr = moment(body.endDate).format('YYYY-MM-DD')

    body.usePriceLimit = ut.checkPositiveInt(body.usePriceLimit)
    if (body.usePriceLimit == null){
        body.usePriceLimit = 0
    }
    if (!_.isArray(body.useGoods)){
        body.useGoods = ['all']
    }
    if (!body.jump_url){
        return cb('立即使用url不存在')
    }
    if (!body.tips){
        return cb('使用提示不存在')
    }
    if (!ut.isUrl(body.jump_url)){
        return cb('立即使用url格式不正确')
    }
    cb(null, body)
}

exports.create = function(req, res){
    var id = req.param('id')
    checkParams(req, function(err, body){
        if (err){
            return res.send(400, err)
        }
        if (!id){
            ut.groupDoc(body, req.token, req.tvmId)
            body.dateTime = new Date()
            body.disable = 0
            couponCollection.save(body, function(err, o){
                if (err){
                    console.log(err)
                    res.send(500, '保存失败')
                } else {
                    res.send(200)
                    mShoppingCard.saveCount(o._id, body.count, function(){})
                    if (config.NODE_ENV == 'qcloud' || config.NODE_ENV == 'qa'){
                        var fileName = 'coupon-' + o._id.toString() + '.json'
                        fs.writeFile('/mnt/pic/data/coupon/' + fileName, JSON.stringify(o), function(err){
                            console.log(err)
                        })
                    }
                }
            })
        } else{
            couponCollection.findById(id, function(err, o){
                if (err){
                    console.log(err)
                    res.send(500, '保存失败')
                } else {
                    couponCollection.updateById(id, {$set: body}, function(err){
                        if (err){
                            console.log(err)
                            res.send(500, '保存失败')
                        } else {
                            res.send(200)
                            mShoppingCard.saveCount(id, body.count, function(){})

                            if (config.NODE_ENV == 'qcloud' || config.NODE_ENV == 'qa'){
                                _.extend(o, body)
                                var fileName = 'coupon-' + o._id.toString() + '.json'
                                fs.writeFile('/mnt/pic/data/coupon/' + fileName, JSON.stringify(o), function(err){
                                    console.log(err)
                                })
                            }
                        }
                    })
                }
            });
        }
    })
}

exports.list = function(req, res){
    var name = req.param('name')
    var token = req.token
    var SPEC = {
        token: token
    }
    if (name){
        SPEC.name = name
    }
    var OPTIONS = {
        sort: {dateTime: -1}, skip: req.pageSpec.skip, limit: req.pageSpec.limit
    }
    async.parallel({
        getCount: function(cb){
            couponCollectionSlave.count(SPEC, function(err, count){
                cb(null, count)
            })
        },
        findData: function(cb){
            couponCollectionSlave.find(SPEC, {}, OPTIONS, function(err, docs){
                if (err){
                    console.log(err)
                    return cb('获取数据失败')
                }
                mCouponStatistics.getCouponStatistics(_.pluck(docs, '_id'), function(err, map){
                    _.each(docs, function(o){
                        o.beginDate = moment(o.beginDate).format('YYYY-MM-DD HH:mm:ss')
                        o.endDate = moment(o.endDate).format('YYYY-MM-DD HH:mm:ss')
                        _.extend(o, map[o._id.toString()])
                        if (config.NODE_ENV == 'qcloud'){
                            o.link = 'http://q.cdn.mtq.tvm.cn/tmall/data/mobile/views/coupon.html?id=' + o._id + '&wx_token=' + o.token
                        } else {
                            o.link = config.domain + '/mobile/views/coupon.html?id=' + o._id + '&wx_token=' + o.token
                        }
                    })
                    cb(null, docs)
                })
            })
        }
    }, function(err, results){
        if (err){
            return res.send(err)
        }
        res.send({count: results.getCount, result: results.findData})
    })
}

exports.disable = function(req, res){
    var id = req.param('id')
    couponCollection.updateById(id, {$set: {disable: 1}}, function(err){
        if (err){
            console.log(err)
            res.send(500, '设置失败')
        } else {
            res.send(200)
        }
    })
}

exports.midCouponLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        couponCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, '系统错误');
            } else if (!doc) {
                return res.send(404, '该优惠券不存在');
            }
            req.coupon = doc;
            next()
        })
    }
}

exports.receive = function(req, res){
    var user = req.user
    var coupon = req.coupon

    exports.checkSendCouponToUser(user, coupon, function(err){
        if (err){
            return res.send(400, err)
        } else {
            return res.send()
        }
    })
}

exports.checkSendCouponToUser = function(user, coupon, callback){
    if (!user){
        return callback('用户信息不存在')
    }
    /*if (coupon.disable == 1){
     return res.send(403, '该优惠券已失效')
     }*/

    if (coupon.endDate < new Date().getTime()){
        return callback('优惠券已过期')
    }

    if (coupon.count <= 0){
        return callback('你来晚一步哦！已经被抢光了')
    }

    async.waterfall([
        function(cb){
            mShoppingCard.changeCount(coupon._id.toString(), -1, function(err, v){
                if (err){
                    mError.pushError({function: "changeCount", couponId: coupon._id.toString(), err: err, v: v});
                    return cb('系统错误')
                }
                if (v < 0){
                    return cb('你来晚一步哦！已经被抢光了')
                }
                cb()
            })
        },
        function(cb){
            mCouponStatistics.setCouponStatistics(coupon._id.toString(), user.openId, 1, function(err, num){
                if (err){
                    mShoppingCard.changeCount(coupon._id.toString(), 1, function(err, v){})
                    return cb('系统错误.')
                }
                if (coupon.limit && num > coupon.limit){
                    mCouponStatistics.setCouponStatistics(coupon._id.toString(), user.openId, -1, function(){})
                    mShoppingCard.changeCount(coupon._id.toString(), 1, function(err, v){})
                    return cb('一人只能领' + coupon.limit + '次')
                }
                return cb()
            })
        },
        function(cb){
            delete coupon.pv
            delete coupon.uv
            delete coupon.use
            delete coupon.count
            delete coupon.limit
            var obj = {
                couponId: coupon._id.toString(),
                openId: user.openId,
                token: user.wxToken || user.token,
                user: user,
                coupon: coupon,
                used: 0,
                dateTime: new Date().getTime(),
                dateTimeStr: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
            couponRecordsCollection.save(obj, function(err, o){
                cb(null, o)
            })
        }
    ], function(err, results){
        if (err){
            return callback(err)
        } else {
            return callback()
        }
    })
}

exports.loadUserEnableCoupon = function(req, res){
    var SPEC = {
        token: req.token,
        openId: req.openId,
        'coupon.beginDate': {$lt: new Date().getTime()},
        'coupon.endDate': {$gt: new Date().getTime()},
        used: 0
    }
    couponRecordsCollectionSlave.find(SPEC, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            console.log(err)
            return res.send(500, '系统错误')
        }
        res.send(docs)
    })
}

exports.consumeCouponBy3rd = function(req, res){
    var ids = req.body.ids
    if (!_.isArray(ids)){
        return res.send(400, 'ids参数错误')
    }

    async.mapLimit(ids, 20, function(id, cb){
        couponRecordsCollectionSlave.findById(id, function(err, o){
            if (err || !o){
                console.log(err)
                return cb('系统错误')
            }
            if (o.openId != req.openId || o.token != req.token){
                return cb('没有权限使用优惠券')
            }
            if (o.coupon.beginDate > new Date().getTime()){
                return cb('优惠券没有生效')
            }
            if (o.coupon.endDate < new Date().getTime()){
                return cb('优惠券已经过期')
            }
            return cb(null, o)
        })
    }, function(err, datas){
        if (err){
            return res.send(500, err)
        }
        exports.consumeCoupon(datas, function(err){
            if (err){
                return res.send(500, err)
            } else {
                return res.send(200)
            }
        })
    })
}

exports.getCouponValue = function(req, res){
    var ids = req.body.ids
    if (!_.isArray(ids)){
        return res.send(400, 'ids参数错误')
    }

    var results = []
    async.eachSeries(ids, function(id, cb){
        couponRecordsCollectionSlave.findById(id, function(err, o){
            if (err || !o){
                console.log(err)
                return cb('系统错误')
            }
            results.push({id: id, value: o.coupon.value})
            return cb()
        })
    }, function(err){
        if (err){
            return res.send(500, err)
        }
        return res.send(results)
    })
}

exports.consumeCoupon = function(datas, cb){
	var SPEC = {_id: {$in: _.pluck(datas, "_id")}};
    couponRecordsCollection.update(SPEC, {$set: {used: 1, usedTime: new Date().getTime(), usedTimeStr: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}}, {multi: true}, function(err){
        if (err){
            console.log(err)
            return cb('系统错误')
        }
	    datas.forEach(function (item) {
		    mCouponStatistics.useCouponStatistics(item.couponId, 1);
	    });
        return cb()
    })
}

exports.detail = function(req, res){
    var coupon = req.coupon
    res.send(coupon)
}

exports.getUsedCoupon = function (req, res) {
	var couponId = req.param("couponId");
	var pageIndex = req.param("pageIndex") || 0;
	if (!couponId || !pageIndex) {
		return res.send(400, "param is null");
	}
	pageIndex = +pageIndex;
	var pageSize = 20;
	var skipNum = +pageIndex * pageSize;
	var condition = {couponId: couponId, used: 1};
	var option = {sort: {usedTime: -1}, skip: skipNum, limit: pageSize};
	var showColumn = {
		"user.weixin_avatar_url": 1,
		"user.nickname": 1,
		"user.city": 1,
		"user.sex": 1,
		"coupon.value": 1,
		"dateTimeStr": 1,
		"usedTimeStr": 1,
        "usedTime": 1
	};
	async.parallel({
		getCount: function (cb) {
			mCouponStatistics.getCouponStatistics([couponId], function (err, countMap) {
				return cb(err, countMap[couponId] ? (countMap[couponId].use || 0) : 0);
			});
		},
		getDatas: function (cb) {
			couponRecordsCollectionSlave.find(condition, showColumn, option, function (err, datas) {
				return cb(err, datas);
			});
		}
	}, function (err, results) {
		if (!!err) {
			console.error("[%j] getUsedCoupon err: %j, couponId: %j, pageIndex: %j", new Date().toLocaleString(), couponId, pageIndex);
			mError.pushError({function: "getUsedCoupon", err: err, results: results, couponId: couponId, pageIndex: pageIndex});
			return res.send(500, err);
		}
		var count = +results.getCount;
		var datas = results.getDatas;
		return res.send(200, {count: count, datas: datas});
	});
};

exports.loadCoupon = function(id, cb){
    couponCollection.findById(id, function(err, o){
        if (err){
            cb(err)
        } else if (!o){
            cb('err')
        } else {
            cb(null, o)
        }
    });
}