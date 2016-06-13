var nimble      = require('nimble');
var models      = require('../models/index');
var tools       = require('../tools');

var redisClient = tools.redisClient();
var Goods       = models.Goods;

var redisHelper = require('./redis_helper');

var _SPEED       = redisHelper.speed;
var execDel      = redisHelper.execDel;


var stringify   = require('node-stringify');


module.exports = {
    count: function(condition, cb) {
        var redisKey = "GOODS_" + stringify(condition).split(' ').join('')
                        + "_MUTIL" + "_COUNT";

        //console.log(redisKey);

        redisClient.get(redisKey,function(err, value) {
            if (err) return cb(err);

            console.log("VALUE:" + value);
            if (!value) {
                Goods.find(condition).count(function(err, count) {
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + count);
                    console.log("FROM DB: ##"+redisKey+"##" + count);

                    cb(null, count);
                });
            } else if (value) {
                console.log("FROM Redis: ##"+redisKey+"##" + value);
                cb(null, parseInt(value));
            }
        });
    },
    find: function(condition, display, p3, cb) {
        var redisKey = "GOODS_" + stringify(condition).split(' ').join('')
                        + "_" + stringify(p3).split(' ').join('') + "_MUTIL";

        //console.log(redisKey);

        redisClient.get(redisKey, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                Goods.find(condition, display, p3, function(err, docs) {
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + JSON.stringify(docs));
                    console.log("FROM DB: ##"+redisKey+"##");

                    cb(null, docs);
                });
            } else if (value) {
                console.log("FROM Redis: ##"+redisKey+"##");

                cb(null, JSON.parse(value));
            }
        });
    },
    findOne: function(condition, display, cb) {
        var redisKey = "GOODS_" + stringify(condition).split(' ').join('') + "_SINGLE";

        redisClient.get(redisKey, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                Goods.findOne(condition, display, function(err, docs){
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + JSON.stringify(docs));
                    console.log("FROM DB: ##"+redisKey+"##");

                    cb(null, docs);
                });
            } else {
                console.log("FROM Redis: ##"+redisKey+"##");
                cb(null, JSON.parse(value));
            }
        });
    },
    update: function(condition, sets, isDelete, cb) {
        // include delete such as deleted:true

        // GOODS_*_MUTIL_COUNT
        // GOODS_*_MUTIL
        // GOODS_*_SINGLE


        //TODO: should be replace findByIdAndUpdate

        var redisKey_Mutil = 'GOODS_*_MUTIL*';

        if (!isDelete) redisKey_Mutil = 'GOODS_*_MUTIL';


        nimble.series([
            function(callback) {
                redisClient.keys(redisKey_Mutil, function(err, reply){
                    if (err) return cb(err);

                    execDel(reply, function(err) {
                       if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                redisClient.keys('GOODS_*_SINGLE', function(err, reply){
                    if (err) return cb(err);

                    execDel(reply, function(err) {
                        if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                Goods.update(condition, {$set:sets}, {multi: true}, function(err) {
                    if (err)
                        return cb(err);

                    cb(null);
                });
            }
        ]);
    },
    del: function(condition, cb) {
        // GOODS_*_MUTIL
        // GOODS_*_MUTIL_COUNT
        // the del == update because deleted=true
        // nothing to do
    },
    add: function(doc, cb) {
        // GOODS_*_MUTIL
        // GOODS_*_MUTIL_COUNT

        var redisKey_Mutil = 'GOODS_*_MUTIL*';

        nimble.series([
            function(callback) {
                redisClient.keys(redisKey_Mutil, function(err, reply){
                    if (err) return cb(err);

                    execDel(reply, function(err) {
                        if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                new Goods(doc).save(function(err, doc){
                    cb(err, doc);
                });
            }
        ]);
    }
};