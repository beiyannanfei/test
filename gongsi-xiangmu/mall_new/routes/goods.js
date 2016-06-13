/**
 * Created by Administrator on 2014/7/31.
 */
var typeConfig = require('./typeConfig.js');
var mLottery = require('./lottery');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');
var mGoodsCategoryConfig = require('../data/goodsCategory');
var config = require('../config');
var tkConfig = require('../tokenConfig');
var nodeExcel     = require('excel-export');
var dbUtils = require('../mongoSkin/mongoUtils.js')
var goodsCollection = new dbUtils('goods')
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var tools       = require('../tools');
var dailyRecord = require("./dailyRecord.js");
var lotterieCollection = new dbUtils('lotteries');
var mShoppingCard = require('./shoppingCard.js');

exports.getGoods = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.lottery, type: {$ne: typeConfig.goods.type.cashRedPager}}
    ut.groupGoodsCondition(condition, req.token, req.tvmId)
    goodsCollection.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        res.send(docs);
    })
}

exports.listLotteryGoods = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.lottery, type: {$ne: typeConfig.goods.type.cashRedPager}}
    ut.groupGoodsCondition(condition, req.token, req.tvmId)
    goodsCollection.find(condition, {price: 0}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        res.send(docs)
    })
}

exports.listBuyGoods = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.pay, 'ext.state': 1}
    ut.groupGoodsCondition(condition, req.token, req.tvmId)
    goodsCollection.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        res.send(docs)
    })
}

exports.listRedPager = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.lottery, type: {$in: [typeConfig.goods.type.shoppingCard, typeConfig.goods.type.score, typeConfig.goods.type.redPager, typeConfig.goods.type.cashRedPager]}}
    ut.groupGoodsCondition(condition, req.token, req.tvmId)
    goodsCollection.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        res.send(docs)
    })
}

exports.listVideoGoods = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.pay, type: typeConfig.goods.type.demand}
    ut.groupGoodsCondition(condition, req.token, req.tvmId)
    goodsCollection.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        res.send(docs);
    })
}

exports.gotoPrize = function(req, res){
    var condition = {deleted: {$ne: true}, use: typeConfig.goods.use.lottery};
    ut.groupCondition(condition, req.token, req.tvmId)

    goodsCollection.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        var shopCardIds = [];
        _.each(docs, function (doc) {
            if (doc.type == typeConfig.goods.type.shoppingCard) {
                shopCardIds.push(doc._id.toString());
            }
        });
        if (shopCardIds.length > 0) {
            mShoppingCard.getCountShoppingCards(shopCardIds, function (err, map) {
                _.each(docs, function (doc) {
                    if (!_.isUndefined(map[doc._id.toString()])) {
                        doc.count = map[doc._id.toString()];
                    }
                });
                res.render('prizes', {goods: docs})
            });
        }
        else {
            res.render('prizes', {goods: docs})
        }
    })
}

exports.midGoodsLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        goodsCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'goods is not exist');
            }
            if (doc.type == typeConfig.goods.type.shoppingCard) {
                mShoppingCard.getShoppingCardLen(doc._id.toString(), function (err, count) {
                    if (!!err) {
                        count = 0;
                    }
                    doc.count = count;
                    req.goods = doc;
                    next()
                })
            }
            else {
                req.goods = doc;
                next()
            }
        })
    }
}

exports.delGoods = function (req, res) {
    var id = req.param('id');
    var doc = req.goods;
    goodsCollection.updateById(id, {$set: {deleted: true}}, function (err) {
        if (err) {
            res.send(500, err);
        }
        //mShoppingCard.delGoodsReidis(doc.type, id);
        res.send(200);
    })
};

exports.removeDemandVipGoodsId = function(goodsId){
    goodsCollection.update({type: typeConfig.goods.type.demandPackage, 'ext.vipGoodsId': goodsId}, {$unset: {'ext.vipGoodsId': 1}}, {multi: true}, function(err){

    })
}

exports.gotoGoods = function(req, res){
    res.render('list-goods', {token: req.token})
}

