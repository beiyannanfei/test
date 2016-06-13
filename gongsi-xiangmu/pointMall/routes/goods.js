/**
 * Created by Administrator on 2014/7/31.
 */
var models = require('../models/index');
var Goods = models.Goods;
var Users = models.Users;
var Lottery = models.Lottery;
var DailyRecord = models.DailyRecord;
var mGoods = require('../models/goods');
var mLottery = require('./lottery');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');
var mGoodsCategoryConfig = require('../data/goodsCategory');
var config = require('../config');
var tkConfig = require('../tokenConfig');
var nodeExcel     = require('excel-export');
var wmh     = require('./wmh.js');
var redisCache = require('./redis_cache.js')
var dailyRecord = require("./dailyRecord.js");

function removeGoodsCache(token){
    redisCache.del(token + 'getGoods')
    redisCache.del(token + 'listLotteryGoods')
    redisCache.del(token + 'listBuyGoods')
    redisCache.del(token + 'listRedPager')
    redisCache.del(token + 'listVideoGoods')
    redisCache.del(token + 'gotoPrize')
}

exports.getGoods = function(req, res){
    var token = req.token
    redisCache.get(token + 'getGoods', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, use: mGoods.useType.lottery, type: {$ne: mGoods.type.cashRedPager}}, {}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'getGoods', 1 * 60, docs)
                res.send(docs);
            })
        } else {
            res.send(values)
        }
    })
}

exports.listLotteryGoods = function(req, res){
    var token = req.token
    redisCache.get(token + 'listLotteryGoods', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, use: mGoods.useType.lottery, type: {$ne: mGoods.type.cashRedPager}}, {price: 0}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'listLotteryGoods', 10 * 60, docs)
                res.send(docs)
            })
        } else {
            res.send(values)
        }
    })
}

exports.listBuyGoods = function(req, res){
    var token = req.token
    redisCache.get(token + 'listBuyGoods', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, use: mGoods.useType.pay, 'ext.state': 1}, {}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'listBuyGoods', 10 * 60, docs)
                res.send(docs)
            })
        } else {
            res.send(values)
        }
    })

}

exports.listRedPager = function(req, res){
    var token = req.token
    redisCache.get(token + 'listRedPager', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, use: mGoods.useType.lottery, type: {$in: [mGoods.type.shoppingCard, mGoods.type.score, mGoods.type.redPager, mGoods.type.cashRedPager]}}, {}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'listRedPager', 10 * 60, docs)
                res.send(docs)
            })
        } else {
            res.send(values)
        }
    })
}

exports.listVideoGoods = function(req, res){
    var token = req.token
    redisCache.get(token + 'listVideoGoods', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, type: mGoods.type.demand}, {}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'listVideoGoods', 10 * 60, docs)
                res.send(docs);
            })
        } else {
            res.send(values)
        }
    })
}

exports.gotoPrize = function(req, res){
    var token = req.token
    redisCache.get(token + 'gotoPrize', function(err, values){
        if (err || !values){
            Goods.find({token: token, deleted: {$ne: true}, use: mGoods.useType.lottery}, {}, {sort: {dateTime: -1}}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error');
                }
                redisCache.set(token + 'gotoPrize', 10 * 60, docs)
                res.render('prizes', {goods: docs})
            })
        } else {
            res.render('prizes', {goods: values})
        }
    })
}

exports.gotoAddPrize = function(req, res){
    var token = req.param('token')
    console.log('--------------------------',{unit:req.integralUnit});
    res.render('add-prize',{unit:req.integralUnit});
}

exports.gotoPrizeUpdate = function(req, res){
    res.render('add-prize', {token: req.token, goodsId: req.goods._id, unit: req.integralUnit})
}

exports.midGoodsLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            console.log('param id not exist')
            return res.send(404);
        }
        Goods.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                console.log('goods not exist')
                return res.send(404, 'goods is not exist');
            }
            if (doc.token != req.token){
                console.log('token not match')
                return res.send(404, 'goods is not exist');
            }
            req.goods = ut.doc2Object(doc);
            next()
        })
    }
}

