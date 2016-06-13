/**
 * Created by chenjie on 2015/7/14.
 */


var tools       = require('../tools/index');
var _                 = require("underscore");
var queueClient = tools.queueRedis();

// key:  lottery_id 红包抽奖Id
//只存1元红包
exports.push = function(lottery_id){
    queueClient.rpush('pre-redpager', JSON.stringify({lottery_id: lottery_id, time: new Date().getTime()}))
}

exports.push100 = function(lottery_id){
    queueClient.rpush('pre-redpager-100', JSON.stringify({lottery_id: lottery_id, time: new Date().getTime()}))
}

exports.getLength = function(cb){
    queueClient.LLEN('pre-redpager', function(err, len){
        cb(err, len)
    })
}

exports.getLength100 = function(cb){
    queueClient.LLEN('pre-redpager-100', function(err, len){
        cb(err, len)
    })
}

exports.getPreCount = function(cb){
    queueClient.get('pre-redpager-count', function(err, count){
        cb(err, count)
    })
}

exports.getPreCount100 = function(cb){
    queueClient.get('pre-redpager-count-100', function(err, count){
        cb(err, count)
    })
}

exports.setPreCount = function(count){
    queueClient.set('pre-redpager-count', count, function(err){

    })
}

exports.pop = function(cb){
    queueClient.LPOP('pre-redpager', function(err, lottery){
        if (err){
            cb(err)
        } else if (lottery){
            var o = JSON.parse(lottery)
            if (new Date().getTime() - o.time > 72 * 60 * 60 * 1000){
                exports.pop(cb);
            } else{
                cb(null, o.lottery_id)
            }
        } else {
            cb('red redis is empty');
        }
    })
}

exports.pop100 = function(cb){
    queueClient.LPOP('pre-redpager-100', function(err, lottery){
        if (err){
            cb(err)
        } else if (lottery){
            var o = JSON.parse(lottery)
            if (new Date().getTime() - o.time > 72 * 60 * 60 * 1000){
                exports.pop(cb);
            } else{
                cb(null, o.lottery_id)
            }
        } else {
            cb('red redis is empty');
        }
    })
}