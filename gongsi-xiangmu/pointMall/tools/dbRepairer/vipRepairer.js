/**
 * Created by Administrator on 2015/1/4.
 */


var models = require('../../models/index');
var _ = require('underscore');
var async = require('async');
var mUser = require('../../routes/user.js');
var Lottery     = models.Lottery;
var Goods     = models.Goods;
var Users    = models.Users;

var updateUserToVip = function(token, openId, day, vipType, goodsId, count, time, cb){
    var _id = token + '_' + openId
    var UPDATE_SPEC = {$set: {}}
    Users.findById(_id, function(err, user){
        if (user){
            if (vipType == 'demand'){
                return cb()
                console.log(user.vip)
                var key = 'vip.' + vipType
                if (user.vip && user.vip[vipType] && user.vip[vipType].endDate){
                    if (user.vip[vipType].endDate.getTime() > new Date().getTime()){
                        UPDATE_SPEC.$set[key] = {endDate: new Date(user.vip[vipType].endDate.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    } else{
                        UPDATE_SPEC.$set[key] = {endDate: new Date(time.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    }
                } else {
                    UPDATE_SPEC.$set[key] = {endDate: new Date(time.getTime() + day * count * 24 * 60 * 60 * 1000)}
                }
            } else if (vipType == 'forums') {
                var key = 'vip.' + vipType + '.' + goodsId
                if (user.vip && user.vip[vipType] && user.vip[vipType][goodsId] && user.vip[vipType][goodsId].endDate){
                    if (user.vip[vipType][goodsId].endDate.getTime() > new Date().getTime()){
                        UPDATE_SPEC.$set[key] = {endDate: new Date(user.vip[vipType][goodsId].endDate.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    } else{
                        UPDATE_SPEC.$set[key] = {endDate: new Date(time.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    }
                } else {
                    UPDATE_SPEC.$set[key] = {endDate: new Date(time.getTime() + day * count * 24 * 60 * 60 * 1000)}
                }
            }
            console.log(openId)
            console.log(UPDATE_SPEC)
            Users.findByIdAndUpdate(_id, UPDATE_SPEC, function(err, o){
                cb()
            })
        } else {
            cb()
        }
    })
}

var condition = {
    prizeType: 105,
    state : {$nin: ['refund', 'deleted']}
}
Lottery.find(condition, function(err, docs){
    console.log(docs.length)
    var goodsMap = {}
    Goods.find({_id: {$in: _.pluck(docs, 'prizeId')}}, function(err, goods){
        _.each(goods, function(obj){
            goodsMap[obj._id.toString()] = obj
        })
        async.eachSeries(docs, function(o, callback){
            console.log(o.dateTime)
            var count = o.count?o.count:1
            var day = o.day?o.day:goodsMap[o.prizeId].ext.expireDay
            console.log(day)
            console.log(count)
            if (count * day * 24 * 60 * 60 * 1000 < new Date().getTime() - o.dateTime.getTime()){
                return callback();
            }

            updateUserToVip(o.token, o.openId, day, goodsMap[o.prizeId].ext.vipType, goodsMap[o.prizeId]._id.toString(), count, o.dateTime, function(err){
                callback();
            })
        },function(err){
            console.log('success');
        })
    })
})