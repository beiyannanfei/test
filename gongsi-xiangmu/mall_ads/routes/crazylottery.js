/**
 * Created by Administrator on 2014/8/13.
 */
var _ = require('underscore');
var ut = require('./utils');
var async = require('async');
var moment = require('moment');
var config = require('../config');
var typeConfig = require('./typeConfig.js');
var mPrize = require('./prize.js');
var Probability = require('./Probability.js');
var queueUtil = require('../queue/redisQueue.js')
var dbUtils = require('../mongoSkin/mongoUtils.js')
var crazylotteryCollection = new dbUtils('crazylottery')
var prizeCollection = new dbUtils('prize')

var tools       = require('../tools');
var redisClient = tools.lotteryRedis();

function checkLotteryParam(req, cb){
    req.body.limit = ut.checkPositiveInt(req.body.limit)
    if (req.body.limit == null){
        req.body.limit = 1
    }

    var prizes = req.body.prizes
    if (!prizes || !_.isArray(prizes) || prizes.length == 0){
        return cb('param prizes error')
    }
    var totalP = 0
    var hasDefault = false
    for (var i = 0; i < prizes.length; i++){
        var o = prizes[i]
        if (o.flag){
            hasDefault = true
            if (!o.pic){
                return cb('default prize must has pic')
            }
        } else {
            if (!o.id){
                return cb('param prizes error, id is not exists')
            }
            o.count = ut.checkPositiveInt(o.count)
            if (o.count == null){
                return cb('param prizes error, count error')
            }
            o.rate = ut.checkPositiveInt(o.rate)
            if (o.rate == null){
                return cb('param rate error, rate error')
            }
        }
        o.p = ut.checkPositiveFloat(o.p)
        if (o.p == null || o.p > 1){
            return cb('param prizes error, p error')
        }
        totalP += o.p
    }
    if (!hasDefault){
        return cb('param prizes error, Default prize must exist')
    }

    totalP = Math.round(totalP * 100) / 100;
    console.log('totalP:' + totalP)
    if (totalP != 1){
        return cb('param prizes error, total of p is not 1')
    }
    cb(null, req.body);
}

/*prizes  : [
    {
        id: 'id',
        p: 0.8,  //概率
        count: 15
    },
    {
        id: 'id2',
        p: 0.1,  //概率
        count: 15
    },
    {
        flag: 1,  //default为1代表默认奖
        p: 0.1,  //概率
        pic: 'url'  //图片url
    }
]*/

exports.addLottery = function(req, res){
    checkLotteryParam(req, function(err, doc){
        if (err){
            return res.send(400, err);
        }

        doc.dateTime = new Date()
        ut.groupDoc(doc, req)
        crazylotteryCollection.save(doc, function(err, o){
            if (err){
                return res.send(500, err);
            }
            //todo notice
            return res.send(200, o);
        })
    })
}

exports.updateLottery = function(req, res){
    var id = req.param('id');
    checkLotteryParam(req, function(err, doc){
        if (err){
            return res.send(400, err);
        }

        crazylotteryCollection.updateById(id, {$set: doc}, function(err, o){
            if (err){
                return res.send(500, err);
            }

            return res.send(200, o);
        })
    })
}

exports.getLottery = function(req, res){
    var id = req.param('id');
    if (!id){
        return res.send(400, 'param id is not exists')
    }
    crazylotteryCollection.findById(id, function(err, doc){
        if (err){
            res.send(500, err)
        } else if (doc){
            var ids = _.pluck(doc.prizes, 'id')
            prizeCollection.find({_id: {$in: dbUtils.toId(ids)}}, {pic: 1, name: 1, type: 1}, function(err, prizes){
                if (err){
                    return res.send(500, err)
                }
                var prizes = ut.arrToMap(prizes, '_id')
                _.each(doc.prizes, function(o){
                    o = _.extend(o, prizes[o.id])
                })
                res.send(doc)
            })
        } else {
            res.send(400, 'lottery info not found')
        }
    })
}

exports.getLotteryPrize = function(req, res){
    var id = req.param('id');
    if (!id){
        return res.send(400, 'param id is not exists')
    }
    crazylotteryCollection.findById(id, function(err, doc){
        if (err){
            return res.send(500, err)
        } else if (doc){
            var ids = _.pluck(doc.prizes, 'id')
            prizeCollection.find({_id: {$in: dbUtils.toId(ids)}}, {pic: 1, name: 1}, function(err, prizes){
                if (err){
                    return res.send(500, err)
                }
                var prizes = ut.arrToMap(prizes, '_id')
                var result = []
                _.each(doc.prizes, function(o){
                    if (!o.flag){
                        result.push(prizes[o.id])
                    }
                })
                return res.send(result)
            })
        } else {
            res.send(400, 'lottery info not found')
        }
    })
}

