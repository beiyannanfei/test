/**
 * Created by chenjie on 2015/7/9.
 */

var tools       = require('../tools');

var redisClient = tools.redisClient();

redisClient.select(7, function() {
    console.log('cache切换到database 7');
});

exports.set = function(key, seconds, value, cb){
    redisClient.setex(key, seconds, JSON.stringify(value), function(err){cb?cb(err):''});
}

exports.del = function(key, cb){
    redisClient.del(key, function(err){cb?cb(err):''});
}

exports.get = function(key, cb){
    redisClient.get(key, function(err, value){
        if (err){
            cb(err)
        } else {
            if (!value) {
                cb('no cache');
            } else {
                console.log('redis-cache-key:' + key)
                console.log('redis-cache:' + value)
                cb(null, JSON.parse(value, function(k , v){
                    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(v)){
                        v = new Date(Date.parse(v))
                    }
                    return v
                }));
            }
        }
    });
}