/**
 * Created by yanqiang.Wang on 2015/8/11.
 */

var async = require('async');
var _ = require('underscore');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var lotterieCollection = new dbUtils('lotteries');
var addresses = new dbUtils('addresses');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var mongoskin = require('mongoskin');
var ObjectID = mongoskin.ObjectID;

var readDbDateExtend = function () {
    var readFlag = true;
    var preReadCount = 1;  //每次从数据库中读取的数据条数
    console.time("read data use time");
    async.whilst(
        function () {
            return readFlag;
        },
        function (cb) {
            lotterieCollection.findNoCache({prizeType: 3, addInfo: {$exists: 0}}, {}, {limit: preReadCount}, function (err, datas) {
                if (!!err) {
                    return cb(err);
                }
                if (datas.length <= 0) {
                    readFlag = false;
                    console.timeEnd("read data use time");
                    logger.info("*********数据读取完毕");
                    return cb("no data");
                }
                var data = datas[0];
                if (!data.addressId) {  //当addressId字段不存在时
                    return cb(null);
                }
                var addressId = data.addressId;
                addresses.findNoCache({"_id": new ObjectID(addressId)}, {}, function (err, docs) {
                    if (!!err) {
                        return cb(err);
                    }
                    if (docs.length <= 0) { //没有根据addressId查询到地址信息
                        return cb(null);
                    }
                    var doc = docs[0];
                    if (!doc.addInfo) {     //地址信息中不存在详细的地址信息
                        return cb(null);
                    }
                    data = _.extend(data, {addInfo: doc.addInfo});
                    lotterieCollection.save(data, function (err, results) {
                        logger.info("*********%j extend data data: %j", new Date().toLocaleString(), data);
                        return cb(err);
                    });
                });
            })
        },
        function (err) {
            logger.info('err: ', err);
        }
    );
};

readDbDateExtend();





