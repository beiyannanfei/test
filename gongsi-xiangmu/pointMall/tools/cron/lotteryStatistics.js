/**
 * Created by chenjie on 2014/10/14.
 */

var _ = require('underscore');
var async = require('async');

var models = require('../../models')
var LotteryStatistics = models.LotteryStatistics;
var Lottery = models.Lottery;

var CronJob     = require('cron').CronJob;

var DAY_MILLION = 24 * 60 * 60 * 1000;

var statisticsLottery = function(condition, done){
    condition.activityId = {$exists: true}
    var findPrizeTotal = function(){
        var $group = {
            _id: {year: {$year: "$dateTime"}, month: {"$month":"$dateTime"}, day: {$dayOfMonth: "$dateTime"}, hour: {$hour: "$dateTime"}, token: "$token", activityId: "$activityId", prizeId: "$prizeId"},
            openIds: {$addToSet: "$openId"}, prizeCount: {$sum: 1}
        }

        Lottery.aggregate({$match: condition}, {$group: $group}, function(err, docs){
            if (err){
                console.log(err);
                return final()
            } else{
                calculateTotal(docs)
            }
        })
    }

    var calculateTotal = function(docs){
        var result = {}
        _.each(docs, function(o){
            var dateTime = null;
            if (o._id.hour >= 24 - 8){
                o._id.hour += 8 - 24
                dateTime = new Date(o._id.year, o._id.month - 1, o._id.day + 1)
            } else {
                o._id.hour += 8
                dateTime = new Date(o._id.year, o._id.month - 1, o._id.day)
            }

            if (!result[o._id.token]){
                result[o._id.token] = {}
            }
            if (!result[o._id.token][dateTime]){
                result[o._id.token][dateTime] = {
                    token: o._id.token,
                    dateTime: dateTime,
                    openIds: [],
                    numberPeople: 0,
                    numberLottery: 0,
                    hour: {},
                    prize: {},
                    activity: {}
                }
            }
            result[o._id.token][dateTime].openIds.push(o.openIds)
            result[o._id.token][dateTime].openIds = _.flatten(result[o._id.token][dateTime].openIds)
            result[o._id.token][dateTime].numberPeople += o.openIds.length
            result[o._id.token][dateTime].numberLottery += o.prizeCount

            if (!result[o._id.token][dateTime].prize[o._id.prizeId]){
                result[o._id.token][dateTime].prize[o._id.prizeId] = {numberPeople: 0, openIds: [], numberLottery:0, prizeId: o._id.prizeId}
            }
            result[o._id.token][dateTime].prize[o._id.prizeId].openIds.push(o.openIds)
            result[o._id.token][dateTime].prize[o._id.prizeId].openIds = _.flatten(result[o._id.token][dateTime].prize[o._id.prizeId].openIds)
            result[o._id.token][dateTime].prize[o._id.prizeId].numberPeople += o.openIds.length
            result[o._id.token][dateTime].prize[o._id.prizeId].numberLottery += o.prizeCount

            if (!result[o._id.token][dateTime].hour[o._id.hour]){
                result[o._id.token][dateTime].hour[o._id.hour] = {numberPeople: 0, openIds: [], numberLottery:0, hour: o._id.hour, activity: {}}
            }
            result[o._id.token][dateTime].hour[o._id.hour].openIds.push(o.openIds)
            result[o._id.token][dateTime].hour[o._id.hour].openIds = _.flatten(result[o._id.token][dateTime].hour[o._id.hour].openIds)
            result[o._id.token][dateTime].hour[o._id.hour].numberPeople += o.openIds.length
            result[o._id.token][dateTime].hour[o._id.hour].numberLottery += o.prizeCount
            if (!result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId]){
                result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId] = {numberPeople: 0, openIds: [], numberLottery:0, activityId: o._id.activityId}
            }
            result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId].openIds.push(o.openIds)
            result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId].openIds = _.flatten(result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId].openIds)
            result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId].numberPeople += o.openIds.length
            result[o._id.token][dateTime].hour[o._id.hour].activity[o._id.activityId].numberLottery += o.prizeCount

            if (!result[o._id.token][dateTime].activity[o._id.activityId]){
                result[o._id.token][dateTime].activity[o._id.activityId] = {numberPeople: 0, openIds: [], numberLottery:0, activityId: o._id.activityId, prize: {}}
            }
            result[o._id.token][dateTime].activity[o._id.activityId].openIds.push(o.openIds)
            result[o._id.token][dateTime].activity[o._id.activityId].openIds = _.flatten(result[o._id.token][dateTime].activity[o._id.activityId].openIds)
            result[o._id.token][dateTime].activity[o._id.activityId].numberPeople += o.openIds.length
            result[o._id.token][dateTime].activity[o._id.activityId].numberLottery += o.prizeCount
            if (!result[o._id.token][dateTime].activity[o._id.activityId].prize[o._id.prizeId]){
                result[o._id.token][dateTime].activity[o._id.activityId].prize[o._id.prizeId] = 0
            }
            result[o._id.token][dateTime].activity[o._id.activityId].prize[o._id.prizeId] += o.prizeCount
        })

        final(_.values(result))
    }

    var final = function(result){
        var arr = []
        _.each(result, function(o){
            var objects = _.values(o)
            _.each(objects, function(obj){
                obj.hour = _.values(obj.hour)
                _.each(obj.hour, function(h){
                    h.activity = _.values(h.activity)
                });
                obj.prize = _.values(obj.prize)
                obj.activity = _.values(obj.activity)
                arr.push(obj)
            })
        })
        async.eachSeries(arr, function(o, callback){
            LotteryStatistics.findOneAndUpdate({token: o.token, dateTime: o.dateTime}, {$set: o}, {upsert: true}, function(err){
                if (err){
                    console.log('insert or update err:' + err);
                }
                callback()
            })
        }, function(err){
            done();
        })
    }

    findPrizeTotal();
}

var startDailyStatistics = function(){
    console.log('start startDailyStatistics!')
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth()
    var day = now.getDate()
    var endTime = new Date(year, month, day)
    var startTime = new Date(endTime.getTime() - DAY_MILLION)
    var condition = {
        dateTime: {
            $gte: startTime,
            $lt: endTime
        }
    }
    statisticsLottery(condition, function(){
        console.log('startDailyStatistics success!')
    })
}

var startRealTimeStatistics = function(){
    console.log('start startRealTimeStatistics!')
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth()
    var day = now.getDate()
    var startTime = new Date(year, month, day)
    var condition = {
        dateTime: {
            $gte: startTime
        }
    }
    statisticsLottery(condition, function(){
        console.log('startRealTimeStatistics success!')
    })
}

/*new CronJob('0 *!/59 * * * *', function(){
    startRealTimeStatistics()
}, null, true)*/

new CronJob('0 0 2 * * *', function(){
    startDailyStatistics()
}, null, true)

/*statisticsLottery({}, function(){
    console.log('startAllStatistics success!')
})*/
