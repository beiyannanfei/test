/**
 * Created by wyq on 2015/7/27.
 */
var dbUtils = require('../mongoSkin/mongoUtils.js');
var ordersCollection = new dbUtils('order');
var async = require('async');
var args = process.argv;
if (args.length < 6) {
    console.log("请输入类似下面的命令行参数(年 月 日 天数): node countPartInNum.js 2015 6 21 1");
    return;
}
console.log("**** args: %j", args);
var years = +args[2];
var month = +args[3];
var day = +args[4];
var len = +args[5];

var index = 0;

async.whilst(
    function () {
        return index < len;
    },
    function (cb) {
        var startTime = new Date(years, month - 1, day);
        var endTime = new Date(years, month - 1, ++day);
        var condition = [
            {$match: {dateTime: {$gte: startTime, $lt: endTime}}},
            {$group: {_id: "21", openId: {$addToSet: "$user.openId"}}}
        ];
        ++index;
        ordersCollection.aggregate(condition, function (err, datas) {
            if (!!err) {
                console.log('db err: %j', err);
                return cb(err);
            }
            try {
                var openIdList = datas[0].openId;
                var count = openIdList.length;
                console.log("***************day: %j 中奖用户参与人数: %j", startTime.toLocaleDateString(), count);
                var condition = {dateTime: {$gte: startTime, $lt: endTime}};
                ordersCollection.countNoCache(condition, function (err, doc) {
                    if (!!err) {
                        console.log('db err: %j', err);
                        return cb(err);
                    }
                    console.log("*******中奖用户参与次数: %j", doc);
                    return cb(null);
                });
            }
            catch (e) {
                console.log("get length from db err: %j", err);
                return cb(null);
            }
        });

    },
    function (err) {
        console.log('err: ', err);
    }
);