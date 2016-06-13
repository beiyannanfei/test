/**
 * Created by chenjie on 2015/8/13.
 */

var redisCache = require('../dal/redis_cache');

exports.set = function(key, seconds, value, cb){
    redisCache.setKeyExpire(key, seconds, JSON.stringify(value), cb);
}

exports.del = function(key, cb){
    redisCache.del(key, cb);
}

exports.get = function(key, cb){
    redisCache.get(key, cb);
}

