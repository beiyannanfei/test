/**
 * Created by yanqiang.Wang on 2015/8/5.
 */
var dbUtils          = require('../mongoSkin/mongoUtils.js');
var ordersCollection = new dbUtils('countorder');
var async            = require('async');
var _                = require("underscore");
var httpUtils        = require('../interface/http-utils.js');
var config           = require('../config.js');
var tools = require('../tools');
var sysLotteryRedis = tools.sysLotteryRedis();
var anaApi = require('../interface/anaApi.js');
var moment = require('moment');

var index = 0;
var readFlag = true;
var preReadCount = 1;  //每次从数据库中读取的数据条数
console.time("read data use time");
async.whilst(
    function () {
        return readFlag;
    },
    function (cb) {
        ordersCollection.findNoCache(
            {"createTime": {$exists: 1}, "totalPeople": {$exists: 1}, "lotteryInfo": {$exists: 1}},
            {"createTime":1, "totalPeople":1, "lotteryInfo": 1},
            {skip: index * preReadCount, limit: preReadCount}, function(err, datas) {
            ++index;
            if (datas.length <= 0) {
                readFlag = false;
                console.timeEnd("read data use time");
                console.log("*********数据读取完毕");
                return cb("no data");
            }
            console.log("*********%j read data index: %j", new Date().toLocaleString(), index);
            distributionData(datas);
            cb(err);
        })
    },
    function (err) {
        console.log('err: ', err);
    }
);

var distributionData = function (datas) {
    for (var index in datas) {
        var data = datas[index];
        lotteryStatistics(data);
    }
};

var lotteryStatistics = function (doc) {
    //console.log(doc);
    var host = config.DS_HOST;
    host += "/php/index.php?c=Channel&a=save";
    var param = {
        token: "354e6b14b65b79ad",
        channel_id: 1782,
        number: doc.lotteryInfo.allUsersLength || 0,
        ptime:   new Date(doc.createTime).getTime(),
        contents: new Buffer(JSON.stringify(doc.lotteryInfo)).toString('base64'),
        ctime: moment(new Date(doc.createTime)).format("YYYY-MM-DD") //new Date(doc.lotteryInfo.createTime).toLocaleDateString()
    };
    console.log(param);
    console.log("[%j] fileName: %j reportLotteryPlan", new Date().toLocaleString(), __filename);
    anaApi.postLotteryPlan(host, param, function(err, result) {
        if (!!err) {
            sysLotteryRedis.lpush("reportlotteryplanbackup", JSON.stringify(param));
        }
    })
};




