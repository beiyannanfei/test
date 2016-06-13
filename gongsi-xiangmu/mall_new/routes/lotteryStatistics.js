var _ = require('underscore');
var async = require('async');
var moment = require('moment');

var typeConfig = require('./typeConfig.js');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var lotteryCount = require("../tools/cron/lotteryStatistics.js");
var cacheutils = require("./cache-utils.js");
var dbUtils = require('../mongoSkin/mongoUtils.js');
var LotteryStatistics = new dbUtils("lotterystatistics");
var userCollection = new dbUtils('users');
var goodsCollection = new dbUtils('goods');
var activitiesCollection = new dbUtils('activities');

var ut = require('./utils');

exports.home = function(req, res){
    var token = req.token;
    var options = {totalMoney: 0};

    var condition = {
        token: token
    }
    statisticsLottery(condition, function(result){
        _.each(result, function(o){
            options.totalMoney += o.totalMoney
        })
        final();
    })

    var final = function(){
        options.totalMoney = options.totalMoney.toFixed(2)
        res.render('lottery-statistics', options);
    }
}

exports.detail = function(req, res){
    var dateTime = req.param('dateTime')
    if (!dateTime){
        return res.send('没有时间参数');
    }

    var options = {
        dateTime: dateTime
    }

    res.render('lottery-statistics-detail', options);
}

exports.prizeDetail = function(req, res){
    var dateTime = req.param('dateTime')
    if (!dateTime){
        return res.send('没有时间参数');
    }

    var condition = {
        token: req.token,
        dateTime: new Date(parseInt(dateTime, 10))
    }

    statisticsLotteryPrize(condition, function(result){
        res.send(result);
    })
}

exports.getStatistics = function(req, res){
    var startTime = req.param('startTime')
    var endTime = req.param('endTime')

    var condition = {
        token: req.token
    }
    if (startTime && endTime){
        startTime = parseInt(startTime, 10)
        endTime = parseInt(endTime, 10)
        condition.dateTime = {
            $gte: new Date(startTime),
            $lt: new Date(endTime)
        }
    }
    var hisExpire = 1 * 60 * 60;    //历史记录到期时间 1h
    var todayExpire = 1 * 60;       //当天数据到期时间 1m
    var key = JSON.stringify(condition);
    if (endTime > new Date().getTime()) {   //包含当天信息
        cacheutils.get(key, function (err, o) {
            if (!!err || !o) {  //当错误或查询结果为空
                lotteryCount.startRealTimeStatistics(req.token, function () {
                    statisticsLottery(condition, function (result) {
                        if (result.length == 0) {
                            result = [
                                {numberPeople: 0, numberLottery: 0, totalMoney: 0, activity: [], dateTime: moment(startTime).format('YYYY-MM-DD')}
                            ]
                        }
                        cacheutils.set(key, todayExpire, JSON.stringify(result), function (err, result) {
                        });
                        return final(result);
                    })
                });
            }
            else {
                return final(JSON.parse(o));
            }
        });
    }
    else {  //历史数据
        cacheutils.get(key, function (err, o) {
            if (!!err || !o) {
                lotteryCount.startRealTimeStatistics(req.token, function () {
                    statisticsLottery(condition, function (result) {
                        if (result.length == 0) {
                            result = [
                                {numberPeople: 0, numberLottery: 0, totalMoney: 0, activity: [], dateTime: moment(startTime).format('YYYY-MM-DD')}
                            ]
                        }
                        cacheutils.set(key, hisExpire, JSON.stringify(result), function (err, result) {
                        });
                        return final(result);
                    })
                });
            }
            else {
                return final(JSON.parse(o));
            }
        });
    }

    var final = function(data){
        res.send(data)
    }
}

