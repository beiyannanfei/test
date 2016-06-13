/**
 * Created by chenjie on 2015/7/5.
 */

var _ = require('underscore');
var tools       = require('../../tools');
var queueClient = tools.queueRedis();
var typeConfig        = require('../../routes/typeConfig.js');
var dbUtils = require('../../mongoSkin/mongoUtils.js')
var wsqApi = require('../../interface/wsqApi.js')

var mPrize = require('../../routes/prize.js')

//根据tvmid把订单信息存储到redis
var redisClient       = tools.redisClient();
var lotteryRedis       = tools.lotteryRedis();

function pop(){
    queueClient.BRPOP('queueData', 0, function(err, data){
        console.log(arguments)
        if (data && _.isArray(data) && data.length > 1){
            var doc = JSON.parse(data[1]);
            console.log(doc)
            if (doc.queueDataCollection){
                var cloName = doc.queueDataCollection
                delete doc.queueDataCollection
                if (doc.dateTime){
                    doc.dateTime = new Date(doc.dateTime)
                } else {
                    doc.dateTime = new Date()
                }

                if (doc._id){
                    doc._id = new dbUtils.ObjectID(doc._id)
                }

                if (doc.updateAction){
                    new dbUtils(cloName).updateById(doc.updateAction._id, doc.updateAction.action, function(err){
                        if(err){
                            queueClient.lpush('errQueueData', data[1])
                        }
                        pop()
                    })
                } else {
                    if (cloName == 'order' && doc.state==undefined) {
                        //实物订单为未发货  其他订单都为完成状态即已发货
                        if (doc.prize && doc.prize.type == typeConfig.prizeType.goods){
                            doc.state = typeConfig.orderType.NonDelivery
                        } else {
                            doc.state = typeConfig.orderType.Delivered
                        }
                    }

                    if (cloName == 'order'){
                        console.log('pushOrder2Redis push')
                        countWxredSumAndNum(doc);   //统计用户的微信红包中奖次数和总金额
                        pushOrder2Redis(doc);       //摇一摇抽奖统计
                    }

                    new dbUtils(cloName).insert(doc, function(err, o){
                        if (err){
                            queueClient.lpush('errQueueData', data[1])
                        }
                        if (cloName == 'order' ) {
                            //根据tvmid 存储订单总数
                            console.log("doc.tvmId" + doc.tvmId)
                            redisClient.INCRBY("tvmidorders" + doc.tvmId, 1, function (err, doc) {

                            });
                            /*if (doc.prize && (doc.prize.type == 1 || doc.prize.type == 2 || doc.prize.type == 101)) {
                                mPrize.updatePrizeCount(doc.prize.id, -1, function () {})
                            }*/

                            if (doc.crazyLotteryId && doc.prize.type == typeConfig.prizeType.wxred){
                                if (doc.prize.rate == 1){
                                    lotteryRedis.lpush(doc.crazyLotteryId + '-win-records', data[1])
                                } else {
                                    lotteryRedis.rpush(doc.crazyLotteryId + '-win-records', data[1])
                                }
                            }
                            if (doc.money && doc.money.rate == 1){
                                redisClient.lpush('lottery-rank-' + doc.yyyappId, data[1])
                            } else if (doc.prize && doc.prize.type == typeConfig.prizeType.wxred && doc.prize.rate == 1){
                                redisClient.lpush('lottery-rank-' + doc.yyyappId, data[1])
                            }

                            if ((doc.money && doc.money.rate == 1) || (doc.prize && doc.prize.type == typeConfig.prizeType.wxred && doc.prize.rate == 1)){
                                var param = {
                                    yyyappid: doc.yyyappId,
                                    orderid: doc._id,
                                    headimg: doc.user.icon,
                                    nickname: doc.user.name,
                                    openid: doc.user.openId,
                                    type: 102,
                                    prizeInfo: "红包",
                                    create_timestamp: doc.dateTime.getTime()
                                }
                                if (doc.prize){
                                    param.prize = doc.prize.name
                                    param.money = doc.prize.money?doc.prize.money:1
                                } else if (doc.money){
                                    param.prize = doc.money.name
                                    param.money = doc.money.money
                                } else {
                                    param.prize = '奖品'
                                    param.money = 1.00
                                }
                                if(param.money){
                                    param.money = parseFloat(param.money).toFixed(2)
                                }
                                wsqApi.postBound(param, function(){
                                    console.log(arguments)
                                })
                            }
                        }

                        pop()
                    })
                }
            } else {
                pop()
            }
        } else {
            pop()
        }
    })
}
pop()

//统计用户的微信红包中奖次数和总金额
var countWxredSumAndNum = function(order) {
    if (!order) {
        console.error("order is null");
        return;
    }
    if ('string' == typeof(order)) {
        order = JSON.parse(order);
    }
    var openId = order.user.openId ? order.user.openId : "";       //用户openID
    var userInfo = JSON.stringify(order.user);  //用户信息
    var temp;
    if (order.money) {  //系统抽奖放在了money字段里
        temp = order.money;
    }
    if (order.prize) {  //疯狂抽奖放在了prize字段里
        temp = order.prize;
    }

    var type = temp.type ? +(temp.type) : 0;      //奖品类型
    var money = temp.money ? +(temp.money) : 0;   //红包金额
    if (type != typeConfig.prizeType.wxred) {     //非红包
        return;
    }
    var countWxredSumInfo = "countWxredSumInfo";        //微信红包总金额key
    var countWxredNumInfo = "countWxredNumInfo";        //微信红包总数量key
    var countWxredUserInfo = "countWxredUserInfo";      //用户信息key
    redisClient.ZINCRBY(countWxredSumInfo, money, openId, function(err, res) {  //将总金额增加到对用openid的redis中
        if (!!err) {
            console.error("save countWxredSumInfo into redis err, openid: %j, money: %j, err: %j", openId, money, err);
        }
    });

    redisClient.ZINCRBY(countWxredNumInfo, 1, openId, function(err, res) {  //将为对应的openid红包数量加1
        if (!!err) {
            console.error("save countWxredNumInfo into redis err, openid: %j, err: %j", openId, err);
        }
    });

    redisClient.HSETNX(countWxredUserInfo, openId, userInfo, function(err, res) {   //根据openid设置userInfo
        if (!!err) {
            console.error("save countWxredUserInfo into redis err, openid: %j, userInfo: %j, err: %j", openId, userInfo, err);
        }
    });
};

//将订单信息临时push到redis中
var pushOrder2Redis = function (order) {
    var key = "yyylotterystatistics";   //摇一摇抽奖统计key
    redisClient.lpush(key, JSON.stringify(order), function(err, o){
        console.log('pushOrder2Redis push:' + JSON.stringify(arguments))
    });  //首先将order信息存入redis
};
