/**
 *
 * 用户组相关处理
 *
 * Created by nice on 2014/9/5.
 */

var moment = require('moment');
var URL = require('url');

var models = require('../models/index');
var Groups = models.Groups;
var Behavior = models.Behavior;
var GroupUsers = models.GroupUsers;
var Users = models.UsersPoint;
var GroupUserIds = models.GroupUserIds;

var _ = require('underscore');
var async = require('async');
var utils = require('./utils');
var tools = require('../tools');

var wxInfo = require('./wxInfo');

var interface = require('../interface');
var config = require('../config.js');
var tkConfig = require('../tokenConfig.js');
var wmhUrl = config.wmhUrl;
var userHost = config.userHost;
var wmhUrlUS = config.wmhUrlUS;

var userGroup = require('./userGroup');


var redisClient = tools.redisClient();
redisClient.select(11, function () {
    console.log('用户行为分组 切换到 database 11');
});

var redisUserGroupClient = tools.redisUserGroupClient();
redisUserGroupClient.select(1, function () {
    console.log('用行为组查询 切换到 database 1');
});

exports.index = function (req, res) {
    var wxToken = req.session.token;
    var _id = req.query.id || '';
    if (wxToken) {
        getGroups(wxToken, function (groups) {
            var groupData = [];
            var openids = [];
            var dataArray = [];
            var i = 0;
            var pages = 0;
            if (groups && groups.length > 0) {
                countGroupUser(groups, function (groupUser) {
                    groupData = groupUser;
                    var len = groupUser.length;
                    if (_id) {
                        for (var i = 0; i < len; i++) {
                            if (groupUser[i]._id == _id) {
                                pages = Math.ceil(( groupUser[i].number) / 10);
                                break;
                            }
                        }
                    } else {
                        _id = groupUser[0]._id;
                        pages = Math.ceil(( groupUser[0].number) / 10);
                    }
                    _.each(groupUser, function (doc) {
                        if (_id && doc._id == _id) {

                            return false;
                        } else {

                        }
                    });
                    if (!_id) {
                        _id = groups[0]._id;
                    }
                    if (pages == 0) {
                        pages = 1;
                    }
                    queryGroupUserIds(wxToken, _id, 1, 10, function (data) {
                        if (data.status == 'success') {
                            dataArray = data.data;
                        }
                        res.render('groups', {
                            layout: false,
                            wxToken: wxToken,
                            dataArray: dataArray,
                            groups: groupData,
                            pages: pages,
                            wxToken: wxToken,
                            id: _id
                        });
                    });
                });
            } else {
                res.send('您还没创建分组、请点击菜单行为分析、创建分组');
            }
        });
    } else {
        res.send('身份验证不合法');
    }
};

exports.groups = function (req, res) {
    var groupsId = req.query.id || '';
    var wxToken = req.session.token;
    if (wxToken) {
        res.render('groups-list', {
            layout: false,
            groupsId: groupsId
        });
    } else {
        res.send('身份验证不合法');
    }
};

