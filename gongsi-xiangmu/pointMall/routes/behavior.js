/**
 *
 * 用户行为相关处理
 *
 * Created by nice on 2014/9/3.
 */

var moment = require('moment');
var URL = require('url');

var tools = require('../tools');
var interface = require('../interface');
var models = require('../models/index');
var Behavior = models.Behavior;
var Users = models.UsersPoint;
var Groups = models.Groups;

var utils = require('./utils');
var _ = require('underscore');
var async = require('async');

var wxInfo = require('./wxInfo');

var config = require('../config.js');
var wmhUrlUS = config.wmhUrlUS;
var wmhUrl = config.wmhUrl;
var userHost = config.userHost;

exports.index = function (req, res) {
    var wxToken = req.session.token;
    if (wxToken == '') {
        res.send('身份验证不通过');
    } else {
        console.time('behavior/index');
        getTagCategory(wxToken, function (tags) {
            console.timeEnd('behavior/index');
            res.render('behavior-tag', {
                layout: false,
                wxToken: wxToken,
                wmhUrlUS:wmhUrlUS,
                tags: JSON.stringify(tags)
            });
        });
    }
};
/**
 * 用户行为入库
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var params = URL.parse(req.url, true);
    var body = req.body;
    if (body && body != 'undefined') {
        if (body.openId && body.behavior && body.wxToken) {
            if (body.openId != 'undefined') {
                var obj = {
                    openId: body.openId,
                    wxToken: body.wxToken,
                    behavior: body.behavior
                };
                if (body.area) {
                    obj.area = body.area;//地区
                }
                if (body.integral) {
                    obj.integral = body.integral;//积分
                }
                if (body.description) {
                    obj.description = body.description;//备注
                }
                if (body.result) {
                    obj.result = body.result;//结果
                }
                if (body.time) {
                    obj.time = body.time;//时间戳
                } else {
                    obj.time = new moment().valueOf().toString();
                }
                if (body.nickName && body.headImg) {
                    obj.nickName = body.nickName;
                    obj.headImg = body.headImg;
                    addBehavior(obj, function (data) {
                        if (data && data.status === 'success') {
                            tools.resToClient(res, params, {status: 'success'});
                        } else {
                            tools.resToClient(res, params, {status: 'failed', msg: '数据库异常'});
                        }
                    });
                } else {
                    interface.getUserInfo(obj.openId, obj.wxToken, function (info) {
                        if (info && info.data.data) {
                            var data = info.data.data;
                            if (data.username) {
                                obj.nickName = data.username;
                            }
                            if (data.weixin_avatar_url) {
                                obj.headImg = data.weixin_avatar_url;
                            }
                        }
                        addBehavior(obj, function (data) {
                            if (data && data.status === 'success') {
                                tools.resToClient(res, params, {status: 'success'});
                            } else {
                                tools.resToClient(res, params, {status: 'failed', msg: '数据库异常'});
                            }
                        });
                    });
                }
            } else {
                tools.resToClient(res, params, {status: 'failed', msg: 'openId value undefined'});
            }
        } else {
            tools.resToClient(res, params, {status: 'failed', msg: 'openId、 behavior、 wxtoken is null'});
        }
    }
    else {
        tools.resToClient(res, params, {status: 'failed', msg: '格式不正确、头信息不是JSON'});
    }
};

exports.find = function (req, res) {
    var wxToken = req.query.wxToken || '';
    var openId = req.query.openId || '';
    var description = req.query.description || '';
    var behavior = req.query.behavior || '';
    var result = req.query.result || '';
    var startTime = req.query.startTime || '';
    var lastTime = req.query.lastTime || '';
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    if(wxToken){
        var condition = {};
        condition.wxToken = wxToken;
        if(openId){
            condition.openId = openId;
        }
        if (description) {
            condition.description = description;
        }
        if (behavior) {
            condition.behavior = behavior;
        }
        if (result) {
            condition.result = result;
        }
        if (startTime && lastTime) {
            condition.dateTime = {'$gt': new Date(parseInt(startTime)), '$lte': new Date(parseInt(lastTime))};
        }
        Behavior.find(condition)
            .where()
            .select({'openId': 1})
            .limit(pagecount)
            .skip(skip)
            .sort({dateTime: -1})
            .exec(function (err, docs) {
                if (err) {
                    console.log(err);
                }
                res.send({status: 'success', data: docs});
            });
    }else{
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

exports.query = function (req, res) {
    console.time('behavior/query');
    var params = URL.parse(req.url, true);
    var nickName = req.query.nickName || '';
    var description = req.query.description || '';
    var behavior = req.query.behavior || '';
    var result = req.query.result || '';
    var area = req.query.area || '';
    var wxToken = req.session.token;
    var startTime = req.query.startTime || '';
    var lastTime = req.query.lastTime || '';
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
//    var sort = req.query.sort || 'dateTime';
    if (wxToken) {
        //根据condition 查询behavior
        var getBehavior = function(condition,callback){
            Behavior.find(condition)
                .where()
                .select({'__v': 0})
                .limit(pagecount)
                .skip(skip)
                .sort({dateTime: -1})
                .exec(function (err, docs) {
                    if (err) {
                        console.log(err);
                    }
                    callback(docs);
                });
        };
        //分析参数，获取数据
        var getBehaviorData = function(callback){
            var condition = {};
            condition.wxToken = wxToken;
            if (behavior) {
                if (behavior.indexOf(',') != -1) {
                    var arrry = behavior.split(',');
                    arrry = _.compact(arrry);
                    condition.behavior = {$in: arrry};
                } else {
                    condition.behavior = behavior;
                }
            }
            if (description) {
                condition.description = description;
            }
            if (result) {
                condition.result = result;
            }
            if (area) {
                var regArea = new RegExp(area);
                condition.area = regArea;
            }
            if (startTime && lastTime) {
                condition.dateTime = {'$gt': new Date(parseInt(startTime)), '$lte': new Date(parseInt(lastTime))};
            }
            if (nickName) {
                //var regNickName = new RegExp(nickName);
                Users.find({wxToken:wxToken,nickName:nickName},{openId:1},function(err,users){
                    if(err){
                        console.log(err);
                    }
                    if(users && users.length>0){
                        var openIds = _.pluck(users, 'openId');
                        condition.openId = {$in: openIds};
                    }else{
                        condition.openId = {$in: []};
                    }
                    getBehavior(condition,function(data){
                        callback(condition,data);
                    });
                });
            }else{
                getBehavior(condition,function(data){
                    callback(condition,data);
                });
            }
        };
        getBehaviorData(function(condition,docs){
            if(docs){
                docs = utils.doc2Object(docs);
                var ids = _.pluck(docs, 'openId');
                findUsers(wxToken,ids, function (list) {
                    _.each(docs, function (doc) {
                        if (list && list[doc.openId]) {
                            doc.nickName = list[doc.openId].nickName;
                            doc.headImg = list[doc.openId].headImg;
                        }else{
                            doc.nickName = '未知用户';
                            doc.headImg = userHost + '/data/user_info/default.png';
                            wxInfo.reacquireUsers(wxToken, doc.openId, function(data){});
                        }
                        var dataTime = null;
                        if (doc.time) {
                            dataTime = new Date(doc.time);
                        } else {
                            dataTime = doc.dateTime;
                        }
                        doc.dateTime = moment(dataTime).format('YYYY-MM-DD HH:mm:ss');
                        if (!doc.area) {
                            doc.area = '';
                        }
                    });
                    console.timeEnd('behavior/query');
                    if(page==1){
                        condition.wxToken = wxToken;
                        getTotal(condition,function(count){
                            var total = 0;
                            if(count){
                                total = count;
                            }
                            tools.resToClient(res, params, {status: 'success', data: docs,total:total});
                        });
                    }else{
                        tools.resToClient(res, params, {status: 'success', data: docs});
                    }
                });
            }else{
                tools.resToClient(res, params, {status: 'failed', data: []});
            }
        });
    } else {
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

exports.groups = function (req, res) {
    var wxToken = req.query.wxToken;
    if(wxToken){
        getTagCategory(wxToken, function (tags) {
            res.send({status: 'success', data: tags});
        });
    }else{
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

exports.statisticsIndex = function (req, res) {
    var wxToken = req.session.token;
    if(wxToken){
        console.time('behavior/index');
        getTagCategory(wxToken, function (tags) {
            console.timeEnd('behavior/index');
            res.render('behavior-statistics', {
                layout: false,
                wxToken: wxToken,
                wmhUrlUS:wmhUrlUS,
                tags: JSON.stringify(tags)
            });
        });
    }else{
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

exports.statistics = function (req, res) {
    var description = req.query.description || '';
    var behavior = req.query.behavior || '';
    var result = req.query.result || '';
    var wxToken = req.session.token;
    var startTime = req.query.startTime || '';
    var lastTime = req.query.lastTime || '';
    var limit = req.query.limit || 20;
    if(wxToken){
        if(description){
            var matchCondition = {};
            var groupCondition = {};
            if(behavior){
                matchCondition = {
                    wxToken:wxToken,
                    description:description,
                    behavior:behavior
                };
                groupCondition = {
                    _id:'$result',
                    count:{$sum:1}
                };
            }else{
                matchCondition = {
                    wxToken:wxToken,
                    description:description
                };
                groupCondition = {
                    _id:'$behavior',
                    count:{$sum:1}
                };
            }
            if(result){
                if(result!='result_name'){
                    matchCondition = {
                        wxToken:wxToken,
                        description:description,
                        behavior:behavior,
                        result:result
                    };
                }else{
                    matchCondition = {
                        wxToken:wxToken,
                        description:description,
                        behavior:behavior
                    };
                }

                groupCondition = {
                    _id:'$openId',
                    count:{$sum:1}
                };
            }
            if (startTime && lastTime) {
                matchCondition.dateTime = {'$gt': new Date(parseInt(startTime)), '$lte': new Date(parseInt(lastTime))};
            }
            Behavior.aggregate({$match: matchCondition}, {$group: groupCondition},{$sort:{count:-1}},{$limit:limit}, function(err, docs){
                if (err){
                    console.log(err);
                    res.send({status: 'failed', msg: 'mongdb is error',data:[]});
                } else {
                    if(result && result!=''){
                        var ids = _.pluck(docs, '_id');
                        findUsers(wxToken,ids, function (list) {
                            _.each(docs, function (doc) {
                                if (list && list[doc._id]) {
                                    doc.nickName = list[doc._id].nickName;
                                    doc.headImg = list[doc._id].headImg;
                                }else{
                                    doc.nickName = '未知用户';
                                    doc.headImg = userHost + '/data/user_info/default.png';
                                }
                            });
                            res.send({status: 'success', data:docs});
                        });
                    }else{
                        res.send({status: 'success', data:docs});
                    }
                }
            });
        }else{
            res.send({status: 'failed', msg: 'params is null'});
        }
    }else{
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};


/**
 * 查询用户信息
 * @type {findUsers}
 */
