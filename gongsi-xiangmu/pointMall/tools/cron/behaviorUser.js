/**
 * Created by zwb on 2015/3/27.
 */
process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});


var _ = require('underscore');
var async = require('async');

var fs = require('fs');

var moment = require('moment');
var URL = require('url');

var models = require('../../models/index');
var Behavior = models.Behavior;
var Users = models.UsersPoint;


var utils = require('../../routes/utils');
var tools = require('../../tools');


var redisClient = tools.redisUserGroupClient();
redisClient.select(3, function () {
    console.log('用户行为摇一摇数据 切换到 database 3');
});


var CronJob = require('cron').CronJob;

var tokenArray = [];
tokenArray.push('3a59f7a4b8b28dca');/* cctv5 */
tokenArray.push('8e8c547795a5fe3c');/* 央视文艺 */

function start(){
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var minutes = 50;
    var startTime = new Date();
    var lastTime = new Date(new Date().getTime() - minutes * 60 * 1000);
    var limit = 5;

    for(var i =0 ; i<tokenArray.length;i++){
        var _token = tokenArray[i];
        console.log(time,_token);
        makefile(_token,startTime, lastTime, limit);
    }
}

function makefile (wxToken, startTime, lastTime, limit){

    getBehaviorData(wxToken, startTime, lastTime, limit, function(data){
        if(data && data.length>0){
            var behaviors = _.pluck(data,'_id');
            findBehaviorData(wxToken,behaviors,function(chunk){
                var fileName = '/mnt/bhlist/'+wxToken+'.js';
                var content = [];
                if(chunk && chunk.length>0){
                    content =JSON.stringify(chunk);
                    content = 'BehaviorList('+content+')';
                    fs.writeFile(fileName, content, function (err) {
                        if (err){
                            console.log(err);
                        }
                    });
                }else{
                    fs.exists(fileName, function (exists) {
                        if(!exists){
                            content = 'BehaviorList('+content+')';
                            fs.writeFile(fileName, content, function (err) {
                                if (err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                    console.log(' findBehaviorData Data is empty');
                }
            });
        }else{
            console.log('Sequence Behavior by Data is empty');
        }
    });

}



function getBehaviorData(wxToken, startTime, lastTime, limit, callback) {
    var matchCondition = {
        wxToken: wxToken,
        dateTime: {'$gte':lastTime , '$lte': startTime }
    };
    var groupCondition = {
        _id: '$behavior',
        count: {$sum: 1}
    };
    console.log('matchCondition',matchCondition);
    console.log('groupCondition',groupCondition);
    Behavior.aggregate({$match: matchCondition}, {$group: groupCondition}, {$sort: {count: -1}}, {$limit: limit}, function (err, docs) {
        if (err) {
            console.log(err);
            callback([]);
        } else {
            callback(docs);
        }
    });
}

/**
 * 查询用户信息
 * @type {findUsers}
 */
var findUsers = exports.findUsers = function (wxToken,openIds, callback) {
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
        callback(friendMap);
    })
};

function findBehaviorData(wxToken, behavior, callback) {
    var limit = 50;
    var condition = {wxToken: wxToken, behavior: {$in:behavior}};
    Behavior.find(condition, {}, {sort: {dateTime: -1}, limit: limit}, function (err, docs) {
        if (err) {
            console.log(err);
            callback([]);
        } else {
            if (docs) {
                var dataArray = [];
                docs = utils.doc2Object(docs);
                var ids = _.pluck(docs, 'openId');
                ids = _.uniq(ids);
                findUsers(wxToken,ids, function (list) {
                    _.each(docs, function (doc) {
                        if (list && list[doc.openId]) {
                            doc.nickName = list[doc.openId].nickName;
                            doc.headImg = list[doc.openId].headImg;
                            doc.dateTime = moment(doc.dateTime).format('YYYY-MM-DD HH:mm:ss');
                            dataArray.push(doc);
                        }
                    });
                    callback(dataArray);
                });
            } else {
                callback([]);
            }
        }
    });
}


new CronJob('*/5 * * * *', function () {
    start();
}, null, true);



/* forever -l /opt/logs/groupuser/behaviorUser.log -a start /opt/pointMall/tools/cron/behaviorUser.js */