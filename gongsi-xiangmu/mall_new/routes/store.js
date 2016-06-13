/**
 * Created by chenjie on 2014/11/18.
 */
var tools       = require('../tools');
var async       = require('async');
var _           = require('underscore');
var moment      = require('moment');

var typeConfig      = require('./typeConfig.js');
var ut = require('./utils');
var interface = require('../interface');
var mLottery = require('./lottery');
var config = require('../config');
var NODE_ENV = require('../env-config.js')
var tkConfig = require('../tokenConfig');
var mDailyRecord = require('./dailyRecord');

var dbUtils = require('../mongoSkin/mongoUtils.js')
var storeCollection = new dbUtils('stores')
var goodsCollection = new dbUtils('goods')
var mIntegral = require('../interface/integral.js');
var mUser = require('./user.js');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var dailyRecord = require("./dailyRecord.js");
var lotterieCollection = new dbUtils('lotteries');
var redpagerrecordsCollection = new dbUtils('redpagerrecords');

var redisClient = tools.redisClient();
var mgoods = require("./goods.js");
var payConfig = require('../etc/payConfig.js');
var mCoupon = require("./coupon.js");

exports.gotoExchangeSuccess = function(req, res){
    res.render('pmall-success', {prize: req.goods,unit:req.integralUnit})
}

exports.gotoPaySuccess = function(req, res){
    var count = req.param('count')
    if (count){
        count = parseInt(count, 10)
    } else {
        count = 1
    }
    var price = Math.floor(req.goods.price * count * 1000) / 1000
    if (req.session.vipSku && req.session.vipSku.price){
        price = Math.floor(req.session.vipSku.price * count * 1000) / 1000
    }
    res.render('pay-success', {prize: req.goods, count: count, price: price})
}

exports.gotoSubmitOrder = function(req, res){
    var options = {}
    var tvmMallOpenId = req.param('openid')
    if (!tvmMallOpenId && NODE_ENV == 'localhost'){
        tvmMallOpenId = 'oegC6uMoJgBnSGZEIPa9U1RdkhEM'
    }
    if (!tvmMallOpenId){
        return res.send(400, 'tvm mall openId not exists')
    }
    req.session.tvmMallOpenId = tvmMallOpenId;

    options.goods = req.goods;
    options.unit = req.integralUnit;
    options.user = req.user;
    res.render('submit-order', options)
}

exports.gotoExchange = function(req, res){
    var lotteryId = req.param('lotteryId')
    var options = {}
    if (lotteryId){
        options.lotteryId = lotteryId
    }
    if (req.goods.ext.playType == typeConfig.goods.play.exchange){
        req.goods.isExchange = true
    } else if (req.goods.ext.playType == typeConfig.goods.play.lottery){
        req.goods.isLottery = true
    }

    if (req.session.vipSku && req.session.vipSku.price > 0){
        req.goods.price = req.session.vipSku.price
    }

    options.goods = req.goods;
    options.unit = req.integralUnit;

    var rule = req.param('rule')
    try{
        rule = JSON.parse(rule)
    } catch(e){
        rule = {}
    }
    req.session.payExt = rule

    res.render('exchange', options)
}

exports.authGoods = function(req, res){
    var goodsId = req.param('id');
    var source = req.param('source');
    if (source){
        req.session[goodsId + '-source'] = source
    } else {
        req.session[goodsId + '-source'] = null
    }
    res.redirect('/pointMall/goods/detail?id=' + goodsId)
}

