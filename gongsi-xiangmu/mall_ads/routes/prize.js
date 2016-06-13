/**
 * Created by Administrator on 2014/7/31.
 */

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');
var typeConfig = require('./typeConfig.js');
var dbUtils = require('../mongoSkin/mongoUtils.js')
var prizeCollection = new dbUtils('prize')
var mShoppingCard = require('./shoppingCard.js');
var mWxRed = require('./wxRed.js');
var tools = require('../tools');
var queueClient = tools.queueRedis();

exports.getPrize = function(req, res){
    var needCount = req.param('needCount')
    var condition = {state: {$nin: ['deleted']}}
    ut.groupCondition(condition, req)
    prizeCollection.find(condition, {wxredParam: 0, fields: 0}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        if (!needCount){
            return res.send(docs);
        }
        var arr = []
        _.each(docs, function(o){
            if (o.type == 2){
                arr.push(o._id.toString())
            }
        })
        if (arr.length > 0){
            mShoppingCard.getCountShoppingCards(arr, function(map){
                _.each(docs, function(o){
                    if (o.type == 2){
                        o.count = map[o._id.toString()]
                    }
                })
                res.send(docs);
            })
        } else {
            res.send(docs);
        }
    })
}

exports.midPrizeLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        prizeCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'goods is not exist');
            }
            req.prize = doc;
            next()
        })
    }
}

exports.delPrize = function(req, res){
    var id = req.param('id')
    prizeCollection.updateById(id, {$set: {state: 'deleted'}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            res.send(200)
        }
    })
}

function checkPrizeParam(req, cb){
    console.log(req.body)
    if (!req.body.name){
        return cb('没有奖品名字')
    }
    if (!req.body.pic){
        return cb('没有奖品图片')
    }

    if ((req.body.type = ut.checkPositiveInt(req.body.type)) == null){
        return cb('没有选择奖品类型')
    }

    if (req.body.type == typeConfig.prizeType.link || req.body.type == typeConfig.prizeType.goods || req.body.type == typeConfig.prizeType.wxcard){
        if ((req.body.count = ut.checkPositiveInt(req.body.count)) == null){
            return cb('没有奖品库存数量')
        }
    }
    if (req.body.type == typeConfig.prizeType.link){
        if (!req.body.link){
            return cb('外部链接必须填写')
        }
        if (!ut.isUrlReg(req.body.link)){
            return cb('外部链接不正确')
        }
    } else if (req.body.type == typeConfig.prizeType.card){
        if (!req.body.shoppingCards){
            return cb('没有消费码')
        }
        if (!_.isArray(req.body.shoppingCards)){
            return cb('shoppingCards is not array')
        }
        if (!req.body.link){
            return cb('链接必须填写')
        }
        if (!ut.isUrlReg(req.body.link)){
            return cb('链接不正确')
        }
    } else if (req.body.type == typeConfig.prizeType.wxcard){
        if (!req.body.card_id){
            return cb('没有card_id')
        }
    } else if (req.body.type == typeConfig.prizeType.goods){
        req.body.expiredDay = ut.checkPositiveInt(req.body.expiredDay)
    }
    cb(null, req.body);
}

exports.addPrize = function(req, res){
    checkPrizeParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        ut.groupDoc(doc, req)
        doc.dateTime = new Date()

        var shoppingCards = doc.shoppingCards
        if (doc.type == typeConfig.prizeType.card){
            delete doc.shoppingCards
        }
        exports.savePrize(doc, function(err, o){
            if (err){
                return res.send(500, err)
            } else{
                if (doc.type == typeConfig.prizeType.card){
                    mShoppingCard.saveShoppingCard(o._id.toString(), shoppingCards, function(){})
                }
                mShoppingCard.saveCount(o._id.toString(), doc.count);
                return res.send(200, o)
            }
        })
    })
}

exports.savePrize = function(doc, cb){
    doc.dateTime = new Date()
    prizeCollection.save(doc, function(err, o){
        if (err){
            return cb(500, err)
        } else{
            return cb(null, o)
        }
    })
}