exports.delGoods = function(req, res){
    var id = req.param('id')
    Goods.findByIdAndUpdate(id, {$set: {deleted: true}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            removeGoodsCache(req.token)
            res.send(200)
        }
    })
}

exports.removeDemandVipGoodsId = function(goodsId){
    Goods.update({type: mGoods.type.demandPackage, 'ext.vipGoodsId': goodsId}, {$unset: {'ext.vipGoodsId': 1}}, {multi: true}, function(err){
        if (!err){

        }
    })
}

exports.gotoGoods = function(req, res){
    res.render('list-goods')
}

exports.listGoods = function(req, res){
    var token = req.token
    var condition = {
        token: token,
        deleted: {$ne: true},
        use: mGoods.useType.pay
    }
    var state           = req.param('state');
    var keywordName     = req.param('keywordName');

    if (state == '1'){
        condition['ext.state'] = 1
    } else if (state == '2'){
        condition['ext.state'] = 2
    } else if (state == '3'){
        condition['ext.state'] = 3
    } else if (state == '10'){
        condition.count = 0
    }

    if (keywordName && keywordName.length > 0)
        condition['name'] = new RegExp(keywordName, 'i');

    var pageSize    = 15;
    var pageIndex   = req.query.pageIndex && !isNaN(parseInt(req.query.pageIndex))
                    ? parseInt(req.query.pageIndex) : 1;
    var totalSize   = 0;
    var pageCount   = 0;


    var findGoods = function(){
        Goods.count(condition, function(err, count) {
            totalSize = count;
            pageCount = Math.ceil(totalSize / pageSize);

            var start   = (pageIndex - 1) * pageSize;
            var end     = start + pageSize - 1;

            Goods.find(condition, {type: 1, price: 1, name: 1, dateTime: 1, pic: 1, count: 1, 'ext': 1}
                , {sort: {dateTime: -1}, skip: start, limit:pageSize}, function(err, docs){
                if (err){
                    return res.send(500, 'mongodb error:' + err);
                }

                docs = ut.doc2Object(docs);

                findSaleCount(docs);
            })
        })
    }

    var findSaleCount = function(docs){
        mLottery.getSaleCount(token, _.pluck(docs, '_id'), function(result){
            findPv(docs, result)
        })
    }

    var findPv = function(docs, saleResult){
        var key = "count_pv_and_uv";
        var sourceIdList = _.pluck(docs, '_id');
        console.log("listGoods get pv and uv sourceIdList: %j", sourceIdList);
        var totalFieldList = [];
        _.each(sourceIdList, function (val) {
            totalFieldList.push("goods_" + val + "_total")
        });
        console.log("listGoods get pv and uv totalFieldList: %j", totalFieldList);
        dailyRecord.getPvAndUv(key, totalFieldList, function (err, datas) {
            if (!!err) {
                return final(docs, saleResult, {});
            }
            console.log("listGoods get pv and uv datas: %j", datas);
            var map = {};
            for (var index in datas) {
                var data = JSON.parse(datas[index]);
                if (!data) {        //当不存在数据时
                    map[sourceIdList[index]] = {
                        pv: 0,
                        uv: 0
                    }
                }
                else {
                    map[sourceIdList[index]] = {
                        pv: +data.pv,
                        uv: +data.uv
                    }
                }
            }
            console.log("listGoods get pv and uv map: %j", map);
            final(docs, saleResult, map);
        });
        /*var goodsId = _.pluck(docs, '_id');
        var condition = {
            type: 'goods',
            sourceId: {
                $in: goodsId
            },
            dateString: 'total'
        }*/
        /*redisCache.get(goodsId.join(','), function(err, map){
            if (err || !map){
                DailyRecord.find(condition, {sourceId: 1, 'ext.total': 1, 'ext.openIds': 1}, function(err, result){
                    if (err){
                        final(docs, saleResult, {})
                    } else {
                        var map = {}
                        _.each(result, function(o){
                            map[o.sourceId] = {
                                pv: o.ext.total,
                                uv: o.ext.openIds.length
                            }
                        })
                        final(docs, saleResult, map)
                        redisCache.set(goodsId.join(','), 10 * 60, map)
                    }
                });
            } else {
                final(docs, saleResult, map)
            }
        })*/
        //final(docs, saleResult, {})

    };

    var final = function(docs, saleResult, pvResult){
        _.each(docs, function(o){
            o.dateTime = moment(o.dateTime).format('YYYY-MM-DD HH:mm:ss');
            var dailyP = {
                pv: 0,
                uv: 0
            }
            if (pvResult[o._id.toString()]){
                dailyP.pv = pvResult[o._id.toString()].pv
                dailyP.uv = pvResult[o._id.toString()].uv
            }
            o.pv = dailyP.pv;
            o.uv = dailyP.uv;
            o.saleCount = saleResult[o._id];
            o.url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + o._id + '?wx_token=' + token);
        })

        var context = {
            pageIndex : pageIndex,
            pageCount: pageCount,
            pageSize:pageSize,
            totalSize:totalSize,
            data:docs
        };
        res.send(context);
    }
    findGoods()
}