exports.gotoGoodsDetail = function(req, res){
    var goods = req.goods;
    if (goods.deleted){
        return res.send(404, '商品已经删除！')
    }

    var source = req.param('source');
    if (source){
        req.session[goods._id.toString() + '-source'] = source
    } else {
        req.session[goods._id.toString() + '-source'] = null
    }

    var options = {}
    if (req.goods.ext.playType == typeConfig.goods.play.exchange){
        req.goods.isExchange = true
    } else if (req.goods.ext.playType == typeConfig.goods.play.lottery){
        req.goods.isLottery = true
    }
    if (req.goods.ext.state != typeConfig.goods.state.up){
        req.goods.count = 0
    }

    if (req.goods.ext.liveTime){
        req.goods.ext.liveTime = req.goods.ext.liveTime.getTime()
    }
    if (req.goods.ext.startTime){
        req.goods.ext.startTime = req.goods.ext.startTime.getTime()
    }
    if (req.goods.ext.endTime){
        req.goods.ext.endTime = req.goods.ext.endTime.getTime()
    }
    if (!req.goods.ext.store || !req.goods.ext.store.id){
        delete req.goods.ext.store
    }

    if (req.goods.type == typeConfig.goods.type.vip && req.goods.ext.daySku && req.goods.ext.daySku.length > 0){
        req.goods.daySku = JSON.stringify(req.goods.ext.daySku)
    }

    options.prize = req.goods;
    options.unit = req.integralUnit;
    options.sysTime = new Date().getTime();

    if (options.prize.ext.rule){
        options.prize.ext.rule = JSON.stringify(options.prize.ext.rule)
    }
    mDailyRecord.saveRecord('goods', req.goods._id.toString(), req.openId)

    var lotteryId = req.param('lotteryId')
    if (lotteryId){
        options.lotteryId = lotteryId
    }
    options.unFollowed = req.unFollowed
    options.followUrl = req.followUrl

    if (goods.type == typeConfig.goods.type.demandPackage || goods.type == typeConfig.goods.type.demand){
        var user = req.user
        var isVip = ''
        if (user && user.vip && user.vip.demand && user.vip.demand.endDate){
            if (user.vip.demand.endDate.getTime() > new Date().getTime()){
                isVip = 'isVip'
            }
        }
        options.goods = goods
        options.isVip = isVip
        res.render('video-player-info', options)
    } else {
        options.unablePay = req.unablePay
        res.render('pmall-detail', options);
    }
}

exports.goodsOrder = function(req, res){
    var mallDomain = 'http://mb.mtq.tvm.cn'
    var goods = req.goods;
    var token = req.token;
    var url = ''
    var redirect_url = 'http://' + req.host + '/pointMall/goods/wxpay?showwxpaytitle=1&id=' + goods._id
    url = mallDomain + "/oauth?wx_token=" + config.tvmMallToken + "&token=7fda67277f&state=123456&opid=1&redirecturl=" + encodeURIComponent(redirect_url);
    if (req.third){
        url += '&third=1';
    }
    var rule = req.param('rule')
    try{
        rule = JSON.parse(rule)
    } catch(e){
        rule = {}
    }
    var vipSku = req.param('vipSku')
    try{
        vipSku = JSON.parse(vipSku)
        vipSku.day = parseInt(vipSku.day, 10)
        vipSku.price = parseFloat(vipSku.price)
    } catch(e){
        vipSku = null
    }

    if (vipSku && vipSku.day && vipSku.price){
        req.session.vipSku = vipSku
    } else {
        req.session.vipSku = null
    }

    req.session.payExt = rule
    if (_.contains(payConfig.payToken, token)){
        res.redirect(redirect_url + '&openid=' + req.openId)
    } else {
        res.redirect(url)
    }
}

exports.authStore = function(req, res){
    var store = req.store;
    res.redirect('/pointMall/inter/store/' + store._id)
}

exports.gotoStore = function(req, res){
    var store = req.store;
    if (store.deleted){
        return res.send(404, '商店已经删除！')
    }

    var goodsIds = [];
    _.each(store.prizes, function(o){
        if (!/^fake/.test(o.id)){
            goodsIds.push(o.id)
        }
    })
    goodsCollection.find({_id: {$in: goodsIds}}, function(err, docs){
        if (err){
            res.send(500, err);
        } else{
            mgoods.getShoppingCardStock(docs, function(){
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(store.prizes, function(o){
                    o = _.extend(o, prizeMap[o.id])
                    if (!o.local){
                        if (o.ext.playType == typeConfig.goods.play.exchange){
                            o.isExchange = true
                        }
                        if (o.ext.state != typeConfig.goods.state.up){
                            o.count = 0
                        } else if (o.ext.startTime && o.ext.endTime){
                            var now = new Date().getTime()
                            if (now < o.ext.startTime.getTime() || now > o.ext.endTime.getTime()){
                                o.count = 0
                            }
                        }
                    }
                })

                var view = 'pmall';
                if (store.m == 2){
                    view = 'pmall-m2';
                }
                console.log(store)
                mDailyRecord.saveRecord('store', store._id.toString(), req.openId)
                return res.render(view, {store: store, unit:req.integralUnit})
            })
        }
    });
}

exports.selectStoreList = function(req, res){
    storeCollection.find({token: req.token, deleted: {$ne: true}}, {name: 1}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, err)
        } else {
            res.send(docs);
        }
    })
}

exports.gotoStoreList = function(req, res){
    if (!req.token){
        return res.send(500, '商家没有店铺权限')
    }
    res.render('store-list');
}

