var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var xml2js = require('xml2js');
var fs = require('fs');

var typeConfig = require('./typeConfig.js');

var mAddress = require('./address');
var ut = require('./utils');
var prizePool = require('./prizePool');
var interface = require('../interface');
var tkConfig = require('../tokenConfig');
var config = require('../config');
var tokenConfig = tkConfig.CONFIG
var wxPay = require('./wxPay');
var excel = require('./excel');
var mUser = require('./user');
var wxInfo = require('./../interface/wxInfo');
var mIntegral = require('../interface/integral.js');

var dbUtils = require('../mongoSkin/mongoUtils.js')
var goodsCollection = new dbUtils('goods')
var userCollection = new dbUtils('users')
var activitiesCollection = new dbUtils('activities')
var addressCollection = new dbUtils('addresses')
var lotteryeventsCollection = new dbUtils('lotteryevents');
var wxorderCollection = new dbUtils('wxorders');
var redpagerrecordCollection = new dbUtils('redpagerrecords');
var lotterieCollection = new dbUtils('lotteries');
var lotterieCollectionSlave = new dbUtils('lotteries', true);
var mMallCard = require('./mallCard');
var mgoods = require("./goods.js");
var tools = require('../tools');
var redisClient = tools.redisClient();
var dailyRecord = require("./dailyRecord.js");

exports.addLotteries = function(docs, cb){
    if (!_.isArray(docs)){
        docs = [docs];
    }

    async.eachSeries(docs, function(doc, callback){
        if (!doc.openId){
            return callback('no openId');
        }
        if (!doc.prizeId){
            return callback('no prizeId');
        }
        if (!doc.prizeType){
            return callback('no prizeType');
        }
        if (!doc.prizePic){
            return callback('no prizePic');
        }
        if (!doc.prizeName){
            return callback('no prizeName');
        }
        doc.state = doc.state || 'unDelivery';
        doc.trade_state = doc.trade_state || 'complete';
        doc.count = doc.count || 1;
        doc.dateTime = new Date();
        dailyRecord.setTotalSalesVolume(doc.prizeId, doc.count, function (err, results) {});
        lotterieCollection.save(doc, function(err){
            callback(err);
        })
    }, function(err){
        cb(err)
    })
}

exports.midLotteryLoader = function(req, res, next) {
    var id = req.param('id');
    if (!id) {
        return res.send(400);
    }
    lotterieCollection.findById(id, function (err, doc) {
        if (err) {
            return res.send(500, err);
        }
        if (!doc) {
            return res.send(500);
        }
        req.lottery = ut.doc2Object(doc);
        next();
    })
}
exports.gotoOrderDetail = function(req, res){
    res.render('order_detail', {orderId: req.lottery._id.toString()});
}

exports.orderDetail = function(req, res){
    var lottery = req.lottery
    var findAddress = function(){
        if (!lottery.addressId){
            return findPrice()
        }
        mAddress.findAddressById(lottery.addressId, function(err, address){
            if (err){
                return final(err)
            }
            if (address.addInfo){
                lottery.addInfo = _.values(address.addInfo).join(' ');
            } else {
                lottery.addInfo = '';
            }
            findPrice()
        });
    }

    var findUser = function(){
        var condition = {
            wxToken: req.token,
            openId: lottery.openId
        };
        userCollection.findOne(condition, function(err, user){
            if (err){
                return final(err)
            }
            lottery.userName = user.nickName;
            lottery.userIcon = user.headImg;
            findAddress()
        })
    }

    var findPrice = function(){
        if (!lottery.out_trade_no){
            return final()
        }
        wxorderCollection.findOne({out_trade_no: lottery.out_trade_no}, function(err, wxorder){
            if (err){
                return final(err)
            }
            lottery.price = wxorder.price
            lottery.score = wxorder.score
            lottery.redPagerRecordIds = wxorder.redPagerRecordIds
            if (wxorder.payResult){
                lottery.total_fee = wxorder.payResult.total_fee / 100
            } else {
                lottery.total_fee = 0
            }
            findRedPager()
        })
    }

    var findRedPager = function(){
        if (!lottery.redPagerRecordIds){
            return final()
        }
        var condition = {
            _id: {$in: lottery.redPagerRecordIds}
        }
        redpagerrecordCollection.find(condition, {price: 1,redPagerId: 1}, function(err, docs){
            if (err){
                return final(err)
            } else {
                goodsCollection.find({_id: {$in: _.uniq(_.pluck(docs, 'redPagerId'))}}, {name: 1, price: 1}, function(err, os){
                    var priceMap = {}
                    _.each(docs, function(d){
                        _.each(os, function(o){
                            if (o._id.toString() == d.redPagerId){
                                priceMap[d._id.toString()] = o.price;
                            }
                        })
                    })
                    lottery.redPrice = 0
                    _.each(lottery.redPagerRecordIds, function(redId){
                        lottery.redPrice += priceMap[redId]
                    })
                    return final()
                });
            }
        })
    }

    var final = function(err){
        if (err){
            res.send(500, err)
        } else {
            lottery.dateTime = moment(lottery.dateTime).format('YYYY/MM/DD HH:mm')
            lottery.stateText = getTipByState(lottery.state, lottery.prizeType)
            res.send(lottery)
        }
    }
    findUser()
}

exports.gotoOrderList = function(req, res){
    var token = req.token;
    var orderUrl = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/me/order/list?wx_token=' + token);
    res.render('order-list', {orderUrl: orderUrl});
}

