/**
 * Created by chenjie on 2015/1/22.
 */

//Model.collection.insert(docs, options, callback)

var moment = require('moment')
var models = require('../models/index');
var DailyRecord = models.DailyRecord;
var tools = require('../tools');
var redisClient = tools.pvAndUvRedisClient();
var async = require('async');


exports.saveRecord = function (type, sourceId, openId) {  //将pv uv 存放到redis中
    if (!type) {
        return console.error("daily record type is undefine");
    }

    if (!sourceId) {
        return console.error("daily record sourceId is undefine");
    }

    if (!openId) {
        return console.error("daily record openId is undefine");
    }
    var now = new Date();
    var key = "count_pv_and_uv";                                                        //redis key
    var totalField = type + "_" + sourceId + "_" + "total";                             //总数field&uvKey
    var dataField = type + "_" + sourceId + "_" + moment(now).format('YYYYMMDD');      //某天field&uvKey
    var hourField = type + "_" + sourceId + "_" + moment(now).format('YYYYMMDDHH');    //某个小时field&uvKey

    var pvKey = "count_pv";     //统计pv的key

    console.log("******  key: %j, totalField: %j, dataField: %j, hourField: %j", key, totalField, dataField, hourField);
    async.parallel([
        function (cb) {
            redisClient.HINCRBY(pvKey, totalField, 1, function (err, pvData) {  //首先对总数的pv加1
                if (!!err) {
                    return cb(err, pvData);
                }
                var totalPv = +pvData;   //返回值即总pv
                redisClient.SADD(totalField, openId, function (err, sadd) {      //将openid存入set，自动去重
                    if (!!err) {
                        return cb(err, sadd)
                    }
                    redisClient.SCARD(totalField, function (err, uvData) {       //获取openid的数量，即uv
                        if (!!err) {
                            return cb(err, uvData);
                        }
                        var totalUv = +uvData;  //返回值即总uv
                        var doc = {pv: totalPv, uv: totalUv};
                        redisClient.HSET(key, totalField, JSON.stringify(doc), function (err, doc) {    //将总pv uv存入另一个哈希
                            cb(err, doc);
                        });
                    });
                });
            });
        },
        function (cb) {
            redisClient.HINCRBY(pvKey, dataField, 1, function (err, pvData) {  //首先对总数的pv加1
                if (!!err) {
                    return cb(err, pvData);
                }
                var totalPv = +pvData;   //返回值即总pv
                redisClient.SADD(dataField, openId, function (err, sadd) {      //将openid存入set，自动去重
                    if (!!err) {
                        return cb(err, sadd)
                    }
                    redisClient.SCARD(dataField, function (err, uvData) {       //获取openid的数量，即uv
                        if (!!err) {
                            return cb(err, uvData);
                        }
                        var totalUv = +uvData;  //返回值即总uv
                        var doc = {pv: totalPv, uv: totalUv};
                        redisClient.HSET(key, dataField, JSON.stringify(doc), function (err, doc) {    //将总pv uv存入另一个哈希
                            cb(err, doc);
                        });
                    });
                });
            });
        },
        function (cb) {
            redisClient.HINCRBY(pvKey, hourField, 1, function (err, pvData) {  //首先对总数的pv加1
                if (!!err) {
                    return cb(err, pvData);
                }
                var totalPv = +pvData;   //返回值即总pv
                redisClient.SADD(hourField, openId, function (err, sadd) {      //将openid存入set，自动去重
                    if (!!err) {
                        return cb(err, sadd)
                    }
                    redisClient.SCARD(hourField, function (err, uvData) {       //获取openid的数量，即uv
                        if (!!err) {
                            return cb(err, uvData);
                        }
                        var totalUv = +uvData;  //返回值即总uv
                        var doc = {pv: totalPv, uv: totalUv};
                        redisClient.HSET(key, hourField, JSON.stringify(doc), function (err, doc) {    //将总pv uv存入另一个哈希
                            cb(err, doc);
                        });
                    });
                });
            });
        }
    ], function (err, results) {
        console.log("err: %j, results: %j", err, results);
    });
    /*return;
     if (!type){
     return console.log('daily record not type')
     }
     if (!sourceId){
     return console.log('daily record not sourceId')
     }

     if (!openId){
     return console.log('daily record not openId')
     }
     var now = new Date()
     var dataString = moment(now).format('YYYYMMDD')
     var hour = now.getHours()

     var updateDayRecord = function(){
     var SPEC = {
     type: type,
     sourceId: sourceId,
     dateString: dataString
     }

     var UPDATE_SPEC = {
     $set: {
     type: type,
     sourceId: sourceId,
     dateString: dataString
     },
     $inc: {
     'ext.total': 1
     },
     $addToSet: {
     'ext.openIds': openId
     }
     }
     UPDATE_SPEC.$inc['ext.' + hour + '.count'] = 1
     UPDATE_SPEC.$addToSet['ext.' + hour + '.openIds'] = openId
     DailyRecord.collection.findAndModify(SPEC, {}, UPDATE_SPEC, {upsert: true, safe: true}, function(err, doc){
     if (err){
     console.log(err);
     } else {
     updateTotalRecord()
     }
     });
     }

     var updateTotalRecord = function(){
     var SPEC = {
     type: type,
     sourceId: sourceId,
     dateString: 'total'
     }

     var UPDATE_SPEC = {
     $set: {
     type: type,
     sourceId: sourceId,
     dateString: 'total'
     },
     $inc: {
     'ext.total': 1
     },
     $addToSet: {
     'ext.openIds': openId
     }
     }
     DailyRecord.collection.findAndModify(SPEC, {}, UPDATE_SPEC, {upsert: true, safe: true}, function(err, doc){
     if (err){
     console.log(err);
     } else {

     }
     });
     }
     updateDayRecord()*/
};

exports.getPvAndUv = function (keys, fieldList, callback) {  //获取pv uv数据
    redisClient.HMGET(keys, fieldList, function (err, datas) {
        return callback(err, datas);
    });
};