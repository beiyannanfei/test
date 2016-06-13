/**
 * Created by wyq on 2015/9/18.
 */
var tools = require("../tools");
var redisClient = tools.redisClient();
var async = require("async");
var _ = require("underscore");
redisClient.select(12, function () {
    console.log("库存切换到database12");
});

var key = "prizeStock";

exports.saveShoppingCode = function (id, shoppingCode, cb) {
    var key = id.toString();
    redisClient.DEL(key, function (err) {
        async.each(shoppingCode, function (o, cb) {
            redisClient.RPUSH(key, o, function (err, results) {
                cb(err);
            });
        }, function (err) {
            cb(err);
        });
    });
};

exports.saveCount = function (id, count, cb) {
    var field = id.toString();
    redisClient.HSET(key, field, count, function (err, results) {
        return cb(err, results);
    });
};

exports.getCount = function (id) {
    return new Promise(function (resolve, reject) {
        redisClient.HGET(key, id.toString(), function (err, count) {
            if (!!err) {
                return reject(err);
            }
            return resolve(count);
        });
    })
};

exports.getShoppingCodes = function (id) {
    return new Promise(function (resolve, reject) {
        redisClient.LRANGE(id.toString(), 0, -1, function (err, arr) {
            if (!!err) {
                return reject(err);
            }
            return resolve(arr);
        });
    })
};