exports.findOrders = function(condition,_token, options, forLottery, callback){
    console.log(JSON.stringify(condition))
    var findLottery = function(){
        console.time('find order')
        lotterieCollectionSlave.find(condition, {}, options, function(err, docs){
            console.timeEnd('find order')
            if (err){
                return callback(err)
            }
            if (docs && docs.length > 0){
                var data = ut.doc2Object(docs);
                findAddress(data)
            } else{
                final([])
            }
        });
    }

    var findAddress = function(data){
        if (forLottery){
            return findWinners(data)
        }
        var ids = [];
        _.each(data, function(o){
            if (o.addressId){
                ids.push(o.addressId);
            }
        })
        if (ids.length == 0){
            return findWinners(data)
        }

        mAddress.getAddressByIds(ids, function(err, adds){
            if (err){
                return callback(err)
            }
            if (!adds || adds.length == 0){
                console.log('address id error')
                return findWinners(data)
            }

            var adds = ut.doc2Object(adds);
            var addressMap = {}
            _.each(adds, function(add){
                addressMap[add._id.toString()] = add;
            })
            _.each(data, function(o){
                if (o.addressId){
                    if (addressMap[o.addressId]){
                        o.addInfo = _.values(addressMap[o.addressId].addInfo).join(' ');
                    } else {
                        o.addInfo = '';
                    }
                }
            })
            return findWinners(data)
        });
    }

    var findWinners = function(data){
        var ids = _.pluck(data, 'openId');
        ids = _.uniq(ids);
        var condition = {
            openId: {$in: ids}
        };
        userCollection.find(condition, function(err, friends){
            if (err){
                return callback(err)
            }
            if (!friends || friends.length == 0){
                return final([])
            }
            var friendMap = {}
            _.each(friends, function(friend){
                friendMap[friend.openId] = friend;
            })
            _.each(data, function(winner){
                if (friendMap[winner.openId]){
                    winner.userName = friendMap[winner.openId].nickName;
                    winner.userIcon = friendMap[winner.openId].headImg;
                    winner.dateTime = moment(winner.dateTime).format('YYYY/MM/DD HH:mm')
                } else {
                    console.log('user not found:' + winner.openId)
                    winner.userName = '';
                    winner.userIcon = '';
                    winner.dateTime = moment(winner.dateTime).format('YYYY/MM/DD HH:mm')
                }
            })
            if (forLottery){
                final(data);
            } else {
                findActivity(data)
            }
        })
    }

    var findActivity = function(data){
        var activityIds = []
        _.each(data, function(o){
            if (o.from == 1){
                activityIds.push(o.activityId)
            }
        })
        if (activityIds.length == 0){
            return findSystemLottery(data)
        }
        activitiesCollection.find({_id: {$in: activityIds}}, {name: 1, way: 1}, function(err, docs){
            if (err){
                return callback(err)
            } else {
                var map = {}
                _.each(docs, function(m){
                    map[m._id.toString()] = m;
                })
                _.each(data, function(winner){
                    if (winner.from == 1){
                        winner.activity = map[winner.activityId];
                    }
                })
                findSystemLottery(data)
            }
        })
    }

    var findSystemLottery = function(data){
        var ids = []
        _.each(data, function(o){
            if (o.from == 2){
                ids.push(o.lotteryEvent)
            }
        })
        if (ids.length == 0){
            return findPrice(data)
        }
        lotteryeventsCollection.find({_id: {$in: ids}}, {theme: 1}, function(err, docs){
            if (err){
                return callback(err)
            } else {
                var map = {}
                _.each(docs, function(m){
                    map[m._id.toString()] = m;
                })
                _.each(data, function(winner){
                    if (winner.from == 2){
                        winner.activity = map[winner.lotteryEvent];
                    }
                })
                findPrice(data)
            }
        })
    }

    var findPrice = function(data){
        var tradeNo = [];
        _.each(data, function(o){
            if (o.out_trade_no){
                tradeNo.push(o.out_trade_no)
            }
        })
        if (tradeNo.length == 0){
            return final(data)
        }
        var condition = {
            out_trade_no: {$in: tradeNo}
        }

        wxorderCollection.find(condition, function(err, wxorders){
            if (err){
                return callback(err)
            }
            if (!wxorders || wxorders.length == 0){
                return final(data)
            }
            var orderMap = {}
            _.each(wxorders, function(o){
                orderMap[o.out_trade_no] = o;
            })
            _.each(data, function(o){
                if (o.out_trade_no && orderMap[o.out_trade_no]){
                    o.price = orderMap[o.out_trade_no].price
                    o.score = orderMap[o.out_trade_no].score
                    o.redPagerRecordIds = orderMap[o.out_trade_no].redPagerRecordIds
                    if (orderMap[o.out_trade_no].payResult){
                        o.total_fee = orderMap[o.out_trade_no].payResult.total_fee / 100
                    } else {
                        o.total_fee = 0
                    }
                }
            })
            findRedPager(data)
        })
    }

    var findRedPager = function(data){
        var redPagerRecordIds = [];
        _.each(data, function(o){
            if (o.redPagerRecordIds){
                redPagerRecordIds.push(o.redPagerRecordIds)
            }
        })
        redPagerRecordIds = _.flatten(redPagerRecordIds);
        if (redPagerRecordIds.length == 0){
            return final(data)
        }
        var condition = {
            _id: {$in: redPagerRecordIds}
        }
        redpagerrecordCollection.find(condition, {price: 1,redPagerId: 1}, function(err, docs){
            if (err){
                return final(data)
            } else {
                goodsCollection.find({_id: {$in: _.uniq(_.pluck(docs, 'redPagerId'))}}, {name: 1, price: 1}, function(err, os){
                    var priceMap = {}
                    _.each(docs, function(d){
                        _.each(os, function(o){
                            if (o._id.toString() == d.redPagerId){
                                priceMap[d._id.toString()] = o.price;
                            }
                        })
                    })
                    _.each(data, function(o){
                        o.redPrice = 0
                        if (o.redPagerRecordIds && o.redPagerRecordIds.length > 0){
                            _.each(o.redPagerRecordIds, function(redId){
                                o.redPrice += priceMap[redId]
                            })
                        }
                    })
                    return final(data)
                });

            }
        })
    }

    var final = function(data){
        _.each(data, function(o){
            delete o.openId
            delete o.addressId
            delete o.token
        })
        callback(null, data);
    }

    findLottery();
}

