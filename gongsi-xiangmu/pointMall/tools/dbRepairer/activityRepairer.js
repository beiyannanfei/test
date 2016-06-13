/**
 * Created by chenjie on 2014/10/15.
 */

var _ = require('underscore');
var async = require('async');

var ut = require('../../routes/utils');
var models = require('../../models')
var Activity = models.Activity;

function exit(msg){
    console.log(msg)
    setTimeout(function(){
        process.exit(-1)
    }, 2000)
}

var start = function(){
    Activity.find({startTime: {$exists: false}, endTime: {$exists: false}}, function(err, docs){
        if (err){
            exit(err);
        } else {
            async.eachSeries(docs, function(doc, callback){
                dealActivity(doc, callback);
            }, function(err){
                exit('repairer success!')
            })
        }
    })
}

var dealActivity = function(doc, done){
    doc = ut.doc2Object(doc)
    var needDelete = false;
    _.each(doc.prizes, function(o){
        if (!o.rating){
            needDelete = true;
        }
    })

    if (doc.lotteryC == 'percent'){
        needDelete = true;
    }

    if (needDelete){
        return update(doc, {deleted: true}, done)
    }

    var UPDATE_SPEC = {}
    UPDATE_SPEC.startTime = doc.dateTime
    var now = new Date();
    if (doc.active){
        UPDATE_SPEC.endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
    } else {
        var end = now.getTime() > (doc.dateTime.getTime() + 60 * 60 * 1000)? (doc.dateTime.getTime() + 60 * 60 * 1000):now.getTime();
        UPDATE_SPEC.endTime = new Date(end)
    }
    UPDATE_SPEC.info = '1, 欢迎来到抽奖俱乐部';

    var prizes = []
    _.each(doc.prizes, function(o){
        var prize = {id: o.id, rating: o.rating}
        if (o.defaultP){
            prize.p = o.defaultP
            prize.isDefault = true
        } else {
            if (o.time && o.time.length > 0){
                prize.time = o.time
            } else if (o.count >= 0){
                prize.count = o.count
                prize.day = 1
            }
            if (o.shoppingCards && o.shoppingCards.length > 0){
                prize.shoppingCards = o.shoppingCards
                prize.shoppingCardIndex = o.shoppingCardIndex
            }
        }
        prizes.push(prize)
    })
    UPDATE_SPEC.prizes = prizes
    return update(doc, UPDATE_SPEC, done)
}

var update = function(doc, UPDATE_SPEC, done){
    Activity.findByIdAndUpdate(doc._id, {$set: UPDATE_SPEC}, done);
}

start()