exports.storeList = function(req, res){
    var token = req.token;

    var findStore = function(){
        storeCollection.find({token: token, deleted: {$ne: true}}, {name: 1, dateTime: 1, m: 1}, {sort: {dateTime: -1}}, function(err, docs){
            if (err){
                return res.send(500, err)
            } else {
                findPv(docs)
            }
        })
    }

    var findPv = function(docs){
        var key = "count_pv_and_uv";
        var sourceIdList = _.pluck(docs, '_id');
        logger.info("storeList get pv and uv sourceIdList: %j", sourceIdList);
        var totalFieldList = [];
        _.each(sourceIdList, function (val) {
            totalFieldList.push("store_" + val.toString() + "_total")
        });
        logger.info("storeList get pv and uv totalFieldList: %j", totalFieldList);
        dailyRecord.getPvAndUv(key, totalFieldList, function (err, datas) {
            if (!!err) {
                return final(docs, {});
            }
            logger.info("storeList get pv and uv datas: %j", datas);
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
            logger.info("storeList get pv and uv map: %j", map);
            final(docs, map);
        });
        /*var ids = _.pluck(docs, '_id');
        var condition = {
            type: 'store',
            sourceId: {
                $in: dbUtils.id2Str(ids)
            },
            dateString: 'total'
        }
        dailyrecordsCollection.find(condition, function(err, result){
            if (err){
                final(docs, {})
            } else {
                var map = {}
                _.each(result, function(o){
                    map[o.sourceId] = {
                        pv: o.ext.total,
                        uv: o.ext.openIds.length
                    }
                })
                final(docs, map)
            }
        });*/
    };

    var final = function(docs, pvResult){
        _.each(docs, function(o){
            o.url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/enter/store/' + o._id + '?wx_token=' + token);
            o.dateTime = new moment(o.dateTime).format('YYYY-MM-DD');

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
        })
        res.send(docs);
    }
    findStore();
}

exports.gotoAddStore = function(req, res){
    var m = req.param('m');
    if (m != '1' && m != '2'){
        return res.send(400, '不支持这种模板')
    }
    var options = {
        m: m,
        unit:req.integralUnit
    }
    res.render('add-store', options)
}

exports.gotoUpdateStore = function(req, res){
    var storeId = req.param('id');
    var options = {
        m: req.store.m,
        storeId: storeId
    }
    res.render('add-store', options)
}

exports.getStore = function(req, res){
    var token = req.token;
    var store = req.store;

    var findGoods = function(){
        var goodsIds = []
        _.each(store.prizes, function(o){
            if (!/^fake/.test(o.id)){
                goodsIds.push(o.id)
            }
        })
        goodsCollection.find({_id: {$in: goodsIds}}, function(err, docs){
            if (err){
                console.log('err:' + err)
                res.send(500, err);
            } else{
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(store.prizes, function(o){
                    o = _.extend(o, prizeMap[o.id])
                })

                return res.send(store)
            }
        });
    }

    findGoods();
}

function checkStoreParam(req, cb){
    var token = req.token;
    var name = req.param('name');
    if (!name){
        return cb('name参数不存在')
    }

    var bgColor = req.param('bgColor');
    if (!bgColor){
        return cb('bgColor参数不存在')
    }

    var share = req.body.share;
/*    if (!share || !share.img_url || !share.desc || !share.title){
        return cb('share参数错误')
    }
*/
    var m = req.param('m');
    if (!m){
        return cb('m参数不存在')
    }

    m = parseInt(m, 10);
    if (m != 1 && m != 2){
        return cb('m参数错误')
    }

    var way = req.param('way');
    if (!way){
        return cb('way参数不存在')
    }

    way = parseInt(way, 10);
    if (way != 1 && way != 2){
        return cb('way参数错误')
    }

    var prizes = req.body.prizes;
    if (!prizes){
        return cb('prizes参数为空')
    }
    if (prizes.length <= 0){
        return cb('没有奖品')
    }

    var doc = {
        token: token,
        name: name,
        way: way,
        m: m,
        bgColor: bgColor,
        prizes: prizes
    };
    if (share) {
        doc = _.extend(doc, {share: share});
    }
    cb(null, doc)
}

exports.addStore = function(req, res){
    checkStoreParam(req, function(err, doc){
        if (err){
            return res.send(400, err);
        }
        doc.dateTime = new Date()
        storeCollection.save(doc, function(err){
            if (err){
                return res.send(500, err)
            } else {
                return res.send(200)
            }
        })
    })
}