exports.listLottery = function(req, res){
    var state = req.param('state');
    var type = req.param('type');
    var from = req.param('from');
    var out_trade_no = req.param('out_trade_no');
    var mobile = req.param('mobile');
    var rank = req.rank;
    var openId = req.openId;
	var activityIds;
	if (req.activityIds) {
		activityIds = [];
		req.activityIds.forEach(function (item) {
			activityIds.push(item.toString());
		});
	}

    var startTime = req.param('startTime');
    var endTime = req.param('endTime');
    if (startTime && endTime){
        startTime = new Date(startTime)
        endTime = new Date(endTime)
    } else {
        startTime = null
        endTime = null
    }

    var q = req.param('q');
    if (state && !_.contains(['unDelivery', 'Delivery', 'Delivered', 'deleted', 'refund'], state)){
        return res.send(400, 'state err:' + state);
    }

    var condition = {}
    ut.groupOrderCondition(condition, req.token, req.tvmId)
    if (openId){
        condition.openId = openId
    }

    var condition1 = {}
    if (state){
        condition1.state = state;
    } else {
        condition1.state = {$ne: 'deleted'}
    }
    if (type){
        condition1.prizeType = parseInt(type, 10);
    }
    if (q){
        condition1.prizeName = q;
    }
    if (out_trade_no){
        condition1.out_trade_no = out_trade_no;
    }
    if (mobile){
        condition1.mobile = mobile;
    }

    if (startTime && endTime){
        condition1.dateTime = {$gte: startTime, $lt: endTime}
    }

    var since = req.param('since');
    if (since){
        since = parseInt(since, 10)
        since = new Date(since)
        condition1.dateTime = {$gte: since}
    }

    if (rank || activityIds){
        condition1.prizeType = {$in: [typeConfig.goods.type.goods, typeConfig.goods.type.chargeCard, typeConfig.goods.type.shoppingCard, typeConfig.goods.type.redPager, typeConfig.goods.type.live, typeConfig.goods.type.other, typeConfig.goods.type.card, typeConfig.goods.type.coupon]}
        condition1.activityId = {$in: activityIds}
    }

    if (!condition1.prizeType){
        condition1.prizeType = {$in: [typeConfig.goods.type.goods, typeConfig.goods.type.chargeCard, typeConfig.goods.type.shoppingCard, typeConfig.goods.type.live, typeConfig.goods.type.redPager, typeConfig.goods.type.other, typeConfig.goods.type.card, typeConfig.goods.type.coupon]}
    }

    var condition2 = null;
    var forLottery = false
    if (from){
        if (from == 1){
            condition1.from = 4;
            if (!type){
                delete condition1.prizeType
            }
        } else if (from == 2){
            condition1.from = {$in: [1, 2]};
        } else if (from == 3){
            condition1.from = 3;
        }
        condition.$or = [condition1]
    } else if (openId || (!rank && !activityIds)){
        condition2 = _.extend({}, condition1);
        condition2.from = 4;
        delete condition2.prizeType
        condition.$or = [condition1, condition2]
    } else {
        condition.$or = [condition1]
        forLottery = true
    }

    exports.findOrders(condition, req.token, {limit: req.pageSpec.limit, skip: req.pageSpec.skip, sort: {dateTime: -1}}, forLottery, function(err, docs){
        if (err){
            return res.send(500, err)
        }

        if (docs && docs.length > 0){
            _.each(docs, function(o){
                if (forLottery){
                    delete o.addInfo
                    delete o.mobile
                    delete o.shoppingCard
                    delete o.prizeId
                    delete o.lotteryEvent
                    delete o.state
                    if (!since){
                        delete o._id
                        delete o.activityId
                        delete o.openId
                    }
                    delete o.prizeType
                    delete o.randomNum
                }
            })
            return final(docs)
        } else{
            return res.send([])
        }
    })

    var final = function(data){
        if (!openId && !rank && !activityIds){
            console.time('count order 1')
            ut.groupOrderCondition(condition1, req.token, req.tvmId)
            lotterieCollectionSlave.count(condition1, function(err, count){
                console.timeEnd('count order 1')
                console.time('count order 2')
                if (condition2){
                    ut.groupOrderCondition(condition1, req.token, req.tvmId)
                    lotterieCollectionSlave.count(condition2, function(err, count1){
                        console.timeEnd('count order 2')
                        count += count1
                        var pageTotal = Math.ceil(count / 20);
                        if (pageTotal == 0){
                            pageTotal++
                        }
                        _.each(data, function(o){
                            o.pageTotal = pageTotal;
                        });
                        return res.send(data)
                    });
                } else {
                    var pageTotal = Math.ceil(count / 20);
                    if (pageTotal == 0){
                        pageTotal++
                    }
                    _.each(data, function(o){
                        o.pageTotal = pageTotal;
                    });
                    return res.send(data)
                }
            });
        } else {
            return res.send(data);
        }
    }
}

exports.updateOrder = function(req, res){
    var id = req.param('id');
    if (!id){
        return res.send(400, 'param id is required')
    }

    var wayCom = req.param('wayCom');
    if (!wayCom){
        return res.send(400, 'param waybillId is required')
    }

    var waybillId = req.param('waybillId');
    if (!waybillId){
        return res.send(400, 'param waybillId is required')
    }

    if (!req.lottery.addressId){
        return res.send(403, '用户还没有填写地址')
    }

    var obj = {
        wayCom: wayCom,
        waybillId: waybillId,
        state: "Delivery"
    }

    lotterieCollection.updateById(id, {$set: obj}, function(err, doc){
        if (err){
            console.log(err);
            return res.send(500, err)
        }
        console.log('lotterieCollection.updateById success!')
        return res.send(200)
    })
}

exports.lotteryDeal = function(req, res) {
    var id = req.param('id');
    if (!id) {
        return res.send(400, 'param id is required')
    }

    var state = req.param('state');
    if (!state) {
        return res.send(400, 'param state is required');
    }
    if (!_.contains(['Delivered', 'deleted', 'refund'], state)) {
        return res.send(400, 'param state error:' + state);
    }

    var lottery = req.lottery;
    if (state == 'Delivered') {      //unDelivery, Delivery, Delivered, deleted
        if (lottery.prizeType == 3){
            if (!lottery.addressId && !lottery.addInfo) {
                return res.send(403, '没有地址不能完成');
            }
            if (lottery.state == 'Delivered') {
                return res.send(403, '已经是完成状态');
            } else if (lottery.state != 'Delivery') {
                return res.send(403, '没有发货不能完成');
            }
        } else if (lottery.prizeType == 4 || lottery.prizeType == 6){
            if (!lottery.mobile) {
                return res.send(403, '没有手机号不能完成');
            }
        }
    } else if (state == 'refund'){
        if (lottery.from != 4){
            return res.send(403, '不是购买不能退款');
        }
        if (lottery.state == 'refund'){
            return res.send(403, '已经是退款状态');
        }
    }

    if (state != 'refund'){
        exports.dealOrderState([id], state, function (err) {
            if (err) {
                return res.send(500, err);
            } else {
                return res.send(200);
            }
        })
    } else {
        wxPay.startRefund([id], function(err){
            if (err){
                return res.send(500, err);
            } else {
                return res.send(200);
            }
        })
    }
}

