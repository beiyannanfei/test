/**
 * Created by userName.Wang on 2015/8/5.
 */
var async = require('async');
var _ = require("underscore");
var httpUtils = require('../interface/http-utils.js');
var config = require('../config.js');
var tools = require('../tools');
var sysLotteryRedis = tools.sysLotteryRedis();
var anaApi = require('../interface/anaApi.js');
var moment = require('moment');

var popFlag = true;

async.whilst(
    function () {
        return popFlag;
    },
    function (cb) {
        sysLotteryRedis.LPOP("reportlotteryplanbackup", function (err, doc) {
            if (!!err) {
                console.error("*** err: %j", err);
                return cb(err);
            }
            if (!doc) {
                popFlag = false;
                return cb("redis is null");
            }
            lotteryStatistics(JSON.parse(doc));
            setTimeout(function() {
                cb(err);
            }, 1000);
        });
    },
    function (err) {
        console.log('err: ', err);
    }
);

var lotteryStatistics = function (doc) {
    var host = config.DS_HOST;
    host += "/php/index.php?c=Channel&a=save";
    var param = doc;
    console.log(param);
    console.log("[%j] fileName: %j reportLotteryPlan", new Date().toLocaleString(), __filename);
    anaApi.postLotteryPlan(host, param, function (err, result) {
        if (!!err) {
            sysLotteryRedis.lpush("reportlotteryplanbackup1", JSON.stringify(param));
            console.error("*** err: %j", err);
        }
    })
};




