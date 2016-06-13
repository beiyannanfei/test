var tools       = require('../tools');
var cacheRedisList = tools.cacheRedis();
var cache = 0

function getRedis(key){
    var len = cacheRedisList.length;
    var rate = Math.floor((128 - 48) / len)
    var code = key[0].charCodeAt() - 48
    if (code < 0){
        code = 0
    }
    var range = Math.round(code / rate)
    if (range > len - 1){
        range = len - 1
    }
    console.log('select cache redis key:' + key + ', rate:' + rate + ', range:' + range)
    return cacheRedisList[range]
}

module.exports = {
    expire: 60 * 60,
    get: function(key, cb) {
        if (!cache){
            return cb('not cached')
        }
        var expire = this.expire
        getRedis(key).get(key, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                cb('no cache');
            } else if (value) {
                cb(null, JSON.parse(value, function(k , v){
                    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(v)){
                        v = new Date(Date.parse(v))
                    }
                    return v
                }));
                getRedis(key).expire(key, expire)
            }
        });
    },
    getMulti: function(collection, key, cb) {
        if (!cache){
            return cb('not cached')
        }
        getRedis(collection).HGET(collection, key, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                cb('no cache');
            } else if (value) {
                cb(null, JSON.parse(value, function(k , v){
                    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(v)){
                        v = new Date(Date.parse(v))
                    }
                    return v
                }));
            }
        });
    },
    delMulti: function(collection, cb) {
        if (!cache){
            return cb?cb('err'):''
        }
        getRedis(collection).del(collection, function(err){cb?cb(err):''});
    },
    del: function(key, cb) {
        if (!cache){
            return cb?cb('err'):''
        }
        getRedis(key).del(key, function(err){cb?cb(err):''});
    },
    set: function(key, value, cb) {
        if (!cache){
            return cb?cb('cache is close'):''
        }
        getRedis(key).setex(key, this.expire, value, function(err){cb?cb(err):''});
    },
    setMulti: function(collection, key, value, cb) {
        if (!cache){
            return cb?cb('cache is close'):''
        }
        getRedis(collection).HSET(collection, key, value, function(err){cb?cb(err):''});
    },
    setKeyExpire: function(key, expire, value, cb) {
        if (!cache){
            return cb?cb('cache is close'):''
        }
        getRedis(key).setex(key, expire, value, function(err){cb?cb(err):''});
    }
}