exports.lotterySendMessage = function(req, res) {
    var orderIds = req.body.orderIds;
    var message = req.param('message');

    if (!orderIds) {
        return res.send(400, 'param orderIds is required')
    }
    if (!_.isArray(orderIds)){
        orderIds = [orderIds]
    }

    var state = req.param('state');
    if (!state) {
        return res.send(400, 'param state is required');
    }
    if (!_.contains(['Delivered', 'deleted', 'notice', 'refund'], state)) {
        return res.send(400, 'param state error:' + state);
    }

    var checkLotteryState = function(lotteries){
        for (var i = 0; i < lotteries.length; i++){
            var lottery = lotteries[i];
            if (state == 'Delivered') {      //unDelivery, Delivery, Delivered, deleted
                if (lottery.prizeType == 3){
                    if (!lottery.addressId) {
                        return res.send(403, '没有地址不能完成');
                    }
                    if (lottery.state == 'Delivered') {
                        return res.send(403, '已经是完成状态');
                    }
                    if (lottery.state != 'Delivery') {
                        return res.send(403, '没有发货不能完成');
                    }
                } else if (lottery.prizeType == 4 || lottery.prizeType == 6){
                    if (!lottery.mobile) {
                        return res.send(403, '没有手机号不能完成');
                    }
                }
            } else if (state == 'refund'){
                if (lottery.from != 4){
                    return res.send(403, '不是购买不能退款');
                }
                if (lottery.state == 'refund'){
                    return res.send(403, '已经是退款状态');
                }
            }
        }
        final(lotteries)
    }

    var loadLottery = function(){
        var condition = {
            _id: {$in: orderIds}
        }
        lotterieCollection.find(condition, function(err, docs){
            if (err){
                res.send(500, err);
            } else if (docs && docs.length > 0){
                checkLotteryState(docs)
            } else{
                res.send(500, '没有查到记录');
            }
        })
    }

    var final = function(lotteries){
        if (state != 'notice' && state != 'sendRandomNum'){
            if (state != 'refund'){
                exports.dealOrderState(orderIds, state, function (err) {
                    if (err) {
                        return res.send(500, err);
                    } else {
                        sendMessage(lotteries);
                        return res.send(200);
                    }
                })
            } else {
                wxPay.startRefund(orderIds, function(err){
                    if (err){
                        return res.send(500, err);
                    } else {
                        sendMessage(lotteries);
                        return res.send(200);
                    }
                })
            }
        } else {
            sendMessage(lotteries);
            return res.send(200);
        }
    }

    var sendMessage = function(lotteries){
        if (!message){
            return;
        }
        var openIds = _.pluck(lotteries, 'openId')
        interface.pushMessage(lotteries[0].token, openIds, message, function(err, response){
            var result = []
            if (err){
                _.each(openIds, function(o){
                    result.push({
                        openId: o,
                        errCode: err
                    })
                });
            } else{
                response = JSON.parse(response);
                console.log(response)
                if (response && response.message && response.message.length > 0){
                    _.each(response.message, function(o){
                        if (o.length > 0){
                            if (o[0].length > 1){
                                var errMsg = JSON.parse(o[0][1]);
                                result.push({
                                    openId: o[1],
                                    errCode: errMsg.errcode
                                })
                            }
                        }
                    })
                }
            }
        });
    }

    loadLottery();
}

exports.dealOrderState = function(orderIds, state, callback){
    var condition = {
        _id: {$in: orderIds}
    }

    var orderObj = {
        state: state
    }
    lotterieCollection.update(condition, {$set: orderObj}, {multi: true}, function(err, doc){
        if (err){
            console.log(err);
            return callback(err)
        }

        if (!doc){
            return callback("没有该条记录");
        }

        return callback(null);
    })
}

exports.draw = function(req, res){
    var openId = req.openId;
    var score = req.activity.score;

    var now = new Date();
    if (!req.activity.startTime || !req.activity.endTime || req.activity.deleted){
        return res.send({status: -2, message: '活动不存在！'})
    }
    if (now.getTime() < req.activity.startTime.getTime() || now.getTime() >= req.activity.endTime.getTime()){
        return res.send({status: -2, message: '活动还没激活，尽请期待！'})
    }

    if (req.activity.token != req.token){
        console.log('活动与公共帐号不匹配!');
        return res.send({status: -2, message: '活动与公共帐号不匹配!'})
    }

    if (req.activity.followLimit != 1){
        var user = req.user
        if (!user || user.status != 'subscribe'){
            return res.send({status: -5, message: '不是关注用户'});
        }
    }

    prizePool.draw(req, openId, score, function(err, prize) {
        if(err) {
            console.log(err);
            return res.send({status: -2, message: err})
        }else {
            res.send(prize);
            if (prize.type == typeConfig.goods.type.goods || prize.type == typeConfig.goods.type.chargeCard || prize.type == typeConfig.goods.type.card){
                mgoods.changeStockCount(prize._id.toString(), -1, function (err, results) {});
            }
        }
    });
}

exports.authLottery = function(req, res){
    res.redirect('/pointMall/lottery/entry/activity/' + req.activity._id)
}

exports.gotoLottery = function(req, res){
    var activity = req.activity;
    var now = new Date()

    if (activity.deleted){
        return res.render('lottery-error', {tipPic: "lottery-tips.png"})
    }

    if (activity.startTime.getTime() > now.getTime()){
        return res.render('lottery-error', {tipPic: 'lottery-not-start.png'})
    }

    if (activity.endTime.getTime() <= now.getTime()){
        return res.render('lottery-error', {tipPic: "lottery-tips.png"})
    }

    var options = {
        activity: activity,
        goodsCount: activity.prizes.length
    }

    var TCONFIG = tokenConfig[activity.token];
    var redirectUrl = '';
    if (req.activity.way == 1){
        redirectUrl = 'prizeLottery';
    } else if (req.activity.way == 2){
        redirectUrl = 'lottery-turntable';
        if (!activity.turnplate){
            activity.turnplate = '/pointMall/images/turntable/' + activity.prizes.length + '.png'
        }
    } else{
        return res.render('lottery-error', {tipPic: "lottery-tips.png"})
    }

    options.config = tokenConfig.DEFAULT.activity;
    if (TCONFIG && TCONFIG.activity){
        options.config = _.extend(options.config, TCONFIG.activity[activity.score])
        options.config.scoreHelp = TCONFIG.scoreHelp;
    }

    if (options.activity.bgImg && options.activity.bgImg.length > 0) {
        options.config.turnplateBg  = options.activity.bgImg;
        options.config.ggkBg        = options.activity.bgImg;
    }

    options.unit = req.integralUnit;
    if (activity.followLimit != 1){
        options.unFollowed = req.unFollowed
        options.followUrl = req.followUrl
    }
    res.render(redirectUrl, options);
}

exports.checkUserIntegral = function(req, res, next){
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
                if (integ < req.activity.score){
                    return res.send({status: -1});
                }
                next();
            }
        })
    }
}

exports.authLotteryRule = function(req, res){
    res.redirect('/pointMall/redirect/lottery/bound');
}

