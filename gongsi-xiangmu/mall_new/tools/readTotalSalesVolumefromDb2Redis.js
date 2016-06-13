/**
 * Created by wyq on 2015/9/10.
 */
var dbUtils = require('../mongoSkin/mongoUtils.js');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var tools = require('../tools');
var redisClient = tools.pvAndUvRedisClient();
var async = require('async');
var lotterieCollection = new dbUtils('lotteries');
var _ = require("underscore");
var dailyRecord = require("../routes/dailyRecord.js");
var args = process.argv;
var index = args.indexOf("-t");
var token;
if (-1 != index) {
    token = args[index + 1];
}

var readDbDate2Redis = function () {
    var filter = {'state': {$ne: 'refund'}};
    if (token) {
        filter.token = token;
    }
    var condition = [
        {$match: filter},
        {
            $group: {
                _id: {
                    prizeId: "$prizeId"
                },
                count: {$sum: 1}
            }
        }
    ];
    lotterieCollection.aggregate(condition, function (err, results) {
        if (!!err) {
            return logger.error("db error: %j", err);
        }
        var index = 0;
        console.time("writeRedisUseTime:");
        async.eachLimit(results, 10, function (doc, callback) {
            var id = doc._id.prizeId.toString();
            var count = +doc.count;
            logger.info("********* write %j to redis", index++);
            dailyRecord.setTotalSalesVolume(id, count, function (err, results) {
                callback(err);
            });
        }, function (err) {
            if (!!err) {
                return logger.error("write redis err: %j", err);
            }
            console.timeEnd("writeRedisUseTime:");
            logger.info("\n\n*********** SUCCESS ***********\n\n");
        });
    });
};


readDbDate2Redis();