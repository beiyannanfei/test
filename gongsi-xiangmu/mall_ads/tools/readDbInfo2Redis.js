/**
 * Created by userName on 2015/7/27.
 */
var dbUtils          = require('../mongoSkin/mongoUtils.js');
var ordersCollection = new dbUtils('order');
var async            = require('async');
var _                = require("underscore");
var tools            = require('../tools');
var redisClient      = tools.redisClient();
var typeConfig       = require('../routes/typeConfig.js');

var index = 0;
var readFlag = true;
var preReadCount = 1000;  //每次从数据库中读取的数据条数
console.time("read data use time");
async.whilst(
    function () {
        return readFlag;
    },
    function (cb) {
        ordersCollection.findNoCache({},{},{skip: index * preReadCount, limit: preReadCount}, function(err, datas) {
            ++index;
            if (datas.length <= 0) {
                readFlag = false;
                console.timeEnd("read data use time");
                console.log("*********数据读取完毕");
                return cb("no data");
            }
            console.log("*********%j read data index: %j", new Date().toLocaleString(), index);
            setData2Redis(datas);
            cb(err);
        })
    },
    function (err) {
        console.log('err: ', err);
    }
);

var setData2Redis = function(docs) {
    for (var index in docs) {
        var data = docs[index];
        var temp;
        if (data.money) {
            temp = data.money;
        }
        if (data.prize) {
            temp = data.prize;
        }
        var type = temp.type ? +temp.type : 0;
        if (type != typeConfig.prizeType.wxred) {   //不是微信红包
            continue;
        }
        var money = temp.money ? +(temp.money) : 0;   //红包金额
        var openId = data.user.openId ? data.user.openId : "";       //用户openID
        var userInfo = JSON.stringify(data.user);  //用户信息
        setRedisVal(money, openId, userInfo);
    }
};

var setRedisVal = function(money, openId, userInfo) {
    var countWxredSumInfo = "countWxredSumInfo";        //微信红包总金额key
    var countWxredNumInfo = "countWxredNumInfo";        //微信红包总数量key
    var countWxredUserInfo = "countWxredUserInfo";      //用户信息key
    redisClient.ZINCRBY(countWxredSumInfo, money, openId, function(err, res) {  //将总金额增加到对用openid的redis中
        if (!!err) {
            console.error("save countWxredSumInfo into redis err, openid: %j, money: %j, err: %j", openId, money, err);
        }
    });

    redisClient.ZINCRBY(countWxredNumInfo, 1, openId, function(err, res) {  //将为对应的openid红包数量加1
        if (!!err) {
            console.error("save countWxredNumInfo into redis err, openid: %j, err: %j", openId, err);
        }
    });

    redisClient.HSETNX(countWxredUserInfo, openId, userInfo, function(err, res) {   //根据openid设置userInfo
        if (!!err) {
            console.error("save countWxredUserInfo into redis err, openid: %j, userInfo: %j, err: %j", openId, userInfo, err);
        }
    });
};













