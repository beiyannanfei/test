/**
 * Created by wyq on 2015/9/18.
 */
var _ = require('underscore');
var async = require('async');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var prizeConnection = new dbUtils("prize");
var utils = require("../tools/utils");
var midSend = utils.midSend;
var typeConfig = require("./typeConfig.js");
var cacheStock = require("../tools/cacheStock.js");


var checkPrizeParam = function (params) {
    var type = +params.type;
    var prizeType = typeConfig.prize.type;
    if (!type) {
        return "没有奖品类型";
    }
    if (!params.name) {
        return "没有奖品名称";
    }
    if (!params.imgUrl) {
        return "没有奖品图片url";
    }
    if (type != prizeType.shoppingCode && !params.stock) {
        return "没有奖品库存";
    }
    if (type == prizeType.shoppingCode && (!params.shoppingCode)) {
        return "没有消费码字段";
    }
    if (type == prizeType.shoppingCode && !params.useUrl) {
        return "没有消费地址url";
    }
    if (type == prizeType.url && !params.getCardUrl) {
        return "没有卡券领取url";
    }
    if (type == prizeType.url && !params.useCardUrl) {
        return "没有卡券使用url";
    }
    if (_.contains([prizeType.shoppingCode, prizeType.url], type) && !params.useExplain) {
        return "没有使用说明";
    }
    return null;
};

var makeDoc = function (params) {
    var type = +params.type;
    var prizeType = typeConfig.prize.type;
    var doc = {};
    doc.prizeType = type;
    doc.prizeName = params.name;
    doc.imgUrl = params.imgUrl;
    switch (type) {
        case prizeType.goods:
        {
            doc.stock = +params.stock;
        }
            break;
        case prizeType.shoppingCode:
        {
            doc.shoppingCode = params.shoppingCode;
            doc.useUrl = params.useUrl;
            doc.useExplain = params.useExplain;
        }
            break;
        case prizeType.url:
        {
            doc.getCardUrl = params.getCardUrl;
            doc.useCardUrl = params.useCardUrl;
            doc.useExplain = params.useExplain;
            doc.stock = params.stock;
        }
            break;
    }
    console.log("add prize doc: %j", doc);
    return doc;
};


exports.addPrize = function *(next) {
    //校验参数
    var checkMsg = checkPrizeParam(this.request.body);
    if (checkMsg) {
        return this.send(400, checkMsg);
    }
    //构造文档
    var doc = makeDoc(this.request.body);
    var prizeType = typeConfig.prize.type;
    var stock = 0;
    var shoppingCode = [];
    if (doc.prizeType != prizeType.shoppingCode) {
        stock = +doc.stock;
        delete doc.stock;
    }
    else {
        shoppingCode = doc.shoppingCode;
        delete doc.shoppingCode;
    }
    //入库
    var results = yield function (cb) {
        prizeConnection.save(doc, cb);
    };
    var id = results._id.toString();
    //库存存入redis
    if (doc.prizeType == prizeType.shoppingCode) {
        cacheStock.saveShoppingCode(id, shoppingCode, function (err, results) {
        });
    }
    else {
        cacheStock.saveCount(id, stock, function (err, results) {
        })
    }
    console.log("begin save prize results: %j", results);
    this.send(200);
};

exports.listPrize = function *() {
    var condition = {deleted: {$ne: true}};
    var datas = yield function (cb) {
        prizeConnection.find(condition, {prizeType: 1, prizeName: 1, imgUrl: 1}, cb);
    };
    this.send(200, datas);
};

exports.editPrize = function *() {
    var id = this.params.id;
    var datas = yield function (cb) {
        prizeConnection.findById(id, cb);
    };
    if (datas.prizeType != typeConfig.prize.type.shoppingCode) {
        var count = yield cacheStock.getCount(id);
        datas.stock = +count;
    }
    else {
        var shopingCodes = yield cacheStock.getShoppingCodes(id);
        datas.shopingCode = shopingCodes;
    }
    this.send(200, datas);
};