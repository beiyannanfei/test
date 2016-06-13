var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var xml2js = require('xml2js');
var fs = require('fs');

var models = require('../models')
var mGoods = require('../models/goods')
var Lottery    = models.Lottery;
var Users = models.Users;
var Activity = models.Activity;
var WxOrder = models.WxOrder;
var Goods = models.Goods;
var Address = models.Address;

var IntegralLog = models.IntegralLog;
var RedPagerRecord = models.RedPagerRecord;
var mAddress = require('./address');
var ut = require('./utils');
var prizePool = require('./prizePool');
//var statistics = require('./statistics');
var nodeExcel     = require('excel-export');
var interface = require('../interface');
var mNotice = require('./notice');
var tkConfig = require('../tokenConfig');
var config = require('../config');
var tokenConfig = tkConfig.CONFIG
var wxPay = require('./wxPay');
var userGroup = require('./userGroup');
var excel = require('./excel');
var mUser = require('./user');
var wxInfo = require('./wxInfo');
var mMallCard = require('./mallCard');

var redisCache = require('./redis_cache.js')
var redisQueue = require('../queue/redisQueue.js');

var mIntegral = require('../interface/integral.js');

exports.addLotteries = function(docs, cb){
    if (!_.isArray(docs)){
        docs = [docs];
    }

    async.eachSeries(docs, function(doc, callback){
        if (!doc.openId){
            return callback('no openId');
        }
        if (!doc.token){
            return callback('no token');
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
        new Lottery(doc).save(function(err){
            callback(err);
        })
    }, function(err){
        cb(err)
    })
}

exports.midLotteryLoader = function(req, res, next){
    var id = req.param('id');
    if (!id){
        return res.send(400);
    }
    Lottery.findById(id, function(err, doc){
        if (err){
            return res.send(500, err);
        }
        if (!doc){
            return res.send(500);
        }
        req.lottery = ut.doc2Object(doc);
        next();
    })
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
        Lottery.find(condition, {}, options, function(err, docs){
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
                    o.addInfo = _.values(addressMap[o.addressId].addInfo).join(' ');
                }
            })
            return findWinners(data)
        });
    }

    var findWinners = function(data){
        var ids = _.pluck(data, 'openId');
        ids = _.uniq(ids);
        var condition = {
            wxToken:_token,
            openId: {$in: ids}
        };
        Users.find(condition, function(err, friends){
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
                    winner.userName = '佚名';
                    winner.userIcon = '';
                    winner.dateTime = moment(winner.dateTime).format('YYYY/MM/DD HH:mm')
                }
            })
            if (forLottery){
                final(data);
            } else {
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

        WxOrder.find(condition, function(err, wxorders){
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
        RedPagerRecord.find(condition, {price: 1,redPagerId: 1}, function(err, docs){
            if (err){
                return final(data)
            } else {
                Goods.find({_id: {$in: _.uniq(_.pluck(docs, 'redPagerId'))}}, {name: 1, price: 1}, function(err, os){
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
    var rank = req.rank;
    var openId = req.openId;
    var activityIds = req.activityIds;

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
    if (state && !_.contains(['unDelivery', 'Delivery', 'Delivered', 'deleted'], state)){
        return res.send(400, 'state err:' + state);
    }

    var condition = {
        token: req.token
    }
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
        condition1.prizeType = {$in: [mGoods.type.goods, mGoods.type.chargeCard, mGoods.type.shoppingCard, mGoods.type.redPager, mGoods.type.live, mGoods.type.vip, mGoods.type.demandPackage, mGoods.type.demand, mGoods.type.card, mGoods.type.other]}
        condition1.activityId = {$in: activityIds}
    }

    if (!condition1.prizeType){
        condition1.prizeType = {$in: [mGoods.type.goods, mGoods.type.chargeCard, mGoods.type.shoppingCard, mGoods.type.live, mGoods.type.vip, mGoods.type.demandPackage, mGoods.type.demand]}
    }

    var condition2 = _.extend({}, condition1);
    var forLottery = false
    if (openId || (!rank && !activityIds)){
        condition2.from = 4;
        if (type){
            condition2.prizeType = type
        } else {
            delete condition2.prizeType
        }[]
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
            condition1.token = req.token
            Lottery.count(condition1, function(err, count){
                console.timeEnd('count order 1')
                console.time('count order 2')
                condition2.token = req.token
                Lottery.count(condition2, function(err, count1){
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

    Lottery.findByIdAndUpdate(id, obj, function(err, doc){
        if (err){
            console.log(err);
            return res.send(500, err)
        }

        if (!doc){
            return res.send(404, "没有该条记录")
        }
        return res.send(doc)
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
        Lottery.find(condition, function(err, docs){
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
        interface.pushMessage(req.token, openIds, message, function(err, response){
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

            mNotice.addNotice({token: req.token, openIds: result, message: message})
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
    Lottery.update(condition, orderObj, {multi: true}, function(err, doc){
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
            prize.integral = req.user.integral - score;
            prize.status = 0
            console.log(prize);
            res.send(prize);
            if (prize.type != mGoods.type.score && prize.type != mGoods.type.empty){
                var data = {wx_token: req.token, id: req.activity._id.toString(), dateTime: new Date().getTime(), data: {user: {name: req.user.nickName, pic: req.user.headImg}, prize: {name: prize.name, price: prize.price, pic: prize.pic}}}
                /*wxInfo.postLotteryEventData(data, function(){

                })*/
                if (prize.type == mGoods.type.goods || prize.type == mGoods.type.chargeCard || prize.type == mGoods.type.shoppingCard || prize.type == mGoods.type.card){
                    exports.updateGoodsCount(prize._id, null, 1)
                }
            }
        }
    });
}

exports.parseWxInfo = function(req, res, next){
    var wxToken = req.query.wx_token || '';
    if(wxToken){
        var buf = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            buf += chunk;
        });
        req.on('end', function() {
            xml2js.parseString(buf, function(err, json) {
                if (err) {
                    return res.send(500);
                } else {
                    req.body = json;
                }
                if(req.body && req.body.xml){
                    var data = req.body.xml;
                    req.openId =  data.FromUserName[0]
                    req.content = data.Content[0]
                    return next();
                }else{
                    return res.send(400);
                }
            });
        });
    }else{
        return res.send(400);
    }
}

exports.fillLotteryInfo = function(req, res){
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openid不存在');
    }

    var wx_token = req.param('wx_token');
    if (!wx_token){
        return res.send(400, 'wx_token不存在');
    }

    var message = req.content;
    if (!message){
        return res.send(400, 'message不存在');
    }

    var randomNum = null;
    if (!/^WYLJ#[0-9]{6}/.test(message)){
        return res.send(400, 'message格式不对');
    }
    randomNum = message.substring(5, 11)

    var findUser = function(){
        Users.findById(wx_token + '_' + openId, function(err, o){
            if (err){
                console.log(err);
                final()
            } else if (!o){
                console.log(wx_token + '_' + openId);
                console.log('用户不存在');
                final('用户不存在')
            } else{
                findLottery()
            }
        })
    }

    var findLottery = function(){
        var condition = {token: wx_token, openId: openId, randomNum: randomNum};
        Lottery.findOne(condition, function(err, o){
            if (err){
                console.log('mongodb err:' + err);
                final();
            } else if (!o){
                console.log(wx_token + '_' + openId + '_' + randomNum);
                console.log('该用户没有中奖信息');
                final('该用户没有中奖信息, 请确认是您本人中奖，如有问题，请联系客服，谢谢。');
            } else{
                dealLotteryMessage(o);
            }
        })
    }

    var dealLotteryMessage = function(lottery){
        if (lottery.prizeType == mGoods.type.chargeCard){
            if (lottery.state == "Delivered"){
                return final('话费已充值不能再修改手机号');
            }

            if (!/^WYLJ#[0-9]{6}#1[0-9]{10}$/.test(message)){
                console.log(message)
                return final('内容格式不对, 请检查！');
            } else {
                var mobile = message.split('#')[2];
                exports.setLotteryMobile(lottery._id, mobile, function(err){
                    if (err){
                        console.log(err)
                        final()
                    } else{
                        final('已收到您的手机号， 我们会尽快为您充值')
                    }
                });
            }
        } else if (lottery.prizeType == mGoods.type.shoppingCard){
            if (!/^WYLJ#[0-9]{6}#1[0-9]{10}#XFK$/.test(message)){
                console.log(message)
                return final('内容格式不对, 请检查！');
            } else {
                var mobile = message.split('#')[2];
                exports.setLotteryMobile(lottery._id, mobile, function(err){
                    if (err){
                        console.log(err)
                        final()
                    } else{
                        final('稍后发送' + lottery.prizeName + '卡密, 请妥善保管，以免泄漏，感谢参与。')
                    }
                });
            }
        } else if (lottery.prizeType == mGoods.type.goods){
            if (lottery.state == "Delivered" || lottery.state == "Delivery"){
                return final('已经发货不能修改地址');
            }
            if (!/^WYLJ#[0-9]{6}#1[0-9]{10}#/.test(message)){
                console.log(message)
                return final('内容格式不对, 请检查！');
            } else {
                var arr = message.split('#');
                if (arr.length != 5){
                    console.log(message)
                    return final('内容格式不对, 请检查！');
                }
                var mobile = arr[2];
                var name = arr[3];
                var add = arr[4];
                if (!name || name.length == 0){
                    console.log(message)
                    return final('内容格式不对, 请检查！');
                }
                if (!add || add.length == 0){
                    console.log(message)
                    return final('内容格式不对, 请检查！');
                }
                mAddress.saveAddress(openId, lottery.token, {
                    name:name,
                    tel:mobile,
                    add:add
                }, function(err, o){
                    if (err){
                        console.log(err);
                        return final('保存地址内容出错！');
                    }
                    Lottery.findByIdAndUpdate(lottery._id,{ $set: {addressId: o._id}}, function(err,doc){
                        if(err) {
                            return final('保存地址内容出错！');
                        } else {
                            return final('保存地址成功，请到个人中心我的奖品查看！');
                        }
                    });
                })
            }
        } else {
            final()
        }
    }

    var final = function(notice){
        if (notice){
            interface.pushMessage(wx_token, openId, notice, function(err, response){
                if (err){
                    console.log(err);
                } else{

                }
            });
        }
        return res.send(200);
    }

    findUser();
}

exports.putPrizeMobile = function(req, res){
    var lottery = req.lottery;
    var prizeId = req.params.prizeId;
    if (!prizeId){
        return res.send(400);
    }

    var mobile = req.param('mobile');
    if (!mobile){
        return res.send(400, 'mobile不存在');
    }

    if (lottery.prizeType != mGoods.type.chargeCard){
        return res.send(403, '中奖类型不对');
    }

    if (lottery.mobile){
        return res.send(403, '已经填完手机号');
    }

    if (lottery.openId != req.session.openId){
        return res.send(403, '非本来不能填手机号');
    }

    exports.setLotteryMobile(prizeId, mobile, function(err){
        if(err) {
            res.send(500, err);
        }else {
            res.send(200);
        }
    })
}

exports.setLotteryMobile = function(lotteryId, mobile, done){
    Lottery.findByIdAndUpdate(lotteryId,{ $set: {mobile: mobile}}, function(err,doc){
        if(err) {
            done(err);
        }else {
            done();
        }
    });
}

exports.putPrizeAddress = function(req,res) {
    var openId = req.session.openId;
    var prizeId = req.params.prizeId;
    if (!prizeId){
        return res.send(400, '参数出错');
    }

    if (!req.body.name){
        return res.send(400, '参数出错');
    }

    if (!req.body.tel){
        return res.send(400, '参数出错');
    }

    if (!req.body.add){
        return res.send(400, '参数出错');
    }

    mAddress.saveAddress(openId, req.token, {
        name:req.body.name,
        tel:req.body.tel,
        add:req.body.add,
        zip:req.body.zip
    }, function(err, o){
        if (err){
            console.log(err);
            return res.send(500, err);
        }
        Lottery.findByIdAndUpdate(prizeId,{ $set: {addressId: o._id}}, function(err,doc){
            if(err) {
                res.send({status:'-1',message:'保存信息出错'});
            } else {
                res.send({status:'1',message:'保存成功'});
            }
        });
    })
};

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
    console.log('activity.followLimit:' + activity.followLimit)
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
        Activity.find(condition, {}, {sort: {score: 1}}, function(err, docs){
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
            Lottery.find({token: req.token, prizeId: id, activityId: activity._id.toString()}, {}, {sort: {dateTime: -1}, limit: 1}, function(err, docs){
                if (err){
                    return cb(err);
                }
                if (docs && docs.length == 1){
                    var obj = ut.doc2Object(docs[0])
                    if (obj.prizeType != mGoods.type.score && obj.prizeType != mGoods.type.empty){
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

        Users.find(condition, function(err, friends){
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

exports.setAddress = function(req, res){
    var lottery = req.lottery;
    var address = req.address;
    Lottery.findByIdAndUpdate(lottery._id,{ $set: {addressId: address._id}}, function(err,doc){
        if(err) {
            res.send(500, err);
        }else {
            res.send(200);
        }
    });
}

function getTipByState(state, type){
    if (state == 'unDelivery'){
        if (type == mGoods.type.chargeCard){
            return '未充值';
        } else if (type == mGoods.type.goods){
            return '未发货';
        } else if (type == mGoods.type.shoppingCard){
            return '未发';
        } else {
            return '';
        }
    } else if (state == 'Delivery'){
        if (type == mGoods.type.goods){
            return '已发货';
        } else {
            return '';
        }
    } else if (state == 'Delivered'){
        if (type == mGoods.type.chargeCard){
            return '已充值';
        } else if (type == mGoods.type.goods){
            return '已签收';
        } else if (type == mGoods.type.shoppingCard){
            return '已发';
        } else {
            return '';
        }
    } else if (state == 'refund'){
        return '已退款';
    } else if (state == 'refunding'){
        return '退款中';
    } else {
        return '';
    }
}

exports.gotoMeOrderList = function(req, res){
    var type = req.param('type')
    var options = {type: type}
    /*if (req.token == 'C1SGTBMty' || req.token == '70c69789da7c' || req.token == 'b48c7259d874'){
        options.custom = true
    }*/
    res.render('me-order-list', options);
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
        if (lottery.prizeType == mGoods.type.live){
            Goods.findById(lottery.prizeId, function(err, o){
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
    } else if (lottery.prizeType == mGoods.type.live) {
        findGoods()
    } else {
        final();
    }
}

exports.exportOrder = function(req, res){
    var state = req.param('state');
    var type = req.param('type');

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
    if (state && !_.contains(['unDelivery', 'Delivery', 'Delivered', 'deleted'], state)){
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

    if (startTime && endTime){
        condition1.dateTime = {$gte: startTime, $lt: endTime}
    }

    if (!condition1.prizeType){
        condition1.prizeType = {$in: [mGoods.type.goods, mGoods.type.chargeCard, mGoods.type.shoppingCard, mGoods.type.live]}
    }

    var condition2 = _.extend({}, condition1);
    condition2.from = 4;
    if (type){
        condition2.prizeType = type
    } else {
        delete condition2.prizeType
    }
    condition.$or = [condition1, condition2]

    exports.findOrders(condition, req.token, {sort: {dateTime: -1}, limit: 5000}, false, function(err, docs){
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
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '收货信息', '来源', '数量', '微信支付', '使用积分', '使用红包', '用户姓名', 'email'])
            } else if (o.prizeType == 4 || o.prizeType == 105){
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '手机号', '来源', '数量', '微信支付', '使用积分', '使用红包', '用户姓名', 'email'])
            } else if (o.prizeType == 6){
                nameMap[o.prizeName].data.push(['时间', '消费码', '商品名字', '微信昵称', '手机号', '来源', '数量', '微信支付', '使用积分', '使用红包', '用户姓名', 'email'])
            } else if (o.prizeType == 1 || o.prizeType == 102 || o.prizeType == 104 || o.prizeType == 103){
                nameMap[o.prizeName].data.push(['时间', '商品名字', '微信昵称', '来源', '数量', '微信支付', '使用积分', '使用红包', '用户姓名', 'email'])
            }
        }
        var from = ''
        o.count = o.count?o.count:1
        if (o.from == 4){
            from = '微信支付 商品单价：' + o.price;
        } else if (o.from == 3){
            from = '积分兑换';
        } else if (o.lotteryEvent){
            from = '抽奖后台';
        } else if (o.activityId){
            from = '刮刮卡或者大转盘';
        } else {
            from = '未知';
        }
        var rows = []
        rows.push(o.dateTime)
        if (o.prizeType == 3){
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
            rows.push(o.addInfo?o.addInfo.replace('\b', ''):'')
        } else if (o.prizeType == 4 || o.prizeType == 6 || o.prizeType == 105){
            if (o.prizeType == 6){
                rows.push(o.shoppingCard?o.shoppingCard:'')
            }
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
            rows.push(o.mobile?o.mobile:'')
        } else if (o.prizeType == 1 || o.prizeType == 102 || o.prizeType == 103 || o.prizeType == 104){
            rows.push(o.prizeName.replace('\b', ''))
            rows.push(o.userName.replace('\b', ''))
        }
        rows.push(from);
        if (o.from == 4){
            rows.push(o.count);
            rows.push(o.total_fee);
            rows.push(o.score?o.score:0);
            rows.push(o.redPrice?o.redPrice:0);
        } else {
            rows.push(o.count);
            rows.push(0);
            rows.push(o.score?o.score:0);
            rows.push(0);
        }
        rows.push(o.name ? o.name : "");
        rows.push(o.email ? o.email : "");
        nameMap[o.prizeName].data.push(rows);
    });
    _.each(nameMap, function(v, k){
        sheets.push(v)
    });
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
    Goods.findById(wxorder.goodsId, function(err, o){
        if (err){
            console.log('saveLotteryFromWxOrder error:' + err);
        } else if (!o){
            console.log('saveLotteryFromWxOrder error: goods not exists');
        } else {
            save(o)
            console.log('save lottery')
            userGroup.addBehaviorAndGroup(wxorder.token, wxorder.openId, '购买', o.name, '', function(data){});
        }
    })

    var save = function(goods){
        var obj = {
            token: wxorder.token,
            openId: wxorder.openId,
            prizeId: wxorder.goodsId,
            prizeType: goods.type,
            prizeName: goods.name,
            prizePic: goods.pic,
            from: 4,
            storeId: wxorder.storeId,
            out_trade_no: wxorder.out_trade_no,
            ext: wxorder.ext,
            count: wxorder.count
        }

        if (goods.type == mGoods.type.score){
            mIntegral.changeIntegral(wxorder.token, wxorder.openId, goods.score, '购买')
        } else if (goods.type == mGoods.type.shoppingCard){
            var shoppingCard = null
            if (goods.type == mGoods.type.shoppingCard){
                shoppingCard = goods.ext.shoppingCards[0]
            }
            obj.shoppingCard = shoppingCard;
        } else if (goods.type == mGoods.type.vip){
            mUser.updateUserToVip(wxorder.token, wxorder.openId, wxorder.day?wxorder.day:goods.ext.expireDay, goods.ext.vipType, goods._id.toString(), wxorder.count)
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
        if (wxorder.payResult && wxorder.payResult.total_fee){
            obj.price = parseInt(wxorder.payResult.total_fee, 10) / 100
        }
        if (wxorder.name){
            obj.name = wxorder.name
        }
        if (wxorder.email){
            obj.email = wxorder.email
        }
        if (wxorder.day){
            obj.day = wxorder.day
        }
        if (wxorder.orderInfo){
            obj.orderInfo = wxorder.orderInfo
        }

        if (goods.type != mGoods.type.goods && goods.type != mGoods.type.chargeCard){
            obj.state = 'Delivered'
        }

        var lottery = new Lottery(obj);
        lottery.save(function(err, doc) {
            if(err) {
                console.log(obj);
                console.log('save lottery fail!')
            } else {
                console.log('notice user')
                if (doc.prizeType == mGoods.type.live){
                    exports.sendLiveBuyText(doc)
                }
            }
        });
        if (shoppingCard){
            exports.updateGoodsCount(goods._id, obj.shoppingCard, 0);
        }
    }
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

    Lottery.find({token: token, prizeId: goodsId, state: {$ne: 'deleted'}}, {openId: 1, addressId:1}, {limit: 200}, function(err, docs){
        if (err){
            return res.send(500, err);
        } else {
            if (docs.length > 0){
                var addressIds     = _.pluck(docs.filter(function(lott){
                    if (lott.addressId) return true;

                }), 'addressId');

                Address.find({_id : {$in:addressIds}}, {_id:1, addInfo:1}, function(err, addressList){
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

        Users.find({token: req.token, openId: {$in: openIds}}, {nickName: 1, headImg: 1, openId:1}, function(err, users){
            if (err){
                console.log(err);
                return res.send([]);
            } else{
                var context = users.map(function(u) {
                    var result = null;

                    result = {
                        _id: u._id,
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
    if (openId == 'o44n5s9g5HZSA19MtCYhIqie72Us' || openId == 'o44n5sz8eqn3Hh7L2COQ6iWCOpRQ'){
        return res.send([{openId: "o44n5s9g5HZSA19MtCYhIqie72Us"}])
    }

    var loadUser = function(vipType){
        Users.findById(token + '_' + openId, function(err, user){
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
        Goods.findById(goodsId, function(err, o){
            if (err){
                return res.send(500, err);
            } else {
                if (o.type == mGoods.type.vip){
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
        Lottery.find(condition, {openId: 1, from: 1, dateTime: 1, prizeName: 1}, function(err, docs){
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
        Lottery.findOne(condition, {openId: 1, from: 1, dateTime: 1, prizeName: 1}, function(err, doc){
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
        Goods.find({'ext.package': {$in: goodsIds}}, {_id: 1}, function(err, docs){
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

    findPackageGoods()
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
    Users.findById(token + '_' + openId, function(err, o){
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

exports.getSaleCount = function(token, goodsIds, cb){
    var result = {}
    async.each(goodsIds, function(o, done){
        Lottery.count({token: token, prizeId: o}, function(err, count){
            if (err){
                console.log(err);
                count = 0;
            }
            result[o] = count
            done()
        })
    }, function(err){
        cb(result);
    })
}

exports.sendLiveBuyText = function(lottery){
    Goods.findById(lottery.prizeId, function(err, o){
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
                var errCode = -1
                if (err){
                    console.log(err);
                    errCode = err
                } else{
                    response = JSON.parse(response);
                    if (response && response.message && response.message.length > 0){
                        _.each(response.message, function(o){
                            if (o.length > 0){
                                if (o[0].length > 1){
                                    var errMsg = JSON.parse(o[0][1]);
                                    errCode = errMsg.errcode
                                }
                            }
                        })
                    }
                }
                var result = []
                result.push({
                    openId: lottery.openId,
                    lotteryId: lottery._id.toString(),
                    message: message,
                    errCode: errCode
                })
                mNotice.addNotice({token: lottery.token, openIds: result, message: message})
            });
        }
    })
}

exports.thirdLotteryRecord = function(req, res){
    var token = req.param('token')
    if (!token){
        return res.send(400, 'token param is required')
    }

    var lotteryId = req.param('lotteryId')
    if (!lotteryId){
        lotteryId = '54a2b484567ff4ac28000405' //'54a1fdfff4b97af84c001437' prod
    }

    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'openId param is required')
    }

    var condition = {
        token: token,
        openId: openId,
        activityId: lotteryId
    }

    Lottery.find(condition, {openId: 1, dateTime: 1}, {limit: 1}, function(err, docs){
        if (err){
            return res.send(500, err)
        } else {
            return res.send(docs)
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
    Activity.distinct('_id', condition, function(err, arr){
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
    var mobile = req.body.mobile
    var name = req.body.name

    if (goods.type == mGoods.type.goods){
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

    if (goods.ext.playType != mGoods.playType.lottery){
        return res.send(403, '该商品不能用于抽奖兑换')
    }

    if (goods.deleted){
        return res.send(404, '商店已经删除！')
    }

    if (goods.type == mGoods.type.shoppingCard){
        if (!goods.ext.shoppingCards || goods.ext.shoppingCards.length == 0){
            return res.send({status: -2})
        }
    }

    var updateLotteryTradeState = function(){
        var UPDATE_SPEC = {
            $set: {
                trade_state: 'complete',
                ext: rule
            }
        }

        if (goods.type == mGoods.type.goods){
            UPDATE_SPEC.$set.addressId = addressId
        } else {
            UPDATE_SPEC.$set.mobile = mobile
            if (name){
                UPDATE_SPEC.$set.name = name
            }
        }

        var shoppingCard = null
        if (goods.type == mGoods.type.shoppingCard){
            shoppingCard = goods.ext.shoppingCards[0]
            UPDATE_SPEC.$set.shoppingCard = shoppingCard
            UPDATE_SPEC.$set.state = 'Delivered'
        }
        Lottery.findByIdAndUpdate(lottery._id, UPDATE_SPEC, function(err){
            if (err){
                console.log(err);
                return res.send(500, '兑换失败');
            }
            exports.updateGoodsCount(goods._id, shoppingCard, 0)
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
    }

    updateLotteryTradeState()
}

exports.updateGoodsCount = function(goodsId, shoppingCard, count){
    var UPDATE_SPEC = {
        $inc : {
            'count' : -count
        }
    }
    if (shoppingCard){
        UPDATE_SPEC.$pull = {
            'ext.shoppingCards': shoppingCard
        }
    }

    Goods.findByIdAndUpdate(goodsId, UPDATE_SPEC, function(err, o){
        if (err){
            console.log('updateGoodsCount err:' + err)
        } else {
            console.log(o);
        }
    })
}

exports.delOrder = function(req, res){
    var id = req.param('id')
    Lottery.findByIdAndUpdate(id, {$set: {state: 'deleted'}}, function(err){
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
        token: token,
        openId: openId,
        from: 1,
        trade_state: 'new',
        state: {$ne: 'deleted'}
    }

    redisCache.get(openId + token + '-order', function(err, v){
        if (err || !v){
            Lottery.findOne(condition, {_id: 1}, function(err, doc){
                if (err){
                    res.send(500, err)
                } else if (!doc){
                    res.send(404)
                } else {
                    redisCache.set(openId + token + '-order', 20 * 60, doc)
                    res.send(doc)
                }
            })
        } else {
            console.log(1)
            res.send(v)
        }
    })
}

exports.refundGoods = function(wxorder){
    Goods.findById(wxorder.goodsId, function(err, o){
        if (!o){
            return;
        }
        if (o.type == mGoods.type.vip){
            mUser.updateUserToVip(wxorder.token, wxorder.openId, wxorder.day?-wxorder.day:-o.ext.expireDay, o.ext.vipType, o._id.toString(), wxorder.count)
        } else if (o.type == mGoods.type.score){
            mIntegral.changeIntegral(wxorder.token, wxorder.openId, -o.score, '积分商品退款')
        }
    })
}