/**
 * Created by yanqiang.Wang on 2015/9/8.
 */
var tools = require('../tools');
var redisClient = tools.redisClient();
var async = require("async");
var _ = require("underscore");
var typeConfig = require('./typeConfig.js');
redisClient.select(9, function () {
    console.log('消费码切换到database 9');
});

exports.saveShoppingCard = function (id, shoppingCards, cb) {
    var key = id.toString();
    redisClient.DEL(key, function (err) {
        async.each(shoppingCards, function (o, cb) {
            redisClient.RPUSH(key, o, function (err, results) {
                cb(err);
            })
        }, function (err) {
            cb(err);
        });
    });
};

exports.pushShoppingCard = function (id, shoppingCard, cb) {
    var key = id.toString();
    redisClient.RPUSH(key, shoppingCard, function(err, results) {
        cb(err, results);
    })
};

exports.saveCount = function (id, count, cb) {
    var field = id.toString();
    redisClient.HSET("prizeStock", field, count, function (err, results) {
        return cb(err, results);
    });
};

exports.getCount = function (id, cb) {
    var field = id.toString();
    redisClient.HGET("prizeStock", field, function (err, count) {
        if (!!err) {
            return cb(0);
        }
        count = +count;
        if (count) {
            return cb(count);
        }
        return cb(0);
    });
};

exports.getCountMap = function (ids, cb) {
    var map = {};
    if (!ids || ids.length == 0) {
        return cb(map);
    }
    redisClient.HMGET("prizeStock", ids, function (err, datas) {
        if (!!err) {
            return cb(map);
        }
        _.each(ids, function (o, i) {
            map[o.toString()] = datas[i] ? +datas[i] : 0;
        });
        return cb(map);
    });
};

exports.delGoodsReidis = function (type, id) {
    var cardKey = id.toString();
    if (type == typeConfig.goods.type.shoppingCard) {
        redisClient.DEL(cardKey, function (err) {
        });
    }
    else {
        redisClient.HDEL(key, cardKey, function (err) {
        });
    }
};

exports.popShoppingCards = function (id, cb) {
    var key = id.toString();
    redisClient.LPOP(key, function (err, value) {
        cb(err, value);
    });
};

exports.changeCount = function (id, count, cb) {
    var field = id.toString();
    redisClient.HINCRBY("prizeStock", field, count, function (err, v) {
        if (v && v <= -1){
            redisClient.HSET("prizeStock", field, 0, function (err) {});
        }
        cb(err, v)
    });
};

exports.getShoppingCards = function (id, cb) {
    var key = id.toString();
    redisClient.LRANGE(key, 0, -1, function (err, arr) {
        cb(err, arr);
    });
};

exports.getCountShoppingCards = function (ids, cb) {
    var map = {};
    async.each(ids, function (id, done) {
        redisClient.LLEN(id, function (err, value) {
            if (!value) {
                value = 0
            }
            map[id] = value;
            done();
        })
    }, function (err) {
        cb(err, map);
    })
};


exports.getShoppingCardLen = function (id, cb) {
    var key = id.toString();
    redisClient.LLEN(key, function (err, value) {
        if (!value){
            value = 0
        }
        return cb(err, value);
    });
};