exports.goLotteryRule = function(req, res){
    var TCONFIG = tokenConfig[req.token];

    var findActivity = function(){
        var now = new Date()
        var condition = {
            token: req.token,
            startTime: {$lte: now},
            endTime: {$gt: now},
            deleted: {$ne: true},
            inBound: 1
        }
        activitiesCollection.find(condition, {}, {sort: {score: 1}}, function(err, docs){
            console.log(docs)
            if (err){
                return res.send(500, 'mongodb error:' + err);
            }
            docs = ut.doc2Object(docs);
            _.each(docs, function(o){
                if (o.cover){
                    o.pic = o.cover
                } else {
                    o.pic = tokenConfig.DEFAULT.activity.cover
                }
            });
            if (docs.length == 0){
                return final(docs, []);
            } else{
                findStar(docs)
            }
        })
    }

    var findStar = function(activities){
        var starNumber = 3;
        var activity = activities[activities.length - 1];
        activity.prizes.sort(function(a, b){
            return (a.rating < b.rating)?-1:1
        })
        var prizeIds = _.pluck(activity.prizes, 'id')
        var tops = [];
        async.eachSeries(prizeIds, function(id, cb){
            lotterieCollection.find({token: req.token, prizeId: id, activityId: activity._id.toString()}, {}, {sort: {dateTime: -1}, limit: 1}, function(err, docs){
                if (err){
                    return cb(err);
                }
                if (docs && docs.length == 1){
                    var obj = ut.doc2Object(docs[0])
                    if (obj.prizeType != typeConfig.goods.type.score && obj.prizeType != typeConfig.goods.type.empty){
                        var index = tops.length;
                        if (index == 0){
                            obj.congratulations = '天啊，没天理了！'
                        } else if (index == 1){
                            obj.congratulations = '让人羡慕嫉妒恨啊！'
                        } else if (index == 2){
                            obj.congratulations = '哇，这是真的吗？'
                        }
                        tops.push(obj);
                    }
                    if (tops.length >= starNumber){
                        return cb('够了')
                    }
                }
                cb(null);
            });
        }, function(err){
            findWinners(activities, tops)
        })
    }

    var findWinners = function(activities, data){
        var ids = _.pluck(data, 'openId');
        var condition = {
            openId: {$in: ids}
        }

        userCollection.find(condition, function(err, friends){
            if (err){
                return res.send(500, err)
            }
            if (!friends || friends.length == 0){
                return final(activities, [])
            }
            var friendMap = {}
            _.each(friends, function(friend){
                friendMap[friend.openId] = friend;
            })
            _.each(data, function(winner){
                winner.userName = friendMap[winner.openId].nickName;
                winner.userIcon = friendMap[winner.openId].headImg;
                winner.dateTime = moment(winner.dateTime).format("YY-MM-DD HH-mm")
            })
            final(activities, data)
        })
    }

    var final = function(activity, tops){
        var options = {activity: activity, tops: tops}
        if (activity.length == 0){
            if (TCONFIG && TCONFIG.activity && TCONFIG.activity.cover){
                options.cover = TCONFIG.activity.cover
            }
        }
        options.unit=req.integralUnit;
        res.render('lottery-rule', options)
    }

    findActivity()
}

exports.setAddress = function (req, res) {
    var lottery = req.lottery;
    var address = req.address;
    async.parallel([
        function (cb) {
            lotterieCollection.updateById(lottery._id, {$set: {addressId: address._id}}, function (err, doc) {
                cb(err, doc);
            })
        },
        function (cb) {     //将address中的tel设置到lottery中的mobile字段
            addressCollection.findById({_id: address._id}, function (err, addressInfo) {
                if (!!err) {
                    return cb(err, addressInfo);
                }
                if (!addressInfo) {
                    return cb("addressInfo is null", addressInfo);
                }
                if (!addressInfo.addInfo || !addressInfo.addInfo.tel) {
                    return cb("tel is null", addressInfo);
                }
                var tel = addressInfo.addInfo.tel;
                lotterieCollection.updateById(lottery._id, {$set: {mobile: tel}}, function (err, doc) {
                    cb(err, doc);
                })
            })
        }
    ], function (err, results) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(200);
        }
    });
};

function getTipByState(state, type){
    if (state == 'unDelivery'){
        if (type == typeConfig.goods.type.chargeCard){
            return '未充值';
        } else if (type == typeConfig.goods.type.goods){
            return '未发货';
        } else if (type == typeConfig.goods.type.shoppingCard){
            return '未发';
        } else {
            return '已完成';
        }
    } else if (state == 'Delivery'){
        if (type == typeConfig.goods.type.goods){
            return '已发货';
        } else {
            return '已完成';
        }
    } else if (state == 'Delivered'){
        if (type == typeConfig.goods.type.chargeCard){
            return '已充值';
        } else if (type == typeConfig.goods.type.goods){
            return '已签收';
        } else if (type == typeConfig.goods.type.shoppingCard){
            return '已完成';
        } else {
            return '已完成';
        }
    } else if (state == 'refund'){
        return '已退款';
    } else if (state == 'refunding'){
        return '退款中';
    } else {
        return '已完成';
    }
}

exports.gotoMeOrderList = function(req, res){
    var type = req.param('type')
    res.render('me-order-list', {type: type});
}

exports.gotoMeOrderDetail = function(req, res) {
    var lottery = req.lottery;

    var findAddress = function (ids){
        mAddress.getAddressByIds(ids, function (err, adds) {
            if (err) {
                return res.send(500, err)
            }

            if (adds.length == 1){
                var add = ut.doc2Object(adds[0]);
                lottery.addInfo = add.addInfo;
            }

            findGoods();
        });
    }

    var findGoods = function(){
        if (lottery.prizeType == typeConfig.goods.type.live){
            goodsCollection.findById(lottery.prizeId, function(err, o){
                if (err){
                    final();
                } else {
                    lottery.liveUrl = o.ext.buyText
                    final();
                }
            })
        }  else {
            final();
        }
    }

    var final = function(){
        lottery.dateTime = moment(lottery.dateTime).format("YY-MM-DD HH:mm")
        lottery.state = getTipByState(lottery.state, lottery.prizeType);
        res.render('me-order-detail', {lottery: lottery});
    }

    if (lottery.addressId) {
        findAddress([lottery.addressId])
    } else if (lottery.prizeType == typeConfig.goods.type.live) {
        findGoods()
    } else {
        final();
    }
}

exports.exportOrder = function(req, res){
    var state = req.param('state');
    var type = req.param('type');
    var from = req.param('from');
    var out_trade_no = req.param('out_trade_no');
    var mobile = req.param('mobile');

    var startTime = req.param('startTime');
    var endTime = req.param('endTime');
    if (startTime && endTime){
        startTime = new Date(startTime)
        endTime = new Date(endTime)
    } else {
        startTime = null
        endTime = null
    }

    var q = req.param('q');
    if (state && !_.contains(['unDelivery', 'Delivery', 'Delivered', 'deleted', 'refund'], state)){
        return res.send(400, 'state err:' + state);
    }

    var condition = {
        token: req.token
    }

    var condition1 = {}
    if (state){
        condition1.state = state;
    } else {
        condition1.state = {$ne: 'deleted'}
    }
    if (type){
        condition1.prizeType = parseInt(type, 10);
    }
    if (q){
        condition1.prizeName = q;
    }
    if (out_trade_no){
        condition1.out_trade_no = out_trade_no;
    }
    if (mobile){
        condition1.mobile = mobile;
    }

    if (startTime && endTime){
        condition1.dateTime = {$gte: startTime, $lt: endTime}
    }

    if (!condition1.prizeType){
        condition1.prizeType = {$in: [typeConfig.goods.type.goods, typeConfig.goods.type.chargeCard, typeConfig.goods.type.shoppingCard, typeConfig.goods.type.live]}
    }

    if (from){
        if (from == 1){
            condition1.from = 4;
            if (!type){
                delete condition1.prizeType
            }
        } else if (from == 2){
            condition1.from = {$in: [1, 2]};
        } else if (from == 3){
            condition1.from = 3;
        }
        condition.$or = [condition1]
    }

    exports.findOrders(condition, req.token, {sort: {dateTime: -1}, limit: 1000}, false, function(err, docs){
        if (err){
            return res.send(500, err)
        }
        orderDownloadResponse(res, docs);
    })
}