exports.updatePrize = function(req, res){
    checkPrizeParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        var shoppingCards = doc.shoppingCards
        if (doc.type == typeConfig.prizeType.card){
            delete doc.shoppingCards
        }
        if (doc.type != typeConfig.prizeType.wxcard && doc.type != typeConfig.prizeType.wxred){
            delete doc.shoppingCards
        }
        prizeCollection.updateById(req.prize._id, {$set: doc}, function(err, o){
            if (err){
                return res.send(500, err)
            } else {
                if (doc.type == typeConfig.prizeType.card){
                    mShoppingCard.saveShoppingCard(req.prize._id.toString(), shoppingCards, function(){})
                }
                mShoppingCard.saveCount(req.prize._id.toString(), doc.count);
                return res.send(200)
            }
        })
    })
}

exports.prizeInfo = function(req, res){
    if (req.prize.type == typeConfig.prizeType.card){
        mShoppingCard.getShoppingCards(req.prize._id.toString(), function(err, shoppingCards){
            if (err){
                res.send(req.prize);
            } else {
                req.prize.shoppingCards = shoppingCards
                res.send(req.prize);
            }
        })
    } else if (req.prize.type == typeConfig.prizeType.wxred){
        req.prize = _.extend(req.prize, req.prize.wxredParam)
        req.prize.total_amount = req.prize.total_amount / 100
        res.send(req.prize);
    } else{
        res.send(req.prize);
    }
}

exports.updatePrizeCount = function(prizeId, count, cb){
    prizeCollection.updateById(prizeId, {$inc: {count: count}}, function(err){
        if (err){
            return cb(err)
        } else {
            return cb()
        }
    })
}

exports.updateWxCardState = function(card_id, state, cb){
    prizeCollection.findOne({card_id: card_id}, function(err, o){
        if (err){
            return cb(err)
        } else {
            prizeCollection.updateById(o._id), {$set:{state: state}}, function(err, o){}
            return cb()
        }
    })
}

exports.getPrizeLotteryInfo = function(prize, cb){

    var ext = {}
    if (prize.gainUrl){
        ext.gainUrl = prize.gainUrl
    }
    //消费码
    if (prize.type == typeConfig.prizeType.card){
        console.log("shoppingCard"+prize._id);
        mShoppingCard.popShoppingCards(prize._id.toString(), function(err, shoppingCard){
            if (err || !shoppingCard){
                console.log(err);
                return cb({});
            }
            ext.shoppingCard = shoppingCard
            if (prize.link){
                ext.link = prize.link
            }
            return cb(null, ext);
        })
    } else {
        //微信卡券
        if (prize.type == typeConfig.prizeType.wxcard){
            ext.card_id = prize.card_id
            ext.price = prize.price
            cb(null, ext);
        }
        //微信红包
        else if (prize.type == typeConfig.prizeType.wxred){
            mWxRed.createwxredAndLottery(prize, function(err, redLotteryId){
                if (err){
                    cb(err);
                } else {
                    ext.wxRedLotteryId = redLotteryId
                    ext.money = prize.wxredParam.total_amount / 100
                    cb(null, ext);
                }
            })
        }
        //链接
        else if (prize.type == typeConfig.prizeType.link){
            ext.link = prize.link
            cb(null, ext);
        }
        //是实物 并且包含动态表单
        else if(prize.type == typeConfig.prizeType.goods && prize.fields){
            ext.fields = prize.fields;
            cb(null, ext);
        }
        else {
            cb(null, ext);
        }
    }
}


//上报领奖信息
exports.reportPrizeInfo = function (req, res) {
    var lotteryId = req.body.lotteryId; //抽奖id
    var prizeId = req.body.prizeId;     //奖品id
    var user = req.body.user;           //用户信息
    if (!lotteryId || !prizeId || !user) {
        return res.send(400, 'params err');
    }
    var keys = lotteryId + prizeId + 'reportinfo';
    var field = user.openId;
    var values = JSON.stringify(user);
    queueClient.HSET(keys, field, values, function (err, rdoc) {
        if (!!err) {
            return res.send(500, "HSET %j, err: %j", keys, err);
        }
        console.log("set %j success, user: %j", keys, JSON.stringify(user));
    });
};