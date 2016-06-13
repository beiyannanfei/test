var tools       = require('../tools');
var async       = require('async');
var _           = require('underscore');
var moment      = require('moment');
var models      = require('../models/index');
var Probability = require('./Probability');
var config = require('../config');
var mUser = require('./user');
var MallCard = models.MallCard;

var Activity     = models.Activity;
var Lottery     = models.Lottery;
var Goods    = models.Goods;
var Users    = models.Users;
var IntegralLog = models.IntegralLog;
var RedPagerRecord = models.RedPagerRecord;
var mGoods      = require('../models/goods');
var ut = require('./utils');
var redisQueue = require('../queue/redisQueue.js');
var tkConfig = require('../tokenConfig');
var redisClient = tools.redisClient();

var interface = require('../interface');
var mIntegral = require('../interface/integral.js');

redisClient.select(5, function() {
    console.log('抽奖程序切换到database 5');
});

function initPrizePool(activityId, docs, callback){
    return callback(null);
    var setKey = function(key, count, done){
        redisClient.set(key, count, function(err, reply){
            console.log(reply);
            if (err){
                console.log(err);
                return done("initPrizePool error");
            } else {
                done();
            }
        });
    }

    async.eachSeries(docs, function (prize, done) {
        var prizeCount = 0
        if (prize.time && prize.time.length > 0){
            _.each(prize.time, function(tm){
                if (tm.count){
                    prizeCount += tm.count;
                }
            })
        } else if (prize.day == 1){
            prizeCount = prize.count
        } else if (prize.day > 1){

        }
        var key = activityId + '-' + moment(Date.now()).format("YYYYMMDD") + '-' + prize._id + '-max-count';
        redisClient.get(key, function(err, reply){
            if (err){
                console.log(err);
                return done(err);
            }
            console.log('initPrizePool: prizeName:' + prize.name + ', reply:' + reply);
            var lotteryCount = parseInt(reply, 10);
            if (!lotteryCount || _.isNaN(lotteryCount)){
                return setKey(key, prizeCount, done);
            } else{
                return done();
            }
        });
    }, function (err) {
        callback(err);
    });
}

function checkYesterdayPrize(activityId, prizeId, done){
    return done('暂时不用');
    var time = moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYYMMDD");
    var key = activityId + '-' + prizeId + '-' + time;

    var setKey = function(count){
        redisClient.watch(key);
        var multi = redisClient.multi();
        multi.set(key, count);
        multi.exec(function(err, reply){
            if (err){
                console.log(err);
                return done("another request is handling");
            }
            if (reply && reply.length == 1){
                console.log('checkYesterdayPrize set reply');
                console.log(reply);
                return done(null);
            } else{
                return done("另外一个请求正在进行");
            }
        });
    }

    var getYesteDayMaxCount = function(cb){
        var Ykey = activityId + '-' + moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYYMMDD") + '-' + prizeId + '-max-count';
        redisClient.get(Ykey, function(err, reply){
            if (err){
                console.log(err);
                return cb(0);
            }
            var lotteryCount = parseInt(reply, 10);
            if (!lotteryCount || _.isNaN(lotteryCount)){
                cb(0)
            } else {
                cb(lotteryCount);
            }
        });
    }

    var checkCount = function(count){
        redisClient.watch(key);
        var multi = redisClient.multi();
        multi.get(key);
        multi.exec(function(err, reply){
            if (err){
                return done("another request is handling");
            }
            if (reply && reply.length == 1){
                console.log('checkYesterdayPrize get reply');
                console.log(reply);
                var lotteryCount = parseInt(reply[0], 10);
                if (!lotteryCount || _.isNaN(lotteryCount)){
                    lotteryCount = 0;
                }
                if (lotteryCount >= count){
                    return done('昨天已经没有奖品了');
                } else{
                    return setKey(++lotteryCount);
                }
            } else{
                return done("另外一个请求正在进行");
            }
        });
    }

    getYesteDayMaxCount(function(count){
        if (!count){
            done('奖品没有了')
        } else {
            checkCount(count);
        }
    })
}

function checkPrizeRecord(key, limit, done){
    console.log(key)
    console.log('limit: ' + limit)

    var incKey = function(){
        redisClient.incr(key, function(err, value){
            if (err){
                done(err)
            } else {
                var value = parseInt(value, 10);
                if (_.isNaN(value) || value < 1){
                    return done('expect int > 0')
                }
                console.log('value: ' + value)
                if (value > limit){
                    redisClient.incrby(key, -1)
                    done('exceed limit')
                } else {
                    done(null)
                }
            }
        });
    }
    incKey()
}

exports.lotteryDefaultGoods = function(docs, callback){
    var arr = []
    _.each(docs, function (doc) {
        arr.push({
            p: doc.p,
            f: function(){
                return doc;
            }
        })
    })

    var probabilitilized = new Probability(arr);
    var prize = probabilitilized();
    callback(null, prize);
}