function orderDownloadResponse(res, docs){
    var sheets = []
    var nameMap = {}
    _.each(docs, function(o){
        if (!nameMap[o.prizeName]){
            nameMap[o.prizeName] = {name: o.prizeName, data: []}
            if (o.prizeType == 3){
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '收货信息', '来源'])
            } else if (o.prizeType == 4){
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '姓名', '手机号', '来源'])
            } else if (o.prizeType == 6){
                nameMap[o.prizeName].data.push(['时间', '消费码', '商品名字', '微信昵称', '姓名', '手机号', '来源'])
            } else if (o.prizeType == 1 || o.prizeType == 102){
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '姓名', '来源'])
            }
        }
        var from = ''
        if (o.from == 4){
            from = '微信支付 ' + ' 商品价格：' + o.price + ',购买价格：' + o.total_fee;
            if (o.score > 0){
                from += ' ,花费积分' + o.score
            }
            if (o.redPrice > 0){
                from += ' ,红包抵扣' + o.redPrice
            }
        } else if (o.from == 3){
            from = '积分兑换';
        } else if (o.from == 2){
            from = '抽奖后台:' + o.activity.theme;
        } else if (o.from == 1){
            from = (o.activity.way==1?'刮刮卡':'大转盘') + ':' + o.activity.way;
        } else {
            from = '未知';
        }
        var rows = []
        rows.push(o.dateTime)
        if (o.prizeType == 3){
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
            rows.push(o.addInfo?o.addInfo.replace('\b', ''):'')
        } else if (o.prizeType == 4 || o.prizeType == 6){
            if (o.prizeType == 6){
                rows.push(o.shoppingCard?o.shoppingCard:'')
            }
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
            if (!o.name){
                rows.push('')
            } else {
                rows.push(o.name.replace('\b', ''))
            }
            rows.push(o.mobile?o.mobile:'')
        } else if (o.prizeType == 1 || o.prizeType == 102){
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
            if (!o.name){
                rows.push('')
            } else {
                rows.push(o.name.replace('\b', ''))
            }
        }
        rows.push(from);
        nameMap[o.prizeName].data.push(rows);
    })
    _.each(nameMap, function(v, k){
        sheets.push(v)
    })
    excel.exportFile(sheets, function(err, buffer){
        res.set('Date', new Date().toUTCString())
        res.set('Content-Type', 'application/octet-stream')
        res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('订单列表.xlsx') + '"')
        res.set('Content-Length', buffer.length)
        res.send(buffer)
    });
}

function getNonceStr(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var random = "";
    random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    random += new Date().getTime() - new Date(2014, 7, 1);
    random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    return random;
}

exports.saveLotteryFromWxOrder = function(wxorder){
    goodsCollection.findById(wxorder.goodsId, function(err, o){
        if (err){
            console.log('saveLotteryFromWxOrder error:' + err);
        } else if (!o){
            console.log('saveLotteryFromWxOrder error: goods not exists');
        } else {
            save(o);
            console.log('save lottery');
            //userGroup.addBehaviorAndGroup(wxorder.token, wxorder.openId, '购买', o.name, '', function(data){});
            var url = config.userHost + "/point/userGroup/add";
            var param = {
                wxToken: wxorder.token,
                openId: wxorder.openId,
                activity: '购买',
                title: o.name,
                result: ""
            };
            mIntegral.reportBehaviors(url, param, function(err, results) {
                if (!!err) {
                    redisClient.lpush("reportBehaviorsbackup", JSON.stringify(param));
                    console.log("**** reportBehaviors err: %j", err);
                }
            })
        }
    });

    var save = function(goods){
        var obj = {
            token: wxorder.token,
            tvmId: wxorder.tvmId,
            openId: wxorder.openId,
            prizeId: wxorder.goodsId,
            prizeType: goods.type,
            prizeName: goods.name,
            prizePic: goods.pic,
            from: 4,
            storeId: wxorder.storeId,
            out_trade_no: wxorder.out_trade_no,
            ext: wxorder.ext,
            count: wxorder.count?wxorder.count:1
        }
        if (wxorder.source){
            obj.source = wxorder.source
        }

        if (wxorder.mallCard){
            obj.mallCard = wxorder.mallCard
            mMallCard.changeMallCard(obj.mallCard.id, 1, function(){})
        }

        if (wxorder.addressId){
            obj.addressId = wxorder.addressId
        }

        if (wxorder.mobile){
            obj.mobile = wxorder.mobile
        }

        if (wxorder.name){
            obj.name = wxorder.name
        }

        if (wxorder.email){
            obj.email = wxorder.email
        }

        if (wxorder.payResult && wxorder.payResult.total_fee){
            obj.price = parseInt(wxorder.payResult.total_fee, 10) / 100
        }

        if (wxorder.orderInfo){
            obj.orderInfo = wxorder.orderInfo
        }

        if (wxorder.day){
            obj.day = wxorder.day;
        }

        if (goods.type != typeConfig.goods.type.goods && goods.type != typeConfig.goods.type.chargeCard){
            obj.state = 'Delivered'
        }

        if (goods.type == typeConfig.goods.type.score){
            mIntegral.changeIntegral(wxorder.token, wxorder.openId, goods.score, '购买');
            lotterySave(obj);
        } else if (goods.type == typeConfig.goods.type.shoppingCard){
            mgoods.getStockShopCard(goods._id.toString(), function (err, shopCard) {
                if (!!err) {
                    console.error("*** 获取消费码错误 err: %j", err);
                    shopCard = null;
                }
                obj.shoppingCard = shopCard || new Date().getTime() + '';
                lotterySave(obj);
            });
        } else if (goods.type == typeConfig.goods.type.vip){
            mUser.updateUserToVip(wxorder.token, wxorder.openId, goods.ext.expireDay, goods.ext.vipType)
            lotterySave(obj);
        }
        else {
            lotterySave(obj);
        }

//        if (goods.type != typeConfig.goods.type.shoppingCard && flag) {
//            mShoppingCard.changeCount(goods._id.toString(), -obj.count, function (err, results) {});
//        }

        /*
         if (shoppingCard){
         exports.updateGoodsCount(goods._id, obj.shoppingCard, 0);
         }*/
    };
    var lotterySave = function (obj) {
        obj.state = obj.state || 'unDelivery';
        obj.trade_state = obj.trade_state || 'complete';
        obj.count = obj.count || 1;
        obj.dateTime = new Date();
        dailyRecord.setTotalSalesVolume(obj.prizeId, obj.count, function (err, results) {});
        lotterieCollection.save(obj, function (err, doc) {
            if (err) {
                return console.log('save lottery fail!');
            }
            if (doc.prizeType == typeConfig.goods.type.live) {
                exports.sendLiveBuyText(doc)
            }
        });
    };
}