var findUsers = exports.findUsers = function (wxToken,openIds, callback) {
    console.time('behavior/query findUsers');
    var condition = {
        openId: {$in: openIds}
    };
    condition.wxToken = wxToken;
    Users.find(condition, {openId: 1, nickName: 1, headImg: 1}, function (err, friends) {
        if (err) {
            console.log(err);
            return callback({});
        }
        if (!friends || friends.length == 0) {
            return callback({});
        }
        var friendMap = {};
        _.each(friends, function (friend) {
            friendMap[friend.openId] = friend;
        });
        console.timeEnd('behavior/query findUsers');
        callback(friendMap);
    })
};


/**
 * 添加用户行为
 * @param info
 * @param callback
 */
var addBehavior = function (info, callback) {
    var dateTime = new moment().valueOf().toString();
//    var time = moment(parseInt(dateTime, 10)).format('YYYY/MM/DD HH:mm:ss');
    info.time = dateTime;
    info.user = tools.joinId(info.wxToken, info.openId);
    var obj = new Behavior(info);
    obj.save(function (err, doc) {
        if (err) {
            callback({status: 'failed'});
        } else {
            if (doc) {
                callback({status: 'success', doc: doc, flag: 'add'});
            } else {
                callback({status: 'failed', doc: {}});
            }
        }

    });
};

var getTags = function (token, activity, callback) {
    Groups.distinct('key', {wxToken: token, activity: activity}, function (err, tags) {
        if (err) {
            callback([])
        } else {
            callback(tags);
        }
    })
};

var getTagCategory = function (token, callback) {
    Groups.distinct('activity', {wxToken: token}, function (err, category) {
        if (err) {
            callback({});
        } else if (category.length > 0) {
            var result = {};
            async.each(category, function (o, callback) {
                if (o != '自定义') {
                    Groups.find({wxToken: token, activity: o}, {key: 1, results: 1}, function (err, docs) {
                        if (err) {
                            console.log(err);
                        }
                        if (docs) {
                            result[o] = docs;
                        }
                        callback(null);
                    });
                } else {
                    return callback(null);
                }
            }, function (err) {
                callback(result);
            })
        } else {
            callback({});
        }
    });
};

var getTotal = function (condition, callback) {
    Behavior.count(condition, function (err, count) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            if (count) {
                callback(count);
            } else {
                callback(null);
            }
        }
    });
};