var statisticsLottery = function(condition, done){
    console.time('statisticsLottery')
    var findRecordTotal = function(){
        console.log(condition);
        LotteryStatistics.find(condition, {'activity.openIds': 0, 'hour.openIds': 0, 'hour.activity.openIds': 0, openIds: 0, 'prize.openIds': 0}, function(err, docs){
            if (err){
                console.log(err);
                return final()
            } else{
                console.log(docs);
                console.log(condition);
                console.timeEnd('statisticsLottery')
                console.log(docs);
                findGoods(docs)
            }
        })
    }

    var findGoods = function(docs){
        console.time('findGoods')
        var goodIds = []
        _.each(docs, function(o){
            goodIds.push(_.pluck(o.prize, 'prizeId'));
            o.zjTime = o.numberLottery;
        })
        goodIds = _.flatten(goodIds);
        var condition = {
            _id: {
                $in: goodIds
            }
        }
        goodsCollection.find(condition, {price: 1, type: 1}, function(err, goods){
            if (err){
                console.log('find goods err: ', err)
                return final()
            }
            var goodsMap = {}
            _.each(goods, function(o){
                goodsMap[o._id.toString()] = o;

                if (o.type == typeConfig.goods.type.empty) {  //如果奖品为空
                    _.each(docs, function (doc) {
                        _.each(doc.prize, function (prizeVal) {
                            if (prizeVal.prizeId == o._id.toString()) {
                                console.log("***doc.numberLottery: %j， prizeVal.numberLottery: %j", doc.numberLottery, prizeVal.numberLottery);
                                doc.zjTime -= prizeVal.numberLottery||0;
                            }
                        });
                    });
                }
            });
            console.timeEnd('findGoods')
            findActivity(docs, goodsMap);
        })
    }

    var findActivity = function(docs, goodsMap){
        console.time('findActivity')
        var activityIds = []
        _.each(docs, function(o){
            activityIds.push(_.pluck(o.activity, 'activityId'));
        })
        activityIds = _.flatten(activityIds);
        var condition = {
            _id: {
                $in: activityIds
            }
        }
        activitiesCollection.find(condition, {name: 1}, function(err, activities){
            if (err){
                console.log('find goods err: ', err)
                return final()
            }
            var activityMap = {}
            _.each(activities, function(o){
                activityMap[o._id.toString()] = o
            })
            console.timeEnd('findActivity')
            calculateTotal(docs, goodsMap, activityMap);
        })
    }

    var calculateTotal = function(docs, goodsMap, activityMap){
        console.time('calculateTotal')
        var result = []
        if (docs.length == 1){
            _.each(docs, function(o){
                var obj = {zjTime: o.zjTime, numberPeople: 0, numberLottery: 0, totalMoney: 0, activity: [], dateTime: moment(o.dateTime).format('YYYY-MM-DD')}
                _.each(o.prize, function(prize){
                    obj.totalMoney += goodsMap[prize.prizeId].price * prize.numberLottery
                })

                var activityPriceMap = {}
                var activityEmptyMap = {};
                _.each(o.activity, function(activity){
                    if (!activityPriceMap[activity.activityId]){
                        activityPriceMap[activity.activityId] = 0
                    }
                    if (!activityEmptyMap[activity.activityId]){
                        activityEmptyMap[activity.activityId] = 0
                    }
                    var prizeIds = _.keys(activity.prize);
                    _.each(prizeIds, function(prizeId){
                        activityPriceMap[activity.activityId] += goodsMap[prizeId].price * activity.prize[prizeId];
                        if (goodsMap[prizeId].type == typeConfig.goods.type.empty) {
                            activityEmptyMap[activity.activityId] += activity.prize[prizeId];
                        }
                    });
                })
                var activityNumLotteryMap = {};
                _.each(o.hour, function(hour){
                    _.each(hour.activity, function(activity){
                        if (!activityNumLotteryMap[activity.activityId]) {
                            activityNumLotteryMap[activity.activityId] = 0;
                        }
                        activityNumLotteryMap[activity.activityId] += activity.numberLottery;
                    });
                    _.each(hour.activity, function(activity){
                        var activityObj = {
                            dateTime: hour.hour,
                            activityId: activity.activityId,
                            name: activityMap[activity.activityId].name,
                            numberLottery: activity.numberLottery,
                            numberPeople: activity.numberPeople,
                            totalMoney: activityPriceMap[activity.activityId],
                            zjTime: activityNumLotteryMap[activity.activityId] - activityEmptyMap[activity.activityId]
                        };
                        _.each(o.activity, function (activity) {
                            if (activity.activityId == activityObj.activityId) {
                                activityObj.totalNumberLottery = activity.numberPeople;
                            }
                        });

                        obj.activity.push(activityObj)
                    })
                })
                obj.numberPeople += o.numberPeople
                obj.numberLottery += o.numberLottery
                obj.dateTime = moment(o.dateTime).format('YYYY-MM-DD')
                result.push(obj)
            })
        } else{
            _.each(docs, function(o){
                var obj = {zjTime: o.zjTime, numberPeople: 0, numberLottery: 0, totalMoney: 0, activity: [], dateTime: moment(o.dateTime).format('YYYY-MM-DD')}

                _.each(o.prize, function(prize){
                    obj.totalMoney += goodsMap[prize.prizeId].price * prize.numberLottery
                })
                var activityNumLotteryMap = {};
                _.each(o.activity, function(activity){
                    if (!activityNumLotteryMap[activity.activityId]) {
                        activityNumLotteryMap[activity.activityId] = 0;
                    }
                    activityNumLotteryMap[activity.activityId] += activity.numberLottery;
                });
                _.each(o.activity, function(activity){
                    var activityObj = {
                        dateTime: obj.dateTime,
                        activityId: activity.activityId,
                        numberLottery: activity.numberLottery,
                        numberPeople: activity.numberPeople,
                        name: activityMap[activity.activityId].name,
                        totalMoney: 0,
                        zjTime: activityNumLotteryMap[activity.activityId]
                    };
                    _.each(o.activity, function (activity) {
                        if (activity.activityId == activityObj.activityId) {
                            activityObj.totalNumberLottery = activity.numberPeople;
                        }
                    });

                    var prizeIds = _.keys(activity.prize);
                    _.each(prizeIds, function(prizeId){
                        activityObj.totalMoney += goodsMap[prizeId].price * activity.prize[prizeId]
                        if (goodsMap[prizeId].type == typeConfig.goods.type.empty) {
                            activityObj.zjTime -= activity.prize[prizeId];
                        }
                    });
                    obj.activity.push(activityObj)
                })
                obj.numberPeople += o.numberPeople
                obj.numberLottery += o.numberLottery
                result.push(obj)
            })
        }
        final(result)
        console.timeEnd('calculateTotal')
    }

    var final = function(result){
        if (!result){
            done([]);
        } else {
            done(result);
        }
    }

    findRecordTotal();
}