exports.lotteryGoods = function(req, openId, score, callback){
    var activity = req.activity
    var token = activity.token

    var prizeMaps = {}
    var defaultGoods = []
    var normalGoods = []

    var findActivity = function(){
        var lotteryC = activity.lotteryC;
        if (activity.prizes){
            _.each(activity.prizes, function(prize){
                prizeMaps[prize.id] = prize
            })
        }

        var prizeIds = _.keys(prizeMaps);
        if(prizeIds.length == 0){
            return callback(null);
        }
        findPrize(lotteryC, prizeIds);
    }

    var findPrize = function(lotteryC, prizeIds) {
        var condition = {_id: {$in: prizeIds}};
        Goods.find(condition, {'ext.shoppingCards': 0}, function (err, docs) {
            if (err) {
                callback(err);
            } else if (!docs || docs.length == 0) {
                callback(null);
            } else {
                docs = ut.doc2Object(docs);
                docs.sort(function () {
                    return 0.5 - Math.random()
                });

                _.each(docs, function(doc){
                    var obj = prizeMaps[doc._id.toString()];
                    if (obj.p || obj.p == 0){
                        doc.p = obj.p
                    }
                    doc.stock = doc.count
                    if (obj.isDefault){
                        defaultGoods.push(doc);
                    } else {
                        if (obj.day){
                            doc.count = obj.count
                            doc.day = obj.day
                            if (obj.day > 1){
                                doc.updateTime = obj.updateTime;
                            }
                        } else if (obj.time){
                            doc.time = obj.time
                        }
                        normalGoods.push(doc)
                    }
                });

                normalGoods.sort(function () {
                    return 0.5 - Math.random()
                });

                normalGoods = [normalGoods[0]]

                if (lotteryC == 'count') {
                    var findNormalPrize = function() {
                        var prizeCount = 0
                        _.each(normalGoods, function (doc) {
                            console.log(doc)
                            if (doc.day == 1 && doc.count){
                                prizeCount += doc.count;
                            } else if (doc.time) {
                                _.each(doc.time, function (tm) {
                                    if (tm.count) {
                                        prizeCount += tm.count;
                                    }
                                })
                            }
                        })

                        console.log(prizeCount);
                        //normalGoods = normalGoods[0]
                        async.eachSeries(normalGoods, function (prize, done) {
                            console.log(prize.name);
                            var limit = 0
                            var count = 0;
                            var timeO = '';
                            console.log('total')
                            console.log(prize.stock)
                            if (prize.stock <= 0 && (prize.type == 3 || prize.type == 4 || prize.type == 6 || prize.type == mGoods.type.card)){
                                return done();
                            }
                            if (prize.time && prize.time.length > 0) {
                                var now = new Date();
                                var hour = now.getHours();
                                var minutes = now.getMinutes();
                                _.each(prize.time, function (timeObj, cb) {
                                    var startTime = timeObj.startTime.split(':')
                                    var endTime = timeObj.endTime.split(':')
                                    var sHour = parseInt(startTime[0], 10)
                                    var sMinute = parseInt(startTime[1], 10)
                                    var eHour = parseInt(endTime[0], 10)
                                    var eMinute = parseInt(endTime[1], 10)
                                    var startM = sHour * 60 + sMinute;
                                    var endM = eHour * 60 + eMinute;
                                    var cM = hour * 60 + minutes;
                                    if (cM >= startM && cM < endM) {
                                        timeO = timeObj;
                                        if (timeObj.count){
                                            var aMinute = Math.floor(Math.random() * Math.random() * (endM - startM) / timeObj.count / 4)
                                            var l = Math.round((cM - startM + aMinute) / (endM - startM) * timeObj.count);
                                            l = (l > timeObj.count)? timeObj.count:l
                                            limit = l;
                                        }
                                    }
                                });
                                if (!timeO) {
                                    return done();
                                }
                                count = timeO.count
                            } else if (prize.day && prize.count > 0){
                                if (prize.day > 1){
                                    var startTime = prize.updateTime?prize.updateTime:activity.startTime
                                    var endTime = activity.endTime
                                    var day = (endTime.getTime() - startTime.getTime()) / (24 * 60 * 60 * 1000)
                                    var totalCount = Math.floor(day * prize.count / prize.day);
                                    console.log(totalCount)
                                    var cM = (new Date().getTime() - startTime.getTime());
                                    var tM = (endTime.getTime() - startTime.getTime());
                                    limit = Math.round(cM / tM * totalCount);
                                    count = 1
                                } else {
                                    var aMinute = Math.floor(Math.random() * Math.random() * (24 * 60) / prize.count / 4)
                                    limit = Math.round((new Date().getHours() * 60 + new Date().getMinutes() + aMinute) / (24 * 60) * prize.count);
                                    limit = (limit > prize.count)?prize.count:limit
                                    count = prize.count
                                }
                            }
                            var random = Math.random();

                            console.log(count)
                            console.log(limit)
                            var suit = false;
                            if (prize.p || prize.p == 0){
                                if (random < prize.p){
                                    suit = true
                                }
                            } else if (random < count / prizeCount){
                                suit = true
                            }
                            if (suit && limit) {
                                var time = '';
                                if (prize.day && prize.day > 1){
                                    var startTime = prize.updateTime?prize.updateTime:activity.startTime
                                    time = moment(startTime).format("YYYYMMDDHH");
                                } else {
                                    time = moment(Date.now()).format("YYYYMMDD");
                                    if (timeO){
                                        time += timeO.startTime + '-' + timeO.endTime
                                    }
                                }
                                var key = activity._id.toString() + '-' + prize._id + time;
                                checkPrizeRecord(key, limit, function (err) {
                                    if (err) {
                                        done();
                                    } else {
                                        console.log('find prize:' + prize.name)
                                        done(prize);
                                    }
                                });
                            } else {
                                done();
                            }
                        }, function (prize) {
                            if (!prize) {
                                exports.lotteryDefaultGoods(defaultGoods, function (err, prize) {
                                    final(null, prize);
                                })
                            } else {
                                final(null, prize);
                            }
                        });
                    }

                    getLotteryUser(activity.token, openId, req.activityEnableTime, function(value){
                        if (value){
                            exports.lotteryDefaultGoods(defaultGoods, function(err, prize){
                                final(null, prize);
                            })
                        } else {
                            findNormalPrize()
                        }
                    });
                } else if (lotteryC == 'percent'){
                    getLotteryUser(activity.token, openId, req.activityEnableTime, function(value){
                        if (value){
                            docs.sort(function(a, b){
                                return a.count > b.count
                            })
                            final(null, docs[0]);
                        } else {
                            var arr = []
                            _.each(docs, function (doc) {
                                arr.push({
                                    p: doc.p,
                                    f: function(){
                                        return doc;
                                    }
                                })
                            })
                            var probabilitilized = new Probability(arr);
                            var prize = probabilitilized();
                            final(null, prize);
                        }
                    });
                } else{
                    callback(null, null);
                }
            }
        })
    }

    var final = function(err, prize){
        if (!prize){
            callback('没有奖品');
        } else{
            prize.prize = prizeMaps[prize._id.toString()].rating;
            callback(null, prize)
        }
    }
    findActivity();
}