exports.gotoAddGoods = function(req, res){
    res.render('add-goods', {token: req.token,unit:req.integralUnit})
}

exports.getGoodsCategory = function(req, res){
    res.send(mGoodsCategoryConfig)
}

function checkGoodsParam(req, cb){
    console.log(req.body)
    if (!req.body.name){
        return cb('没有商品名字')
    }
    if (!req.body.category){
        return cb('没有商品品类')
    }
    if (!req.body.pic){
        return cb('没有商品图片')
    }
    if ((req.body.count = ut.checkPositiveInt(req.body.count)) == null){
        return cb('没有商品库存数量')
    }

    req.body.ext.playType = parseInt(req.body.ext.playType, 10)
    if (req.body.ext.playType == mGoods.playType.lottery){
        if (!((req.body.price = ut.checkPositive0Float(req.body.price)) >= 0)){
            return cb('没有商品价格或者价格为0')
        }
    } else {
        req.body.price = ut.checkPositiveFloat(req.body.price)
        if ((req.body.type == mGoods.type.demand || req.body.type == mGoods.type.empty) && req.body.price == null){
            return cb('没有商品价格')
        }
        if ((req.body.type != mGoods.type.demand && req.body.type != mGoods.type.empty) && !req.body.price){
            return cb('没有商品价格或者价格为0')
        }
    }

    if ((req.body.type = ut.checkPositiveInt(req.body.type)) == null){
        return cb('没有选择商品类型')
    }

    if (!req.body.ext){
        return cb('没有商品详细信息')
    }
    if ((req.body.ext.state = ut.checkPositiveInt(req.body.ext.state)) == null){
        return cb('没有选择商品状态')
    }

    if (req.body.ext.playType != mGoods.playType.lottery){
        var share = req.body.ext.share;
        if (!share || !share.img_url || !share.desc || !share.title){
            return cb('share参数错误')
        }
    }

    if (req.body.playType != mGoods.playType.lottery){
        req.body.ext.followLimit = parseInt(req.body.ext.followLimit, 10)
        req.body.ext.redLimit = parseInt(req.body.ext.redLimit, 10)
        req.body.ext.hidePrice = parseInt(req.body.ext.hidePrice, 10)
        req.body.ext.pointLimit = parseInt(req.body.ext.pointLimit, 10)
        req.body.ext.redLimitPrice = parseFloat(req.body.ext.redLimitPrice)
        req.body.ext.limitCount = parseInt(req.body.ext.limitCount, 10)
    }
    req.body.ext.hideCount = parseInt(req.body.ext.hideCount, 10)

    if (req.body.type == mGoods.type.live){
        if (!req.body.ext.liveTime){
            return cb('没有商品直播开始时间')
        }
        req.body.ext.liveTime = new Date(req.body.ext.liveTime);
        if (!req.body.ext.twInfo){
            return cb('没有商品直播推送图文')
        }
        if (!req.body.ext.pushTime){
            return cb('没有商品直播推送时间')
        }
        req.body.ext.pushTime = new Date(req.body.ext.pushTime);
        if (!req.body.ext.buyText){
            return cb('没有商品购买成功推送文本')
        }
    } else if (req.body.type == mGoods.type.score){
        if ((req.body.score = ut.checkPositiveInt(req.body.score)) == null){
            return cb('输入积分格式错误')
        }
    } else if (req.body.type == mGoods.type.demand){
        if (!req.body.ext.videoRes || !req.body.ext.videoRes.shareId){
            return cb('没有视频资源')
        }
    } else if (req.body.type == mGoods.type.vip){
        if ((req.body.ext.expireDay = ut.checkPositiveInt(req.body.ext.expireDay)) == null){
            return cb('输入会员有效天数错误')
        }

        if (req.body.ext.vipType != 'demand' && req.body.ext.vipType != 'forums'){
            return cb('选择的会员类型不正确')
        }

        /*if (!req.body.ext.daySku || req.body.ext.daySku.length == 0){
            return cb('会员商品信息错误')
        }*/
    } else if (req.body.type == mGoods.type.other){
        if (!req.body.ext.extLink){
            return cb('外部链接必须填写')
        }
    } else if (req.body.type == mGoods.type.card){
        if ((req.body.ext.discount = ut.checkPositiveFloat(req.body.ext.discount)) == null){
            return cb('折扣格式不正确')
        }
        if (req.body.ext.discount > 1 || req.body.ext.discount < 0){
            return cb('折扣必须在0-1中间')
        }
        if (!req.body.ext.usedGoodsIds || req.body.ext.usedGoodsIds.length <= 0){
            return cb('请选择折扣商品')
        }
        if (!req.body.ext.cardEndTime || !req.body.ext.cardStartTime){
            return cb('请选择折扣券的有效开始和结束时间')
        }
        req.body.ext.cardEndTime = new Date(req.body.ext.cardEndTime)
        req.body.ext.cardStartTime = new Date(req.body.ext.cardStartTime)
    }

    if (req.body.ext.playType == mGoods.playType.exchange){
        if ((req.body.ext.score = ut.checkPositiveInt(req.body.ext.score)) == null){
            return cb('没有商品兑换积分数,或者格式不正确')
        }
    } else if (req.body.ext.playType == mGoods.playType.raise){
        if ((req.body.ext.totalMoney = ut.checkPositiveFloat(req.body.ext.totalMoney)) == null){
            return cb('商品众筹金额不对,或者格式不正确')
        }
        if ((req.body.ext.fakeCount = ut.checkPositiveInt(req.body.ext.fakeCount)) == null){
            return cb('商品伪支持者数不对,或者格式不正确')
        }
    }

    if (req.body.ext.startTime){
        req.body.ext.startTime = new Date(req.body.ext.startTime)
    }
    if (req.body.ext.endTime){
        req.body.ext.endTime = new Date(req.body.ext.endTime)
    }

    if (req.body.ext.validTime){
        req.body.ext.validTime = new Date(req.body.ext.validTime);
    }
    var doc = req.body;
    console.log(doc)
    cb(null, doc);
}