exports.updateStore = function(req, res){
    var id = req.param('id');
    if (!id){
        return res.send(400, 'id参数不存在')
    }
    checkStoreParam(req, function(err, doc) {
        if (err) {
            return res.send(400, err);
        }
        storeCollection.updateById(id, {$set: doc}, function (err) {
            if (err) {
                return res.send(500, err)
            } else {
                return res.send(200)
            }
        })
    });
}

exports.updateGoodsCount = function(goodsId, inc, shoppingCard){
    var UPDATE_SPEC = {
        $inc : {
            'count' : inc
        }
    }
    if (shoppingCard){
        UPDATE_SPEC.$pull = {
            'ext.shoppingCards': shoppingCard
        }
    }

    goodsCollection.updateById(goodsId, UPDATE_SPEC, function(err, o){
        if (err){
            console.log('updateGoodsCount err:' + err)
        } else {
            console.log(o);
        }
    })
};

exports.midStoreLoader = function(req, res, next) {
    var id = req.param('id');
    if (!id) {
        return res.send(404);
    }
    storeCollection.findById(id, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        } else if (!doc) {
            return res.send(404, 'store is not exist');
        }
        if (req.token != doc.token){
            return res.send(404, '该公共号下没有这个商店');
        } else {
            req.store = doc;
            next()
        }
    })
}

exports.getInter = function(req, res, next){
    mIntegral.getIntegral(req.token, req.openId, function(err, integ){
        if (err){
            req.user.integral = 0
            return next()
        } else {
            req.user.integral = parseInt(integ, 10)
            next();
        }
    })
}

exports.checkExchangeUserIntegral = function(req, res, next){
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId参数不存在');
    }
    var user = req.user
    if (!user){
        return res.send(500, '用户不存在');
    } else {
        mIntegral.getIntegral(req.token, req.openId, function(err, integ){
            if (err){
                return res.send({status: -1});
            } else {
                integ = parseInt(integ, 10)
                var score = req.goods.ext.score;
                if (integ < score){
                    return res.send({status: -1})
                }
                next();
            }
        })
    }
}

exports.checkUserIntegral = function(req, res, next){
    var pointLimit = req.body.pointLimit
    if (pointLimit && ((pointLimit = ut.checkPositiveInt(pointLimit)) == null || pointLimit < 0)){
        return res.send(400, 'pointLimit error, ' + pointLimit)
    }

    if (pointLimit == 0){
        return next()
    }

    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId参数不存在');
    }
    var user = req.user
    if (!user){
        return res.send(500, '用户不存在');
    } else {
        mIntegral.getIntegral(req.token, req.openId, function(err, integ){
            if (err){
                return res.send({status: -1});
            } else {
                integ = parseInt(integ, 10)
                if (pointLimit > integ){
                    return res.send(400, 'pointLimit lt limit error')
                }
                next()
            }
        })
    }
}