/**
 * 创建组并更新组
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    if (body && body != 'undefined') {
        if (body.groupName && body.wxToken) {
            var groupName = body.groupName || '';
            var wxToken = body.wxToken || '';
            var nickName = body.nickName || '';
            var behavior = body.behavior || '';
            var description = body.description || '';
            var result = body.result || '';
            var area = body.area || '';
            var startTime = body.startTime || '';
            var lastTime = body.lastTime || '';
            var activity = '自定义';
            Groups.findOne({wxToken: wxToken, key: groupName, activity: activity}, {key: 1, wxToken: 1, openIds: 1}, function (err, groupsInfo) {
                if (err) {
                    console.log(err);
                    res.send({status: 'failed', msg: 'mongodb error', db: 'Groups.findOne'});
                } else {
                    if (!groupsInfo) {
                        var group = new Groups({
                            key: groupName,
                            wxToken: wxToken,
                            activity: activity,
                            updateTime: dateTime
                        });
                        group.save(function (err, doc) {
                            if (err) {
                                console.log(err);
                                res.send({status: 'failed', msg: 'mongodb error', db: 'group.save'});
                            } else {
                                if (doc) {
                                    var groupId = doc._id;
                                    getCondition(wxToken,behavior, description, result, nickName, area, startTime, lastTime,function(condition){
                                        var redisKey = 'GROUPS:' + wxToken + ':' + groupId;
                                        findBehaviorAndSaveUser(redisKey, wxToken, condition, function (data) {
                                            if (data && data.status === 'success') {
                                                getUserByRedis(redisKey, function (reply) {
                                                    if (reply && reply.status === 'success') {
                                                        addGroupUser(wxToken, doc._id, reply.reply, function (groupUser) {
                                                            res.send({status: 'success', _id: doc._id});
                                                        });
                                                    } else {
                                                        res.send({status: 'failed', msg: 'redis error', db: 'getUserByRedis'});
                                                    }
                                                });
                                            } else {
                                                res.send({status: 'failed', msg: 'mongodb error', db: 'findBehaviorAndSaveUser'});
                                            }
                                        });
                                    });

                                } else {
                                    res.send({status: 'failed', code: 'M000', msg: '用户组创建失败，请重试'});
                                }
                            }
                        });
                    } else {
                        getCondition(wxToken,behavior, description, result, nickName, area, startTime, lastTime,function(condition){
                            var groupId = groupsInfo._id;
                            var redisKey = 'GROUPS:' + wxToken + ':' + groupId;
                            findBehaviorAndSaveUser(redisKey, wxToken, condition, function (data) {
                                if (data && data.status === 'success') {
                                    getUserByRedis(redisKey, function (reply) {
                                        if (reply && reply.status === 'success') {
                                            addGroupUser(wxToken, groupId, reply.reply, function (groupUser) {
                                                res.send({status: 'success', _id: groupId});
                                            });
                                        } else {
                                            res.send({status: 'failed', msg: 'redis error', db: 'getUserByRedis'});
                                        }
                                    });
                                } else {
                                    res.send({status: 'failed', msg: 'mongodb error', db: 'findBehaviorAndSaveUser'});
                                }
                            });
                        });

                    }
                }
            });
        } else {
            res.send({status: 'failed', msg: 'groupName、 wxtoken is null'});
        }
    } else {
        res.send({status: 'failed', msg: '格式不正确、头信息不是JSON'});
    }
};

var addGroupUser = function (wxToken, groupId, openIds, callback) {
    var msgArray = [];
    async.eachSeries(openIds, function (_openId, done) {
        userGroup.addGroupUserIds(groupId, _openId, function (data) {
            if (data) {
                msgArray.push({openId: _openId, status: 'success'});
            } else {
                msgArray.push({openId: _openId, status: 'failed'});
            }
            done(null);
        });
    }, function (err) {
        callback(msgArray);
    });
};


var getCondition = function (wxToken,behavior, description, result, nickName, area, startTime, lastTime,callback) {
    var condition = {};
    if (behavior) {
        if (behavior.indexOf(',') != -1) {
            var array = behavior.split(',');
            array = _.compact(array);
            condition.behavior = {$in: array};
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
//    if (nickName) {
//        var regNickName = new RegExp(nickName);
//        condition.nickName = regNickName;
//    }
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
            }
            callback(condition);
        });
    }else{
        callback(condition);
    }

    return condition;
};

exports.query = function (req, res) {
    var groupName = req.query.groupName || '';
    var activity = req.query.activity || '自定义';
    var wxToken = req.session.token;
    var fuzzy = req.query.fuzzy || 'NO';
    if (wxToken) {
        var condition = {wxToken: wxToken};
        condition.activity = activity;
        if (groupName) {
            if (fuzzy == 'NO') {
                condition.key = groupName;
            } else {
                var reg = new RegExp(groupName);
                condition.key = reg;
            }
        }
        Groups.find(condition, function (err, docs) {
            if (err) {
                res.send({status: 'failed', msg: 'mongodb error', db: 'Groups.find'});
            } else {
                if (docs) {
                    docs = utils.doc2Object(docs);
                    var data = [];
                    var i = 0;
                    _.each(docs, function (doc) {
                        data[i] = {
                            _id: doc._id,
                            key: doc.key,
                            number: doc.openIds.length,
                            createTime: moment(doc.createTime).format('YYYY-MM-DD HH:mm:ss')
                        };
                        i++;
                    });
                    res.send({status: 'success', data: data});
                } else {
                    res.send({status: 'success', data: []});
                }
            }
        });
    } else {
        res.send({status: 'failed', msg: '身份验证不合法'});
    }

};


exports.queryUser = function (req, res) {
    var wxToken = req.session.token;
    var _id = req.query.id || '';
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    Groups.findById(_id, {openIds: 0}, function (err, doc) {
        if (err) {
            console.log(err);
            res.send({status: 'success', msg: '数据库异常，请联系系统管理员'});
        } else {
            if (doc) {
                var condition = JSON.parse(doc.parameters);
                if (condition.nickName) {
                    condition.nickName = new RegExp(condition.nickName);
                }
                if (condition.area) {
                    condition.area = new RegExp(condition.area);
                }
                Behavior.find(condition)
                    .where()
                    .select({'__v': 0})
                    .limit(pagecount)
                    .skip(skip)
                    .sort({dateTime: -1})
                    .exec(function (err, docs) {
                        if (err) {
                            console.log(err);
                            res.send({status: 'failed', msg: 'mongodb 异常'});
                        } else {
                            if (docs) {
                                docs = utils.doc2Object(docs);
                                var ids = _.pluck(docs, 'openId');
                                findUserIds(wxToken, ids, function (list) {
                                    _.each(docs, function (doc) {
                                        if (list && list[doc.openId]) {
                                            doc.nickName = list[doc.openId].nickName;
                                            doc.headImg = list[doc.openId].headImg;
                                        } else {
                                            doc.nickName = '未知用户';
                                            doc.headImg = userHost + '/data/user_info/default.png';
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
                                    res.send({status: 'success', data: docs});
                                });
                            } else {
                                res.send({status: 'failed', data: []});
                            }
                        }
                    });
            } else {
                res.send({status: 'failed', data: [], msg: '查不到相关数据'});
            }
        }
    });
};

exports.groupAction = function (req, res) {
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    var wxToken = req.session.token;
    if (wxToken) {
        if (body && body.id && body.action) {
            var _id = body.id || '';
            var action = body.action || '';
            var groupName = body.groupName || '';
            if (action == 'del') {
                Groups.findById(_id,function(err,doc){
                    if (err) {
                        console.log(err);
                    }
                    if (doc) {
                        var wxToken = doc.wxToken;
                        var activity = doc.activity;
                        var key = doc.key;
                        delGroup(_id,wxToken,activity,key); //删除组内人员与redis缓存
                        Groups.findByIdAndRemove(_id, function (err, groups) {
                            if (err) {
                                console.log(err);
                            }
                            if (groups) {
                                var redisKey = 'GROUPID:' + doc.wxToken + ':' + doc.activity + ':' + doc.key;
                                redisUserGroupClient.del(redisKey, function (error, reply) {
                                    if(error){
                                        console.log(error);
                                    }
                                });
                                res.send({status: 'success'});
                            } else {
                                res.send({status: 'failed', msg: '操作失败，请重试'});
                            }
                        });
                    } else {
                        res.send({status: 'failed', msg: '查不到组（'+_id+'）信息'});
                    }
                });

            } else if (action == 'update') {
                Groups.findByIdAndUpdate(_id, {$set: {key: groupName}}, function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    if (doc) {
                        res.send({status: 'success'});
                    } else {
                        res.send({status: 'failed', msg: '操作失败，请重试'});
                    }
                });
            } else {
                res.send({status: 'failed', msg: 'action is illegal'});
            }
        } else {
            res.send({status: 'failed', msg: 'id or action is null'});
        }
    } else {
        res.send({status: 'failed', msg: '身份验证不合法'});
    }
};

function delGroup(_id,wxToken,activity,key){
    GroupUserIds.remove({groupId:_id},function(err,userIds){
        if (err) {
            console.log(err);
        }
        if(!userIds){
            console.log('GroupUserIds.findAndRemove 操作失败',{groupId:_id});
        }
    });

    var redisKey = 'USERGROUP:' + wxToken + '*' + activity + ':' + key + '*';
    delRedisKey(redisKey);
};

function getRedisKey(key,callback){
    redisUserGroupClient.keys(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback(reply);
        }
    });
}

function delRedisKey(key){
    getRedisKey(key,function(array){
        async.eachSeries(array, function (key, done) {
            redisUserGroupClient.del(key, function (error, reply) {
                if(error){
                    console.log(error);
                }
                if(!reply){
                    console.log('redisUserGroupClient 删除redis key error',key);
                }
            });
            done(null);
        }, function (err) {
            //console.log(err);
        });
    });
}


exports.groupChat = function (req, res) {
    var _id = req.query.id || '';
    var wxToken = req.session.token;
    if (_id && wxToken) {
        Groups.findById(_id, function (err, doc) {
            if (err) {
                console.log(err);
            }
            var groupName = '';
            if (doc) {
                groupName = doc.key;
            }
            res.render('group-chat', {
                layout: false,
                wxToken: wxToken,
                id: _id,
                groupName: groupName
            });
        });
    } else {
        res.send('id or wx_token is null');
    }
};

exports.Chat = function (req, res) {
    var openId = req.query.openId || '';
    var wxToken = req.session.token;
    if (wxToken && openId) {
        interface.getUserInfo(openId, wxToken, function (data) {
            if (data && data.data.data) {
                var nickName = data.data.data.username;
                var uid = data.data.data.uid || '';
                var chatUrl = '';
                if (wxToken == 'GZRG9IQ7') {
                    chatUrl = wmhUrlUS + '/rest/user/chart?p_userid=' + uid + '&openid=' + openId + '&username=' + nickName;
                } else {
                    chatUrl = tkConfig.getWMHDomain(wxToken) + '/rest/user/chart?p_userid=' + uid + '&openid=' + openId + '&username=' + nickName;
                }
                res.redirect(chatUrl);
            } else {
                res.send('查询用户信息失败');
            }
        });
    } else {
        res.send('openid or wx_token is null');
    }
};

exports.queryGroupUser = function (req, res) {
    var wxToken = req.session.token;
    var _id = req.query.id || '';
    var page = req.query.page || '0';
    var pagecount = req.query.pagecount || '10';
    page = parseInt(page);
    pagecount = parseInt(pagecount);
    var wxToken = req.session.token;
    if (wxToken && _id) {
        page = page + 1;
        queryGroupUserIds(wxToken, _id, page, pagecount, function (data) {
            res.send(data);
        });
    } else {
        res.send('id or wx_token is null');
    }
};

var queryGroupUserIds = function (wxToken, groupId, page, pagecount, callback) {
    var skipcount = 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    GroupUserIds.find()
        .where('groupId', groupId)
        .select({'__v': 0})
        .limit(pagecount)
        .skip(skip)
        .sort({dateTime: -1})
        .exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback({status: 'failed', msg: 'moongodb GroupUserIds is error'});
            } else {
                if (docs) {
                    GroupUserIds.count({groupId: groupId}, function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {
                            var page_count = 0;
                            if (count) {
                                page_count = Math.ceil(count / pagecount);
                            }
                            docs = utils.doc2Object(docs);
                            var ids = _.pluck(docs, 'openId');
                            findUserIds(wxToken, ids, function (list) {
                                _.each(docs, function (doc) {
                                    if (list && list[doc.openId]) {
                                        doc.nickName = list[doc.openId].nickName;
                                        doc.headImg = list[doc.openId].headImg;
                                    } else {
                                        doc.nickName = '未知用户';
                                        doc.headImg = userHost + '/data/user_info/default.png';
                                        ;
                                    }
                                    var dataTime = null;
                                    if (doc.time) {
                                        dataTime = new Date(doc.time);
                                    } else {
                                        dataTime = doc.dateTime;
                                    }
                                    doc.dateTime = moment(dataTime).format('YYYY-MM-DD HH:mm:ss');
                                });
                                callback({status: 'success', data: docs, pagecount: page_count});
                            });
                        }
                    });


                } else {
                    callback({status: 'failed', msg: '查询结果为空'});
                }
            }
        });
};


var delGroupUserId = function (groupId, openIds, callback) {
    var condition = {
        groupId: groupId,
        openId: {$in: openIds}
    }
    GroupUserIds.remove(condition, function (err, doc) {
        if (err) {
            console.log(err);
            return callback(null);
        }
        callback(doc);
    });
};

exports.graphic = function (req, res) {
    var _id = req.query.id || '';
    var type = req.query.type || '';
    var tuwen = req.query.tuwen || '1';
    var body = req.body;
    var wxToken = req.session.token;
    if (wxToken && _id) {
        if (body) {
            Groups.findById(_id, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    if (type == 'text') {
                        var message = body.content;
                        message = message.replace(/&nbsp;/g, ' ');
                        exports.pushMessageByGroup(wxToken, doc.activity, doc.key, message, 0, 50);
                        res.send({status: 'success'});
                    } else if (type == 'news') {
                        var array = body.parameters;
                        var articles = {
                            articles: array
                        };
                        exports.pushMessageNewsByGroup(wxToken, doc.activity, doc.key, articles, 0, 50);
                        res.send({status: 'success'});

                    } else {
                        res.send({status: 'failed', msg: 'type is error'});
                    }
                } else {
                    res.send({status: 'failed', msg: '查询结果为空'});
                }
            });
        } else {
            res.send('parameters is null');
        }
    } else {
        res.send('id or wx_token is null');
    }
};

exports.action = function (req, res) {
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    var wxToken = req.session.token;
    if (wxToken) {
        if (body && body != 'undefined') {
            if (body.id && body.parameters && body.action) {
                var _id = body.id;
                var parameters = body.parameters;
                var action = body.action;
                try {
                    if (action === 'add') {
                        var openIds = JSON.parse(parameters);
                        increaseGroupUser(_id, openIds, function (data) {
                            if (data) {
                                res.send({status: 'success'});
                            } else {
                                res.send({status: 'failed', msg: '操作失败，请重试'});
                            }
                        });
                    } else if (action === 'del') {
                        var openIds = JSON.parse(parameters);
                        if (openIds && openIds.length > 0) {
                            delGroupUserId(_id, openIds, function (data) {
                                if (data) {
                                    res.send({status: 'success'});
                                } else {
                                    res.send({status: 'failed', msg: '操作失败，请重试'});
                                }
                            });
                        } else {
                            res.send({status: 'failed', msg: '操作失败，请重试'});
                        }
//                        decreasingGroupUser(_id, openIds, function (data) {
//                            if (data) {
//                                res.send({status: 'success'});
//                            } else {
//                                res.send({status: 'failed', msg: '操作失败，请重试'});
//                            }
//                        });
                    } else if (action === 'update') {
                        var obj = JSON.parse(parameters);
                        if (obj && obj.groupName) {
                            updateGroupName(_id, wxToken, obj.groupName, function (data) {
                                res.send(data);
                            });
                        } else {
                            res.send({status: 'failed', msg: 'groupName is null'});
                        }
                    } else {
                        res.send({status: 'failed', msg: 'action 参数值不合法'});
                    }
                } catch (e) {
                    console.log(e);
                    res.send({status: 'failed', msg: 'parameters 转换JOSN失败'});
                }
            } else {
                res.send({status: 'failed', msg: '缺少参数 id or parameters、action'});
            }
        } else {
            res.send({status: 'failed', msg: '参数错误'});
        }
    } else {
        res.send({status: 'failed', msg: 'wx_token is null'});
    }
};

/**
 * 组用户增加
 * @param _id
 * @param openIds
 */