exports.listUser = function(req, res){
    var token = req.param('token')
    var goodsId = req.param('goodsId')

    if (!token){
        return res.send(400, 'token param is required')
    }

    if (!goodsId){
        return res.send(400, 'goodsId param is required')
    }

    lotterieCollection.find({token: token, prizeId: goodsId, state: {$ne: 'deleted'}}, {openId: 1, addressId:1}, {limit: 200}, function(err, docs){
        if (err){
            return res.send(500, err);
        } else {
            if (docs.length > 0){
                var addressIds     = _.pluck(docs.filter(function(lott){
                    if (lott.addressId) return true;

                }), 'addressId');

                addressCollection.find({_id : {$in: addressIds}}, {_id:1, addInfo:1}, function(err, addressList){
                    if (err) {
                        console.log(err);
                        return res.send([]);
                    } else {
                        findUser(docs,addressList);
                    }
                });

            } else {
                return res.send([]);
            }
        }
    })

    var getAddressInfo = function(lotteryList, openId,addressList) {
        var addressInfo = null;

        lotteryList.forEach(function(l) {
            if (openId == l.openId) {

                addressList.forEach(function(add){
                    if (add._id == l.addressId) {
                        addressInfo = add.addInfo;

                        return false;
                    }
                });

                return false;
            }
        });

        return addressInfo;
    };

    var findUser = function(docs, addressList){
        var openIds     = _.pluck(docs, 'openId');

        userCollection.find({token: req.token, openId: {$in: openIds}}, {nickName: 1, headImg: 1, openId:1}, function(err, users){
            if (err){
                console.log(err);
                return res.send([]);
            } else{
                var context = users.map(function(u) {
                    var result = null;

                    result = {
                        _id: u._id.toString(),
                        headImg: u.headImg,
                        nickName: u.nickName,
                        addressInfo: getAddressInfo(docs, u.openId,addressList)
                    }

                    if (!result.addressInfo){
                        delete result.addressInfo;
                    }

                    return result;
                });

                return res.send(context);
            }
        })
    }
}

exports.verifyUserGoods = function(req, res){
    var token = req.param('token')
    var openId = req.param('openId')
    var goodsId = req.param('goodsId')
    if (!openId){
        return res.send(400, 'openId param is required')
    }

    if (!token){
        return res.send(400, 'token param is required')
    }

    if (!goodsId){
        return res.send(400, 'goodsId param is required')
    }

    var loadUser = function(vipType){
        userCollection.findOne({token: token, openId: openId}, function(err, user){
            if (err || !user){
                return res.send([])
            } else {
                if (vipType == 'demand'){
                    if (user.vip && user.vip[vipType] && user.vip[vipType].endDate){
                        if (user.vip[vipType].endDate.getTime() > new Date().getTime()){
                            return res.send([{openId: openId, endDate: user.vip[vipType].endDate}])
                        } else{
                            return res.send([])
                        }
                    } else {
                        return res.send([])
                    }
                } else if (vipType == 'forums') {
                    if (user.vip && user.vip[vipType] && user.vip[vipType][goodsId] && user.vip[vipType][goodsId].endDate){
                        if (user.vip[vipType][goodsId].endDate.getTime() > new Date().getTime()){
                            return res.send([{openId: openId, endDate: user.vip[vipType][goodsId].endDate}])
                        } else{
                            return res.send([])
                        }
                    } else {
                        return res.send([])
                    }
                }
            }
        })
    }

    var loadGoods = function(){
        goodsCollection.findById(goodsId, function(err, o){
            if (err){
                return res.send(500, err);
            } else {
                if (o.type == typeConfig.goods.type.vip){
                    loadUser(o.ext.vipType)
                } else {
                    var condition = {
                        token: token,
                        openId: openId,
                        prizeId: goodsId,
                        state: {$nin: ['deleted', 'refund']}
                    }
                    loadOrder(condition)
                }
            }
        })
    }

    var loadOrder = function(condition){
        lotterieCollection.find(condition, {openId: 1, from: 1, dateTime: 1, prizeName: 1}, function(err, docs){
            if (err){
                return res.send(500, err);
            } else {
                return res.send(docs);
            }
        })
    }

    loadGoods()
}

exports.verifyVideoGoods = function(req, res){
    var user = req.user
    console.log(user)
    if (user && user.vip && user.vip.demand && user.vip.demand.endDate){
        if (user.vip.demand.endDate.getTime() > new Date().getTime()){
            return res.send({status: 'success', code: 0});
        }
    }
    var goodsIds = req.body.ids;
    if (!goodsIds || goodsIds.length == 0){
        return res.send({status: 'failure', code: 401});
    }

    var condition = {
        token: req.token,
        openId: req.openId,
        state: {$ne: 'deleted'},
        prizeId: {$in: goodsIds}
    }

    var findOrder = function(){
        lotterieCollection.findOne(condition, {openId: 1, from: 1, dateTime: 1, prizeName: 1}, function(err, doc){
            if (err){
                return res.send(500, err);
            } else if (doc){
                res.send({status: 'success', code: 0});
            } else {
                if (user && user.vip && user.vip.demand && user.vip.demand.endDate){
                    return res.send({status: 'failure', code: 1, message: 'vip expired'});
                } else {
                    return res.send({status: 'failure', code: 404});
                }
            }
        })
    }

    var findPackageGoods = function(){
        goodsCollection.find({'ext.package': {$in: goodsIds}}, {_id: 1}, function(err, docs){
            if (err){
                final([])
            } else {
                condition.prizeId = {$in: goodsIds.concat(_.pluck(docs, '_id'))};
                findOrder();
            }
        })
    }

    var final = function(docs) {
        res.send(docs)
    }

    findOrder()
}