exports.addGoods = function(req, res){
    checkGoodsParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        if (doc.ext.playType == mGoods.playType.lottery){
            doc.use = mGoods.useType.lottery
        } else {
            doc.use = mGoods.useType.pay
        }
        doc.token = req.token
        new Goods(doc).save(function(err, doc){
            if (err){
                return res.send(500, err)
            } else{
                removeGoodsCache(req.token)
                return res.send(200)
            }
        })
    })
}

exports.gotoGoodsUpdate = function(req, res){
    res.render('add-goods', {token: req.token, goodsId: req.goods._id, unit: req.integralUnit})
}

exports.updateGoods = function(req, res){
    checkGoodsParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        Goods.findByIdAndUpdate(req.goods._id, {$set: doc}, function(err, o){
            if (err){
                return res.send(500, err)
            } else{
                removeGoodsCache(req.token)
                return res.send(200)
            }
        })
    })
}

exports.goodsInfo = function(req, res){
    var goods = exports.transGoods(req.goods)
    if (goods.type == mGoods.type.demandPackage && goods.ext.package.length > 0){
        Goods.find({_id: {$in: goods.ext.package}}, {name: 1}, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error');
            }
            var map = ut.arrToMap(docs, '_id')
            var result = []
            _.each(goods.ext.package, function(o){
                result.push(map[o])
            })
            goods.ext.package = result
            res.send(goods);
        })
    } else{
        res.send(goods);
    }
}

