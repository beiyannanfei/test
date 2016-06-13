var tools       = require('../tools');
var async       = require('async');
var _           = require('underscore');
var moment      = require('moment');
var Probability = require('./Probability');
var config = require('../config');
var tkConfig = require('../tokenConfig');
var typeConfig = require('./typeConfig.js');

var ut = require('./utils');
var redisClient = tools.redisClient();

var interface = require('../interface');
var mIntegral = require('../interface/integral.js');

var dbUtils = require('../mongoSkin/mongoUtils.js')
var goodsCollection = new dbUtils('goods')
var templottery = new dbUtils('templottery');
var mallCardCollection = new dbUtils('mallCard')
var redpagerrecordCollection = new dbUtils('redpagerrecords');
var lotterieCollection = new dbUtils('lotteries');

var mShoppingCard = require('./shoppingCard.js');
var dailyRecord = require("./dailyRecord.js");

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

exports.lotteryGoods = function(req, activity, openId, score, callback){
    var token = activity.token
    var defaultGoods = []
    var normalGoods = []
    _.each(activity.prizes, function(doc){
        if (doc.isDefault){
            defaultGoods.push(doc);
        } else {
            normalGoods.push(doc)
        }
    });
    normalGoods.sort(function () {
        return 0.5 - Math.random()
    });

    var doLottery = function(normalGoodsObj, prize, done){
        console.log(prize.name);
        var limit = 0
        var count = 0;
        var timeO = '';

        if (prize.count <= 0 && (prize.type == 3 || prize.type == 4 || prize.type == 6 || prize.type == typeConfig.goods.type.card)){
            return done();
        }

        if (normalGoodsObj.time && normalGoodsObj.time.length > 0) {
            var now = new Date();
            var hour = now.getHours();
            var minutes = now.getMinutes();
            _.each(normalGoodsObj.time, function (timeObj, cb) {
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
        } else if (normalGoodsObj.day && normalGoodsObj.count > 0){
            if (normalGoodsObj.day > 1){
                var startTime = prize.updateTime?prize.updateTime:activity.startTime
                var endTime = activity.endTime
                var day = (endTime.getTime() - startTime.getTime()) / (24 * 60 * 60 * 1000)
                var totalCount = Math.floor(day * normalGoodsObj.count / normalGoodsObj.day);
                console.log(totalCount)
                var cM = (new Date().getTime() - startTime.getTime());
                var tM = (endTime.getTime() - startTime.getTime());
                limit = Math.round(cM / tM * totalCount);
                count = 1
            } else {
                var aMinute = Math.floor(Math.random() * Math.random() * (24 * 60) / normalGoodsObj.count / 4)
                limit = Math.round((new Date().getHours() * 60 + new Date().getMinutes() + aMinute) / (24 * 60) * normalGoodsObj.count);
                limit = (limit > normalGoodsObj.count)?normalGoodsObj.count:limit
                count = normalGoodsObj.count
            }
        }
        var random = Math.random();

        console.log(count)
        console.log(limit)
        var suit = false;
        if (normalGoodsObj.p || normalGoodsObj.p == 0){
            if (random < normalGoodsObj.p){
                suit = true
            }
        } else if (random < 0.2){
            suit = true
        }
        if (suit && limit) {
            var time = '';
            var expire = 30 * 24 * 60 * 60
            if (normalGoodsObj.day && normalGoodsObj.day > 1){
                var startTime = normalGoodsObj.updateTime?normalGoodsObj.updateTime:activity.startTime
                time = moment(startTime).format("YYYYMMDDHH");
                expire = 0
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
                    if (expire > 0){
                        redisClient.expire(key, expire);
                    }
                    prize.rating = normalGoodsObj.rating
                    done(prize);
                    var dayKey = activity._id.toString() + '-' + prize._id + moment(Date.now()).format("YYYYMMDD") + 'cur-day'
                    redisClient.incr(dayKey, function(err, value){
                        if (!err){
                            redisClient.expire(dayKey, 24 * 60 * 60);
                        }
                    });
                    var key = activity._id.toString() + '-' + 'times'
                    redisClient.incr(key, function(err, value){});
                }
            });
        } else {
            done();
        }
    }

    var findNormalPrize = function() {
        async.eachSeries(normalGoods, function (normalGoodsObj, done) {
            goodsCollection.findById(normalGoodsObj.id, function(err,  prize){
                if (err || !prize){
                    return done();
                }
                if(prize.type == typeConfig.goods.type.shoppingCard){
                    mShoppingCard.getShoppingCardLen(prize._id.toString(), function(err, value){
                        prize.count = value
                        console.log('**prize count******************,' + prize.count)
                        doLottery(normalGoodsObj, prize, done)
                    })
                } else {
                    doLottery(normalGoodsObj, prize, done)
                }
            })
        }, function (prize) {
            if (!prize) {
                exports.lotteryDefaultGoods(defaultGoods, function (err, prize) {
                    goodsCollection.findById(prize.id, function(err,  o){
                        if (err || !o){
                            final(null);
                        } else {
                            o.rating = prize.rating
                            final(null, o);
                        }
                    });
                })
            } else {
                final(null, prize);
            }
        });
    }

    getLotteryUser(activity.token, openId, function(value){
        if (value){
            exports.lotteryDefaultGoods(defaultGoods, function(err, prize){
                goodsCollection.findById(prize.id, function(err,  o){
                    if (err || !o){
                        final(null);
                    } else {
                        o.rating = prize.rating
                        final(null, o);
                    }
                });
            })
        } else {
            findNormalPrize()
        }
    });

    var final = function(err, prize){
        if (!prize){
            callback('没有奖品');
        } else{
            callback(null, prize)
        }
    }
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

            if (prize.type == typeConfig.goods.type.score && prize.score != 0){
                mIntegral.changeIntegral(activity.token, openId, prize.score, '抽奖')
            } else if (prize.type == typeConfig.goods.type.redPager){
                var doc = {
                    token: activity.token,
                    openId: openId,
                    redPagerId: prize._id.toString(),
                    usedGoodsIds: prize.ext.usedGoodsIds || [],
                    goodsType: prize.type,
                    endTime: prize.ext.cardEndTime,
                    cardStartTime: prize.ext.cardStartTime
                }

                doc.state = doc.state || 0;
                doc.boundText = doc.boundText || '';
                doc.dateTime = new Date();
                redpagerrecordCollection.save(doc, function(err, o){
                    if (err){
                        console.log('saveRedPagerRecord', err)
                    }
                })
            } else if (prize.type == typeConfig.goods.type.card){
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
                mallCardCollection.save(doc, function(err, o){

                })
            }

            var obj = {
                token: activity.token,
                openId: openId,
                prizeId: prize._id.toString(),
                score: score,
                prizeType: prize.type,
                prizeName: prize.name,
                prizePic: prize.pic,
                activityId: activity._id.toString(),
                from: 1,
                tvmId: prize.tvmId
            }
            if (prize.type == typeConfig.goods.type.shoppingCard || prize.type == typeConfig.goods.type.chargeCard || prize.type == typeConfig.goods.type.goods){
                obj.trade_state = 'new'
            } else {
                obj.trade_state = 'complete'
            }
            var tempObj = _.extend({}, obj);
            tempObj.dateTime = new Date();
            templottery.save(tempObj, function (err, results) {});

            if (prize.type == typeConfig.goods.type.score || prize.type == typeConfig.goods.type.empty){
                delete prize.ext
                callback(null, prize);
            } else {
                console.log('save lottery')
                obj.state = obj.state || 'unDelivery';
                obj.trade_state = obj.trade_state || 'complete';
                obj.count = obj.count || 1;
                obj.dateTime = new Date();
                dailyRecord.setTotalSalesVolume(obj.prizeId, obj.count, function (err, results) {});
                lotterieCollection.save(obj, function(err, doc) {
                    if(err) {
                        console.log('添加获奖日志出错');
                        callback(err);
                    } else {
                        prize.id = doc._id.toString();
                        prize.openId = openId
                        if (prize.type == typeConfig.goods.type.other){
                            prize.extLink = prize.ext.extLink
                        } else if (prize.type == typeConfig.goods.type.card){
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
                    }
                });
            }

            if (prize.type != typeConfig.goods.type.score && prize.type != typeConfig.goods.type.empty){
                setLotteryUser(activity.token, openId);
            }
            setUserLotteryTimes(activity, openId);
        }
    }

    exports.lotteryGoods(req, activity, openId, score, function(err, prize){
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
        return res.send(400, '参数不合法')
    }

    var key = activityId + '-' + openId;
    console.log(key)
    redisClient.incrby(key, -1)
    res.send(200)
}