var statisticsLotteryPrize = function(condition, done){
    console.time('statisticsLottery')
    console.log(condition);
    var findRecordTotal = function(){
        LotteryStatistics.findOne(condition, {prize: 1}, function(err, doc){
            if (err){
                console.log(err);
                return final()
            } else{
                console.timeEnd('statisticsLottery')
                findGoods(doc)
            }
        })
    }

    var findGoods = function(doc){
        if (!doc){
            return final([])
        }
        console.time('findGoods')
        var goodIds = _.pluck(doc.prize, 'prizeId')
        goodIds = _.flatten(goodIds);
        var goodsCondition = {
            _id: {
                $in: goodIds
            }
        }
        goodsCollection.find(goodsCondition, {name: 1, pic: 1, price: 1, type: 1}, function(err, goods){
            if (err){
                console.log('find goods err: ', err)
                return final()
            }
            var goodsMap = {}
            _.each(goods, function(o){
                goodsMap[o._id.toString()] = o
            })
            console.timeEnd('findGoods')
            findUsers(doc, goodsMap)
        })
    }

    var findUsers = function(doc, goodsMap){
        console.time('findUsers')
        var openIds = []
        _.each(doc.prize, function(prize){
            if (!_.contains([typeConfig.goods.type.score, typeConfig.goods.type.empty], goodsMap[prize.prizeId].type)){
                openIds.push(prize.openIds);
            }
        })
        openIds = _.flatten(openIds);
        var userCondition = {
            wxToken: condition.token,
            openId: {
                $in: openIds
            }
        }
        userCollection.find(userCondition, {nickName: 1, headImg: 1, openId: 1}, function(err, users){
            if (err){
                console.log('find goods err: ', err)
                return final()
            }
            var userMap = {}
            _.each(users, function(o){
                userMap[o.openId] = o
            })
            console.timeEnd('findUsers')
            calculateTotal(doc, goodsMap, userMap)
        })
    }

    var calculateTotal = function(doc, goodsMap, userMap){
        var doc = ut.doc2Object(doc);
        var result = []
        _.each(doc.prize, function(prize){
            if (!_.contains([typeConfig.goods.type.empty], goodsMap[prize.prizeId].type)){
                prize.name = goodsMap[prize.prizeId].name
                prize.pic = goodsMap[prize.prizeId].pic
                prize.numberLottery = prize.numberLottery
                prize.numberPeople = prize.numberPeople
                prize.totalMoney = goodsMap[prize.prizeId].price * prize.numberLottery
                prize.users = []
                _.each(prize.openIds, function(openId){
                    if (userMap[openId]){
                        prize.users.push(userMap[openId]);
                    }
                })
                delete prize.openIds
                result.push(prize)
            }
        })
        final(result)
    }

    var final = function(result){
        if (!result){
            done([]);
        } else {
            done(result);
        }
    }

    findRecordTotal();
}
