var moment = require('moment');
var URL = require('url');

var _ = require('underscore');
var async = require('async');

var utils = require('../../routes/utils');
var models = require('../../models');
var Groups = models.Groups;
var GroupUserIds = models.GroupUserIds;
var Behavior = models.Behavior;

var tools = require('../../tools');

var interface = require('../../interface');


process.maxTickDepth = Number.MAX_VALUE;

var page = 0;
var pageSize = 10;


var redisClient = tools.redisUserGroupClient();
redisClient.select(1, function () {
    console.log('用行为组查询 切换到 database 1');
});


function exit(msg) {
    console.log(msg);
    setTimeout(function () {
        process.exit(-1);
    }, 2000)
};

var findGroups = function () {
    Groups.find({}, {}, {limit: pageSize, skip: page * pageSize}, function (err, docs) {
        async.eachSeries(docs, function (user, done) {
            if (err) {
                console.log(err);
                exit(err);
            } else {
                addGroupUser(user, function (data) {
                });
                done(null);
            }
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                if (docs.length < 10) {
                    console.log('update success')
                    return;
                }
                console.log(page);
                page += 1;
                findGroups();
            }
        });
    })
}


var addGroupUser = function (doc, callback) {
//    console.log(doc);
    var msgArray = [];
    var wxToken = doc.wxToken;
    var groupId = doc._id;
    var openIds = doc.openIds;
    var activity = doc.activity;
    var title = doc.key;
    var result = '';
//    console.log('--------groupId------------',groupId);
//    console.log('--------openIds------------',openIds);
    async.eachSeries(openIds, function (_openId, done) {
        addGroupUserIds(groupId, _openId, function (data) {
            if (data) {
                var redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title;
                setKey(redisKey, function (data) {
                });
                if (result && result != 'undefined') {
                    redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title + ':' + result;
                    setKey(redisKey, function (data) {
                    });
                }
                msgArray.push({openId: _openId, status: 'success'});
            } else {
                msgArray.push({openId: _openId, status: 'failed'});
            }
            done(null);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log(msgArray);
    callback(null);
};


var setKey = function (redisKey, callback) {
    var number = new moment().valueOf().toString();
    redisClient.set(redisKey, number, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback(reply);
        }
    });
};

var addGroupUserIds = function (groupId, openId, callback) {
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
                    callback(data._id);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(doc._id);
        }
    });
};

var findBehavior = function (wxToken, description, behavior, result, callback) {
    if (wxToken) {
        var page = 1;
        var pagecount = 1000;
        var skipcount = 0;
        var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
        var condition = {};
        condition.wxToken = wxToken;
        if (description) {
            condition.description = description;
        }
        if (behavior) {
            condition.behavior = behavior;
        }
        if (result) {
            condition.result = result;
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
                callback(docs);
            });
    } else {
        console.log('wxToken is null');
        callback(null);
    }
};

var saveGroupUser = function (doc,openIds, callback) {
    var msgArray = [];
    var wxToken = doc.wxToken;
    var groupId = doc._id;
    var activity = doc.activity;
    var title = doc.key;
    var result = '';
    async.eachSeries(openIds, function (_openId, done) {
        addGroupUserIds(groupId, _openId, function (data) {
            if (data) {
                var redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title;
                setKey(redisKey, function (data) {
                });
                if (result && result != 'undefined') {
                    redisKey = 'USERGROUP:' + wxToken + ':' + _openId + ':' + activity + ':' + title + ':' + result;
                    setKey(redisKey, function (data) {
                    });
                }
                msgArray.push({openId: _openId, status: 'success'});
            } else {
                msgArray.push({openId: _openId, status: 'failed'});
            }
            done(null);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        }
        callback(msgArray);
    });
};

var delGroups = function(){
    var wxToken = 'c1a5961bbc14';
    var activity = '报名';
    var keys = ['报名','报名成功','观众二维码','嘉宾二维码','媒体二维码'];
    var condition = {
        wxToken:wxToken,
        activity:activity,
        key:{$nin:keys}
    };
    Groups.find(condition,function(err,docs){
        if(err){
            console.log(err);
        }else{
//            console.log(docs);
            _.each(docs,function(doc){
                switch (doc.key){
                    case '报名':
                    case '报名成功':
                    case '观众二维码':
                    case '嘉宾二维码':
                    case '媒体二维码':
                        console.log('过滤条件 error ',doc._id,doc.key);
                        break;
                    default :
//                        console.log(doc._id,doc.activity,doc.key);
                        Groups.findByIdAndRemove(doc._id,function(err,result){
                            if(err){
                                console.log(err);
                            }
                            if(!result){
                                console.log('Groups.findByIdAndRemove is null',doc._id);
                            }
                        });
                        break;
                }
            });
        }
    });
};

//var _id = '557da3bf22ee314c3500d07b';
var findGroupsById = function(_id,callback){
    console.log('findGroupsById  _id',_id);
    Groups.findById(_id,function(err,doc){
        if(err){
            console.log(err);
            callback(null);
        }else{
            callback(doc);
        }
    });
};


var run = function (){
    var groupId = '557da3bf22ee314c3500d07b';
    //groupId = '557e404905e8deff24003509'; //测试_id
    var wxToken='c1a5961bbc14';
    var  description='报名';
    var behavior='';
    var result='';
    findBehavior(wxToken, description, behavior, result, function(behaviorData){

        if(behaviorData){
            var openIds = _.pluck(behaviorData,'openId');
            openIds = _.uniq(openIds);
            console.log('openIds length',openIds.length);
            findGroupsById(groupId,function(doc){
                if(doc){
                    console.log('findGroupsById doc',doc);
                    saveGroupUser(doc,openIds,function(msgArray){
                        console.log(msgArray);
                    });
                }else{
                    console.log('findGroupsById is null');
                }
            })
        }else{
            console.log('findBehavior is null');
        }
    });
};

//run();
//delGroups();