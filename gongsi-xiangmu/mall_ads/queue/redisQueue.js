/**
 * Created by chenjie on 2015/7/5.
 */

var tools       = require('../tools');
var _                 = require("underscore");
var queueClient = tools.queueRedis();
var mShoppingCard = require('../routes/shoppingCard.js');

// key:  orderList
//doc 中需要包含queueDataCollection:表的名字
exports.push = function(doc){
    console.log(doc)
    if (doc.prize && doc.prize.id && (doc.prize.type == 1 || doc.prize.type == 3 ||doc.prize.type == 101)) {
        mShoppingCard.changeCount(doc.prize.id, -1, function () {})
    }
    queueClient.lpush('queueData', JSON.stringify(doc))
}

exports.pushSysLottery = function(doc){
    queueClient.SET('sysLotteryDataKey', JSON.stringify(doc));
}

exports.pushCrazyLottery = function(lotteryId, doc){
    console.log('pushCrazyLottery' + lotteryId)
    queueClient.lpush('pushCrazyLottery' + lotteryId, JSON.stringify(doc));
}

exports.notiCrazyLotteryEnd = function(doc){
    queueClient.lpush('crazyLotteryEnd', JSON.stringify(doc));
}

exports.pushError = function(doc){
    console.log(doc)
    queueClient.lpush('webErrorData', JSON.stringify(doc));
}

exports.getError = function(cb){
    queueClient.lrange('webErrorData', 0, -1, function(err, o){
        cb(err, o)
    });
}

/*
queueClient.set('sysLotteryDataKey', "abc",function(err,data){
    console.log(err);
    console.log(data);
    queueClient.get("sysLotteryDataKey",function(err,data){
        console.log(err);
        console.log(data);
    }) //people
})*/

/*queueClient.HGETALL("people",function(err,doc){
    _.each(doc,function(name){
        console.log(name);
    });
    console.log(doc);
})*/
/*queueClient.HGET("people","jackd",function(err,doc){
    console.log(err); //查不到的时候 都是null
    console.log(doc);
});*/
