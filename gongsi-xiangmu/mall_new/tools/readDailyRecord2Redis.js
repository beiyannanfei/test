/**
 * Created by userName on 2015/8/5.
 */
var dbUtils = require('../mongoSkin/mongoUtils.js');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var tools = require('../tools');
var redisClient = tools.pvAndUvRedisClient();
var async = require('async');
var dailyRecordCollection = new dbUtils('dailyrecords');

var readDbDate2Redis = function () {
    var index = 0;
    var readFlag = true;
    var preReadCount = 100;  //每次从数据库中读取的数据条数
    console.time("read data use time");
    async.whilst(
        function () {
            return readFlag;
        },
        function (cb) {
            dailyRecordCollection.findNoCache({}, {}, {skip: index * preReadCount, limit: preReadCount}, function (err, datas) {
                ++index;
                if (datas.length <= 0) {
                    readFlag = false;
                    console.timeEnd("read data use time");
                    logger.info("*********数据读取完毕");
                    return cb("no data");
                }
                logger.info("*********%j read data index: %j", new Date().toLocaleString(), index);
                setData2Redis(datas);
                cb(err);
            })
        },
        function (err) {
            logger.info('err: ', err);
        }
    );
};

var setData2Redis = function (docs) {
    var key = "count_pv_and_uv";    //redis key
    var pvKey = "count_pv";         //统计pv的key
    for (var index in docs) {
        var data = docs[index];
        var type = data.type||"";   //类型
        var dateString = data.dateString||"";   //统计类型
        var sourceId = data.sourceId||"";       //sourceId
        if (dateString == "total") {        //总统计数
            var totalField = type + "_" + sourceId + "_" + "total";
            var openIdList = data.ext.openIds||[];      //openid集合
            var pvNum = +(data.ext.total||0);             //当前的总pv
            writeRedis(pvKey, totalField, openIdList, key, pvNum);
        }
        /*else {
            //写入某一天
            var dayField = type + "_" + sourceId + "_" + dateString;
            var dayOpenIdList = data.ext.openIds||[];   //当天openid集合
            var dayPvNum = +(data.ext.total||0);        //当天总pv
            writeRedis(pvKey, dayField, dayOpenIdList, key, dayPvNum);
        }*/
    }
};

var writeRedis = function(pvKey, field, openId, key, pvNum) {
    redisClient.HINCRBY(pvKey, field, pvNum, function (err, pvData) {  //首先对总数的pv加1
        if (!!err) {
            return logger.error("HINCRBY err: %j", err);
        }
        var totalPv = +pvData;   //返回值即总pv
        redisClient.SADD(field, openId, function (err, sadd) {      //将openid存入set，自动去重
            if (!!err) {
                return logger.error("SADD err: %j", err);
            }
            redisClient.SCARD(field, function (err, uvData) {       //获取openid的数量，即uv
                if (!!err) {
                    return logger.error("SCARD err: %j", err);
                }
                var totalUv = +uvData;  //返回值即总uv
                var doc = {pv: totalPv, uv: totalUv};
                redisClient.HSET(key, field, JSON.stringify(doc), function (err, doc) {    //将总pv uv存入另一个哈希
                    if (!!err) {
                        return logger.error("SCARD err: %j", err);
                    }
                    logger.info("write success");
                });
            });
        });
    });
};

readDbDate2Redis();














