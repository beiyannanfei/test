/**
 * Created by zwb on 2014/12/29.
 */


process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});


var _ = require('underscore');
var async = require('async');


var moment = require('moment');
var URL = require('url');

var models = require('../../models/index');
var Behavior = models.Behavior;
var Groups = models.Groups;
var GroupUsers = models.GroupUsers;
var Users = models.UsersPoint;
var GroupUserIds = models.GroupUserIds;


var utils = require('../../routes/utils');
var tools = require('../../tools');

var interface = require('../../interface');


var redisClient = tools.redisUserGroupClient();
redisClient.select(1, function () {
    console.log('用行为组查询 切换到 database 1');
});


var client = tools.redisUserGroupClient();
client.select(0, function () {
    console.log('查询队列 redis 行为入库 切换到 database 0');
});


var CronJob = require('cron').CronJob;

function readRedisKey() {
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    console.log(time);
    var redisKey = 'UserBehavior:GroupList';
    lpopGroup(redisKey);
    rpopGroup(redisKey);
}


var lpopGroup = function (key) {

    getLen(key, 'lpopGroup', function (len) {
        if (len && len > 0) {
            for (var i = 0; i < 1000; i++) {
                client.lpop(key, function (error, reply) {
                    if (error) {
                        console.log(error);
                    }
                    if (reply) {
                        console.log('lpopGroup------------reply--------------',reply);
                        try {
                            var obj = JSON.parse(reply);
//                            console.log('JSON.parse',obj);
                            if (obj.wxToken && obj.wxToken != 'undefined' && obj.activity && obj.activity != 'undefined' && obj.title && obj.title != 'undefined') {
                                addGroupUser(obj, function (group) {
                                    if (group && group.status == 'success') {
                                        console.log(group.status);
                                    } else {
                                        client.lpush(key, reply, function (error, data) {
                                            if (error) {
                                                console.log(error);
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('------------参数不正确--------------');
                                console.log(reply);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        }
    });
};


var rpopGroup = function (key) {
    getLen(key, 'rpopGroup', function (len) {
        if (len && len > 0) {
            for (var i = 0; i < 1000; i++) {
                client.rpop(key, function (error, reply) {
                    if (error) {
                        console.log(error);
                    }
                    if (reply) {
                        console.log('rpopGroup------------reply--------------',reply);
                        try {
                            var obj = JSON.parse(reply);
//                            console.log('JSON.parse',obj);
                            if (obj.wxToken && obj.wxToken != 'undefined' && obj.activity && obj.activity != 'undefined' && obj.title && obj.title != 'undefined') {
                                addGroupUser(obj, function (group) {
                                    if (group && group.status == 'success') {
                                        console.log(group.status);
                                    } else {
                                        client.rpush(key, reply, function (error, data) {
                                            if (error) {
                                                console.log(error);
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('------------参数不正确--------------');
                                console.log(reply);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        }
    });
};


var addGroupUser = function (obj, callback) {
    var activity = obj.activity || '';
    var wxToken = obj.wxToken;
    var title = obj.title || '';
    var openId = obj.openId;
    var result = obj.result || '';
    console.log('--------------addGroupUser-----------');
    console.log(activity,title,result);
    if (!wxToken || !openId || !activity || !title) {
        return;
    } else {
        //    console.time('addBehavior');
        addBehavior({
            wxToken: wxToken,
            behavior: title,
            description: activity,
            result: result
        }, openId);
//    console.timeEnd('addBehavior');
        addGroup(wxToken, activity, title, result, function (groups) {
            if (groups) {
                var groupId = groups._id;
//            console.time('addGroupUser');
                setGroupUser(wxToken, groupId, openId, activity, title, result, function (data) {
//                console.timeEnd('addGroupUser');
                    callback({status: 'success', data: data});
                });
            } else {
                callback({status: 'failed'});
            }
        });
    }
};

var setGroupUser = function (wxToken, groupId, openId, activity, title, result, callback) {
//    console.time('addGroupUserIds');
    addGroupUserIds(groupId, openId, function (data) {
        if (data) {
//            console.time('addGroupUserIds redis');
            var redisKey = 'USERGROUP:' + wxToken + ':' + openId + ':' + activity + ':' + title;
            var number = new moment().valueOf().toString();
            setKey(redisKey, number, function (data) {
            });
            if (result && result != 'undefined') {
                redisKey = 'USERGROUP:' + wxToken + ':' + openId + ':' + activity + ':' + title + ':' + result;
                setKey(redisKey, number, function (data) {
                });
            }
//            console.timeEnd('addGroupUserIds redis');
            callback({openId: openId, status: 'success'});
        } else {
//            console.timeEnd('addGroupUserIds');
            callback({openId: openId, status: 'failed'});
        }
    });
};


var addGroup = function (wxToken, activity, title, result, callback) {
    var dateTime = new moment().valueOf().toString();
    var redisKey = 'GROUPID:' + wxToken + ':' + activity + ':' + title;

    var addGroupsResult = function(_id,result){
        Groups.findByIdAndUpdate(_id,{$addToSet:{results:result}},function(err,doc){
            if(err){
                console.log(err);
            }
        });
    };

//    console.time('redisClient get');
    redisClient.get(redisKey, function (error, replyData) {
        if (error) {
            console.log(error);
        }
//        console.timeEnd('redisClient get');
        if (replyData) {
            if(result && result!='undefined'){
                addGroupsResult(replyData,result);
            }
            callback({_id: replyData});
        } else {
//            console.time('Groups.findOne');
            Groups.findOne({wxToken: wxToken, activity: activity, key: title}, {_id: 1}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
//                    console.timeEnd('Groups.findOne');
                    setKey(redisKey, doc._id, function (data) {
                        redisClient.expire(redisKey, 60 * 60 * 24);
                    });
                    if(result && result!='undefined'){
                        addGroupsResult(replyData,result);
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
//                        console.timeEnd('Groups.findOne');
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
};

var addBehavior = function (obj,openId) {
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

var addGroupUserIds = function (groupId, openId, callback) {
    var redisKey = 'GroupUserIds:' + groupId + ':' + openId;
//    console.time('addGroupUserIds One');
//    console.time('addGroupUserIds One redis');
    redisClient.get(redisKey, function (error, reply) {
        if (error) {
            console.log(error);
        }
        if (reply) {
//            console.time('addGroupUserIds One redis');
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
//                            console.timeEnd('addGroupUserIds One');
                            callback(data._id);
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    setKey(redisKey, doc._id, function (data) {
                        redisClient.expire(redisKey, 60 * 60 * 24);
                    });
//                    console.timeEnd('addGroupUserIds One');
                    callback(doc._id);
                }
            });
        }
    });
};


var getLen = function (key, name, callback) {
    client.llen(key, function (error, len) {
        if (error) {
            console.log(error);
        }
        console.log('---------------' + name, key, len);
        if (len) {
            callback(len);
        } else {
            callback(null);
        }
    });
}


var writeRedis = function () {
    var redisKey = 'UserBehavior:GroupList';
    var array = [];
    for (var i = 0; i < 1; i++) {
        array.push({"openId":"o_AoFj7bo9a4OsryuMADcra65NO4","wxToken":"3a59f7a4b8b28dca","activity":"我承诺","title":"贴标签","result":"抢票"})
    }
    _.each(array, function (arr) {
        var value = JSON.stringify(arr);
        client.rpush(redisKey, value, function (error, reply) {
            if (error) {
                console.log(error);
            }
        });
    });
    console.log('success');
};


new CronJob('*/1 * * * * *', function () {
    readRedisKey();
//    writeRedis();
}, null, true);
