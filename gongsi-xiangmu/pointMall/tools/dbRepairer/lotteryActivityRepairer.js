/**
 * Created by chenjie on 2014/10/15.
 */

var _ = require('underscore');
var async = require('async');

var models = require('../../models')
var Lottery = models.Lottery;
var Activity = models.Activity;

var start = function(){
    var count = 0;
    Lottery.aggregate({$match: {lotteryEvent: null, activityId: null}}, {$group: {_id: {token: "$token", score: "$score"}}}, function(err, docs){
        console.log(docs.length)
        if (err){
            return console.log(err)
        }
        var activityMap = {}
        async.eachSeries(docs, function(doc, callback){
            console.log(++count)
            if (activityMap[doc._id.token + '' + doc._id.score]){
                updateLottery(doc, activityMap[doc._id.token + '' + doc._id.score]._id.toString(), function(){
                    callback()
                })
            } else {
                Activity.find({token: doc._id.token, score: doc._id.score}, {_id: 1}, {sort: {dateTime: -1}}, function(err, activities){
                    if (activities.length == 0){
                        Activity.find({token: doc._id.token}, {_id: 1}, {sort: {dateTime: -1}}, function(err, activities){
                            activityMap[doc._id.token + '' + doc._id.score] = activities[0];
                            updateLottery(doc, activityMap[doc._id.token + '' + doc._id.score]._id.toString(), function(){
                                callback()
                            })
                        });
                    } else{
                        activityMap[doc._id.token + '' + doc._id.score] = activities[0];
                        updateLottery(doc, activityMap[doc._id.token + '' + doc._id.score]._id.toString(), function(){
                            callback()
                        })
                    }
                })
            }
        }, function(err){
            console.log('repairer success!')
        })
    })
}

var updateLottery = function(doc, activityId, done){
    Lottery.update({token: doc._id.token, score: doc._id.score}, {$set: {activityId: activityId}}, {multi: true}, function(err){
        if (err){
            console.log('update lottery err:', err)
        }
        done()
    })
}

start()