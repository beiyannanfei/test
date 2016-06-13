/**
 * Created by chenjie on 2015/7/5.
 */

var tools       = require('../tools');
var async       = require('async');
var redisClient = tools.lotteryRedis();
redisClient.select(5, function() {
    console.log('消费码切换到database 5');
});

var _ = require('underscore');

exports.saveCount = function(id, count, cb){
    var key = id

    redisClient.HSET('prizeStock', key, count, function(err){cb?cb():""})
}

exports.changeCount = function(id, count, cb){
    var key = id

    redisClient.HINCRBY('prizeStock', key, count, function(err, v){
        cb(err, v)
    })
}

exports.getCountMap = function(ids, cb){
    var map = {}
    if (ids && ids.length == 0){
        return cb(map)
    }
    redisClient.HMGET('prizeStock', ids, function(err, arr){
        _.each(ids, function(o, i){
            map[o.toString()] = arr[i]?parseInt(arr[i], 10):0
        })
        return cb(map)
    })
}

exports.getCount = function(id, cb){
    var key = id
    redisClient.HGET('prizeStock', key, function(err, count){
        if (err){
            cb(0)
        } else {
            var count = parseInt(count, 10)
            if (count){
                cb(count)
            } else {
                cb(0)
            }
        }
    })
}

exports.saveShoppingCard = function(id, shoppingCards, cb){
    var key = id

    redisClient.del(key, function(err){
        _.each(shoppingCards, function(o){
            redisClient.RPUSH(key, o, function(err){

            })
        })
    })
}

// [ 'b', 'c', 'd', 'a' ]
exports.getShoppingCards = function(id, cb){
    redisClient.LRANGE(id, 0, -1, function(err, arr){
        cb(err, arr)
    })
}

exports.popShoppingCards = function(id, cb){
    redisClient.LPOP(id, function(err, value){
        cb(err, value)
    })
}

exports.getCountShoppingCards = function(ids, cb){
    var map = {}
    async.eachSeries(ids, function(id, done){
        redisClient.LLEN(id, function(err, value){
            if (!value){
                value = 0
            }
            map[id] = value
            done()
        })
    }, function(err){
        cb(map)
    })
}