exports.midCrazyLotteryLoader = function(req, res, next){
    var id = req.param('id');
    if(!id){
        return res.send(404);
    }
    crazylotteryCollection.findById(id, function(err, doc){
        if (err){
            console.log('mongodb err:' + err)
            return res.send(500, 'mongodb error:' + err);
        } else if(!doc) {
            console.log('not find')
            return res.send(404, 'lottery is not exist');
        }
        req.crazylottery = doc;
        next()
    })
}

exports.drawCrazyLottery = function(req, res){
    var first = true
    var user = req.user
    var crazylottery = req.crazylottery
    if (!crazylottery.endTime){
        return res.send(500, {code: 1, errmsg: '抽奖还未开始'})
    }
    if (new Date().getTime() > crazylottery.endTime){
        return res.send(500, {code: 2, errmsg: '抽奖已经结束'})
    }

    var drawFinal = function(err, prize){
        console.log(err)
        if (err || !prize){
            if (first){
                first = false
                return checkNormalPrize(defaultPrize)
            }
            prize = getDefaultPrize(crazylottery);
            return res.send(prize)
        } else {
            redisClient.HINCRBY(crazylottery._id.toString() + '-user-times', req.user.openId, 1, function(){console.log(arguments)})
            return res.send(prize)
        }
    }

    /*console.log('req.lotteryTimes:' + req.lotteryTimes)
    console.log('crazylottery.limit: ' + crazylottery.limit)
    if (req.lotteryTimes && crazylottery.limit && req.lotteryTimes >= crazylottery.limit){
        return drawFinal('lottery time over limit' + crazylottery.limit)
    }
    if (req.error){
        return drawFinal('err')
    }*/

    var arr = []
    var defaultPrize = null
    _.each(crazylottery.prizes, function (doc) {
        if (!defaultPrize){
            defaultPrize = doc
        } else if (defaultPrize.count < doc.count){
            defaultPrize = doc
        }
        arr.push({
            p: doc.p,
            f: function(){
                return doc;
            }
        })
    })
    var probabilitilized = new Probability(arr);
    var prizeResult = probabilitilized();
    if (prizeResult.flag == 1){
        if (defaultPrize){
            prizeResult = defaultPrize
        } else {
            return res.send(prizeResult)
        }
    }

    var checkNormalPrize = function(prize){
        if (prize.count > 0){
            prizeCollection.findById(prize.id, function(err, o){
                console.log(o)
                if (err){
                    return drawFinal(err)
                }
                if ((o.type == typeConfig.prizeType.goods || o.type == typeConfig.prizeType.link || o.type == typeConfig.prizeType.wxcard) && o.count <= 0){
                    return drawFinal('not stock')
                }
                checkPrizeRecord(crazylottery._id.toString(), prize.id, prize.count, function(err){
                    if (err){
                        return drawFinal(err)
                    } else {
                        prize.type = o.type
                        prize.pic = o.pic
                        prize.name = o.name
                        prize.flag = 0

                        mPrize.getPrizeLotteryInfo(o, function(err, ext){
                            if (err){
                                return drawFinal(err)
                            } else {
                                prize = _.extend(prize, ext)
                                var order = {
                                    tvmId: o.tvmId,
                                    yyyappId: o.yyyappId,
                                    prize: {
                                        id: prize.id,
                                        type: prize.type,
                                        name: prize.name,
                                        pic: prize.pic,
                                        rate: prize.rate
                                    },
                                    user: user,
                                    crazyLotteryId: crazylottery._id.toString(),
                                    _id: new dbUtils.ObjectID(),
                                    queueDataCollection: 'order',
                                    dateTime: new Date().getTime()
                                }
                                if (o.type == typeConfig.prizeType.goods && o.expiredDay){
                                    order.prize.expiredDay = o.expiredDay
                                }
                                order.prize = _.extend(order.prize, ext)
                                prize.orderId = order._id
                                queueUtil.push(order)
                                queueUtil.pushCrazyLottery(crazylottery._id.toString(), order)
                                return drawFinal(null, prize)
                            }
                        })
                    }
                })
            })

        } else {
            return drawFinal('not stock')
        }
    }

    checkNormalPrize(prizeResult)
}