exports.checkUserLotteryTimes = function(req, res, next){
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId参数不存在');
    }
    var activity = req.activity
    if (activity.limit && activity.limit > 0){
        var key = activity._id.toString() + '-' + openId;
        redisClient.get(key, function(err, value){
            if (err){
                return next()
            } else {
                value = parseInt(value, 10);
                if (!value || _.isNaN(value)){
                    return next()
                }
                if (value >= activity.limit){
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

exports.setBlackUser = function(req, res){
    var remove = req.param('remove')
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'param openId not exist')
    }
    var token = req.param('token')
    if (!token){
        return res.send(400, 'param token not exist')
    }
    var key = 'lottery-' + token + '-' + openId;
    if (remove){
        redisClient.del(key);
    } else {
        redisClient.set(key, true);
    }
    res.send(200, 'success!')
}

function setLotteryUser(token, openId, timeObj){
    var key = 'lottery-' + token + '-' + openId;
    var expired = 30 * 24 * 60 * 60
    /*if (timeObj){
        key += timeObj.startTime + '-' + timeObj.endTime
    }*/
    redisClient.get(key, function(err, value){
        if (err || !value){
            redisClient.setex(key, expired, true);
        }
    })
}

function getLotteryUser(token, openId, cb){
    if (config.NODE_ENV == 'dev'){
        return cb()
    }

    var key = 'lottery-' + token + '-' + openId;
    redisClient.get(key, function(err, value){
        cb(value)
    })
}

exports.lotteryGoodsCount = function(req, res){
    var activity = req.activity
    var result = {}
    async.eachSeries(activity.prizes, function(prize, callback){
        var dayKey = activity._id.toString() + '-' + prize.id + moment(Date.now()).format("YYYYMMDD") + 'cur-day'
        redisClient.get(dayKey, function(err, value){
            if (err || !value){
                result[prize.id] = 0
            } else {
                result[prize.id] = parseInt(value, 10)
            }
            callback()
        })
    }, function(err){
        res.send(result);
    })
}

exports.lotteryActivityCount = function(req, res){
    var activity = req.activity
    var key = activity._id.toString() + '-' + 'times'
    redisClient.get(key, function(err, value){
        if (err || !value){
            res.send({count: 0})
        } else {
            res.send({count: value})
        }
    })
}