exports.doExchange = function(req, res){
    var openId = req.session.openId;
    var goods = req.goods
    var rule = req.session.payExt?req.session.payExt:{}

    var addressId = req.body.addressId
    var mobile = req.body.mobile
    var name = req.body.name

    if (goods.type == typeConfig.goods.type.goods){
        if (!addressId){
            return res.send(400, '没有填写地址')
        }
    } else if(goods.type == typeConfig.goods.type.salon){
        if (!orderInfo || !orderInfo.name || !orderInfo.mobile || !orderInfo.title || !orderInfo.company){
            return res.send(400, '没有填写沙龙信息')
        }
    } else if (!mobile){
        return res.send(400, '没有填写手机号')
    }

    if (goods.ext.playType != typeConfig.goods.play.exchange){
        return res.send({status: -2})
    }

    if (goods.deleted){
        return res.send(404, '商店已经删除！')
    }

    if (goods.ext.state != typeConfig.goods.state.up){
        return res.send({status: -2})
    }

    if (goods.ext.startTime && goods.ext.endTime){
        var now = new Date().getTime()
        if (now < goods.ext.startTime.getTime() || now > goods.ext.endTime.getTime()){
            return res.send({status: -2})
        }
    }

    var deal = function(score, prize, shoppingCard, jump_url){
        if (score != 0){
            mIntegral.changeIntegral(req.token, openId, -score, '积分兑换' + prize.name)
        }

        var obj = {
            token: req.token,
            openId: openId,
            prizeId: prize._id.toString(),
            score: score,
            prizeType: prize.type,
            prizeName: prize.name,
            prizePic: prize.pic,
            from: 3,
            ext: rule,
            tvmId: prize.tvmId
        }
        if (prize.type == typeConfig.goods.type.goods){
            obj.addressId = addressId
            if (mobile){
                obj.mobile = mobile
            }
        } else if (prize.type == typeConfig.goods.type.redPager){
            var redDoc = {
                token: req.token,
                openId: openId,
                redPagerId: prize._id.toString(),
                goodsType: prize.type,
                state: 0
            }
            console.log(prize)
            if (prize.ext && prize.ext.cardEndTime && prize.ext.cardStartTime){
                redDoc.endTime = prize.ext.cardEndTime
                redDoc.cardStartTime = prize.ext.cardStartTime
                redDoc.price = +prize.price
            }
            redDoc.dateTime = new Date();
            redpagerrecordsCollection.save(redDoc, function(err){
                if (err){
                    console.log('saveRedPagerRecord', err)
                }
            });
        } else {
            obj.mobile = mobile
            if (name){
                obj.name = name
            }
            if (mobile){
                var UPDATE_USER_SPEC = {
                    $set: {mobile: mobile}
                }
                if (name){
                    UPDATE_USER_SPEC.$set.name = name;
                }
                mUser.updateUser(req.token + '_' + req.openId, UPDATE_USER_SPEC, function(err, o){})
            }
            if (prize.type == typeConfig.goods.type.score && prize.score > 0){
                mIntegral.changeIntegral(req.token, openId, prize.score, '积分兑换')
            }
        }
        if (shoppingCard){
            obj.shoppingCard = shoppingCard;
            obj.state = 'Delivered'
        }
        if (jump_url){
            obj.jump_url = jump_url;
            obj.state = 'Delivered'
        }
        if (prize.type != typeConfig.goods.type.goods && prize.type != typeConfig.goods.type.chargeCard){
            obj.state = 'Delivered'
        }
        obj.state = obj.state || 'unDelivery';
        obj.trade_state = obj.trade_state || 'complete';
        obj.count = obj.count || 1;
        obj.dateTime = new Date();
        dailyRecord.setTotalSalesVolume(obj.prizeId, obj.count, function (err, results) {});
        lotterieCollection.save(obj, function(err, doc) {
            if(err) {
                console.log('添加获奖日志出错');
                res.send(500, err)
            } else {
                res.send(200)
                if (prize.type == typeConfig.goods.type.live){
                    mLottery.sendLiveBuyText(doc)
                }
            }
        });
        if (!shoppingCard) {
            mgoods.changeStockCount(goods._id.toString(), -1, function (err, results) {});
        }
        var url = config.userHost + "/point/userGroup/add";
        var param = {
            wxToken: goods.token,
            openId: openId,
            activity: '兑换',
            title: prize.name,
            result: ""
        };
        mIntegral.reportBehaviors(url, param, function(err, results) {
            if (!!err) {
                redisClient.lpush("reportBehaviorsbackup", JSON.stringify(param));
                console.log("**** reportBehaviors err: %j", err);
            }
        });

        if (goods.type == typeConfig.goods.type.vip){
            mUser.updateUserToVip(goods.token, openId, goods.ext.expireDay, goods.ext.vipType, goods._id.toString(), 1)
        }
    };

    if (goods.type == typeConfig.goods.type.shoppingCard) {
        mgoods.getStockShopCard(goods._id.toString(), function (err, shopCard) {
            if (!!err) {
                console.error('***获取消费码出错 err: %j', err);
                return res.send(500, err);
            }
            if (!shopCard) {
                return res.send({status: -2});
            }
            deal(req.goods.ext.score, req.goods, shopCard);
        });

    } else if (goods.type == typeConfig.goods.type.coupon){
        if (!goods.ext.coupon){
            return res.send({status: -2});
        }
        mCoupon.loadCoupon(goods.ext.coupon.id, function(err, coupon){
            if (err){
                return res.send({status: -2});
            } else {
                mCoupon.checkSendCouponToUser(req.user, coupon, function(err){
                    if (err){
                        return res.send({status: -2});
                    } else {
                        deal(req.goods.ext.score, req.goods, null, coupon.jump_url);
                    }
                })
            }
        })
    } else {
        if (goods.count <= 0) {
            return res.send({status: -2});
        }
        deal(req.goods.ext.score, req.goods);
    }
}

function getNonceStr(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var random = "";
    random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    random += new Date().getTime() - new Date(2014, 7, 1);
    random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    return random;
}

exports.delStore = function(req, res){
    var id = req.param('id')
    storeCollection.updateById(id, {$set: {deleted: true}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            res.send(200)
        }
    })
}