var increaseGroupUser = function (_id, openIds, callback) {
    Groups.findById(_id, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs) {
            _.each(openIds, function (openId) {
                docs.openIds.addToSet(openId);
            });
            docs.save(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    callback(doc);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    });
};
/**
 * 组用户递减
 * @param _id
 * @param openIds
 */
var decreasingGroupUser = function (_id, openIds, callback) {
    Groups.findById(_id, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs) {
            _.each(openIds, function (openId) {
                docs.openIds.pull(openId);
            });
            docs.save(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    callback(doc);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    });
};

var updateGroupName = function (_id, wxToken, groupName, callback) {
    var activity = '自定义';
    Groups.findOne({wxToken: wxToken, key: groupName, activity: activity}, {key: 1, wxToken: 1, openIds: 1}, function (err, groups) {
        if (err) {
            console.log(err);
        }
        if (groups) {
            callback({status: 'failed', msg: '组名称不能重复'});
        } else {
            Groups.findByIdAndUpdate(_id, {$set: {key: groupName}}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    callback({status: 'success'});
                } else {
                    callback({status: 'failed', msg: '更新失败，请重试'});
                }
            });
        }
    });
};

/**
 * 分页查询，入库redis（set）
 * @param redisKey
 * @param wxToken
 * @param condition
 * @param callback
 */
