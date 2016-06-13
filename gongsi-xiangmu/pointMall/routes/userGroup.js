/**
 * Created by nice on 2014/11/5.
 */

var moment = require('moment');
var URL = require('url');
var crypto = require('crypto');
var models = require('../models/index');
var Behavior = models.Behavior;
var Groups = models.Groups;
var GroupUsers = models.GroupUsers;
var Users = models.UsersPoint;
var GroupUserIds = models.GroupUserIds;


var _ = require('underscore');
var async = require('async');
var utils = require('./utils');
var tools = require('../tools');

var interface = require('../interface');


var redisClient = tools.redisUserGroupClient();
redisClient.select(1, function () {
    console.log('用行为组查询 切换到 database 1');
});

//exports.test = function (req, res) {
//    res.send({status: 'success'});
//};

exports.query = function (req, res) {
    var wxToken = req.query.wxToken || '';
    var openId = req.query.openId || '';
    var activity = req.query.activity || '';
    var title = req.query.title || '';
    var result = req.query.result || '';
    if (wxToken && openId && activity && title) {

        existsUser(wxToken, activity, title, result, openId, function (data) {
            res.send(data);
        });

    } else {
        res.send({status: 'failed', msg: 'parameter  is null'});
    }
};

var existsUser = exports.existsUser = function (wxToken, activity, key, result, openId, callback) {
    var redisKey = '';
    if (result && result != 'undefined') {
        redisKey = 'USERGROUP:' + wxToken + ':' + openId + ':' + activity + ':' + key + ':' + result;
    } else {
        redisKey = 'USERGROUP:' + wxToken + ':' + openId + ':' + activity + ':' + key;
    }
    if (activity != '自定义') {
        redisClient.exists(redisKey, function (error, reply) {
            if (error) {
                console.log(error);
                existsUserGroups(wxToken, activity, key, result, openId, function(data){
                    callback(data);
                });
            } else {
                if (reply) {
                    callback({status: 'success'});
                } else {
                    callback({status: 'failed'});
                }
            }
        });
    } else {
        existsUserGroups(wxToken, activity, key, result, openId, function(data){
            callback(data);
        });
//        Groups.findOne({wxToken: wxToken, activity: activity, key: key}, {openIds: -1}, function (err, doc) {
//            if (err) {
//                console.log(err);
//            }
//            if (doc) {
//                GroupUserIds.findOne({groupId: doc._id, openId: openId}, function (err, data) {
//                    if (err) {
//                        console.log(err);
//                    }
//                    if (data) {
//                        callback({status: 'success'});
//                    } else {
//                        callback({status: 'failed'});
//                    }
//                });
//            } else {
//                callback({status: 'failed'});
//            }
//        });
    }
};

var existsUserGroups = exports.existsUserGroups = function (wxToken, activity, key, result, openId, callback) {
    Groups.findOne({wxToken: wxToken, activity: activity, key: key}, {openIds: -1}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc) {
            GroupUserIds.findOne({groupId: doc._id, openId: openId}, function (err, data) {
                if (err) {
                    console.log(err);
                }
                if (data) {
                    callback({status: 'success'});
                } else {
                    callback({status: 'failed'});
                }
            });
        } else {
            callback({status: 'failed'});
        }
    });
};


exports.add = function (req, res) {
    console.time('group add body');
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    if (body && body != 'undefined') {
        if (body.activity && body.wxToken && body.title && body.openId) {
            var activity = body.activity;
            var wxToken = body.wxToken;
            var title = body.title;
            var openId = body.openId;
            var result = body.result || '';
            console.time('addBehavior');
            addBehavior({
                wxToken: wxToken,
                behavior: title,
                description: activity,
                result: result
            }, openId);
            console.timeEnd('addBehavior');

            addGroup(wxToken, activity, title, result, function (groups) {
                if (groups) {
                    var groupId = groups._id;
                    console.time('addGroupUser');
                    addGroupUser(wxToken, groupId, openId, activity, title, result, function (data) {
                        console.timeEnd('addGroupUser');
                        console.timeEnd('group add body');
                        res.send({status: 'success', data: data});
                    });
                } else {
                    console.timeEnd('group add body');
                    res.send({status: 'failed'});
                }
            });
        } else {
            console.timeEnd('group add body');
            res.send({status: 'failed', msg: 'parameters is null'});
        }
    } else {
        console.timeEnd('group add body');
        res.send({status: 'failed', msg: 'parameters is error！'});
    }
};