exports.draw = function(req, openId, score, callback) {
    var activity = req.activity
    var final = function(err, prize) {
        if(err || !prize) {
            return callback('没有抽到任何奖品');
        } else {
            if (score != 0){
                mIntegral.changeIntegral(activity.token, openId, -score, '抽奖')
            }

            if (prize.type == mGoods.type.score && prize.score != 0){
                mIntegral.changeIntegral(activity.token, openId, prize.score, '抽奖')
            } else if (prize.type == mGoods.type.redPager){
                var doc = {
                    token: activity.token,
                    openId: openId,
                    redPagerId: prize._id.toString(),
                    goodsType: prize.type
                }
                if (prize.ext && prize.ext.validTime){
                    doc.endTime =  prize.ext.validTime
                }
                new RedPagerRecord(doc).save(function(err, o){
                    if (err){
                        console.log('saveRedPagerRecord', err)
                    }
                })
            } else if (prize.type == mGoods.type.vip){
                mUser.updateUserToVip(activity.token, openId, prize.ext.expireDay, prize.ext.vipType, prize._id.toString(), 1)
            } else if (prize.type == mGoods.type.card){
                var doc = {
                    token: activity.token,
                    openId: openId,
                    goodsId: prize._id.toString(),
                    usedGoodsIds: prize.ext.usedGoodsIds,
                    name: prize.name,
                    discount: prize.ext.discount,
                    state: 0
                }

                if (prize.ext && prize.ext.cardEndTime){
                    doc.endTime =  prize.ext.cardEndTime
                }
                if (prize.ext && prize.ext.cardStartTime){
                    doc.startTime =  prize.ext.cardStartTime
                }
                new MallCard(doc).save(function(err, o){})
            }

            var obj = {
                token: activity.token,
                openId: openId,
                prizeId: prize._id,
                score: score,
                prizeType: prize.type,
                prizeName: prize.name,
                prizePic: prize.pic,
                activityId: activity._id.toString(),
                from: 1
            }
            if (prize.type == mGoods.type.shoppingCard || prize.type == mGoods.type.chargeCard || prize.type == mGoods.type.goods){
                obj.trade_state = 'new'
            } else {
                obj.trade_state = 'complete'
                obj.state = 'Delivered'
            }

            if (prize.type == mGoods.type.goods || prize.type == mGoods.type.chargeCard || prize.type == mGoods.type.shoppingCard){
                var lottery = new Lottery(obj);
                lottery.save(function(err, doc) {
                    if(err) {
                        console.log('添加获奖日志出错');
                        callback(err);
                    } else {
                        if (prize.type == mGoods.type.other){
                            prize.extLink = prize.ext.extLink
                        } else if (prize.type == mGoods.type.card){
                            prize.goodsUrl = tkConfig.getAuthDomain(req.token) + "/oauth?wx_token=" + req.token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + prize.ext.usedGoodsIds[0] + '?wx_token=' + req.token);
                        }
                        prize.id = doc._id;
                        delete prize.shoppingCard
                        delete prize.randomNum
                        delete prize.token
                        delete prize.time
                        delete prize.p
                        delete prize.day
                        delete prize.count
                        delete prize.integral
                        delete prize.ext
                        callback(null, prize);
                    }
                });
            } else {
                if (prize.type == mGoods.type.other){
                    prize.extLink = prize.ext.extLink
                } else if (prize.type == mGoods.type.card){
                    prize.goodsUrl = tkConfig.getAuthDomain(req.token) + "/oauth?wx_token=" + req.token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + prize.ext.usedGoodsIds[0] + '?wx_token=' + req.token);
                }
                delete prize.shoppingCard
                delete prize.randomNum
                delete prize.token
                delete prize.time
                delete prize.p
                delete prize.day
                delete prize.count
                delete prize.integral
                delete prize.ext
                callback(null, prize);

                obj.queueDataCollection = 'Lottery'
                redisQueue.push(obj)
            }
            if (prize.type != mGoods.type.score && prize.type != mGoods.type.empty){
                setLotteryUser(activity.token, openId, req.activityEnableTime);
            }
            setUserLotteryTimes(activity, openId);
        }
    }

    exports.lotteryGoods(req, openId, score, function(err, prize){
        final(null, prize);
    })
};

