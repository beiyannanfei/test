/**
 * Created by zwb on 2015/1/13.
 */


var moment = require('moment');
var URL = require('url');

var _ = require('underscore');
var async = require('async');

var utils = require('../../routes/utils');
var userGroup = require('../../routes/userGroup');
var models = require('../../models');
var Users = models.Users;
var Behavior = models.Behavior;
var IntegralLog = models.IntegralLog;


var tools = require('../../tools');

var interface = require('../../interface');


process.maxTickDepth = Number.MAX_VALUE;


var start = function (wxToken) {
    getRecommendData(wxToken, function (data) {
        if (data) {
            var i = 0;
            _.each(data, function (d) {
                if (d.count && d.count >= 5) {
                    if (d._id) {
                        userGroup.addBehaviorAndGroup(wxToken, d._id, '扫码', '推荐用户', '', function (data) {
                            console.log(data);
                            i++;
                        });
                    }
                }
            });
        }
    });
};


var getRecommendData = function (wxToken, callback) {
    Users.aggregate({$match: {wxToken: wxToken, higherId: {$ne: null}}}, {$group: {_id: "$higherId", count: {$sum: 1}}}, {$sort: {count: -1}}, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            callback(docs);
        }
    });
};


var updateDateTime = function (wxToken) {

    var condition = {
        "wxToken": wxToken,
        "behavior": "推荐用户",
        "description": "扫码"
    };

    Behavior.find(condition, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs) {
            _.each(docs, function (doc) {
                var openId = doc.openId;
                var _id = doc._id;
                queryIntegralLog(wxToken, openId, function (data) {
                    if (data && data.length > 0) {
                        var dateTime = data[0].dateTime;
//                        console.log(moment(dateTime).format('YYYY/MM/DD HH:mm:ss'));
                        Behavior.findByIdAndUpdate(_id, {$set: {dateTime: dateTime}}, function (err, behavior) {
                            if (err) {
                                console.log();
                            }
                        });
                    }
                });
            });
        }
    });
};

var updateDateTimeByopenid = function (wxToken, openId) {

    Behavior.findOne({wxToken: wxToken, openId: openId, description: '扫码', behavior: '推荐用户'}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc) {
            var openId = doc.openId;
            var _id = doc._id;
            queryIntegralLog(wxToken, openId, function (data) {
                if (data && data.length > 0) {
                    var dateTime = data[0].dateTime;
//                        console.log(moment(dateTime).format('YYYY/MM/DD HH:mm:ss'));
                    Behavior.findByIdAndUpdate(_id, {$set: {dateTime: dateTime}}, function (err, behavior) {
                        if (err) {
                            console.log(err);
                        }
                        if(behavior){
                            console.log(behavior);
                        }
                    });
                }
            });
        }
    });
};

var queryIntegralLog = function (wxToken, openId, callback) {
    var condition = {
        wxToken: wxToken,
        openId: openId,
        description: /推荐/
    };
    IntegralLog.find(condition)
        .where('wxToken', wxToken)
        .select()
        .limit(1)
        .skip(0)
        .sort({'dateTime': -1})
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                if (doc) {
                    callback(doc);
                } else {
                    callback([]);
                }
            }
        });
};


var updateRecommendData = function (wxToken) {
    getRecommendData(wxToken, function (data) {
        if (data) {
            var i = 0;
            _.each(data, function (d) {
                if (d.count && d.count >= 5) {
                    if (d._id) {
                        Behavior.findOne({wxToken: wxToken, openId: d._id, description: '扫码', behavior: '推荐用户'}, {openId: 1}, function (err, doc) {
                            if (err) {
                                console.log(err);
                            }
                            if (!doc) {
                                userGroup.addBehaviorAndGroup(wxToken, d._id, '扫码', '推荐用户', '', function (data) {
                                    console.log(data);
                                    updateDateTimeByopenid(wxToken, d._id);
                                    i++;
                                });
                            }
                        });
                    }
                }
            });
            console.log('-----------success-----------',i);
        }
    });
};


var wxToken = '5442741495b9448a';
//start(wxToken);
//updateDateTime(wxToken);
updateRecommendData(wxToken);