exports.addTest = function (req, res) {
    console.time('group add body');
    var activity = req.query.activity || '';
    var wxToken = req.query.wxToken || '';
    var title = req.query.title || '';
    var openId = req.query.openId || '';
    var result = req.query.result || '';
    var dateTime = new moment().valueOf().toString();
    if (activity && wxToken && title && openId) {
        console.time('addBehavior');
        addBehavior({
            wxToken: wxToken,
            behavior: title,
            description: activity,
            result: result
        }, openId);
        console.timeEnd('addBehavior');

        addGroup(wxToken, activity, title, result, function (groups) {
            if (groups) {
                var groupId = groups._id;
                console.time('addGroupUser');
                addGroupUser(wxToken, groupId, openId, activity, title, result, function (data) {
                    console.timeEnd('addGroupUser');
                    console.timeEnd('group add body');
                    res.send({status: 'success', data: data});
                });
            } else {
                console.timeEnd('group add body');
                res.send({status: 'failed'});
            }
        });
    } else {
        console.timeEnd('group add body');
        res.send({status: 'failed', msg: 'parameters is null'});
    }
};


var addGroupUser = exports.addGroupUser = function (wxToken, groupId, openId, activity, title, result, callback) {
    var msgArray = [];
    var openIds = [];
    if (openId.indexOf(',') != 1) {
        openIds = openId.split(",");
    } else {
        openIds.push(openId);
    }
    openIds = _.compact(openIds);
    async.eachSeries(openIds, function (_openId, done) {
        console.time('addGroupUserIds');
        addGroupUserIds(groupId, _openId, function (data) {
            if (data) {
                console.time('addGroupUserIds redis');
                var redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title;
                var number = new moment().valueOf().toString();
                setKey(redisKey, number, function (data) {
                });
                if (result && result != 'undefined') {
                    redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title + ':' + result;
                    setKey(redisKey, number, function (data) {
                    });
                }
                console.timeEnd('addGroupUserIds redis');
                msgArray.push({openId: _openId, status: 'success'});
            } else {
                msgArray.push({openId: _openId, status: 'failed'});
            }
            console.timeEnd('addGroupUserIds');
            done(null);
        });
    }, function (err) {
        callback(msgArray);
    });
};

