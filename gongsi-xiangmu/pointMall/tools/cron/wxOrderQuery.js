/**
 * Created by chenjie on 2015/5/11.
 */

/**
 * Created by chenjie on 2014/10/14.
 */

var _ = require('underscore');
var async = require('async');

var wxPay = require('../../routes/wxPay.js');
var models = require('../../models')
var WxOrder    = models.WxOrder;

var CronJob     = require('cron').CronJob;

function start(){
    console.log('start')
    var now = new Date().getTime()
    var lowerTime = new Date(now - 30 * 60 * 1000)
    var condition = {dateTime: {$lt: lowerTime}, state: "new"};
    console.log(condition)
    WxOrder.find(condition, function(err, docs){
        if (err){
            console.log('err:' + err)
            return;
        }
        console.log(docs)
        async.eachSeries(docs, function(o, callback){
            wxPay.closeOrder(o, function(err){
                callback()
            })
        }, function(err){
            console.log(err)
        })
    })
}

new CronJob('0 */30 * * * *', function(){
    start()
}, null, true)
