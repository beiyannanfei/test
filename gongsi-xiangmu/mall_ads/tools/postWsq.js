/**
 * Created by chenjie on 2015/7/12.
 */

var async = require('async')
var wsqApi = require('../interface/wsqApi.js')
var tools       = require('../tools');
var redisClient = tools.redisClient();
var _ = require('underscore')

redisClient.LRANGE("lottery-rank-wx33dc1a5264b4e846", 0, 50, function(err, arr){
    async.eachSeries(arr, function(o, done){
        var doc = JSON.parse(o)
        if (!doc.dateTime){
            doc.dateTime = new Date()
        }
        if (_.isNumber(doc.dateTime)){
            doc.dateTime = new Date(doc.dateTime)
        }
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
            done()
        })
    }, function(err){
        console.log('success')
    })
});