exports.transGoods = function(o){
    o.dateTime = moment(o.dateTime).format('YYYY-MM-DD HH:mm:ss')
    if (o.ext){
        if (o.ext.liveTime){
            o.ext.liveTime = moment(o.ext.liveTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (o.ext.validTime){
            o.ext.validTime = moment(o.ext.validTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (o.ext.startTime){
            o.ext.startTime = moment(o.ext.startTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (o.ext.endTime){
            o.ext.endTime = moment(o.ext.endTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (o.ext.pushTime){
            o.ext.pushTime = moment(o.ext.pushTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (_.isNaN(o.ext.redLimit)){
            o.ext.redLimit = 1
        }
    } else {
        o.ext = {}
    }
    if (!o.category){
        o.category = "99991000"
    }
    return o
}

exports.updateGoodsState = function(req, res){
    var state = req.param('state');
    if ((state = ut.checkPositiveInt(state)) == null){
        return res.send(400, '没有选择商品状态')
    }
    if (!_.contains(_.values(mGoods.state), state)){
        return res.send(400, '商品状态不存在')
    }
    var UPDATE_SPEC = {}
    UPDATE_SPEC.$set = {'ext.state': state}
    var ids = req.body.ids;
    if (!ids && !_.isArray(ids) && ids.length < 1){
        return res.send(400, '没有商品id')
    }
    var condition = {
        _id: {
            $in: ids
        }
    }
    Goods.update(condition, UPDATE_SPEC, {multi: true}, function(err){
        if (err){
            res.send(500, err);
        } else {
            removeGoodsCache(req.token)
            res.send(200);
        }
    })
}

exports.getRaiseGoodsProgress = function(req, res){
    var goods = req.goods
    if (goods.ext.playType != mGoods.playType.raise){
        return res.send({money: 0, totalMoney: goods.ext.totalMoney})
    }
    var condition = {
        token: req.token,
        prizeId: req.goods._id,
        dateTime: {
            $gt: req.goods.ext.startTime,
            $lt: req.goods.ext.endTime
        }
    }
    Lottery.find(condition, {openId: 1}, function(err, docs){
        if (err){
            return res.send({userNumber: 0, money: 0, totalMoney: goods.ext.totalMoney})
        } else {
            var openIds = _.pluck(docs, 'openId')
            openIds = _.uniq(openIds)
            var fakeCount = 0
            if (goods.ext.fakeCount >= 0){
                fakeCount = parseInt(goods.ext.fakeCount, 10)
            }
            return res.send({userNumber: openIds.length + fakeCount, money: Math.floor((docs.length + fakeCount) * goods.price * 1000) / 1000, totalMoney: goods.ext.totalMoney})
        }
    })
}

exports.exportGoods = function(req, res){
    var token = req.token
    var condition = {
        token: token,
        deleted: {$ne: true},
        use: mGoods.useType.pay
    }
    var findGoods = function(){
        console.log('findGoods')
        Goods.find(condition, {name: 1, count: 1}, {sort: {dateTime: -1}}, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error:' + err);
            }
            docs = ut.doc2Object(docs);
            findSaleCount(docs)
        })
    }

    var findSaleCount = function(docs){
        console.log('findSaleCount')
        mLottery.getSaleCount(token, _.pluck(docs, '_id'), function(result){
            findPv(docs, result)
        })
    }

    var findPv = function(docs, saleResult){
        var key = "count_pv_and_uv";
        var sourceIdList = _.pluck(docs, '_id');
        console.log("exportGoods get pv and uv sourceIdList: %j", sourceIdList);
        var totalFieldList = [];
        _.each(sourceIdList, function (val) {
            totalFieldList.push("goods_" + val + "_total")
        });
        console.log("exportGoods get pv and uv totalFieldList: %j", totalFieldList);
        dailyRecord.getPvAndUv(key, totalFieldList, function (err, datas) {
            if (!!err) {
                return final(docs, saleResult, {});
            }
            console.log("exportGoods get pv and uv datas: %j", datas);
            var map = {};
            for (var index in datas) {
                var data = JSON.parse(datas[index]);
                if (!data) {        //当不存在数据时
                    map[sourceIdList[index]] = {
                        pv: 0,
                        uv: 0
                    }
                }
                else {
                    map[sourceIdList[index]] = {
                        pv: +data.pv,
                        uv: +data.uv
                    }
                }
            }
            console.log("exportGoods get pv and uv map: %j", map);
            final(docs, saleResult, map);
        });
        /*console.log('findPv')
        var goodsId = _.pluck(docs, '_id');
        var condition = {
            type: 'goods',
            sourceId: {
                $in: goodsId
            },
            dateString: 'total'
        }
        DailyRecord.find(condition, function(err, result){
            if (err){
                final(docs, saleResult, {})
            } else {
                var map = {}
                _.each(result, function(o){
                    map[o.sourceId] = {
                        pv: o.ext.total,
                        uv: o.ext.openIds.length
                    }
                })
                final(docs, saleResult, map)
            }
        });*/
    };

    var final = function(docs, saleResult, pvResult){
        console.log('final')
        _.each(docs, function(o){
            var dailyP = {
                pv: 0,
                uv: 0
            }
            if (pvResult[o._id.toString()]){
                dailyP.pv = pvResult[o._id.toString()].pv
                dailyP.uv = pvResult[o._id.toString()].uv
            }
            o.pv = dailyP.pv;
            o.uv = dailyP.uv;
            o.saleCount = saleResult[o._id];
            delete o._id
        })
        goodsDownloadResponse(res, docs)
    }
    findGoods()
}

function goodsDownloadResponse(res, docs){
    var conf ={};
    conf.cols = [{
        caption:'商品名字',
        type:'string',
        width: 40
    },{
        caption:'库存',
        type:'string',
        width: 20
    },{
        caption:'pv/uv',
        type:'string',
        width: 25
    },{
        caption:'销量',
        type:'string',
        width: 20
    }];
    conf.rows = [];

    _.each(docs,function(o) {
        var row = []
        row.push(o.name.replace('\b', ''));
        row.push(o.count);
        row.push(o.pv + '/' + o.uv);
        row.push(o.saleCount);
        conf.rows.push(row);
    });

    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('商品导出统计列表') + '.xlsx');
    res.end(result, 'binary');
}

exports.loadGoodsGainInfo = function(req, res){
    var ids = req.body.ids
    redisCache.get(ids.join(',') + 'loadGoodsGainInfo', function(err, values){
        if (err || !values){
            Goods.find({_id: {$in: ids}}, {'ext.gainInfo': 1, 'ext.extLink': 1, 'ext.vipType': 1}, function(err, docs){
                if (err){
                    res.send(500)
                } else {
                    redisCache.set(ids.join(',') + 'loadGoodsGainInfo', 10 * 60, docs)
                    res.send(docs)
                }
            })
        } else {
            res.send(values)
        }
    })
}

exports.getWmhVideoRes = function(req, res){
    wmh.getWmhVideoResource(req.token, function(err, data){
        if (err){
            res.send(500)
        } else {
            res.send(data)
        }
    })
}

exports.getWmhVideoResJSON = function(req, res){
    var md5 = req.param('md5')
    wmh.getWmhVideoResourceJSON(md5, function(err, data){
        if (err){
            res.send(500)
        } else {
            res.send(data)
        }
    })
}

exports.listDemandVipGoods = function(req, res){
    Goods.find({token: req.token, 'ext.vipType': 'demand', deleted: {$ne: true}}, {_id: 1, name: 1}, function(err, docs){
        if (err){
            res.send(500)
        } else {
            res.send(docs)
        }
    })
}