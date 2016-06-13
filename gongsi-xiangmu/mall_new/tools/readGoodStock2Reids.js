/**
 * Created by yanqiang.Wang on 2015/9/10.
 */
var dbUtils = require('../mongoSkin/mongoUtils.js');
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var tools = require('../tools');
var redisClient = tools.redisClient();
var async = require('async');
var goodsCollection = new dbUtils('goods');
var _ = require("underscore");
var typeConfig = require('../routes/typeConfig.js');
var mShoppingCard = require('../routes/shoppingCard.js');
var args = process.argv;
var index = args.indexOf("-t");
var token;
if (-1 != index) {
    token = args[index + 1];
}

var readDbDate2Redis = function () {
    var index = 0;
    var readFlag = true;
    var preReadCount = 100;  //每次从数据库中读取的数据条数
    var condition = {};
    if (token) {
        condition.token = token;
    }
    console.time("read data use time");
    async.whilst(
        function () {
            return readFlag;
        },
        function (cb) {
            goodsCollection.findNoCache(condition, {"type": 1, "ext.shoppingCards": 1, "count": 1}, {skip: index * preReadCount, limit: preReadCount}, function (err, datas) {
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
    _.each(docs, function (doc) {
        var type;
        var id;
        if (doc.type != typeConfig.goods.type.shoppingCard) {
            type = doc.type;
            var count = doc.count || 0;
            id = doc._id.toString();
            writeRedis(type, id, count);
        }
        else {
            if (doc.ext.shoppingCards && doc.ext.shoppingCards.length > 0) {
                type = doc.type;
                id = doc._id.toString();
                var shopCards = doc.ext.shoppingCards;
                writeRedis(type, id, shopCards.length, shopCards);
            }
        }
    });
};

var writeRedis = function (type, id, count, cardList) {
    if (type != typeConfig.goods.type.shoppingCard) {
        mShoppingCard.saveCount(id, count, function (err, results) {
        });
    }
    else {
        mShoppingCard.saveShoppingCard(id, cardList, function (err, results) {
        })
    }
};

readDbDate2Redis();















