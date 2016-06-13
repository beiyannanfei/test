/**
 * Created by wyq on 2015/9/17.
 */
var _ = require('underscore');
var async = require('async');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var scratchCardConnection = new dbUtils("scratchCard");
var utils = require("../tools/utils");
var pageCount = 2;  //每页显示的数据条数


exports.getCardList = function *(next) {    //获取刮刮卡列表
    var pageIndex = this.params.pageId;
    var ltype = this.params.ltype;
    if (!pageIndex || !ltype) {
        return this.send(400, "param is null");
    }
    if (pageIndex <= 0 || ltype <= 0) {
        return this.send(400, "param is Illegal");
    }
    var condition = {deleted: {$ne: true}, type: +ltype};
    var datas = yield {
        count: function (cb) {
            scratchCardConnection.count(condition, cb);
        },
        data: function (cb) {
            var start = (+pageIndex - 1) * pageCount;
            scratchCardConnection.find(condition, {type: 0}, {
                sort: {startTime: -1},
                skip: start,
                limit: pageCount
            }, cb);
        }
    };
    console.log("scratchCard datas: %j", datas);
    this.send(200, _.extend(datas, {pageCount: pageCount}));
};

exports.delCard = function *(next) {    //删除
    var id = this.params.id;
    var count = yield function (cb) {
        scratchCardConnection.updateById(id, {$set: {"deleted": true}}, cb);
    };
    console.log("***** delete id: %j, results: %j", id, count);
    this.send(200, count);
};











