/**
 * Created by chenjie on 2014/8/22.
 */
var fs = require('fs');
var request = require('superagent');
var config = require('../config');
var _ = require('underscore');
var httpUtils = require('./http-utils.js')

var tkConfig = require('../tokenConfig');

var dbUtils = require('../mongoSkin/mongoUtils.js')
var userCollection = new dbUtils('users')

var lastPusTime = null
exports.pushErrorMsg = function(msg){
    if (lastPusTime && new Date().getTime() - lastPusTime < 5 * 60 * 1000){
        return
    }
    var url = 'http://mb.dev.tvm.cn/rest/wxpush?token=7fda67277f'
    var params = {
        content: 'mall_new:' + msg,
        weixin_token: 'tvmty',
        openids: 'oux1puBfVrHCUDnvqSIjwxh2NQ0Q,oux1puDSzhac5a6ybb6Lb5_kpf5o,oux1puPfwJlreyxMjr5UgI422Vnc,oux1puLQTi-bIwDTMHRih7dJceeU',
        weixin_type: 'text'
    };
    httpUtils.httpPost(url, params, function(err, response){
        lastPusTime = new Date().getTime();
    })
}

exports.getServerInfo = function (token, cb) {
    var url = config.userHost + "/rest/userbind?token=" + config.token + '&wx_token=' + token;
    httpUtils.httpGet(url, cb);
}

exports.getwxAccessToken = function(token, cb){
    var url = tkConfig.getAuthDomain(token) + '/rest/wxaccesstoken?token=' + config.token + '&weixin_token=' + token;
    httpUtils.httpGet(url, cb);
}

exports.getFollowUrl = function (token, cb) {
    var url = tkConfig.getWMHDomain(token) + "/api/wxinfo/info?token=" + token;
    httpUtils.httpGet(url, cb);
}

exports.getWxJsParam = function (token, cb) {
    var url = tkConfig.getAuthDomain(token) + "/rest/wxjsticket?token=" + config.token + '&wx_token=' + token;
    httpUtils.httpGet(url, cb);
}

exports.getUserInfo = function (token, openIds, cb) {
    if (!openIds) {
        cb('openId不存在');
    } else if (!_.isArray(openIds)) {
        openIds = [openIds]
    }
    openIds = _.uniq(openIds);
    var len = openIds.length;
    openIds = openIds.join(',')

    var url = tkConfig.getAuthDomain(token) + '/rest/PlatformUserinfo?token=' + config.token + '&wx_token=' + token + '&openid=' + openIds + '&limit=' + len;
    httpUtils.httpGet(url, cb);
}

exports.reacquireUsers = function (wxToken, openId, callback) {
    var _id = wxToken + '_' + openId;
    exports.getUserInfo(wxToken, openId, function(err, response){
        //console.log(response)
        if (err){
            callback(null)
        } else if (!response || !response.data || response.data.length != 1){
            callback(null)
        } else {
            var user = response.data[0]
            var userObj = {
                openId: openId,
                wxToken: wxToken,
                nickName: user.username || '',
                headImg: user.weixin_avatar_url || '',
                city: user.city || '',
                province: user.province,
                country: user.country,
                subscribe_time: user.add_time || '',
                unionid: user.unionid || '',
                sex: user.sex,
                source: user.source,
                weixin_avatar_url: user.weixin_avatar_url,
                username: user.username,
                nickname: user.nickname
            };

            if (user.source == '1'){
                userObj.status = 'subscribe'
            } else if (user.source == '3'){
                userObj.status = 'unsubscribe'
            } else {
                userObj.status = 'authorize'
            }
            callback(userObj);

            console.log('save user')
            userCollection.findById(_id, function(err, o){
                if (err){
                    console.log('find user error')
                } else if (!o){
                    userObj._id = _id
                    insertUser();
                } else {
                    updateUser();
                }
            })

            var insertUser = function(){
                console.log('insertUser')
                userObj.dateTime = new Date();
                userCollection.save(userObj, function(err, o){
                    if (err){
                        console.log('save user(insertUser) failed:', err,userObj)
                    } else if (!o){
                        console.log('save user(insertUser) success:', err,userObj)
                    } else {

                    }
                })
            }

            var updateUser = function(){
                console.log('updateUser')
                userCollection.updateById(_id, {$set: userObj}, function(err, o){
                    if (err){
                        console.log('save user(updateUser) failed:', err,userObj)
                    } else if (!o){
                        console.log('save user(updateUser) success:', err,userObj)
                    } else {
                    }
                })
            }
        }
    })
};

exports.postwxTemplate = function(url, params, cb){
    httpUtils.postHttpNoEncoded(url, params, cb)
}