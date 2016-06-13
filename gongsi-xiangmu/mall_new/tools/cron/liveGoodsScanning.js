/**
 * Created by chenjie on 2014/10/14.
 */

var _ = require('underscore');
var async = require('async');

var interface = require('../../interface');
var typeConfig = require('../../routes/typeConfig.js')
var dbUtils = require('../../mongoSkin/mongoUtils.js');
var goodsCollection = new dbUtils('goods');
var lotterieCollection = new dbUtils('lotteries');

var CronJob     = require('cron').CronJob;

function getLiveGoods(){
    var now = new Date()
    var gt = new Date(now.getTime() - 60 * 1000)
    var lt = now
    var condition = {
        use: typeConfig.goods.use.pay,
        type: typeConfig.goods.type.live,
        'ext.pushTime': {$gt: gt, $lte: lt}
    }
    goodsCollection.find(condition, {'ext.twInfo': 1, token: 1}, function(err, docs){
        if (err){
            console.log(err);
        } else {
            console.log(docs)
            findLottery(docs)
        }
    })
}

function pushTw(goods, openIds){
    if (!goods.ext.twInfo){
        return console.log(goods._id.toString() + ',没有图文')
    }
    var articles = {
        articles: [goods.ext.twInfo]
    }
    interface.pushMessageNews(goods.token, openIds, articles, function(err, response){
        if (err){
            console.log(err)
        } else {
            console.log(response)
        }
    })
}

function findLottery(goods){
    async.eachSeries(goods, function (o, done) {
        lotterieCollection.distinct('openId', {prizeId: o._id.toString()}, function(err, docs){
            if (err){
                console.log(err)
            } else {
                console.log(docs)
                pushTw(o, docs)
                done()
            }
        })
    }, function (err) {

    });
}

/*new CronJob('0 *!/1 * * * *', function(){
    console.log('getLiveGoods:' + new Date())
    getLiveGoods();
}, null, true)*/