var findBehaviorAndSaveUser = function (redisKey, wxToken, condition, callback) {
    if (wxToken) {
        var page = 0;
        var pageSize = 1000;
        var findBehavior = function () {
            Behavior.find(condition)
                .where('wxToken', wxToken)
                .select({'__v': 0})
                .limit(pageSize)
                .skip(page * pageSize)
                .sort({dateTime: -1})
                .exec(function (err, docs) {
                    if (err) {
                        console.log(err);
                        callback(null);
                    } else {
                        async.eachSeries(docs, function (user, done) {
                            var openId = user.openId;
                            addUserByRedis(redisKey, openId, function (data) {
                            });
                            done(null);
                        }, function (err) {
                            if (err) {
                                console.log(err);
                                callback(null);
                            } else {
                                if (docs.length < 1000) {
                                    redisClient.expire(redisKey, 1800);
                                    callback({status: 'success'});
                                    return;
                                } else {
                                    page += 1;
                                    findBehavior();
                                }
                            }
                        });
                    }
                });
        };
        findBehavior();
    } else {
        callback(null);
    }
};


var addUserByRedis = function (key, openId, callback) {
    redisClient.sadd(key, openId, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback({status: 'success', reply: reply});
        }
    });
};

var getUserByRedis = function (key, callback) {
    redisClient.smembers(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback({status: 'success', reply: reply});
        }
    });
};