exports.listGoods = function(req, res){
    var condition = {
        deleted: {$ne: true},
        use: typeConfig.goods.use.pay
    }
    console.log(req.token)

    condition = ut.groupGoodsCondition(condition, req.token, req.tvmId)
    console.log(condition)
    var state           = req.param('state');
    var keywordName     = req.param('keywordName');

    if (state == '1'){
        condition['ext.state'] = 1
    } else if (state == '2'){
        condition['ext.state'] = 2
    } else if (state == '3'){
        condition['ext.state'] = 3
    } else if (state == '10'){
        condition['ext.state'] = 10
    }

    if (keywordName && keywordName.length > 0)
        condition['name'] = new RegExp(keywordName, 'i');

    var pageSize    = 15;
    var pageIndex   = req.query.pageIndex && !isNaN(parseInt(req.query.pageIndex))
                    ? parseInt(req.query.pageIndex) : 1;
    var totalSize   = 0;
    var pageCount   = 0;


    var findGoods = function(){
        goodsCollection.count(condition, function(err, count) {
            totalSize = count;
            pageCount = Math.ceil(totalSize / pageSize);

            var start   = (pageIndex - 1) * pageSize;
            var end     = start + pageSize - 1;

            goodsCollection.find(condition, {'ext.shoppingCards': 0}, {sort: {dateTime: -1}, skip: start, limit: pageSize}, function (err, docs) {
                if (err) {
                    return res.send(500, 'mongodb error:' + err);
                }
                var shopCardIds = [];
                _.each(docs, function (doc) {
                    if (doc.type == typeConfig.goods.type.shoppingCard) {
                        shopCardIds.push(doc._id.toString());
                    }
                });
                if (shopCardIds.length > 0) {
                    mShoppingCard.getCountShoppingCards(shopCardIds, function (err, map) {
                        _.each(docs, function (doc) {
                            if (!_.isUndefined(map[doc._id.toString()])) {
                                doc.count = map[doc._id.toString()];
                            }
                        });
                        findSaleCount(docs);
                    });
                }
                else {
                    findSaleCount(docs);
                }
            })
        })
    }

    var findSaleCount = function(docs){
        mLottery.getSaleCount(_.pluck(docs, '_id'), function(result){
            findPv(docs, result)
        })
    }

    var findPv = function(docs, saleResult){
        var key = "count_pv_and_uv";
        var sourceIdList = _.pluck(docs, '_id');
        logger.info("listGoods get pv and uv sourceIdList: %j", sourceIdList);
        var totalFieldList = [];
        _.each(sourceIdList, function (val) {
            totalFieldList.push("goods_" + val + "_total")
        });
        logger.info("listGoods get pv and uv totalFieldList: %j", totalFieldList);
        dailyRecord.getPvAndUv(key, totalFieldList, function (err, datas) {
            if (!!err) {
                return final(docs, saleResult, {});
            }
            logger.info("listGoods get pv and uv datas: %j", datas);
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
            logger.info("listGoods get pv and uv map: %j", map);
            final(docs, saleResult, map);
        });

        /*var goodsId = _.pluck(docs, '_id');
        var condition = {
            type: 'goods',
            sourceId: {
                $in: goodsId
            },
            dateString: 'total'
        };
        dailyrecordsCollection.find(condition, function(err, result){
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
            o.saleCount = saleResult[o._id.toString()];
            if (req.token){
                var token = req.token
                o.url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + o._id + '?wx_token=' + token);
            }
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
    if (req.body.ext.playType == typeConfig.goods.play.lottery){
        if (!((req.body.price = ut.checkPositive0Float(req.body.price)) >= 0)){
            return cb('没有商品价格或者价格为0')
        }
    } else {
        req.body.price = ut.checkPositiveFloat(req.body.price)
        if ((req.body.type == typeConfig.goods.type.demand || req.body.type == typeConfig.goods.type.empty) && req.body.price == null){
            return cb('没有商品价格')
        }
        if ((req.body.type != typeConfig.goods.type.demand && req.body.type != typeConfig.goods.type.empty) && !req.body.price){
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

    /*if (req.body.ext.playType != typeConfig.goods.play.lottery){
        var share = req.body.ext.share;
        if (!share || !share.img_url || !share.desc || !share.title){
            return cb('share参数错误')
        }
    }*/

    if (req.body.playType != typeConfig.goods.play.lottery){
        req.body.ext.followLimit = parseInt(req.body.ext.followLimit, 10)
        req.body.ext.redLimit = parseInt(req.body.ext.redLimit, 10)
        req.body.ext.hidePrice = parseInt(req.body.ext.hidePrice, 10)
        req.body.ext.pointLimit = parseInt(req.body.ext.pointLimit, 10)
        req.body.ext.redLimitPrice = parseFloat(req.body.ext.redLimitPrice)
        req.body.ext.limitCount = parseInt(req.body.ext.limitCount, 10)
    }
    req.body.ext.hideCount = parseInt(req.body.ext.hideCount, 10)

    if (req.body.type == typeConfig.goods.type.live){
        if (!req.body.ext.liveTime){
            return cb('没有商品直播开始时间')
        }
        req.body.ext.liveTime = new Date(req.body.ext.liveTime);
        if (!req.body.ext.buyText){
            return cb('没有商品购买成功推送文本')
        }
    } else if (req.body.type == typeConfig.goods.type.score){
        if ((req.body.score = ut.checkPositiveInt(req.body.score)) == null){
            return cb('输入积分格式错误')
        }
    } else if (req.body.type == typeConfig.goods.type.demand){
        if (!req.body.ext.videoRes || !req.body.ext.videoRes.shareId){
            return cb('没有视频资源')
        }
    } else if (req.body.type == typeConfig.goods.type.vip){
        if ((req.body.ext.expireDay = ut.checkPositiveInt(req.body.ext.expireDay)) == null){
            return cb('输入会员有效天数错误')
        }

        if (req.body.ext.vipType != 'demand' && req.body.ext.vipType != 'forums'){
            return cb('选择的会员类型不正确')
        }
    } else if (req.body.type == typeConfig.goods.type.other){
        if (!req.body.ext.extLink){
            return cb('外部链接必须填写')
        }
    } else if (req.body.type == typeConfig.goods.type.redPager){
        if (!req.body.ext.cardEndTime || !req.body.ext.cardStartTime){
            return cb('请选择折扣券的有效开始和结束时间')
        }
        req.body.ext.cardEndTime = new Date(req.body.ext.cardEndTime)
        req.body.ext.cardStartTime = new Date(req.body.ext.cardStartTime)
    } else if (req.body.type == typeConfig.goods.type.card){
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

    if (req.body.ext.playType == typeConfig.goods.play.exchange){
        if ((req.body.ext.score = ut.checkPositiveInt(req.body.ext.score)) == null){
            return cb('没有商品兑换积分数,或者格式不正确')
        }
    } else if (req.body.ext.playType == typeConfig.goods.play.raise){
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

exports.addGoods = function (req, res) {
    checkGoodsParam(req, function (err, doc) {
        if (err) {
            return res.send(500, err);
        }
        if (doc.ext.playType == typeConfig.goods.play.lottery) {
            doc.use = typeConfig.goods.use.lottery;
        }
        else {
            doc.use = typeConfig.goods.use.pay;
        }
        ut.groupDoc(doc, req.token, req.tvmId);
        doc.dateTime = new Date();
        var count = doc.count || 0;
        var shoppingCards;
        if (doc.type == typeConfig.goods.type.shoppingCard) {
            shoppingCards = doc.ext ? (doc.ext.shoppingCards ? doc.ext.shoppingCards : []) : [];
            if (doc.ext) {
                delete doc.ext.shoppingCards;
            }
        }
        if (doc.type == typeConfig.goods.type.shoppingCard) {
            if (shoppingCards.length == 0) {
                doc.ext.state = 10;
            }
        }
        else if (count == 0) {
            doc.ext.state = 10;
        }
        goodsCollection.save(doc, function (err, data) {
            if (err) {
                return res.send(500, err);
            }
            if (doc.type == typeConfig.goods.type.shoppingCard && shoppingCards.length) {
                mShoppingCard.saveShoppingCard(data._id.toString(), shoppingCards, function (err, data) {
                });
            }
            if (doc.type != typeConfig.goods.type.shoppingCard) {
                mShoppingCard.saveCount(data._id.toString(), count, function (err, data) {});
            }
            return res.send(200);
        })
    })
};

exports.gotoGoodsUpdate = function(req, res){
    res.render('add-goods', {token: req.token, goodsId: req.goods._id.toString(), unit: req.integralUnit})
}

exports.updateGoods = function (req, res) {
    checkGoodsParam(req, function (err, doc) {
        if (err) {
            return res.send(500, err);
        }
        var count = doc.count || 0;
        var shoppingCards;

        if (doc.type == typeConfig.goods.type.shoppingCard) {
            shoppingCards = doc.ext ? (doc.ext.shoppingCards ? doc.ext.shoppingCards : []) : [];
            if (doc.ext) {
                delete doc.ext.shoppingCards;
            }
        }
        if (doc.type == typeConfig.goods.type.shoppingCard) {
            if (shoppingCards.length == 0) {
                doc.ext.state = 10;
            }
        }
        else if (count == 0) {
            doc.ext.state = 10;
        }
        goodsCollection.updateById(req.goods._id, {$set: doc}, function (err, o) {
            if (err) {
                return res.send(500, err);
            }
            if (doc.type == typeConfig.goods.type.shoppingCard && shoppingCards.length) {
                mShoppingCard.saveShoppingCard(req.goods._id.toString(), shoppingCards, function (err, data) {
                });
            }
            if (doc.type != typeConfig.goods.type.shoppingCard) {
                mShoppingCard.saveCount(req.goods._id.toString(), count, function (err, data) {
                });
            }
            return res.send(200);
        })
    })
};

exports.goodsInfo = function(req, res){
    var goods = exports.transGoods(req.goods)
    if (goods.type == typeConfig.goods.type.demandPackage && goods.ext.package.length > 0){
        var ids = goods.ext.package
        goodsCollection.find({_id: {$in: ids}}, {name: 1}, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error');
            }
            goods.ext.package = docs
            res.send(goods);
        })
    } else{
        if (goods.type == typeConfig.goods.type.shoppingCard) {
            mShoppingCard.getShoppingCards(goods._id.toString(), function (err, cardArr) {
                if (!!err) {
                    return res.send(500, '**** redis error: %j', err);
                }
                goods.ext.shoppingCards = cardArr;
                goods.count = cardArr.length;
                res.send(goods);
            });
        }
        else {
            res.send(goods);
        }
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
        if (o.ext.cardEndTime){
            o.ext.cardEndTime = moment(o.ext.cardEndTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (o.ext.cardStartTime){
            o.ext.cardStartTime = moment(o.ext.cardStartTime).format('YYYY/MM/DD HH:mm:ss')
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
    if (!_.contains(_.values(typeConfig.goods.state), state)){
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
    goodsCollection.update(condition, UPDATE_SPEC, {multi: true}, function(err){
        if (err){
            res.send(500, err);
        } else {
            res.send(200);
        }
    })
}

exports.getRaiseGoodsProgress = function(req, res){
    var goods = req.goods
    if (goods.ext.playType != typeConfig.goods.play.raise){
        return res.send({money: 0, totalMoney: goods.ext.totalMoney})
    }
    var condition = {
        prizeId: req.goods._id.toString(),
        dateTime: {
            $gt: req.goods.ext.startTime,
            $lt: req.goods.ext.endTime
        }
    }
    ut.groupCondition(condition, req.token, req.tvmId)
    lotterieCollection.find(condition, {openId: 1}, function(err, docs){
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
    var condition = {
        deleted: {$ne: true},
        use: typeConfig.goods.use.pay
    }
    ut.groupCondition(condition, req.token, req.tvmId)

    var findGoods = function(){
        console.log('findGoods')
        goodsCollection.find(condition, {name: 1, count: 1}, {sort: {dateTime: -1}}, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error:' + err);
            }
            findSaleCount(docs)
        })
    }

    var findSaleCount = function(docs){
        console.log('findSaleCount')
        mLottery.getSaleCount(_.pluck(docs, '_id'), function(result){
            findPv(docs, result)
        })
    }

    var findPv = function(docs, saleResult){
        var key = "count_pv_and_uv";
        var sourceIdList = _.pluck(docs, '_id');
        logger.info("exportGoods get pv and uv sourceIdList: %j", sourceIdList);
        var totalFieldList = [];
        _.each(sourceIdList, function (val) {
            totalFieldList.push("goods_" + val + "_total")
        });
        logger.info("exportGoods get pv and uv totalFieldList: %j", totalFieldList);
        dailyRecord.getPvAndUv(key, totalFieldList, function (err, datas) {
            if (!!err) {
                return final(docs, saleResult, {});
            }
            logger.info("exportGoods get pv and uv datas: %j", datas);
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
            logger.info("exportGoods get pv and uv map: %j", map);
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
        dailyrecordsCollection.find(condition, function(err, result){
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
            o.saleCount = saleResult[o._id.toString()];
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
    goodsCollection.find({_id: {$in: ids}}, {'ext.gainInfo': 1, 'ext.extLink': 1}, function(err, docs){
        if (err){
            res.send(500)
        } else {
            res.send(docs)
        }
    })
}

exports.getWmhVideoRes = function(req, res){
    res.send({})
}

exports.listDemandVipGoods = function(req, res){
    var condition = {'ext.vipType': 'demand', deleted: {$ne: true}}
    ut.groupCondition(condition, req.token, req.tvmId)

    goodsCollection.find(condition, {_id: 1, name: 1}, function(err, docs){
        if (err){
            res.send(500)
        } else {
            res.send(docs)
        }
    })
};

exports.changeStockCount = function (id, count, cb) {
    mShoppingCard.changeCount(id, count, function (err, v) {
        if (!err && v == 0) {   //当库存为0时修改数据库空中的商品状态为ext.state = 10
            goodsCollection.updateById(id, {$set: {"ext.state": 10}}, function (err, results) {
            });
        }
        if (!err && count > 0 && count == v) {
            goodsCollection.updateById(id, {$set: {"ext.state": 1}}, function (err, results) {
            });
        }
        cb(err, v);
    })
};

exports.getStockCount = function (id, cb) {
    mShoppingCard.getCount(id, function (err, v) {
        cb(null, v);
    })
};

exports.getStockShopCard = function (id, cb) {
    mShoppingCard.popShoppingCards(id, function (err, value) {
        if (!err) {
            mShoppingCard.getShoppingCardLen(id, function(err, cardLen) {
                if (!err && cardLen == 0) {
                    goodsCollection.updateById(id, {$set: {"ext.state": 10}}, function (err, results) {});
                }
            });
        }
        cb(err, value);
    });
};

exports.pushStockShopCard = function (id, shoppingCard, cb) {
    mShoppingCard.pushShoppingCard(id, shoppingCard, function (err, results) {
        if (!err && results == 1) {
            goodsCollection.updateById(id, {$set: {"ext.state": 1}}, function (err, results) {});
        }
        cb(err, results);
    });
};

exports.getShoppingCardStock = function(docs, cb){
    var shopCardIds = [];
    _.each(docs, function (doc) {
        if (doc.type == typeConfig.goods.type.shoppingCard) {
            shopCardIds.push(doc._id.toString());
        }
    });
    if (shopCardIds.length > 0) {
        mShoppingCard.getCountShoppingCards(shopCardIds, function (err, map) {
            _.each(docs, function (doc) {
                if (!_.isUndefined(map[doc._id.toString()])) {
                    doc.count = map[doc._id.toString()];
                }
            });
            cb(docs)
        });
    } else {
        cb(docs)
    }
}