var addGroup = function (wxToken, activity, title, result, callback) {
    var dateTime = new moment().valueOf().toString();
    var redisKey = 'GROUPID:' + wxToken + ':' + activity + ':' + title;

    var addGroupsResult = function (_id, result) {
        Groups.findByIdAndUpdate(_id, {$addToSet: {results: result}}, function (err, doc) {
            if (err) {
                console.log(err);
            }
        });
    };

    console.time('redisClient get');
    redisClient.get(redisKey, function (error, replyData) {
        if (error) {
            console.log(error);
        }
        console.timeEnd('redisClient get');
        if (replyData) {
            if (result && result != 'undefined') {
                addGroupsResult(replyData, result);
            }
            callback({_id: replyData});
        } else {
            console.time('Groups.findOne');
            Groups.findOne({wxToken: wxToken, activity: activity, key: title}, {_id: 1}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    console.timeEnd('Groups.findOne');
                    setKey(redisKey, doc._id, function (data) {
                        redisClient.expire(redisKey, 60 * 60 * 24);
                    });
                    if (result && result != 'undefined') {
                        addGroupsResult(doc._id, result);
                    }
                    callback(doc);
                } else {
                    var obj = {
                        activity: activity,
                        wxToken: wxToken,
                        key: title,
                        time: dateTime,
                        results: [result]
                    };
                    if (result != '' && result != 'undefined') {
                        obj.results = [result];
                    }
                    var group = new Groups(obj);
                    group.save(function (err, group) {
                        if (err) {
                            console.log(err);
                        }
                        console.timeEnd('Groups.findOne');
                        if (group) {
                            setKey(redisKey, group._id, function (data) {
                                redisClient.expire(redisKey, 60 * 60 * 24);
                            });
                            callback(group);
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        }
    });
//    redisClient.exists(redisKey, function (error, reply) {
//        if (error) {
//            console.log(error);
//        }
//        if (reply) {
//            console.log('---------------Groups.findOne  redisClient---------------');
//            console.time('redisClient get');
//            redisClient.get(redisKey, function (error, replyData) {
//                if (error) {
//                    console.log(error);
//                }
//                console.timeEnd('redisClient get');
//                if(replyData){
//                    console.log('============redisClient  Groupid ================',{_id:replyData});
//                    callback({_id:replyData});
//                }else{
//                    callback(null);
//                }
//            });
//        } else {
//            console.log('---------------Groups.findOne---------------');
//            console.time('Groups.findOne');
//            Groups.findOne({wxToken: wxToken, activity: activity, key: title}, {_id: 1}, function (err, doc) {
//                if (err) {
//                    console.log(err);
//                }
//                if (doc) {
//                    console.timeEnd('Groups.findOne');
//                    setKey(redisKey,doc._id,function(data){});
//                    callback(doc);
//                } else {
//                    console.log('---------------Groups.findOne save ---------------');
//                    var obj = {
//                        activity: activity,
//                        wxToken: wxToken,
//                        key: title,
//                        time: dateTime,
//                        results: [result]
//                    };
//                    if (result != '' && result != 'undefined') {
//                        obj.results = [result];
//                    }
//                    var group = new Groups(obj);
//                    group.save(function (err, group) {
//                        if (err) {
//                            console.log(err);
//                        }
//                        console.timeEnd('Groups.findOne');
//                        if (group) {
//                            setKey(redisKey,group._id,function(data){});
//                            callback(group);
//                        } else {
//                            callback(null);
//                        }
//                    });
//                }
//            });
//        }
//    });
};

var addBehavior = function (obj, openId) {
    var wxToken = obj, wxToken;
    var openIds = [];
    if (openId.indexOf(',') != 1) {
        openIds = openId.split(",");
    } else {
        openIds.push(openId);
    }
    openIds = _.compact(openIds);
    async.eachSeries(openIds, function (_openId, done) {
        var _id = tools.joinId(wxToken, _openId);
        obj.openId = _openId;
        Users.findById(_id, {nickName: 1, headImg: 1}, function (err, doc) {
            if (err) {
                console.log(err);
            }
            var nickName = '';
            var headImg = '';
            if (doc) {
                nickName = doc.nickName || '';
                headImg = doc.headImg || '';
            }
            obj.nickName = nickName;
            obj.headImg = headImg;
            var behavior = new Behavior(obj);
            behavior.save(function (err, doc) {
                if (err) {
                    console.log(err);
                }
            });
            done(null);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });
}


var setKey = function (redisKey, number, callback) {
    redisClient.set(redisKey, number, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback(reply);
        }
    });
};

var addGroupUserIds = exports.addGroupUserIds = function (groupId, openId, callback) {
    var redisKey = 'GroupUserIds:' + groupId + ':' + openId;
    console.time('addGroupUserIds One');
    console.time('addGroupUserIds One redis');
    redisClient.get(redisKey, function (error, reply) {
        if (error) {
            console.log(error);
        }
        if (reply) {
            console.time('addGroupUserIds One redis');
            callback({_id: reply});
        } else {
            GroupUserIds.findOne({groupId: groupId, openId: openId}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (!doc) {
                    var groupUserId = new GroupUserIds({
                        groupId: groupId,
                        openId: openId
                    });
                    groupUserId.save(function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        if (data) {
                            setKey(redisKey, data._id, function (data) {
                                redisClient.expire(redisKey, 60 * 60 * 24);
                            });
                            console.timeEnd('addGroupUserIds One');
                            callback(data._id);
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    setKey(redisKey, doc._id, function (data) {
                        redisClient.expire(redisKey, 60 * 60 * 24);
                    });
                    console.timeEnd('addGroupUserIds One');
                    callback(doc._id);
                }
            });
        }
    });
};

exports.addBehaviorAndGroup = function (wxToken, openId, activity, title, result, callback) {
    console.time('group add body');
    console.time('addBehavior');
    addBehavior({
        wxToken: wxToken,
        behavior: title,
        description: activity,
        result: result
    }, openId);
    console.timeEnd('addBehavior');

    addGroup(wxToken, activity, title, result, function (groups) {
        if (groups) {
            var groupId = groups._id;
            console.time('addGroupUser');
            addGroupUser(wxToken, groupId, openId, activity, title, result, function (data) {
                console.timeEnd('addGroupUser');
                console.timeEnd('group add body');
                callback({status: 'success', data: data});
            });
        } else {
            console.timeEnd('group add body');
            callback({status: 'failed'});
        }
    });
};


exports.groupAuthSign = function (req, res, next) {
    var params = {};
    params.rkey = '10059d4ceefa51dd21d00898d891f58d';// tvm-mtq-mall@2014 md5 加密字符串;
    params.openId = req.param('openId');
    params.sigtime = req.param('sigtime');
    if (!params.openId) {
        return res.send({status: 'failed', msg: '参数openId错误'});
    }
    if (!params.sigtime) {
        return res.send({status: 'failed', msg: '参数sigtime错误'});
    }
    var sig = req.param('sig');
    var str = params.openId + ':' + params.rkey + ':' + params.sigtime;
    var md5 = crypto.createHash('md5');
    var sign = md5.update(str);
    sign = md5.digest('hex');
    if (sign == sig) {
        next();
    } else {
        return res.send({status: 'failed', msg: '认证签名失败'});
    }
};