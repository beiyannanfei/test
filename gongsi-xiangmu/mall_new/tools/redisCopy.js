/**
 * Created by wyq on 2015/9/1.
 */
var redis = require("redis");
var async = require("async");
var _ = require("underscore");


var sourceRedisConf = {hosts: "10.10.42.25", port: 6379};
var destRedisConf   = {hosts: "127.0.0.1", port: 6379};


var sourceRedisClient = redis.createClient(sourceRedisConf.port, sourceRedisConf.hosts);
var destRedisClient = redis.createClient(destRedisConf.port, destRedisConf.hosts);


var key = "count_pv_and_uv";    //redis key
var pvKey = "count_pv";         //统计pv的key

var sourcePvKeyList;
var sourcePvValList;
async.auto({
    "GetSourceAllPv": function (cb) {   //获取源redis的所有pv
        sourceRedisClient.HGETALL(pvKey, function (err, allPvList) {
            if (!!err) {
                return cb(err);
            }
            if (!allPvList) {
                return cb("source pv list is null");
            }
            sourcePvKeyList = _.keys(allPvList);
            sourcePvValList = _.values(allPvList);
            return cb(err, "OK");
        });
    },
    "CopyPvAndUv": ["GetSourceAllPv", function (cb) {    //将source中pv复制到dest中
        var step = 0;
        async.whilst(
            function () {
                return step < sourcePvKeyList.length;
            },
            function (cb) {
                var totalField = sourcePvKeyList[step];
                var totalPv = sourcePvValList[step++];
                var finalPv = 0;
                var finalUv = 0;
                async.auto({
                    "GetAndSetPv": function (cb) {
                        destRedisClient.HGET(pvKey, totalField, function (err, destPv) {
                            if (!!err) {
                                console.error("get dest error: %j", err);
                                return cb(err);
                            }
                            finalPv = +destPv;
                            if (!destPv || (+totalPv) > (+destPv)) {    //当目标数据不存在或者值小于源数据时覆盖
                                destRedisClient.HSET(pvKey, totalField, +totalPv, function (err, result) {
                                    if (!!err) {
                                        console.error("set dest error: %j", err);
                                        return cb(err);
                                    }
                                    finalPv = +totalPv;
                                    //console.log("**** write dest pv success totalField: %j, totalPv: %j", totalField, totalPv);
                                    return cb(err, finalPv);
                                });
                            }
                            else {
                                return cb(err, finalPv);
                            }
                        });
                    },
                    "GetAndSetOpenId": function (cb) {
                        sourceRedisClient.SMEMBERS(totalField, function (err, openIdList) {
                            if (!!err) {
                                console.error("get copyOpenIdList err: %j", err);
                                return cb(err);
                            }
                            if (openIdList.length <= 0) {
                                return cb(null, "OK");
                            }
                            destRedisClient.SADD(totalField, openIdList, function (err, result) {
                                if (!!err) {
                                    console.error("set copyOpenIdList err: %j", err);
                                    return cb(err);
                                }
                                //console.log("**** write copyOpenIdList success totalField: %j, result: %j", totalField, result);
                                return cb(err, result);
                            });
                        });
                    },
                    "GetUv": ["GetAndSetOpenId", function (cb) {
                        destRedisClient.SCARD(totalField, function (err, uv) {
                            if (!!err) {
                                console.error("get uv error: %j", err);
                                return cb(err);
                            }
                            finalUv = +uv;
                            return cb(err, finalUv);
                        });
                    }],
                    "SetUvAndPv": ["GetAndSetPv", "GetUv", function (cb) {
                        var doc = {pv: finalPv, uv: finalUv};
                        destRedisClient.HSET(key, totalField, JSON.stringify(doc), function (err, data) {
                            if (!!err) {
                                console.error("SetUvAndPv error: %j, data: %j", err, data);
                                return cb(err);
                            }
                            return cb(err, doc);
                        });
                    }]
                }, function (err, result) {
                    if (!!err) {
                        console.error("appear error : %j, and already rollback", err);
                        --step;
                        return cb(null);
                    }
                    console.log("finish: %j, result: %j", step, result);
                    return cb(null);
                });
            },
            function (err) {
                if (!!err) {
                    console.error("copyPv error: %j", err);
                    return cb(err);
                }
                return cb(err, "OK");
            }
        );
    }]
}, function (err, results) {
    if (!!err) {
        return console.error("**** err: %j, results: %j", err, results);
    }
    console.log("\n\nfinal all results: %j", results);
    console.log("\n\n************************ SUCCESS ************************\n\n");
});