function setUserLotteryTimes(activity, openId){
    if (activity.limit && activity.limit > 0){
        var key = activity._id.toString() + '-' + openId;
        redisClient.incr(key)
    }
}

exports.addUserLotteryTimes = function(req, res){
    var openId = req.param('openId');
    var token = req.param('token');
    var activityId = req.param('activityId');
    if (!openId || !activityId || !token){
        return res.send({status: 'fail', msg: "参数不合法"})
    }

    var key = activityId + '-' + openId;
    console.log(key)
    redisClient.incrby(key, -1)
    res.send({status: 'success'})
}

exports.checkUserLotteryTimes = function(req, res, next){
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId参数不存在');
    }
    var activity = req.activity
    if (activity.limit && activity.limit > 0){
        var key = activity._id.toString() + '-' + openId;
        redisClient.incr(key, function(err, value){
            if (err){
                return next()
            } else {
                redisClient.incrby(key, -1)
                value = parseInt(value, 10);
                if (!value || _.isNaN(value)){
                    return next()
                }
                if (value - 1 >= activity.limit){
                    return res.send({status: -3, limit: activity.limit});
                } else {
                    return next()
                }
            }
        });
    } else {
        return next()
    }
}

function setLotteryUser(token, openId, timeObj){
    var key = 'lottery-' + token + '-' + openId;
    var expired = 24 * 60 * 60
    /*if (timeObj){
        key += timeObj.startTime + '-' + timeObj.endTime
    }*/
    redisClient.get(key, function(err, value){
        if (err || !value){
            redisClient.setex(key, expired, true);
        }
    })
}

exports.setBlackUser = function(req, res){
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'param openId not exist')
    }
    var token = req.param('token')
    if (!token){
        return res.send(400, 'param token not exist')
    }
    var key = 'lottery-' + token + '-' + openId;
    redisClient.set(key, true);
    res.send(200, 'success!')
}

function getLotteryUser(token, openId, timeObj, cb){
    if (config.NODE_ENV == 'dev'){
        return cb()
    }
    if (openId == 'ovRO5jmzYU0lsa0-GW_lOF6TRiMQ' || openId == 'ovRO5jlYbFfXJZGoq_wh6AVIATDA' || openId == 'ovRO5jicNhv02VgxKFo7s8WGWWlk' || openId == 'ovRO5jjVyKqCioi8OE1bKm_1Qul0'){
        return cb(1)
    }

    var key = 'lottery-' + token + '-' + openId;
    /*if (timeObj){
        key += timeObj.startTime + '-' + timeObj.endTime
    }*/
    redisClient.get(key, function(err, value){
        cb(value)
    })
}