var redisKeyExists = function (key, callback) {
    redisClient.exists(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback(reply);
        }
    });
};


var protectionGroupUser = function (_id, redisKey) {
    Groups.findById(_id, {openIds: 1}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc.openIds && doc.openIds.length === 0) {
                getUserByRedis(redisKey, function (reply) {
                    if (reply && reply.status === 'success') {
                        Groups.findByIdAndUpdate(doc._id, {openIds: reply.reply}, function (err, updateDoc) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        }
    })
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

/**
 * 根据ids 获取昵称 头像
 * @param wxToken
 * @param openIds
 * @param callback
 */
var findUserIds = function (wxToken, openIds, callback) {
    var condition = {
        openId: {$in: openIds}
    };
    condition.wxToken = wxToken;
    Users.find(condition, function (err, users) {
        if (err) {
            console.log(err);
            return callback({});
        }
        if (!users || users.length == 0) {
            return callback({});
        }
        var friendMap = {};
        _.each(users, function (users) {
            friendMap[users.openId] = users;
        });
        callback(friendMap);
    })
};

/**
 * 获取组信息
 * @param callback
 */
var getGroups = function (wxToken, callback) {
    var condition = {
        // activity: '自定义',
        wxToken: wxToken
    };
    Groups.find(condition)
        .where()
        .select()
        .sort({createTime: -1})
        .exec(function (err, docs) {
            if (err) {
                console.log(err);
            }
            if (docs) {
                docs = utils.doc2Object(docs);
                callback(docs);
            } else {
                callback([]);
            }
        });
};

var countGroupUser = function (groups, callback) {
    var array = [];
    async.eachSeries(groups, function (group, done) {
        var _id = group._id;
        var key = group.key;
        var activity = group.activity;
        GroupUserIds.count({groupId: _id}, function (err, count) {
            if (err) {
                console.log(err);
            } else {
                var number = 0;
                if (count) {
                    number = count;
                }
                array.push({
                    _id: _id,
                    key: key,
                    activity: activity,
                    number: number
                });
            }
            done(null);
        });
    }, function (err) {
        callback(array);
    });
};


/**
 * 更新用户信息
 * @param wxToken
 * @param openId
 * @param callback
 */
var updateUser = function (wxToken, openId, callback) {
    var _id = tools.joinId(wxToken, openId);
    Users.findById(_id, {openId: 1, nickName: 1, headImg: 1}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc) {
            if (doc.nickName == '' || doc.nickName == 'Guest' || doc.nickName == 'Gest') {
                interface.getUserInfo(openId, wxToken, function (info) {
                    if (info && info.data.data) {
                        Users.findByIdAndUpdate(_id, {$set: {nickName: info.data.data.username, headImg: info.data.data.weixin_avatar_url}}, function (err, user) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
            callback(doc);
        } else {
            wxInfo.reacquireUsers(wxToken, openId, function (data) {
                callback(data);
            });
        }
    });
}

var queryGroupUserLottery = exports.queryGroupUserLottery = function (wxToken, activity, key, page, pagecount, callback) {
    var skipcount = 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    Groups.findOne({wxToken: wxToken, activity: activity, key: key}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc) {
            var groupId = doc._id;
            GroupUserIds.find()
                .where('groupId', groupId)
                .select({'__v': 0})
                .limit(pagecount)
                .skip(skip)
                .sort({dateTime: -1})
                .exec(function (err, docs) {
                    if (err) {
                        console.log(err);
                        callback([]);
                    } else {
                        if (docs) {
                            docs = utils.doc2Object(docs);
                            var ids = _.pluck(docs, 'openId');
                            callback(ids);
                        } else {
                            callback([]);
                        }
                    }
                });
        } else {
            callback([]);
        }
    });
};

exports.ifOpenIdExist = function (token, activity, key, openId, done) {
    Groups.findOne({wxToken: token, activity: activity, key: key}, {_id: 1}, function (err, doc) {
        if (err) {
            console.log(err);
            done({status: 'fail'});
        } else {
            if (doc) {
                var groupId = doc._id;
                GroupUserIds.findOne({groupId: groupId, openId: openId}, function (err, doc) {
                    if (err) {
                        console.log(err);
                        done({status: 'fail'});
                    } else if (doc) {
                        done({status: 'success'});
                    } else {
                        done({status: 'fail'});
                    }
                });
            } else {
                done({status: 'fail'});
            }
        }
    });
};

exports.getOpenIdsByTag = function (token, activity, key, page, pageSize, done) {
    Groups.findOne({wxToken: token, activity: activity, key: key}, {_id: 1}, function (err, doc) {
        if (err) {
            console.log(err);
            done([]);
        } else {
            if (doc) {
                var groupId = doc._id;
                exports.getOpenIdsByGroupId(groupId, page, pageSize, done)
            } else {
                done([]);
            }
        }
    });
};

exports.getGroupId = function (token, activity, key, done) {
    Groups.findOne({wxToken: token, activity: activity, key: key}, {_id: 1}, function (err, doc) {
        if (err) {
            console.log(err);
            done(null);
        } else {
            if (doc) {
                var groupId = doc._id;
                done(groupId)
            } else {
                done(null);
            }
        }
    });
};

exports.getOpenIdsByGroupId = function (groupId, page, pageSize, done) {
    var options = {};
    if (pageSize) {
        options = {skip: page * pageSize, limit: pageSize}
    }
    GroupUserIds.find({groupId: groupId}, {openId: 1}, options, function (err, docs) {
        if (err) {
            console.log(err);
            done([]);
        } else {
            var openIds = _.pluck(docs, 'openId');
            openIds = _.flatten(openIds);
            openIds = _.uniq(openIds);
            done(openIds)
        }
    });
};

exports.pushMessageByGroup = function (token, activity, key, message, page, pageSize) {
//    var findOpenIds = function () {
//        exports.getOpenIdsByTag(token, activity, key, page, pageSize, function (openIds) {
//            if (openIds && openIds.length > 0) {
//                interface.pushMessage(token, openIds, message, function (err,reqponse) {
//                    findOpenIds(page++);
//                    console.log('组用户发送文本(pushMessage)返回信息', reqponse);
//                });
//            }
//        });
//    };
//    findOpenIds();

    var findOpenIds = function (groupId) {
        exports.getOpenIdsByGroupId(groupId, page, pageSize, function (openIds) {
            if (openIds && openIds.length > 0) {
                interface.pushMessage(token, openIds, message, function (err,reqponse) {
                    console.log('组用户发送文本(pushMessage)返回信息',groupId, reqponse);
                });
//                console.log('组用户发送文本(pushMessage)返回信息', page);
                console.log('pushMessage:'+groupId,page,openIds.length);
                page++;
                findOpenIds(groupId);
            }
        });
    };
    exports.getGroupId(token, activity, key, function (groupId) {
        if(groupId){
            console.log('pushMessage groupId:',groupId);
            findOpenIds(groupId);
        }else{
            console.log('----------查询组信息失败----------',{
                token:token,
                activity:activity,
                key:key
            });
        }
    });
};

exports.pushMessageNewsByGroup = function (token, activity, key, articles, page, pageSize) {
//    var findOpenIds = function () {
//        exports.getOpenIdsByTag(token, activity, key, page, pageSize, function (openIds) {
//            if (openIds && openIds.length > 0) {
//                interface.pushMessageNews(token, openIds, articles, function (err,reqponse) {
//                    findOpenIds(page++);
//                    console.log('组用户发送图文(pushMessageNews)返回信息', reqponse);
//                });
//            }
//        });
//    }
//    findOpenIds();

    var findOpenIds = function (groupId) {
        exports.getOpenIdsByGroupId(groupId, page, pageSize, function (openIds) {
            if (openIds && openIds.length > 0) {
                interface.pushMessageNews(token, openIds, articles, function (err,reqponse) {
                    console.log('组用户发送图文(pushMessageNews)返回信息',groupId, reqponse);
                });
//                console.log('组用户发送图文(pushMessageNews)返回信息', page);
                console.log('pushMessageNews:'+groupId,page,openIds.length);
                page++;
                findOpenIds(groupId);
            }
        });
    };
    exports.getGroupId(token, activity, key, function (groupId) {
        if(groupId){
            console.log('pushMessageNews groupId:',groupId);
            findOpenIds(groupId);
        }else{
            console.log('----------查询组信息失败----------',{
                token:token,
                activity:activity,
                key:key
            });
        }
    });

}