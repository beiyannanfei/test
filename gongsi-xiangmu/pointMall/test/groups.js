/**
 * Created by nice on 2014/9/24.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var UsersSchema = new Schema({
    //ID
    _id: {type: String, index: true},
    //微信ID
    openId: {type: String, index: true},
    //上级微信ID
    higherId: {type: String, default: '', index: true},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String, index: true},
    //积分 number 默认 0
    integral: {type: Number, default: 0},
    //昵称
    nickName: {type: String},
    //头像
    headImg: {type: String},
    //城市
    city: {type: String},
    //省份
    province: {type: String},
    //性别 0 代表女  1 代表男
    sex: {type: String},
    //时间
    subscribe_time: {type: String},
    //入库时间
    dateTime: {type: Date, default: Date.now}
});
mongoose.model('Users', UsersSchema);


var opts = {
    server: { poolSize: 20 },
    mongos: true
};
var str = 'mongodb://integral:integral@10.20.30.59:37017/pointMall,mongodb://integral:integral@10.20.30.60:37017/pointMall';
var dbc5 = mongoose.createConnection(str, opts, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});

var usersc5 = dbc5.model('Users');








var models = require('../models/index');
var Groups = models.Groups;

var _ = require('underscore');
var async = require('async');

var tools = require('../tools');


var redisClient = tools.redisClient();
redisClient.select(11, function () {
    console.log('用户行为分组 切换到 database 11');
});

var wxToken = '3a59f7a4b8b28dca';


var saveGroup = function (){
    var groupName = 'cctv5';
    var group = Groups({
        key: groupName,
        wxToken: wxToken
    });
    group.save(function (err, doc) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            if (doc) {
                start(doc._id);
            }else{
                console.log('----------group.save----------')
            }
        }
    });
}

var start = function(groupId){
    var redisKey = 'GROUPS:' + wxToken + ':' + groupId
    var condition ={};
    findBehaviorAndSaveUser(redisKey, wxToken, condition, function(data){
        if (data && data.status === 'success') {
            getUserByRedis(redisKey, function (reply) {
                if (reply && reply.status === 'success') {
                    condition.wxToken = wxToken;
                    if(condition.nickName){
                        condition.nickName=nickName;
                    }
                    if(condition.area){
                        condition.area=area;
                    }
                    var parameters = JSON.stringify(condition);
                    Groups.findByIdAndUpdate(doc._id,{$set:{openIds:reply.reply,parameters:parameters}},function (err, updateDoc) {
                        if (err) {
                            console.log(err);
                        }else{
                            if (updateDoc) {
                                console.log('-------------------success---------------------',updateDoc._id);
                            } else {
                                console.log({status: 'failed', code: 'M000', msg: '组用户信息添加失败，请重试'});
                            }
                        }
                    });
                } else {
                    console.log({status: 'failed', msg: 'redis error', db: 'getUserByRedis'});
                }
            });
        } else {
            console.log({status: 'failed', msg: 'mongodb error', db: 'findBehaviorAndSaveUser'});
        }
    });
}



var findBehaviorAndSaveUser = function (redisKey, wxToken, condition, callback) {
    if (wxToken) {
        var page = 0;
        var pageSize = 1000;
        var findBehavior = function () {
            usersc5.find(condition)
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
                                    console.log('page = ',page);
                                    findBehavior();
                                }
                            }
                        });
                    }
                });
        }
        findBehavior();
    } else {
        callback(null);
    }
}



var addUserByRedis = function (key, openId, callback) {
    redisClient.sadd(key, openId, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback({status: 'success', reply: reply});
        }
    });
}

var getUserByRedis = function (key, callback) {
    redisClient.smembers(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback({status: 'success', reply: reply});
        }
    });
}

var redisKeyExists = function (key, callback) {
    redisClient.exists(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
            callback(reply);
        }
    });
}



//saveGroup();

// 54229bdd6ba0158f4e000004
var sava = function (){
    var condition = {};
    var redisKey = 'GROUPS:' + wxToken + ':54229bdd6ba0158f4e000004';
    getUserByRedis(redisKey, function (reply) {
        if (reply && reply.status === 'success') {
            condition.wxToken = wxToken;
            if(condition.nickName){
                condition.nickName=nickName;
            }
            if(condition.area){
                condition.area=area;
            }
            var parameters = JSON.stringify(condition);
            Groups.findByIdAndUpdate('54229bdd6ba0158f4e000004',{$set:{openIds:reply.reply,parameters:parameters}},function (err, updateDoc) {
                if (err) {
                    console.log(err);
                }else{
                    if (updateDoc) {
                        console.log('-------------------success---------------------',updateDoc._id);
                    } else {
                        console.log({status: 'failed', code: 'M000', msg: '组用户信息添加失败，请重试'});
                    }
                }
            });
        } else {
            console.log({status: 'failed', msg: 'redis error', db: 'getUserByRedis'});
        }
    });
}

sava();