function getDefaultPrize(crazylottery){
    for (var i = 0; i < crazylottery.prizes.length; i++){
        var prize = crazylottery.prizes[i]
        if (prize.flag){
            return prize
        }
    }
    return null
}

exports.checkLotteryUserTimes = function(req, res, next){
    var crazylottery = req.crazylottery
    if (!crazylottery.limit || config.NODE_ENV == 'dev'){
        next()
    } else {
        redisClient.HGET(crazylottery._id.toString() + '-user-times', req.user.openId, function(err, value){
            if (err){
                req.error = true
                next()
            } else {
                req.lotteryTimes = value
                next()
            }
        })
    }
}

function checkPrizeRecord(lotteryId, prizeId, limit, done){
    var key = lotteryId + '-prize-count'
    redisClient.HINCRBY(key, prizeId, 1, function(err, value){
        if (err){
            done(err)
        } else {
            var value = parseInt(value, 10);
            if (_.isNaN(value) || value < 1){
                return done('expect int > 0')
            }
            console.log('value: ' + value)
            if (value > limit){
                redisClient.HINCRBY(key, prizeId, -1)
                done('exceed limit')
            } else {
                done(null)
            }
        }
    })
}

exports.startCrazyLottery = function(req, res){
    var lotteryId = req.body.lotteryid
    var length = req.body.length
    if (!lotteryId){
        return res.send(400, 'param lotteryid is not exist')
    }

    length = ut.checkPositiveInt(length);
    if (!length){
        return res.send(400, 'param length err')
    }

    crazylotteryCollection.updateById(lotteryId, {$set: {endTime: new Date().getTime() + length}}, function(err){
        if (err){
            return res.send(500, 'update error')
        }
        setTimeout(function(){
            queueUtil.notiCrazyLotteryEnd({lotteryId: lotteryId})
        }, length)
        return res.send(200)
    })
}

exports.copyCrazyLottery = function(req, res){
    var crazylottery = req.crazylottery
    var count = req.body.count
    count = ut.checkPositiveInt(count)
    if (!count){
        return res.send(400, 'param count error')
    }
    delete crazylottery._id
    var arr = []
    for (var i = 0; i < count; i++){
        arr.push(_.extend({},crazylottery))
    }

    crazylotteryCollection.insert(arr, function(err, docs){
        if (err){
            console.log(err);
            return res.send(500, 'mongodb error!')
        } else {
            if (docs.length != count){
                return res.send(500, 'copy error!')
            }
            return res.send(200, _.pluck(docs, '_id'))
        }
    })
}

exports.changeCopyCrazyLottery = function(req, res){
    var copyIds = req.body.copyIds
    if (!copyIds){
        return res.send(400, 'copyIds err')
    }
    copyIds = copyIds.split(',')

    console.log(copyIds)
    if (copyIds.length == 0){
        return res.send(400, 'copyIds err')
    }
    var crazylottery = req.crazylottery
    delete crazylottery._id
    crazylotteryCollection.update({_id: {$in: dbUtils.toId(copyIds)}}, {$set: crazylottery}, {multi: true}, function(err, docs){
        if (err){
            console.log(err);
            return res.send(500, 'mongodb error!')
        } else {
            return res.send(200)
        }
    })
}

exports.getLotteryRecords = function(req, res){
    var id = req.param('id');
    redisClient.LRANGE(id + '-win-records', 0, 20, function(err, arr){
        if (err){
            res.send({count: 0, result: []})
        } else {
            var result = {}
            _.each(arr, function(o){
                var o = JSON.parse(o)
                if (!result[o.prize.rate]){
                    result[o.prize.rate] = {
                        rate: o.prize.rate,
                        name: o.prize.name,
                        pic: o.prize.pic,
                        type: o.prize.type,
                        money: o.prize.money,
                        prizeInfo: '红包',
                        users: []
                    }
                }
                result[o.prize.rate].users.push({
                    name: o.user.name,
                    icon: o.user.icon
                })
            })
            result = _.values(result)
            result.sort(function(a, b){
                return (a.rate < b.rate?-1:1)
            })
            redisClient.LLEN(id + '-win-records', function(err, count){
                console.log(arguments)
                res.send({count: count, result: result})
            });
        }
    })
}