//
exports.findOrder=function(condition,cb){
    lotterieCollection.findOne(condition, {openId: 1, from: 1, dateTime: 1, prizeName: 1}, function(err, doc){
        if (err){
            cb(err);
        } else if (doc){
            cb(true)
        }else{
            cb(false);
        }
    })
}

exports.verifyForumsVip = function(req, res){
    var token = req.param('token')
    var openId = req.param('openId')
    var goodsId = req.param('goodsId')
    if (!openId){
        return res.send({status: 'failure', code: 400, message: 'openId param is required'})
    }
    if (!token){
        return res.send({status: 'failure', code: 400, message: 'token param is required'})
    }
    userCollection.findOne({wxToken: token, openId: openId}, function(err, o){
        var user = o
        if (user && user.vip && user.vip.forums && user.vip.forums.endDate){
            if (user.vip.forums.endDate.getTime() > new Date().getTime()){
                return res.send({status: 'success', code: 0});
            } else {
                return res.send({status: 'failure', code: 1, message: 'vip expired'});
            }
        } else {
            return res.send({status: 'failure', code: 404, message: 'not vip'});
        }
    })
}

exports.getSaleCount = function (goodsIds, cb) {
    dailyRecord.getTotalSalesVolume(goodsIds, function (err, results) {
        cb(results);
    });
};

exports.sendLiveBuyText = function(lottery){
    goodsCollection.findById(lottery.prizeId, function(err, o){
        if (err){
            console.log('sendLiveBuyText error:' + err);
        } else if (!o){
            console.log('sendLiveBuyText error: goods not exists');
        } else {
            var message = o.ext.buyText
            if (!message){
                return
            }
            interface.pushMessage(lottery.token, lottery.openId, message, function(err, response){

            });
        }
    })
}

exports.midRankLoader = function(req, res, next){
    req.rank = 1
    req.openId = null
    var now = new Date()
    var condition = {
        token: req.token,
        startTime: {$lte: now},
        endTime: {$gt: now},
        deleted: {$ne: true},
        inBound: 1
    }
    activitiesCollection.distinct('_id', condition, function(err, arr){
        if (err){
            return res.send(500, err)
        } else {
            console.log('activityIds')
            console.log(arr)
            req.activityIds = arr
            return next()
        }
    })
}

exports.doExchange = function(req, res){
    var lottery = req.lottery
    var goods = req.goods
    var addressId = req.body.addressId
    var name = req.body.name
    var mobile = req.body.mobile

    if (goods.type == typeConfig.goods.type.goods){
        if (lottery.addressId){
            return res.send(400, '已经填写地址, 不能再填!')
        }
        if (!addressId){
            return res.send(400, '没有填写地址')
        }
    } else {
        if (lottery.mobile){
            return res.send(400, '已经填写手机号, 不能再填!')
        }
        if (!mobile){
            return res.send(400, '没有填写手机号')
        }
    }

    var rule = req.session.payExt?req.session.payExt:{}

    if (lottery.prizeId != goods._id.toString()){
        return res.send(403, '没有权限')
    }

    if (lottery.openId != req.openId){
        return res.send(403, '没有权限, 您没有获得该奖品!')
    }

    if (goods.ext.playType != typeConfig.goods.play.lottery){
        return res.send(403, '该商品不能用于抽奖兑换')
    }

    if (goods.deleted){
        return res.send(404, '商店已经删除！')
    }

    var updateLotteryTradeState = function(shoppingCard){
        var UPDATE_SPEC = {
            $set: {
                trade_state: 'complete',
                ext: rule
            }
        }

        if (goods.type == typeConfig.goods.type.goods){
            UPDATE_SPEC.$set.addressId = addressId
            if (mobile){
                UPDATE_SPEC.$set.mobile = mobile
            }
        } else {
            UPDATE_SPEC.$set.mobile = mobile
            if (name){
                UPDATE_SPEC.$set.name = name
            }
        }

        if (shoppingCard){
            UPDATE_SPEC.$set.shoppingCard = shoppingCard;
            UPDATE_SPEC.$set.state = 'Delivered'
        }
        lotterieCollection.updateById(lottery._id, UPDATE_SPEC, function(err){
            if (err){
                console.log(err);
                return res.send(500, '兑换失败');
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
            res.send(200)
        })
    };


    if (goods.type == typeConfig.goods.type.shoppingCard) {
        mgoods.getStockShopCard(goods._id.toString(), function (err, shopCard) {
            if (!!err) {
                console.error("***** 获取消费码错误 err: %j", err);
                return res.send(500, '获取消费码错误');
            }
            if (!shopCard) {
                return res.send({status: -2});
            }
            updateLotteryTradeState(shopCard);
        });
    }
    else {
        updateLotteryTradeState();
    }
}

exports.updateGoodsCount = function(goodsId, count){
    mgoods.changeStockCount(goodsId.toString(), -count, function (err, results) {});
}

exports.delOrder = function(req, res){
    var id = req.param('id')
    lotterieCollection.updateById(id, {$set: {state: 'deleted'}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            res.send(200)
        }
    })
}

exports.checkUserUnCompleteOrder = function(req, res){
    return res.send(404)
    var openId = req.openId;
    var token = req.token;
    var condition = {
        openId: openId,
        token: token,
        from: 1,
        trade_state: 'new',
        state: {$ne: 'deleted'}
    }
    lotterieCollection.findOne(condition, {_id: 1}, function(err, doc){
        if (err){
            res.send(500, err)
        } else if (!doc){
            res.send(404)
        } else {
            res.send(doc)
        }
    })
}


exports.refundVip = function(wxorder){
    goodsCollection.findById(wxorder.goodsId, function(err, o){
        if (o.type != typeConfig.goods.type.vip){
            return;
        }
        if (o){
            mUser.updateUserToVip(wxorder.token, wxorder.openId, wxorder.day?-wxorder.day:-o.ext.expireDay, o.ext.vipType, o._id.toString(), wxorder.count)
        }
    })
}

exports.refundGoods = function(wxorder){
    goodsCollection.findById(wxorder.goodsId, function(err, o){
        if (!o){
            return;
        }
        if (o.type == typeConfig.goods.type.vip){
            mUser.updateUserToVip(wxorder.token, wxorder.openId, wxorder.day?-wxorder.day:-o.ext.expireDay, o.ext.vipType, o._id.toString(), wxorder.count)
        } else if (o.type == typeConfig.goods.type.score){
            mIntegral.changeIntegral(wxorder.token, wxorder.openId, -o.score, '积分商品退款')
        }
    })
}

exports.orderCount = function(token, openId, prizeId, cb){
    lotterieCollection.count({token: token, openId: openId, prizeId: prizeId.toString()}, function(err, count){
        if (err){
            cb(0)
        } else {
            if (count){
                cb(count)
            } else {
                cb(0)
            }
        }
    })
}